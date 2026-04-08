import { env } from '$env/static/private';

// WorkOS configuration
const WORKOS_CLIENT_ID = env.WORKOS_CLIENT_ID || 'dev_client_id';
const WORKOS_API_KEY = env.WORKOS_API_KEY || 'dev_api_key';
const WORKOS_REDIRECT_URI = env.WORKOS_REDIRECT_URI || 'http://localhost:5173/auth/callback';
const COOKIE_PASSWORD = env.WORKOS_COOKIE_PASSWORD || 'a]very$ecure32charpassword!!!!!';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// In dev mode, provide a mock user
const DEV_USER: AuthUser = {
  id: 'dev_user_001',
  email: 'dev@biswaas.np',
  name: 'Dev User',
};

export function isDevMode(): boolean {
  return !env.WORKOS_API_KEY || env.WORKOS_API_KEY === 'dev_api_key';
}

export function getSignInUrl(): string {
  if (isDevMode()) {
    return '/auth/callback?code=dev_code';
  }
  return `https://api.workos.com/sso/authorize?client_id=${WORKOS_CLIENT_ID}&redirect_uri=${encodeURIComponent(WORKOS_REDIRECT_URI)}&response_type=code`;
}

export function getSignUpUrl(): string {
  return getSignInUrl(); // WorkOS handles both
}

export async function getSessionUser(cookies: any): Promise<AuthUser | null> {
  const session = cookies.get('biswaas_session');
  if (!session) return null;

  try {
    return JSON.parse(atob(session));
  } catch {
    return null;
  }
}

export function setSessionCookie(cookies: any, user: AuthUser) {
  cookies.set('biswaas_session', btoa(JSON.stringify(user)), {
    path: '/',
    httpOnly: true,
    secure: false, // set true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(cookies: any) {
  cookies.delete('biswaas_session', { path: '/' });
}
