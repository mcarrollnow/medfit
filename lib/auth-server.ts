import { createServerClient } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

export interface AuthResult {
  authenticated: boolean
  error?: string
  user?: {
    id: string
    authId: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

/**
 * Verify user authentication from NextRequest
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const supabase = await createServerClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('[verifyAuth] No authenticated user')
      return { authenticated: false, error: 'Not authenticated' }
    }
    
    console.log('[verifyAuth] User authenticated:', user.id)
    
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    
    if (profileError || !profile) {
      // If no profile exists in users table, try to get basic info from auth
      console.log('[verifyAuth] No profile found in users table, using auth data')
      return {
        authenticated: true,
        user: {
          id: user.id,
          authId: user.id,
          email: user.email || '',
          firstName: '',
          lastName: '',
          role: user.user_metadata?.role || 'customer'
        }
      }
    }
    
    console.log('[verifyAuth] User profile found:', profile.id, 'role:', profile.role)
    
    return {
      authenticated: true,
      user: {
        id: profile.id,
        authId: user.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role
      }
    }
  } catch (error: any) {
    console.error('[verifyAuth] Exception:', error)
    return { authenticated: false, error: error.message }
  }
}

/**
 * Verify user is admin or superadmin
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  const role = authResult.user?.role
  if (role !== 'admin' && role !== 'superadmin') {
    return { authenticated: false, error: 'Admin access required' }
  }
  
  return authResult
}

/**
 * Verify user is superadmin only
 */
export async function verifySuperadmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'superadmin') {
    return { authenticated: false, error: 'Superadmin access required' }
  }
  
  return authResult
}

// Mike's account ID for exclusive features
export const MIKE_USER_ID = 'a125dd87-d9d1-4c9e-9165-c8ef376e5f80'
export const MIKE_EMAIL = 'dreamkidmedia@gmail.com'

/**
 * Verify user is Mike (for exclusive features)
 */
export async function verifyMike(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.id !== MIKE_USER_ID && authResult.user?.email !== MIKE_EMAIL) {
    return { authenticated: false, error: 'Access denied' }
  }
  
  return authResult
}

/**
 * Verify user is rep
 */
export async function verifyRep(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'rep') {
    return { authenticated: false, error: 'Rep access required' }
  }
  
  return authResult
}

/**
 * Verify user is supplier
 */
export async function verifySupplier(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'supplier') {
    return { authenticated: false, error: 'Supplier access required' }
  }
  
  return authResult
}
