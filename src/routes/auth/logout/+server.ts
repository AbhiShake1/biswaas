import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { workos, WORKOS_COOKIE_PASSWORD, COOKIE_NAME } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  const sessionCookie = cookies.get(COOKIE_NAME);
  cookies.delete(COOKIE_NAME, { path: '/' });

  if (sessionCookie) {
    try {
      const result = await workos.userManagement.authenticateWithSessionCookie({
        sessionData: sessionCookie,
        cookiePassword: WORKOS_COOKIE_PASSWORD,
      });
      if (result.authenticated && result.sessionId) {
        const logoutUrl = workos.userManagement.getLogoutUrl({ sessionId: result.sessionId });
        throw redirect(302, logoutUrl);
      }
    } catch (err) {
      // Re-throw redirect responses; swallow auth errors (session already expired).
      if (err && typeof err === 'object' && 'status' in err && 'location' in err) throw err;
    }
  }

  throw redirect(303, '/');
};
