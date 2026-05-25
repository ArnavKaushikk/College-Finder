import { NextResponse } from 'next/server';
import { getSessionCookieName } from '@/lib/auth/cookies';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
