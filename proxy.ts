import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
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

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeaders: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      isAuthenticated = sessionResponse.data.success;

      const setCookie = sessionResponse.headers['set-cookie'];

      if (setCookie) {
        setCookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (!isAuthenticated && isPrivateRoute) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isAuthenticated && isPublicRoute) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else {
    response = NextResponse.next();
  }

  for (const cookieStr of setCookieHeaders) {
    const parsed = parseSetCookie(cookieStr);

    if (parsed.value) {
      response.cookies.set(parsed.name, parsed.value, parsed);
    }
  }

  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
