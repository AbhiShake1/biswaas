#!/usr/bin/env -S node
/**
 * A8 · Ingest CLI for scraped directoryofnepal.com artifacts.
 *
 * Pipeline:
 *   1. Validate the dated artifact folder contains `categories.json` and
 *      `businesses.json`.
 *   2. Zod-validate every row; abort on any schema failure (fail fast — a
 *      malformed scrape must never land in Convex).
 *   3. Normalize categories + businesses through the shared
 *      `scripts/scrape/directoryofnepal/normalize.ts` helpers so both
 *      scraper and ingest agree on every transform.
 *   4. Segregate `UnmappedBusiness[]` into `_unmapped.json` inside the run
 *      folder and log the count — only mapped businesses reach Convex.
 *   5. Chunk categories (100) + businesses (100) and call the internal
 *      Convex mutations `internal.ingest.upsertCategories` /
 *      `internal.ingest.upsertBusinesses`. Individual chunk failures are
 *      logged and counted; the rest of the run continues.
 *   6. Call `internal.ingest.recomputeBusinessStats` for every
 *      inserted/updated business ID.
 *   7. Print a terminal summary: counts of inserted/updated/unchanged/
 *      unmapped/failed + statsRecomputed.
 *
 * Why shell out to `npx convex run`?
 *   `ConvexHttpClient` (convex@1.34.1) has no public `setAdminAuth` method,
 *   so internal mutations can't be called over plain HTTPS from a JS client.
 *   The Convex CLI reads `CONVEX_DEPLOYMENT` from `.env.local` and handles
 *   auth transparently, which is exactly what we need for local ingest. When
 *   a deploy key-based HTTP path lands in a future Convex release, this
 *   layer can be swapped out without changing the rest of the pipeline.
 */
import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { z } from "zod";

import {
	isUnmappedBusiness,
	normalizeBusiness,
	normalizeCategory,
} from "../scrape/directoryofnepal/normalize.ts";
import {
	scrapedBusinessSchema,
	scrapedCategorySchema,
	type NormalizedBusiness,
	type NormalizedCategory,
	type ScrapedBusiness,
	type ScrapedCategory,
	type UnmappedBusiness,
} from "../scrape/directoryofnepal/types.ts";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type CliOptions = {
	dry?: boolean;
};

type UpsertResult = {
	inserted: number;
	updated: number;
	unchanged: number;
};

type UpsertBusinessesResult = UpsertResult & {
	affectedBusinessIds: string[];
};

type RunSummary = {
	categories: UpsertResult;
	businesses: UpsertResult & { unmapped: number };
	statsRecomputed: number;
	failed: number;
};

/* -------------------------------------------------------------------------- */
/* Environment check                                                           */
/* -------------------------------------------------------------------------- */

/**
 * `npx convex run` reads `CONVEX_DEPLOYMENT` from the nearest `.env.local`
 * (or falls back to `CONVEX_URL` for self-hosted). We don't validate
 * `CONVEX_URL` explicitly — the shell-out will surface any missing config
 * with a clean error — but we do fail early if neither is visible at all,
 * so the operator sees "missing Convex config" instead of "child process
 * exited 1".
 */
function assertConvexEnv(): void {
	const hasDeployment = Boolean(
		process.env.CONVEX_DEPLOYMENT || process.env.CONVEX_URL,
	);
	const envFile = resolve(".env.local");
	const envFileHasDeployment =
		existsSync(envFile) &&
		/^\s*CONVEX_(DEPLOYMENT|URL)\s*=/m.test(readFileSync(envFile, "utf8"));

	if (!hasDeployment && !envFileHasDeployment) {
		throw new Error(
			"No Convex deployment configured. Set CONVEX_DEPLOYMENT in .env.local " +
				"or export CONVEX_URL before running this CLI. (Run `npx convex dev --once` " +
				"once to link a deployment.)",
		);
	}
}

