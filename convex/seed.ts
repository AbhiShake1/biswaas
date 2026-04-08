import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { businesses, categories } from "../src/lib/data/businesses";

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "education-consultancies": "शैक्षिक परामर्शदाता",
  ecommerce: "ई-कमर्स",
  "trekking-tourism": "ट्रेकिङ र पर्यटन",
  "isp-telecom": "इन्टरनेट र टेलिकम",
  "hospitals-healthcare": "अस्पताल र स्वास्थ्य",
};

const now = Date.now();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function reviewTimestamp(value: string, offsetMinutes = 0) {
  return new Date(`${value}T12:00:00.000Z`).getTime() + offsetMinutes * 60_000;
}

async function ensureUser(
  ctx: any,
  input: { workosId: string; email: string; name: string; role?: "consumer" | "business_owner" | "admin" }
) {
  const existingByWorkosId = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q: any) => q.eq("workosId", input.workosId))
    .unique();

  if (existingByWorkosId) {
    await ctx.db.patch(existingByWorkosId._id, {
      email: input.email,
      name: input.name,
      role: input.role ?? existingByWorkosId.role,
      updatedAt: now,
    });
    return existingByWorkosId._id;
  }

  const existingByEmail = await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", input.email))
    .unique();

  if (existingByEmail) {
    await ctx.db.patch(existingByEmail._id, {
      workosId: input.workosId,
      name: input.name,
      role: input.role ?? existingByEmail.role,
      updatedAt: now,
    });
    return existingByEmail._id;
  }

  return await ctx.db.insert("users", {
    workosId: input.workosId,
    email: input.email,
    name: input.name,
    avatarUrl: undefined,
    role: input.role ?? "consumer",
    reviewCount: 0,
    isVerified: false,
    language: "en",
    createdAt: now,
    updatedAt: now,
  });
}

export const seedFocusedDataset = mutation({
  args: {
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const reset = args.reset ?? true;

    const seededCategoryIds = new Map<string, any>();
    const seededBusinessIds = new Map<string, any>();

    const seededBusinessSlugs = new Set(businesses.map((business) => business.slug));
    const seededCategorySlugs = new Set(categories.map((category) => category.slug));

    if (reset) {
      for (const businessSlug of seededBusinessSlugs) {
        const existingBusiness = await ctx.db
          .query("businesses")
          .withIndex("by_slug", (q: any) => q.eq("slug", businessSlug))
          .unique();

        if (!existingBusiness) continue;

        const existingReviews = await ctx.db
          .query("reviews")
          .withIndex("by_businessId_createdAt", (q: any) => q.eq("businessId", existingBusiness._id))
          .collect();

        for (const review of existingReviews) {
          await ctx.db.delete(review._id);
        }

        const existingLinks = await ctx.db
          .query("businessCategories")
          .withIndex("by_businessId", (q: any) => q.eq("businessId", existingBusiness._id))
          .collect();

        for (const link of existingLinks) {
          await ctx.db.delete(link._id);
        }

        await ctx.db.delete(existingBusiness._id);
      }

      for (const categorySlug of seededCategorySlugs) {
        const existingCategory = await ctx.db
          .query("categories")
          .withIndex("by_slug", (q: any) => q.eq("slug", categorySlug))
          .unique();

        if (existingCategory) {
          await ctx.db.delete(existingCategory._id);
        }
      }
    }

    for (const [index, category] of categories.entries()) {
      const businessCount = businesses.filter((business) => business.categorySlug === category.slug).length;

      const categoryId = await ctx.db.insert("categories", {
        name: category.name,
        nameNe: CATEGORY_TRANSLATIONS[category.slug] ?? category.name,
        slug: category.slug,
        description: category.description,
        descriptionNe: undefined,
        iconUrl: undefined,
        parentId: undefined,
        businessCount,
        sortOrder: index + 1,
        isActive: true,
        createdAt: now,
      });

      seededCategoryIds.set(category.slug, categoryId);
    }

    for (const business of businesses) {
      const categoryId = seededCategoryIds.get(business.categorySlug);
      if (!categoryId) {
        throw new Error(`Missing seeded category for ${business.categorySlug}`);
      }

      const businessId = await ctx.db.insert("businesses", {
        name: business.name,
        nameNe: undefined,
        slug: business.slug,
        description: business.description,
        descriptionNe: undefined,
        websiteUrl: business.websiteUrl,
        phone: business.phone,
        email: undefined,
        logoStorageId: undefined,
        coverStorageId: undefined,
        province: undefined,
        district: business.district,
        municipality: business.municipality,
        address: business.address,
        coordinates: undefined,
        primaryCategoryId: categoryId,
        trustScore: business.trustScore,
        starRating: business.starRating,
        totalReviews: business.totalReviews,
        ratingDistribution: business.ratingDistribution,
        claimedByUserId: undefined,
        isClaimed: false,
        isVerified: true,
        status: "active",
        metaTitle: undefined,
        metaDescription: undefined,
        createdAt: now,
        updatedAt: now,
      });

      seededBusinessIds.set(business.slug, businessId);

      await ctx.db.insert("businessCategories", {
        businessId,
        categoryId,
      });
    }

    let insertedReviews = 0;
    const seededUserIds = new Set<any>();

    for (const business of businesses) {
      const businessId = seededBusinessIds.get(business.slug);
      if (!businessId) continue;

      for (const [reviewIndex, review] of business.reviews.entries()) {
        const authorSlug = slugify(review.author);
        const authorId = await ensureUser(ctx, {
          workosId: `seed-user-${authorSlug}`,
          email: `seed+${authorSlug}@biswaas.local`,
          name: review.author,
        });
        seededUserIds.add(authorId);

        let repliedByUserId = undefined;
        let replyText = undefined;
        let replyAt = undefined;

        if (review.replies?.length) {
          const reply = review.replies[0];
          const replySlug = slugify(reply.author);
          repliedByUserId = await ensureUser(ctx, {
            workosId: `seed-user-${replySlug}`,
            email: `seed+${replySlug}@biswaas.local`,
            name: reply.author,
            role: "business_owner",
          });
          seededUserIds.add(repliedByUserId);
          replyText = reply.body;
          replyAt = reviewTimestamp(reply.createdAt, reviewIndex);
        }

        await ctx.db.insert("reviews", {
          businessId,
          authorId,
          stars: review.stars as 1 | 2 | 3 | 4 | 5,
          title: review.title,
          body: review.body,
          language: "en",
          source: review.source ?? "organic",
          isVerified: review.source === "organic",
          googleReviewId: undefined,
          helpfulCount: 0,
          reportCount: 0,
          moderationStatus: "visible",
          replyText,
          replyAt,
          repliedByUserId,
          createdAt: reviewTimestamp(review.createdAt, reviewIndex),
          updatedAt: reviewTimestamp(review.createdAt, reviewIndex),
        });

        insertedReviews += 1;
      }
    }

    for (const userId of seededUserIds) {
      const userReviews = await ctx.db
        .query("reviews")
        .withIndex("by_authorId", (q: any) => q.eq("authorId", userId))
        .collect();

      const user = await ctx.db.get(userId);
      if (user) {
        await ctx.db.patch(userId, {
          reviewCount: userReviews.length,
          updatedAt: now,
        });
      }
    }

    return {
      categories: seededCategoryIds.size,
      businesses: seededBusinessIds.size,
      reviews: insertedReviews,
    };
  },
});
