"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CryptoSetupGuide() {
  const walletGuides = [
    {
      name: "MetaMask",
      description: "Popular browser extension and mobile wallet",
      href: "/metamask",
      logo: "/metamask-logo.svg",
    },
    {
      name: "Trust Wallet",
      description: "Secure mobile and browser wallet with built-in exchange",
      href: "/trust-wallet",
      logo: "/trust-wallet-logo.svg",
    },
    {
      name: "PayPal",
      description: "Buy crypto directly through your PayPal account",
      href: "/paypal",
      logo: "/paypal-logo.png",
    },
    {
      name: "Venmo",
      description: "Purchase crypto using your Venmo account",
      href: "/venmo",
      logo: "/venmo-logo.webp",
    },
    {
      name: "Any Crypto Wallet",
      description: "Use any Ethereum-compatible wallet of your choice",
      href: "/any-crypto-wallet",
      logo: "/any-crypto-wallet-logo.svg",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Choose Your Wallet</h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Select a wallet to get started with crypto payments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {walletGuides.map((guide) => (
            <Link
              key={guide.name}
              href={guide.href}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-all hover:border-foreground/20"
            >
              <div className="mb-6 flex h-24 items-center justify-center">
                <Image
                  src={guide.logo || "/placeholder.svg"}
                  alt={`${guide.name} logo`}
                  width={200}
                  height={96}
                  className="h-auto w-50 object-contain"
                />
              </div>
              <p className="mb-4 text-sm text-center text-muted-foreground">{guide.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm font-medium transition-transform group-hover:translate-x-1">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
