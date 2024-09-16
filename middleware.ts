import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    salt: process.env.NEXTAUTH_SALT,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  /* if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }*/

  if (token && isAuthPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
