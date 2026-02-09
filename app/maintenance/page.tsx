import { getMaintenanceSettings } from '@/app/actions/maintenance-settings'
import PulsingHexagonBackground from "@/components/pulsing-hexagon-background"
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MaintenancePage() {
  const settings = await getMaintenanceSettings()

  // Calculate responsive font sizes - scale down on mobile
  // Mobile gets max 48px for title, desktop uses full setting
  const mobileTitleSize = Math.min(settings.font_size, 48)
  const mobileSubtitleSize = Math.min(settings.subtitle_font_size, 20)

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Background with controls HIDDEN for visitors - uses saved visual settings */}
      <PulsingHexagonBackground 
        showControls={false} 
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
      
      {/* Centered Text Overlay */}
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-4">
        <h1
          className="text-center max-w-5xl leading-tight break-words"
          style={{
            fontSize: `clamp(${mobileTitleSize}px, 8vw, ${settings.font_size}px)`,
            fontWeight: settings.font_weight,
            fontStyle: settings.font_style,
            color: settings.text_color,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {settings.title}
        </h1>
        
        {settings.show_subtitle && settings.subtitle && (
          <p
            className="text-center mt-4 md:mt-6 max-w-3xl opacity-80 break-words"
            style={{
              fontSize: `clamp(${mobileSubtitleSize}px, 4vw, ${settings.subtitle_font_size}px)`,
              fontWeight: '400',
              color: settings.text_color,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {settings.subtitle}
          </p>
        )}
      </div>

      {/* Admin Login Link - Small and subtle at bottom */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link 
          href="/login"
          className="text-white/20 hover:text-white/50 text-xs transition-colors pointer-events-auto"
        >
          Admin
        </Link>
      </div>
    </main>
  )
}
