import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const user = await getSessionUser(event.cookies);
  event.locals.user = user;
  return resolve(event);
};
