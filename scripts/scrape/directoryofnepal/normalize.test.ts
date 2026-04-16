/**
 * A6: Unit smoke tests for normalize.ts.
 *
 * Run with: `npx tsx scripts/scrape/directoryofnepal/normalize.test.ts`
 *
 * Uses the built-in `node:test` runner + `node:assert/strict` — no test
 * framework dependency. Exits non-zero on any failure.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
	isUnmappedBusiness,
	normalizeBusiness,
	normalizeCategory,
	toSlug,
	validateEmail,
	validatePhone,
	validateUrl,
} from "./normalize.ts";
import { parseAddress } from "./geoMap.ts";
import type { ScrapedBusiness, ScrapedCategory } from "./types.ts";

/* -------------------------------------------------------------------------- */
/* Case 1: Valid business with full address → all fields populated            */
/* -------------------------------------------------------------------------- */
test("case 1: valid business with full address populates all fields", () => {
	const scraped: ScrapedBusiness = {
		sourceId: "32565",
		sourceUrl: "https://www.directoryofnepal.com/company/32565/glow-skin-dental-clinic.html",
		name: "Glow Skin & Dental Clinic",
		rawAddress: "Second Floor, Indira Bhawan, Damkal Chakrapath, Lalitpur, Nepal",
		phone: "+977-9841234567",
		email: "info@glowclinic.com",
		website: "https://glowclinic.com",
		description: "A dental and skin care clinic in Lalitpur.",
		sourceCategorySlug: "dental-clinics",
		logoUrl: "https://www.directoryofnepal.com/images/20240701_141344.jpg",
	};

	const result = normalizeBusiness(scraped);
	assert.ok(!isUnmappedBusiness(result), "should not be unmapped");
	if (isUnmappedBusiness(result)) return; // type narrowing

	assert.equal(result.name, "Glow Skin & Dental Clinic");
	assert.equal(result.slug, "glow-skin-dental-clinic");
	assert.equal(result.primaryCategorySlug, "hospitals-healthcare");
	assert.equal(result.phone, "+9779841234567");
	assert.equal(result.email, "info@glowclinic.com");
	assert.equal(result.websiteUrl, "https://glowclinic.com/");
	assert.equal(result.logoUrl, "https://www.directoryofnepal.com/images/20240701_141344.jpg");
	assert.equal(result.district, "Lalitpur");
	assert.equal(result.province, "Bagmati");
	assert.equal(result.municipality, "Lalitpur");
	assert.equal(result.starRating, 0);
	assert.equal(result.totalReviews, 0);
	assert.equal(result.trustScore, 0);
	assert.equal(result.status, "active");
	assert.equal(result.isClaimed, false);
	assert.equal(result.isVerified, false);
	assert.deepEqual(result.ratingDistribution, {
		one: 0,
		two: 0,
		three: 0,
		four: 0,
		five: 0,
	});
	assert.ok(result.createdAt > 0);
	assert.equal(result.createdAt, result.updatedAt);
	assert.equal(result.sourceId, "32565");
});

/* -------------------------------------------------------------------------- */
/* Case 2: Invalid phone → undefined, rest of record intact                   */
/* -------------------------------------------------------------------------- */
test("case 2: invalid phone is dropped, rest of record is normalized", () => {
	const scraped: ScrapedBusiness = {
		sourceId: "99999",
		sourceUrl: "https://www.directoryofnepal.com/company/99999/example.html",
		name: "Example Hotel",
		rawAddress: "Kathmandu, Nepal",
		phone: "not-a-phone-number",
		email: "hello@example.com",
		website: "https://example.com",
		description: "Hotel in Kathmandu.",
		sourceCategorySlug: "hotels",
	};

	const result = normalizeBusiness(scraped);
	assert.ok(!isUnmappedBusiness(result), "should not be unmapped");
	if (isUnmappedBusiness(result)) return;

	assert.equal(result.phone, undefined, "invalid phone dropped");
	assert.equal(result.email, "hello@example.com", "email preserved");
	assert.equal(result.websiteUrl, "https://example.com/", "url preserved");
	assert.equal(result.name, "Example Hotel");
	assert.equal(result.primaryCategorySlug, "hotels-resorts");
	assert.equal(result.district, "Kathmandu");
});

