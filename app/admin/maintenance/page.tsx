'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Save, AlertTriangle, Loader2, Eye, Power, Type, Palette, 
  Monitor, RefreshCw, ExternalLink
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { clearMaintenanceSettingsCache, updateMaintenanceSettings } from '@/app/actions/maintenance-settings'
import dynamic from 'next/dynamic'

// Dynamically import the background component to avoid SSR issues
const PulsingHexagonBackground = dynamic(
  () => import('@/components/pulsing-hexagon-background'),
  { ssr: false }
)

interface MaintenanceSettings {
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
}

const defaultSettings: MaintenanceSettings = {
  enabled: false,
  title: 'Under Maintenance',
  subtitle: "We'll be back soon",
  font_size: 72,
  font_weight: '700',
  font_style: 'normal',
  text_color: '#FFFFFF',
  show_subtitle: true,
  subtitle_font_size: 24,
}

export default function MaintenanceSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const initialSettings = useRef<MaintenanceSettings>(defaultSettings)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSettings()
  }, [])

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(initialSettings.current)
    setHasChanges(changed)
  }, [settings])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_settings')
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
      toast.error('Failed to load maintenance settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Use server action with admin privileges to ensure save works
      const result = await updateMaintenanceSettings({
        ...settings,
        id: settings.id || '1',
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to save settings')
      }

      initialSettings.current = settings
      setHasChanges(false)
      
      toast.success(settings.enabled 
        ? 'Maintenance mode enabled! Site is now showing the maintenance page.'
        : 'Settings saved successfully!'
      )
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleMaintenance = async (enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }))
  }

  const handleReset = () => {
    setSettings({
      ...defaultSettings,
      id: settings.id,
      enabled: settings.enabled,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  // Full screen preview mode
  if (showFullPreview) {
    return (
      <div className="fixed inset-0 z-[100]">
        <PulsingHexagonBackground 
          showControls={true}
          dbSettings={{
            pulse_style: settings.pulse_style,
            pulse_amplitude: settings.pulse_amplitude,
            light_radius: settings.light_radius,
            light_concentration: settings.light_concentration,
            persistence_factor: settings.persistence_factor,
            color_speed: settings.color_speed,
            grid_scale: settings.grid_scale,
            use_color_cycle: settings.use_color_cycle,
            static_color: settings.static_color,
          }}
        />
        
        {/* Text Overlay */}
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <h1
            className="text-center px-8 max-w-5xl leading-tight"
            style={{
              fontSize: `${settings.font_size}px`,
              fontWeight: settings.font_weight,
              fontStyle: settings.font_style,
              color: settings.text_color,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {settings.title || 'Under Maintenance'}
          </h1>
          
          {settings.show_subtitle && settings.subtitle && (
            <p
              className="text-center px-8 mt-6 max-w-3xl opacity-80"
              style={{
                fontSize: `${settings.subtitle_font_size}px`,
                fontWeight: '400',
                color: settings.text_color,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {settings.subtitle}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setShowFullPreview(false)
            // Re-fetch settings to get any visual settings changes made in preview
            fetchSettings()
          }}
          className="fixed top-4 right-4 z-[60] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2"
        >
          <span>Close Preview</span>
          <span className="text-white/50 text-sm">(ESC)</span>
        </button>

        {/* Info Banner */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-black/50 text-white px-6 py-3 rounded-lg backdrop-blur-sm text-sm">
          Use the Rhythm Controller panel (top-left) to adjust the visual effects
        </div>
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
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Maintenance Mode</h1>
            <p className="text-lg text-white/50">
              Control your site's maintenance page with a live preview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowFullPreview(true)}
              variant="outline"
              className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              Full Preview
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-semibold disabled:opacity-50"
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

        {/* Main Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`relative overflow-hidden rounded-2xl border ${settings.enabled ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/5'} backdrop-blur-xl transition-colors duration-300`}>
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${settings.enabled ? 'bg-red-500/20' : 'bg-emerald-500/20'} flex items-center justify-center transition-colors`}>
                    <Power className={`h-6 w-6 ${settings.enabled ? 'text-red-400' : 'text-emerald-400'} transition-colors`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {settings.enabled ? 'Maintenance Mode is ON' : 'Maintenance Mode is OFF'}
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      {settings.enabled 
                        ? 'All visitors will see the maintenance page. Admin routes remain accessible.'
                        : 'Your site is operating normally. Toggle to enable maintenance mode.'
                      }
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.enabled} 
                  onCheckedChange={handleToggleMaintenance}
                  className="scale-150"
                />
              </div>

              {settings.enabled && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-300 font-medium">Site is currently in maintenance mode</p>
                    <p className="text-sm text-red-300/70 mt-1">
                      All visitors will be redirected to the maintenance page. Only admin routes are accessible.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Text Content */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Type className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Text Content</h2>
                    <p className="text-sm text-white/50">Customize the message shown to visitors</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-white/70">Main Title</Label>
                    <Input
                      value={settings.title}
                      onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                      placeholder="Under Maintenance"
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:border-white/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="space-y-1">
                      <Label className="text-white font-medium">Show Subtitle</Label>
                      <p className="text-sm text-white/50">Display additional message below the title</p>
                    </div>
                    <Switch 
                      checked={settings.show_subtitle} 
                      onCheckedChange={(checked) => setSettings({ ...settings, show_subtitle: checked })} 
                    />
                  </div>

                  {settings.show_subtitle && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-white/70">Subtitle</Label>
                      <Input
                        value={settings.subtitle}
                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                        placeholder="We'll be back soon"
                        className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:border-white/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Typography & Style</h2>
                    <p className="text-sm text-white/50">Adjust the appearance of your text</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-white/70">Title Font Size</Label>
                      <span className="text-sm text-white/50 font-mono">{settings.font_size}px</span>
                    </div>
                    <Slider
                      value={[settings.font_size]}
                      onValueChange={(value) => setSettings({ ...settings, font_size: value[0] })}
                      min={32}
                      max={144}
                      step={4}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-white/30">
                      <span>32px</span>
                      <span>144px</span>
                    </div>
                  </div>

                  {settings.show_subtitle && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-white/70">Subtitle Font Size</Label>
                        <span className="text-sm text-white/50 font-mono">{settings.subtitle_font_size}px</span>
                      </div>
                      <Slider
                        value={[settings.subtitle_font_size]}
                        onValueChange={(value) => setSettings({ ...settings, subtitle_font_size: value[0] })}
                        min={14}
                        max={48}
                        step={2}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-white/30">
                        <span>14px</span>
                        <span>48px</span>
                      </div>
                    </div>
                  )}

                  {/* Font Weight */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-white/70">Font Weight</Label>
                    <Select
                      value={settings.font_weight}
                      onValueChange={(value) => setSettings({ ...settings, font_weight: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semibold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra Bold (800)</SelectItem>
                        <SelectItem value="900">Black (900)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Style */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-white/70">Font Style</Label>
                    <Select
                      value={settings.font_style}
                      onValueChange={(value) => setSettings({ ...settings, font_style: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="italic">Italic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-white/70">Text Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.text_color}
                        onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                        className="h-12 w-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
                      />
                      <Input
                        value={settings.text_color}
                        onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                        className="h-12 w-32 bg-white/5 border-white/10 text-white rounded-xl font-mono text-sm uppercase"
                      />
                      <div className="flex gap-2">
                        {['#FFFFFF', '#F0F0F0', '#FFD700', '#00FF88'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setSettings({ ...settings, text_color: color })}
                            className="h-10 w-10 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:sticky xl:top-8 h-fit"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Live Preview</h2>
                        <p className="text-sm text-white/50">Click "Full Preview" for interactive controls</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowFullPreview(true)}
                      size="sm"
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Expand
                    </Button>
                  </div>
                </div>
                
                {/* Preview Frame */}
                <div className="relative">
                  {/* Browser Chrome */}
                  <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-7 bg-white/5 rounded-lg flex items-center px-3">
                          <Monitor className="h-3.5 w-3.5 text-white/30 mr-2" />
                          <span className="text-xs text-white/40 font-mono">yoursite.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Content - Simulated Background */}
                  <div 
                    className="relative h-[500px] overflow-hidden cursor-pointer group"
                    onClick={() => setShowFullPreview(true)}
                    style={{ 
                      background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #16213e 100%)'
                    }}
                  >
                    {/* Animated hexagon pattern simulation */}
                    <div className="absolute inset-0 opacity-30">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                            <path 
                              d="M28 0l28 16v32L28 64 0 48V16L28 0z" 
                              fill="none" 
                              stroke="rgba(255,255,255,0.1)" 
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
                    
                    {/* Text Preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h1
                        className="text-center px-6 max-w-full leading-tight transition-all duration-200"
                        style={{
                          fontSize: `${Math.min(settings.font_size * 0.5, 72)}px`,
                          fontWeight: settings.font_weight,
                          fontStyle: settings.font_style,
                          color: settings.text_color,
                          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                      >
                        {settings.title || 'Under Maintenance'}
                      </h1>
                      
                      {settings.show_subtitle && settings.subtitle && (
                        <p
                          className="text-center px-6 mt-4 max-w-full opacity-80 transition-all duration-200"
                          style={{
                            fontSize: `${Math.min(settings.subtitle_font_size * 0.5, 24)}px`,
                            fontWeight: '400',
                            color: settings.text_color,
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                          }}
                        >
                          {settings.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Click to expand overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Click for Full Preview with Controls
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    Text preview updates live • Click preview for Rhythm Controller
                  </span>
                  <a
                    href="/maintenance"
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
