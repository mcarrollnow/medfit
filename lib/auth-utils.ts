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
 * Verify user is admin
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'admin') {
    return { authenticated: false, error: 'Admin access required' }
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
 * Verify user is supplier or superadmin
 */
export async function verifySupplier(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  const role = authResult.user?.role
  if (role !== 'supplier' && role !== 'superadmin') {
    return { authenticated: false, error: 'Supplier access required' }
  }
  
  return authResult
}

// Supply Store Roles
export const SUPPLY_STORE_ROLES = ['gymowner', 'spaowner', 'wellnessowner'] as const
export type SupplyStoreRole = typeof SUPPLY_STORE_ROLES[number]

/**
 * Check if a role is a supply store role
 */
export function isSupplyStoreRole(role: string): role is SupplyStoreRole {
  return SUPPLY_STORE_ROLES.includes(role as SupplyStoreRole)
}

/**
 * Verify user has supply store access (gymowner, spaowner, or wellnessowner)
 */
export async function verifySupplyStoreAccess(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  const role = authResult.user?.role
  if (!role || !isSupplyStoreRole(role)) {
    return { authenticated: false, error: 'Supply store access required (gymowner, spaowner, or wellnessowner)' }
  }
  
  return authResult
}

/**
 * Verify user is a gym owner
 */
export async function verifyGymOwner(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'gymowner') {
    return { authenticated: false, error: 'Gym owner access required' }
  }
  
  return authResult
}

/**
 * Verify user is a spa owner
 */
export async function verifySpaOwner(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'spaowner') {
    return { authenticated: false, error: 'Spa owner access required' }
  }
  
  return authResult
}

/**
 * Verify user is a wellness center owner
 */
export async function verifyWellnessOwner(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request)
  
  if (!authResult.authenticated) {
    return authResult
  }
  
  if (authResult.user?.role !== 'wellnessowner') {
    return { authenticated: false, error: 'Wellness center owner access required' }
  }
  
  return authResult
}

/**
 * Get the business type from a supply store role
 */
export function getBusinessTypeFromRole(role: SupplyStoreRole): 'gym' | 'medspa' | 'wellness' {
  switch (role) {
    case 'gymowner':
      return 'gym'
    case 'spaowner':
      return 'medspa'
    case 'wellnessowner':
      return 'wellness'
  }
}