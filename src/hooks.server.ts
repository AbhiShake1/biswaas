import type { Handle } from '@sveltejs/kit';
import {
  workos,
  WORKOS_COOKIE_PASSWORD,
  COOKIE_NAME,
  sessionCookieOptions,
  toAuthUser,
} from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = null;

  const sessionCookie = event.cookies.get(COOKIE_NAME);
  if (!sessionCookie) return resolve(event);

  try {
    const result = await workos.userManagement.authenticateWithSessionCookie({
      sessionData: sessionCookie,
      cookiePassword: WORKOS_COOKIE_PASSWORD,
    });

    if (result.authenticated) {
      event.locals.user = toAuthUser(result.user);
      if ('sealedSession' in result && result.sealedSession) {
        event.cookies.set(
          COOKIE_NAME,
          result.sealedSession as string,
          sessionCookieOptions(event.url),
        );
      }
    } else {
      // Try refreshing the sealed session
      const session = workos.userManagement.loadSealedSession({
        sessionData: sessionCookie,
        cookiePassword: WORKOS_COOKIE_PASSWORD,
      });
      const refreshed = await session.refresh();
      if (refreshed.authenticated && refreshed.sealedSession) {
        event.cookies.set(
          COOKIE_NAME,
          refreshed.sealedSession,
          sessionCookieOptions(event.url),
        );
        const fresh = await workos.userManagement.authenticateWithSessionCookie({
          sessionData: refreshed.sealedSession,
          cookiePassword: WORKOS_COOKIE_PASSWORD,
        });
        if (fresh.authenticated) {
          event.locals.user = toAuthUser(fresh.user);
        }
      } else {
        event.cookies.delete(COOKIE_NAME, { path: '/' });
      }
    }
  } catch (err) {
    console.error('[auth] session validation failed:', err);
    event.cookies.delete(COOKIE_NAME, { path: '/' });
  }

  return resolve(event);
};
