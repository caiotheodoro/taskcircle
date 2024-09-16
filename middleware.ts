import { NextRequest, NextResponse } from 'next/server';

import { auth } from './server/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!session && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
