import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";
import { calculateTrustScore } from "./lib/trustScore";
import { now } from "./lib/time";

async function getOrCreateSessionUser(
  ctx: any,
  user: { id: string; email: string; name: string }
) {
  const existingByWorkosId = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q: any) => q.eq("workosId", user.id))
    .unique();
  if (existingByWorkosId) return existingByWorkosId;

  const existingByEmail = await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", user.email))
    .unique();
  if (existingByEmail) {
    await ctx.db.patch(existingByEmail._id, {
      workosId: user.id,
      name: user.name,
      updatedAt: now(),
    });
    return { ...existingByEmail, workosId: user.id, name: user.name };
  }

  const userId = await ctx.db.insert("users", {
    workosId: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: undefined,
    role: "consumer",
    reviewCount: 0,
    isVerified: false,
    language: "en",
    createdAt: now(),
    updatedAt: now(),
  });

  return await ctx.db.get(userId);
}

export const listByBusiness = query({
  args: {
    businessId: v.id("businesses"),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
    sortBy: v.optional(
      v.union(
        v.literal("newest"),
        v.literal("oldest"),
        v.literal("highest"),
        v.literal("lowest"),
        v.literal("helpful")
      )
    ),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 10;

    let reviews = await ctx.db
      .query("reviews")
      .withIndex("by_businessId_createdAt", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    // Filter visible only
    reviews = reviews.filter((r) => r.moderationStatus === "visible");

    // Sort
    const sortBy = args.sortBy ?? "newest";
    switch (sortBy) {
      case "newest":
        reviews.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        reviews.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "highest":
        reviews.sort((a, b) => b.stars - a.stars);
        break;
      case "lowest":
        reviews.sort((a, b) => a.stars - b.stars);
        break;
      case "helpful":
        reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }

    const start = (page - 1) * pageSize;
    const items = reviews.slice(start, start + pageSize);

    // Enrich with author info
    const enriched = await Promise.all(
      items.map(async (r) => {
        const author = await ctx.db.get(r.authorId);
        return {
          ...r,
          author: author
            ? { name: author.name, avatarUrl: author.avatarUrl }
            : null,
          replies:
            r.replyText && r.repliedByUserId
              ? [
                  {
                    id: `${r._id}-reply`,
                    author: (await ctx.db.get(r.repliedByUserId))?.name ?? "Business",
                    body: r.replyText,
                    createdAt: r.replyAt ?? r.updatedAt,
                  },
                ]
              : [],
        };
      })
    );

    return {
      items: enriched,
      total: reviews.length,
      page,
      pageSize,
      totalPages: Math.ceil(reviews.length / pageSize),
    };
  },
});

export const create = mutation({
  args: {
    businessId: v.id("businesses"),
    stars: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5)
    ),
    title: v.string(),
    body: v.string(),
    language: v.optional(v.union(v.literal("en"), v.literal("ne"))),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const reviewId = await ctx.db.insert("reviews", {
      businessId: args.businessId,
      authorId: user._id,
      stars: args.stars,
      title: args.title,
      body: args.body,
      language: args.language ?? "en",
      source: "organic",
      isVerified: false,
      helpfulCount: 0,
      reportCount: 0,
      moderationStatus: "visible",
      createdAt: now(),
      updatedAt: now(),
    });

    // Recalculate trust score
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_businessId_createdAt", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const visibleReviews = allReviews.filter(
      (r) => r.moderationStatus === "visible"
    );
    const { trustScore, starRating, ratingDistribution } =
      calculateTrustScore(visibleReviews);

    await ctx.db.patch(args.businessId, {
      trustScore,
      starRating,
      totalReviews: visibleReviews.length,
      ratingDistribution,
      updatedAt: now(),
    });

    // Update user review count
    await ctx.db.patch(user._id, {
      reviewCount: user.reviewCount + 1,
      updatedAt: now(),
    });

    return reviewId;
  },
});

export const createFromSession = mutation({
  args: {
    businessSlug: v.string(),
    stars: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5)
    ),
    title: v.string(),
    body: v.string(),
    user: v.object({
      id: v.string(),
      email: v.string(),
      name: v.string(),
    }),
    language: v.optional(v.union(v.literal("en"), v.literal("ne"))),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.businessSlug))
      .unique();

    if (!business) {
      throw new Error("Business not found");
    }

    const user = await getOrCreateSessionUser(ctx, args.user);

    const reviewId = await ctx.db.insert("reviews", {
      businessId: business._id,
      authorId: user!._id,
      stars: args.stars,
      title: args.title,
      body: args.body,
      language: args.language ?? "en",
      source: "organic",
      isVerified: false,
      helpfulCount: 0,
      reportCount: 0,
      moderationStatus: "visible",
      createdAt: now(),
      updatedAt: now(),
    });

    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_businessId_createdAt", (q) => q.eq("businessId", business._id))
      .collect();

    const visibleReviews = allReviews.filter((review) => review.moderationStatus === "visible");
    const { trustScore, starRating, ratingDistribution } = calculateTrustScore(visibleReviews);

    await ctx.db.patch(business._id, {
      trustScore,
      starRating,
      totalReviews: visibleReviews.length,
      ratingDistribution,
      updatedAt: now(),
    });

    await ctx.db.patch(user!._id, {
      reviewCount: user!.reviewCount + 1,
      updatedAt: now(),
    });

    return reviewId;
  },
});

export const replyFromSession = mutation({
  args: {
    reviewId: v.id("reviews"),
    body: v.string(),
    user: v.object({
      id: v.string(),
      email: v.string(),
      name: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    const user = await getOrCreateSessionUser(ctx, args.user);

    await ctx.db.patch(review._id, {
      replyText: args.body,
      replyAt: now(),
      repliedByUserId: user!._id,
      updatedAt: now(),
    });

    return review._id;
  },
});
