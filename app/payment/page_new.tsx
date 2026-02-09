"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from "react"
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from 'lucide-react'

function PaymentHubContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<{
    orderId: string
    orderTotal: number
    merchantWallet: string
  } | null>(null)

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const total = parseFloat(searchParams.get("total") || "0")
    const wallet = searchParams.get("wallet") || ""

    if (!orderId || !wallet || total === 0) {
      router.push("/checkout")
      return
    }

    setOrderData({
      orderId,
      orderTotal: total,
      merchantWallet: wallet
    })
    setLoading(false)
  }, [searchParams, router])

  const paymentOptions = [
    {
      id: 'crypto-setup',
      name: "First Time Crypto Setup",
      description: "New to crypto? Get step-by-step guidance to set up your wallet",
      logos: ["/paypal-logo.png", "/venmo-logo.webp", "/metamask-logo.svg", "/trust-wallet-logo.svg"],
      accent: "from-blue-500/10 to-cyan-500/10",
      border: "group-hover:border-blue-500/50",
      glow: "group-hover:shadow-blue-500/20"
    },
    {
      id: 'crypto-payment',
      name: "Pay with Crypto",
      description: "Already have a wallet? Complete your purchase quickly",
      logo: "/any-crypto-wallet-logo.svg",
      accent: "from-purple-500/10 to-violet-500/10",
      border: "group-hover:border-purple-500/50",
      glow: "group-hover:shadow-purple-500/20"
    },
    {
      id: 'zelle',
      name: "Zelle",
      description: "Send payment via Zelle with easy copy-paste instructions",
      logo: "/zelle-logo.svg",
      accent: "from-violet-500/10 to-purple-500/10",
      border: "group-hover:border-violet-500/50",
      glow: "group-hover:shadow-violet-500/20"
    },
    {
      id: 'ach',
      name: "ACH Transfer",
      description: "Send bank transfer with detailed routing information",
      logo: "/ach-transfer-logo.svg",
      accent: "from-emerald-500/10 to-teal-500/10",
      border: "group-hover:border-emerald-500/50",
      glow: "group-hover:shadow-emerald-500/20"
    },
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    if (!orderData) return
    
    // Navigate to full-page payment flow
    const params = new URLSearchParams({
      orderId: orderData.orderId,
      total: orderData.orderTotal.toString(),
      wallet: orderData.merchantWallet
    })
    router.push(`/payment/${methodId}?${params.toString()}`)
  }

  const handleBackToCheckout = () => {
    router.push("/checkout")
  }

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Link
          href="/checkout"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checkout
        </Link>

        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Choose Payment Method
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Select your preferred way to complete your{' '}
            <span className="font-semibold text-foreground">${orderData.orderTotal.toFixed(2)}</span> purchase
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePaymentMethodSelect(option.id)}
              className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${option.accent} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${option.border} ${option.glow} hover:shadow-2xl text-left p-8 sm:p-10`}
            >
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
              
              <div className="relative grid md:grid-cols-[1fr,2fr] gap-8 items-center">
                <div className="flex items-center justify-center min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
                  {option.logos ? (
                    <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full">
                      {option.logos.map((logo, index) => (
                        <div key={index} className="flex items-center justify-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 group-hover:bg-background/70">
                          <Image
                            src={logo || "/placeholder.svg"}
                            alt="Wallet logo"
                            width={400}
                            height={400}
                            className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 group-hover:bg-background/70">
                      <Image
                        src={option.logo || "/placeholder.svg"}
                        alt={`${option.name} logo`}
                        width={300}
                        height={120}
                        className="h-auto w-48 sm:w-56 md:w-64 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{option.name}</h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{option.description}</p>
                  <div className="flex items-center gap-3 text-lg font-semibold transition-transform duration-300 group-hover:translate-x-2">
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 sm:mt-16">
          <Button
            variant="outline"
            onClick={handleBackToCheckout}
            size="lg"
            className="w-full h-14 text-base sm:text-lg font-semibold"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Shipping Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentHubContent />
    </Suspense>
  )
}
