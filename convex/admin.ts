/**
 * Destructive admin helpers. Internal-only — never exposed via http.ts.
 *
 * `truncateAll` wipes every row from every user-defined table. Bounded by
 * Convex's per-transaction write cap (~8192), we cap at 6000 writes per call
 * and let the caller loop until `remaining: false`.
 *
 * `countAll` returns per-table row counts for verification before/after.
 */
import { internalMutation, internalQuery } from "./_generated/server";

const TABLES = [
	"auditLogs",
	"widgetConfigs",
	"reviewInvitations",
	"claimRequests",
	"businessCategories",
	"reviewVotes",
	"reviews",
	"businesses",
	"categories",
	"users",
] as const;

type TableName = (typeof TABLES)[number];

const PER_TABLE_BATCH = 1000;
const TOTAL_WRITE_CEILING = 6000;

export const truncateAll = internalMutation({
	args: {},
	handler: async (ctx) => {
		const deletedPerTable: Record<string, number> = {};
		let totalWrites = 0;
		let hitCeiling = false;

		for (const table of TABLES) {
			deletedPerTable[table] = 0;
			if (hitCeiling) continue;

			const remainingBudget = TOTAL_WRITE_CEILING - totalWrites;
			if (remainingBudget <= 0) {
				hitCeiling = true;
				continue;
			}

			const batchSize = Math.min(PER_TABLE_BATCH, remainingBudget);
			const rows = await ctx.db.query(table as TableName).take(batchSize);

			for (const row of rows) {
				await ctx.db.delete(row._id);
				deletedPerTable[table]++;
				totalWrites++;
			}

			if (rows.length === batchSize) {
				hitCeiling = true;
			}
		}

		// Residue probe — any table still non-empty?
		let residue = false;
		for (const table of TABLES) {
			const probe = await ctx.db.query(table as TableName).take(1);
			if (probe.length > 0) {
				residue = true;
				break;
			}
		}

		return {
			deletedPerTable,
			totalWrites,
			remaining: residue,
		};
	},
});

export const countAll = internalQuery({
	args: {},
	handler: async (ctx) => {
		const counts: Record<string, number> = {};
		for (const table of TABLES) {
			let count = 0;
			for await (const _row of ctx.db.query(table as TableName)) {
				count++;
			}
			counts[table] = count;
		}
		return counts;
	},
});
