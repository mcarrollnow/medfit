import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from 'sonner'
import { SiteSettingsHead } from '@/components/site-settings-head'
import { AuthRedirectHandler } from '@/components/auth-redirect-handler'
import ImpersonationBanner from '@/components/impersonation-banner'
import { getSiteSettings } from '@/app/actions/site-settings'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  const robots = []
  if (settings.robots_index) robots.push('index')
  else robots.push('noindex')
  if (settings.robots_follow) robots.push('follow')
  else robots.push('nofollow')

  return {
    title: settings.browser_title || 'My Store',
    description: settings.meta_description || '',
    keywords: settings.meta_keywords || undefined,
    robots: robots.join(', '),
    verification: {
      google: settings.google_site_verification || undefined,
      other: settings.bing_site_verification ? { 'msvalidate.01': settings.bing_site_verification } : undefined,
    },
    openGraph: {
      title: settings.og_title || settings.browser_title || 'My Store',
      description: settings.og_description || settings.meta_description || '',
      siteName: settings.og_site_name || settings.site_name || undefined,
      type: (settings.og_type as any) || 'website',
      images: settings.og_image_url ? [{ url: settings.og_image_url }] : undefined,
    },
    twitter: {
      card: (settings.twitter_card as any) || 'summary_large_image',
      site: settings.twitter_site || undefined,
      creator: settings.twitter_creator || undefined,
    },
    icons: {
      icon: [
        {
          url: settings.favicon_light_url || '/favicon-light.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: settings.favicon_dark_url || '/favicon-dark.svg',
          media: '(prefers-color-scheme: dark)',
        },
      ],
      apple: settings.apple_touch_icon_url || '/icon.svg',
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-TileColor': settings.theme_color || '#000000',
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSiteSettings()
  
  return {
    themeColor: settings.theme_color || '#000000',
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit viewport meta for Safari compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        {/* Safari Mask Icon */}
        {settings.mask_icon_url && (
          <link 
            rel="mask-icon" 
            href={settings.mask_icon_url} 
            color={settings.mask_icon_color || '#000000'} 
          />
        )}
      </head>
      <body className={`font-sans antialiased ${playfairDisplay.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <SiteSettingsHead />
            <AuthRedirectHandler />
            <ImpersonationBanner />
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
