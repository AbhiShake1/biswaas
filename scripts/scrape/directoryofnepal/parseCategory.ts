/**
 * A3 · Category listing parser + pagination walker for directoryofnepal.com.
 *
 * Listing page URL shape (recon doc §3):
 *   page 1: `/category/{id}/{slug}.html`
 *   page N: `/category/{page}/{id}/{slug}.html.html`   ← quirk: double ".html"
 *
 * Business links on a listing page match `/company/{id}/{slug}.html` — the
 * catalogue can render the same business twice (left-part logo anchor + h2
 * anchor), so we de-duplicate while preserving first-seen order.
 */
import * as cheerio from "cheerio";
import type { Fetcher } from "../shared/fetcher.ts";
import type { ScrapedCategory } from "./types.ts";

const BASE_HOST = "https://www.directoryofnepal.com";
const COMPANY_PATH_RE = /^\/company\/\d+\/[^/]+\.html$/;
const PAGINATION_REL_RE =
	/^(?:\/)?category\/(\d+)\/(\d+)\/([^/]+?)\.html\.html$/;

export type CategoryPageParse = {
	businessUrls: string[];
	nextPageUrl: string | null;
};

function normalizeHref(href: string): string | null {
	if (!href) return null;
	try {
		const u = new URL(href, `${BASE_HOST}/`);
		if (u.host !== "www.directoryofnepal.com" && u.host !== "directoryofnepal.com") {
			return null;
		}
		u.host = "www.directoryofnepal.com";
		u.protocol = "https:";
		// Strip fragments like `#enquiry` on company links.
		u.hash = "";
		return u.toString();
	} catch {
		return null;
	}
}

function pathnameOf(url: string): string | null {
	try {
		return new URL(url).pathname;
	} catch {
		return null;
	}
}

/**
 * Pure HTML parse — offline, deterministic, easy to unit-test.
 *
 * @param html       raw HTML of a category listing page
 * @param currentUrl the URL the HTML was fetched from; used as a fallback to
 *                   derive the "next" page when the DOM doesn't advertise one
 *                   (rare, but guards against layout drift).
 */
export function parseCategoryPage(
	html: string,
	currentUrl?: string,
): CategoryPageParse {
	const $ = cheerio.load(html);

	// 1 · Business URLs — dedupe while preserving order.
	const seen = new Set<string>();
	const businessUrls: string[] = [];
	$("a[href]").each((_i, el) => {
		const href = $(el).attr("href");
		if (!href) return;
		const abs = normalizeHref(href);
		if (abs == null) return;
		const path = pathnameOf(abs);
		if (path == null) return;
		if (!COMPANY_PATH_RE.test(path)) return;
		if (seen.has(abs)) return;
		seen.add(abs);
		businessUrls.push(abs);
	});

	// 2 · Next page detection.
	//    Pagination bar is in `div.paging_bar`. We look for the "Next »" link
	//    first; if absent, fall back to the lowest numbered page > current.
	let nextPageUrl: string | null = null;

	const $paging = $("div.paging_bar").first();
	if ($paging.length > 0) {
		// The explicit "Next »" anchor lives inside `span.pg_btn.next > a`.
		$paging.find("span.pg_btn.next a[href]").each((_i, el) => {
			if (nextPageUrl != null) return;
			const href = $(el).attr("href");
			if (!href) return;
			const abs = normalizeHref(href);
			if (abs == null) return;
			const path = pathnameOf(abs);
			if (path == null) return;
			const m = PAGINATION_REL_RE.exec(path.replace(/^\//, "/"));
			if (!m) return;
			nextPageUrl = abs;
		});

		// Fallback: pick the numeric page anchor whose number is exactly
		// currentPage + 1 (works even if the "Next" CSS class moves).
		if (nextPageUrl == null) {
			const currentPage = inferCurrentPage(currentUrl);
			const wanted = currentPage + 1;
			$paging.find("a[href]").each((_i, el) => {
				if (nextPageUrl != null) return;
				const href = $(el).attr("href");
				if (!href) return;
				const abs = normalizeHref(href);
				if (abs == null) return;
				const path = pathnameOf(abs);
				if (path == null) return;
				const m = PAGINATION_REL_RE.exec(path);
				if (!m) return;
				const [, pageStr] = m;
				if (Number(pageStr) === wanted) nextPageUrl = abs;
			});
		}
	}

	return { businessUrls, nextPageUrl };
}

function inferCurrentPage(url: string | undefined): number {
	if (url == null) return 1;
	const path = pathnameOf(url);
	if (path == null) return 1;
	const m = PAGINATION_REL_RE.exec(path);
	if (m) {
		const page = Number(m[1]);
		return Number.isFinite(page) && page > 0 ? page : 1;
	}
	// Page-1 URL shape `/category/{id}/{slug}.html` → treat as 1.
	return 1;
}

/**
 * Walk every listing page for a category and return every business URL found.
 *
 * Stops when:
 *   - the page has no "next" link, OR
 *   - `limit` is reached (counts business URLs, not pages), OR
 *   - we loop back to a URL we already visited (hard guard).
 *
 * Failures on a single page are caught and logged via the caller-supplied
 * `onError` hook (if any) — we never abort the whole crawl because one page
 * 500'd. Downstream A4 will handle per-business failures separately.
 */
export async function crawlCategory(
	fetcher: Fetcher,
	cat: ScrapedCategory,
	limit?: number,
	opts?: {
		onError?: (url: string, err: unknown) => void;
		onPage?: (url: string, urlsFound: number) => void;
	},
): Promise<string[]> {
	const maxPagesHardCap = 500; // paranoia; real max observed is ~8.
	const collected: string[] = [];
	const collectedSet = new Set<string>();
	const visited = new Set<string>();

	let nextUrl: string | null = cat.url;
	let pages = 0;

	while (nextUrl != null && pages < maxPagesHardCap) {
		if (visited.has(nextUrl)) break;
		visited.add(nextUrl);
		pages += 1;

		let html: string;
		try {
			html = await fetcher.fetchHtml(nextUrl);
		} catch (err) {
			opts?.onError?.(nextUrl, err);
			break;
		}

		let parsed: CategoryPageParse;
		try {
			parsed = parseCategoryPage(html, nextUrl);
		} catch (err) {
			opts?.onError?.(nextUrl, err);
			break;
		}

		for (const url of parsed.businessUrls) {
			if (collectedSet.has(url)) continue;
			collectedSet.add(url);
			collected.push(url);
			if (limit != null && collected.length >= limit) break;
		}

		opts?.onPage?.(nextUrl, parsed.businessUrls.length);

		if (limit != null && collected.length >= limit) break;
		nextUrl = parsed.nextPageUrl;
	}

	return collected;
}
