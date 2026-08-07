import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route =>
    matchesRoute(pathname, route),
  );

  const isPublicRoute = publicRoutes.some(route =>
    matchesRoute(pathname, route),
  );

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated && refreshToken) {
    try {
      const cookieHeader = request.headers.get('cookie') ?? '';

      isAuthenticated = await checkSession(cookieHeader);
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
