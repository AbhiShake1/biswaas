/**
 * Offline parser test for the category listing page.
 * Uses node:test so `npx tsx scripts/scrape/directoryofnepal/parseCategory.test.ts`
 * runs without extra tooling (matches the existing A6 style).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCategoryPage } from "./parseCategory.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURE = readFileSync(
	join(__dirname, "fixtures", "category.html"),
	"utf8",
);

const COMPANY_URL_RE =
	/^https:\/\/www\.directoryofnepal\.com\/company\/\d+\/[^/]+\.html$/;

test("parseCategoryPage extracts business URLs from fixture", () => {
	const out = parseCategoryPage(FIXTURE, "https://www.directoryofnepal.com/category/591/education.html");

	assert.ok(out.businessUrls.length > 0, "expected at least one business url");
	for (const url of out.businessUrls) {
		assert.match(url, COMPANY_URL_RE, `expected company URL pattern, got ${url}`);
	}

	// De-duplication sanity check.
	const unique = new Set(out.businessUrls);
	assert.equal(
		unique.size,
		out.businessUrls.length,
		"expected de-duplicated business URLs",
	);
});

test("parseCategoryPage detects the next page link", () => {
	const out = parseCategoryPage(
		FIXTURE,
		"https://www.directoryofnepal.com/category/591/education.html",
	);
	assert.ok(out.nextPageUrl != null, "expected a next-page URL on a multi-page category");
	// The fixture is Education page 1 → next should be page 2.
	assert.match(
		out.nextPageUrl!,
		/\/category\/2\/591\/education\.html\.html$/,
		`expected page-2 URL, got ${out.nextPageUrl}`,
	);
});

test("parseCategoryPage returns null nextPageUrl when pagination bar is absent", () => {
	const minimal = `
		<html><body>
		<div class="comp-list-box">
		  <a href="https://www.directoryofnepal.com/company/1/alpha.html">Alpha</a>
		  <a href="https://www.directoryofnepal.com/company/2/beta.html">Beta</a>
		</div>
		</body></html>
	`;
	const out = parseCategoryPage(minimal);
	assert.equal(out.nextPageUrl, null);
	assert.deepEqual(out.businessUrls, [
		"https://www.directoryofnepal.com/company/1/alpha.html",
		"https://www.directoryofnepal.com/company/2/beta.html",
	]);
});
