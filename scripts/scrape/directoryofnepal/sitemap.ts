/**
 * Sitemap-based URL discovery for directoryofnepal.com.
 *
 * The site publishes a single flat sitemap.xml (~32k URLs) listing every
 * category, class, and business. Using the sitemap directly eliminates
 * category pagination walking and cuts discovery from hundreds of requests
 * to exactly one — see docs/scraping/api-discovery.md.
 */
import type { Fetcher } from "../shared/fetcher.ts";

const SITEMAP_URL = "https://www.directoryofnepal.com/sitemap.xml";

export type SitemapResult = {
	categories: string[]; // /category/{id}/{slug}.html
	companies: string[]; // /company/{id}/{slug}.html
	classes: string[]; //   /class/{id}/{slug}.html
};

/**
 * Pure: extract URLs from sitemap XML and bucket by path type.
 */
export function parseSitemap(xml: string): SitemapResult {
	const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
		(m) => m[1] ?? "",
	);
	const out: SitemapResult = { categories: [], companies: [], classes: [] };
	for (const u of urls) {
		if (!u) continue;
		try {
			const parsed = new URL(u);
			const path = parsed.pathname;
			if (path.startsWith("/category/")) out.categories.push(u);
			else if (path.startsWith("/company/")) out.companies.push(u);
			else if (path.startsWith("/class/")) out.classes.push(u);
		} catch {
			// Malformed URL — skip
		}
	}
	return out;
}

export async function discoverFromSitemap(
	fetcher: Fetcher,
): Promise<SitemapResult> {
	const xml = await fetcher.fetchHtml(SITEMAP_URL);
	return parseSitemap(xml);
}
