/**
 * A7: Convex ingest surface for the directoryofnepal.com scraping pipeline.
 *
 * All mutations here are `internalMutation` — they are NOT exposed via
 * `http.ts` and can only be invoked by server-side code (e.g. the CLI
 * ingest driver in A8 via the admin Convex client).
 *
 * Idempotency contract:
 *   - Re-running `upsertCategories` / `upsertBusinesses` with identical
 *     inputs produces 0 row writes (except one `auditLogs` row per batch).
 *   - Category / business identity is keyed on `slug`, which is derived
 *     deterministically from the source name by the normalizer.
 *   - Update path only patches changed fields; equality is a shallow
 *     field-by-field comparison with `ratingDistribution` diffed component-wise.
 *
 * Review ingestion is intentionally out of scope — directoryofnepal.com
 * carries no star ratings and the Convex `reviews.stars` validator rejects
 * non-literal values. A future source that carries stars will land here.
 */
import { ConvexError, v } from "convex/values";
import { internalMutation, type MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { getOrCreateSystemUserInternal, type UpsertResult } from "./lib/importers";
import { calculateTrustScore } from "./lib/trustScore";

/**
 * `upsertBusinesses` returns this extended shape: the base `UpsertResult`
 * counters plus the Convex IDs of every business row that was inserted or
 * updated during the batch. A8's ingest CLI uses `affectedBusinessIds` to
 * fan out `recomputeBusinessStats` calls after businesses land.
 *
 * `unchanged` rows are NOT included — their derived stats are already up to
 * date. The ordering matches the input ordering for inserted/updated rows.
 */
export type UpsertBusinessesResult = UpsertResult & {
  /** Count of rows where `primaryCategorySlug` didn't match any category. */
  skipped: number;
  affectedBusinessIds: Id<"businesses">[];
};

/* -------------------------------------------------------------------------- */
/* Validators — mirror `NormalizedCategory` / `NormalizedBusiness` from       */
/* `scripts/scrape/directoryofnepal/types.ts`.                                */
/* -------------------------------------------------------------------------- */

const normalizedCategoryValidator = v.object({
  name: v.string(),
  nameNe: v.optional(v.string()),
  slug: v.string(),
  description: v.string(),
  descriptionNe: v.optional(v.string()),
  iconUrl: v.optional(v.string()),
  businessCount: v.number(),
  sortOrder: v.number(),
  isActive: v.boolean(),
  createdAt: v.number(),
});

const ratingDistributionValidator = v.object({
  one: v.number(),
  two: v.number(),
  three: v.number(),
  four: v.number(),
  five: v.number(),
});

const normalizedBusinessValidator = v.object({
  name: v.string(),
  nameNe: v.optional(v.string()),
  slug: v.string(),
  description: v.string(),
  descriptionNe: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  coverUrl: v.optional(v.string()),
  province: v.optional(v.string()),
  district: v.optional(v.string()),
  municipality: v.optional(v.string()),
  address: v.optional(v.string()),
  coordinates: v.optional(
    v.object({
      lat: v.number(),
      lng: v.number(),
    })
  ),
  primaryCategorySlug: v.string(),
  trustScore: v.number(),
  starRating: v.number(),
  totalReviews: v.number(),
  ratingDistribution: ratingDistributionValidator,
  isClaimed: v.boolean(),
  isVerified: v.boolean(),
  status: v.union(
    v.literal("active"),
    v.literal("pending"),
    v.literal("suspended")
  ),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  sourceId: v.string(),
  sourceUrl: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                              */
/* -------------------------------------------------------------------------- */

const SYSTEM_USER_WORKOS_ID = "system-directoryofnepal";
const SYSTEM_USER_NAME = "directoryofnepal.com importer";

async function getSystemUserId(ctx: MutationCtx): Promise<Id<"users">> {
  return await getOrCreateSystemUserInternal(ctx, {
    workosId: SYSTEM_USER_WORKOS_ID,
    name: SYSTEM_USER_NAME,
  });
}

async function writeAuditLog(
  ctx: MutationCtx,
  params: {
    action: string;
    userId: Id<"users">;
    result: UpsertResult;
    total: number;
    extra?: Record<string, unknown>;
  }
) {
  await ctx.db.insert("auditLogs", {
    userId: params.userId,
    action: params.action,
    targetTable: params.action.includes("categories") ? "categories" : "businesses",
    targetId: "batch",
    metadata: JSON.stringify({
      inserted: params.result.inserted,
      updated: params.result.updated,
      unchanged: params.result.unchanged,
      total: params.total,
      ...(params.extra ?? {}),
    }),
    createdAt: Date.now(),
  });
}

/**
 * Shallow-compare two values, treating plain objects as field-by-field
 * comparisons and arrays as element-wise. Sufficient for our shapes — the
 * deepest nesting is `ratingDistribution` / `coordinates`, both flat.
 */
function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;

  const aKeys = Object.keys(a as Record<string, unknown>);
  const bKeys = Object.keys(b as Record<string, unknown>);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];
    if (typeof av === "object" && av !== null) {
      if (!shallowEqual(av, bv)) return false;
    } else if (av !== bv) {
      return false;
    }
  }
  return true;
}

