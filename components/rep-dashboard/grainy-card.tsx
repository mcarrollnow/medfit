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
    default: "border border-border",
    elevated: "border border-border shadow-[0_8px_32px_rgba(58,66,51,0.15)]",
    subtle: "border border-border",
    transparent: "border border-border",
  }
  
  const variantBgColors: Record<string, string> = {
    default: "rgba(58,66,51,0.15)",
    elevated: "rgba(58,66,51,0.15)",
    subtle: "rgba(58,66,51,0.12)",
    transparent: "transparent",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300",
        variantStyles[variant],
        hoverEffect && "hover:border-border hover:shadow-[0_12px_40px_rgba(58,66,51,0.2)] cursor-pointer",
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

