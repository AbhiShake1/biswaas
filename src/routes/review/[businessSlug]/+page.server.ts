import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createReply, getBusinessWithReviews } from '$lib/server/convex';

export const load: PageServerLoad = async ({ params }) => {
	return {
		business: await getBusinessWithReviews(params.businessSlug)
	};
};

export const actions: Actions = {
	reply: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { replyError: 'Sign in to reply to reviews.' });
		}

		const formData = await request.formData();
		const reviewId = String(formData.get('reviewId') ?? '');
		const body = String(formData.get('body') ?? '').trim();

		if (!reviewId || !body) {
			return fail(400, {
				replyError: 'A reply body is required.',
				replyReviewId: reviewId
			});
		}

		await createReply({
			reviewId,
			body,
			user: locals.user
		});

		return {
			replySuccess: true,
			replyReviewId: reviewId
		};
	}
};
