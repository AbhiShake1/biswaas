import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	businesses as staticBusinesses,
	categories as staticCategories,
	getBusiness as getStaticBusiness,
	getBusinessesByCategory as getStaticBusinessesByCategory,
	getCategory as getStaticCategory,
	searchBusinesses as searchStaticBusinesses
} from '$lib/data/businesses';
import type {
	BusinessRecord,
	BusinessSummary,
	CategoryRecord,
	RatingDistribution,
	ReplyRecord,
	ReviewRecord
} from '$lib/types/business';
import type { AuthUser } from '$lib/server/auth';

type RawCategory = {
	_id: string;
	name: string;
	slug: string;
	description: string;
	businessCount?: number;
};

type RawBusiness = {
	_id: string;
	name: string;
	slug: string;
	description?: string | null;
	district?: string | null;
	municipality?: string | null;
	address?: string | null;
	phone?: string | null;
	websiteUrl?: string | null;
	trustScore: number;
	starRating: number;
	totalReviews: number;
	ratingDistribution: RatingDistribution;
	categorySlug?: string | null;
	categoryName?: string | null;
	category?: {
		slug?: string | null;
		name?: string | null;
		description?: string | null;
	} | null;
};

type RawReview = {
	_id: string;
	title: string;
	body: string;
	stars: number;
	createdAt: number;
	source?: 'organic' | 'imported' | 'invited';
	author?: { name?: string | null } | null;
	replies?: Array<{
		id: string;
		author: string;
		body: string;
		createdAt: number;
	}>;
};

function convexBaseUrl() {
	return env.CONVEX_URL?.trim().replace(/\/$/, '') || null;
}

function requireConvexBaseUrl() {
	const baseUrl = convexBaseUrl();
	if (!baseUrl) {
		throw error(500, 'CONVEX_URL is not configured for the app server.');
	}

	return baseUrl;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${requireConvexBaseUrl()}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers ?? {})
		}
	});

	const text = await response.text();
	let payload: unknown = null;

	if (text) {
		try {
			payload = JSON.parse(text);
		} catch {
			throw error(502, 'Convex returned an invalid JSON response.');
		}
	}

	if (!response.ok) {
		const message =
			typeof payload === 'object' && payload !== null && 'error' in payload
				? String(payload.error)
				: 'Convex request failed.';
		throw error(response.status, message);
	}

	return payload as T;
}

function fallbackCategories(): CategoryRecord[] {
	return staticCategories.map((category, index) => ({
		id: `static-category-${index + 1}`,
		name: category.name,
		slug: category.slug,
		description: category.description,
		businessCount: staticBusinesses.filter((business) => business.categorySlug === category.slug).length
	}));
}

function fallbackBusinessSummary(business: (typeof staticBusinesses)[number], index?: number): BusinessSummary {
	const summaryIndex = index ?? staticBusinesses.findIndex((candidate) => candidate.slug === business.slug);

	return {
		id: `static-business-${summaryIndex + 1}`,
		name: business.name,
		slug: business.slug,
		categorySlug: business.categorySlug,
		categoryName: business.categoryName,
		description: business.description,
		district: business.district,
		municipality: business.municipality,
		address: business.address,
		phone: business.phone,
		websiteUrl: business.websiteUrl,
		trustScore: business.trustScore,
		starRating: business.starRating,
		totalReviews: business.totalReviews,
		ratingDistribution: business.ratingDistribution
	};
}

function fallbackBusinessRecord(business: (typeof staticBusinesses)[number]): BusinessRecord {
	return {
		...fallbackBusinessSummary(business),
		reviews: business.reviews
	};
}

function normalizeCategory(category: RawCategory): CategoryRecord {
	return {
		id: category._id,
		name: category.name,
		slug: category.slug,
		description: category.description,
		businessCount: category.businessCount ?? 0
	};
}

function normalizeBusiness(business: RawBusiness): BusinessSummary {
	return {
		id: business._id,
		name: business.name,
		slug: business.slug,
		categorySlug: business.categorySlug ?? business.category?.slug ?? '',
		categoryName: business.categoryName ?? business.category?.name ?? 'Uncategorized',
		description: business.description ?? '',
		district: business.district ?? '',
		municipality: business.municipality ?? '',
		address: business.address ?? '',
		phone: business.phone ?? '',
		websiteUrl: business.websiteUrl ?? '',
		trustScore: business.trustScore,
		starRating: business.starRating,
		totalReviews: business.totalReviews,
		ratingDistribution: business.ratingDistribution
	};
}

