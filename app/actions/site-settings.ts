'use server'

import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export interface SiteSettings {
  id?: string
  // Branding
  site_name: string
  site_tagline: string
  logo_light_url: string
  logo_dark_url: string
  favicon_light_url: string
  favicon_dark_url: string
  favicon_safari_url: string
  apple_touch_icon_url: string
  mask_icon_url: string
  mask_icon_color: string
  // SEO
  browser_title: string
  title_separator: string
  meta_description: string
  meta_keywords: string
  canonical_url: string
  robots_index: boolean
  robots_follow: boolean
  google_site_verification: string
  bing_site_verification: string
  // PWA / App
  app_name: string
  app_short_name: string
  app_description: string
  theme_color: string
  background_color: string
  display_mode: string
  start_url: string
  app_icon_192_url: string
  app_icon_512_url: string
  // Social / Open Graph
  og_title: string
  og_description: string
  og_image_url: string
  og_site_name: string
  og_type: string
  twitter_card: string
  twitter_site: string
  twitter_creator: string
  // Analytics
  google_analytics_id: string
  google_tag_manager_id: string
  facebook_pixel_id: string
  // Code Injection
  custom_head_code: string
  custom_body_start_code: string
  custom_body_end_code: string
  custom_css: string
  // Shop Hero
  shop_hero_title: string
  shop_hero_subtitle: string
}

const defaultSettings: SiteSettings = {
  site_name: 'My Store',
  site_tagline: '',
  logo_light_url: '',
  logo_dark_url: '',
  favicon_light_url: '',
  favicon_dark_url: '',
  favicon_safari_url: '',
  apple_touch_icon_url: '',
  mask_icon_url: '',
  mask_icon_color: '#000000',
  browser_title: 'My Store',
  title_separator: '|',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',
  robots_index: true,
  robots_follow: true,
  google_site_verification: '',
  bing_site_verification: '',
  app_name: 'My Store',
  app_short_name: 'Store',
  app_description: '',
  theme_color: '#000000',
  background_color: '#000000',
  display_mode: 'standalone',
  start_url: '/',
  app_icon_192_url: '',
  app_icon_512_url: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  og_site_name: '',
  og_type: 'website',
  twitter_card: 'summary_large_image',
  twitter_site: '',
  twitter_creator: '',
  google_analytics_id: '',
  google_tag_manager_id: '',
  facebook_pixel_id: '',
  custom_head_code: '',
  custom_body_start_code: '',
  custom_body_end_code: '',
  custom_css: '',
  shop_hero_title: 'Innovation is born where research lives.',
  shop_hero_subtitle: 'Premium quality compounds for scientific research. All products are ≥99% pure and third-party tested.',
}

// Cache the settings for 60 seconds
let cachedSettings: SiteSettings | null = null
let cacheTime: number = 0
const CACHE_DURATION = 60 * 1000 // 60 seconds

export async function getSiteSettings(): Promise<SiteSettings> {
  // Return cached settings if still valid
  if (cachedSettings && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[SiteSettings] No database connection')
      return defaultSettings
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('[SiteSettings] Error fetching settings:', error)
      }
      return defaultSettings
    }

    cachedSettings = { ...defaultSettings, ...data }
    cacheTime = Date.now()
    return cachedSettings
  } catch (error) {
    console.error('[SiteSettings] Error:', error)
    return defaultSettings
  }
}

// Clear cache (call after saving settings)
export async function clearSiteSettingsCache() {
  cachedSettings = null
  cacheTime = 0
}

