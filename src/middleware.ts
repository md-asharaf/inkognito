import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (!isDashboard && !isAuthRoute) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  let isAuth = false;

  if (sessionCookie) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: { cookie: request.headers.get("cookie") || "" },
      });
      if (response.ok) {
        const data = await response.json();
        isAuth = !!data?.session;
      }
    } catch (error) {
      isAuth = false;
    }
  }

  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAuth && isDashboard) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
