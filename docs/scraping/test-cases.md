# Biswaas — directoryofnepal.com Scraping Pipeline · Test Cases

> Scope: every executable and proposed test case for the scraping + ingest
> pipeline on branch `feat/scraping-harness`.
> All file paths are absolute from repo root (`/Users/abhi/proj/flance/biswaas`).
> Each test case has a stable ID (`T-<wave>-<n>`) so failures can be referenced.

---

## 1. Overview

The pipeline scrapes [directoryofnepal.com](https://www.directoryofnepal.com),
normalises the raw HTML into zod-validated records, and ingests the result into
the Convex `categories` + `businesses` tables. The pipeline has eight moving
parts:

1. **Shared HTTP infrastructure** — rate-limited fetcher with on-disk cache,
   robots-gated, retry-with-backoff.
2. **Discovery** — crawls `/browse-categories` and writes `categories.json`.
3. **Category walk** — paginates through each category's listing pages and
   collects business URLs.
4. **Business parse** — turns each `/company/.../...html` page into a
   `ScrapedBusiness` record.
5. **Normalisation** — maps source slugs to internal taxonomy, cleans
   addresses/phones/urls, seeds review-derived fields to zero.
6. **Convex ingest** — idempotent `upsertCategories` / `upsertBusinesses` +
   `recomputeBusinessStats` internal mutations.
7. **Ingest CLI** — driver that loads artifacts, normalises, and calls Convex.
8. **Dry-run diff** — computes per-slug new/changed/unchanged against live
   Convex state without writing.

The **testing philosophy** is layered:

- **Offline-first.** Unit tests use static fixtures under
  `scripts/scrape/directoryofnepal/fixtures/` so the parser tests never hit the
  network. The normaliser is pure and is tested against synthetic inputs. This
  lets CI run in <1 s and remain deterministic.
- **Live smoke next.** A small pilot scrape (`--limit=3..10`) verifies the
  fetcher, robots check, cache, and listing walker work against the real site.
- **Convex integration** exercises the ingest mutations on a dev deployment:
  idempotency, upsert-on-change, stats recomputation, audit log writes.
- **Visual verification (browser)** renders the ingested businesses in the app
  to prove the data actually surfaces in the UI, not just in the DB.

The contract between layers is the zod schema in
`/Users/abhi/proj/flance/biswaas/scripts/scrape/directoryofnepal/types.ts` — if
a test needs a new field, the schema changes first.

---

## 2. Test matrix summary

| Layer | Module                                    | What's tested                                 | Status                    |
|------:|-------------------------------------------|-----------------------------------------------|---------------------------|
| 1     | `normalize.ts`                            | Slug, validators, category/business normalise | 7 existing + 8 proposed   |
| 2     | `parseCategory.ts`                        | Listing → business URLs, pagination           | 3 existing + 5 proposed   |
| 3     | `parseBusiness.ts`                        | Detail page field extraction                  | 4 existing + 6 proposed   |
| 4     | `shared/fetcher.ts` `cache.ts` `robots.ts` `logger.ts` | Rate limit, retry, cache, robots, JSONL | 0 existing + 12 proposed  |
| 5     | `convex/ingest.ts`                        | Upsert idempotency, stats, audit logs         | 0 existing + 11 proposed (manual) |
| 6     | `scripts/ingest/importScraped.ts`         | CLI happy path + error exits                  | 0 existing + 6 proposed (manual)  |
| 7     | End-to-end pilot                          | Scrape → ingest → DB roundtrip                | 1 executed (iter 1) + 4 proposed  |
| 8     | Visual (headless browser)                 | App renders scraped rows                      | 2 executed (iter 1)       |
| 9     | Regression traps                          | Known pitfalls                                | 3 proposed                |

Totals: **14 existing** (unit, all passing), **52 proposed / manual / E2E**,
**3 executed live** (iter 1 — see §13).

---

## 3. Layer 1: Unit — Normalisation

File: `/Users/abhi/proj/flance/biswaas/scripts/scrape/directoryofnepal/normalize.test.ts`
Runner: `node:test` via `tsx`.

Run:

```bash
npx tsx scripts/scrape/directoryofnepal/normalize.test.ts
```

### Existing cases

| ID        | Name                                                  | What it asserts |
|-----------|-------------------------------------------------------|------------------|
| T-A6-01   | case 1 · valid business with full address populates all fields | `normalizeBusiness` on `Glow Skin & Dental Clinic` yields slug `glow-skin-dental-clinic`, mapped category `hospitals-healthcare`, E.164 phone `+9779841234567`, parsed district `Lalitpur` / province `Bagmati` / municipality `Lalitpur`, logo URL preserved, review-derived fields (`starRating`, `totalReviews`, `trustScore`) seeded to 0, `status: "active"`, `createdAt === updatedAt`. |
| T-A6-02   | case 2 · invalid phone is dropped, rest of record is normalized | `phone: "not-a-phone-number"` → `undefined`; email / URL / district / name / mapped category (`hotels-resorts`) all survive. |
| T-A6-03   | case 3 · unknown category returns unmapped sentinel   | `sourceCategorySlug: "taxidermy-services"` → `{ unmapped: true, reason: /taxidermy-services/, raw }`. |
| T-A6-04   | case 4 · messy address parses best-effort             | `parseAddress` handles trailing `, Nepal`, parenthetical alternates, duplicate commas; unrecognised strings return `{ address: <trimmed> }`; empty string returns `{ address: "" }`. |
| T-A6-05   | case 5 · category normalisation with sortOrder        | `normalizeCategory(scraped, 7)` → `sortOrder=7`, `businessCount=0`, `description=""`, `nameNe=undefined`, `isActive=true`, `createdAt > 0`. |
| T-A6-06   | case 6 · helpers behave                               | `toSlug` strips punctuation and collapses hyphens; `validatePhone` accepts `+977 9841-234567`, `9841234567`, `01-4567890` and rejects empty/garbage; `validateEmail` requires `user@host.tld`; `validateUrl` rejects `"not a url"` and normalises `https://example.com` → `https://example.com/`. |
| T-A6-07   | case 7 · `mapCategorySlug` strips `list-of-` prefix   | Both `education` and `list-of-education` map to `education-consultancies`; whitespace-tolerant and case-insensitive; `list-of-taxidermy-services` returns `isMapped: false`. |

### Proposed cases

| ID        | Name                                         | How to test |
|-----------|----------------------------------------------|-------------|
| T-A6-P01  | `toSlug` unicode & accent handling           | `toSlug("Café Münchën — Ñandú!!")` → `"caf-m-nch-n-andu"` (non-ASCII stripped per `[^a-z0-9]+` rule). Assert no trailing/leading hyphen. |
| T-A6-P02  | `toSlug` long names / whitespace runs        | `toSlug("  A  -  B  -  C  ")` → `"a-b-c"`; `toSlug(" ".repeat(500))` → `""`. |
| T-A6-P03  | `validatePhone` additional edges             | `validatePhone(" ")` → `undefined`; `validatePhone("+44 20 7946 0958")` → `"+442079460958"` (E.164 generic); `validatePhone("9871234567")` (starts 98) → preserved; `validatePhone("12345")` → `undefined`. |
| T-A6-P04  | `validateUrl` protocol-less / relative       | `validateUrl("example.com")` → `undefined` (no scheme, `new URL` throws); `validateUrl("/relative/path")` → `undefined`; `validateUrl("https://foo.com")` normalised to `"https://foo.com/"`. |
| T-A6-P05  | `validateEmail` edges                        | `validateEmail("a@b")` → `undefined` (no TLD); `validateEmail("a @b.co")` → `undefined` (whitespace); `validateEmail(" hi@example.com ")` → `"hi@example.com"`; `validateEmail("")` → `undefined`. |
| T-A6-P06  | `parseAddress` district-only                 | `parseAddress("Kaski")` → `{ district: "Kaski", province: "Gandaki", address: "" }` (no municipality). |
| T-A6-P07  | `parseAddress` municipality-only             | `parseAddress("Pokhara")` → `{ municipality: "Pokhara", district: "Kaski", province: "Gandaki", address: "" }`. |
| T-A6-P08  | `mapCategorySlug` hardening                  | Empty string → `{ slug: "_unmapped", isMapped: false }`; mixed-case `"LIST-OF-Dental-Clinics"` → `hospitals-healthcare`; whitespace-wrapped `"  banks  "` → `banking-finance`. |
| T-A6-P09  | `normalizeBusiness` with all optionals missing | `ScrapedBusiness` missing `phone`, `email`, `website`, `rawAddress`, `description`, `logoUrl` — still returns a valid `NormalizedBusiness` with those fields `undefined` and `description: ""`. Validate via `normalizedBusinessSchema.safeParse`. |
| T-A6-P10  | `computeInitialTrustScore` contract          | Always returns `0`; the real formula lives in `convex/lib/trustScore.ts` and is invoked by `recomputeBusinessStats` — assert the seed value stays decoupled. |

---

## 4. Layer 2: Unit — Category parser

File: `/Users/abhi/proj/flance/biswaas/scripts/scrape/directoryofnepal/parseCategory.test.ts`
Fixture: `.../fixtures/category.html` (real DoN Education page 1 snapshot).

Run:

```bash
npx tsx scripts/scrape/directoryofnepal/parseCategory.test.ts
```

### Existing cases

| ID        | Name                                                    | What it asserts |
|-----------|---------------------------------------------------------|------------------|
| T-A3-01   | parseCategoryPage extracts business URLs from fixture   | At least one `/company/\d+/[^/]+\.html` URL; all match `COMPANY_URL_RE`; output is de-duplicated. |
| T-A3-02   | parseCategoryPage detects the next page link            | `nextPageUrl` ends with `/category/2/591/education.html.html` (the quirky double `.html` page-N pattern). |
| T-A3-03   | parseCategoryPage returns null nextPageUrl when pagination bar is absent | Minimal HTML with just `div.comp-list-box` → `nextPageUrl === null`, business list preserved in order. |

### Proposed cases

| ID        | Name                                                | How to test |
|-----------|-----------------------------------------------------|-------------|
| T-A3-P01  | Empty category HTML                                 | `parseCategoryPage("<html></html>")` → `{ businessUrls: [], nextPageUrl: null }` — no throws. |
| T-A3-P02  | Page with only pagination (no businesses)           | Craft HTML with `div.paging_bar` containing `span.pg_btn.next > a` only → `businessUrls: []`, `nextPageUrl` populated. |
| T-A3-P03  | Mixed absolute + relative company hrefs             | `<a href="/company/1/a.html">` and `<a href="https://directoryofnepal.com/company/2/b.html">` both normalised to `https://www.directoryofnepal.com/company/<id>/<slug>.html`; off-host anchors dropped. |
| T-A3-P04  | `crawlCategory` respects `--limit`                  | Stub `Fetcher.fetchHtml` to return a page with 50 URLs + a next page; call `crawlCategory(stub, cat, 5)` → returns exactly 5 URLs and stops after the first page (no second fetch). |
| T-A3-P05  | `crawlCategory` cycle detection (visited set)       | Stub returns pages where page 2's `nextPageUrl` points back at page 1 → loop breaks; collected set equals URLs from page 1 + page 2 only. |

---

## 5. Layer 3: Unit — Business parser

File: `/Users/abhi/proj/flance/biswaas/scripts/scrape/directoryofnepal/parseBusiness.test.ts`
Fixture: `.../fixtures/business.html` (Glow Skin & Dental Clinic snapshot).

Run:

```bash
npx tsx scripts/scrape/directoryofnepal/parseBusiness.test.ts
```

### Existing cases

| ID        | Name                                                               | What it asserts |
|-----------|--------------------------------------------------------------------|------------------|
| T-A4-01   | parseBusinessPage extracts core fields from Glow Skin fixture      | Non-empty name without trailing city, `sourceId === "32565"`, `rawAddress` references Lalitpur/Nepal, phone matches `+977` or plausible Nepal pattern, `sourceCategorySlug === "dental-clinics"`, `logoUrl` starts `https://`, `website` matches `/glowskindentalclinic/`, description >50 chars, and the result passes `scrapedBusinessSchema.safeParse`. |
| T-A4-02   | throws for non-company URLs                                        | `parseBusinessPage("<html></html>", "https://example.com/foo")` throws `/Not a directoryofnepal company URL/`. |
| T-A4-03   | throws when the page has no name                                   | Breadcrumb-only HTML (no `div.cname > h1`) → `/could not locate name/`. |
| T-A4-04   | throws when the breadcrumb has no category link                    | HTML with `div.cname > h1` but no `div.breadbar a[href*="/category/"]` → `/could not locate category slug/`. |

### Proposed cases

| ID        | Name                                          | How to test |
|-----------|-----------------------------------------------|-------------|
| T-A4-P01  | Label-value rows may be missing               | HTML with valid name + breadcrumb but zero `div.cmp-item` rows → returns `ScrapedBusiness` with `rawAddress / phone / email / website / description / logoUrl = undefined`, no throw. |
| T-A4-P02  | Trailing `, <city>` stripping respects multi-comma names | `"Foo, Bar & Co., Kathmandu"` → name becomes `"Foo, Bar & Co."` (the regex only strips a single 1–3-word tail). Validate against `stripTrailingCity`. |
| T-A4-P03  | Phone extraction — `openCallWindow` preferred over fallback | Fixture with both `<a onclick="openCallWindow('+977-9800000000')">` and a landline row → result is `+977-9800000000` (the `onclick` path wins). |
| T-A4-P04  | Phone fallback — label-driven lookup          | HTML with only a `div.cmp-item` labelled "Contact Numbers (Mobile)" → phone extracted from `div.val`. |
| T-A4-P05  | `mailto:` extraction                          | HTML with `<a href="mailto:info@x.com?subject=hi">` → email is `info@x.com` (query stripped). Multiple mailtos → first wins. |
| T-A4-P06  | Logo absent → `undefined`, category slug preserved | HTML without `span.clogo img[src]` → `logoUrl === undefined`; `sourceCategorySlug` still resolved from breadcrumb. |

---

## 6. Layer 4: Unit — Shared infra

No existing tests. All proposed. Use `node:test` + stubbed endpoints (e.g.
`node:http.createServer`) for deterministic local servers.

### `scripts/scrape/shared/fetcher.ts`

| ID        | Name                                                   | How to test |
|-----------|--------------------------------------------------------|-------------|
| T-A2-P01  | Rate-limit honours `delayMs`                           | Start a local server; `createFetcher({ delayMs: 300, respectRobots: false })`; fire `fetchHtml` × 3; assert receive timestamps are ≥300 ms apart. |
| T-A2-P02  | Cache hit skips network                                | Pre-seed the on-disk cache for URL `U`; set up a server that increments a counter on every hit; call `fetchHtml(U)` twice; assert the counter stays at 0 and both calls return the cached body. |
| T-A2-P03  | Retry on 5xx with exponential backoff                  | Server returns 502 twice then 200; `createFetcher({ maxRetries: 3, delayMs: 0, respectRobots: false, useCache: false })`; assert fetch succeeds on the third attempt and intervals are ≈1 s, 2 s. |
| T-A2-P04  | Robots disallow throws `FetcherDisallowedError`        | Server responds to `/robots.txt` with `User-agent: *\nDisallow: /`; `fetchHtml("http://host/any")` rejects with `FetcherDisallowedError`, never reaches the target URL. |
| T-A2-P05  | 429 with `Retry-After` is honoured                     | Server returns 429 with `Retry-After: 1` then 200; verify the fetcher sleeps ≥ ~1 s before the retry; final response is the 200 body. |

### `scripts/scrape/shared/cache.ts`

| ID        | Name                                       | How to test |
|-----------|--------------------------------------------|-------------|
| T-A2-P06  | SHA1 keying + round-trip                   | `cache.set("https://x/a", "body")` then `cache.get("https://x/a")` → `"body"`; verify the file written under `data/scraped/.cache/` is named `sha1(url).html`. |
| T-A2-P07  | Cache miss returns null                    | `cache.get("https://never-written/")` → `null` (no throw, even if cache dir missing — ensured by `ensureCacheDir`). |
| T-A2-P08  | 200-only cache population                  | Confirm via fetcher: `doOnce` only calls `cache.set` after a 200 body read; 429 / 5xx / 404 responses never write to disk. (See `fetcher.ts:108-110`.) |

### `scripts/scrape/shared/robots.ts`

| ID        | Name                                   | How to test |
|-----------|----------------------------------------|-------------|
| T-A2-P09  | Disallowed path → false                | Stub `/robots.txt` with `User-agent: *\nDisallow: /private/`; `isAllowed("https://host/private/foo")` → `false`. |
| T-A2-P10  | Allowed path → true                    | Same stub; `isAllowed("https://host/public/foo")` → `true`. |
| T-A2-P11  | Missing robots.txt fails closed        | Stub `/robots.txt` returns 500; `isAllowed("https://host/any")` → `false` (fail-closed per `robots.ts:53`). |

### `scripts/scrape/shared/logger.ts`

| ID        | Name                                              | How to test |
|-----------|---------------------------------------------------|-------------|
| T-A2-P12  | JSONL line count matches call count + level tags  | `createLogger(tmpDir)`; call `info`, `warn`, `error` once each; read `run.log`; assert 3 lines, each parses as JSON with the correct `level`, `msg`, `ts`. Stdout/stderr receives `[INFO ]` / `[WARN ]` / `[ERROR]` prefixed output in matching order. |

---

## 7. Layer 5: Integration — Convex ingest

File: `/Users/abhi/proj/flance/biswaas/convex/ingest.ts`
No existing automated tests; all proposals are manual against a dev
deployment. The ingest CLI shells out via `npx convex run` — exact same
transport here.

### `upsertCategories`

| ID        | Name                                       | How to test |
|-----------|--------------------------------------------|-------------|
| T-A7-P01  | Insert-new path                            | `npx convex run ingest:upsertCategories '{"categories":[{...brand-new slug}]}'` → `{ inserted: 1, updated: 0, unchanged: 0 }`; a row appears in `categories`. |
| T-A7-P02  | Update-changed path                        | Re-run with the same slug but a new `name` → `{ inserted: 0, updated: 1, unchanged: 0 }`; `ctx.db.patch` only touches changed fields. |
| T-A7-P03  | Unchanged no-op                            | Re-run identical input → `{ inserted: 0, updated: 0, unchanged: 1 }`; no row mutation beyond the audit log. |
| T-A7-P04  | Audit log written                          | After each call, `auditLogs` grows by exactly one row with `action: "ingest.directoryofnepal.categories"` and `metadata` JSON carrying the counters. |
| T-A7-P05  | `by_slug` index used                       | Lookup latency stays O(1) regardless of category count; confirm via Convex dashboard query profile (no full scan). |

### `upsertBusinesses`

| ID        | Name                                                    | How to test |
|-----------|---------------------------------------------------------|-------------|
| T-A7-P06  | Unknown category slug throws `ConvexError`              | `npx convex run ingest:upsertBusinesses '{"businesses":[{...primaryCategorySlug:"nonexistent"}]}'` → exits non-zero with `Unknown category slug: nonexistent`; no partial insert. |
| T-A7-P07  | Insert seeds review stats to zero                       | Fresh slug → `trustScore=0`, `starRating=0`, `totalReviews=0`, `ratingDistribution` all zeros regardless of input values (server overwrites per `ingest.ts:317-320`). |
| T-A7-P08  | Update preserves review stats                           | Pre-seed a business with `starRating=4.2`, `totalReviews=7`; re-ingest → the four review-derived fields are NOT patched. Confirmed by the patch builder only touching editorial fields (`ingest.ts:338-400`). |
| T-A7-P09  | Returns `affectedBusinessIds`                           | Mixed insert + update + unchanged batch → `affectedBusinessIds` length equals `inserted + updated`; unchanged rows' IDs are NOT included. |

### `recomputeBusinessStats`

| ID        | Name                                                           | How to test |
|-----------|----------------------------------------------------------------|-------------|
| T-A7-P10  | 0 / 1 / many reviews; flagged & hidden excluded                | Seed a business with 3 reviews — one `visible`, one `flagged`, one `hidden`. Call `npx convex run ingest:recomputeBusinessStats '{"businessId":"<id>"}'`; assert `totalReviews=1`, `starRating` equals that review's stars, `trustScore` computed via `calculateTrustScore`, and `ratingDistribution` buckets the single visible review. |

### `getOrCreateSystemUser`

| ID        | Name                                          | How to test |
|-----------|-----------------------------------------------|-------------|
| T-A7-P11  | Idempotency + fallback email format           | `npx convex run lib/importers:getOrCreateSystemUser '{"workosId":"system-test","name":"Test Bot"}'` twice → both calls return the same `Id<"users">`. The inserted row has `email === "system-test@system.local"` (per `importers.ts:42`). |

---

## 8. Layer 6: Integration — Ingest CLI

File: `/Users/abhi/proj/flance/biswaas/scripts/ingest/importScraped.ts`
Invocation: `npm run ingest:don -- <folder>` (expands to
`tsx scripts/ingest/importScraped.ts <folder>`).

| ID        | Name                                          | How to test |
|-----------|-----------------------------------------------|-------------|
| T-A8-P01  | Missing folder → exit 1                       | `npm run ingest:don -- /tmp/does-not-exist` → stderr `[ingest] folder does not exist: ...`; exit code 1. |
| T-A8-P02  | Folder missing `categories.json` → exit 1     | `mkdir /tmp/empty && npm run ingest:don -- /tmp/empty` → stderr `[ingest] missing file: /tmp/empty/categories.json`; exit code 1. |
| T-A8-P03  | zod validation failure aborts before any write | Drop a `categories.json` that omits `url` → `loadCategories` throws `categories.json failed schema validation at 0.url: ...`; no Convex mutation is called. |
| T-A8-P04  | Happy path + re-run idempotency               | First run on a fresh artifact folder → categories / businesses inserted, `_unmapped.json` written, recomputeBusinessStats called for each affected ID, audit logs recorded. Second run on the same folder → `inserted=0, updated=0, unchanged=N` for both entities. |
| T-A8-P05  | `--dry` flag performs zero writes             | `npm run ingest:don -- --dry <folder>` → prints the dry-run table and the text `dry run complete — 0 mutations called, 0 rows written.`; verify via Convex dashboard that row counts are unchanged. |
| T-A8-P06  | `--out diff.json` writes the full diff        | `npm run ingest:don -- --dry --out /tmp/diff.json <folder>` → file is written; schema matches `DiffResult` from `diffReport.ts`: `{ categories: { new, changed, unchanged }, businesses: { new, changed, unchanged } }`, with `changed[n].fields` containing `{ old, new }` per differing field. |

---

## 9. Layer 7: E2E — Pilot smoke

Pilot command:

```bash
npm run scrape:don -- --category=education --limit=5
```

Then:

```bash
npm run ingest:don -- --dry  data/scraped/directoryofnepal/<YYYY-MM-DD>
npm run ingest:don --        data/scraped/directoryofnepal/<YYYY-MM-DD>
```

| ID        | Name                                                      | Expected |
|-----------|-----------------------------------------------------------|----------|
| T-AQ-01   | Artifact folder structure (scrape output)                 | `data/scraped/directoryofnepal/<today>/` contains `categories.json`, `business-urls.json`, `businesses.json`, `failures.json`, `run.log`. Every `businesses.json` row passes `scrapedBusinessSchema.safeParse`. `failures.json` is an array (empty or populated). |
| T-AQ-02   | Dry-run diff against clean DB                             | `--dry` prints `categories: new=<N_seeded_mismatches>`, `businesses: new=<pilot_limit>`, `unchanged=0`. No Convex rows mutated. |
| T-AQ-03   | Real ingest inserts N businesses + audit rows             | `npm run ingest:don -- <folder>` → summary shows `inserted=N, updated=0`. `auditLogs` has two fresh rows: `ingest.directoryofnepal.categories` and `ingest.directoryofnepal.businesses`. |
| T-AQ-04   | Re-ingest idempotency                                     | Immediate second `npm run ingest:don -- <folder>` → `inserted=0, updated=0, unchanged=N` for businesses. `affectedBusinessIds` empty → `statsRecomputed=0`. |

---

## 10. Layer 8: Visual (headless browser)

Executed on iter 1 via the `mcp__mobile__browser_*` tools with dev server at
`http://localhost:5197`.

Reproducibility — canonical sequence:

```
mcp__mobile__browser_open       { url: "http://localhost:5197/categories/education-consultancies" }
mcp__mobile__browser_snapshot
mcp__mobile__browser_screenshot
mcp__mobile__browser_open       { url: "http://localhost:5197/review/cas-education-consultancy" }
mcp__mobile__browser_snapshot
mcp__mobile__browser_screenshot
mcp__mobile__browser_close
```

| ID        | Name                                   | What to verify |
|-----------|----------------------------------------|----------------|
| T-VIS-01  | Category listing shows scraped rows    | `/categories/education-consultancies` renders 3 scraped businesses (CAS Education Consultancy, Creative Abroad Studies, …) alongside the 2 pre-seed businesses. Each row surfaces name + district. |
| T-VIS-02  | Detail page renders scraped fields     | `/review/cas-education-consultancy` shows name, the scraped raw address (starts `New Baneshwor, Civil Hospital…`), phone `+977 9851353904`, website `https://creativeabroadstudies.com/`, category breadcrumb `Education Consultancies`, logo initial. |

**Note on routing & rating:** the app mounts business detail pages at
`/review/<slug>`, not `/business/<slug>`. The rating card shows
`3.5 / 0 reviews` — this is the Bayesian prior from
`convex/lib/trustScore.ts` for zero-review businesses, NOT a scraper defect.

---

## 11. Layer 9: Regression traps

Known sharp edges and the tests that guard them.

| ID         | Trap                                                  | Guarding test                                                                                                             |
|------------|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| T-REG-01   | `list-of-` prefix on live categories vs bare keys in `DIRECT_MAP` | `T-A6-07` (`normalize.test.ts` case 7) — asserts both `education` and `list-of-education` → `education-consultancies`, and that `index.ts` filter also strips the prefix (`normalizeSlug`). |
| T-REG-02   | Category `sortOrder` drift: scraper emits 0-based, seed data is 1-based | **Proposed.** Run `npm run ingest:don -- --dry --out /tmp/diff.json <folder>` against a DB seeded with 1-based sortOrder; assert `diff.categories.changed[n].fields.sortOrder = { old: <n>, new: <n-1> }` surfaces for every pre-seeded category. This is the canonical detection mechanism — it lives in the diff output, not in a unit test. |
| T-REG-03   | Reviews are intentionally NOT scraped (source has no stars) | **Proposed.** Add a test asserting `scripts/scrape/directoryofnepal/` contains **no** `parseReview.ts` and that no artifact under `data/scraped/directoryofnepal/<date>/` has a `reviews.json` key. Also: `types.ts` comment (`lines 9-12`) documents the decision — asserting this comment stays in place defends against accidental re-introduction. The `fixtures/review.html` file exists for future use but is currently unreferenced. |

---

## 12. Running the full existing suite

Every executable test today, in one block:

```bash
cd /Users/abhi/proj/flance/biswaas
npx tsx scripts/scrape/directoryofnepal/normalize.test.ts
npx tsx scripts/scrape/directoryofnepal/parseCategory.test.ts
npx tsx scripts/scrape/directoryofnepal/parseBusiness.test.ts
```

Expected output — each file prints one line per test with a `✔` / `ok`, and
exits 0. Combined runtime <2 s. Failures exit non-zero and stderr carries a
`node:assert/strict` trace pointing at the failing case by name (matches the
`T-A*-0X` IDs above).

---

## 13. Present-day verification evidence (iter 1)

The orchestrator ran the full pipeline end-to-end on `feat/scraping-harness`
on **2026-04-16**. Artifacts under
`/Users/abhi/proj/flance/biswaas/data/scraped/directoryofnepal/2026-04-16/`.

Commands executed + signals observed:

```bash
# 1 · Pilot scrape (live against directoryofnepal.com)
npm run scrape:don -- --category=education --limit=3
#   → categories.json (34 cats), business-urls.json (3 urls),
#     businesses.json (3 rows), failures.json ([]), run.log populated.

# 2 · Dry-run diff vs live Convex (empty businesses table expected)
npm run ingest:don -- --dry data/scraped/directoryofnepal/2026-04-16
#   → categories: changed rows (sortOrder drift vs seed), businesses: 3 new.

# 3 · Real ingest
npm run ingest:don -- data/scraped/directoryofnepal/2026-04-16
#   → businesses inserted=3, statsRecomputed=3, audit rows written.

# 4 · Idempotency verify
npm run ingest:don -- data/scraped/directoryofnepal/2026-04-16
#   → inserted=0, updated=0, unchanged=3 for businesses.

# 5 · Visual headless browser
#   - http://localhost:5197/categories/education-consultancies → 3 + 2 rows.
#   - http://localhost:5197/review/cas-education-consultancy → detail renders.
```

Recent commits on branch (for reference):

```
47a510e feat: refresh focused-scope UI and seed Convex data
31594e8 Refresh Biswaas theme with Trustpilot-inspired colors
2fcb2fe fix: align Cloudflare worker deployment
5cfa42d feat(ui): redesign app theme and homepage
b8c7a9f feat: add visible auth flow and comment replies
```

Progress tracker: `/Users/abhi/proj/flance/biswaas/.claude/ralph-progress.md`.

---

## 14. Future testing roadmap

- **CI runner (GitHub Actions).** Add `.github/workflows/test.yml` that runs
  the three `node:test` files on every PR. Gate merges on green.
- **Migrate to `vitest`.** `node:test` is fine for 7-test files but scales
  poorly past ~30 cases; vitest gives watch mode, coverage, and
  `expect.toMatchSnapshot` for fixture diffs.
- **Playwright E2E.** Replace the manual `mcp__mobile__browser_*` flow with a
  scripted Playwright spec that boots the dev server, scrapes, ingests, and
  asserts on the rendered DOM. Target: `tests/e2e/pilot-pipeline.spec.ts`.
- **Convex harness tests via `convex-test`.** The official test harness
  (`@convex-dev/test`) mocks the runtime in-process so `upsertBusinesses`,
  `recomputeBusinessStats`, and `getOrCreateSystemUser` can be exercised
  without a running dev deployment. This would move every T-A7-P* case from
  manual-against-dev-deployment to unit-speed CI.
- **Property-based testing for `parseAddress`.** Generate thousands of random
  comma-joined address strings mixing known districts / municipalities / noise
  tokens and assert invariants (never throws; matched district's province
  matches the canonical map; leftover tokens never contain a matched name).
- **Golden-file diff tests for the parsers.** Snapshot the current
  `parseBusinessPage(fixture)` output to `fixtures/business.expected.json`;
  future runs compare against the snapshot so DOM selector drift is caught
  visibly rather than via scattered field asserts.
