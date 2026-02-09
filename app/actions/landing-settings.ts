'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export interface LandingSettings {
  id?: string
  hero_slogan: string
  hero_subtitle: string
  background_style: 'aurora' | 'gradient' | 'solid'
  background_color_1: string
  background_color_2: string
  background_color_3: string
  show_subtitle: boolean
  updated_at?: string
}

const defaultSettings: LandingSettings = {
  hero_slogan: 'Welcome to Modern Health Pro',
  hero_subtitle: 'Premium research compounds for scientific discovery',
  background_style: 'aurora',
  background_color_1: '#0f0f23',
  background_color_2: '#1a1a3e',
  background_color_3: '#0a192f',
  show_subtitle: true,
}

export async function getLandingSettings(): Promise<LandingSettings> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[LandingSettings] No database connection')
      return defaultSettings
    }

    const { data, error } = await supabase
      .from('landing_settings')
      .select('*')
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('[LandingSettings] Error fetching settings:', error)
      }
      return defaultSettings
    }

    return { ...defaultSettings, ...data }
  } catch (error) {
    console.error('[LandingSettings] Error:', error)
    return defaultSettings
  }
}

export async function updateLandingSettings(settings: Partial<LandingSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return { success: false, error: 'No database connection' }
    }

    const { error } = await supabase
      .from('landing_settings')
      .upsert([{ ...settings, id: settings.id || '1', updated_at: new Date().toISOString() }], { onConflict: 'id' })

    if (error) {
      console.error('[LandingSettings] Error updating:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/login')

    return { success: true }
  } catch (error: any) {
    console.error('[LandingSettings] Error:', error)
    return { success: false, error: error.message }
  }
}

