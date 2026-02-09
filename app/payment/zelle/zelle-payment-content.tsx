"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import Link from "next/link"
import Image from "next/image"

interface ZellePaymentContentProps {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
  orderDetails?: {
    subtotal: number
    shipping_amount: number
    items: Array<{
      id: string
      product_name: string
      quantity: number
      unit_price: number
      total_price: number
    }>
    shipping_address: {
      line1: string
      city: string
      state: string
      zip: string
      country: string
    }
    customer_name: string
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
}

export function ZellePaymentContent({
  orderTotal,
  merchantWallet,
  orderId,
  onPaymentComplete,
  orderDetails,
  isLoading,
  isProcessingPayment,
  debugLog
}: ZellePaymentContentProps) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [copiedOrderId, setCopiedOrderId] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  const zelleEmail = siteConfig.paymentsEmail

  const copyToClipboard = async (text: string, type: "email" | "amount" | "orderId") => {
    await navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else if (type === "amount") {
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 2000)
    } else {
      setCopiedOrderId(true)
      setTimeout(() => setCopiedOrderId(false), 2000)
    }
  }

  const handlePaymentSent = () => {
    setPaymentSent(true)
    // For Zelle, we can't verify automatically, just mark as pending
    setTimeout(() => {
      onPaymentComplete()
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <Link
          href="/payment"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Options
        </Link>

        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/zelle-logo.svg"
              alt="Zelle"
              width={200}
              height={80}
              className="h-auto w-[200px] object-contain"
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Pay with Zelle</h1>
          <p className="text-lg text-muted-foreground">Follow these steps to complete your payment</p>
        </div>

        {!paymentSent && !isProcessingPayment ? (
          <div className="space-y-6">
            {/* Order Summary */}
            {orderDetails && (
              <div className="rounded-lg border border-foreground/20 bg-card p-8">
                <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>
                
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product_name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">${item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                  {orderDetails.shipping_amount > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span>Shipping</span>
                      <span className="font-medium">${orderDetails.shipping_amount.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetails.discount_details && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({orderDetails.discount_details.code})</span>
                      <span className="font-medium">-${orderDetails.discount_details.amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-foreground/20 bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Payment Instructions</h2>

              <div className="space-y-6">
                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Step 1: Open Zelle</h3>
                  <p className="text-sm text-muted-foreground">Open your banking app and navigate to Zelle</p>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Step 2: Enter Recipient</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Send to this email:</p>
                      <code className="block break-all text-sm font-medium">{zelleEmail}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(zelleEmail, "email")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Step 3: Enter Amount</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-3xl font-bold">${orderTotal.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(orderTotal.toString(), "amount")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedAmount ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Step 4: Add Note (Required)</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Include your order number:</p>
                      <code className="block break-all text-sm font-medium">Order #{orderId}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`Order #${orderId}`, "orderId")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedOrderId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Step 5: Send Payment</h3>
                  <p className="text-sm text-muted-foreground">Review the details and confirm your payment</p>
                </div>
              </div>

              <button
                onClick={handlePaymentSent}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                I've Sent the Payment
              </button>
            </div>
          </div>
        ) : isProcessingPayment ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8 text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">Processing Payment...</h2>
            <p className="mb-6 text-muted-foreground">
              We're updating your order status. You'll receive a confirmation once we verify the payment.
            </p>
            <p className="text-sm text-muted-foreground">Order #{orderId}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-foreground/20 bg-card p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold">Payment Submitted!</h2>
            <p className="mb-6 text-muted-foreground">
              Thank you for your payment. We'll verify it within 1-2 business days and send you a confirmation email.
            </p>
            <p className="text-sm text-muted-foreground mb-6">Order #{orderId}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
