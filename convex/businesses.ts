import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!business) return null;

    const category = await ctx.db.get(business.primaryCategoryId);
    const logoUrl = business.logoStorageId
      ? await ctx.storage.getUrl(business.logoStorageId)
      : null;
    const coverUrl = business.coverStorageId
      ? await ctx.storage.getUrl(business.coverStorageId)
      : null;

    return { ...business, category, logoUrl, coverUrl };
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

    const all = await ctx.db
      .query("businesses")
      .withIndex("by_primaryCategoryId_status", (q) =>
        q.eq("primaryCategoryId", args.categoryId).eq("status", "active")
      )
      .collect();

    // Sort by trustScore descending
    all.sort((a, b) => b.trustScore - a.trustScore);

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    const itemsWithLogos = await Promise.all(
      items.map(async (b) => ({
        ...b,
        logoUrl: b.logoStorageId
          ? await ctx.storage.getUrl(b.logoStorageId)
          : null,
      }))
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

    const results = await ctx.db
      .query("businesses")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.query).eq("status", "active")
      )
      .take(20);

    return Promise.all(
      results.map(async (b) => ({
        ...b,
        logoUrl: b.logoStorageId
          ? await ctx.storage.getUrl(b.logoStorageId)
          : null,
      }))
    );
  },
});
