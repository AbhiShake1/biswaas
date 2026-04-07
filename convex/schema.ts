import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    workosId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("consumer"),
      v.literal("business_owner"),
      v.literal("admin")
    ),
    reviewCount: v.number(),
    isVerified: v.boolean(),
    language: v.union(v.literal("en"), v.literal("ne")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workosId", ["workosId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  categories: defineTable({
    name: v.string(),
    nameNe: v.string(),
    slug: v.string(),
    description: v.string(),
    descriptionNe: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    businessCount: v.number(),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_parentId", ["parentId"])
    .index("by_isActive_sortOrder", ["isActive", "sortOrder"]),

  businesses: defineTable({
    name: v.string(),
    nameNe: v.optional(v.string()),
    slug: v.string(),
    description: v.string(),
    descriptionNe: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    coverStorageId: v.optional(v.id("_storage")),
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
    primaryCategoryId: v.id("categories"),
    trustScore: v.number(),
    starRating: v.number(),
    totalReviews: v.number(),
    ratingDistribution: v.object({
      one: v.number(),
      two: v.number(),
      three: v.number(),
      four: v.number(),
      five: v.number(),
    }),
    claimedByUserId: v.optional(v.id("users")),
    isClaimed: v.boolean(),
    isVerified: v.boolean(),
    status: v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("suspended")
    ),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_primaryCategoryId_status", ["primaryCategoryId", "status"])
    .index("by_status_trustScore", ["status", "trustScore"])
    .index("by_claimedByUserId", ["claimedByUserId"])
    .index("by_district", ["district"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["status", "primaryCategoryId", "district"],
    }),

  businessCategories: defineTable({
    businessId: v.id("businesses"),
    categoryId: v.id("categories"),
  })
    .index("by_businessId", ["businessId"])
    .index("by_categoryId", ["categoryId"]),

  reviews: defineTable({
    businessId: v.id("businesses"),
    authorId: v.id("users"),
    stars: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5)
    ),
    title: v.string(),
    body: v.string(),
    language: v.union(v.literal("en"), v.literal("ne")),
    source: v.union(
      v.literal("organic"),
      v.literal("imported"),
      v.literal("invited")
    ),
    isVerified: v.boolean(),
    googleReviewId: v.optional(v.string()),
    helpfulCount: v.number(),
    reportCount: v.number(),
    moderationStatus: v.union(
      v.literal("visible"),
      v.literal("flagged"),
      v.literal("hidden")
    ),
    replyText: v.optional(v.string()),
    replyAt: v.optional(v.number()),
    repliedByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_businessId_createdAt", ["businessId", "createdAt"])
    .index("by_businessId_stars", ["businessId", "stars"])
    .index("by_authorId", ["authorId"])
    .index("by_moderationStatus", ["moderationStatus"])
    .index("by_source", ["source"]),

  reviewVotes: defineTable({
    reviewId: v.id("reviews"),
    userId: v.id("users"),
    isHelpful: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_reviewId", ["reviewId"])
    .index("by_userId_reviewId", ["userId", "reviewId"]),

  claimRequests: defineTable({
    businessId: v.id("businesses"),
    userId: v.id("users"),
    proofDocumentStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    adminNotes: v.optional(v.string()),
    reviewedByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  reviewInvitations: defineTable({
    businessId: v.id("businesses"),
    sentByUserId: v.id("users"),
    recipientEmail: v.string(),
    recipientName: v.optional(v.string()),
    token: v.string(),
    status: v.union(
      v.literal("sent"),
      v.literal("opened"),
      v.literal("completed"),
      v.literal("expired")
    ),
    reviewId: v.optional(v.id("reviews")),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_businessId", ["businessId"])
    .index("by_status", ["status"]),

  widgetConfigs: defineTable({
    businessId: v.id("businesses"),
    widgetType: v.union(
      v.literal("badge"),
      v.literal("stars"),
      v.literal("carousel"),
      v.literal("mini")
    ),
    theme: v.union(v.literal("light"), v.literal("dark")),
    language: v.union(v.literal("en"), v.literal("ne")),
    showCount: v.optional(v.number()),
    filterStars: v.optional(v.array(v.number())),
    createdByUserId: v.id("users"),
    createdAt: v.number(),
  }).index("by_businessId", ["businessId"]),

  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    targetTable: v.string(),
    targetId: v.string(),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_action", ["action"]),
});
