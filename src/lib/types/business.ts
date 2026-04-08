export type RatingDistribution = {
	one: number;
	two: number;
	three: number;
	four: number;
	five: number;
};

export type ReplyRecord = {
	id: string;
	author: string;
	body: string;
	createdAt: string;
};

export type ReviewRecord = {
	id: string;
	author: string;
	stars: number;
	title: string;
	body: string;
	createdAt: string;
	source?: 'organic' | 'imported' | 'invited';
	replies?: ReplyRecord[];
};

export type CategoryRecord = {
	id: string;
	name: string;
	slug: string;
	description: string;
	businessCount: number;
};

export type BusinessRecord = {
	id: string;
	name: string;
	slug: string;
	categorySlug: string;
	categoryName: string;
	description: string;
	district: string;
	municipality: string;
	address: string;
	phone: string;
	websiteUrl: string;
	trustScore: number;
	starRating: number;
	totalReviews: number;
	ratingDistribution: RatingDistribution;
	reviews: ReviewRecord[];
};

export type BusinessSummary = Omit<BusinessRecord, 'reviews'>;
