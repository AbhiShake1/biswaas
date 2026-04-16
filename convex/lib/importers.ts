/**
 * Shared helpers for ingest / importer mutations.
 *
 * - `getOrCreateSystemUser` produces a stable "service account" user row that
 *   we attribute ingest-side audit logs to. Future importers (e.g. third-party
 *   review feeds that DO carry star ratings) can reuse the same helper to
 *   attribute imported `reviews.authorId`.
 * - `UpsertResult` is the common shape returned by batch upsert mutations so
 *   the ingest CLI (A8) can summarise the run cleanly.
 */
import { v } from "convex/values";
import { internalMutation, type MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export type UpsertResult = {
  inserted: number;
  updated: number;
  unchanged: number;
};

/**
 * Look up a system user by `workosId`; create one if missing. System users
 * use `workosId`-shaped IDs like `system-directoryofnepal` so they don't
 * collide with real WorkOS subjects (which are uuids).
 */
export async function getOrCreateSystemUserInternal(
  ctx: MutationCtx,
  input: { workosId: string; name: string }
): Promise<Id<"users">> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q) => q.eq("workosId", input.workosId))
    .unique();

  if (existing) {
    return existing._id;
  }

  const timestamp = Date.now();
  return await ctx.db.insert("users", {
    workosId: input.workosId,
    email: `${input.workosId}@system.local`,
    name: input.name,
    avatarUrl: undefined,
    role: "consumer",
    reviewCount: 0,
    isVerified: false,
    language: "en",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export const getOrCreateSystemUser = internalMutation({
  args: {
    workosId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await getOrCreateSystemUserInternal(ctx, args);
  },
});
