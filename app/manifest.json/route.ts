import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/app/actions/site-settings'

export async function GET() {
  const settings = await getSiteSettings()

  const manifest = {
    name: settings.app_name || settings.site_name || 'My Store',
    short_name: settings.app_short_name || 'Store',
    description: settings.app_description || settings.meta_description || '',
    start_url: settings.start_url || '/',
    display: settings.display_mode || 'standalone',
    background_color: settings.background_color || '#000000',
    theme_color: settings.theme_color || '#000000',
    icons: [
      {
        src: settings.app_icon_192_url || '/icon.svg',
        sizes: settings.app_icon_192_url ? '192x192' : 'any',
        type: settings.app_icon_192_url ? 'image/png' : 'image/svg+xml',
        purpose: 'any maskable'
      },
      {
        src: settings.app_icon_512_url || '/icon.svg',
        sizes: settings.app_icon_512_url ? '512x512' : 'any',
        type: settings.app_icon_512_url ? 'image/png' : 'image/svg+xml',
        purpose: 'any maskable'
      },
      {
        src: settings.apple_touch_icon_url || '/icon.svg',
        sizes: settings.apple_touch_icon_url ? '180x180' : 'any',
        type: settings.apple_touch_icon_url ? 'image/png' : 'image/svg+xml'
      },
    ],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

