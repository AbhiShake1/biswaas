/**
 * A6: Normalization pipeline.
 *
 * Turns raw `ScrapedCategory` / `ScrapedBusiness` records into
 * `NormalizedCategory` / `NormalizedBusiness` records matching the Convex
 * insert shapes.
 *
 * Rules:
 *   - Invalid phone / email / URL values are dropped to `undefined`, NOT
 *     propagated as empty strings. The record itself still normalizes.
 *   - A business whose source category slug does not map to a known
 *     internal category returns `{ unmapped: true, reason, raw }` so
 *     callers can write it to `_unmapped.json` for manual review.
 *   - `createdAt` and `updatedAt` are both set to `Date.now()` at
 *     normalization time.
 *   - `trustScore` is seeded to 0 — the real computation lives in
 *     `convex/lib/trustScore.ts` and runs when reviews land.
 */
import { mapCategorySlug, UNMAPPED_SLUG } from "./categoryMap.ts";
import { parseAddress } from "./geoMap.ts";
import type {
	NormalizedBusiness,
	NormalizedCategory,
	ScrapedBusiness,
	ScrapedCategory,
	UnmappedBusiness,
} from "./types.ts";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Kebab-case a name. Strips all non-alphanumerics, collapses hyphens,
 * lowercases. No uniqueness suffix — dedup is the ingest layer's job.
 */
