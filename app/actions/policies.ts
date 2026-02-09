'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export interface PolicySection {
  id: string
  type: string
  title?: string
  icon?: string
  content?: string
  intro?: string
  extra?: string
  footer?: string
  items?: any[]
  subsections?: any[]
  columns?: any[]
  metadata?: Record<string, string>
}

export interface Policy {
  id: string
  slug: string
  title: string
  subtitle: string | null
  hero_tagline: string | null
  effective_date: string
  last_updated: string
  contact_email: string | null
  content: PolicySection[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getPolicies(): Promise<{ data: Policy[] | null; error: string | null }> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .order('title', { ascending: true })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching policies:', error)
    return { data: null, error: error.message }
  }
}

export async function getPolicy(slug: string): Promise<{ data: Policy | null; error: string | null }> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: 'Policy not found' }
      }
      throw error
    }
    
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching policy:', error)
    return { data: null, error: error.message }
  }
}

export async function getPolicyById(id: string): Promise<{ data: Policy | null; error: string | null }> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: 'Policy not found' }
      }
      throw error
    }
    
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching policy:', error)
    return { data: null, error: error.message }
  }
}

export async function updatePolicy(
  id: string,
  updates: Partial<Omit<Policy, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Use admin client to bypass RLS for policy updates
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      throw new Error('Admin client not available - check SUPABASE_SERVICE_ROLE_KEY')
    }
    
    const { data, error } = await supabase
      .from('policies')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      throw new Error('No rows updated - policy may not exist')
    }
    
    revalidatePath('/policy')
    revalidatePath('/privacy')
    revalidatePath('/pci_dss_policy')
    revalidatePath('/admin/policy')
    
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error updating policy:', error)
    return { success: false, error: error.message }
  }
}

export async function createPolicy(
  policy: Omit<Policy, 'created_at' | 'updated_at' | 'last_updated'>
): Promise<{ success: boolean; data: Policy | null; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      throw new Error('Admin client not available - check SUPABASE_SERVICE_ROLE_KEY')
    }
    
    const { data, error } = await supabase
      .from('policies')
      .insert({
        ...policy,
        last_updated: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/policy')
    revalidatePath('/admin/policy')
    
    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Error creating policy:', error)
    return { success: false, data: null, error: error.message }
  }
}

export async function deletePolicy(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      throw new Error('Admin client not available - check SUPABASE_SERVICE_ROLE_KEY')
    }
    
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/policy')
    revalidatePath('/admin/policy')
    
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error deleting policy:', error)
    return { success: false, error: error.message }
  }
}

export async function togglePolicyPublished(
  id: string,
  is_published: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      throw new Error('Admin client not available - check SUPABASE_SERVICE_ROLE_KEY')
    }
    
    const { error } = await supabase
      .from('policies')
      .update({ is_published })
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/policy')
    revalidatePath('/privacy')
    revalidatePath('/pci_dss_policy')
    revalidatePath('/admin/policy')
    
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error toggling policy published status:', error)
    return { success: false, error: error.message }
  }
}
