'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface PCIScanSchedule {
  id: string
  scan_name: string
  scanner_provider: string
  scheduled_start: string
  scheduled_end: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface PCIScannerIP {
  id: string
  ip_range: string
  description: string | null
  provider: string
  is_active: boolean
  created_at: string
}

// Get all scan schedules
export async function getScanSchedules(): Promise<{
  data: PCIScanSchedule[] | null
  error: string | null
}> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('pci_scan_schedules')
      .select('*')
      .order('scheduled_start', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching scan schedules:', error)
    return { data: null, error: error.message }
  }
}

// Get upcoming/active scans
export async function getActiveAndUpcomingScans(): Promise<{
  data: PCIScanSchedule[] | null
  error: string | null
}> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('pci_scan_schedules')
      .select('*')
      .in('status', ['scheduled', 'active'])
      .order('scheduled_start', { ascending: true })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching active scans:', error)
    return { data: null, error: error.message }
  }
}

// Get scanner IPs
export async function getScannerIPs(): Promise<{
  data: PCIScannerIP[] | null
  error: string | null
}> {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('pci_scanner_ips')
      .select('*')
      .order('ip_range', { ascending: true })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching scanner IPs:', error)
    return { data: null, error: error.message }
  }
}

// Create a new scan schedule
export async function createScanSchedule(schedule: {
  scan_name: string
  scanner_provider: string
  scheduled_start: string
  scheduled_end: string
  notes?: string
}): Promise<{ success: boolean; data: PCIScanSchedule | null; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { data, error } = await supabase
      .from('pci_scan_schedules')
      .insert({
        ...schedule,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Error creating scan schedule:', error)
    return { success: false, data: null, error: error.message }
  }
}

// Update scan schedule
export async function updateScanSchedule(
  id: string,
  updates: Partial<Omit<PCIScanSchedule, 'id' | 'created_at' | 'updated_at' | 'created_by'>>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { error } = await supabase
      .from('pci_scan_schedules')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error updating scan schedule:', error)
    return { success: false, error: error.message }
  }
}

// Delete scan schedule
export async function deleteScanSchedule(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { error } = await supabase
      .from('pci_scan_schedules')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error deleting scan schedule:', error)
    return { success: false, error: error.message }
  }
}

// Update scan status
export async function updateScanStatus(
  id: string,
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { error } = await supabase
      .from('pci_scan_schedules')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error updating scan status:', error)
    return { success: false, error: error.message }
  }
}

// Add scanner IP
export async function addScannerIP(ip: {
  ip_range: string
  description?: string
  provider: string
}): Promise<{ success: boolean; data: PCIScannerIP | null; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { data, error } = await supabase
      .from('pci_scanner_ips')
      .insert({
        ...ip,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, data, error: null }
  } catch (error: any) {
    console.error('Error adding scanner IP:', error)
    return { success: false, data: null, error: error.message }
  }
}

// Toggle scanner IP active status
export async function toggleScannerIP(
  id: string,
  is_active: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { error } = await supabase
      .from('pci_scanner_ips')
      .update({ is_active })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error toggling scanner IP:', error)
    return { success: false, error: error.message }
  }
}

// Delete scanner IP
export async function deleteScannerIP(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) throw new Error('Admin client not available')

    const { error } = await supabase
      .from('pci_scanner_ips')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/pci-scan')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error deleting scanner IP:', error)
    return { success: false, error: error.message }
  }
}

// Check if any scan is currently active (within window)
export async function checkActiveScanWindow(): Promise<{
  isActive: boolean
  activeScan: PCIScanSchedule | null
  error: string | null
}> {
  try {
    const supabase = await getSupabaseServerClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('pci_scan_schedules')
      .select('*')
      .lte('scheduled_start', now)
      .gte('scheduled_end', now)
      .in('status', ['scheduled', 'active'])
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

    return { 
      isActive: !!data, 
      activeScan: data || null, 
      error: null 
    }
  } catch (error: any) {
    console.error('Error checking active scan window:', error)
    return { isActive: false, activeScan: null, error: error.message }
  }
}
