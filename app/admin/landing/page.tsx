'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Save, Loader2, Eye, Type, RefreshCw, ExternalLink, Info
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { updateLandingSettings, LandingSettings } from '@/app/actions/landing-settings'
import dynamic from 'next/dynamic'

// Dynamically import the background component to avoid SSR issues
const PulsingHexagonBackground = dynamic(
  () => import('@/components/pulsing-hexagon-background'),
  { ssr: false }
)

const defaultSettings: LandingSettings = {
  hero_slogan: 'Welcome to Modern Health Pro',
  hero_subtitle: 'Premium research compounds for scientific discovery',
  background_style: 'aurora',
  background_color_1: '#0f0f23',
  background_color_2: '#1a1a3e',
  background_color_3: '#0a192f',
  show_subtitle: true,
}

export default function LandingSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<LandingSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const initialSettings = useRef<LandingSettings>(defaultSettings)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(initialSettings.current)
    setHasChanges(changed)
  }, [settings])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        const merged = { ...defaultSettings, ...data }
        setSettings(merged)
        initialSettings.current = merged
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      toast.error('Failed to load landing page settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateLandingSettings({
        ...settings,
        id: (settings as any).id || '1',
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to save settings')
      }

      initialSettings.current = settings
      setHasChanges(false)
      toast.success('Landing page settings saved!')
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      ...defaultSettings,
      id: (settings as any).id,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Full screen preview mode
  if (showFullPreview) {
    return (
      <div className="fixed inset-0 z-[100]">
        <PulsingHexagonBackground showControls={false} />
        
        {/* Text Overlay */}
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <h1
            className="text-center px-8 max-w-5xl leading-tight text-4xl md:text-6xl lg:text-7xl font-bold text-foreground"
            style={{ textShadow: '0 4px 20px rgba(58,66,51,0.2)' }}
          >
            {settings.hero_slogan || 'Welcome to Modern Health Pro'}
          </h1>
          
          {settings.show_subtitle && settings.hero_subtitle && (
            <p
              className="text-center px-8 mt-6 max-w-3xl text-lg md:text-xl text-foreground/60"
              style={{ textShadow: '0 2px 10px rgba(58,66,51,0.2)' }}
            >
              {settings.hero_subtitle}
            </p>
          )}
          
          {/* Auth Card Preview */}
          <div className="mt-10 w-full max-w-md px-4">
            <div className="bg-foreground/60 backdrop-blur-2xl rounded-3xl border border-border p-8">
              <div className="flex mb-6 bg-foreground/5 rounded-xl p-1">
                <div className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold bg-primary text-primary-foreground text-center">
                  Sign In
                </div>
                <div className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold text-foreground/60 text-center">
                  Create Account
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-foreground/5 border border-border rounded-xl" />
                <div className="h-12 bg-foreground/5 border border-border rounded-xl" />
                <div className="h-12 bg-white rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowFullPreview(false)}
          className="fixed top-4 right-4 z-[60] bg-foreground/50 hover:bg-foreground/70 text-foreground px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2"
        >
          <span>Close Preview</span>
          <span className="text-muted-foreground text-sm">(ESC)</span>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Landing Page</h1>
            <p className="text-lg text-muted-foreground">
              Customize your landing page that visitors see before logging in
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowFullPreview(true)}
              variant="outline"
              className="h-12 px-6 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              Full Preview
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 px-6 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold disabled:opacity-50"
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

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300 font-medium">Background Settings</p>
              <p className="text-sm text-blue-300/70 mt-1">
                The landing page uses the same animated background as the Maintenance page. 
                To customize the background animation, go to{' '}
                <a href="/admin/maintenance" className="underline hover:text-blue-200">
                  Maintenance Mode settings
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Hero Content */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Type className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Hero Content</h2>
                    <p className="text-sm text-muted-foreground">The main message visitors see</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground/70">Hero Slogan</Label>
                    <Input
                      value={settings.hero_slogan}
                      onChange={(e) => setSettings({ ...settings, hero_slogan: e.target.value })}
                      placeholder="Welcome to Modern Health Pro"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                    />
                    <p className="text-xs text-muted-foreground">This is the main headline on your landing page</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                    <div className="space-y-1">
                      <Label className="text-foreground font-medium">Show Subtitle</Label>
                      <p className="text-sm text-muted-foreground">Display additional text below the slogan</p>
                    </div>
                    <Switch 
                      checked={settings.show_subtitle} 
                      onCheckedChange={(checked) => setSettings({ ...settings, show_subtitle: checked })} 
                    />
                  </div>

                  {settings.show_subtitle && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-foreground/70">Subtitle</Label>
                      <Input
                        value={settings.hero_subtitle}
                        onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                        placeholder="Premium research compounds"
                        className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:sticky xl:top-8 h-fit"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Live Preview</h2>
                        <p className="text-sm text-muted-foreground">See changes in real-time</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowFullPreview(true)}
                      size="sm"
                      variant="outline"
                      className="border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Expand
                    </Button>
                  </div>
                </div>
                
                {/* Preview Frame */}
                <div className="relative">
                  {/* Browser Chrome */}
                  <div className="bg-card px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-7 bg-foreground/5 rounded-lg flex items-center px-3">
                          <span className="text-xs text-muted-foreground font-mono">yoursite.com/landing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div 
                    className="relative h-[500px] overflow-hidden cursor-pointer group"
                    onClick={() => setShowFullPreview(true)}
                    style={{ 
                      background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #16213e 100%)'
                    }}
                  >
                    {/* Hexagon pattern simulation */}
                    <div className="absolute inset-0 opacity-30">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                            <path 
                              d="M28 0l28 16v32L28 64 0 48V16L28 0z" 
                              fill="none" 
                              stroke="rgba(58,66,51,0.08)" 
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons)" />
                      </svg>
                    </div>
                    
                    {/* Gradient glow effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 70%)'
                      }}
                    />
                    
                    {/* Content Preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3 leading-tight">
                        {settings.hero_slogan || 'Welcome to Modern Health Pro'}
                      </h1>
                      {settings.show_subtitle && settings.hero_subtitle && (
                        <p className="text-sm text-foreground/60 text-center max-w-md">
                          {settings.hero_subtitle}
                        </p>
                      )}
                      
                      {/* Auth Card Preview */}
                      <div className="mt-6 w-full max-w-xs">
                        <div className="bg-foreground/60 backdrop-blur-xl rounded-2xl border border-border p-4">
                          <div className="flex mb-3 bg-foreground/5 rounded-lg p-1">
                            <div className="flex-1 py-2 px-3 rounded-md text-xs font-semibold bg-primary text-primary-foreground text-center">
                              Sign In
                            </div>
                            <div className="flex-1 py-2 px-3 rounded-md text-xs font-semibold text-foreground/60 text-center">
                              Create Account
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-8 bg-foreground/5 border border-border rounded-lg" />
                            <div className="h-8 bg-foreground/5 border border-border rounded-lg" />
                            <div className="h-8 bg-white rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Click to expand overlay */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/50 text-foreground px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Click for Full Preview
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-foreground/5 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Text preview updates live • Click preview for full view
                  </span>
                  <a
                    href="/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
