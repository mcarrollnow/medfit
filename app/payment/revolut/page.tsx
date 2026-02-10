"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import GlobalNav from '@/components/global-nav'
import { Loader2 } from 'lucide-react'
import { RevolutPayButton } from '@/components/revolut-pay-button'
import { useCartStore } from '@/lib/cart-store'

function RevolutPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()

  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<{
    orderId: string
    orderTotal: number
  } | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const total = parseFloat(searchParams.get('total') || '0')

    if (!orderId || total === 0) {
      router.push('/checkout')
      return
    }

    setOrderData({
      orderId,
      orderTotal: total,
    })
    setLoading(false)
  }, [searchParams, router])

  const handlePaymentSuccess = async (revolutOrderId: string) => {
    try {
      await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData?.orderId,
          paymentIntentId: revolutOrderId,
          paymentMethod: 'revolut',
        }),
      })
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
    
    clearCart()
    router.push(`/order-confirmation?orderId=${orderData?.orderId}`)
  }

  const handlePaymentError = (message: string) => {
    console.error('Payment error:', message)
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
      <div className="max-w-lg mx-auto">
        <Link
          href={`/payment?orderId=${orderData.orderId}&total=${orderData.orderTotal}&wallet=`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Options
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#0075EB]/20 flex items-center justify-center">
              <RevolutLogo className="w-6 h-6 text-[#0075EB]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Revolut Pay
              </h1>
              <p className="text-muted-foreground">
                Total: <span className="font-semibold text-foreground">${orderData.orderTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <Card className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-foreground/70 mb-2">
                  Pay instantly with your Revolut account
                </p>
                <p className="text-muted-foreground text-sm">
                  Accept card, Apple Pay, or Google Pay
                </p>
              </div>

              <RevolutPayButton
                amount={orderData.orderTotal}
                currency="USD"
                description={`Order ${orderData.orderId}`}
                reference={orderData.orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-foreground/10" />
                <span className="text-muted-foreground text-xs">OR</span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>

              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-foreground/5 rounded-lg">
                  <ApplePayIcon className="w-5 h-5 text-foreground" />
                  <span className="text-foreground/70 text-sm">Apple Pay</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-foreground/5 rounded-lg">
                  <GooglePayIcon className="w-5 h-5" />
                  <span className="text-foreground/70 text-sm">Google Pay</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your payment is secured by Revolut
          </p>
        </div>
      </div>
    </div>
  )
}

function RevolutLogo({ className }: { className?: string }) {
  return (
    <img
      src="https://bteugdayafihvdzhpnlv.supabase.co/storage/v1/object/public/theme-assets/Revolut-Icon-Logo.wine.svg"
      alt="Revolut"
      className={className}
    />
  )
}

function ApplePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.72 7.47c-.5.58-.97 1.11-1.49 1.6-.04.04-.08.07-.12.11-.47.41-1.02.73-1.63.95-.18.06-.36.12-.55.16a3.4 3.4 0 0 1-.68.07c-.23 0-.45-.02-.67-.07a3.79 3.79 0 0 1-.55-.16c-.61-.22-1.16-.54-1.63-.95-.04-.04-.08-.07-.12-.11-.52-.49-.99-1.02-1.49-1.6-.13-.15-.26-.31-.38-.47A5.96 5.96 0 0 1 7.5 4.97c0-.71.13-1.38.38-2.01.26-.63.63-1.19 1.1-1.67a5.11 5.11 0 0 1 1.67-1.1A4.93 4.93 0 0 1 12.66 0c.71 0 1.38.13 2.01.19.63.26 1.19.63 1.67 1.1.47.47.84 1.03 1.1 1.67.25.63.38 1.3.38 2.01 0 .76-.15 1.48-.43 2.14-.13.32-.28.62-.45.9-.12.19-.24.37-.38.54-.08.1-.15.19-.23.28-.02.02-.04.05-.06.07l-.55.57z" />
    </svg>
  )
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
    </svg>
  )
}

export default function RevolutPaymentPage() {
  return (
    <>
      <GlobalNav />
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <RevolutPaymentContent />
      </Suspense>
    </>
  )
}

