import type React from "react"
import { RepAuthProvider } from "@/components/rep-auth-provider"
import GlobalNav from "@/components/global-nav"

export default function RepLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RepAuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-zinc-950 text-white selection:bg-white selection:text-black">
        {/* Grainy Texture Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-noise opacity-20 mix-blend-overlay" />

        <GlobalNav showCart={true} />
        <div className="relative z-10 min-h-screen">{children}</div>
      </div>
    </RepAuthProvider>
  )
}
