import type { PageServerLoad } from './$types';
import { getBusiness } from '$lib/server/convex';

export const load: PageServerLoad = async ({ params }) => {
	return {
		business: await getBusiness(params.businessSlug)
	};
};
