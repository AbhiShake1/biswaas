/**
 * A6: External (directoryofnepal.com) → internal Biswaas category slug map.
 *
 * The DoN taxonomy is three-level (class → category → company). We flatten
 * to Biswaas's single-level category taxonomy. MVP is conservative: a static
 * lookup covering the most common categories. Unmapped slugs are surfaced
 * via `isMapped: false` and handled by callers (skip or write to
 * `_unmapped.json`).
 *
 * NOTE: the keys are the DoN category slug (the part after the numeric ID
 * in `/category/{id}/{slug}.html`). Values are Biswaas internal slugs that
 * match what `src/lib/data/businesses.ts` already uses, so ingest can reuse
 * the existing seeded categories without collision.
 */

/**
 * Sentinel returned when a source slug has no mapping.
 * Callers (ingest) should treat this as "skip + log" rather than inserting.
 */
export const UNMAPPED_SLUG = "_unmapped";

/**
 * Static DoN slug → internal slug map.
 * Keep entries conservative: only add a row when we've seen the slug
 * actually appear on directoryofnepal.com.
 */
const DIRECT_MAP: Record<string, string> = {
	// Hotels & hospitality
	"hotels": "hotels-resorts",
	"resorts": "hotels-resorts",
	"restaurants": "restaurants",
	"cafes": "restaurants",
	"bars-pubs": "restaurants",

	// Tourism
	"trek-agencies": "trekking-tourism",
	"travel-agencies": "trekking-tourism",
	"tour-operators": "trekking-tourism",
	"trekking": "trekking-tourism",

	// Education
	"education": "education-consultancies",
	"education-consultancies": "education-consultancies",
	"schools": "education-consultancies",
	"colleges": "education-consultancies",
	"universities": "education-consultancies",
	"training-institutes": "education-consultancies",

	// Health & medicine
	"hospitals": "hospitals-healthcare",
	"clinics": "hospitals-healthcare",
	"dental-clinics": "hospitals-healthcare",
	"pharmacies": "hospitals-healthcare",
	"diagnostic-centers": "hospitals-healthcare",

	// Banking & finance
	"banks": "banking-finance",
	"commercial-banks": "banking-finance",
	"finance-companies": "banking-finance",
	"insurance-companies": "banking-finance",

	// E-commerce / shopping
	"ecommerce": "ecommerce",
	"online-stores": "ecommerce",
	"shopping-stores": "ecommerce",

	// Telecom / ISPs
	"isp": "isp-telecom",
	"internet-service-providers": "isp-telecom",
	"telecom": "isp-telecom",
	"telecommunications": "isp-telecom",
};

export type CategoryMapResult = {
	slug: string;
	isMapped: boolean;
};

/**
 * Strip the `list-of-` prefix that directoryofnepal's browse-categories index
 * prepends to category slugs (e.g. `list-of-education` → `education`). The
 * lookup table above is keyed on the bare form, so we preprocess the input.
 */
function stripListOfPrefix(s: string): string {
	return s.startsWith("list-of-") ? s.slice("list-of-".length) : s;
}

/**
 * Map a directoryofnepal.com category slug to a Biswaas internal slug.
 *
 * @returns an object with the resolved slug (or `UNMAPPED_SLUG`) and a
 *          boolean indicating whether the match was explicit.
 */
export function mapCategorySlug(sourceSlug: string): CategoryMapResult {
	if (!sourceSlug) return { slug: UNMAPPED_SLUG, isMapped: false };
	const key = stripListOfPrefix(sourceSlug.trim().toLowerCase());
	const direct = DIRECT_MAP[key];
	if (direct) return { slug: direct, isMapped: true };
	return { slug: UNMAPPED_SLUG, isMapped: false };
}

/**
 * Exposed for tests / debugging — returns all known source slugs.
 */
export function listSourceSlugs(): string[] {
	return Object.keys(DIRECT_MAP).sort();
}
