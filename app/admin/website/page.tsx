'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Save, Globe, Search, Share2, Code2, Upload, AlertTriangle, 
  Settings, Loader2, CheckCircle2, Image as ImageIcon, Smartphone,
  BarChart3, Palette, X, Sun, Moon, Monitor, Sparkles, Eye, FileText, ArrowLeft, Store
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { clearSiteSettingsCache } from '@/app/actions/site-settings'
import Link from 'next/link'

interface SiteSettings {
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
  display_mode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
  start_url: string
  app_icon_192_url: string
  app_icon_512_url: string
  // Social / Open Graph
  og_title: string
  og_description: string
  og_image_url: string
  og_site_name: string
  og_type: string
  twitter_card: 'summary' | 'summary_large_image'
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
  // Branding
  site_name: 'My Store',
  site_tagline: 'Premium Products',
  logo_light_url: '',
  logo_dark_url: '',
  favicon_light_url: '',
  favicon_dark_url: '',
  favicon_safari_url: '',
  apple_touch_icon_url: '',
  mask_icon_url: '',
  mask_icon_color: '#000000',
  // SEO
  browser_title: 'My Store - Premium Products',
  title_separator: '|',
  meta_description: 'Discover premium products at amazing prices. Free shipping on orders over $50.',
  meta_keywords: '',
  canonical_url: '',
  robots_index: true,
  robots_follow: true,
  google_site_verification: '',
  bing_site_verification: '',
  // PWA / App
  app_name: 'My Store',
  app_short_name: 'Store',
  app_description: 'Shop premium products',
  theme_color: '#000000',
  background_color: '#000000',
  display_mode: 'standalone',
  start_url: '/',
  app_icon_192_url: '',
  app_icon_512_url: '',
  // Social / Open Graph
  og_title: 'My Store - Premium Products',
  og_description: 'Discover premium products at amazing prices.',
  og_image_url: '',
  og_site_name: 'My Store',
  og_type: 'website',
  twitter_card: 'summary_large_image',
  twitter_site: '',
  twitter_creator: '',
  // Analytics
  google_analytics_id: '',
  google_tag_manager_id: '',
  facebook_pixel_id: '',
  // Code Injection
  custom_head_code: '',
  custom_body_start_code: '',
  custom_body_end_code: '',
  custom_css: '',
  // Shop Hero
  shop_hero_title: 'Innovation is born where research lives.',
  shop_hero_subtitle: 'Premium quality compounds for scientific research. All products are ≥99% pure and third-party tested.',
}

type TabType = 'branding' | 'shop' | 'seo' | 'pwa' | 'social' | 'analytics' | 'code'

