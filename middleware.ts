import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if user is trying to access protected routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Check if 2FA is required but not completed
    if (
      token.twoFactorEnabled &&
      !token.twoFactorVerified &&
      !request.nextUrl.pathname.startsWith("/2fa-verify")
    ) {
      return NextResponse.redirect(new URL("/2fa-verify", request.url));
    }

    // Check for account deactivation
    if (token.isActive === false) {
      return NextResponse.redirect(
        new URL("/account-deactivated", request.url)
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