function normalizeReply(reply: {
	id: string;
	author: string;
	body: string;
	createdAt: number;
}): ReplyRecord {
	return {
		id: reply.id,
		author: reply.author,
		body: reply.body,
		createdAt: new Date(reply.createdAt).toISOString()
	};
}

function normalizeReview(review: RawReview): ReviewRecord {
	return {
		id: review._id,
		author: review.author?.name ?? 'Anonymous',
		stars: review.stars,
		title: review.title,
		body: review.body,
		createdAt: new Date(review.createdAt).toISOString(),
		source: review.source,
		replies: review.replies?.map(normalizeReply) ?? []
	};
}

export async function getCategories() {
	if (!convexBaseUrl()) {
		return fallbackCategories();
	}

	const response = await request<{ categories: RawCategory[] }>('/api/v1/categories');
	return response.categories.map(normalizeCategory);
}

export async function getCategory(slug: string) {
	if (!convexBaseUrl()) {
		const category = getStaticCategory(slug);
		if (!category) throw error(404, 'Category not found.');

		return {
			...fallbackCategories().find((item) => item.slug === slug)!,
			businesses: getStaticBusinessesByCategory(slug).map((business) => fallbackBusinessSummary(business))
		};
	}

	const response = await request<{
		category: RawCategory & { businesses: RawBusiness[] };
	}>(`/api/v1/categories?slug=${encodeURIComponent(slug)}`);

	return {
		...normalizeCategory(response.category),
		businesses: response.category.businesses.map(normalizeBusiness)
	};
}

export async function getFeaturedBusinesses(limit = 6) {
	if (!convexBaseUrl()) {
		return staticBusinesses.slice(0, limit).map((business, index) => fallbackBusinessSummary(business, index));
	}

	const response = await request<{ businesses: RawBusiness[] }>(
		`/api/v1/businesses?featured=1&limit=${limit}`
	);
	return response.businesses.map(normalizeBusiness);
}

export async function searchBusinesses(query: string) {
	if (!convexBaseUrl()) {
		return searchStaticBusinesses(query).map((business) => fallbackBusinessSummary(business));
	}

	const response = await request<{ businesses: RawBusiness[] }>(
		`/api/v1/businesses?search=${encodeURIComponent(query)}`
	);
	return response.businesses.map(normalizeBusiness);
}

export async function getBusiness(slug: string) {
	if (!convexBaseUrl()) {
		const business = getStaticBusiness(slug);
		if (!business) throw error(404, 'Business not found.');
		return fallbackBusinessSummary(business);
	}

	const response = await request<{ business: RawBusiness }>(
		`/api/v1/businesses?slug=${encodeURIComponent(slug)}`
	);
	return normalizeBusiness(response.business);
}

export async function getBusinessWithReviews(slug: string): Promise<BusinessRecord> {
	if (!convexBaseUrl()) {
		const business = getStaticBusiness(slug);
		if (!business) throw error(404, 'Business not found.');
		return fallbackBusinessRecord(business);
	}

	const [business, reviewsResponse] = await Promise.all([
		getBusiness(slug),
		request<{ reviews: RawReview[] }>(`/api/v1/reviews?businessSlug=${encodeURIComponent(slug)}`)
	]);

	return {
		...business,
		reviews: reviewsResponse.reviews.map(normalizeReview)
	};
}

export async function createReview(input: {
	businessSlug: string;
	stars: number;
	title: string;
	body: string;
	user: AuthUser;
}) {
	if (!convexBaseUrl()) {
		return { reviewId: `static-review-${Date.now()}` };
	}

	const user = {
		id: input.user.id,
		email: input.user.email,
		name: input.user.name
	};

	return request<{ reviewId: string }>(`/api/v1/reviews`, {
		method: 'POST',
		body: JSON.stringify({ ...input, user })
	});
}

export async function createReply(input: {
	reviewId: string;
	body: string;
	user: AuthUser;
}) {
	if (!convexBaseUrl()) {
		return { reviewId: input.reviewId };
	}

	const user = {
		id: input.user.id,
		email: input.user.email,
		name: input.user.name
	};

	return request<{ reviewId: string }>(`/api/v1/reviews/reply`, {
		method: 'POST',
		body: JSON.stringify({ ...input, user })
	});
}
