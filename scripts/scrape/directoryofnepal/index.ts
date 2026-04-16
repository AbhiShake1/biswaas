#!/usr/bin/env -S node
/**
 * directoryofnepal.com scraper CLI.
 *
 * Two discovery paths:
 *   1. **sitemap** (default, when --category is absent): fetch sitemap.xml once
 *      → ~31k business URLs. Fastest and most complete.
 *   2. **category-pages** (implicit when --category=<slug>): walk
 *      /browse-categories → walk listing pages with pagination (legacy A3 path).
 *
 * Flags:
 *   --category <slug>        filter to one category (enables category-pages mode)
 *   --limit <n>              cap total business URLs collected
 *   --concurrency <n>        parallel HTTP workers (default 4)
 *   --delay-ms <n>           inter-request delay in ms (default 250)
 *   --chunk <n>              business detail batch size (default 50)
 *   --flush-every <n>        periodic JSON flush interval (default 500)
 *   --dry                    write artifacts but skip business detail scraping
 *   --resume                 (not implemented) resume hint (cache already gives us resume)
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
import { discoverFromSitemap } from "./sitemap.ts";
import type { ScrapedBusiness, ScrapedCategory } from "./types.ts";

type ScrapeFailure = {
	url: string;
	error: string;
	timestamp: string;
};

type CliOptions = {
	category?: string;
	limit?: string;
	concurrency?: string;
	delayMs?: string;
	chunk?: string;
	flushEvery?: string;
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

async function runCategoryPagesDiscovery(
	fetcher: Fetcher,
	logger: Logger,
	runDir: string,
): Promise<{ categories: ScrapedCategory[]; businessUrls: string[] }> {
	logger.info("discovering categories via /browse-categories");
	const categories = await discoverCategories(fetcher);
	writeJson(runDir, "categories.json", categories);
	logger.info("categories discovered", { count: categories.length });
	return { categories, businessUrls: [] };
}

async function runSitemapDiscovery(
	fetcher: Fetcher,
	logger: Logger,
	runDir: string,
): Promise<{ categories: ScrapedCategory[]; businessUrls: string[] }> {
	logger.info("discovering via sitemap.xml");
	const result = await discoverFromSitemap(fetcher);
	logger.info("sitemap discovery complete", {
		categories: result.categories.length,
		companies: result.companies.length,
		classes: result.classes.length,
	});

	// Build ScrapedCategory[] from category URLs (parse id + slug from path).
	const categories: ScrapedCategory[] = result.categories.map((url) => {
		const m = url.match(/\/category\/(\d+)\/([^/]+)\.html/);
		const sourceId = m?.[1] ?? "";
		const slug = (m?.[2] ?? "").replace(/-$/, "");
		const name = slug.split("-").map(capitalize).join(" ");
		return { sourceId, slug, name, url };
	});

	writeJson(runDir, "categories.json", categories);
	return { categories, businessUrls: result.companies };
}

function capitalize(s: string): string {
	return s.length > 0 ? s[0]!.toUpperCase() + s.slice(1) : s;
}

async function crawlSelectedCategories(
	fetcher: Fetcher,
	logger: Logger,
	selected: ScrapedCategory[],
	limit: number | undefined,
): Promise<string[]> {
	const all: string[] = [];
	const seen = new Set<string>();

	for (const cat of selected) {
		const remaining = limit != null ? Math.max(0, limit - all.length) : undefined;
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

async function scrapeBusinessesInChunks(
	fetcher: Fetcher,
	logger: Logger,
	runDir: string,
	urls: string[],
	chunkSize: number,
	flushEvery: number,
): Promise<{ businesses: ScrapedBusiness[]; failures: ScrapeFailure[] }> {
	const businesses: ScrapedBusiness[] = [];
	const failures: ScrapeFailure[] = [];
	const total = urls.length;
	let lastFlushed = 0;

	for (let i = 0; i < total; i += chunkSize) {
		const slice = urls.slice(i, i + chunkSize);
		const results = await Promise.allSettled(
			slice.map((u) => scrapeBusiness(fetcher, u)),
		);

		for (let j = 0; j < results.length; j++) {
			const url = slice[j]!;
			const r = results[j]!;
			if (r.status === "fulfilled") {
				businesses.push(r.value);
			} else {
				const message =
					r.reason instanceof Error ? r.reason.message : String(r.reason);
				failures.push({
					url,
					error: message,
					timestamp: new Date().toISOString(),
				});
			}
		}

		const processed = Math.min(i + chunkSize, total);
		logger.info("scrape progress", {
			processed,
			total,
			businesses: businesses.length,
			failures: failures.length,
			pctComplete: Math.round((processed * 1000) / total) / 10,
		});

		if (businesses.length - lastFlushed >= flushEvery || processed === total) {
			writeJson(runDir, "businesses.json", businesses);
			writeJson(runDir, "failures.json", failures);
			lastFlushed = businesses.length;
			logger.info("flushed partial artifacts", {
				businesses: businesses.length,
				failures: failures.length,
			});
		}
	}

	return { businesses, failures };
}

async function main(opts: CliOptions): Promise<number> {
	const runDir = resolveRunDir();
	const logger = createLogger(runDir);
	const limit = opts.limit != null ? Number(opts.limit) : undefined;
	const concurrency = opts.concurrency != null ? Number(opts.concurrency) : 4;
	const delayMs = opts.delayMs != null ? Number(opts.delayMs) : 250;
	const chunkSize = opts.chunk != null ? Number(opts.chunk) : 50;
	const flushEvery = opts.flushEvery != null ? Number(opts.flushEvery) : 500;

	logger.info("run start", {
		runDir,
		mode: opts.category ? "category-pages" : "sitemap",
		category: opts.category ?? null,
		limit: Number.isFinite(limit) ? limit : null,
		concurrency,
		delayMs,
		chunkSize,
		flushEvery,
		dry: Boolean(opts.dry),
		resume: Boolean(opts.resume),
	});

	if (opts.resume) {
		logger.warn("resume flag is a no-op — cache provides implicit resume");
	}

	const fetcher = createFetcher({ concurrency, delayMs });

	// Discovery phase
	let categories: ScrapedCategory[] = [];
	let businessUrls: string[] = [];

	try {
		if (opts.category) {
			const r = await runCategoryPagesDiscovery(fetcher, logger, runDir);
			categories = r.categories;
			const selected = filterCategories(categories, opts.category, logger);
			if (selected.length === 0) {
				logger.warn("no categories selected; writing empty artifacts");
				writeJson(runDir, "business-urls.json", []);
				writeJson(runDir, "businesses.json", []);
				writeJson(runDir, "failures.json", []);
				return 0;
			}
			businessUrls = await crawlSelectedCategories(
				fetcher,
				logger,
				selected,
				Number.isFinite(limit) ? (limit as number) : undefined,
			);
		} else {
			const r = await runSitemapDiscovery(fetcher, logger, runDir);
			categories = r.categories;
			businessUrls = r.businessUrls;
			if (Number.isFinite(limit) && businessUrls.length > (limit as number)) {
				businessUrls = businessUrls.slice(0, limit as number);
				logger.info("applied --limit cap", { kept: businessUrls.length });
			}
		}
	} catch (err) {
		if (err instanceof FetcherDisallowedError) {
			logger.error("discovery refused by robots.txt", { error: err.message });
			return 1;
		}
		logger.error("discovery failed", {
			error: err instanceof Error ? err.message : String(err),
		});
		return 1;
	}

	writeJson(runDir, "business-urls.json", businessUrls);
	logger.info("business-urls.json written", { count: businessUrls.length });

	if (opts.dry) {
		logger.info("dry run — skipping business detail scraping", {
			runDir,
			categories: categories.length,
			businessUrls: businessUrls.length,
		});
		console.log(
			"[scrape:don] summary:",
			JSON.stringify({
				categories: categories.length,
				businessUrls: businessUrls.length,
				businessesScraped: 0,
				failures: 0,
				dry: true,
			}),
		);
		return 0;
	}

	// Business detail scraping phase
	const { businesses, failures } = await scrapeBusinessesInChunks(
		fetcher,
		logger,
		runDir,
		businessUrls,
		chunkSize,
		flushEvery,
	);

	const summary = {
		categories: categories.length,
		businessUrls: businessUrls.length,
		businessesScraped: businesses.length,
		failures: failures.length,
	};
	logger.info("run summary", summary);
	console.log("[scrape:don] summary:", JSON.stringify(summary));
	return 0;
}

const program = new Command();

program
	.name("scrape:don")
	.description(
		"directoryofnepal.com scraper — sitemap-based by default, category-filter available",
	)
	.option("--category <slug>", "Category slug to filter (enables category-pages mode)")
	.option("--limit <n>", "Max number of business URLs to scrape")
	.option("--concurrency <n>", "Parallel HTTP workers", "4")
	.option("--delay-ms <n>", "Inter-request delay in ms", "250")
	.option("--chunk <n>", "Business detail batch size", "50")
	.option("--flush-every <n>", "Periodic JSON flush interval", "500")
	.option(
		"--dry",
		"Write discovery artifacts but skip business detail scraping",
	)
	.option("--resume", "(no-op) cache provides implicit resume")
	.action(async (opts: CliOptions) => {
		const code = await main(opts);
		process.exit(code);
	});

program.parseAsync(process.argv).catch((err) => {
	console.error("[scrape:don] fatal:", err);
	process.exit(1);
});