export function toSlug(name: string): string {
	return (name ?? "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Phone validator: strip whitespace + inline separators, keep either
 * E.164-style ("+<digits>") or obvious Nepali formats (10-digit mobile
 * starting with 98/97, or landline 01-XXXXXXX, etc.). Returns undefined
 * for anything unrecognised — never throws.
 */
export function validatePhone(s?: string): string | undefined {
	if (!s) return undefined;
	// Strip spaces, hyphens, parens, slashes, common separators.
	const cleaned = s.replace(/[\s\-()./]/g, "");
	if (cleaned.length === 0) return undefined;

	// E.164-ish: leading +, then 8–15 digits.
	if (/^\+\d{8,15}$/.test(cleaned)) return cleaned;

	// Nepali mobile: 10 digits starting with 98 or 97.
	if (/^9[78]\d{8}$/.test(cleaned)) return cleaned;

	// Nepali landline with leading 0 area code: 01XXXXXXX or 0XX-XXXXXXX etc.
	if (/^0\d{6,9}$/.test(cleaned)) return cleaned;

	// Bare 7–10 digit local number.
	if (/^\d{7,10}$/.test(cleaned)) return cleaned;

	return undefined;
}

/**
 * Email validator: RFC-5322-lite. Must contain exactly one @, with at
 * least one char before and a TLD-bearing host after. No fancy quoting.
 */
export function validateEmail(s?: string): string | undefined {
	if (!s) return undefined;
	const trimmed = s.trim();
	if (trimmed.length === 0) return undefined;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return undefined;
	return trimmed;
}

/**
 * URL validator: must parse via `new URL()`. Returns the normalized form
 * (URL.toString()) so whitespace / casing of the scheme is cleaned up.
 */
export function validateUrl(s?: string): string | undefined {
	if (!s) return undefined;
	const trimmed = s.trim();
	if (trimmed.length === 0) return undefined;
	try {
		return new URL(trimmed).toString();
	} catch {
		return undefined;
	}
}

/**
 * Seeded trust score. Real computation lives in `convex/lib/trustScore.ts`
 * and runs on review ingest — we deliberately don't duplicate it here.
 */
export function computeInitialTrustScore(): number {
	return 0;
}

const EMPTY_RATING_DISTRIBUTION = {
	one: 0,
	two: 0,
	three: 0,
	four: 0,
	five: 0,
} as const;

/* -------------------------------------------------------------------------- */
/* Category                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Normalize a scraped category into the Convex `categories` insert shape.
 * Caller supplies `sortOrder` (usually the index in the crawl run).
 */
export function normalizeCategory(
	scraped: ScrapedCategory,
	sortOrder: number,
): NormalizedCategory {
	const slug = toSlug(scraped.slug || scraped.name);
	return {
		name: scraped.name.trim(),
		// nameNe: left undefined — translation is a separate pass.
		nameNe: undefined,
		slug,
		description: "", // DoN category pages don't carry descriptions; leave empty.
		descriptionNe: undefined,
		iconUrl: undefined,
		businessCount: 0, // ingest layer updates this after businesses land.
		sortOrder,
		isActive: true,
		createdAt: Date.now(),
	};
}

/* -------------------------------------------------------------------------- */
/* Business                                                                    */
/* -------------------------------------------------------------------------- */

export type NormalizeBusinessOptions = {
	/**
	 * When true (full-site ingest default), use the source's own bare category
	 * slug (stripped of any `list-of-` prefix) as `primaryCategorySlug` — skips
	 * the curated `categoryMap` entirely. When false (legacy behaviour, used by
	 * tests), route unmapped categories to the `UnmappedBusiness` sentinel.
	 */
	useSourceCategory?: boolean;
};

function stripListOfPrefix(slug: string): string {
	const s = slug.trim().toLowerCase();
	return s.startsWith("list-of-") ? s.slice("list-of-".length) : s;
}

/**
 * Normalize a scraped business into the Convex `businesses` insert shape.
 * Returns an `UnmappedBusiness` sentinel when the source category is not in
 * our static map — caller should collect these into `_unmapped.json`.
 *
 * Pass `{ useSourceCategory: true }` to bypass the categoryMap and use the
 * source slug directly (required for full-site ingest where we surface all
 * 368 source categories).
 */
export function normalizeBusiness(
	scraped: ScrapedBusiness,
	opts: NormalizeBusinessOptions = {},
): NormalizedBusiness | UnmappedBusiness {
	let resolvedCategorySlug: string;

	if (opts.useSourceCategory) {
		const bare = stripListOfPrefix(scraped.sourceCategorySlug);
		if (!bare) {
			return {
				unmapped: true,
				reason: "Empty source category slug",
				raw: scraped,
			};
		}
		resolvedCategorySlug = bare;
	} else {
		const categoryMatch = mapCategorySlug(scraped.sourceCategorySlug);
		if (!categoryMatch.isMapped || categoryMatch.slug === UNMAPPED_SLUG) {
			return {
				unmapped: true,
				reason: `No category mapping for source slug '${scraped.sourceCategorySlug}'`,
				raw: scraped,
			};
		}
		resolvedCategorySlug = categoryMatch.slug;
	}

	const parsed = parseAddress(scraped.rawAddress ?? "");
	const now = Date.now();
	const slug = toSlug(scraped.name);
	const description = (scraped.description ?? "").trim();

	return {
		name: scraped.name.trim(),
		nameNe: undefined,
		slug,
		description,
		descriptionNe: undefined,
		websiteUrl: validateUrl(scraped.website),
		phone: validatePhone(scraped.phone),
		email: validateEmail(scraped.email),
		logoUrl: validateUrl(scraped.logoUrl),
		coverUrl: undefined, // DoN has no business cover images.
		province: parsed.province,
		district: parsed.district,
		municipality: parsed.municipality,
		address: parsed.address || undefined,
		coordinates: undefined, // Optional; the scraper may supply lat/lng in a future pass.
		primaryCategorySlug: resolvedCategorySlug,
		trustScore: computeInitialTrustScore(),
		starRating: 0,
		totalReviews: 0,
		ratingDistribution: { ...EMPTY_RATING_DISTRIBUTION },
		isClaimed: false,
		isVerified: false,
		status: "active",
		metaTitle: undefined,
		metaDescription: undefined,
		sourceId: scraped.sourceId,
		sourceUrl: scraped.sourceUrl,
		createdAt: now,
		updatedAt: now,
	};
}

/** Type guard for consumers that pipe through `normalizeBusiness`. */
export function isUnmappedBusiness(
	value: NormalizedBusiness | UnmappedBusiness,
): value is UnmappedBusiness {
	return (value as UnmappedBusiness).unmapped === true;
}
