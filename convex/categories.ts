import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_isActive_sortOrder", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!category) return null;

    // Get subcategories
    const subcategories = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", category._id))
      .collect();

    // Get businesses in this category
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_primaryCategoryId_status", (q) =>
        q.eq("primaryCategoryId", category._id).eq("status", "active")
      )
      .collect();

    // Get logo URLs for businesses
    const businessesWithLogos = await Promise.all(
      businesses.map(async (b) => ({
        ...b,
        logoUrl: b.logoStorageId
          ? await ctx.storage.getUrl(b.logoStorageId)
          : null,
      }))
    );

    return { ...category, subcategories, businesses: businessesWithLogos };
  },
});

export const getSubcategories = query({
  args: { parentId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});
