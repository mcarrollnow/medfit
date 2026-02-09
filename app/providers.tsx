"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from "@/lib/wagmi-config"
import { getResponsiveTheme } from "@/lib/mobile-rainbowkit-theme"
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={getResponsiveTheme(true)}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
