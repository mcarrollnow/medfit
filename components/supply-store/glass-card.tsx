"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

export function GlassCard({ children, className, hover = false, padding = "md" }: GlassCardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-12",
    xl: "p-8 md:p-12 lg:p-16",
  }

  return (
    <div
      className={cn(
        // Chronicles glass-card aesthetic
        "relative rounded-3xl",
        "bg-foreground/[0.04]",
        "backdrop-blur-[20px]",
        "border border-border",
        "shadow-[0_8px_32px_rgba(58,66,51,0.2)]",
        // Hover state - subtle lift
        hover && "transition-all duration-500 hover:bg-foreground/[0.04] hover:border-border",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
