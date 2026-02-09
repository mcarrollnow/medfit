"use client"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StreamlinedCardCheckout } from "@/components/streamlined-card-checkout"
import { ShippingAddressFormSimplified as ShippingAddressForm } from "@/components/shipping-address-form"
import { OrderSummary } from "@/components/order-summary"
import GlobalNav from "@/components/global-nav"
import { ArrowLeft, Loader2, CheckCircle2, Tag, Gift, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth-client"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { orderService } from "@/lib/order-service"
import { getCustomerActiveDiscount, type CustomerAssignedDiscount } from "@/app/actions/rep-pricing"
import { getCustomerReferralDiscount } from "@/app/actions/referrals"
import type { ShippingAddress } from "@/lib/address-store"

export default function CheckoutPage() {
  const { items, fetchCart, getTotal } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [discount, setDiscount] = useState(0)
  const [discountCodeId, setDiscountCodeId] = useState<string | undefined>(undefined)
  const [freeShipping, setFreeShipping] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null)
  const [assignedDiscount, setAssignedDiscount] = useState<CustomerAssignedDiscount | null>(null)
  const [assignedDiscountApplied, setAssignedDiscountApplied] = useState(false)
  const [referralDiscount, setReferralDiscount] = useState<{ discount: number; referrerName: string } | null>(null)
  const [referralDiscountApplied, setReferralDiscountApplied] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Omit<ShippingAddress, "id"> | null>(null)
  const [customProductPrices, setCustomProductPrices] = useState<Record<string, number> | null>(null)
  const supabase = getSupabaseBrowserClient()

  const total = getTotal()
  
  // Calculate discount amount - handle percentage, fixed, and set_price discounts
  const calculateDiscountAmount = () => {
    // Set price discounts - calculate savings from custom product prices
    if (customProductPrices && Object.keys(customProductPrices).length > 0) {
      let savings = 0
      items.forEach(item => {
        const productId = item.product?.id
        if (productId && customProductPrices[productId] !== undefined) {
          const regularPrice = item.product?.display_price || item.product?.retail_price || 0
          const customPrice = customProductPrices[productId]
          if (customPrice < regularPrice) {
            savings += (regularPrice - customPrice) * item.quantity
          }
        }
      })
      return savings
    }
    
    if (!discount && !assignedDiscount) return 0
    
    // If we have an assigned discount with fixed type, use the fixed value directly
    if (assignedDiscountApplied && assignedDiscount?.custom_discount_type === "fixed") {
      const fixedAmount = assignedDiscount.custom_discount_value || 0
      // Cap at total so discount doesn't exceed order value
      return Math.min(fixedAmount, total)
    }
    
    // Otherwise use percentage calculation
    return discount ? total * (discount / 100) : 0
  }
  
  const discountAmount = calculateDiscountAmount()
  const finalTotal = total - discountAmount

  useEffect(() => {
    const init = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        window.history.replaceState({}, '', window.location.pathname)
      }

      await fetchCart()

      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'

      if (!user && !isDevelopment) {
        window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/login?returnTo=${encodeURIComponent(window.location.href)}`
        return
      }

      // Check for assigned discount and referral discount for this customer
      if (user?.id) {
        try {
          // Get customer ID from user ID
          const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (customerData?.id) {
            console.log("[Checkout] Checking for discounts for customer:", customerData.id)

            // Check for rep-assigned discount first (higher priority)
            const activeDiscount = await getCustomerActiveDiscount(customerData.id)

            if (activeDiscount) {
              console.log("[Checkout] Found assigned discount:", activeDiscount)
              setAssignedDiscount(activeDiscount)

              // Auto-apply the discount
              const discountType = activeDiscount.custom_discount_type
              const discountValue = activeDiscount.custom_discount_value || 0

              if (discountType === "percentage") {
                setDiscount(discountValue)
              }
              // For fixed discounts, we don't set a percentage - the discount amount
              // is calculated directly from assignedDiscount.custom_discount_value
              // This ensures it works correctly regardless of when cart loads

              setAssignedDiscountApplied(true)
              if (activeDiscount.custom_description) {
                setPromoCode(activeDiscount.custom_description)
              } else {
                setPromoCode("Special Discount Applied")
              }
            } else {
              // If no rep discount, check for referral discount
              const referralResult = await getCustomerReferralDiscount(customerData.id)

              if (referralResult.hasReferral && referralResult.discount > 0) {
                console.log("[Checkout] Found referral discount:", referralResult)
                setReferralDiscount({
                  discount: referralResult.discount,
                  referrerName: referralResult.referrerName || "a friend"
                })

                // Auto-apply referral discount
                setDiscount(referralResult.discount)
                setReferralDiscountApplied(true)
                setPromoCode(`Referral from ${referralResult.referrerName}`)
              }
            }
          }
        } catch (error) {
          console.error("[Checkout] Error checking for discounts:", error)
        }
      }

      // Check for promo code passed from purchase form (localStorage)
      const savedPromo = localStorage.getItem('pendingPromoCode')
      if (savedPromo && !assignedDiscountApplied) {
        try {
          const { code, discount: savedDiscount, discountType, freeShipping: savedFreeShipping, discountCodeId } = JSON.parse(savedPromo)
          console.log("[Checkout] Found pending promo code from purchase form:", code)
          
          // Set the promo code values
          setPromoCode(code)
          setPromoInput(code)
          setDiscountCodeId(discountCodeId)
          setFreeShipping(savedFreeShipping || false)
          
          if (discountType === 'percentage') {
            setDiscount(savedDiscount)
          } else {
            // For fixed discounts, we need to handle differently
            // Set discount as a percentage of current total that equals the fixed amount
            // This will be recalculated properly by the calculateDiscountAmount function
            setDiscount(savedDiscount)
          }
          
          // Clear from localStorage after applying
          localStorage.removeItem('pendingPromoCode')
        } catch (e) {
          console.error("[Checkout] Error parsing saved promo code:", e)
          localStorage.removeItem('pendingPromoCode')
        }
      }

      setLoading(false)
    }

    init()
  }, [])

  // Auto-validate promo code with debounce
  useEffect(() => {
    if (!promoInput.trim()) {
      // Clear promo when input is empty
      if (promoCode) {
        handleRemovePromo()
      }
      return
    }

    // Clear previous timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout)
    }

    // Set new timeout for debounced validation (500ms delay)
    const timeout = setTimeout(() => {
      handleAutoValidatePromo(promoInput.trim())
    }, 500)

    setValidationTimeout(timeout)

    // Cleanup timeout on unmount
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [promoInput])
  
  // Re-validate promo when cart total changes
  useEffect(() => {
    if (promoInput && total > 0 && !promoCode) {
      // If we have a promo input but it hasn't been validated yet (and cart now has items)
      handleAutoValidatePromo(promoInput.trim())
    }
  }, [total])

  const handleAutoValidatePromo = async (code: string) => {
    if (!code) return
    
    // Don't validate if cart is empty or total is 0
    const currentTotal = getTotal()
    if (currentTotal === 0) {
      console.log('[Checkout] Skipping promo validation - cart total is 0')
      return
    }

    setIsValidatingPromo(true)
    setPromoError(null)

    try {
      const result = await orderService.validateDiscount({
        code: code,
        orderAmount: currentTotal
      })
      
      console.log('[Checkout] Promo validation result:', {
        code,
        orderAmount: currentTotal,
        result
      })

      if (result.valid && result.discount) {
        console.log('[Checkout] Discount details:', result.discount)
        
        // Handle set_price discount type - use custom product prices
        if (result.discount.discount_type === 'set_price' && result.discount.custom_product_prices) {
          console.log('[Checkout] Set price discount - custom prices:', result.discount.custom_product_prices)
          setCustomProductPrices(result.discount.custom_product_prices)
          setDiscount(0) // No percentage discount for set_price
        } else {
          // Use the calculated discount_amount from the API response
          const discountPercentage = result.discount_percentage || 
            (result.discount_amount && currentTotal > 0 ? (result.discount_amount / currentTotal * 100) : 0)
          
          setDiscount(discountPercentage)
          setCustomProductPrices(null) // Clear any previous custom prices
        }
        
        setDiscountCodeId(result.discount_code_id)
        setFreeShipping(result.discount.free_shipping || false)
        setPromoCode(code)
        setPromoError(null)
      } else if (result.valid) {
        // Fallback for valid response without discount object
        const discountPercentage = result.discount_percentage || 
          (result.discount_amount && currentTotal > 0 ? (result.discount_amount / currentTotal * 100) : 0)
        
        setDiscount(discountPercentage)
        setDiscountCodeId(result.discount_code_id)
        setFreeShipping(false)
        setPromoCode(code)
        setPromoError(null)
        setCustomProductPrices(null)
      } else {
        setPromoError(result.error || "Invalid code")
        setDiscount(0)
        setDiscountCodeId(undefined)
        setFreeShipping(false)
        setPromoCode("")
        setCustomProductPrices(null)
      }
      } catch (error) {
      setPromoError("Failed to validate")
      setDiscount(0)
      setDiscountCodeId(undefined)
      setFreeShipping(false)
      setPromoCode("")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setDiscount(0)
    setDiscountCodeId(undefined)
    setFreeShipping(false)
    setPromoCode("")
    setPromoInput("")
    setPromoError(null)
    setCustomProductPrices(null)
  }

  if (loading) {
    return (
      <>
        <GlobalNav />
      <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Back to Cart */}
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Cart</span>
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">Checkout</h1>
          <p className="text-lg text-white/50">Complete your order</p>
        </div>

        {/* Two Column Layout on Desktop, Single Column on Mobile */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          
          {/* LEFT COLUMN: Promo Code + Shipping */}
          <div className="space-y-6">
            {/* Promo Code Section */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/50 mb-4">Promo Code</h3>
              
              {/* Assigned Discount Banner */}
              {assignedDiscountApplied && assignedDiscount && (
                <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-purple-300">Special Discount Applied!</p>
                      <p className="text-sm text-purple-400/80">
                        {assignedDiscount.custom_discount_type === "percentage"
                          ? `${assignedDiscount.custom_discount_value}% off`
                          : `$${assignedDiscount.custom_discount_value} off`}
                        {assignedDiscount.custom_description && ` - ${assignedDiscount.custom_description}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAssignedDiscountApplied(false)
                      setAssignedDiscount(null)
                      setDiscount(0)
                      setPromoCode("")
                    }}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}

              {/* Referral Discount Banner */}
              {referralDiscountApplied && referralDiscount && !assignedDiscountApplied && (
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-emerald-300">Referral Discount Applied!</p>
                      <p className="text-sm text-emerald-400/80">
                        {referralDiscount.discount}% off - Referred by {referralDiscount.referrerName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReferralDiscountApplied(false)
                      setReferralDiscount(null)
                      setDiscount(0)
                      setPromoCode("")
                    }}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
              
              {promoCode && !assignedDiscountApplied && !referralDiscountApplied ? (
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-white">{promoCode}</p>
                      <p className="text-sm text-white/50">
                        {customProductPrices && Object.keys(customProductPrices).length > 0
                          ? `Special pricing applied - Save $${discountAmount.toFixed(2)}`
                          : discount > 0 
                            ? `${discount}% discount applied`
                            : 'Discount applied'
                        }
                        {freeShipping && " + Free shipping"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePromo}
                    className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Remove
                  </Button>
                </div>
              ) : !assignedDiscountApplied && !referralDiscountApplied ? (
                <div className="relative">
                  <Input
                    placeholder="Enter promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className={`rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 pr-10 ${promoError ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    {isValidatingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white/40" />
                    ) : promoInput && !promoCode && !promoError ? (
                      <Tag className="h-4 w-4 text-white/40" />
                    ) : null}
                  </div>
                </div>
              ) : null}
              {promoError && (
                <p className="text-sm text-red-400 mt-2">{promoError}</p>
              )}
            </div>

            {/* Shipping Information */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/50 mb-4">Shipping Information</h3>
              <ShippingAddressForm onAddressChange={setShippingAddress} />
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary + Payment Options */}
          <div className="space-y-6">
            {/* Order Summary */}
            <OrderSummary 
              items={items.map(item => ({
                ...item,
                name: item.product?.name || 'Product',
                retail_price: item.product?.retail_price || item.product?.display_price || '0',
                color: item.product?.color,
                image: item.product?.image_url,
                variant: item.product?.variant,
                cart_image: item.product?.cart_image
              }))}
              discount={discount}
              freeShipping={freeShipping}
              fixedDiscountAmount={
                assignedDiscountApplied && assignedDiscount?.custom_discount_type === "fixed"
                  ? assignedDiscount.custom_discount_value || 0
                  : undefined
              }
              promoCode={promoCode}
              customProductPrices={customProductPrices}
            />
            
            {/* Payment - Card Only via Authorize.net */}
            <StreamlinedCardCheckout 
              total={total}
              discount={discount}
              promoCode={promoCode}
              discountCodeId={discountCodeId}
              assignedDiscountId={assignedDiscount?.id}
              fixedDiscountAmount={
                // Use fixed discount for: assigned fixed discounts OR set_price discounts
                (customProductPrices && Object.keys(customProductPrices).length > 0)
                  ? discountAmount
                  : assignedDiscountApplied && assignedDiscount?.custom_discount_type === "fixed"
                    ? assignedDiscount.custom_discount_value || 0
                    : undefined
              }
              shippingAddress={shippingAddress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}