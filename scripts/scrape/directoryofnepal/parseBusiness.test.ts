/**
 * A4 · Offline parser test for the business detail page.
 *
 * Run with: `npx tsx scripts/scrape/directoryofnepal/parseBusiness.test.ts`
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseBusinessPage } from "./parseBusiness.ts";
import { scrapedBusinessSchema } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURE = readFileSync(
	join(__dirname, "fixtures", "business.html"),
	"utf8",
);
const SOURCE_URL =
	"https://www.directoryofnepal.com/company/32565/glow-skin-dental-clinic.html";

test("parseBusinessPage extracts core fields from Glow Skin & Dental Clinic fixture", () => {
	const biz = parseBusinessPage(FIXTURE, SOURCE_URL);

	// Visibility — the runner prints this when the test is verbose.
	// eslint-disable-next-line no-console
	console.log("[parseBusiness.test] scraped name:", biz.name);

	// Load-bearing fields.
	assert.ok(typeof biz.name === "string" && biz.name.length > 0, "name is non-empty");
	assert.equal(biz.sourceId, "32565", "sourceId parsed from URL");
	assert.equal(biz.sourceUrl, SOURCE_URL);

	// Trailing ", <City>" should be stripped.
	assert.equal(
		biz.name.includes(","),
		false,
		`expected trailing city to be stripped; got "${biz.name}"`,
	);

	// Address is defined and contains something address-like.
	assert.ok(
		biz.rawAddress != null && biz.rawAddress.length > 0,
		"rawAddress is defined and non-empty",
	);
	assert.match(
		biz.rawAddress!,
		/Lalitpur|Nepal/,
		`expected rawAddress to reference Lalitpur/Nepal, got "${biz.rawAddress}"`,
	);

	// Phone — prefer the openCallWindow +977 form; fall back to a local number.
	assert.ok(biz.phone, "phone is extracted");
	assert.ok(
		biz.phone!.startsWith("+977") ||
			/^\+?[0-9][0-9\s\-()]{5,}$/.test(biz.phone!),
		`expected plausible Nepalese phone, got "${biz.phone}"`,
	);

	// Category slug from breadcrumb.
	assert.ok(
		biz.sourceCategorySlug && biz.sourceCategorySlug.length > 0,
		"sourceCategorySlug is defined",
	);
	assert.equal(biz.sourceCategorySlug, "dental-clinics");

	// Logo URL is the absolute image.
	assert.ok(biz.logoUrl, "logoUrl is extracted from span.clogo img");
	assert.match(biz.logoUrl!, /^https:\/\//);

	// Website was present on the fixture as an external anchor.
	assert.ok(biz.website, "website is extracted");
	assert.match(biz.website!, /glowskindentalclinic/);

	// Description has the marketing copy.
	assert.ok(
		biz.description && biz.description.length > 50,
		"description is populated with a paragraph of text",
	);

	// Schema shape — the authoritative contract.
	const parsed = scrapedBusinessSchema.safeParse(biz);
	assert.equal(parsed.success, true, "result parses via ScrapedBusiness schema");
});

test("parseBusinessPage throws for non-company URLs", () => {
	assert.throws(
		() => parseBusinessPage("<html></html>", "https://example.com/foo"),
		/Not a directoryofnepal company URL/,
	);
});

test("parseBusinessPage throws when the page has no name", () => {
	const html = `<html><body><div class="breadbar"><a href="https://www.directoryofnepal.com/category/1/foo.html">Foo</a></div></body></html>`;
	assert.throws(
		() => parseBusinessPage(html, "https://www.directoryofnepal.com/company/1/bar.html"),
		/could not locate name/,
	);
});

test("parseBusinessPage throws when the breadcrumb has no category link", () => {
	const html = `<html><body><div class="cname"><h1>Foo Ltd</h1></div></body></html>`;
	assert.throws(
		() => parseBusinessPage(html, "https://www.directoryofnepal.com/company/2/foo.html"),
		/could not locate category slug/,
	);
});
