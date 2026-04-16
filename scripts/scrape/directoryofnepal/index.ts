#!/usr/bin/env -S node
/**
 * A3 · directoryofnepal.com scraper CLI.
 *
 * Flow:
 *   1. Fetch /browse-categories → write `categories.json`.
 *   2. If --category=<slug> passed, filter to just that category.
 *   3. For each selected category, walk listing pages and collect business
 *      URLs; write `business-urls.json` (plain string array, A4's input).
 *
 * A4 (detail parsing) and A7 (Convex ingest) are out of scope here.
 */
import { Command } from "commander";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
	createFetcher,
	FetcherDisallowedError,
	type Fetcher,
} from "../shared/fetcher.ts";
import { createLogger, type Logger } from "../shared/logger.ts";
import { discoverCategories } from "./discover.ts";
import { crawlCategory } from "./parseCategory.ts";
import { scrapeBusiness } from "./parseBusiness.ts";
import type { ScrapedBusiness, ScrapedCategory } from "./types.ts";

type ScrapeFailure = {
	url: string;
	error: string;
	timestamp: string;
};

type CliOptions = {
	category?: string;
	limit?: string;
	dry?: boolean;
	resume?: boolean;
};

function todayStr(): string {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function resolveRunDir(): string {
	const runDir = join("data", "scraped", "directoryofnepal", todayStr());
	if (!existsSync(runDir)) mkdirSync(runDir, { recursive: true });
	return runDir;
}

function writeJson(runDir: string, file: string, payload: unknown): string {
	const p = join(runDir, file);
	writeFileSync(p, JSON.stringify(payload, null, 2) + "\n", "utf8");
	return p;
}

async function runDiscovery(
	fetcher: Fetcher,
	logger: Logger,
	runDir: string,
): Promise<ScrapedCategory[]> {
	logger.info("discovering categories");
	const categories = await discoverCategories(fetcher);
	const path = writeJson(runDir, "categories.json", categories);
	logger.info("categories discovered", { count: categories.length, path });
	return categories;
}

/**
 * Strip the `list-of-` prefix that directoryofnepal's browse-categories index
 * adds to category slugs. The site's detail URLs use both the bare slug and
 * the `list-of-` slug interchangeably (HTTP 200 for either). Users (and our
 * internal category map) think in the bare form, so we normalize when
 * filtering.
 */
function normalizeSlug(raw: string): string {
	const s = raw.trim().toLowerCase();
	return s.startsWith("list-of-") ? s.slice("list-of-".length) : s;
}

function filterCategories(
	categories: ScrapedCategory[],
	slug: string | undefined,
	logger: Logger,
): ScrapedCategory[] {
	if (!slug) return categories;
	const needle = normalizeSlug(slug);
	const matches = categories.filter((c) => {
		const bare = normalizeSlug(c.slug);
		if (bare === needle) return true;
		// Also accept name-based match (e.g. --category="Education" or
		// --category="education" matching the display name).
		const name = c.name.trim().toLowerCase().replace(/\s+/g, "-");
		return name === needle;
	});
	if (matches.length === 0) {
		logger.warn("no category matched --category flag", {
			requested: slug,
			availableSample: categories.slice(0, 10).map((c) => c.slug),
		});
	}
	return matches;
}

async function crawlSelected(
	fetcher: Fetcher,
	logger: Logger,
	selected: ScrapedCategory[],
	limit: number | undefined,
): Promise<string[]> {
	const all: string[] = [];
	const seen = new Set<string>();

	for (const cat of selected) {
		const remaining =
			limit != null ? Math.max(0, limit - all.length) : undefined;
		if (limit != null && remaining === 0) break;

		logger.info("crawling category", {
			slug: cat.slug,
			sourceId: cat.sourceId,
			url: cat.url,
			...(remaining != null ? { limit: remaining } : {}),
		});

		try {
			const urls = await crawlCategory(fetcher, cat, remaining, {
				onError: (url, err) => {
					logger.error("category page fetch failed", {
						url,
						category: cat.slug,
						error: err instanceof Error ? err.message : String(err),
					});
				},
				onPage: (url, found) => {
					logger.info("category page parsed", {
						url,
						category: cat.slug,
						businessUrls: found,
					});
				},
			});
			for (const u of urls) {
				if (seen.has(u)) continue;
				seen.add(u);
				all.push(u);
				if (limit != null && all.length >= limit) break;
			}
		} catch (err) {
			logger.error("category crawl failed", {
				slug: cat.slug,
				url: cat.url,
				error: err instanceof Error ? err.message : String(err),
			});
		}

		if (limit != null && all.length >= limit) break;
	}

	return all;
}

async function main(opts: CliOptions): Promise<number> {
	const runDir = resolveRunDir();
	const logger = createLogger(runDir);
	const limit = opts.limit != null ? Number(opts.limit) : undefined;

	logger.info("run start", {
		runDir,
		category: opts.category ?? null,
		limit: Number.isFinite(limit) ? limit : null,
		dry: Boolean(opts.dry),
		resume: Boolean(opts.resume),
	});

	if (opts.resume) {
		logger.warn("resume not implemented — continuing as a fresh run");
	}

	const fetcher = createFetcher();

	// 1 · Category discovery (always runs).
	let categories: ScrapedCategory[];
	try {
		categories = await runDiscovery(fetcher, logger, runDir);
	} catch (err) {
		if (err instanceof FetcherDisallowedError) {
			logger.error("category discovery refused by robots.txt", {
				error: err.message,
			});
			return 1;
		}
		logger.error("category discovery failed", {
			error: err instanceof Error ? err.message : String(err),
		});
		return 1;
	}

	// 2 · Selection filter.
	const selected = filterCategories(categories, opts.category, logger);
	if (selected.length === 0) {
		logger.warn("no categories selected; writing empty business-urls.json");
		const p = writeJson(runDir, "business-urls.json", []);
		logger.info("wrote business-urls.json", { count: 0, path: p });
		return 0;
	}

	logger.info("categories selected", {
		count: selected.length,
		slugs: selected.slice(0, 10).map((c) => c.slug),
	});

	// 3 · Listing crawl.
	const effectiveLimit = Number.isFinite(limit) ? (limit as number) : undefined;
	let businessUrls: string[] = [];
	try {
		businessUrls = await crawlSelected(
			fetcher,
			logger,
			selected,
			effectiveLimit,
		);
	} catch (err) {
		logger.error("listing crawl failed", {
			error: err instanceof Error ? err.message : String(err),
		});
		// Still write whatever we collected up to this point.
	}

	const businessUrlsPath = writeJson(runDir, "business-urls.json", businessUrls);
	logger.info("wrote business-urls.json", {
		count: businessUrls.length,
		path: businessUrlsPath,
	});

	// 4 · A4 — business detail scraping. Runs even in --dry mode because the
	// artifact (businesses.json) is what A7 ingests; the --dry flag only
	// skips a downstream ingest handoff (not implemented here yet).
	const businesses: ScrapedBusiness[] = [];
	const failures: ScrapeFailure[] = [];

	for (const url of businessUrls) {
		try {
			const biz = await scrapeBusiness(fetcher, url);
			businesses.push(biz);
			logger.info("business scraped", {
				url,
				sourceId: biz.sourceId,
				name: biz.name,
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			failures.push({
				url,
				error: message,
				timestamp: new Date().toISOString(),
			});
			logger.error("business scrape failed", { url, error: message });
		}
	}

	const businessesPath = writeJson(runDir, "businesses.json", businesses);
	const failuresPath = writeJson(runDir, "failures.json", failures);
	logger.info("wrote businesses.json", {
		count: businesses.length,
		path: businessesPath,
	});
	logger.info("wrote failures.json", {
		count: failures.length,
		path: failuresPath,
	});

	const summary = {
		categories: selected.length,
		businessesScraped: businesses.length,
		failures: failures.length,
	};
	logger.info("run summary", summary);
	console.log("[scrape:don] summary:", JSON.stringify(summary));

	if (opts.dry) {
		logger.info("dry run — skipping ingest handoff", { runDir, ...summary });
	}
	return 0;
}

const program = new Command();

program
	.name("scrape:don")
	.description(
		"directoryofnepal.com scraper — discovers categories and collects business URLs (A3)",
	)
	.option("--category <slug>", "Category slug to crawl (e.g. education)")
	.option("--limit <n>", "Max number of business URLs to collect")
	.option(
		"--dry",
		"Write artifacts but skip downstream handoff (no business scraping)",
	)
	.option("--resume", "(not implemented) resume from previous run state")
	.action(async (opts: CliOptions) => {
		const code = await main(opts);
		process.exit(code);
	});

program.parseAsync(process.argv).catch((err) => {
	console.error("[scrape:don] fatal:", err);
	process.exit(1);
});
