/**
 * A9 · Dry-run diff for the directoryofnepal.com ingest pipeline.
 *
 * `computeDiff` reads the current Convex state for `categories` + `businesses`
 * and returns a per-slug breakdown of what would happen on a real ingest —
 * WITHOUT writing anything. Three buckets per entity:
 *
 *   new       — slug present in the artifact but not in Convex (would insert)
 *   changed   — slug present in both, ≥1 field differs (would update)
 *   unchanged — slug present in both, every compared field matches
 *
 * Review-derived and runtime-managed fields are intentionally ignored (they
 * are not what the importer writes on update paths); see `IGNORED_*` below.
 *
 * State is read by shelling out to `npx convex run <queryName>` — same
 * transport A8 uses for mutations. This keeps auth / deployment resolution
 * identical to the rest of the CLI and avoids a second HTTP client.
 *
 * Pure read-only. Never calls a mutation. Never writes to disk.
 */
import { spawn } from "node:child_process";
import type {
	NormalizedBusiness,
	NormalizedCategory,
} from "../scrape/directoryofnepal/types.ts";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type FieldDiff = {
	old: unknown;
	new: unknown;
};

export type ChangedRow<T> = {
	slug: string;
	fields: Record<string, FieldDiff>;
	/** The normalized input that would have been written. */
	incoming: T;
};

export type EntityDiff<T> = {
	new: T[];
	changed: ChangedRow<T>[];
	unchanged: string[];
};

export type DiffResult = {
	categories: EntityDiff<NormalizedCategory>;
	businesses: EntityDiff<NormalizedBusiness>;
};

export type ComputeDiffInput = {
	categories: NormalizedCategory[];
	businesses: NormalizedBusiness[];
};

/* -------------------------------------------------------------------------- */
/* Fields to ignore during comparison                                          */
/* -------------------------------------------------------------------------- */

/**
 * Fields we do NOT compare for categories. `createdAt` is set at insert and
 * re-stamped every normalization run, so comparing it would flip every row
 * to "changed" for no reason. Same story for anything review-derived —
 * ingest never touches those.
 */
const IGNORED_CATEGORY_FIELDS: ReadonlySet<string> = new Set([
	"createdAt",
	"updatedAt",
]);

/**
 * Fields we do NOT compare for businesses. Matches the set the ingest
 * mutation explicitly preserves on update (review-derived aggregates +
 * runtime/storage bookkeeping), plus the always-changing timestamps.
 */
const IGNORED_BUSINESS_FIELDS: ReadonlySet<string> = new Set([
	"createdAt",
	"updatedAt",
	"starRating",
	"totalReviews",
	"ratingDistribution",
	"trustScore",
	"claimedByUserId",
	"isClaimed",
	"isVerified",
	"logoStorageId",
	"coverStorageId",
]);

/* -------------------------------------------------------------------------- */
/* Convex shell-out                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Invoke `npx convex run <queryName>` and return the parsed JSON result.
 * Mirrors the parser in `importScraped.ts` — Convex CLI prints the function's
 * return value as JSON on stdout, occasionally preceded by a log line.
 */
function runConvexQuery(queryName: string): Promise<unknown> {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn("npx", ["convex", "run", queryName], {
			stdio: ["ignore", "pipe", "pipe"],
			env: process.env,
		});
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
						`convex run ${queryName} exited ${code}: ${stderr.trim() || stdout.trim()}`,
					),
				);
				return;
			}
			const trimmed = stdout.trim();
			if (trimmed.length === 0) {
				resolvePromise(undefined);
				return;
			}
			try {
				resolvePromise(JSON.parse(trimmed));
				return;
			} catch {
				/* fall through to last-line fallback */
			}
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
				resolvePromise(lastLine);
			}
		});
	});
}

/* -------------------------------------------------------------------------- */
/* Equality                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Deep value equality sufficient for our shapes (flat objects + 1-level
 * nesting at most — `coordinates`, `ratingDistribution`). Treats `undefined`
 * on either side as "missing" and matches NaN safely via `Object.is`.
 */
function valuesEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) return true;
	if (a === null || b === null) return false;
	if (a === undefined || b === undefined) return false;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;

	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b)) return false;
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!valuesEqual(a[i], b[i])) return false;
		}
		return true;
	}

	const aKeys = Object.keys(a as Record<string, unknown>);
	const bKeys = Object.keys(b as Record<string, unknown>);
	if (aKeys.length !== bKeys.length) return false;
	for (const key of aKeys) {
		if (
			!valuesEqual(
				(a as Record<string, unknown>)[key],
				(b as Record<string, unknown>)[key],
			)
		) {
			return false;
		}
	}
	return true;
}

/* -------------------------------------------------------------------------- */
/* Per-entity field comparison                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Compare the normalized input against the existing Convex row, returning
 * a map of differing fields. Ignored fields are skipped; missing keys on
 * either side count as "no opinion" only when the input's value is
 * undefined (i.e. the normalizer didn't set it) — otherwise a present-vs-
 * missing transition is a real diff.
 */
