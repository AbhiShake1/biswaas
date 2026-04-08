import type { PageServerLoad } from './$types';
import { getCategories, getFeaturedBusinesses } from '$lib/server/convex';

export const load: PageServerLoad = async () => {
	const [categories, featuredBusinesses] = await Promise.all([
		getCategories(),
		getFeaturedBusinesses(6)
	]);

	return {
		categories,
		featuredBusinesses
	};
};
