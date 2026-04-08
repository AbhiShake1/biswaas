import type { PageServerLoad } from './$types';
import { searchBusinesses } from '$lib/server/convex';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	return {
		query,
		results: query ? await searchBusinesses(query) : []
	};
};
