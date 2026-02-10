import type React from "react"
import GlobalNav from "@/components/global-nav"
import { SupplierAuthGuard } from "@/components/supplier-auth-guard"

export default function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Grainy Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-noise opacity-20 mix-blend-overlay" />

      <div className="relative z-10 min-h-screen">
        <GlobalNav showCart={false} />
        <SupplierAuthGuard>
          <main className="px-6 py-12 md:px-12 lg:px-24 md:py-16">{children}</main>
        </SupplierAuthGuard>
      </div>
    </div>
  )
}

