import type { LayoutServerLoad } from './$types';
import { getCategories } from '$lib/server/convex';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    categories: await getCategories()
  };
};
