"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Lock, Shield } from "lucide-react"
import type { ShippingAddress } from "@/lib/address-store"
import { orderService } from "@/lib/order-service"
import { getCurrentUser } from "@/lib/auth-client"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface StreamlinedCardCheckoutProps {
  total: number
  discount?: number
  promoCode?: string
  discountCodeId?: string
  assignedDiscountId?: string
  fixedDiscountAmount?: number
  shippingAddress?: Omit<ShippingAddress, "id"> | null
  onShippingChange?: (address: Omit<ShippingAddress, "id"> | null) => void
}

export function StreamlinedCardCheckout({ 
  total, 
  discount = 0, 
  promoCode, 
  discountCodeId, 
  assignedDiscountId, 
  fixedDiscountAmount,
  shippingAddress,
}: StreamlinedCardCheckoutProps) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  
  // Calculate discount amount - use fixed amount if provided, otherwise percentage
  const discountAmount = fixedDiscountAmount !== undefined 
    ? Math.min(fixedDiscountAmount, total)
    : discount > 0 
      ? (total * discount / 100) 
      : 0
  const finalTotal = Math.max(0, total - discountAmount)
  
  // Check if shipping is complete
  const isShippingComplete = !!(
    shippingAddress?.name &&
    shippingAddress?.addressLine1 &&
    shippingAddress?.city &&
    shippingAddress?.state &&
    shippingAddress?.zip &&
    shippingAddress?.email
  )

  async function handlePayWithCard() {
    if (!isShippingComplete) {
      setError("Please complete your shipping information above")
      return
    }

    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    setError(null)
    setIsCreatingOrder(true)

    try {
      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (!user && !isDevelopment) {
        setError("Please log in to continue")
        setIsCreatingOrder(false)
        return
      }

      const userEmail = shippingAddress?.email || user?.email || ''
      const nameParts = (shippingAddress?.name || '').split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create the order
      const orderData = await orderService.createOrder({
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        shipping_address: {
          line1: shippingAddress?.addressLine1 || '',
          line2: shippingAddress?.addressLine2 || '',
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          zip: shippingAddress?.zip || '',
          country: shippingAddress?.country || 'USA'
        },
        customer_info: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: shippingAddress?.phone
        },
        discount_code_id: discountCodeId || (assignedDiscountId ? undefined : undefined),
        discount_amount: discountAmount,
        payment_method: 'card',
        notes: promoCode ? `Promo: ${promoCode}` : undefined
      })

      if (!orderData?.order?.id) {
        throw new Error('Failed to create order')
      }

      console.log('[Card Checkout] Order created:', orderData.order.order_number)

      // Get Authorize.net hosted payment page
      const paymentResponse = await fetch('/api/authorize-net/hosted-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          orderId: orderData.order.id,
          orderNumber: orderData.order.order_number,
          customerEmail: userEmail,
          customerId: orderData.order.customer_id,
          description: `Order ${orderData.order.order_number}`
        })
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || 'Failed to initialize payment')
      }

      const { formUrl, token } = await paymentResponse.json()

      if (!formUrl) {
        throw new Error('Failed to get payment URL')
      }

      console.log('[Card Checkout] Redirecting to Authorize.net payment page')

      // Store order ID in session storage so we can verify on return
      sessionStorage.setItem('pendingOrderId', orderData.order.id)
      sessionStorage.setItem('pendingOrderNumber', orderData.order.order_number)

      // Redirect to Authorize.net hosted payment page
      window.location.href = formUrl

    } catch (err) {
      console.error('[Card Checkout] Error:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to process checkout"
      setError(errorMessage)
      setIsCreatingOrder(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Order Total Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount {promoCode && `(${promoCode})`}</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={handlePayWithCard}
          disabled={isCreatingOrder || !isShippingComplete}
          className="w-full h-16 text-lg font-bold bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
          size="lg"
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Processing...
            </>
          ) : !isShippingComplete ? (
            <>
              <CreditCard className="mr-3 h-6 w-6" />
              Complete Shipping Info Above
            </>
          ) : (
            <>
              <CreditCard className="mr-3 h-6 w-6" />
              Pay ${finalTotal.toFixed(2)}
            </>
          )}
        </Button>
      </motion.div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-4 text-white/40 text-sm">
        <div className="flex items-center gap-1.5">
          <Lock className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4" />
          <span>PCI Compliant</span>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="text-center">
        <p className="text-xs text-white/30 mb-2">Accepted Payment Methods</p>
        <div className="flex justify-center gap-3">
          <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white/60 text-sm font-medium">
            Visa
          </div>
          <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white/60 text-sm font-medium">
            Mastercard
          </div>
          <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white/60 text-sm font-medium">
            Amex
          </div>
          <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white/60 text-sm font-medium">
            Discover
          </div>
        </div>
      </div>
    </div>
  )
}
