import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { siteConfig } from '@/lib/site-config'

// Paths that should always be accessible (even during maintenance)
// Note: /admin is NOT in this list - superadmin role check happens separately
const MAINTENANCE_BYPASS_PATHS = [
  '/maintenance',
  '/login',
  '/register',
  '/set-password',
  '/forgot-password',
  '/api',
  '/_next',
  '/favicon',
  '/images',
]

// Supply store roles - these users ONLY see the supply store
const SUPPLY_STORE_ROLES = ['gymowner', 'spaowner', 'wellnessowner']

// Peptide store paths that supply store users should NOT access
const PEPTIDE_STORE_PATHS = [
  '/dashboard',
  '/cart',
  '/checkout',
  '/products',
  '/order-confirmation',
  '/order-status',
  '/payment',
  '/crypto-payment',
  '/crypto-setup',
]

// Supply store paths
const SUPPLY_STORE_PATHS = [
  '/supply-store',
]

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Redirect checkout subdomain to main domain
  if (hostname.startsWith('checkout.')) {
    const url = request.nextUrl.clone()
    url.hostname = siteConfig.domain

    console.log(`[Middleware] Redirecting from ${hostname} to ${url.hostname}`)
    return NextResponse.redirect(url, 301) // Permanent redirect
  }

  // Create a Supabase client configured to use cookies
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - this is crucial for auth to work!
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user role early - needed for both maintenance bypass and route protection
  let userRole: string | null = null
  if (user) {
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()
    
    userRole = userProfile?.role || user.user_metadata?.role || 'customer'
  }

  // Check maintenance mode - only for non-bypass paths
  const shouldCheckMaintenance = !MAINTENANCE_BYPASS_PATHS.some(path => 
    pathname.startsWith(path) || pathname === path
  )

  if (shouldCheckMaintenance) {
    try {
      // Direct database query for maintenance status (no caching issues)
      const { data: maintenanceData } = await supabase
        .from('maintenance_settings')
        .select('enabled')
        .single()

      if (maintenanceData?.enabled) {
        // Only superadmin can bypass maintenance mode
        if (userRole !== 'superadmin') {
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      }
    } catch {
      // If table doesn't exist or error, continue normally
    }
  }

  // Role-based dashboard protection
  if (user) {
    const role = userRole || 'customer'
    const isSupplyStoreUser = SUPPLY_STORE_ROLES.includes(role)
    const isOnSupplyStorePath = SUPPLY_STORE_PATHS.some(p => pathname.startsWith(p))
    const isOnPeptideStorePath = PEPTIDE_STORE_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

    // Supply store users: redirect to supply store if trying to access peptide store
    if (isSupplyStoreUser) {
      // Redirect from peptide store paths to supply store
      if (isOnPeptideStorePath) {
        return NextResponse.redirect(new URL('/supply-store', request.url))
      }
      // Redirect from admin/rep routes to supply store
      if (pathname.startsWith('/admin') || pathname.startsWith('/rep')) {
        return NextResponse.redirect(new URL('/supply-store', request.url))
      }
      // Redirect from home to supply store (they should land on supply store)
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/supply-store', request.url))
      }
    }

    // Non-supply-store users: redirect away from supply store
    if (!isSupplyStoreUser && isOnSupplyStorePath) {
      // Admins/superadmins can access supply store for management purposes
      if (role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Dashboard routing
    if (pathname === '/dashboard' || pathname.startsWith('/admin') || pathname.startsWith('/rep')) {
      // Redirect to correct dashboard based on role
      if (pathname === '/dashboard') {
        // Customer dashboard - redirect admins/superadmins and reps to their dashboards
        if (role === 'admin' || role === 'superadmin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'rep') {
          return NextResponse.redirect(new URL('/rep', request.url))
        }
        // Supply store users should never see customer dashboard
        if (isSupplyStoreUser) {
          return NextResponse.redirect(new URL('/supply-store', request.url))
        }
      }

      // Admin routes - allow both admin and superadmin
      if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'superadmin') {
        if (role === 'rep') {
          return NextResponse.redirect(new URL('/rep', request.url))
        }
        if (isSupplyStoreUser) {
          return NextResponse.redirect(new URL('/supply-store', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Rep routes - allow reps, admins, and superadmins
      if (pathname.startsWith('/rep') && role !== 'rep' && role !== 'admin' && role !== 'superadmin') {
        if (isSupplyStoreUser) {
          return NextResponse.redirect(new URL('/supply-store', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Protect dashboards from unauthenticated users
  if (!user && (pathname === '/dashboard' || pathname.startsWith('/admin') || pathname.startsWith('/rep') || pathname.startsWith('/supply-store'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - icon (icon files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/.*|.*\\.png$|.*\\.svg$).*)',
  ],
}
