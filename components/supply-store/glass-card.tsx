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
        "bg-[rgba(255,255,255,0.03)]",
        "backdrop-blur-[20px]",
        "border border-[rgba(255,255,255,0.08)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        // Hover state - subtle lift
        hover && "transition-all duration-500 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)]",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
