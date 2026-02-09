"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Tag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { ShippingAddressFormSimplified as ShippingAddressForm } from "@/components/shipping-address-form"
import type { ShippingAddress } from "@/lib/address-store"
import { orderService } from "@/lib/order-service"
import { getCurrentUser } from "@/lib/auth-client"

interface PromoCode {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'set_price'
  discount: number
  description?: string
  validUntil?: Date
  customProductPrices?: Record<string, number>
}

interface CheckoutFormCardProps {
  total: number
  onDiscountChange?: (discount: number, promoCode: string) => void
}

export function CheckoutFormCard({ total, onDiscountChange }: CheckoutFormCardProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState<Omit<ShippingAddress, "id"> | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)

  const { items } = useCartStore()
  const router = useRouter()

  // Calculate discount based on promo type
  const calculateDiscount = (baseTotal: number, promo: PromoCode | null): number => {
    if (!promo) return 0
    
    if (promo.type === 'percentage') {
      return (baseTotal * promo.discount) / 100
    } else if (promo.type === 'fixed') {
      return promo.discount
    } else if (promo.type === 'set_price' && promo.customProductPrices) {
      let savings = 0
      items.forEach(item => {
        const customPrice = promo.customProductPrices?.[item.id]
        if (customPrice !== undefined && customPrice < item.price) {
          savings += (item.price - customPrice) * item.quantity
        }
      })
      return savings
    }
    return 0
  }

  const discount = calculateDiscount(total, appliedPromo)
  const finalTotal = Math.max(0, total - discount)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Notify parent component when discount changes
  useEffect(() => {
    if (onDiscountChange) {
      onDiscountChange(discount, appliedPromo?.code || "")
    }
  }, [discount, appliedPromo?.code, onDiscountChange])

  // Auto-validate promo code with debounce
  useEffect(() => {
    if (!promoCode || appliedPromo?.code === promoCode) return

    const timer = setTimeout(async () => {
      setIsValidatingPromo(true)
      await validatePromoCodeInput(promoCode)
      setIsValidatingPromo(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [promoCode, total])

  async function validatePromoCodeInput(code: string) {
    if (!code.trim()) {
      setPromoError(null)
      return
    }

    try {
      const result = await orderService.validateDiscount({
        code: code,
        orderAmount: total
      })

      if (result.valid && result.discount) {
        const discountType = result.discount.discount_type || (result.discount_percentage ? 'percentage' : 'fixed')
        const promo: PromoCode = {
          id: result.discount.id,
          code: result.discount.code,
          type: discountType as 'percentage' | 'fixed' | 'set_price',
          discount: discountType === 'percentage' 
            ? result.discount.discount_value 
            : discountType === 'fixed' 
            ? result.discount.discount_value 
            : 0,
          description: result.discount.description,
          validUntil: result.discount.valid_until ? new Date(result.discount.valid_until) : undefined,
          customProductPrices: result.discount.custom_product_prices
        }
        setAppliedPromo(promo)
        setPromoError(null)
      } else {
        setAppliedPromo(null)
        setPromoError(result.error || "Invalid code")
      }
    } catch (error) {
      setAppliedPromo(null)
      setPromoError("Failed to validate")
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null)
    setPromoError(null)
    setPromoCode("")
  }

  async function handlePayWithCard() {
    setError(null)

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.addressLine1) {
      setError("Please enter your shipping address")
      return
    }

    if (!shippingAddress.email) {
      setError("Please enter your email address")
      return
    }

    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    try {
      setIsCreatingOrder(true)

      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (!user && !isDevelopment) {
        setError("Please log in to continue")
        return
      }

      const userEmail = shippingAddress.email || user?.email || ''
      const nameParts = shippingAddress.name.split(' ')
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
          line1: shippingAddress.addressLine1,
          line2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country || 'USA'
        },
        customer_info: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: shippingAddress.phone
        },
        discount_code_id: appliedPromo?.id || null,
        discount_amount: discount,
        payment_method: 'card',
        notes: null
      })

      if (!orderData?.order?.id) {
        throw new Error('Failed to create order')
      }

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

      const { formUrl } = await paymentResponse.json()

      if (!formUrl) {
        throw new Error('Failed to get payment URL')
      }

      // Update order with transaction pending status
      await fetch(`/api/orders/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.id,
          paymentProvider: 'authorize_net',
          paymentMethod: 'card'
        })
      }).catch(() => {
        // Don't fail if this update fails - webhook will handle it
      })

      // Redirect to Authorize.net hosted payment page
      window.location.href = formUrl

    } catch (err) {
      console.error('[Checkout] Error:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to process checkout"
      setError(errorMessage)
      setIsCreatingOrder(false)
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-secondary rounded" />
          <div className="h-32 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ShippingAddressForm onAddressChange={setShippingAddress} />

      <Separator className="my-6" />

      {/* Promo Code Section */}
      {appliedPromo ? (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <span className="font-medium">{appliedPromo.code}</span>
              {appliedPromo.type === "percentage"
                ? ` ${appliedPromo.discount}% off`
                : ` $${appliedPromo.discount.toFixed(2)} off`}
            </span>
            <Button variant="ghost" size="sm" onClick={handleRemovePromo} className="h-auto p-1 text-xs">
              Remove
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          <Label className="text-base font-semibold mb-2 block pl-3">Promo Code</Label>
          <div className="relative">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="h-12 text-base pr-10"
            />
            {isValidatingPromo && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
      {promoError && <p className="text-sm text-destructive mt-1">{promoError}</p>}

      <Separator className="my-6" />

      {/* Order Summary */}
      <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayWithCard}
        className="w-full h-14 text-lg font-semibold"
        size="lg"
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ${finalTotal.toFixed(2)} with Card
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by Authorize.net
      </p>
    </div>
  )
}
