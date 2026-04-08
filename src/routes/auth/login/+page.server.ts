import { redirect } from '@sveltejs/kit';
import { getSignInUrl } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/');
  throw redirect(303, getSignInUrl());
};