/* -------------------------------------------------------------------------- */
/* upsertCategories                                                            */
/* -------------------------------------------------------------------------- */

export const upsertCategories = internalMutation({
  args: {
    categories: v.array(normalizedCategoryValidator),
  },
  handler: async (ctx, args): Promise<UpsertResult> => {
    const result: UpsertResult = { inserted: 0, updated: 0, unchanged: 0 };

    for (const input of args.categories) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", input.slug))
        .unique();

      if (!existing) {
        await ctx.db.insert("categories", {
          name: input.name,
          nameNe: input.nameNe ?? input.name,
          slug: input.slug,
          description: input.description,
          descriptionNe: input.descriptionNe,
          iconUrl: input.iconUrl,
          parentId: undefined,
          businessCount: input.businessCount ?? 0,
          sortOrder: input.sortOrder ?? 0,
          isActive: input.isActive,
          createdAt: input.createdAt || Date.now(),
        });
        result.inserted += 1;
        continue;
      }

      // Build the candidate patch — any field that differs gets written.
      const patch: Partial<Doc<"categories">> = {};
      if (existing.name !== input.name) patch.name = input.name;
      const incomingNameNe = input.nameNe ?? existing.nameNe;
      if (incomingNameNe !== undefined && existing.nameNe !== incomingNameNe) {
        patch.nameNe = incomingNameNe;
      }
      if (existing.description !== input.description) {
        patch.description = input.description;
      }
      if (
        input.descriptionNe !== undefined &&
        existing.descriptionNe !== input.descriptionNe
      ) {
        patch.descriptionNe = input.descriptionNe;
      }
      if (input.iconUrl !== undefined && existing.iconUrl !== input.iconUrl) {
        patch.iconUrl = input.iconUrl;
      }
      if (existing.businessCount !== input.businessCount) {
        patch.businessCount = input.businessCount;
      }
      if (existing.sortOrder !== input.sortOrder) {
        patch.sortOrder = input.sortOrder;
      }
      if (existing.isActive !== input.isActive) {
        patch.isActive = input.isActive;
      }

      if (Object.keys(patch).length === 0) {
        result.unchanged += 1;
      } else {
        await ctx.db.patch(existing._id, patch);
        result.updated += 1;
      }
    }

    const systemUserId = await getSystemUserId(ctx);
    await writeAuditLog(ctx, {
      action: "ingest.directoryofnepal.categories",
      userId: systemUserId,
      result,
      total: args.categories.length,
    });

    return result;
  },
});

/* -------------------------------------------------------------------------- */
/* upsertBusinesses                                                            */
/* -------------------------------------------------------------------------- */

