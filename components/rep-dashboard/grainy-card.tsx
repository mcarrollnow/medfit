import { cn } from "@/lib/utils"
import type React from "react"

interface GrainyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  accentColor?: string
  variant?: "default" | "elevated" | "subtle" | "transparent"
}

export function GrainyCard({ 
  children, 
  className, 
  hoverEffect = false, 
  accentColor,
  variant = "default",
  style,
  ...props 
}: GrainyCardProps) {
  const variantStyles = {
    default: "border border-white/10",
    elevated: "border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    subtle: "border border-white/5",
    transparent: "border border-white/10",
  }
  
  const variantBgColors: Record<string, string> = {
    default: "rgba(0,0,0,0.3)",
    elevated: "rgba(0,0,0,0.4)",
    subtle: "rgba(0,0,0,0.2)",
    transparent: "transparent",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300",
        variantStyles[variant],
        hoverEffect && "hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] cursor-pointer",
        className,
      )}
      style={{
        ...style,
        backgroundColor: accentColor ? undefined : variantBgColors[variant],
        ...(accentColor && {
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 50%)`,
          boxShadow: hoverEffect ? undefined : `inset 0 1px 0 ${accentColor}15`,
        }),
      }}
      {...props}
    >
      {/* Accent glow */}
      {accentColor && (
        <div 
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-noise mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

