import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Inline these functions to avoid dynamic imports in edge runtime
function canAccessAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN'
}

function canAccessTenant(role: string): boolean {
  return [
    'TENANT_ADMIN',
    'RECEPTION', 
    'OFFICE_MANAGER',
    'SECURITY'
  ].includes(role)
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Public routes that don't require authentication
    if (pathname.startsWith('/auth') || pathname === '/') {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    const userRole = token.role as string

    // Admin routes - only super admin
    if (pathname.startsWith('/admin')) {
      if (!canAccessAdmin(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Tenant routes - tenant admins and staff
    if (pathname.startsWith('/tenant')) {
      if (!canAccessTenant(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // API routes protection
    if (pathname.startsWith('/api/admin')) {
      if (!canAccessAdmin(userRole)) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    if (pathname.startsWith('/api/tenant')) {
      if (!canAccessTenant(userRole)) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname === '/') {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    // Temporarily disabled until authentication is configured
    // '/admin/:path*',
    // '/tenant/:path*',
    '/api/admin/:path*',
    '/api/tenant/:path*'
  ]
}
