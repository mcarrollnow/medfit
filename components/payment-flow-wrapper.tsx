"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { orderService } from "@/lib/order-service"
import { useCartStore } from "@/lib/cart-store"
import { getCustomerProfile } from "@/lib/auth-client"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface ShippingAddress {
  line1: string
  city: string
  state: string
  zip: string
  country: string
}

interface PaymentFlowWrapperProps {
  children: (props: {
    orderTotal: number
    merchantWallet: string
    orderId: string
    onPaymentComplete: () => void
    // Complete order data for display
    orderDetails?: {
      subtotal: number
      shipping_amount: number
      items: OrderItem[]
      shipping_address: ShippingAddress
      customer_name: string
      customer_email: string
      discount_details?: {
        code: string
        amount: number
        description: string
      }
      payment_status: string
      payment_method: string
    }
    isLoading: boolean
    isProcessingPayment: boolean
    debugLog: string[]
  }) => React.ReactNode
}

export function PaymentFlowWrapper({ children }: PaymentFlowWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  
  const [orderTotal, setOrderTotal] = useState(0)
  const [merchantWallet, setMerchantWallet] = useState("")
  const [orderId, setOrderId] = useState("")
  const [orderDetails, setOrderDetails] = useState<{
    subtotal: number
    shipping_amount: number
    items: OrderItem[]
    shipping_address: ShippingAddress
    customer_name: string
    customer_email: string
    discount_details?: {
      code: string
      amount: number
      description: string
    }
    payment_status: string
    payment_method: string
  } | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [debugLog, setDebugLog] = useState<string[]>([])
  
  const addDebugLog = (message: string) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const total = parseFloat(searchParams.get("total") || "0")
    const wallet = searchParams.get("wallet") || ""
    const id = searchParams.get("orderId") || ""

    console.log("[PaymentFlowWrapper] URL params:", {
      orderId: id,
      total: total,
      wallet: wallet,
      searchParamsString: searchParams.toString()
    })

    if (!id || !wallet || total === 0) {
      console.log("[PaymentFlowWrapper] Missing required params, redirecting to checkout")
      router.push("/checkout")
      return
    }

    console.log("[PaymentFlowWrapper] Valid params found, setting data")
    setOrderTotal(total)
    setMerchantWallet(wallet)
    setOrderId(id)
    
    // Fetch complete order details
    fetchOrderDetails(id)
  }, [searchParams, router])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setIsLoading(true)
      console.log("[PaymentFlowWrapper] Fetching complete order details for:", orderId)
      
      const fullOrderData = await orderService.getOrderDetails(orderId)
      console.log("[PaymentFlowWrapper] Complete order data received:", fullOrderData)
      
      // Transform data to match our interface
      const orderDetailsData = {
        subtotal: fullOrderData.subtotal,
        shipping_amount: fullOrderData.shipping_amount,
        items: fullOrderData.items,
        customer_name: fullOrderData.customer_name || 'Customer',
        customer_email: fullOrderData.customer_email || '',
        shipping_address: {
          line1: fullOrderData.shipping_address_line1,
          city: fullOrderData.shipping_city,
          state: fullOrderData.shipping_state,
          zip: fullOrderData.shipping_zip,
          country: fullOrderData.shipping_country || 'USA'
        },
        discount_details: fullOrderData.discount_details,
        payment_status: fullOrderData.payment_status,
        payment_method: fullOrderData.payment_method
      }
      
      setOrderDetails(orderDetailsData)
      console.log("[PaymentFlowWrapper] Order details set:", orderDetailsData)
      
    } catch (error) {
      console.error("[PaymentFlowWrapper] Error fetching order details:", error)
      // Continue without full details - wallet components will show placeholders
      setOrderDetails(undefined)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentComplete = async () => {
    try {
      setIsProcessingPayment(true)
      addDebugLog("🚀 Payment completed, starting verification...")
      addDebugLog(`Order ID: ${orderId}`)
      console.log("[PaymentFlowWrapper] 🚀 Payment completed, initiating payment processing...")
      console.log("[PaymentFlowWrapper] Order ID:", orderId)
      
      // Step 1: Use the wallet that was assigned to this order
      addDebugLog("Step 1: Using order's assigned wallet...")
      console.log("[PaymentFlowWrapper] Step 1: Using wallet from order assignment...")
      
      // merchantWallet is passed from the payment page URL params
      // This is the wallet the order was assigned to and where payment should go
      if (!merchantWallet) {
        addDebugLog("❌ ERROR: No merchant wallet specified")
        console.error("[PaymentFlowWrapper] ❌ No merchant wallet in URL params")
        throw new Error("Merchant wallet not specified for this order")
      }
      
      addDebugLog(`✅ Using order's assigned wallet: ${merchantWallet}`)
      console.log("[PaymentFlowWrapper] ✅ Order's assigned wallet address:", merchantWallet)
      
      // Step 2: Get order details
      console.log("[PaymentFlowWrapper] Step 2: Getting order details...")
      const orderDetails = await orderService.getOrder(orderId)
      console.log("[PaymentFlowWrapper] ✅ Order details retrieved:", {
        id: orderDetails.id,
        order_number: orderDetails.order_number,
        payment_status: orderDetails.payment_status,
        assigned_wallet_id: orderDetails.assigned_wallet_id
      })

      // Step 3: Get the wallet details from the order
      console.log("[PaymentFlowWrapper] Step 3: Getting wallet details for order...")
      const walletResponse = await orderService.getAssignedWallet(orderDetails.order_number)
      console.log("[PaymentFlowWrapper] ✅ Wallet response:", walletResponse)
      
      if (!walletResponse?.wallet?.id) {
        throw new Error("No wallet assigned to this order")
      }
      
      // Step 4: Use the ORDER'S assigned wallet for payment initiation
      addDebugLog("Step 4: Calling payment initiation API...")
      console.log("[PaymentFlowWrapper] Step 4: Initiating payment with order's assigned wallet...")
      console.log("[PaymentFlowWrapper] Using wallet ID:", walletResponse.wallet.id)
      console.log("[PaymentFlowWrapper] Wallet address:", walletResponse.wallet.address)
      console.log("[PaymentFlowWrapper] API call parameters:", {
        orderId: orderId,
        walletId: walletResponse.wallet.id,
        currency: 'ETH'
      })
      
      // Initiate payment with the ORDER'S assigned wallet (where payment is actually going)
      const paymentResponse = await orderService.initiatePayment(
        orderId,
        walletResponse.wallet.id,  // Use the wallet assigned to the order
        'ETH' // Default to ETH, could make this dynamic based on payment method
      )
      addDebugLog("✅ Payment API succeeded!")
      console.log("[PaymentFlowWrapper] ✅ Payment initiated successfully:", paymentResponse)
      console.log("[PaymentFlowWrapper] 🎯 Order expects payment at:", walletResponse.wallet.address)
      
      // NOTE: Cart will be cleared by payment-status page after payment is verified
      // This allows users to go back and choose a different payment method if needed
      
      // Redirect to payment verification page
      console.log("[PaymentFlowWrapper] 🔄 Redirecting to payment verification...")
      setIsProcessingPayment(false)
      router.push(`/payment-status/${orderId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addDebugLog("❌ ERROR: Payment verification failed")
      addDebugLog(`Error: ${errorMessage}`)
      console.error("[PaymentFlowWrapper] ❌ Error initiating payment:", error)
      console.error("[PaymentFlowWrapper] Full error details:", JSON.stringify(error, null, 2))
      
      // Don't clear cart on error - allow user to try again or choose different method
      
      // Still redirect to verification in case of error
      setIsProcessingPayment(false)
      router.push(`/payment-status/${orderId}`)
    }
  }

  const handleBackToPaymentOptions = () => {
    // Navigate back to payment hub with order data
    const params = new URLSearchParams({
      orderId: orderId,
      total: orderTotal.toString(),
      wallet: merchantWallet
    })
    router.push(`/payment?${params.toString()}`)
  }

  if (!orderId) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <button
          onClick={handleBackToPaymentOptions}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Options
        </button>
        
        {children({
          orderTotal,
          merchantWallet,
          orderId,
          onPaymentComplete: handlePaymentComplete,
          orderDetails,
          isLoading,
          isProcessingPayment,
          debugLog
        })}

        {/* Debug Log - Visible on Mobile (Production enabled for debugging) */}
        {debugLog.length > 0 && (
          <div className="mt-8 p-4 bg-card text-green-400 rounded-lg font-mono text-sm">
            <h4 className="text-foreground mb-2 font-bold">Debug Log (Temporary):</h4>
            <div className="max-h-32 overflow-y-auto">
              {debugLog.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
