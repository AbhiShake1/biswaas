/**
 * A4 · Business detail page parser for directoryofnepal.com.
 *
 * Two entry points:
 *   - `parseBusinessPage(html, sourceUrl)` — pure, offline, deterministic.
 *     Throws if the page doesn't look like a business detail page.
 *   - `scrapeBusiness(fetcher, url)` — fetches via the shared fetcher and
 *     delegates to `parseBusinessPage`. Network + parse errors propagate.
 *
 * The layout is label-driven (see recon doc §4): contact fields live in
 * repeating `div.cmp-item` blocks where `div.param` holds the label and
 * `div.val` holds the value. Address is special — on the profile block the
 * label and value share a single `div.param` prefixed "Address:".
 *
 * Be defensive: labels may be missing, wrapped in `<strong>`, or absent
 * entirely. Never throw on a missing optional field.
 */
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Fetcher } from "../shared/fetcher.ts";
import { type ScrapedBusiness, scrapedBusinessSchema } from "./types.ts";

const BASE_HOST = "https://www.directoryofnepal.com";
const COMPANY_PATH_RE = /^\/company\/(\d+)\/([^/]+)\.html$/;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normText(s: string | undefined | null): string {
	if (s == null) return "";
	return s.replace(/\s+/g, " ").trim();
}

/**
 * Find the child `div.val` text for the `div.cmp-item` whose `div.param`
 * matches `predicate`. Returns `undefined` if no matching item exists.
 */
function findValueByLabel(
	$: CheerioAPI,
	predicate: (labelText: string) => boolean,
): string | undefined {
	let result: string | undefined;
	$("div.cmp-item").each((_i, el) => {
		if (result != null) return;
		const $item = $(el);
		const labelText = normText($item.children("div.param").first().text());
		if (!labelText) return;
		if (!predicate(labelText)) return;
		const val = normText($item.children("div.val").first().text());
		if (val) result = val;
	});
	return result;
}

/**
 * Parse sourceId + slug from a `/company/{id}/{slug}.html` URL.
 * Throws if the URL doesn't match the company path pattern.
 */
function parseSourceIdFromUrl(sourceUrl: string): string {
	const path = (() => {
		try {
			return new URL(sourceUrl).pathname;
		} catch {
			return sourceUrl;
		}
	})();
	const m = COMPANY_PATH_RE.exec(path);
	if (!m) {
		throw new Error(
			`Not a directoryofnepal company URL: ${sourceUrl}`,
		);
	}
	return m[1];
}

/**
 * Strip a trailing ", <city>" suffix from the business name, e.g.
 * "Beyond The Limits Treks, Kathmandu" → "Beyond The Limits Treks".
 * Only strips when there's a single trailing comma — preserves commas inside
 * legitimate multi-comma names.
 */
