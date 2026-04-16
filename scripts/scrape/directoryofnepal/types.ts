/**
 * A6: Schema contract for the directoryofnepal.com scraping pipeline.
 *
 * This module is the single source of truth for every downstream scraping
 * agent. Scrapers emit `ScrapedCategory` / `ScrapedBusiness`; the normalizer
 * turns them into `NormalizedCategory` / `NormalizedBusiness` shaped to match
 * the Convex `categories` and `businesses` insert contracts.
 *
 * Reviews are intentionally absent: directoryofnepal.com has no star ratings
 * on reviews (text-only), and our Convex schema requires `stars: 1|2|3|4|5`.
 * Skipping review import for now.
 */
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Scraped shapes (raw-ish, what the scraper emits)                           */
/* -------------------------------------------------------------------------- */

export const scrapedCategorySchema = z.object({
	sourceId: z.string().min(1),
	slug: z.string().min(1),
	name: z.string().min(1),
	url: z.string().url(),
	parentClass: z.string().optional(),
});
export type ScrapedCategory = z.infer<typeof scrapedCategorySchema>;

export const scrapedBusinessSchema = z.object({
	sourceId: z.string().min(1),
	sourceUrl: z.string().url(),
	name: z.string().min(1),
	rawAddress: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	description: z.string().optional(),
	sourceCategorySlug: z.string().min(1),
	logoUrl: z.string().optional(),
});
export type ScrapedBusiness = z.infer<typeof scrapedBusinessSchema>;

/* -------------------------------------------------------------------------- */
/* Normalized shapes (match Convex insert contracts)                          */
/* -------------------------------------------------------------------------- */

export const ratingDistributionSchema = z.object({
	one: z.number(),
	two: z.number(),
	three: z.number(),
	four: z.number(),
	five: z.number(),
});
export type RatingDistribution = z.infer<typeof ratingDistributionSchema>;

/**
 * Matches the Convex `categories` table insert shape.
 * `parentId` is intentionally omitted here — we don't yet have the parent
 * Convex ID at normalization time; the ingest layer wires it up.
 */
export const normalizedCategorySchema = z.object({
	name: z.string().min(1),
	nameNe: z.string().optional(),
	slug: z.string().min(1),
	description: z.string(),
	descriptionNe: z.string().optional(),
	iconUrl: z.string().optional(),
	businessCount: z.number().int().nonnegative(),
	sortOrder: z.number().int(),
	isActive: z.boolean(),
	createdAt: z.number().int(),
});
export type NormalizedCategory = z.infer<typeof normalizedCategorySchema>;

/**
 * Matches the Convex `businesses` table insert shape, EXCEPT:
 *   - `primaryCategoryId` (Convex Id) is replaced by `primaryCategorySlug`
 *     so the ingest layer can resolve it against seeded categories.
 *   - `logoStorageId` / `coverStorageId` are replaced by raw URLs
 *     (`logoUrl` / `coverUrl`) which the ingest layer uploads to Convex
 *     storage and swaps for storage IDs.
 */
export const normalizedBusinessSchema = z.object({
	name: z.string().min(1),
	nameNe: z.string().optional(),
	slug: z.string().min(1),
	description: z.string(),
	descriptionNe: z.string().optional(),
	websiteUrl: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	logoUrl: z.string().optional(),
	coverUrl: z.string().optional(),
	province: z.string().optional(),
	district: z.string().optional(),
	municipality: z.string().optional(),
	address: z.string().optional(),
	coordinates: z
		.object({
			lat: z.number(),
			lng: z.number(),
		})
		.optional(),
	primaryCategorySlug: z.string().min(1),
	trustScore: z.number(),
	starRating: z.number(),
	totalReviews: z.number().int().nonnegative(),
	ratingDistribution: ratingDistributionSchema,
	isClaimed: z.boolean(),
	isVerified: z.boolean(),
	status: z.union([
		z.literal("active"),
		z.literal("pending"),
		z.literal("suspended"),
	]),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
	sourceId: z.string().min(1),
	sourceUrl: z.string().url(),
	createdAt: z.number().int(),
	updatedAt: z.number().int(),
});
export type NormalizedBusiness = z.infer<typeof normalizedBusinessSchema>;

/**
 * Returned by `normalizeBusiness` when the business cannot be normalized
 * (e.g. unmapped category). Callers decide how to surface these — typically
 * written to a `_unmapped.json` artifact for manual review.
 */
export type UnmappedBusiness = {
	unmapped: true;
	reason: string;
	raw: ScrapedBusiness;
};
