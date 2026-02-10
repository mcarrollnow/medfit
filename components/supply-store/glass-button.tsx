"use client"

import { cn } from "@/lib/utils"
import type { ReactNode, ButtonHTMLAttributes } from "react"

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "primary" | "outline"
  size?: "sm" | "md" | "lg"
}

export function GlassButton({ children, className, variant = "default", size = "md", ...props }: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    // Chronicles glass-button aesthetic
    default: cn(
      "bg-foreground/[0.06]",
      "border-border",
      "text-foreground",
      "hover:bg-foreground/10",
      "hover:border-border"
    ),
    primary: cn(
      "bg-foreground",
      "text-background",
      "border-transparent",
      "hover:bg-foreground/90"
    ),
    outline: cn(
      "bg-transparent",
      "border-border",
      "text-foreground",
      "hover:bg-foreground/[0.06]",
      "hover:border-border"
    ),
  }

  return (
    <button
      className={cn(
        "relative rounded-2xl border font-light",
        "backdrop-blur-[10px]",
        "transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
