#!/usr/bin/env -S node
import { Command } from "commander";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createFetcher, FetcherDisallowedError } from "../shared/fetcher.ts";
import { createLogger } from "../shared/logger.ts";

const BASE_HOST = "https://www.directoryofnepal.com";

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

async function main(opts: CliOptions): Promise<number> {
	const runDir = resolveRunDir();
	const logger = createLogger(runDir);

	logger.info("scaffold only — A2 infrastructure smoke test", {
		runDir,
		category: opts.category ?? null,
		limit: opts.limit ? Number(opts.limit) : null,
		dry: Boolean(opts.dry),
		resume: Boolean(opts.resume),
	});

	const fetcher = createFetcher();
	const smokeUrl = `${BASE_HOST}/robots.txt`;

	try {
		logger.info("smoke fetch: robots.txt", { url: smokeUrl });
		const body = await fetcher.fetchHtml(smokeUrl);
		logger.info("smoke fetch ok", {
			url: smokeUrl,
			bytes: body.length,
			preview: body.split("\n").slice(0, 3).join(" | "),
		});
	} catch (err) {
		if (err instanceof FetcherDisallowedError) {
			logger.error("robots disallowed smoke url", { url: smokeUrl });
			return 1;
		}
		logger.error("smoke fetch failed", {
			url: smokeUrl,
			error: err instanceof Error ? err.message : String(err),
		});
		return 1;
	}

	logger.info("TODO: A3 category scraper");
	logger.info("TODO: A4 business scraper");
	logger.info(
		"scaffold only — no parsers wired. CLI exits 0 until A3/A4 land.",
	);
	return 0;
}

const program = new Command();

program
	.name("scrape:don")
	.description(
		"directoryofnepal.com scraper (scaffold only — A2 infrastructure)",
	)
	.option("--category <slug>", "Category slug to crawl")
	.option("--limit <n>", "Max number of items to scrape")
	.option("--dry", "Dry run — do not write outputs")
	.option("--resume", "Resume from previous run state")
	.action(async (opts: CliOptions) => {
		const code = await main(opts);
		process.exit(code);
	});

program.parseAsync(process.argv).catch((err) => {
	console.error("[scrape:don] fatal:", err);
	process.exit(1);
});
