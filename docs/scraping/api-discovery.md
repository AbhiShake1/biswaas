# directoryofnepal.com — API / endpoint discovery

**Recon date:** 2026-04-16 (iter 2)
**Method:** `curl` probes + `robots.txt` / `sitemap.xml` analysis. Browser-level network inspection was considered but unnecessary — the site has no client-side rendering or AJAX for main content.

## Key findings

### 1. No JSON REST API (for main content)

The site is server-rendered PHP. Category listings, business detail pages, and reviews are all embedded in the initial HTML response. There is no `/api/*` endpoint serving JSON that we could consume directly in place of HTML parsing.

### 2. `/autocomplete/` endpoint exists but is disallowed

```
User-agent: *
Disallow: /autocomplete/
```

robots.txt explicitly disallows `/autocomplete/` for all user agents. We respect this — do NOT probe or use it.

### 3. `sitemap.xml` is the jackpot

`https://www.directoryofnepal.com/sitemap.xml` — a single 2 MB XML file with every URL on the site:

| URL type            | Count  | Pattern                                                    |
|---------------------|--------|------------------------------------------------------------|
| `/company/<id>/...` | 31,533 | business detail pages                                      |
| `/category/<id>/...`| 368    | category listing pages                                     |
| `/class/<id>/...`   | 40     | parent "class" groupings (one level above categories)      |
| homepage            | 1      | `/`                                                        |
| fixed pages         | 2      | `/browse-categories`, `/add-business`                      |

This **removes the need for category pagination**. A3's `parseCategoryPage` and `crawlCategory` become legacy code paths — the scraper can read the sitemap once and hand A4's `scrapeBusiness` a ready-made URL list of 31,533 items.

### 4. Category slug format in sitemap

Sitemap uses **bare slugs** (e.g. `/category/552/agricultural-tools-medicine.html`), not the `list-of-*` form that `/browse-categories` emits. Our normalizer already tolerates both (A6 strips `list-of-` prefix before `categoryMap` lookup), so no code change needed.

### 5. No rate-limit or Crawl-delay directive

robots.txt has no `Crawl-delay`. Initial pass used 0.5 req/s (A2 default). For a full-site scrape of ~32k URLs, a polite 4 req/s (4 concurrent workers, 1s inter-request) completes in ~2.2 hours; 8 req/s in ~65 minutes. PHP-backed directory sites typically handle this without issue.

## Implications for the scraper

1. **Add `scripts/scrape/directoryofnepal/sitemap.ts`** — fetches + parses `sitemap.xml`, returns `{ companies: string[], categories: string[], classes: string[] }`.
2. **Update `scripts/scrape/directoryofnepal/index.ts`** — when no `--category` flag, default to sitemap-based discovery. Keep the old category-page walker as a fallback path behind `--via=category-pages`.
3. **Raise concurrency** — expose a `--concurrency <n>` flag (default 4) and a `--delay-ms <n>` flag (default 1000) so runs can be tuned.
4. **Resume support** — every business URL checked against `scripts/scrape/shared/cache.ts`; cache hits skip the network call. A run that gets interrupted can be restarted with the same dated-run folder and resumes where it left off.

## Verification commands

```bash
# Sitemap URL count
curl -s https://www.directoryofnepal.com/sitemap.xml | grep -oE 'https://[^<]+' | wc -l
# → 31949

# Business URL count
curl -s https://www.directoryofnepal.com/sitemap.xml \
  | grep -oE 'https://[^<]+/company/[^<]+' | wc -l
# → 31533
```
