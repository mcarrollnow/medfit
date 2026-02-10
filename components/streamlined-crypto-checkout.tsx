"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, Wallet, ArrowRight, Zap, Fingerprint, Lock, Shield, X, Check, CreditCard, Mail, FileText } from "lucide-react"
import { ShippingAddressFormSimplified as ShippingAddressForm } from "@/components/shipping-address-form"
import type { ShippingAddress } from "@/lib/address-store"
import { orderService } from "@/lib/order-service"
import { getCurrentUser, getCustomerProfile } from "@/lib/auth-client"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { CartItem } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { isPaymentFallbackEnabled, getPaymentFallbackSettings } from "@/app/actions/payment-fallback"

interface CustomerWallet {
  id: string
  label: string
  address: string
  currency: string
  is_primary: boolean
  has_pin: boolean
  has_password: boolean
  has_biometric: boolean
  has_hardware_key: boolean
  securityType: 'pin' | 'password' | 'biometric' | 'hardware_key' | 'none'
}

interface StreamlinedCheckoutProps {
  total: number
  discount?: number
  promoCode?: string
  discountCodeId?: string
  assignedDiscountId?: string
  // For fixed amount discounts (not percentage) - takes precedence
  fixedDiscountAmount?: number
  // External shipping address - when provided, component uses this instead of internal state
  shippingAddress?: Omit<ShippingAddress, "id"> | null
  onShippingChange?: (address: Omit<ShippingAddress, "id"> | null) => void
}

type CheckoutStep = 'shipping' | 'payment'

