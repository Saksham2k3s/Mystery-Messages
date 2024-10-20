import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any });

  const url = request.nextUrl;

  // If user is already authenticated and tries to access login page, redirect to /home
  if (token && url.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated and tries to access sign-in, sign-up, verify, or root, redirect to /dashboard
  // add  url.pathname === '/'
  if (
    token &&
    (url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
      )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and tries to access dashboard, redirect to login
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue with the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in', '/', '/dashboard/:path*', '/verify/:path*', '/login', '/sign-up'],
};