export default function WebsiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('branding')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert([{ ...settings, id: settings.id || '1' }], { onConflict: 'id' })

      if (error) throw error

      // Clear the server-side cache so changes appear immediately
      await clearSiteSettingsCache()
      
      toast.success('Settings saved! Refresh the page to see changes.')
      document.title = settings.browser_title
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (file: File, fieldName: keyof SiteSettings, folder: string) => {
    setUploadingField(fieldName)

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${folder}/${fieldName}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        // Try creating the bucket if it doesn't exist
        if (uploadError.message.includes('not found')) {
          toast.error('Storage bucket "site-assets" not found. Please create it in Supabase.')
          return
        }
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName)

      setSettings(prev => ({ ...prev, [fieldName]: publicUrl }))
      toast.success('File uploaded successfully')
    } catch (error: any) {
      console.error('Failed to upload file:', error)
      toast.error(error.message || 'Failed to upload file')
    } finally {
      setUploadingField(null)
    }
  }

  const clearImage = (fieldName: keyof SiteSettings) => {
    setSettings(prev => ({ ...prev, [fieldName]: '' }))
  }

  const tabs = [
    { id: 'branding' as TabType, label: 'Branding', icon: Palette },
    { id: 'shop' as TabType, label: 'Shop', icon: Store },
    { id: 'seo' as TabType, label: 'SEO', icon: Search },
    { id: 'pwa' as TabType, label: 'App / PWA', icon: Smartphone },
    { id: 'social' as TabType, label: 'Social', icon: Share2 },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'code' as TabType, label: 'Code', icon: Code2 },
  ]

  // Reusable image upload component
  const ImageUploadField = ({ 
    label, 
    description, 
    fieldName, 
    folder,
    previewSize = 'md',
    accept = 'image/*,.ico,.svg'
  }: { 
    label: string
    description: string
    fieldName: keyof SiteSettings
    folder: string
    previewSize?: 'sm' | 'md' | 'lg' | 'wide' | 'auto'
    accept?: string
  }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const value = settings[fieldName] as string
    const isUploading = uploadingField === fieldName

    const sizeClasses = {
      sm: 'h-12 w-12',
      md: 'h-16 w-16',
      lg: 'h-32 w-48',
      wide: 'h-20 w-40',
      auto: 'h-20 w-auto max-w-48'
    }

    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-foreground/70">{label}</Label>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          {value ? (
            <div className={`relative ${sizeClasses[previewSize]} rounded-xl border border-border bg-foreground/5 overflow-hidden group`}>
              <img src={value} alt={label} className="h-full w-full object-contain" />
              <button
                onClick={() => clearImage(fieldName)}
                className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
          ) : (
            <div className={`${sizeClasses[previewSize]} rounded-xl border border-dashed border-border bg-foreground/5 flex items-center justify-center`}>
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
          <div>
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="h-10 px-4 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : value ? 'Replace' : 'Upload'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file, fieldName, folder)
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Website Settings</h1>
            <p className="text-lg text-muted-foreground">Customize your site's branding, SEO, app settings, and more</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/website/pages">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              >
                <FileText className="h-4 w-4 mr-2" />
                Page SEO
              </Button>
            </Link>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-foreground/5 border border-border backdrop-blur-xl p-2"
        >
          <nav className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-foreground/10 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BRANDING TAB */}
            {activeTab === 'branding' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Site Identity */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Site Identity</h2>
                        <p className="text-sm text-muted-foreground">Basic information about your site</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Site Name</Label>
                        <Input
                          value={settings.site_name}
                          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Site Tagline</Label>
                        <Input
                          value={settings.site_tagline}
                          onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                          placeholder="Your site's slogan or tagline"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logos */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Logos</h2>
                        <p className="text-sm text-muted-foreground">Upload logos for light and dark backgrounds</p>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Sun className="h-4 w-4 text-amber-400" />
                          <span className="text-sm font-medium text-foreground/70">Light Mode Logo</span>
                        </div>
                        <ImageUploadField
                          label=""
                          description="Logo for light backgrounds (dark logo)"
                          fieldName="logo_light_url"
                          folder="logos"
                          previewSize="lg"
                          accept="image/*,.svg"
                        />
                      </div>
                      <div className="p-4 rounded-xl bg-foreground/30 border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Moon className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-foreground/70">Dark Mode Logo</span>
                        </div>
                        <ImageUploadField
                          label=""
                          description="Logo for dark backgrounds (light logo)"
                          fieldName="logo_dark_url"
                          folder="logos"
                          previewSize="lg"
                          accept="image/*,.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favicons */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Favicons</h2>
                        <p className="text-sm text-muted-foreground">Browser tab icons for different themes</p>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="p-4 rounded-xl bg-white border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Sun className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium text-gray-700">Light Theme Favicon</span>
                        </div>
                        <ImageUploadField
                          label=""
                          description="SVG or PNG (any size, will scale)"
                          fieldName="favicon_light_url"
                          folder="favicons"
                          previewSize="md"
                          accept=".ico,.png,.svg,image/x-icon,image/png,image/svg+xml"
                        />
                      </div>
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Moon className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-foreground/70">Dark Theme Favicon</span>
                        </div>
                        <ImageUploadField
                          label=""
                          description="SVG or PNG (any size, will scale)"
                          fieldName="favicon_dark_url"
                          folder="favicons"
                          previewSize="md"
                          accept=".ico,.png,.svg,image/x-icon,image/png,image/svg+xml"
                        />
                      </div>
                    </div>

                    {/* Safari Favicon */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13h-1v5.414l3.293 3.293.707-.707-3-3V7z"/>
                        </svg>
                        <span className="text-sm font-medium text-foreground/70">Safari Favicon (PNG)</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Safari doesn't support SVG favicons. Upload a PNG version for Safari compatibility.</p>
                      <ImageUploadField
                        label=""
                        description="PNG format, 32x32px for Safari browser"
                        fieldName="favicon_safari_url"
                        folder="favicons"
                        previewSize="sm"
                        accept=".png,image/png"
                      />
                    </div>
                  </div>
                </div>

                {/* Apple & Safari Icons */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-pink-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Apple & Safari Icons</h2>
                        <p className="text-sm text-muted-foreground">Icons for iOS devices and Safari browser</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <ImageUploadField
                        label="Apple Touch Icon"
                        description="Home screen icon on iOS (180x180px PNG)"
                        fieldName="apple_touch_icon_url"
                        folder="icons"
                        previewSize="md"
                        accept=".png,image/png"
                      />
                      <div className="space-y-4">
                        <ImageUploadField
                          label="Safari Mask Icon"
                          description="Pinned tab icon (SVG, single color)"
                          fieldName="mask_icon_url"
                          folder="icons"
                          previewSize="md"
                          accept=".svg,image/svg+xml"
                        />
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">Mask Icon Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.mask_icon_color}
                              onChange={(e) => setSettings({ ...settings, mask_icon_color: e.target.value })}
                              className="h-10 w-10 rounded-lg border border-border bg-transparent cursor-pointer"
                            />
                            <Input
                              value={settings.mask_icon_color}
                              onChange={(e) => setSettings({ ...settings, mask_icon_color: e.target.value })}
                              className="h-10 w-24 bg-foreground/5 border-border text-foreground rounded-xl font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SHOP TAB */}
            {activeTab === 'shop' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Shop Hero */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Store className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Shop Hero Section</h2>
                        <p className="text-sm text-muted-foreground">Customize the main headline and subtitle on your shop page</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Hero Title</Label>
                        <p className="text-xs text-muted-foreground">The main headline displayed on the shop page</p>
                        <Textarea
                          value={settings.shop_hero_title}
                          onChange={(e) => setSettings({ ...settings, shop_hero_title: e.target.value })}
                          placeholder="Innovation is born where research lives."
                          rows={2}
                          className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Hero Subtitle</Label>
                        <p className="text-xs text-muted-foreground">Supporting text below the headline</p>
                        <Textarea
                          value={settings.shop_hero_subtitle}
                          onChange={(e) => setSettings({ ...settings, shop_hero_subtitle: e.target.value })}
                          placeholder="Premium quality compounds for scientific research."
                          rows={3}
                          className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8">
                    <h3 className="text-sm font-semibold text-foreground/70 mb-6 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </h3>
                    <div className="rounded-xl bg-gradient-to-b from-background to-background border border-border p-8 text-center space-y-4">
                      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                        {settings.shop_hero_title || 'Your Hero Title'}
                      </h2>
                      <p className="mx-auto max-w-2xl text-base text-foreground/60 text-balance">
                        {settings.shop_hero_subtitle || 'Your hero subtitle will appear here.'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Page Title & Meta */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Search className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Page Title & Meta</h2>
                        <p className="text-sm text-muted-foreground">How your site appears in search results</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-[1fr,auto]">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">Browser Title</Label>
                          <Input
                            value={settings.browser_title}
                            onChange={(e) => setSettings({ ...settings, browser_title: e.target.value })}
                            className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">Separator</Label>
                          <Select
                            value={settings.title_separator}
                            onValueChange={(value) => setSettings({ ...settings, title_separator: value })}
                          >
                            <SelectTrigger className="h-12 w-24 bg-foreground/5 border-border text-foreground rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="|">|</SelectItem>
                              <SelectItem value="-">-</SelectItem>
                              <SelectItem value="•">•</SelectItem>
                              <SelectItem value="—">—</SelectItem>
                              <SelectItem value="/">|</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Meta Description</Label>
                        <p className="text-xs text-muted-foreground">150-160 characters recommended</p>
                        <Textarea
                          value={settings.meta_description}
                          onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                          rows={3}
                          className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none"
                        />
                        <p className="text-xs text-muted-foreground">{settings.meta_description.length} characters</p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Meta Keywords</Label>
                        <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
                        <Input
                          value={settings.meta_keywords}
                          onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                          placeholder="keyword1, keyword2, keyword3"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Canonical URL</Label>
                        <Input
                          value={settings.canonical_url}
                          onChange={(e) => setSettings({ ...settings, canonical_url: e.target.value })}
                          placeholder="https://yoursite.com"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Robots & Indexing */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Search Engine Indexing</h2>
                        <p className="text-sm text-muted-foreground">Control how search engines interact with your site</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Allow Indexing</Label>
                          <p className="text-sm text-muted-foreground">Let search engines index your pages</p>
                        </div>
                        <Switch 
                          checked={settings.robots_index} 
                          onCheckedChange={(checked) => setSettings({ ...settings, robots_index: checked })} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Follow Links</Label>
                          <p className="text-sm text-muted-foreground">Let search engines follow links on your pages</p>
                        </div>
                        <Switch 
                          checked={settings.robots_follow} 
                          onCheckedChange={(checked) => setSettings({ ...settings, robots_follow: checked })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Site Verification */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Site Verification</h2>
                        <p className="text-sm text-muted-foreground">Verify ownership with search engines</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Google Verification</Label>
                        <Input
                          value={settings.google_site_verification}
                          onChange={(e) => setSettings({ ...settings, google_site_verification: e.target.value })}
                          placeholder="Verification code"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Bing Verification</Label>
                        <Input
                          value={settings.bing_site_verification}
                          onChange={(e) => setSettings({ ...settings, bing_site_verification: e.target.value })}
                          placeholder="Verification code"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Search Preview */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8">
                    <h3 className="text-sm font-semibold text-foreground/70 mb-4 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Google Search Preview
                    </h3>
                    <div className="rounded-xl bg-white p-4 space-y-2">
                      <div className="text-lg text-[#1a0dab]">{settings.browser_title || 'Browser Title'}</div>
                      <div className="text-sm text-[#006621]">{settings.canonical_url || 'yourstore.com'}</div>
                      <div className="text-sm text-[#545454] leading-relaxed">
                        {settings.meta_description || 'Meta description will appear here...'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PWA / APP TAB */}
            {activeTab === 'pwa' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* App Identity */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">App Identity</h2>
                        <p className="text-sm text-muted-foreground">Settings for PWA and mobile app experience</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">App Name</Label>
                        <Input
                          value={settings.app_name}
                          onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Short Name</Label>
                        <p className="text-xs text-muted-foreground">Shown on home screen (12 chars max)</p>
                        <Input
                          value={settings.app_short_name}
                          onChange={(e) => setSettings({ ...settings, app_short_name: e.target.value })}
                          maxLength={12}
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground/70">App Description</Label>
                      <Textarea
                        value={settings.app_description}
                        onChange={(e) => setSettings({ ...settings, app_description: e.target.value })}
                        rows={2}
                        className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Display Mode</Label>
                        <Select
                          value={settings.display_mode}
                          onValueChange={(value: any) => setSettings({ ...settings, display_mode: value })}
                        >
                          <SelectTrigger className="h-12 bg-foreground/5 border-border text-foreground rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="standalone">Standalone (App-like)</SelectItem>
                            <SelectItem value="fullscreen">Fullscreen</SelectItem>
                            <SelectItem value="minimal-ui">Minimal UI</SelectItem>
                            <SelectItem value="browser">Browser</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Start URL</Label>
                        <Input
                          value={settings.start_url}
                          onChange={(e) => setSettings({ ...settings, start_url: e.target.value })}
                          placeholder="/"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Colors */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Theme Colors</h2>
                        <p className="text-sm text-muted-foreground">Colors for browser chrome and splash screen</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Theme Color</Label>
                        <p className="text-xs text-muted-foreground">Browser toolbar/address bar color</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={settings.theme_color}
                            onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                            className="h-12 w-12 rounded-xl border border-border bg-transparent cursor-pointer"
                          />
                          <Input
                            value={settings.theme_color}
                            onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                            className="h-12 w-32 bg-foreground/5 border-border text-foreground rounded-xl font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Background Color</Label>
                        <p className="text-xs text-muted-foreground">Splash screen background</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={settings.background_color}
                            onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                            className="h-12 w-12 rounded-xl border border-border bg-transparent cursor-pointer"
                          />
                          <Input
                            value={settings.background_color}
                            onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                            className="h-12 w-32 bg-foreground/5 border-border text-foreground rounded-xl font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Icons */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">App Icons</h2>
                        <p className="text-sm text-muted-foreground">Icons for PWA installation</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <ImageUploadField
                        label="App Icon (192x192)"
                        description="Standard app icon size"
                        fieldName="app_icon_192_url"
                        folder="icons"
                        previewSize="md"
                        accept=".png,image/png"
                      />
                      <ImageUploadField
                        label="App Icon (512x512)"
                        description="High-res icon for splash screens"
                        fieldName="app_icon_512_url"
                        folder="icons"
                        previewSize="md"
                        accept=".png,image/png"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Open Graph */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Share2 className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Open Graph</h2>
                        <p className="text-sm text-muted-foreground">How your site appears when shared on Facebook, LinkedIn, etc.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">OG Title</Label>
                          <Input
                            value={settings.og_title}
                            onChange={(e) => setSettings({ ...settings, og_title: e.target.value })}
                            className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">OG Site Name</Label>
                          <Input
                            value={settings.og_site_name}
                            onChange={(e) => setSettings({ ...settings, og_site_name: e.target.value })}
                            className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">OG Description</Label>
                        <Textarea
                          value={settings.og_description}
                          onChange={(e) => setSettings({ ...settings, og_description: e.target.value })}
                          rows={3}
                          className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">OG Type</Label>
                        <Select
                          value={settings.og_type}
                          onValueChange={(value) => setSettings({ ...settings, og_type: value })}
                        >
                          <SelectTrigger className="h-12 bg-foreground/5 border-border text-foreground rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="profile">Profile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <ImageUploadField
                        label="OG Image"
                        description="1200x630px recommended for best results"
                        fieldName="og_image_url"
                        folder="social"
                        previewSize="lg"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                {/* Twitter */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                        <svg className="h-5 w-5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Twitter / X</h2>
                        <p className="text-sm text-muted-foreground">How your site appears when shared on Twitter</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Card Type</Label>
                        <Select
                          value={settings.twitter_card}
                          onValueChange={(value: any) => setSettings({ ...settings, twitter_card: value })}
                        >
                          <SelectTrigger className="h-12 bg-foreground/5 border-border text-foreground rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">Twitter Site</Label>
                          <Input
                            value={settings.twitter_site}
                            onChange={(e) => setSettings({ ...settings, twitter_site: e.target.value })}
                            placeholder="@yoursite"
                            className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/70">Twitter Creator</Label>
                          <Input
                            value={settings.twitter_creator}
                            onChange={(e) => setSettings({ ...settings, twitter_creator: e.target.value })}
                            placeholder="@yourusername"
                            className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Preview */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8">
                    <h3 className="text-sm font-semibold text-foreground/70 mb-4 flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Social Media Preview
                    </h3>
                    <div className="border border-border rounded-xl overflow-hidden">
                      {settings.og_image_url ? (
                        <div className="relative h-48 w-full bg-foreground/5">
                          <img src={settings.og_image_url} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-48 w-full bg-foreground/5 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="p-4 bg-foreground/5">
                        <div className="text-sm text-muted-foreground mb-1">{settings.og_site_name || 'yourstore.com'}</div>
                        <div className="text-base font-medium text-foreground mb-1">{settings.og_title || 'Open Graph Title'}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{settings.og_description || 'Open Graph description...'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Analytics & Tracking</h2>
                        <p className="text-sm text-muted-foreground">Connect your analytics services</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 rounded-xl border border-border bg-foreground/5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#F9AB00]/20 flex items-center justify-center">
                            <svg className="h-4 w-4 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.84 2.9982V20.9982C22.8378 21.2611 22.7334 21.5122 22.5486 21.6968C22.3638 21.8814 22.1125 21.9855 21.8496 21.9874H19.8996C19.6372 21.9847 19.3866 21.8803 19.2023 21.6957C19.018 21.5112 18.9139 21.2605 18.9116 20.9982V2.9982C18.9139 2.73589 19.018 2.48516 19.2023 2.30063C19.3866 2.1161 19.6372 2.01166 19.8996 2.0090H21.8496C22.1125 2.01087 22.3638 2.11499 22.5486 2.29962C22.7334 2.48426 22.8378 2.73531 22.84 2.9982Z"/>
                              <path d="M16.04 8.9981V20.9981C16.0373 21.261 15.9329 21.512 15.7481 21.6967C15.5633 21.8813 15.312 21.9854 15.0491 21.9873H13.0991C12.8367 21.9846 12.5861 21.8802 12.4018 21.6956C12.2175 21.5111 12.1134 21.2604 12.1111 20.9981V8.9981C12.1134 8.73579 12.2175 8.48506 12.4018 8.30053C12.5861 8.116 12.8367 8.01156 13.0991 8.0089H15.0491C15.312 8.01077 15.5633 8.11489 15.7481 8.29953C15.9329 8.48416 16.0373 8.73521 16.04 8.9981Z"/>
                              <path d="M9.23997 14.9982V20.9982C9.23729 21.2611 9.13291 21.5121 8.94813 21.6968C8.76335 21.8814 8.51203 21.9855 8.24916 21.9874H6.29916C6.03682 21.9847 5.78619 21.8803 5.60189 21.6957C5.41759 21.5112 5.31349 21.2605 5.31116 20.9982V14.9982C5.31349 14.7359 5.41759 14.4852 5.60189 14.3007C5.78619 14.1161 6.03682 14.0117 6.29916 14.009H8.24916C8.51203 14.0109 8.76335 14.115 8.94813 14.2996C9.13291 14.4843 9.23729 14.7353 9.23997 14.9982Z"/>
                              <path d="M2.43994 18.0107V20.9857C2.43994 21.5132 2.00244 21.9507 1.47494 21.9507C0.947437 21.9507 0.509937 21.5132 0.509937 20.9857V18.0107C0.509937 17.4832 0.947437 17.0457 1.47494 17.0457C2.00244 17.0457 2.43994 17.4832 2.43994 18.0107Z"/>
                            </svg>
                          </div>
                          <Label className="text-foreground font-medium">Google Analytics</Label>
                        </div>
                        <Input
                          value={settings.google_analytics_id}
                          onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                          placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border font-mono"
                        />
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-foreground/5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#246FDB]/20 flex items-center justify-center">
                            <svg className="h-4 w-4 text-[#246FDB]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                          </div>
                          <Label className="text-foreground font-medium">Google Tag Manager</Label>
                        </div>
                        <Input
                          value={settings.google_tag_manager_id}
                          onChange={(e) => setSettings({ ...settings, google_tag_manager_id: e.target.value })}
                          placeholder="GTM-XXXXXXX"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border font-mono"
                        />
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-foreground/5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
                            <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <Label className="text-foreground font-medium">Facebook Pixel</Label>
                        </div>
                        <Input
                          value={settings.facebook_pixel_id}
                          onChange={(e) => setSettings({ ...settings, facebook_pixel_id: e.target.value })}
                          placeholder="XXXXXXXXXXXXXXXX"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CODE TAB */}
            {activeTab === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Warning */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-1">Warning: Advanced Feature</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      Only add code from trusted sources. Malicious code can compromise your site's security and
                      functionality. Always verify code before adding it.
                    </p>
                  </div>
                </div>

                {/* Custom CSS */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-pink-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Custom CSS</h2>
                        <p className="text-sm text-muted-foreground">Add custom styles to your site</p>
                      </div>
                    </div>
                    <Textarea
                      value={settings.custom_css || ''}
                      onChange={(e) => setSettings({ ...settings, custom_css: e.target.value })}
                      placeholder="/* Custom CSS styles */"
                      rows={8}
                      className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Head Code */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Head Code</h2>
                        <p className="text-sm text-muted-foreground">Injected into {'<head>'} section</p>
                      </div>
                    </div>
                    <Textarea
                      value={settings.custom_head_code || ''}
                      onChange={(e) => setSettings({ ...settings, custom_head_code: e.target.value })}
                      placeholder="<!-- Analytics, meta tags, fonts, etc. -->"
                      rows={8}
                      className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Body Start Code */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Body Start Code</h2>
                        <p className="text-sm text-muted-foreground">Injected right after opening {'<body>'} tag</p>
                      </div>
                    </div>
                    <Textarea
                      value={settings.custom_body_start_code || ''}
                      onChange={(e) => setSettings({ ...settings, custom_body_start_code: e.target.value })}
                      placeholder="<!-- GTM noscript, etc. -->"
                      rows={6}
                      className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Body End Code */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Body End Code</h2>
                        <p className="text-sm text-muted-foreground">Injected before closing {'</body>'} tag</p>
                      </div>
                    </div>
                    <Textarea
                      value={settings.custom_body_end_code || ''}
                      onChange={(e) => setSettings({ ...settings, custom_body_end_code: e.target.value })}
                      placeholder="<!-- Scripts, widgets, chat tools, etc. -->"
                      rows={8}
                      className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border resize-none font-mono text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8 space-y-6"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Quick Tips
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    {activeTab === 'branding' && (
                      <>
                        <p>• Upload both light & dark logos for optimal display</p>
                        <p>• Favicons should be 32x32px or 16x16px</p>
                        <p>• Apple Touch Icon should be 180x180px PNG</p>
                        <p>• Safari mask icon must be a single-color SVG</p>
                      </>
                    )}
                    {activeTab === 'shop' && (
                      <>
                        <p>• Keep the hero title short and impactful</p>
                        <p>• Subtitle should support the main message</p>
                        <p>• Use line breaks (\n) for multi-line titles</p>
                        <p>• Preview shows how it looks on the shop</p>
                      </>
                    )}
                    {activeTab === 'seo' && (
                      <>
                        <p>• Keep meta descriptions 150-160 characters</p>
                        <p>• Include primary keyword in title</p>
                        <p>• Use canonical URLs to prevent duplicate content</p>
                        <p>• Only disable indexing for private pages</p>
                      </>
                    )}
                    {activeTab === 'pwa' && (
                      <>
                        <p>• Short name appears under home screen icon</p>
                        <p>• Theme color affects browser toolbar</p>
                        <p>• 512x512 icon is used for splash screens</p>
                        <p>• Standalone mode hides browser UI</p>
                      </>
                    )}
                    {activeTab === 'social' && (
                      <>
                        <p>• OG images should be 1200x630px</p>
                        <p>• Large image cards get more engagement</p>
                        <p>• Test previews before publishing</p>
                        <p>• Include @ symbol for Twitter handles</p>
                      </>
                    )}
                    {activeTab === 'analytics' && (
                      <>
                        <p>• GA4 IDs start with G-</p>
                        <p>• GTM IDs start with GTM-</p>
                        <p>• Facebook Pixel is 15-16 digits</p>
                        <p>• Test tracking after setup</p>
                      </>
                    )}
                    {activeTab === 'code' && (
                      <>
                        <p>• Head code: analytics, fonts, meta tags</p>
                        <p>• Body start: GTM noscript fallback</p>
                        <p>• Body end: chat widgets, scripts</p>
                        <p>• Always backup code before changes</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
