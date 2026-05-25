const COOKIE_NAME = 'college_session';

export function getSessionCookieName() {
  return COOKIE_NAME;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function buildSessionCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS_MS,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}
