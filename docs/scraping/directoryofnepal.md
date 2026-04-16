# Scraping Recon — directoryofnepal.com

**Prepared:** 2026-04-16
**Author:** A1 (reconnaissance agent)
**Scope:** survey only — no scraper code produced in this pass.

## Verdict: GO

- `robots.txt` allows `/` for all user-agents; only admin/internal paths disallowed.
- No linked Terms of Service page; privacy policy does not mention scraping, crawling, bots, or automation.
- Site is a public business directory actively soliciting discovery (the front page links directly into category listings and individual company pages from unauthenticated users).
- No cookie wall, no JS-rendered content required — pages are fully rendered server-side PHP HTML.

**Proposed fetch rate:** **0.5 req/s** (2 s between requests), single worker, with exponential backoff on 429/5xx. `robots.txt` is silent on `Crawl-delay`, so we apply our default polite rate. Re-evaluate if we see rate limiting in practice.

Fixtures saved:
- `scripts/scrape/directoryofnepal/fixtures/category.html` — Education category page 1 (`/category/591/education.html`)
- `scripts/scrape/directoryofnepal/fixtures/business.html` — Glow Skin & Dental Clinic (`/company/32565/glow-skin-dental-clinic.html`) — has 3 on-page reviews, useful for both detail and review parsing
- `scripts/scrape/directoryofnepal/fixtures/review.html` — the reviews section alone, isolated for unit tests

---

## 1. robots.txt

Fetched: `https://directoryofnepal.com/robots.txt` → 301 to `https://www.directoryofnepal.com/robots.txt` → 200.

```
User-agent: *
Disallow: /library/
Disallow: /sign-in
Disallow: /temp/
Disallow: /admin/
Disallow: /mcln/
Disallow: /admin/
Disallow: /autocomplete/
Disallow: /page-to-disallow
Allow: /

User-agent: Mediapartners-Google
Disallow: /admin/
Disallow: /autocomplete/
Allow: /

User-agent: Googlebot-Mobile
Disallow: /admin/
Disallow: /autocomplete/
Allow: /
```

- `Allow: /` for `*` is present — root is **not** disallowed. Only internal/admin paths are blocked.
- No `Crawl-delay` directive (for any agent).
- None of the disallowed paths overlap with category/company/class pages we care about.
- `www.` is the canonical host; requests to the apex redirect with 301 → `www.`. Scraper should either send requests to `www.directoryofnepal.com` directly or follow 301s.
- Relevant cookies: server sets `PHPSESSID` on `/`; we can ignore it (no auth gating required).

## 2. ToS / footer

- **No Terms of Service page linked** from the homepage footer or anywhere obvious. The footer only links About / Business Promotion / Privacy Policy / Advertise Here.
- **Privacy Policy** (`/about/3/privacy-policy.html`) makes no reference to scraping, crawling, automation, bots, or unauthorized access to public content. It only covers user data handling.
- Conclusion: no contractual bar on scraping public pages. Usual defensive posture still applies (polite rate, identify our bot, respect robots.txt).

## 3. URL map

All content lives under deterministic, numeric-ID-based URLs. The site has a three-level taxonomy: **class → category → company**.

| Layer | Pattern | Example |
|---|---|---|
| Category index (global) | `/browse-categories` | <https://www.directoryofnepal.com/browse-categories> |
| Class listing (top-level vertical) | `/class/{class_id}/{slug}.html` | `/class/205/education-training.html` |
| Category page 1 (businesses in a category) | `/category/{cat_id}/{slug}.html` | `/category/591/education.html` |
| Category page N (pagination) | `/category/{page}/{cat_id}/{slug}.html.html` | `/category/2/591/education.html.html` |
| Business detail | `/company/{company_id}/{slug}.html` | `/company/32565/glow-skin-dental-clinic.html` |
| Product detail (secondary) | `/product/{product_id}/{slug}.html` | `/product/38/helambu-gosaikunda-langtang-trek-trekking-in-2026.html` |
| Full business browser | `/browse_business_directory_of_nepal` | <https://www.directoryofnepal.com/browse_business_directory_of_nepal> |

Notes:
- The pagination URL really does double the `.html` suffix — `/category/{page}/...html.html`. Verified by fetching `/category/2/591/education.html.html` → HTTP 200 with the same layout. The first page is addressed without a page segment.
- The `Next » / Last »` anchors and numbered page buttons are in `div.paging_bar`. The page number in the URL corresponds to the 1-indexed page (first page = the pageless URL, second page = `category/2/...`).
- We drive the crawl from either (a) the `/browse-categories` index for a full category list, or (b) the per-class pages (`/class/{id}/...`) for a broader walk including subcategories. Both paths dead-end at `/category/{id}/...`.
- Categories expose a "Last »" link in the paginator, so we can extract `max_page` in one fetch per category.

## 4. DOM selectors — business detail page

Confirmed against `/company/32200/beyond-the-limits-treks.html`, `/company/33226/search-education-nepal.html`, `/company/32565/glow-skin-dental-clinic.html`.

The layout is label-driven: contact fields live in repeating `div.cmp-item` blocks where `div.param` holds the label and `div.val` holds the value. Match by label text.