export function StreamlinedCryptoCheckout({ 
  total, 
  discount = 0, 
  promoCode, 
  discountCodeId, 
  assignedDiscountId, 
  fixedDiscountAmount,
  shippingAddress: externalShippingAddress,
  onShippingChange 
}: StreamlinedCheckoutProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [internalShippingAddress, setInternalShippingAddress] = useState<Omit<ShippingAddress, "id"> | null>(null)
  
  // Use external shipping if provided, otherwise use internal
  const shippingAddress = externalShippingAddress !== undefined ? externalShippingAddress : internalShippingAddress
  const handleShippingChange = (address: Omit<ShippingAddress, "id"> | null) => {
    if (onShippingChange) {
      onShippingChange(address)
    } else {
      setInternalShippingAddress(address)
    }
  }
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [merchantWallet, setMerchantWallet] = useState<{ address: string; id: string } | null>(null)
  
  // Express Checkout State
  const [primaryWallet, setPrimaryWallet] = useState<CustomerWallet | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [securityPin, setSecurityPin] = useState('')
  const [securityPassword, setSecurityPassword] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const supabase = getSupabaseBrowserClient()
  
  // Payment Fallback Mode State
  const [isPaymentFallbackMode, setIsPaymentFallbackMode] = useState(false)
  const [fallbackMessage, setFallbackMessage] = useState('')
  const [isLoadingFallbackStatus, setIsLoadingFallbackStatus] = useState(true)
  const [isCreatingInvoiceOrder, setIsCreatingInvoiceOrder] = useState(false)
  const [invoiceOrderSuccess, setInvoiceOrderSuccess] = useState(false)
  
  // Calculate discount amount - use fixed amount if provided, otherwise percentage
  const discountAmount = fixedDiscountAmount !== undefined 
    ? Math.min(fixedDiscountAmount, total)  // Cap at total for fixed amounts
    : (discount ? (total * (discount / 100)) : 0)
  const finalTotal = total - discountAmount

  // Check if payment fallback mode is enabled
  useEffect(() => {
    async function checkFallbackMode() {
      try {
        const settings = await getPaymentFallbackSettings()
        if (settings?.payment_fallback_enabled) {
          setIsPaymentFallbackMode(true)
          setFallbackMessage(settings.payment_fallback_message || 'Payment processing is temporarily unavailable. An invoice will be sent to your email.')
        }
      } catch (error) {
        console.error('Failed to check payment fallback mode:', error)
      } finally {
        setIsLoadingFallbackStatus(false)
      }
    }
    checkFallbackMode()
  }, [])

  // Fetch primary wallet for express checkout
  useEffect(() => {
    async function fetchPrimaryWallet() {
      try {
        const response = await fetch('/api/customer-wallet/primary')
        const data = await response.json()
        if (data.success && data.wallet) {
          setPrimaryWallet(data.wallet)
        }
      } catch (error) {
        console.log('No wallet found for express checkout')
      } finally {
        setIsLoadingWallet(false)
      }
    }
    fetchPrimaryWallet()
  }, [])

  // Handle Express Checkout
  const handleExpressCheckout = async () => {
    if (!primaryWallet) return
    
    // Validate shipping first
    if (!shippingAddress?.name || !shippingAddress?.addressLine1 || !shippingAddress?.email) {
      setError("Please complete shipping information first")
      return
    }
    
    if (primaryWallet.securityType === 'none') {
      setVerificationError('Wallet has no security set up. Please secure your wallet first.')
      return
    }

    // For biometric/hardware key, trigger WebAuthn
    if (primaryWallet.securityType === 'biometric' || primaryWallet.securityType === 'hardware_key') {
      try {
        setIsVerifying(true)
        const authOptions = await fetch('/api/customer-wallet/webauthn/auth-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: primaryWallet.id })
        }).then(r => r.json())

        if (authOptions.error) {
          setShowSecurityModal(true)
          setIsVerifying(false)
          return
        }

        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: Uint8Array.from(atob(authOptions.challenge), c => c.charCodeAt(0)),
            rpId: authOptions.rpId || window.location.hostname,
            allowCredentials: authOptions.allowCredentials?.map((cred: any) => ({
              id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
              type: 'public-key'
            })),
            timeout: 60000,
            userVerification: 'required'
          }
        })

        if (credential) {
          await processExpressPayment(true)
        }
      } catch (error) {
        console.error('WebAuthn error:', error)
        setShowSecurityModal(true)
      } finally {
        setIsVerifying(false)
      }
    } else {
      setShowSecurityModal(true)
    }
  }

  // Verify PIN/Password and process payment
  const handleSecurityVerify = async () => {
    if (!primaryWallet) return
    
    setIsVerifying(true)
    setVerificationError(null)

    try {
      const response = await fetch('/api/customer-wallet/verify-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: primaryWallet.id,
          pin: securityPin || undefined,
          password: securityPassword || undefined
        })
      })

      const data = await response.json()

      if (data.verified) {
        await processExpressPayment(false)
      } else {
        setVerificationError(data.error || 'Verification failed')
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Process the express payment
  const processExpressPayment = async (webAuthnVerified: boolean) => {
    if (!primaryWallet || !shippingAddress) {
      console.log('[ExpressPayment] Missing wallet or shipping:', { primaryWallet: !!primaryWallet, shippingAddress: !!shippingAddress })
      return
    }

    console.log('[ExpressPayment] Starting payment process...')
    setIsProcessingPayment(true)
    setShowSecurityModal(false)
    setVerificationError(null)

    try {
      // Create the order with shipping info
      console.log('[ExpressPayment] Getting current user...')
      const user = await getCurrentUser()
      const userEmail = shippingAddress.email || user?.email || ''
      const nameParts = shippingAddress.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      console.log('[ExpressPayment] Creating order...')
      console.log('[ExpressPayment] Discount info:', { discountCodeId, discountAmount, finalTotal })
      const orderData = await orderService.createOrder({
        items: items.map((item: any) => ({
          product_id: item.product?.barcode || item.product_id,
          quantity: item.quantity,
          unit_price: parseFloat(item.product?.display_price || item.product?.retail_price || '0')
        })),
        shipping_address: {
          line1: shippingAddress.addressLine1,
          line2: shippingAddress.addressLine2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zipCode,
          country: shippingAddress.country || 'United States'
        },
        customer_info: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail
        },
        discount_code_id: discountCodeId,
        discount_amount: discountAmount,
        payment_method: `wallet_${primaryWallet.currency.toLowerCase()}`
      })

      console.log('[ExpressPayment] Order response:', orderData)
      
      if (!orderData.order?.id) {
        console.error('[ExpressPayment] No order ID in response')
        throw new Error('Failed to create order')
      }

      const createdOrderId = orderData.order.id
      console.log('[ExpressPayment] Order created:', createdOrderId)

      // Process payment
      console.log('[ExpressPayment] Processing wallet payment...')
      const paymentResponse = await fetch('/api/customer-wallet/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: primaryWallet.id,
          orderId: createdOrderId,
          amount: finalTotal,
          currency: primaryWallet.currency,
          pin: securityPin || undefined,
          password: securityPassword || undefined,
          webAuthnVerified
        })
      })

      console.log('[ExpressPayment] Payment response status:', paymentResponse.status)
      const paymentData = await paymentResponse.json()
      console.log('[ExpressPayment] Payment data:', paymentData)

      if (paymentData.success) {
        setPaymentSuccess(true)
        clearCart()
        
        // Redirect to payment verification page with transaction hash
        // The existing verification flow will handle blockchain confirmation
        setTimeout(() => {
          if (paymentData.transactionHash) {
            // Real blockchain transaction - go to payment status for verification
            router.push(`/payment-status/${createdOrderId}?tx=${paymentData.transactionHash}`)
          } else {
            // Fallback to order confirmation
            router.push(`/order-confirmation?orderId=${createdOrderId}`)
          }
        }, 2000)
      } else {
        // If biometric was verified, just show error (don't show PIN modal)
        if (webAuthnVerified) {
          setError(paymentData.error || paymentData.details || 'Payment failed. Please try again.')
        } else {
          // For PIN/password, show error in modal
          setVerificationError(paymentData.error || 'Payment failed')
          setShowSecurityModal(true)
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      // If biometric was verified, just show error (don't show PIN modal)
      if (webAuthnVerified) {
        setError('Payment failed. Please try again.')
      } else {
        setVerificationError('Payment failed. Please try again.')
        setShowSecurityModal(true)
      }
    } finally {
      setIsProcessingPayment(false)
      setSecurityPin('')
      setSecurityPassword('')
    }
  }

  // Get security icon for wallet
  const getSecurityIcon = () => {
    if (!primaryWallet) return null
    switch (primaryWallet.securityType) {
      case 'biometric': return <Fingerprint className="w-5 h-5" />
      case 'hardware_key': return <Shield className="w-5 h-5" />
      case 'pin': return <Lock className="w-5 h-5" />
      case 'password': return <Shield className="w-5 h-5" />
      default: return <Wallet className="w-5 h-5" />
    }
  }

  // Load merchant wallet when component mounts
  useEffect(() => {
    const loadMerchantWallet = async () => {
      try {
        const profile = await getCustomerProfile()
        if (profile?.default_wallet_id) {
            const { data: wallet } = await supabase
              .from('business_wallets')
              .select('id, address')
            .eq('id', profile.default_wallet_id)
              .single()
            
            if (wallet) {
              setMerchantWallet(wallet)
          }
        }
      } catch (error) {
        console.error('Failed to load merchant wallet:', error)
      }
    }
    loadMerchantWallet()
  }, [])

  // Create order and prepare payment
  const createOrderAndPrepare = async () => {
    setError(null)
    
    if (!shippingAddress?.name || !shippingAddress?.addressLine1 || !shippingAddress?.email) {
      setError("Please complete shipping information")
      return false
    }

    try {
      setIsCreatingOrder(true)

      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (!user && !isDevelopment) {
        setError("Please log in")
        return false
      }

      const userEmail = shippingAddress.email || user?.email || 'test@example.com'
      const nameParts = shippingAddress.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create order
      console.log('[Checkout] Cart items:', items)
      
      const orderData = await orderService.createOrder({
        items: items.map((item: any) => ({
          product_id: item.product_id,  // This is already the barcode from cart_items
          quantity: item.quantity,
          unit_price: parseFloat(item.product?.display_price || item.product?.retail_price || '0')
        })),
        shipping_address: {
          line1: shippingAddress.addressLine1,
          line2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip || shippingAddress.zipCode || '',
          country: shippingAddress.country || 'USA'
        },
        customer_info: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: shippingAddress.phone || shippingAddress.phoneNumber || undefined
        },
        discount_code_id: discountCodeId,
        discount_amount: discountAmount,  // Already calculated with proper fixed/percentage handling
        payment_method: 'crypto',
        notes: undefined
      })

      // Use the wallet assigned by the order API
      const merchantWallet = orderData.wallet
      
      if (!merchantWallet || !merchantWallet.address) {
        throw new Error('No merchant wallet assigned. Please contact support.')
      }
      
      console.log('[Checkout] Using merchant wallet:', merchantWallet.label, merchantWallet.address)
      setMerchantWallet({ address: merchantWallet.address, id: merchantWallet.id })
      setOrderId(orderData.order.id)
      
      return {
        orderId: orderData.order.id,
        merchantWallet: { address: merchantWallet.address, id: merchantWallet.id }
      }
    } catch (err: any) {
      console.error('[Checkout] Error:', err)
      // Check if it's an API error response
      if (err && err.error) {
        setError(err.error)
      } else {
        setError(err instanceof Error ? err.message : "Failed to create order")
      }
      return null
    } finally {
      setIsCreatingOrder(false)
    }
  }

  // Step 1: Shipping → Step 2
  const handleShippingComplete = async () => {
    // Prevent double-clicks
    if (isCreatingOrder) {
      console.log('[Checkout] Order creation already in progress, ignoring click')
      return
    }
    
    // Create order first, then go to payment hub
    const orderData = await createOrderAndPrepare()
    if (orderData) {
      console.log('[Checkout] Order created, navigating to payment hub:', orderData.orderId)
      // Navigate to full-page payment hub
      const params = new URLSearchParams({
        orderId: orderData.orderId,
        total: finalTotal.toString(),
        wallet: orderData.merchantWallet.address
      })
      router.push(`/payment?${params.toString()}`)
    }
  }

  // Handle payment completion from PaymentHub
  const handlePaymentComplete = async (method: string) => {
    // Order already created in handleShippingComplete
    // Just redirect to payment verification page
    if (orderId) {
      router.push(`/payment-status/${orderId}`)
    } else {
      setError("Order not found. Please try again.")
    }
  }

  // Handle back to shipping from payment hub
  const handleBackToShipping = () => {
    setCurrentStep('shipping')
  }

  // Handle Invoice Order (Payment Fallback Mode)
  const handleInvoiceOrder = async () => {
    setError(null)
    
    if (!shippingAddress?.name || !shippingAddress?.addressLine1 || !shippingAddress?.email) {
      setError("Please complete shipping information including email")
      return
    }

    try {
      setIsCreatingInvoiceOrder(true)

      const user = await getCurrentUser()
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (!user && !isDevelopment) {
        setError("Please log in")
        return
      }

      const userEmail = shippingAddress.email || user?.email || ''
      if (!userEmail) {
        setError("Email is required for invoice orders")
        return
      }
      
      const nameParts = shippingAddress.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create order with payment_method = 'invoice'
      // This will trigger the Supabase edge function to send a Shopify invoice
      const orderData = await orderService.createOrder({
        items: items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: parseFloat(item.product?.display_price || item.product?.retail_price || '0')
        })),
        shipping_address: {
          line1: shippingAddress.addressLine1,
          line2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip || shippingAddress.zipCode || '',
          country: shippingAddress.country || 'USA'
        },
        customer_info: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: shippingAddress.phone || shippingAddress.phoneNumber || undefined
        },
        discount_code_id: discountCodeId,
        discount_amount: discountAmount,
        payment_method: 'invoice',  // This triggers the Shopify invoice flow
        notes: 'Payment fallback - Invoice will be sent via Shopify'
      })

      console.log('[InvoiceOrder] Order created:', orderData.order?.id)
      
      // Clear cart and show success
      clearCart()
      setInvoiceOrderSuccess(true)
      
      // Redirect to order confirmation after a moment
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderData.order.id}&invoice=true`)
      }, 3000)

    } catch (err: any) {
      console.error('[InvoiceOrder] Error:', err)
      setError(err instanceof Error ? err.message : "Failed to create order")
    } finally {
      setIsCreatingInvoiceOrder(false)
    }
  }

  // Step 2: Wallet Setup → Step 3
  // handleWalletSetupComplete removed - now handled by PaymentHub

  // Step 3: Execute Payment
  const handlePayment = async (paymentType: 'USDC' | 'ETH') => {
    if (!orderId || !merchantWallet) {
      setError("Order not ready. Please try again.")
      return
    }

    try {
      // Initiate payment
      const paymentData = await orderService.initiatePayment(
        orderId,
        merchantWallet.id,
        paymentType
      )

      if (paymentType === 'USDC') {
        // IMPORTANT: Most mobile wallets don't support ERC-20 via ethereum: URLs
        // Instead, show instructions for manual USDC transfer
        setError("USDC payment requires manual setup. Use WalletConnect or show payment instructions.")
        
        // For now, redirect to payment instructions page
        router.push(`/payment-instructions?orderId=${orderId}&amount=${finalTotal}&token=USDC&address=${merchantWallet.address}`)
        return
      }

      // ETH payment - this works reliably
      const ethAmount = parseFloat(paymentData.ethAmount || '0')
      const amountInWei = Math.floor(ethAmount * 1e18).toString()
      
      // Simple ethereum transfer URL (widely supported)
      const paymentUrl = `ethereum:${merchantWallet.address}@1?value=${amountInWei}`
      
      console.log('[Payment Debug] ETH Payment:', {
        recipient: merchantWallet.address,
        amountETH: ethAmount,
        amountWei: amountInWei,
        url: paymentUrl
      })

      console.log('[Payment] Opening wallet with URL:', paymentUrl)
      
      // Detect mobile vs desktop
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Mobile: Use location.href for better deep linking
        window.location.href = paymentUrl
      } else {
        // Desktop: Open in new tab
        window.open(paymentUrl, '_blank')
        
        // Redirect to payment status page - cart will be cleared there after verification
        setTimeout(() => {
          router.push(`/payment-status/${orderId}`)
        }, 2000)
      }
      
    } catch (err) {
      console.error('[Payment] Error:', err)
      setError(err instanceof Error ? err.message : "Payment failed")
    }
  }

  // When external shipping is provided, we're in "payment only" mode
  const isPaymentOnlyMode = externalShippingAddress !== undefined

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Indicator - only show when NOT in payment-only mode */}
      {!isPaymentOnlyMode && (
        <div className="flex items-center justify-between mb-8">
          <StepIndicator 
            step={1} 
            label="Shipping" 
            active={currentStep === 'shipping'} 
            completed={currentStep !== 'shipping'}
          />
          <div className="flex-1 h-px bg-border mx-2" />
          <StepIndicator 
            step={2} 
            label="Payment" 
            active={currentStep === 'payment'} 
            completed={false}
          />
        </div>
      )}

      {/* STEP 1: SHIPPING - only show form when NOT in payment-only mode */}
      {currentStep === 'shipping' && (
        <>
          {!isPaymentOnlyMode && (
            <Card className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                <ShippingAddressForm onAddressChange={handleShippingChange} />
              </CardContent>
            </Card>
          )}

          {/* Payment Options Header - only show in payment-only mode */}
          {isPaymentOnlyMode && (
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">Payment</h3>
          )}

          {/* EXPRESS CHECKOUT - DISABLED FOR NOW, KEEP FOR LATER USE
          {!isLoadingWallet && primaryWallet && (
            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)] border border-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Express Checkout</h3>
                    <p className="text-sm text-foreground/60">Pay instantly with your wallet</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleExpressCheckout}
                  disabled={isVerifying || isProcessingPayment || !shippingAddress?.name || !shippingAddress?.addressLine1}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-lg rounded-xl relative overflow-hidden group"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isVerifying || isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isProcessingPayment ? 'Processing Payment...' : 'Verifying...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Pay ${finalTotal.toFixed(2)} Now
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                  {getSecurityIcon()}
                  <span>{primaryWallet.label} ({primaryWallet.currency})</span>
                </div>
              </CardContent>
            </Card>
          )}
          */}

          {/* WALLET SETUP PROMPT - DISABLED FOR NOW, KEEP FOR LATER USE
          {!isLoadingWallet && !primaryWallet && (
            <Card className="border-0 bg-foreground/[0.04] backdrop-blur-xl rounded-2xl border border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium text-foreground">Want faster checkout?</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up a crypto wallet for one-tap express checkout
                </p>
                <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" asChild>
                  <Link href="/wallet">Set Up Wallet</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          */}

          {/* Payment Fallback Mode Notice */}
          {isPaymentFallbackMode && !isLoadingFallbackStatus && (
            <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)] border border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Invoice Payment</h3>
                    <p className="text-sm text-foreground/60">Your payment link will be sent via email</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <p className="text-sm text-amber-200">{fallbackMessage}</p>
                </div>

                <div className="space-y-2 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Your order will be created and saved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>A secure payment invoice will be emailed to you</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Pay at your convenience via the invoice link</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Order Success Overlay */}
          <AnimatePresence>
            {invoiceOrderSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Mail className="w-12 h-12 text-amber-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Order Created!</h2>
                  <p className="text-muted-foreground mb-2">A payment invoice has been sent to your email</p>
                  <p className="text-sm text-zinc-500 mb-4">Please check your inbox for the payment link</p>
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue to Payment Button OR Submit Invoice Order Button */}
          {isPaymentFallbackMode ? (
            <Button
              onClick={handleInvoiceOrder}
              className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-semibold text-lg rounded-xl"
              size="lg"
              disabled={!shippingAddress?.name || !shippingAddress?.addressLine1 || !shippingAddress?.email || isCreatingInvoiceOrder}
            >
              {isCreatingInvoiceOrder ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Submit Order & Send Invoice
                </>
              )}
            </Button>
          ) : (
          <Button
            onClick={handleShippingComplete}
            className="w-full h-14 bg-white hover:bg-card/90 text-black font-semibold text-lg rounded-xl"
            size="lg"
            disabled={!shippingAddress?.name || !shippingAddress?.addressLine1 || isCreatingOrder}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Order...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          )}
        </>
      )}

      {/* Security Verification Modal */}
      <AnimatePresence>
        {showSecurityModal && primaryWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSecurityModal(false)
              setSecurityPin('')
              setSecurityPassword('')
              setVerificationError(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getSecurityIcon()}
                  <h2 className="text-xl font-bold text-foreground">Verify to Pay</h2>
                </div>
                <button
                  onClick={() => {
                    setShowSecurityModal(false)
                    setSecurityPin('')
                    setSecurityPassword('')
                    setVerificationError(null)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-foreground font-semibold text-2xl mb-1">${finalTotal.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">from {primaryWallet.label}</p>
              </div>

              {/* PIN Input */}
              {primaryWallet.has_pin && (
                <div className="mb-4">
                  <label className="text-sm text-muted-foreground mb-2 block">Enter your PIN</label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="bg-background border-border text-foreground text-center text-2xl tracking-[0.5em] h-14"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && securityPin) {
                        handleSecurityVerify()
                      }
                    }}
                  />
                </div>
              )}

              {/* Password Input */}
              {primaryWallet.has_password && !primaryWallet.has_pin && (
                <div className="mb-4">
                  <label className="text-sm text-muted-foreground mb-2 block">Enter your password</label>
                  <Input
                    type="password"
                    value={securityPassword}
                    onChange={(e) => setSecurityPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-background border-border text-foreground h-14"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && securityPassword) {
                        handleSecurityVerify()
                      }
                    }}
                  />
                </div>
              )}

              {/* Error Message */}
              {verificationError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {verificationError}
                </div>
              )}

              <Button
                onClick={handleSecurityVerify}
                disabled={isVerifying || (!securityPin && !securityPassword)}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                Your wallet is secured with {primaryWallet.securityType === 'pin' ? 'PIN' : 'password'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Success Overlay */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-emerald-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">Redirecting to your order...</p>
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment hub removed - navigation to full-page payment hub happens after order creation */}
    </div>
  )
}

function StepIndicator({ step, label, active, completed }: { 
  step: number
  label: string
  active: boolean
  completed: boolean 
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
        ${completed ? 'bg-green-600 text-white' : active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
      `}>
        {completed ? <CheckCircle2 className="h-5 w-5" /> : step}
      </div>
      <span className={`text-xs mt-2 ${active ? 'font-semibold' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  )
}
