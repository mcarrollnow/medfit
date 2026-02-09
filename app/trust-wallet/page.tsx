"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TrustWalletGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <Link
          href="/crypto-setup"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet Selection
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Trust Wallet Setup Guide</h1>
          <p className="text-lg text-muted-foreground">Coming soon - Trust Wallet integration</p>
        </div>
      </div>
    </div>
  )
}