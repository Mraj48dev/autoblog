import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages for everyone
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }

        // Protected routes that require authentication
        const protectedRoutes = [
          '/dashboard',
          '/sites',
          '/automations',
          '/profile',
        ]

        const isProtectedRoute = protectedRoutes.some((route) =>
          req.nextUrl.pathname.startsWith(route)
        )

        if (isProtectedRoute) {
          return !!token
        }

        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sites/:path*',
    '/automations/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
}
