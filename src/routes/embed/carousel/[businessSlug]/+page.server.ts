import type { PageServerLoad } from './$types';
import { getBusinessWithReviews } from '$lib/server/convex';

export const load: PageServerLoad = async ({ params }) => {
	return {
		business: await getBusinessWithReviews(params.businessSlug)
	};
};
