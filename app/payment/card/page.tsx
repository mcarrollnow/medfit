"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import GlobalNav from '@/components/global-nav'
import { Loader2 } from 'lucide-react'
import { AuthorizeNetCheckout } from '@/components/authorize-net-checkout'
import { useCartStore } from '@/lib/cart-store'

function CardPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()

  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<{
    orderId: string
    orderNumber: string
    orderTotal: number
    customerEmail?: string
    customerId?: string
    shippingAddress?: {
      firstName: string
      lastName: string
      address: string
      city: string
      state: string
      zip: string
      country: string
    }
  } | null>(null)

  useEffect(() => {
    async function loadOrderData() {
      const orderId = searchParams.get('orderId')
      const total = parseFloat(searchParams.get('total') || '0')

      if (!orderId || total === 0) {
        router.push('/checkout')
        return
      }

      // Fetch order details to get order number and shipping address
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const order = await response.json()
          
          console.log('[CardPayment] Order fetched:', {
            id: order.id,
            order_number: order.order_number,
            shipping_address_line1: order.shipping_address_line1,
            shipping_city: order.shipping_city,
            customer_name: order.customer?.name,
          })
          
          // Build shipping address from order columns
          // Orders store address as separate columns, not as a JSON object
          let shippingAddress = undefined
          if (order.shipping_address_line1 || order.shipping_city) {
            // Get customer name for first/last name
            const customerName = order.customer?.name || ''
            const nameParts = customerName.split(' ')
            
            shippingAddress = {
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              address: order.shipping_address_line1 || '',
              city: order.shipping_city || '',
              state: order.shipping_state || '',
              zip: order.shipping_zip || '',
              country: order.shipping_country || 'US',
            }
            
            console.log('[CardPayment] Built shipping address:', shippingAddress)
          } else {
            console.log('[CardPayment] No shipping address found in order')
          }
          
          setOrderData({
            orderId,
            orderNumber: order.order_number || orderId.slice(0, 8).toUpperCase(),
            orderTotal: total,
            customerEmail: order.customer?.email,
            customerId: order.customer?.id,
            shippingAddress,
          })
        } else {
          console.log('[CardPayment] Order fetch failed:', response.status)
          // Fallback if order fetch fails
          setOrderData({
            orderId,
            orderNumber: orderId.slice(0, 8).toUpperCase(),
            orderTotal: total,
          })
        }
      } catch {
        // Fallback
        setOrderData({
          orderId,
          orderNumber: orderId.slice(0, 8).toUpperCase(),
          orderTotal: total,
        })
      }
      
      setLoading(false)
    }

    loadOrderData()
  }, [searchParams, router])

  const handlePaymentSuccess = async (transactionId: string) => {
    // Update order with transaction ID
    try {
      await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData?.orderId,
          transactionId,
          paymentMethod: 'card',
          paymentProvider: 'authorize_net',
        }),
      })
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
    
    clearCart()
    setTimeout(() => {
      router.push(`/order-confirmation?orderId=${orderData?.orderId}`)
    }, 2000)
  }

  const handlePaymentError = (message: string) => {
    console.error('Payment error:', message)
  }

  const handlePaymentCancel = () => {
    router.push(`/payment?orderId=${orderData?.orderId}&total=${orderData?.orderTotal}`)
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
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Options
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Card Payment
              </h1>
              <p className="text-white/50">
                Total: <span className="font-semibold text-white">${orderData.orderTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form Card */}
        <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <CardContent className="p-6 sm:p-8">
            <AuthorizeNetCheckout
              orderId={orderData.orderId}
              orderNumber={orderData.orderNumber}
              amount={orderData.orderTotal}
              customerEmail={orderData.customerEmail}
              customerId={orderData.customerId}
              shippingAddress={orderData.shippingAddress}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/30">
            Your payment is secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CardPaymentPage() {
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
        <CardPaymentContent />
      </Suspense>
    </>
  )
}
