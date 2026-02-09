'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface SiteSettings {
  favicon_light_url?: string
  favicon_dark_url?: string
  favicon_safari_url?: string
  apple_touch_icon_url?: string
  theme_color?: string
  custom_css?: string
  custom_head_code?: string
  custom_body_start_code?: string
  custom_body_end_code?: string
  google_analytics_id?: string
  google_tag_manager_id?: string
  facebook_pixel_id?: string
}

export function SiteSettingsHead() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('favicon_light_url, favicon_dark_url, favicon_safari_url, apple_touch_icon_url, theme_color, custom_css, custom_head_code, custom_body_start_code, custom_body_end_code, google_analytics_id, google_tag_manager_id, facebook_pixel_id')
        .single()

      if (data) {
        setSettings(data)
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    if (!settings) return

    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    // Handle favicon based on color scheme and browser
    const updateFavicon = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Use Safari-specific PNG favicon for Safari, otherwise use SVG
      let faviconUrl: string | undefined
      if (isSafari && settings.favicon_safari_url) {
        faviconUrl = settings.favicon_safari_url
      } else {
        faviconUrl = isDark ? settings.favicon_dark_url : settings.favicon_light_url
      }
      
      if (faviconUrl) {
        // Only remove favicons we created (with our custom IDs)
        document.getElementById('dynamic-favicon')?.remove()
        document.getElementById('dynamic-shortcut-icon')?.remove()
        document.getElementById('dynamic-apple-touch-icon')?.remove()

        // Determine file type
        const isICO = faviconUrl.toLowerCase().endsWith('.ico')
        const isSVG = faviconUrl.toLowerCase().endsWith('.svg')
        const isPNG = faviconUrl.toLowerCase().endsWith('.png')
        
        // Add standard favicon (for Chrome, Firefox, etc.)
        const link = document.createElement('link')
        link.id = 'dynamic-favicon'
        link.rel = 'icon'
        if (isSVG) {
          link.type = 'image/svg+xml'
        } else if (isPNG) {
          link.type = 'image/png'
        } else if (isICO) {
          link.type = 'image/x-icon'
        }
        link.href = faviconUrl
        document.head.appendChild(link)

        // Add shortcut icon (for Safari and older browsers)
        const shortcutLink = document.createElement('link')
        shortcutLink.id = 'dynamic-shortcut-icon'
        shortcutLink.rel = 'shortcut icon'
        shortcutLink.href = faviconUrl
        document.head.appendChild(shortcutLink)
        
        // Add apple-touch-icon if available (for iOS Safari)
        if (settings.apple_touch_icon_url) {
          const appleLink = document.createElement('link')
          appleLink.id = 'dynamic-apple-touch-icon'
          appleLink.rel = 'apple-touch-icon'
          appleLink.href = settings.apple_touch_icon_url
          document.head.appendChild(appleLink)
        }
      }
    }

    // Update favicon on load and when color scheme changes
    updateFavicon()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateFavicon)

    // Update theme-color meta tag
    if (settings.theme_color) {
      let themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta')
        themeColorMeta.setAttribute('name', 'theme-color')
        document.head.appendChild(themeColorMeta)
      }
      themeColorMeta.setAttribute('content', settings.theme_color)
    }

    // Add custom CSS
    if (settings.custom_css) {
      let customStyle = document.getElementById('site-custom-css')
      if (!customStyle) {
        customStyle = document.createElement('style')
        customStyle.id = 'site-custom-css'
        document.head.appendChild(customStyle)
      }
      customStyle.textContent = settings.custom_css
    }

    // Inject custom head code
    if (settings.custom_head_code) {
      let customHead = document.getElementById('site-custom-head')
      if (!customHead) {
        customHead = document.createElement('div')
        customHead.id = 'site-custom-head'
        document.head.appendChild(customHead)
      }
      customHead.innerHTML = settings.custom_head_code
    }

    // Inject custom body start code
    if (settings.custom_body_start_code) {
      let customBodyStart = document.getElementById('site-custom-body-start')
      if (!customBodyStart) {
        customBodyStart = document.createElement('div')
        customBodyStart.id = 'site-custom-body-start'
        document.body.insertBefore(customBodyStart, document.body.firstChild)
      }
      customBodyStart.innerHTML = settings.custom_body_start_code
    }

    // Inject custom body end code
    if (settings.custom_body_end_code) {
      let customBodyEnd = document.getElementById('site-custom-body-end')
      if (!customBodyEnd) {
        customBodyEnd = document.createElement('div')
        customBodyEnd.id = 'site-custom-body-end'
        document.body.appendChild(customBodyEnd)
      }
      customBodyEnd.innerHTML = settings.custom_body_end_code
    }

    // Inject Google Analytics
    if (settings.google_analytics_id && !document.getElementById('ga-script')) {
      const gaScript = document.createElement('script')
      gaScript.id = 'ga-script'
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`
      document.head.appendChild(gaScript)

      const gaInit = document.createElement('script')
      gaInit.id = 'ga-init'
      gaInit.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.google_analytics_id}');
      `
      document.head.appendChild(gaInit)
    }

    // Inject Google Tag Manager
    if (settings.google_tag_manager_id && !document.getElementById('gtm-script')) {
      const gtmScript = document.createElement('script')
      gtmScript.id = 'gtm-script'
      gtmScript.textContent = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
      `
      document.head.appendChild(gtmScript)
    }

    // Inject Facebook Pixel
    if (settings.facebook_pixel_id && !document.getElementById('fb-pixel-script')) {
      const fbScript = document.createElement('script')
      fbScript.id = 'fb-pixel-script'
      fbScript.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebook_pixel_id}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(fbScript)
    }

    return () => {
      mediaQuery.removeEventListener('change', updateFavicon)
    }
  }, [settings])

  // This component doesn't render anything visible
  return null
}

