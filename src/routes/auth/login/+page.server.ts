import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { buildAuthorizationUrl } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) throw redirect(303, '/');
  throw redirect(302, buildAuthorizationUrl(url.origin));
};
