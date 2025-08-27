import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function authMiddleware(request: NextRequest) {
  try {
    // Exclude authentication for public routes
    const publicRoutes = ['/signin', '/api/auth']
    if (publicRoutes.some(route => request.url.includes(route))) {
      return NextResponse.next()
    }

  const token = await getToken({ req: request })

    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // Check if user is active
    if (!token.isActive) {
      return NextResponse.redirect(new URL('/signin?error=Account+deactivated', request.url))
    }

    // Check role-based access for admin routes
    if (request.url.includes('/admin') && token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    '/((?!signin|api/auth|_next/static|_next/image|favicon.ico|auth/images).*)',
  ],
}
