"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PaymentHub() {
  const paymentOptions = [
    {
      name: "First Time Crypto Setup",
      description: "New to crypto? Get step-by-step guidance to set up your wallet",
      href: "/crypto-setup",
      logos: ["/paypal-logo.png", "/venmo-logo.webp", "/metamask-logo.svg", "/trust-wallet-logo.svg"],
    },
    {
      name: "Pay with Crypto",
      description: "Already have a wallet? Complete your purchase quickly",
      href: "/crypto-payment",
      logo: "/any-crypto-wallet-logo.svg",
    },
    {
      name: "Zelle",
      description: "Send payment via Zelle with easy copy-paste instructions",
      href: "/zelle",
      logo: "/zelle-logo.svg",
    },
    {
      name: "ACH Transfer",
      description: "Send bank transfer with detailed routing information",
      href: "/ach",
      logo: "/ach-transfer-logo.svg",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Choose Payment Method</h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Select your preferred way to complete your purchase
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {paymentOptions.map((option) => (
            <Link
              key={option.name}
              href={option.href}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-all hover:border-foreground/20"
            >
              <div className="mb-6 flex h-20 items-center justify-start">
                {option.logos ? (
                  <div className="grid grid-cols-4 gap-3 w-full max-w-sm lg:max-w-3xl">
                    {option.logos.map((logo, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <Image
                          src={logo || "/placeholder.svg"}
                          alt="Wallet logo"
                          width={144}
                          height={144}
                          className="h-20 w-20 object-contain sm:h-24 sm:w-24 lg:h-32 lg:w-32"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Image
                    src={option.logo || "/placeholder.svg"}
                    alt={`${option.name} logo`}
                    width={160}
                    height={80}
                    className="h-auto w-40 object-contain"
                  />
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{option.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{option.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium transition-transform group-hover:translate-x-1">
                Continue
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
