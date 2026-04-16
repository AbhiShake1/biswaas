import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  workos,
  WORKOS_CLIENT_ID,
  WORKOS_COOKIE_PASSWORD,
  COOKIE_NAME,
  sessionCookieOptions,
} from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  if (!code) throw redirect(303, '/auth/login');

  let result;
  try {
    result = await workos.userManagement.authenticateWithCode({
      code,
      clientId: WORKOS_CLIENT_ID,
      session: {
        sealSession: true,
        cookiePassword: WORKOS_COOKIE_PASSWORD,
      },
    });
  } catch (err: any) {
    console.error('[auth] authenticateWithCode failed:', err);
    throw error(401, err?.errorDescription ?? err?.message ?? 'Authentication failed');
  }

  if (result.sealedSession) {
    cookies.set(COOKIE_NAME, result.sealedSession, sessionCookieOptions(url));
  }
  throw redirect(303, '/');
};
