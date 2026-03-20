import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase server client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('cookie') || ''
          const cookies: Array<{ name: string; value: string }> = []

          if (cookieHeader) {
            cookieHeader.split('; ').forEach(cookie => {
              const [name, value] = cookie.split('=')
              if (name && value) {
                cookies.push({ name, value })
              }
            })
          }

          return cookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get authenticated user from Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('Middleware: User:', user?.email, 'Path:', request.nextUrl.pathname, 'Cookies:', request.headers.get('cookie')?.substring(0, 100))

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/api/flows', '/api/teams', '/api/users']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !user) {
    console.log('Middleware: No user found for protected route, redirecting to login')
    const loginUrl = new URL('/auth/login', request.url)

    // Add redirect query parameter with the original URL
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)

    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth pages while authenticated, redirect to dashboard
  const authRoutes = ['/auth/login', '/auth/register']
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isVerifyRoute = request.nextUrl.pathname.startsWith('/auth/verify')

  if (isAuthRoute && user && !isVerifyRoute) {
    console.log('Middleware: User authenticated, redirecting from auth page to dashboard')
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}