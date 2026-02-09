"use client"

import { useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { useSupplyStoreCart } from "@/lib/supply-store/cart"
import { CheckCircle, ArrowRight, Package, Mail } from "lucide-react"

export default function SupplyStoreCheckoutSuccessPage() {
  const { clearCart } = useSupplyStoreCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen px-6 py-24 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <GlassCard padding="lg" className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your order. We&apos;ve received your payment and are preparing your equipment for shipment.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <Mail className="w-6 h-6 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-muted-foreground">Check your inbox for order details</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <Package className="w-6 h-6 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Shipping Updates</p>
                <p className="text-sm text-muted-foreground">You&apos;ll receive tracking info when shipped</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/supply-store/orders" className="flex-1">
              <GlassButton variant="primary" size="lg" className="w-full gap-2">
                View My Orders
                <ArrowRight className="w-5 h-5" />
              </GlassButton>
            </Link>
            <Link href="/supply-store/products" className="flex-1">
              <GlassButton variant="outline" size="lg" className="w-full">
                Continue Shopping
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

