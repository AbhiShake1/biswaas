import { query } from "./_generated/server";
import { v } from "convex/values";

async function withCategory(ctx: any, business: any) {
  const category = await ctx.db.get(business.primaryCategoryId);
  const logoUrl = business.logoStorageId
    ? await ctx.storage.getUrl(business.logoStorageId)
    : null;
  const coverUrl = business.coverStorageId
    ? await ctx.storage.getUrl(business.coverStorageId)
    : null;

  return {
    ...business,
    category,
    categoryName: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    logoUrl,
    coverUrl,
  };
}

/**
 * Read-only, full-table listing of businesses. Intended for ingest tooling
 * (A9 dry-run diff) so it can compare every row by slug without pulling a
 * per-category or per-status slice. Returns the raw documents — no logo URL
 * resolution, no category joining, no trust-score sort — because the diff
 * only cares about stored fields.
 *
 * Public, no-auth; safe to expose because the individual fields are already
 * public via `getBySlug`/`listByCategory`/`search`.
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!business) return null;

    return withCategory(ctx, business);
  },
});

export const listByCategory = query({
  args: {
    categoryId: v.id("categories"),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 20;

    // Take up to 500 per category — even the largest DoN categories don't
    // exceed this, and it keeps us under Convex's per-transaction read cap.
    const all = await ctx.db
      .query("businesses")
      .withIndex("by_primaryCategoryId_status", (q) =>
        q.eq("primaryCategoryId", args.categoryId).eq("status", "active")
      )
      .take(500);

    // Sort by trustScore descending
    all.sort((a, b) => b.trustScore - a.trustScore);

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    const itemsWithLogos = await Promise.all(
      items.map(async (b) => withCategory(ctx, b))
    );

    return {
      items: itemsWithLogos,
      total: all.length,
      page,
      pageSize,
      totalPages: Math.ceil(all.length / pageSize),
    };
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];

    const query = args.query.trim().toLowerCase();
    // Bounded take() + trustScore-desc so search against a 26k-row table
    // stays under the per-transaction read cap. Comprehensive search should
    // use the schema's searchIndex `search_name` — this path is for the
    // landing-page search bar.
    const results = await ctx.db
      .query("businesses")
      .withIndex("by_status_trustScore", (q) =>
        q.eq("status", "active")
      )
      .order("desc")
      .take(500);

    const enriched = await Promise.all(results.map((business) => withCategory(ctx, business)));

    return enriched
      .filter((business) =>
        [
          business.name,
          business.description,
          business.district,
          business.municipality,
          business.address,
          business.categoryName,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      )
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 20);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;

    // Use the compound by_status_trustScore index with desc order so the DB
    // returns rows already sorted — bounded take() keeps us under Convex's
    // per-transaction read cap when the businesses table grows large
    // (post-scrape this table has 26k+ rows).
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_status_trustScore", (q) => q.eq("status", "active"))
      .order("desc")
      .take(Math.max(limit * 5, 50));

    const enriched = await Promise.all(
      businesses.map((business) => withCategory(ctx, business)),
    );
    return enriched.sort((a, b) => b.trustScore - a.trustScore).slice(0, limit);
  },
});
