import { WorkOS } from '@workos-inc/node';
import { env } from '$env/dynamic/private';

const API_KEY = env.WORKOS_API_KEY ?? '';
export const WORKOS_CLIENT_ID = env.WORKOS_CLIENT_ID ?? '';
export const WORKOS_COOKIE_PASSWORD = env.WORKOS_COOKIE_PASSWORD ?? '';
const REDIRECT_URI = env.WORKOS_REDIRECT_URI ?? '';

if (!API_KEY || !WORKOS_CLIENT_ID || !WORKOS_COOKIE_PASSWORD) {
  console.warn('[auth] Missing WORKOS_* env vars — auth will fail at runtime');
}

export const workos = new WorkOS(API_KEY, { clientId: WORKOS_CLIENT_ID });

export const COOKIE_NAME = 'wos-session';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export function sessionCookieOptions(url: URL) {
  return {
    path: '/' as const,
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

export function buildAuthorizationUrl(origin: string): string {
  return workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    clientId: WORKOS_CLIENT_ID,
    redirectUri: REDIRECT_URI || `${origin}/auth/callback`,
  });
}

export function toAuthUser(u: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}): AuthUser {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email;
  return {
    id: u.id,
    email: u.email,
    name,
    avatarUrl: u.profilePictureUrl ?? undefined,
  };
}