| Field | Selector | Notes |
|---|---|---|
| Company ID | from URL path `/company/(\d+)/` or `input[name="dirid"]` value | Stable numeric primary key. |
| Name | `div.cname > h1` | Trailing ", <City>" often appended (e.g. "Beyond The Limits Treks, Kathmandu") — split on last comma if needed. |
| Address | `div.cmp-item#profile div.param` whose text starts with "Address:" | Single-line comma-delimited string ending with ", Nepal". |
| Short description / tagline | `div.profile > p` (inside `div.company_profile#profile`) | 1-3 sentences. |
| Lat/Lng | `a[onclick^="return openMapWindow"]` → first arg of `openMapWindow('lat,lng','company','address','district')` | Parse the onclick string. Absent when the business has no map pin. |
| Phone (mobile) | `div.cmp-item` whose `div.param` is "Contact Numbers (Mobile)" → `div.val a` text, or regex the `onclick="return openCallWindow('+977-...')"` | Multiple `<a>` tags in `div.val` when several numbers listed. |
| Phone (landline) | same pattern but `div.param` text is "Landline" | Not every business has one. |
| Fax | `div.param` = "Fax Number" → sibling `div.val` | Rare. |
| GPO Box | `div.param` = "GPO Box" → sibling `div.val` | Rare. |
| Website | `div.param` = "Website" → sibling `div.val a[href]` | Absolute URL. |
| Email | Usually absent on the public page (enquiry form used instead). Occasionally present as a labeled row or as a `mailto:` link — treat as optional. |
| Logo image | `span.clogo img[src]` (inside `div.company_profile div.flpart`) | Absolute URL under `/images/`. May be missing on businesses without uploaded logos. |
| Cover image / gallery | Not present on the pages sampled. Sites without logos render `div.deflogo` (a CSS initials placeholder) in listing pages, never a separate cover. Mark as **absent**. |
| Primary category | Breadcrumb: `div.breadbar > span > a[href*="/category/"]` (the one with `/category/`) | E.g. "Trek Agencies" for biz1. Also recoverable via the `h2` in the "Why these 10 ... are worth visiting?" banner whose anchor points to the category. |
| Parent class / top-level vertical | Breadcrumb: `div.breadbar > span > a[href*="/class/"]` | E.g. "Directory of Tours & Travel" → class 192. |
| Secondary categories | None per-business — each business appears to belong to exactly one `/category/` in the breadcrumb on the sample pages. The global class list in `ul.cat-list#myTopnav` is a site-wide nav, **not** per-business, so do not treat it as secondary categories. |
| View count | `span.subbox.views > strong` | Useful as a soft popularity signal. |

XPath equivalents are straightforward 1:1 mappings. Use a label-lookup helper: `findCmpItemByLabel(label)` → `div.cmp-item[div.param contains text=label]` → select the sibling `div.val`.

## 5. Reviews

**Present on-page — yes, when `Total Reviews > 0`.** No JS or lazy loading — the review blocks are in the initial HTML.

- Container: `div#reviews`
- Review count / summary: `div.cmp-item div.param` whose text starts with "Total Reviews:" — regex-parse the integer.
- Individual review: `div.review_box[data-reviewid]`
  - **Stable per-review ID** — yes, `data-reviewid="5812"` is present on every review block and is a numeric site-assigned primary key.
  - Reviewer name: `div.revname` (free text, may end in whitespace; may be "Anonymous" when the reviewer opted to hide identity).
  - Date: `div.revdate` — format `DD MMM,YYYY` e.g. `08 Sep,2024`. No time component.
  - Body: `div.revcontent` — HTML content (contains `<p>` and `<br />`); strip inner HTML for a plain-text representation.
  - Rating / stars: **not present**. The site does not capture a numeric rating — reviews are free-text only.
- Review submission is a separate POST form (with captcha); our scrape ignores it.

Fixture: `scripts/scrape/directoryofnepal/fixtures/review.html`.

## 6. Images

- **Logo** — `span.clogo img[src]` inside the first profile panel. Absolute URL served from `/images/...` on the same host. Width constrained by `max-height="135"`. Absent for businesses that did not upload one (in which case listing pages render a `div.deflogo` initials square — the detail page in that case omits the `span.clogo` entirely).
- **Cover / hero** — not used by this site. No hero banner, no gallery, no slider. Treat as absent. (Products, when the business sells any, have their own images under `div.products_box div.pd_pic img[src]`, but those are product photos — not business cover images.)
- **Listing thumbnails** (for category crawls) — `div.cat-logo div.ctl img[data-src]` (lazy-loaded; real URL is in `data-src`, not `src`). Same `/images/...` path as detail-page logos.

## 7. Proposed fetch rate

- **0.5 req/s (one request every 2 s)**, single worker.
- Rationale: robots.txt is silent on `Crawl-delay`, site is a legacy PHP app with no CDN in front (only Alt-Svc for HTTP/3 advertised); responses are ~30–60 KB, uncached (`cache-control: no-store`). Being polite matters here.
- Set `User-Agent: BiswaasBot/0.1 (+https://github.com/AbhiShake1/biswaas)` — also used for recon.
- Backoff rules:
  - On 429 or 5xx: exponential backoff 10 s → 30 s → 2 min, cap 3 retries, then park the URL for manual review.
  - On 3 consecutive failures across different URLs: halt the run, alert.
- Respect the `PHPSESSID` cookie only if the server starts gating pages on it — do not share a session across workers (keep a cookie jar per worker or none at all).

---

## Files touched by this recon

- `docs/scraping/directoryofnepal.md` (this document)
- `scripts/scrape/directoryofnepal/fixtures/category.html`
- `scripts/scrape/directoryofnepal/fixtures/business.html`
- `scripts/scrape/directoryofnepal/fixtures/review.html`

Nothing else was modified. No dependencies, no Convex code, no scraper code.