/* -------------------------------------------------------------------------- */
/* File loaders                                                                */
/* -------------------------------------------------------------------------- */

function loadJson(path: string): unknown {
	const raw = readFileSync(path, "utf8");
	try {
		return JSON.parse(raw);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`Invalid JSON in ${path}: ${message}`);
	}
}

function loadCategories(path: string): ScrapedCategory[] {
	const raw = loadJson(path);
	const parsed = z.array(scrapedCategorySchema).safeParse(raw);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		throw new Error(
			`categories.json failed schema validation at ${issue.path.join(".")}: ${issue.message}`,
		);
	}
	return parsed.data;
}

function loadBusinesses(path: string): ScrapedBusiness[] {
	const raw = loadJson(path);
	const parsed = z.array(scrapedBusinessSchema).safeParse(raw);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		throw new Error(
			`businesses.json failed schema validation at ${issue.path.join(".")}: ${issue.message}`,
		);
	}
	return parsed.data;
}

/* -------------------------------------------------------------------------- */
/* Normalization                                                               */
/* -------------------------------------------------------------------------- */

function normalizeCategories(
	scraped: ScrapedCategory[],
): NormalizedCategory[] {
	return scraped.map((row, i) => normalizeCategory(row, i));
}

function normalizeBusinessesBatch(scraped: ScrapedBusiness[]): {
	mapped: NormalizedBusiness[];
	unmapped: UnmappedBusiness[];
} {
	const mapped: NormalizedBusiness[] = [];
	const unmapped: UnmappedBusiness[] = [];
	for (const row of scraped) {
		const result = normalizeBusiness(row);
		if (isUnmappedBusiness(result)) {
			unmapped.push(result);
		} else {
			mapped.push(result);
		}
	}
	return { mapped, unmapped };
}

/* -------------------------------------------------------------------------- */
/* Convex invocation                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Shell out to `npx convex run <fn> <json>` and return the parsed JSON result.
 *
 * `convex run` uses the Convex CLI's own auth, so internal mutations are
 * callable without an explicit admin key — as long as `CONVEX_DEPLOYMENT`
 * is set in `.env.local` (or exported).
 *
 * Args are passed as a single JSON blob via stdin (Convex CLI accepts
 * `-` as "read args from stdin") rather than the command line, which keeps
 * us clear of ARG_MAX for large batches.
 */
function runConvexFunction(
	fnName: string,
	args: unknown,
): Promise<unknown> {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(
			"npx",
			["convex", "run", fnName, JSON.stringify(args)],
			{
				stdio: ["ignore", "pipe", "pipe"],
				env: process.env,
			},
		);

		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (buf: Buffer) => {
			stdout += buf.toString("utf8");
		});
		child.stderr.on("data", (buf: Buffer) => {
			stderr += buf.toString("utf8");
		});
		child.on("error", (err) => rejectPromise(err));
		child.on("close", (code) => {
			if (code !== 0) {
				rejectPromise(
					new Error(
						`convex run ${fnName} exited ${code}: ${stderr.trim() || stdout.trim()}`,
					),
				);
				return;
			}
			// Convex CLI prints the function's return value as JSON on stdout,
			// sometimes preceded by a log line (e.g. "✔ 16:21 ..."). Extract
			// the last JSON-parseable block.
			const trimmed = stdout.trim();
			if (trimmed.length === 0) {
				resolvePromise(undefined);
				return;
			}
			// Try straight parse first.
			try {
				resolvePromise(JSON.parse(trimmed));
				return;
			} catch {
				/* fall through */
			}
			// Fall back: parse last non-empty line.
			const lastLine = trimmed
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l.length > 0)
				.pop();
			if (!lastLine) {
				resolvePromise(undefined);
				return;
			}
			try {
				resolvePromise(JSON.parse(lastLine));
			} catch {
				// Not JSON — return the raw string. Callers can decide.
				resolvePromise(lastLine);
			}
		});
	});
}

