"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle, Loader2, Wallet, Tag } from "lucide-react"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MobileWalletConnect } from '@/components/mobile-wallet-connect'
import { useIsMobile } from '@/hooks/use-mobile'
import { parseEther } from "viem"
import { useCartStore } from "@/lib/cart-store"
import { useOrderStore } from "@/lib/order-store"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { ShippingAddressFormSimplified as ShippingAddressForm } from "@/components/shipping-address-form"
import type { ShippingAddress } from "@/lib/address-store"
import { orderService } from "@/lib/order-service"
import { getCurrentUser, getCustomerProfile } from "@/lib/auth-client"
// PromoCode type for checkout
interface PromoCode {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'set_price'
  discount: number
  description?: string
  validUntil?: Date
  customProductPrices?: Record<string, number>
}
import { RepCommissionWidget } from "@/components/rep-commission-widget"
import { applyCommissionForPurchase } from "@/app/actions/payouts"

interface CheckoutFormProps {
  total: number
  onDiscountChange?: (discount: number, promoCode: string) => void
}

export function CheckoutFormSimplified({ total, onDiscountChange }: CheckoutFormProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Omit<ShippingAddress, "id"> | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [useRepCommission, setUseRepCommission] = useState(false)
  const [repCommissionAmount, setRepCommissionAmount] = useState(0)

  const { items, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const router = useRouter()

  const { address, isConnected } = useAccount()
  const { sendTransaction, data: hash, isPending } = useSendTransaction()
  const isMobile = useIsMobile()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Calculate discount based on promo type
  const calculateDiscount = (baseTotal: number, promo: PromoCode | null): number => {
    if (!promo) return 0
    
    if (promo.type === 'percentage') {
      return (baseTotal * promo.discount) / 100
    } else if (promo.type === 'fixed') {
      return promo.discount
    } else if (promo.type === 'set_price' && promo.customProductPrices) {
      // Calculate savings from custom product prices
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
  const commissionDiscount = useRepCommission ? repCommissionAmount : 0
  const finalTotal = Math.max(0, total - discount - commissionDiscount)
  const usdcAmount = finalTotal.toFixed(2)

  // Handle rep commission toggle
  const handleRepCommissionChange = (useCommission: boolean, amount: number) => {
    setUseRepCommission(useCommission)
    setRepCommissionAmount(amount)
  }

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
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer)
  }, [promoCode, total])

  useEffect(() => {
    if (isConfirmed && hash) {
      setSuccess(true)

      addOrder({
        items: items,
        total: total,
        token: "USDC",
        transactionHash: hash,
        shippingAddress: shippingAddress,
      })

      setTimeout(() => {
        clearCart()
        router.push(`/order-confirmation?tx=${hash}`)
      }, 2000)
    }
  }, [isConfirmed, hash, total, items, addOrder, clearCart, router])

  async function handleApplyPromo() {
    setPromoError(null)

    if (!promoCode.trim()) {
      setPromoError("Enter a code")
      return
    }

    try {
      const result = await orderService.validateDiscount({
        code: promoCode,
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
        setPromoCode("")
      } else {
        setPromoError(result.error || "Invalid code")
      }
    } catch (error) {
      setPromoError("Failed to validate")
    }
  }

  // Auto-apply discount code when valid
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
  }

  async function handlePayment() {
    setError(null)

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.addressLine1) {
      setError("Please enter shipping address")
      return
    }

    if (!shippingAddress.email) {
      setError("Please enter email")
      return
    }

    if (!address) {
      setError("Connect wallet first")
      return
    }

    try {
      setIsCreatingOrder(true)

      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'
      if (!user && !isDevelopment) {
        setError("Please log in")
        return
      }

      const userEmail = shippingAddress.email || user?.email || 'test@example.com'
      const nameParts = shippingAddress.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

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
          email: userEmail
        },
        discount_code_id: appliedPromo?.id || null,
        discount_amount: discount,
        payment_method: 'crypto',
        notes: null
      })

      // Get customer's assigned business wallet from their profile
      const customerProfile = await getCustomerProfile()
      const merchantWalletId = (customerProfile as any)?.default_wallet_id
      
      if (!merchantWalletId) {
        throw new Error('No merchant wallet assigned to your account. Please contact support.')
      }
      
      // Fetch the actual business wallet details
      const { data: merchantWallet, error: walletError } = await supabase
        .from('business_wallets')
        .select('id, address, label')
        .eq('id', merchantWalletId)
        .single()
      
      if (walletError || !merchantWallet) {
        throw new Error('Failed to load merchant wallet. Please contact support.')
      }
      
      const merchantWalletAddress = merchantWallet.address
      console.log('[Checkout] Using merchant wallet:', merchantWallet.label, merchantWalletAddress, 'ID:', merchantWalletId)
      
      await orderService.initiatePayment(
        orderData.order.id,
        merchantWalletId,
        'USDC'
      )
      
      const merchantAddress = merchantWalletAddress

      // USDC ERC-20 transfer
      const usdcContract = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      const usdcAmountRaw = Math.round(finalTotal * 1000000) // 6 decimals

      // Encode transfer(address,uint256)
      const transferSelector = '0xa9059cbb'
      const paddedRecipient = merchantAddress.slice(2).padStart(64, '0')
      const paddedAmount = usdcAmountRaw.toString(16).padStart(64, '0')
      const data = `${transferSelector}${paddedRecipient}${paddedAmount}` as `0x${string}`

      sendTransaction({
        to: usdcContract as `0x${string}`,
        data: data,
      })

      setIsCreatingOrder(false)
    } catch (err) {
      console.error('[Checkout] Error:', err)
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
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

  const isProcessing = isPending || isConfirming

  return (
    <div className="space-y-4 md:space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <span className="font-medium">Payment successful! Redirecting...</span>
          </AlertDescription>
        </Alert>
      )}

      <ShippingAddressForm onAddressChange={setShippingAddress} />

      <Separator className="my-6" />

      {appliedPromo ? (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <span className="font-medium">{appliedPromo.code}</span>
              {appliedPromo.type === "percentage"
                ? ` ${appliedPromo.discount}% off`
                : ` $${appliedPromo.discount} off`}
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
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              disabled={success}
              className="h-12 text-base pr-10"
            />
            {isValidatingPromo && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:hidden">
            <Button 
              onClick={handleApplyPromo} 
              variant="outline" 
              disabled={success || !promoCode.trim() || isValidatingPromo}
              className="w-full"
            >
              Apply Code
            </Button>
          </div>
        </div>
      )}
      {promoError && <p className="text-sm text-destructive mt-1">{promoError}</p>}
      {isValidatingPromo && <p className="text-sm text-muted-foreground mt-1">Validating code...</p>}

      {/* Rep Commission Widget - allows reps to use their commission balance */}
      <RepCommissionWidget
        cartTotal={total - discount}
        onApplyCommission={handleRepCommissionChange}
        className="mt-4"
      />

      <Separator className="my-6" />

      <div className="space-y-3 md:space-y-4">
        {!isConnected ? (
          isMobile ? (
            <MobileWalletConnect onConnect={() => console.log('Wallet connected on mobile')} />
          ) : (
            <ConnectButton />
          )
        ) : (
          <>
            <Button
              onClick={async () => {
                // Copy amount to clipboard
                await navigator.clipboard.writeText(usdcAmount)
                setShowCopiedMessage(true)
                
                // Show message for 1 second
                setTimeout(() => {
                  setShowCopiedMessage(false)
                  // Open Trust Wallet buy screen
                  window.location.href = 'trust://'
                }, 1000)
              }}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {showCopiedMessage ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Order total copied - paste in app
                </>
              ) : (
                'Load Wallet'
              )}
            </Button>

            <Button
              onClick={handlePayment}
              className="w-full !bg-black !text-white hover:!bg-gray-900 border border-white"
              size="lg"
              disabled={isProcessing || success || isCreatingOrder}
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                "Success!"
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
