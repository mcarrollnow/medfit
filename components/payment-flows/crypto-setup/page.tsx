"use client"

import { ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

function CryptoSetupContent() {
  const searchParams = useSearchParams()

  // Get order data to pass to wallet routes
  const orderId = searchParams.get("orderId")
  const total = searchParams.get("total")
  const wallet = searchParams.get("wallet")
  
  const buildWalletHref = (basePath: string) => {
    if (orderId && total && wallet) {
      const params = new URLSearchParams({
        orderId,
        total,
        wallet
      })
      return `${basePath}?${params.toString()}`
    }
    return basePath
  }

  const walletGuides = [
    {
      name: "MetaMask",
      description: "Popular browser extension and mobile wallet. Great for beginners.",
      href: buildWalletHref("/metamask"),
      logo: "/metamask-logo.svg",
    },
    {
      name: "Trust Wallet",
      description: "Secure mobile wallet with built-in exchange. Easy to use on mobile.",
      href: buildWalletHref("/trust-wallet"),
      logo: "/trust-wallet-logo.svg",
    },
    {
      name: "PayPal",
      description: "Buy crypto directly through your existing PayPal account.",
      href: buildWalletHref("/paypal"),
      logo: "/paypal-logo.png",
    },
    {
      name: "Venmo",
      description: "Purchase crypto using your Venmo account balance.",
      href: buildWalletHref("/venmo"),
      logo: "/venmo-logo.webp",
    },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
          Choose Your Wallet
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Select a wallet to get started with crypto payments
        </p>
      </div>

      {/* Wallet Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {walletGuides.map((guide) => (
          <Link key={guide.name} href={guide.href}>
            <Card
              className={cn(
                "group relative overflow-hidden transition-all duration-300 cursor-pointer h-full",
                "border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]",
                "hover:bg-foreground/[0.12] hover:shadow-[0_12px_40px_rgba(58,66,51,0.2)]",
              )}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col h-full min-h-[200px]">
                  {/* Logo */}
                  <div className="flex items-center justify-center h-20 mb-6">
                    <Image
                      src={guide.logo || "/placeholder.svg"}
                      alt={`${guide.name} logo`}
                      width={180}
                      height={80}
                      className="h-16 w-auto object-contain"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm sm:text-base text-center mb-6 flex-1">
                    {guide.description}
                  </p>

                  {/* Button */}
                  <Button
                    className="w-full group/btn justify-between text-base font-medium h-12 bg-foreground/[0.08] hover:bg-foreground/[0.15] border border-border hover:border-border text-foreground backdrop-blur-sm"
                    variant="outline"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function CryptoSetupGuide() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      </div>
    }>
      <CryptoSetupContent />
    </Suspense>
  )
}