function stripTrailingCity(name: string): string {
	const idx = name.lastIndexOf(",");
	if (idx < 0) return name;
	// Only strip if the tail looks like a city-ish token (1-3 words, letters).
	const tail = name.slice(idx + 1).trim();
	if (tail.length === 0) return name.slice(0, idx).trim();
	if (!/^[A-Za-z][A-Za-z .'-]{1,40}$/.test(tail)) return name;
	const words = tail.split(/\s+/);
	if (words.length > 3) return name;
	return name.slice(0, idx).trim();
}

function absoluteUrl(
	raw: string | undefined,
	base: string = BASE_HOST,
): string | undefined {
	if (!raw) return undefined;
	try {
		return new URL(raw, `${base}/`).toString();
	} catch {
		return undefined;
	}
}

/* -------------------------------------------------------------------------- */
/* Field extractors                                                           */
/* -------------------------------------------------------------------------- */

function extractName($: CheerioAPI): string {
	const raw = normText($("div.cname > h1").first().text());
	return stripTrailingCity(raw);
}

function extractAddress($: CheerioAPI): string | undefined {
	// Profile block stores address in a single `div.param` prefixed "Address:".
	const $profile = $("div.cmp-item#profile, div.cmp-item.company_profile").first();
	const $scope = $profile.length > 0 ? $profile : $.root();
	let addr: string | undefined;
	$scope.find("div.param").each((_i, el) => {
		if (addr != null) return;
		const text = normText($(el).text());
		if (/^Address\s*:/i.test(text)) {
			addr = text.replace(/^Address\s*:\s*/i, "").trim();
		}
	});
	if (addr != null && addr.length > 0) return addr;
	// Fallback: label-driven lookup in case layout shifts.
	const fallback = findValueByLabel($, (l) => /^address\b/i.test(l));
	return fallback;
}

function extractPhone($: CheerioAPI): string | undefined {
	// Prefer the `onclick="openCallWindow('+977-...')"` arg — it is the raw
	// site-curated number.
	let phone: string | undefined;
	$("a[onclick*='openCallWindow']").each((_i, el) => {
		if (phone != null) return;
		const onclick = $(el).attr("onclick") ?? "";
		const m = /openCallWindow\(\s*['"]([^'"]+)['"]/i.exec(onclick);
		if (m) phone = m[1].trim();
	});
	if (phone) return phone;
	// Fallback: labelled "Contact Numbers (Mobile)" / "Landline" value text.
	const mobile = findValueByLabel($, (l) =>
		/contact numbers \(mobile\)/i.test(l),
	);
	if (mobile) return mobile;
	const landline = findValueByLabel($, (l) => /^landline/i.test(l));
	return landline;
}

function extractEmail($: CheerioAPI): string | undefined {
	let email: string | undefined;
	$("a[href^='mailto:']").each((_i, el) => {
		if (email != null) return;
		const href = $(el).attr("href") ?? "";
		const addr = href.replace(/^mailto:/i, "").split("?")[0].trim();
		if (addr.length > 0) email = addr;
	});
	return email;
}

function extractWebsite($: CheerioAPI): string | undefined {
	// Prefer label-driven lookup for the "Website" row; take the first
	// external anchor href within its `div.val`.
	let website: string | undefined;
	$("div.cmp-item").each((_i, el) => {
		if (website != null) return;
		const $item = $(el);
		const label = normText($item.children("div.param").first().text());
		if (!/^website$/i.test(label)) return;
		const href = $item.children("div.val").find("a[href]").first().attr("href");
		if (href) website = href.trim();
	});
	return website;
}

function extractDescription($: CheerioAPI): string | undefined {
	// Main description block is `div.profile > p` inside the profile cmp-item.
	const desc = normText(
		$("div.cmp-item#profile div.profile").first().text(),
	);
	if (desc.length > 0) return desc;
	// Fallback: any top-level `div.profile > p`.
	const fallback = normText($("div.profile").first().text());
	return fallback.length > 0 ? fallback : undefined;
}

/**
 * Pull the category slug from the breadcrumb. We want the `/category/{id}/{slug}.html`
 * link. Returns the raw slug (may or may not have the `list-of-` prefix — the
 * mapper strips it).
 */
function extractCategorySlug($: CheerioAPI): string | undefined {
	let slug: string | undefined;
	$("div.breadbar a[href*='/category/']").each((_i, el) => {
		if (slug != null) return;
		const href = $(el).attr("href") ?? "";
		try {
			const path = new URL(href, `${BASE_HOST}/`).pathname;
			const m = /^\/category\/\d+\/([^/]+)\.html$/.exec(path);
			if (m) slug = m[1];
		} catch {
			/* ignore */
		}
	});
	if (slug) return slug;
	// Fallback: the "Listed in following Categories" cmp-item has a category anchor.
	$("div.cmp-item div.val a[href*='/category/']").each((_i, el) => {
		if (slug != null) return;
		const href = $(el).attr("href") ?? "";
		try {
			const path = new URL(href, `${BASE_HOST}/`).pathname;
			const m = /^\/category\/\d+\/([^/]+)\.html$/.exec(path);
			if (m) slug = m[1];
		} catch {
			/* ignore */
		}
	});
	return slug;
}

function extractLogoUrl($: CheerioAPI): string | undefined {
	const src = $("span.clogo img[src]").first().attr("src");
	return absoluteUrl(src);
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Parse a business detail page. Pure / offline.
 *
 * Throws if the URL isn't a /company/... URL or the required fields (name,
 * sourceCategorySlug) cannot be located — those are load-bearing and their
 * absence indicates the page layout has drifted or the URL was misrouted.
 */
export function parseBusinessPage(
	html: string,
	sourceUrl: string,
): ScrapedBusiness {
	const sourceId = parseSourceIdFromUrl(sourceUrl);
	const $ = cheerio.load(html);

	const name = extractName($);
	if (!name) {
		throw new Error(
			`parseBusinessPage: could not locate name (div.cname > h1) for ${sourceUrl}`,
		);
	}

	const sourceCategorySlug = extractCategorySlug($);
	if (!sourceCategorySlug) {
		throw new Error(
			`parseBusinessPage: could not locate category slug in breadcrumb for ${sourceUrl}`,
		);
	}

	const raw: ScrapedBusiness = {
		sourceId,
		sourceUrl,
		name,
		rawAddress: extractAddress($),
		phone: extractPhone($),
		email: extractEmail($),
		website: extractWebsite($),
		description: extractDescription($),
		sourceCategorySlug,
		logoUrl: extractLogoUrl($),
	};

	// Validate once so downstream agents never get a malformed record.
	const check = scrapedBusinessSchema.safeParse(raw);
	if (!check.success) {
		throw new Error(
			`parseBusinessPage: schema validation failed for ${sourceUrl}: ${check.error.message}`,
		);
	}
	return check.data;
}

/**
 * Fetch + parse. All HTTP goes through the shared fetcher.
 */
export async function scrapeBusiness(
	fetcher: Fetcher,
	url: string,
): Promise<ScrapedBusiness> {
	const html = await fetcher.fetchHtml(url);
	return parseBusinessPage(html, url);
}
