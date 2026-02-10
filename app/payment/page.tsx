"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from "react"
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import GlobalNav from "@/components/global-nav"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { MetaMaskLogo, TrustWalletLogo, PayPalLogo, VenmoLogo, WalletIcon, ZelleLogo, CreditCardIcon, RevolutIcon, CashAppIcon } from "@/components/payment-icons"

interface PaymentCardProps {
  title: string
  description: string
  logos: { icon: React.ReactNode; name: string }[]
  buttonText: string
  featured?: boolean
  onClick: () => void
}

function PaymentCard({ title, description, logos, buttonText, featured, onClick }: PaymentCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]",
        "hover:bg-foreground/[0.12] hover:shadow-[0_12px_40px_rgba(58,66,51,0.2)]",
        featured && "ring-1 ring-foreground/20",
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col h-full min-h-[220px]">
          {/* Logos */}
          <div className="flex items-center gap-3 mb-6">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-foreground/[0.06] border border-border p-2 transition-all duration-200 group-hover:bg-foreground/[0.08] group-hover:scale-105"
                title={logo.name}
              >
                {logo.icon}
              </div>
            ))}
          </div>

          {/* Title & Description */}
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">{title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base text-pretty leading-relaxed">{description}</p>
          </div>

          {/* Button */}
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              className="w-full group/btn justify-between text-base font-medium h-12 sm:h-14 bg-foreground/30 hover:bg-foreground/40 border border-border text-foreground"
              variant="outline"
            >
              <span>{buttonText}</span>
              <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

  const handlePaymentMethodSelect = (methodId: string) => {
    if (!orderData) return
    
    const params = new URLSearchParams({
      orderId: orderData.orderId,
      total: orderData.orderTotal.toString(),
      wallet: orderData.merchantWallet
    })
    router.push(`/payment/${methodId}?${params.toString()}`)
  }

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/checkout"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checkout
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Choose Payment Method
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Select your preferred way to complete your{' '}
            <span className="font-semibold text-foreground">${orderData.orderTotal.toFixed(2)}</span> purchase
          </p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Credit/Debit Card */}
          <PaymentCard
            title="Credit or Debit Card"
            description="Pay securely with your credit or debit card. All major cards accepted."
            logos={[{ icon: <CreditCardIcon />, name: "Card" }]}
            buttonText="Pay with Card"
            featured
            onClick={() => handlePaymentMethodSelect('card')}
          />

          {/* Zelle */}
          <PaymentCard
            title="Zelle"
            description="Send payment via Zelle with easy copy-paste instructions. Fast and secure bank transfers."
            logos={[{ icon: <ZelleLogo />, name: "Zelle" }]}
            buttonText="Pay with Zelle"
            onClick={() => handlePaymentMethodSelect('zelle')}
          />

          {/* Cash App */}
          <PaymentCard
            title="Cash App"
            description="Pay instantly with Cash App. Scan QR code or tap to open the app with amount prefilled."
            logos={[{ icon: <CashAppIcon />, name: "Cash App" }]}
            buttonText="Pay with Cash App"
            onClick={() => handlePaymentMethodSelect('cashapp')}
          />

          {/* Revolut Pay */}
          <PaymentCard
            title="Revolut Pay"
            description="Pay instantly with your Revolut account, card, Apple Pay, or Google Pay."
            logos={[{ icon: <RevolutIcon />, name: "Revolut" }]}
            buttonText="Pay with Revolut"
            onClick={() => handlePaymentMethodSelect('revolut')}
          />

          {/* Existing Crypto Wallet */}
          <PaymentCard
            title="Pay with Any Crypto Wallet"
            description="Already have a wallet? Complete your purchase quickly with your existing crypto wallet."
            logos={[{ icon: <WalletIcon />, name: "Any Wallet" }]}
            buttonText="Pay Using Your Wallet"
            onClick={() => handlePaymentMethodSelect('crypto-payment')}
          />

          {/* First Time Crypto User */}
          <PaymentCard
            title="First Time Crypto User"
            description="New to crypto? Get step-by-step guidance to set up your wallet and complete your first payment."
            logos={[
              { icon: <MetaMaskLogo />, name: "MetaMask" },
              { icon: <TrustWalletLogo />, name: "Trust Wallet" },
              { icon: <PayPalLogo />, name: "PayPal" },
              { icon: <VenmoLogo />, name: "Venmo" },
            ]}
            buttonText="Get Started"
            onClick={() => handlePaymentMethodSelect('crypto-setup')}
          />
        </div>
      </div>
    </div>
  )
}

export default function PaymentHubPage() {
  return (
    <>
      <GlobalNav />
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <PaymentHubContent />
      </Suspense>
    </>
  )
}
