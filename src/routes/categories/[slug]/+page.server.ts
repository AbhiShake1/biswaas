import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategory } from '$lib/server/convex';

export const load: PageServerLoad = async ({ params }) => {
	try {
		return {
			category: await getCategory(params.slug)
		};
	} catch (err: any) {
		if (err?.status === 404) {
			throw error(404, 'Category not found');
		}

		throw err;
	}
};
