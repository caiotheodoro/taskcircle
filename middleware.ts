import { NextResponse } from 'next/server';

import { auth } from './server/auth';

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!req.auth && !isAuthPage) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && isAuthPage) {
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
