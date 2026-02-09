"use client"

import { useSearchParams } from "next/navigation"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ExternalLink, Home, Copy, Check, Wallet, Loader2, Mail, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { TransactionVerifier } from "@/components/transaction-verifier"
import { useOrderStore } from "@/lib/order-store"
import Image from "next/image"

const MERCHANT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

interface OrderDetails {
  id: string
  order_number: string
  total_amount: number
  subtotal: number
  discount_amount: number
  payment_status: string
  payment_method: string
  payment_reference: string
  created_at: string
  items: Array<{
    id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const txHash = searchParams.get("tx")
  const orderId = searchParams.get("orderId")
  const isInvoiceOrder = searchParams.get("invoice") === "true"
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dbOrder, setDbOrder] = useState<OrderDetails | null>(null)
  const [isExpressCheckout, setIsExpressCheckout] = useState(false)

  const { getOrderByTxHash, currentOrder } = useOrderStore()
  const [order, setOrder] = useState(currentOrder)

  // Fetch order from database for express checkout or invoice orders
  useEffect(() => {
    async function fetchOrderDetails() {
      if (orderId && !txHash) {
        setLoading(true)
        if (!isInvoiceOrder) {
        setIsExpressCheckout(true)
        }
        try {
          const response = await fetch(`/api/order-details?id=${orderId}`)
          const data = await response.json()
          if (data && !data.error) {
            setDbOrder(data)
          }
        } catch (error) {
          console.error('Error fetching order:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchOrderDetails()
  }, [orderId, txHash, isInvoiceOrder])

  // For blockchain tx payments, use the store
  useEffect(() => {
    if (txHash && !order) {
      const foundOrder = getOrderByTxHash(txHash)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [txHash, order, getOrderByTxHash])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tokenSymbol = "ETH"

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isInvoiceOrder ? 'bg-amber-500/20' : 'bg-green-500/20'} mb-4`}>
            {isInvoiceOrder ? (
              <Mail className="h-8 w-8 text-amber-500" />
            ) : (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isInvoiceOrder ? "Order Created!" : isExpressCheckout ? "Payment Successful!" : "Order Confirmed!"}
          </h1>
          <p className="text-muted-foreground">
            {isInvoiceOrder ? "Your payment invoice is being sent to your email" : "Thank you for your purchase"}
          </p>
        </div>

        {/* Invoice Order Summary */}
        {isInvoiceOrder && dbOrder && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Order #{dbOrder.order_number}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Invoice Pending
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {dbOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium">${item.total_price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t space-y-2">
                  {dbOrder.discount_amount > 0 && (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${dbOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span>-${dbOrder.discount_amount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Due</span>
                    <span>${dbOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Payment Invoice
                </CardTitle>
                <CardDescription>An invoice has been sent to your email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-500">Check Your Inbox</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        A secure payment link has been sent to your email. Click the link to complete your payment at your convenience.
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Your order will be processed once payment is received. The payment link is valid for 7 days.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* What's Next for Invoice Orders */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-semibold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Check Your Email</h4>
                    <p className="text-sm text-muted-foreground">Open the invoice email we just sent you</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Complete Payment</h4>
                    <p className="text-sm text-muted-foreground">Click the payment link and pay securely</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">Once paid, we'll prepare your items for shipment</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Shipping Notification</h4>
                    <p className="text-sm text-muted-foreground">You'll receive tracking information via SMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Express Checkout Order Summary (from database) */}
        {isExpressCheckout && !isInvoiceOrder && dbOrder && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Order #{dbOrder.order_number}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Paid
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {dbOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium">${item.total_price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t space-y-2">
                  {dbOrder.discount_amount > 0 && (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${dbOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span>-${dbOrder.discount_amount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span>${dbOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details for Express Checkout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>Paid via Express Checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-500">Payment Complete</p>
                      <p className="text-sm text-muted-foreground">
                        {dbOrder.payment_method?.replace('wallet_', '').toUpperCase()} Wallet
                      </p>
                    </div>
                  </div>
                </div>

                {dbOrder.payment_reference && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="text-sm text-muted-foreground mb-2">Payment Reference</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono break-all flex-1">{dbOrder.payment_reference}</code>
                      <Button size="icon" variant="ghost" className="shrink-0" onClick={() => handleCopy(dbOrder.payment_reference)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What's Next for Express Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-500 font-semibold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Payment Verified</h4>
                    <p className="text-sm text-muted-foreground">Your payment has been confirmed instantly</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">We're preparing your items for shipment</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Shipping Notification</h4>
                    <p className="text-sm text-muted-foreground">You'll receive tracking information via SMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Regular Blockchain Order Summary (from store) */}
        {!isExpressCheckout && order && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Items purchased in this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <div className="text-right">
                    <div>${order.total.toFixed(2)}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {(order.total / 3000).toFixed(6)} {tokenSymbol}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {txHash && order && (
          <TransactionVerifier
            transactionHash={txHash}
            expectedRecipient={MERCHANT_ADDRESS}
            expectedAmount={order.total.toString()}
          />
        )}

        {txHash && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Your payment has been submitted to the Ethereum network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="text-sm text-muted-foreground mb-2">Transaction Hash</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono break-all flex-1">{txHash}</code>
                  <Button size="icon" variant="ghost" className="shrink-0" onClick={() => handleCopy(txHash)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Your transaction is being processed on the blockchain. This typically takes 1-5 minutes to confirm.
                </AlertDescription>
              </Alert>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  View on Etherscan
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {!isExpressCheckout && order && (
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-1">Transaction Confirmation</h4>
                  <p className="text-sm text-muted-foreground">Your payment is being verified on the blockchain</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-1">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">We'll prepare your items for shipment</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-1">Shipping Notification</h4>
                  <p className="text-sm text-muted-foreground">You'll receive tracking information via email</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button className="flex-1" size="lg" variant="outline" asChild>
            <a href={process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl}>
              <Home className="h-4 w-4 mr-2" />
              Return to Shop
            </a>
          </Button>
          <Button className="flex-1" size="lg" asChild>
            <Link href="/cart">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