export const upsertBusinesses = internalMutation({
  args: {
    businesses: v.array(normalizedBusinessValidator),
  },
  handler: async (ctx, args): Promise<UpsertBusinessesResult> => {
    const result: UpsertResult = { inserted: 0, updated: 0, unchanged: 0 };
    const affectedBusinessIds: Id<"businesses">[] = [];

    // Cache category slug -> Id lookups; a typical ingest batch shares a
    // handful of categories across hundreds of businesses.
    const categoryIdBySlug = new Map<string, Id<"categories">>();

    async function resolveCategoryId(
      slug: string,
    ): Promise<Id<"categories"> | null> {
      const cached = categoryIdBySlug.get(slug);
      if (cached) return cached;

      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (!category) {
        // Returning null instead of throwing lets full-site ingests tolerate
        // businesses whose breadcrumb category isn't in the sitemap (orphan
        // slugs on the source site). Caller counts these as skipped.
        return null;
      }
      categoryIdBySlug.set(slug, category._id);
      return category._id;
    }

    const emptyDistribution = { one: 0, two: 0, three: 0, four: 0, five: 0 };
    let skipped = 0;

    for (const input of args.businesses) {
      const primaryCategoryId = await resolveCategoryId(
        input.primaryCategorySlug,
      );
      if (primaryCategoryId == null) {
        skipped += 1;
        continue;
      }

      const existing = await ctx.db
        .query("businesses")
        .withIndex("by_slug", (q) => q.eq("slug", input.slug))
        .unique();

      if (!existing) {
        const insertedId = await ctx.db.insert("businesses", {
          name: input.name,
          nameNe: input.nameNe,
          slug: input.slug,
          description: input.description,
          descriptionNe: input.descriptionNe,
          websiteUrl: input.websiteUrl,
          phone: input.phone,
          email: input.email,
          logoStorageId: undefined,
          coverStorageId: undefined,
          province: input.province,
          district: input.district,
          municipality: input.municipality,
          address: input.address,
          coordinates: input.coordinates,
          primaryCategoryId,
          // Seed review-derived stats to zero on insert; they'll be
          // recomputed whenever reviews land via `recomputeBusinessStats`.
          trustScore: 0,
          starRating: 0,
          totalReviews: 0,
          ratingDistribution: { ...emptyDistribution },
          claimedByUserId: undefined,
          isClaimed: input.isClaimed,
          isVerified: input.isVerified,
          status: input.status,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          createdAt: input.createdAt || Date.now(),
          updatedAt: input.updatedAt || Date.now(),
        });
        result.inserted += 1;
        affectedBusinessIds.push(insertedId);
        continue;
      }

      // Update path — preserve review-derived stats (starRating, totalReviews,
      // ratingDistribution, trustScore) so re-ingesting a business doesn't
      // clobber user-generated metrics.
      const patch: Partial<Doc<"businesses">> = {};
      if (existing.name !== input.name) patch.name = input.name;
      if (input.nameNe !== undefined && existing.nameNe !== input.nameNe) {
        patch.nameNe = input.nameNe;
      }
      if (existing.description !== input.description) {
        patch.description = input.description;
      }
      if (
        input.descriptionNe !== undefined &&
        existing.descriptionNe !== input.descriptionNe
      ) {
        patch.descriptionNe = input.descriptionNe;
      }
      if (input.websiteUrl !== undefined && existing.websiteUrl !== input.websiteUrl) {
        patch.websiteUrl = input.websiteUrl;
      }
      if (input.phone !== undefined && existing.phone !== input.phone) {
        patch.phone = input.phone;
      }
      if (input.email !== undefined && existing.email !== input.email) {
        patch.email = input.email;
      }
      if (input.province !== undefined && existing.province !== input.province) {
        patch.province = input.province;
      }
      if (input.district !== undefined && existing.district !== input.district) {
        patch.district = input.district;
      }
      if (
        input.municipality !== undefined &&
        existing.municipality !== input.municipality
      ) {
        patch.municipality = input.municipality;
      }
      if (input.address !== undefined && existing.address !== input.address) {
        patch.address = input.address;
      }
      if (
        input.coordinates !== undefined &&
        !shallowEqual(existing.coordinates, input.coordinates)
      ) {
        patch.coordinates = input.coordinates;
      }
      if (existing.primaryCategoryId !== primaryCategoryId) {
        patch.primaryCategoryId = primaryCategoryId;
      }
      if (existing.isClaimed !== input.isClaimed) {
        patch.isClaimed = input.isClaimed;
      }
      if (existing.isVerified !== input.isVerified) {
        patch.isVerified = input.isVerified;
      }
      if (existing.status !== input.status) patch.status = input.status;
      if (input.metaTitle !== undefined && existing.metaTitle !== input.metaTitle) {
        patch.metaTitle = input.metaTitle;
      }
      if (
        input.metaDescription !== undefined &&
        existing.metaDescription !== input.metaDescription
      ) {
        patch.metaDescription = input.metaDescription;
      }

      if (Object.keys(patch).length === 0) {
        result.unchanged += 1;
      } else {
        patch.updatedAt = Date.now();
        await ctx.db.patch(existing._id, patch);
        result.updated += 1;
        affectedBusinessIds.push(existing._id);
      }
    }

    const systemUserId = await getSystemUserId(ctx);
    await writeAuditLog(ctx, {
      action: "ingest.directoryofnepal.businesses",
      userId: systemUserId,
      result,
      total: args.businesses.length,
      extra: { skipped },
    });

    return { ...result, skipped, affectedBusinessIds };
  },
});

/* -------------------------------------------------------------------------- */
/* recomputeBusinessStats                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Recomputes the denormalized review aggregates on a business row. Called
 * by the ingest CLI after a review-bearing source lands, or manually when
 * moderation state changes in bulk.
 *
 * - Only `moderationStatus === "visible"` reviews are counted.
 * - Uses `calculateTrustScore` so every review-driven stat stays in sync
 *   with the canonical Bayesian / recency-weighted formula.
 * - No audit log per row — too noisy. The CLI writes one summary log.
 */
export const recomputeBusinessStats = internalMutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new ConvexError(`Unknown business id: ${args.businessId}`);
    }

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_businessId_createdAt", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const visible = reviews.filter((r) => r.moderationStatus === "visible");
    const { trustScore, starRating, ratingDistribution } =
      calculateTrustScore(visible);

    await ctx.db.patch(args.businessId, {
      trustScore,
      starRating,
      totalReviews: visible.length,
      ratingDistribution,
      updatedAt: Date.now(),
    });

    return {
      businessId: args.businessId,
      totalReviews: visible.length,
      trustScore,
      starRating,
      ratingDistribution,
    };
  },
});
