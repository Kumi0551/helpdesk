import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/libs/prismadb";

export async function authMiddleware(request: NextRequest) {
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

    // Rate limiting check using the ApiLog
    const recentRequests = await checkRateLimit(token.sub as string);
    if (recentRequests > 100) {
      // 100 requests per minute limit
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
      });
    }
  }

  return NextResponse.next();
}

async function checkRateLimit(userId: string): Promise<number> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  // Count requests in the last minute
  const count = await prisma.apiLog.count({
    where: {
      userId: userId,
      createdAt: {
        gte: oneMinuteAgo,
      },
    },
  });

  return count;
}
