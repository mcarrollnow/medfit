'use client'

import { getSupabaseBrowserClient } from './supabase-client'

/**
 * Get auth headers for API requests from the client
 */
export async function getAuthHeaders() {
  const supabase = getSupabaseBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

/**
 * Get current user from client-side auth session
 */
export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!profile) {
    return {
      id: user.id,
      authId: user.id,
      email: user.email || '',
      firstName: '',
      lastName: '',
      role: 'customer'
    }
  }

  return {
    id: profile.id,
    authId: user.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role
  }
}

/**
 * Get customer profile from client
 */
export async function getCustomerProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = getSupabaseBrowserClient()
  
  // Join customers with users to get full profile including name and email
  const { data: customer } = await supabase
    .from('customers')
    .select(`
      *,
      users:user_id (
        first_name,
        last_name,
        email
      )
    `)
    .eq('user_id', user.id)
    .single()

  // Flatten the response to include user fields at the top level
  if (customer && customer.users) {
    const userFields = Array.isArray(customer.users) ? customer.users[0] : customer.users
    return {
      ...customer,
      first_name: userFields.first_name,
      last_name: userFields.last_name,
      email: userFields.email,
      users: undefined // Remove the nested users object
    }
  }

  return customer
}
