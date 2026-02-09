'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export interface MaintenanceSettings {
  id?: string
  enabled: boolean
  title: string
  subtitle: string
  font_size: number
  font_weight: string
  font_style: string
  text_color: string
  show_subtitle: boolean
  subtitle_font_size: number
  // Visual effect settings
  pulse_style?: string
  pulse_amplitude?: number
  light_radius?: number
  light_concentration?: number
  persistence_factor?: number
  color_speed?: number
  grid_scale?: number
  use_color_cycle?: boolean
  static_color?: string
  updated_at?: string
}

const defaultSettings: MaintenanceSettings = {
  enabled: false,
  title: 'Under Maintenance',
  subtitle: 'We\'ll be back soon',
  font_size: 72,
  font_weight: '700',
  font_style: 'normal',
  text_color: '#FFFFFF',
  show_subtitle: true,
  subtitle_font_size: 24,
}

// No in-memory caching - always fetch fresh for maintenance mode
// This is critical because maintenance mode needs to be instantly responsive

export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[MaintenanceSettings] No database connection')
      return defaultSettings
    }

    const { data, error } = await supabase
      .from('maintenance_settings')
      .select('*')
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('[MaintenanceSettings] Error fetching settings:', error)
      }
      return defaultSettings
    }

    return { ...defaultSettings, ...data }
  } catch (error) {
    console.error('[MaintenanceSettings] Error:', error)
    return defaultSettings
  }
}

export async function updateMaintenanceSettings(settings: Partial<MaintenanceSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return { success: false, error: 'No database connection' }
    }

    const { error } = await supabase
      .from('maintenance_settings')
      .upsert([{ ...settings, id: settings.id || '1', updated_at: new Date().toISOString() }], { onConflict: 'id' })

    if (error) {
      console.error('[MaintenanceSettings] Error updating:', error)
      return { success: false, error: error.message }
    }

    // Revalidate all paths to ensure maintenance mode change takes effect
    revalidatePath('/', 'layout')
    revalidatePath('/maintenance')

    return { success: true }
  } catch (error: any) {
    console.error('[MaintenanceSettings] Error:', error)
    return { success: false, error: error.message }
  }
}

export async function clearMaintenanceSettingsCache() {
  // Revalidate all paths to bust Next.js cache
  revalidatePath('/', 'layout')
  revalidatePath('/maintenance')
}

// Quick check for maintenance mode (used in middleware)
export async function isMaintenanceModeEnabled(): Promise<boolean> {
  const settings = await getMaintenanceSettings()
  return settings.enabled
}