function diffFields(
	existing: Record<string, unknown>,
	incoming: Record<string, unknown>,
	ignored: ReadonlySet<string>,
): Record<string, FieldDiff> {
	const diff: Record<string, FieldDiff> = {};
	for (const key of Object.keys(incoming)) {
		if (ignored.has(key)) continue;
		// Convex internal keys never come from normalized inputs, skip defensively.
		if (key.startsWith("_")) continue;

		const incomingVal = incoming[key];
		const existingVal = existing[key];

		// If the normalizer didn't set this field (undefined), don't treat a
		// populated DB value as a "drift" — the ingest mutation has the same
		// rule ("only patch if input defined and differs"), so claiming a
		// change here would falsely inflate the "changed" bucket.
		if (incomingVal === undefined) continue;

		if (!valuesEqual(existingVal, incomingVal)) {
			diff[key] = { old: existingVal, new: incomingVal };
		}
	}
	return diff;
}

/* -------------------------------------------------------------------------- */
/* Diff drivers                                                                */
/* -------------------------------------------------------------------------- */

function diffCategories(
	incoming: NormalizedCategory[],
	existingList: Array<Record<string, unknown>>,
): EntityDiff<NormalizedCategory> {
	const existingBySlug = new Map<string, Record<string, unknown>>();
	for (const row of existingList) {
		const slug = typeof row.slug === "string" ? row.slug : "";
		if (slug) existingBySlug.set(slug, row);
	}

	const newRows: NormalizedCategory[] = [];
	const changed: ChangedRow<NormalizedCategory>[] = [];
	const unchanged: string[] = [];

	for (const input of incoming) {
		const existing = existingBySlug.get(input.slug);
		if (!existing) {
			newRows.push(input);
			continue;
		}
		const fields = diffFields(
			existing,
			input as unknown as Record<string, unknown>,
			IGNORED_CATEGORY_FIELDS,
		);
		if (Object.keys(fields).length === 0) {
			unchanged.push(input.slug);
		} else {
			changed.push({ slug: input.slug, fields, incoming: input });
		}
	}

	return { new: newRows, changed, unchanged };
}

function diffBusinesses(
	incoming: NormalizedBusiness[],
	existingList: Array<Record<string, unknown>>,
	categoryIdToSlug: Map<string, string>,
): EntityDiff<NormalizedBusiness> {
	const existingBySlug = new Map<string, Record<string, unknown>>();
	for (const row of existingList) {
		const slug = typeof row.slug === "string" ? row.slug : "";
		if (slug) existingBySlug.set(slug, row);
	}

	const newRows: NormalizedBusiness[] = [];
	const changed: ChangedRow<NormalizedBusiness>[] = [];
	const unchanged: string[] = [];

	for (const input of incoming) {
		const existing = existingBySlug.get(input.slug);
		if (!existing) {
			newRows.push(input);
			continue;
		}

		// The business row stores `primaryCategoryId` (a Convex Id); the
		// normalized input carries `primaryCategorySlug`. Resolve the stored
		// Id back to a slug so the comparison is apples-to-apples.
		const adapted: Record<string, unknown> = { ...existing };
		const existingCatId =
			typeof existing.primaryCategoryId === "string"
				? (existing.primaryCategoryId as string)
				: "";
		adapted.primaryCategorySlug = categoryIdToSlug.get(existingCatId) ?? null;
		// `sourceId` / `sourceUrl` don't live on the schema today — there's no
		// point diffing them against `undefined` every run. Skip if missing.
		if (existing.sourceId === undefined) {
			adapted.sourceId = input.sourceId;
		}
		if (existing.sourceUrl === undefined) {
			adapted.sourceUrl = input.sourceUrl;
		}

		const fields = diffFields(
			adapted,
			input as unknown as Record<string, unknown>,
			IGNORED_BUSINESS_FIELDS,
		);
		if (Object.keys(fields).length === 0) {
			unchanged.push(input.slug);
		} else {
			changed.push({ slug: input.slug, fields, incoming: input });
		}
	}

	return { new: newRows, changed, unchanged };
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Compute the dry-run diff between a normalized artifact and live Convex state.
 *
 * Throws if Convex state cannot be fetched — a partial diff would mis-report
 * "new" rows that are actually already present, which is worse than failing.
 */
export async function computeDiff(
	input: ComputeDiffInput,
): Promise<DiffResult> {
	const [rawCategories, rawBusinesses] = await Promise.all([
		runConvexQuery("categories:listAll"),
		runConvexQuery("businesses:listAll"),
	]);

	if (!Array.isArray(rawCategories)) {
		throw new Error(
			"categories:listAll did not return an array — cannot diff safely. " +
				`Received type=${typeof rawCategories} value=${JSON.stringify(rawCategories)?.slice(0, 500)}`,
		);
	}
	if (!Array.isArray(rawBusinesses)) {
		throw new Error(
			"businesses:listAll did not return an array — cannot diff safely. " +
				`Received type=${typeof rawBusinesses} value=${JSON.stringify(rawBusinesses)?.slice(0, 500)}`,
		);
	}

	const catRows = rawCategories as Array<Record<string, unknown>>;
	const bizRows = rawBusinesses as Array<Record<string, unknown>>;

	// Map category Id -> slug for business-side comparison.
	const categoryIdToSlug = new Map<string, string>();
	for (const row of catRows) {
		const id = typeof row._id === "string" ? row._id : "";
		const slug = typeof row.slug === "string" ? row.slug : "";
		if (id && slug) categoryIdToSlug.set(id, slug);
	}

	return {
		categories: diffCategories(input.categories, catRows),
		businesses: diffBusinesses(input.businesses, bizRows, categoryIdToSlug),
	};
}