/* -------------------------------------------------------------------------- */
/* Chunking                                                                    */
/* -------------------------------------------------------------------------- */

function chunk<T>(arr: T[], size: number): T[][] {
	if (size <= 0) return [arr.slice()];
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		out.push(arr.slice(i, i + size));
	}
	return out;
}

/* -------------------------------------------------------------------------- */
/* Driver                                                                      */
/* -------------------------------------------------------------------------- */

async function ingestCategories(
	categories: NormalizedCategory[],
): Promise<{ result: UpsertResult; failed: number }> {
	const total: UpsertResult = { inserted: 0, updated: 0, unchanged: 0 };
	let failed = 0;
	const batches = chunk(categories, 100);

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		try {
			const raw = (await runConvexFunction("ingest:upsertCategories", {
				categories: batch,
			})) as UpsertResult | undefined;
			if (raw) {
				total.inserted += raw.inserted ?? 0;
				total.updated += raw.updated ?? 0;
				total.unchanged += raw.unchanged ?? 0;
			}
			console.log(
				`[ingest] categories chunk ${i + 1}/${batches.length}: ` +
					`inserted=${raw?.inserted ?? 0} updated=${raw?.updated ?? 0} unchanged=${raw?.unchanged ?? 0}`,
			);
		} catch (err) {
			failed += batch.length;
			const message = err instanceof Error ? err.message : String(err);
			console.error(
				`[ingest] categories chunk ${i + 1}/${batches.length} failed (${batch.length} rows): ${message}`,
			);
		}
	}
	return { result: total, failed };
}

async function ingestBusinesses(
	businesses: NormalizedBusiness[],
): Promise<{ result: UpsertResult; affectedIds: string[]; failed: number }> {
	const total: UpsertResult = { inserted: 0, updated: 0, unchanged: 0 };
	const affectedIds: string[] = [];
	let failed = 0;
	const batches = chunk(businesses, 100);

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		try {
			const raw = (await runConvexFunction("ingest:upsertBusinesses", {
				businesses: batch,
			})) as UpsertBusinessesResult | undefined;
			if (raw) {
				total.inserted += raw.inserted ?? 0;
				total.updated += raw.updated ?? 0;
				total.unchanged += raw.unchanged ?? 0;
				if (Array.isArray(raw.affectedBusinessIds)) {
					for (const id of raw.affectedBusinessIds) affectedIds.push(id);
				}
			}
			console.log(
				`[ingest] businesses chunk ${i + 1}/${batches.length}: ` +
					`inserted=${raw?.inserted ?? 0} updated=${raw?.updated ?? 0} unchanged=${raw?.unchanged ?? 0}`,
			);
		} catch (err) {
			failed += batch.length;
			const message = err instanceof Error ? err.message : String(err);
			console.error(
				`[ingest] businesses chunk ${i + 1}/${batches.length} failed (${batch.length} rows): ${message}`,
			);
		}
	}
	return { result: total, affectedIds, failed };
}

async function recomputeStats(
	businessIds: string[],
): Promise<{ ok: number; failed: number }> {
	let ok = 0;
	let failed = 0;

	for (let i = 0; i < businessIds.length; i++) {
		const id = businessIds[i];
		try {
			await runConvexFunction("ingest:recomputeBusinessStats", {
				businessId: id,
			});
			ok += 1;
		} catch (err) {
			failed += 1;
			const message = err instanceof Error ? err.message : String(err);
			console.error(
				`[ingest] recomputeBusinessStats failed for ${id}: ${message}`,
			);
		}
	}
	return { ok, failed };
}

/* -------------------------------------------------------------------------- */
/* main()                                                                      */
/* -------------------------------------------------------------------------- */

