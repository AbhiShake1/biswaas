import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isDevMode, setSessionCookie } from '$lib/server/auth';
import type { AuthUser } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');

  let user: AuthUser;

  if (isDevMode()) {
    // Dev mode: create mock user
    user = {
      id: 'dev_user_001',
      email: 'dev@biswaas.np',
      name: 'Dev User',
    };
  } else {
    // Production: exchange code with WorkOS
    // TODO: Implement real WorkOS token exchange
    throw new Error('WorkOS production auth not yet configured');
  }

  setSessionCookie(cookies, user);
  throw redirect(303, '/');
};