/* -------------------------------------------------------------------------- */
/* Case 3: Unknown category → unmapped sentinel                               */
/* -------------------------------------------------------------------------- */
test("case 3: unknown category returns unmapped sentinel", () => {
	const scraped: ScrapedBusiness = {
		sourceId: "11111",
		sourceUrl: "https://www.directoryofnepal.com/company/11111/weird.html",
		name: "Weird Things Ltd",
		rawAddress: "Pokhara, Nepal",
		sourceCategorySlug: "taxidermy-services", // not in our map
	};

	const result = normalizeBusiness(scraped);
	assert.ok(isUnmappedBusiness(result), "should be unmapped");
	if (!isUnmappedBusiness(result)) return;

	assert.equal(result.unmapped, true);
	assert.match(result.reason, /taxidermy-services/);
	assert.equal(result.raw.sourceId, "11111");
});

/* -------------------------------------------------------------------------- */
/* Case 4: Messy address → parseAddress returns best-effort fields            */
/* -------------------------------------------------------------------------- */
test("case 4: messy address parses best-effort", () => {
	// Extra whitespace, parenthetical alternate, duplicate commas, trailing Nepal.
	const parsed = parseAddress(
		"Second Floor, Indira Bhawan, Damkal Chakrapath, Thadodhunga (Dhobighat),,Lalitpur, Nepal",
	);
	assert.equal(parsed.district, "Lalitpur");
	assert.equal(parsed.province, "Bagmati");
	assert.equal(parsed.municipality, "Lalitpur");
	// The leftover address must contain the non-admin tokens.
	assert.match(parsed.address, /Indira Bhawan/);
	assert.match(parsed.address, /Damkal Chakrapath/);

	// Completely unrecognised address → address field holds the trimmed input.
	const garbage = parseAddress("  Atlantis, Underwater City  ");
	assert.equal(garbage.district, undefined);
	assert.equal(garbage.province, undefined);
	assert.equal(garbage.municipality, undefined);
	assert.equal(garbage.address, "Atlantis, Underwater City");

	// Empty → empty address, no admin fields.
	const empty = parseAddress("");
	assert.deepEqual(empty, { address: "" });
});

/* -------------------------------------------------------------------------- */
/* Case 5: Category normalization with sortOrder                              */
/* -------------------------------------------------------------------------- */
test("case 5: category normalization with sortOrder", () => {
	const scraped: ScrapedCategory = {
		sourceId: "906",
		slug: "dental-clinics",
		name: "Dental Clinics",
		url: "https://www.directoryofnepal.com/category/906/dental-clinics.html",
		parentClass: "Health & Medicine",
	};

	const normalized = normalizeCategory(scraped, 7);
	assert.equal(normalized.name, "Dental Clinics");
	assert.equal(normalized.slug, "dental-clinics");
	assert.equal(normalized.sortOrder, 7);
	assert.equal(normalized.isActive, true);
	assert.equal(normalized.businessCount, 0);
	assert.equal(normalized.description, "");
	assert.equal(normalized.nameNe, undefined);
	assert.ok(normalized.createdAt > 0);
});

/* -------------------------------------------------------------------------- */
/* Case 6 (bonus): helper sanity                                              */
/* -------------------------------------------------------------------------- */
test("case 6: helpers behave", () => {
	assert.equal(toSlug("Foo Bar!! Baz"), "foo-bar-baz");
	assert.equal(toSlug("  --Trim-- "), "trim");
	assert.equal(toSlug(""), "");

	assert.equal(validatePhone(undefined), undefined);
	assert.equal(validatePhone(""), undefined);
	assert.equal(validatePhone("abc"), undefined);
	assert.equal(validatePhone("+977 9841-234567"), "+9779841234567");
	assert.equal(validatePhone("9841234567"), "9841234567");
	assert.equal(validatePhone("01-4567890"), "014567890");

	assert.equal(validateEmail(undefined), undefined);
	assert.equal(validateEmail("not an email"), undefined);
	assert.equal(validateEmail("a@b.co"), "a@b.co");

	assert.equal(validateUrl(undefined), undefined);
	assert.equal(validateUrl("not a url"), undefined);
	assert.equal(validateUrl("https://example.com"), "https://example.com/");
});