async function main(folder: string, opts: CliOptions): Promise<number> {
	if (opts.dry) {
		console.log(
			"[ingest] --dry is stubbed: not implemented in A8, will land in A9.",
		);
		return 0;
	}

	// 1 · validate folder
	const abs = resolve(folder);
	if (!existsSync(abs)) {
		console.error(`[ingest] folder does not exist: ${abs}`);
		return 1;
	}
	const categoriesPath = join(abs, "categories.json");
	const businessesPath = join(abs, "businesses.json");
	if (!existsSync(categoriesPath)) {
		console.error(`[ingest] missing file: ${categoriesPath}`);
		return 1;
	}
	if (!existsSync(businessesPath)) {
		console.error(`[ingest] missing file: ${businessesPath}`);
		return 1;
	}

	// 2 · env sanity
	try {
		assertConvexEnv();
	} catch (err) {
		console.error("[ingest]", err instanceof Error ? err.message : err);
		return 1;
	}

	// 3 · load + validate
	let scrapedCategories: ScrapedCategory[];
	let scrapedBusinesses: ScrapedBusiness[];
	try {
		scrapedCategories = loadCategories(categoriesPath);
		scrapedBusinesses = loadBusinesses(businessesPath);
	} catch (err) {
		console.error(
			"[ingest]",
			err instanceof Error ? err.message : String(err),
		);
		return 1;
	}
	console.log(
		`[ingest] loaded ${scrapedCategories.length} categories, ` +
			`${scrapedBusinesses.length} businesses from ${abs}`,
	);

	// 4 · normalize
	const normalizedCategories = normalizeCategories(scrapedCategories);
	const { mapped: normalizedBusinesses, unmapped } =
		normalizeBusinessesBatch(scrapedBusinesses);

	// Write _unmapped.json regardless — empty array is a valid signal too.
	const unmappedPath = join(abs, "_unmapped.json");
	try {
		if (!existsSync(dirname(unmappedPath)))
			mkdirSync(dirname(unmappedPath), { recursive: true });
		writeFileSync(
			unmappedPath,
			JSON.stringify(unmapped, null, 2) + "\n",
			"utf8",
		);
		console.log(
			`[ingest] normalized: mapped=${normalizedBusinesses.length} ` +
				`unmapped=${unmapped.length} (wrote ${unmappedPath})`,
		);
	} catch (err) {
		console.error(
			`[ingest] failed to write ${unmappedPath}:`,
			err instanceof Error ? err.message : err,
		);
	}

	// 5 · ingest
	const catResult = await ingestCategories(normalizedCategories);
	const bizResult = await ingestBusinesses(normalizedBusinesses);

	// 6 · recompute stats for affected businesses
	const statsResult = await recomputeStats(bizResult.affectedIds);

	// 7 · summary
	const summary: RunSummary = {
		categories: catResult.result,
		businesses: {
			...bizResult.result,
			unmapped: unmapped.length,
		},
		statsRecomputed: statsResult.ok,
		failed: catResult.failed + bizResult.failed + statsResult.failed,
	};

	console.log("[ingest] summary:", JSON.stringify(summary, null, 2));
	return 0;
}

const program = new Command();

program
	.name("ingest:don")
	.description(
		"Push a dated directoryofnepal.com scrape artifact into Convex (A8).",
	)
	.argument("<folder>", "Path to a dated scrape artifact folder")
	.option(
		"--dry",
		"Stubbed in A8 — dry diff is deferred to A9. Prints a notice and exits.",
	)
	.action(async (folder: string, opts: CliOptions) => {
		try {
			const code = await main(folder, opts);
			process.exit(code);
		} catch (err) {
			console.error(
				"[ingest] fatal:",
				err instanceof Error ? err.stack ?? err.message : err,
			);
			process.exit(1);
		}
	});

program.parseAsync(process.argv).catch((err) => {
	console.error(
		"[ingest] fatal (argparse):",
		err instanceof Error ? err.stack ?? err.message : err,
	);
	process.exit(1);
});
