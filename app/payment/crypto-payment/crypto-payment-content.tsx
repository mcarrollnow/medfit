"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import QRCode from "react-qr-code"

interface CryptoPaymentContentProps {
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

export function CryptoPaymentContent({
  orderTotal,
  merchantWallet,
  orderId,
  onPaymentComplete,
  orderDetails,
  isLoading,
  isProcessingPayment,
  debugLog
}: CryptoPaymentContentProps) {
  const [copied, setCopied] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)
  const [ethAmount, setEthAmount] = useState("0.03") // Will be calculated
  
  // Calculate ETH amount (placeholder - should integrate real-time pricing)
  const ethPrice = 3000 // Placeholder
  const calculatedEthAmount = (orderTotal / ethPrice).toFixed(6)
  const ethAmountInWei = (Number.parseFloat(calculatedEthAmount) * 1e18).toString(16)

  // Generic Ethereum payment deep link
  const ethPaymentDeepLink = `ethereum:${merchantWallet}@1?value=${ethAmountInWei}`

  useEffect(() => {
    setEthAmount(calculatedEthAmount)
  }, [calculatedEthAmount])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMakePayment = async () => {
    const provider = (window as any).ethereum
    if (provider) {
      try {
        const accounts = await provider.request({ method: "eth_requestAccounts" })
        const transactionParameters = {
          to: merchantWallet,
          from: accounts[0],
          value: "0x" + ethAmountInWei,
        }
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        console.log("[CryptoPayment] Transaction sent:", txHash)
        setPaymentSent(true)
        // Call onPaymentComplete to trigger verification
        setTimeout(() => {
          onPaymentComplete()
        }, 2000)
      } catch (error) {
        console.error("[CryptoPayment] Error sending transaction:", error)
      }
    }
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
              src="/any-crypto-wallet-logo.svg"
              alt="Crypto Payment"
              width={300}
              height={80}
              className="h-auto w-[300px] object-contain"
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Complete Your Purchase</h1>
          <p className="text-lg text-muted-foreground">Send payment from your crypto wallet</p>
        </div>

        {!paymentSent && !isProcessingPayment ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Order Details</h2>

            {/* Order Items */}
            {orderDetails && orderDetails.items.length > 0 && (
              <div className="mb-6 rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Items</h3>
                <div className="space-y-2">
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
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {orderDetails && orderDetails.shipping_address && (
              <div className="mb-6 rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Shipping Address</h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{orderDetails.customer_name}</p>
                  {orderDetails.customer_email && (
                    <p className="text-muted-foreground">{orderDetails.customer_email}</p>
                  )}
                  <p>{orderDetails.shipping_address.line1}</p>
                  <p>
                    {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.zip}
                  </p>
                  <p>{orderDetails.shipping_address.country}</p>
                </div>
              </div>
            )}

            <div className="mb-8 space-y-6">
              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Order Total</h3>
                <div className="text-3xl font-bold">${orderTotal.toFixed(2)}</div>
                <div className="mt-2 text-lg text-muted-foreground">≈ {ethAmount} ETH</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  (Using estimated rate: $${ethPrice}/ETH)
                </p>
              </div>

              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Send To This Wallet</h3>
                <div className="flex items-center justify-between gap-3">
                  <code className="flex-1 break-all text-sm">{merchantWallet}</code>
                  <button
                    onClick={() => copyToClipboard(merchantWallet)}
                    className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* QR Code for mobile scanning */}
              <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                <div className="rounded-lg bg-white p-4">
                  <QRCode value={ethPaymentDeepLink} size={200} />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Scan with your mobile wallet
                  <br />
                  <span className="font-medium">{ethAmount} ETH</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleMakePayment}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Payment with MetaMask"
                )}
              </button>
              <a
                href={ethPaymentDeepLink}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent lg:hidden"
              >
                Open in Wallet App
              </a>
            </div>
          </div>
        ) : isProcessingPayment ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8 text-center">
            <div className="mb-6 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">Verifying Payment...</h2>
            <p className="mb-6 text-muted-foreground">
              Please wait while we confirm your transaction on the blockchain. This may take a few moments.
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
            <h2 className="mb-3 text-2xl font-bold">Payment Sent!</h2>
            <p className="mb-6 text-muted-foreground">
              Your transaction has been submitted. You'll receive a confirmation email once it's confirmed on the
              blockchain.
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
