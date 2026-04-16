import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createReview, getBusiness } from '$lib/server/convex';

export const load: PageServerLoad = async ({ params }) => {
	return {
		business: await getBusiness(params.businessSlug)
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user || !locals.accessToken) {
			return fail(401, { error: 'Sign in to write a review.' });
		}

		const formData = await request.formData();
		const stars = Number(formData.get('stars') ?? '0');
		const title = String(formData.get('title') ?? '').trim();
		const body = String(formData.get('body') ?? '').trim();

		if (!stars || stars < 1 || stars > 5 || !title || !body) {
			return fail(400, {
				error: 'Rating, title, and review body are required.',
				stars,
				title,
				body
			});
		}

		await createReview({
			businessSlug: params.businessSlug,
			stars,
			title,
			body,
			accessToken: locals.accessToken,
			user: locals.user
		});

		return {
			success: true
		};
	}
};
