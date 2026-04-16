/**
 * A3 · Category discovery for directoryofnepal.com.
 *
 * Fetches the top-level `/browse-categories` index and extracts every
 * `/category/{id}/{slug}.html` link. Each category link is annotated with
 * its parent "class" when the markup groups categories under a
 * `/class/{id}/{slug}.html` heading (see recon doc §3).
 *
 * All HTTP calls go through the shared fetcher so rate limiting, robots.txt,
 * and caching behave consistently across the pipeline.
 */
import * as cheerio from "cheerio";
import type { Fetcher } from "../shared/fetcher.ts";
import type { ScrapedCategory } from "./types.ts";

const BASE_HOST = "https://www.directoryofnepal.com";
const BROWSE_URL = `${BASE_HOST}/browse-categories`;

const CATEGORY_PATH_RE = /^\/category\/(\d+)\/([^/]+?)\.html$/;
const CLASS_PATH_RE = /^\/class\/(\d+)\/([^/]+?)\.html$/;

function toAbsolute(href: string): string | null {
	if (!href) return null;
	try {
		// Absolute URL already — keep as-is after normalizing to www host.
		const u = new URL(href, `${BASE_HOST}/`);
		if (u.host !== "www.directoryofnepal.com" && u.host !== "directoryofnepal.com") {
			return null;
		}
		u.host = "www.directoryofnepal.com";
		u.protocol = "https:";
		return u.toString();
	} catch {
		return null;
	}
}

function parseCategoryLink(href: string):
	| { sourceId: string; slug: string; absolute: string }
	| null {
	const absolute = toAbsolute(href);
	if (absolute == null) return null;
	let path: string;
	try {
		path = new URL(absolute).pathname;
	} catch {
		return null;
	}
	const m = CATEGORY_PATH_RE.exec(path);
	if (!m) return null;
	const [, sourceId, slug] = m;
	return { sourceId, slug, absolute };
}

function parseClassLink(href: string):
	| { slug: string; name?: string }
	| null {
	const absolute = toAbsolute(href);
	if (absolute == null) return null;
	let path: string;
	try {
		path = new URL(absolute).pathname;
	} catch {
		return null;
	}
	const m = CLASS_PATH_RE.exec(path);
	if (!m) return null;
	const [, , slug] = m;
	return { slug };
}

/**
 * Pure DOM parse — extracted for testability.
 * Walks every anchor whose pathname matches `/category/{id}/{slug}.html` and
 * returns a de-duplicated list. When a category link sits inside a block that
 * also contains a `/class/...` anchor, the nearest class slug is recorded as
 * `parentClass`.
 */
export function parseBrowseCategoriesPage(html: string): ScrapedCategory[] {
	const $ = cheerio.load(html);
	const seen = new Map<string, ScrapedCategory>();

	$("a[href]").each((_i, el) => {
		const $el = $(el);
		const href = $el.attr("href");
		if (!href) return;
		const parsed = parseCategoryLink(href);
		if (!parsed) return;

		const { sourceId, slug, absolute } = parsed;
		// Skip if we already captured this id (pages sometimes re-list categories
		// in sidebars or footers).
		if (seen.has(sourceId)) return;

		const name = ($el.text() || slug).trim().replace(/\s+/g, " ");
		if (!name) return;

		// Look for an enclosing container that also contains a class link.
		let parentClass: string | undefined;
		const containers = $el.parents().toArray();
		for (const c of containers) {
			const classAnchors = $(c).find("a[href]").filter((_j, a) => {
				const h = $(a).attr("href");
				return h != null && parseClassLink(h) != null;
			});
			if (classAnchors.length > 0) {
				const first = classAnchors.first();
				const classHref = first.attr("href");
				if (classHref != null) {
					const pc = parseClassLink(classHref);
					if (pc) {
						parentClass = pc.slug;
						break;
					}
				}
			}
		}

		seen.set(sourceId, {
			sourceId,
			slug,
			name,
			url: absolute,
			...(parentClass ? { parentClass } : {}),
		});
	});

	return Array.from(seen.values());
}

/**
 * Fetch the browse-categories index through the shared fetcher and return
 * every category link annotated with its parent class (when present).
 */
export async function discoverCategories(
	fetcher: Fetcher,
): Promise<ScrapedCategory[]> {
	const html = await fetcher.fetchHtml(BROWSE_URL);
	return parseBrowseCategoriesPage(html);
}
