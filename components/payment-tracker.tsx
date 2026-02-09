"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type PaymentStatus = "sent" | "processing" | "verifying" | "complete"

interface PaymentTrackerProps {
  orderId: string
  customerName?: string
  orderName?: string
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  priceDetails?: {
    subtotal: number
    shipping: number
    discount: number
    total: number
  }
  cryptoAmount?: {
    eth: string
    usd: number
  }
  transactionHash?: string | null
  fromWallet?: string | null
  toWallet?: string | null
  gasFee?: {
    eth: string
    usd: number
  }
  networkFee?: {
    eth: string
    usd: number
  }
}

const statusConfig = {
  sent: {
    label: "Sent",
    description: "Payment initiated",
  },
  processing: {
    label: "Processing",
    description: "Transaction processing",
  },
  verifying: {
    label: "Verifying",
    description: "Blockchain confirmation",
  },
  complete: {
    label: "Complete",
    description: "Payment confirmed",
  },
}

export function PaymentTracker({
  orderId,
  customerName = "John Doe",
  orderName = "Premium Product Bundle",
  shippingAddress = {
    name: "John Doe",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "USA",
  },
  priceDetails = {
    subtotal: 299.99,
    shipping: 15.0,
    discount: 30.0,
    total: 284.99,
  },
  cryptoAmount = {
    eth: "0.08470000",
    usd: 284.99,
  },
  transactionHash,
  fromWallet,
  toWallet,
  gasFee,
  networkFee,
}: PaymentTrackerProps) {
  const [status, setStatus] = useState<PaymentStatus>("verifying")
  const [timestamp] = useState(new Date().toISOString())
  const statusCardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkPaymentStatus = async () => {
        try {
          const response = await fetch(`/api/payment-status/${orderId}`)
          const data = await response.json()
          if (data.status === "confirmed") {
            setStatus("complete")
        }
      } catch (error) {
        console.error("[PaymentTracker] Error checking payment status:", error)
      }
    }

    checkPaymentStatus()
    const interval = setInterval(() => {
      if (status !== "complete") {
        checkPaymentStatus()
  }
    }, 2000)

    return () => clearInterval(interval)
  }, [orderId, status])

  const statuses: PaymentStatus[] = ["sent", "processing", "verifying", "complete"]
  const currentIndex = statuses.indexOf(status)

  return (
    <div className="min-h-screen px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-3">Payment Verification</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Order #{orderId.slice(0, 8)}</h1>
          <p className="mt-2 text-sm text-white/50">
            {new Date(timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
      </div>

        {/* Status Tracker Card */}
        <div
        ref={statusCardRef}
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 mb-6"
      >
          {/* Desktop Status */}
            <div className="hidden md:block">
            <div className="flex justify-between items-start">
                {statuses.map((s, index) => {
                  const isActive = index <= currentIndex
                  const isCurrent = index === currentIndex
                  const isNotLast = index < statuses.length - 1

                  return (
                    <div key={s} className="relative flex flex-1 flex-col items-center">
                      <div className="relative flex w-full items-center justify-center">
                        {index > 0 && (
                          <div className="absolute right-1/2 h-0.5 w-1/2">
                          <div className="absolute inset-0 bg-white/10" />
                            <div
                              className={cn(
                              "absolute inset-0 bg-emerald-400 transition-all duration-700",
                                index - 1 < currentIndex ? "w-full" : "w-0",
                              )}
                            />
                          </div>
                        )}

                        <div
                          className={cn(
                          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                          isActive ? "bg-emerald-400" : "bg-white/10",
                        )}
                      >
                        {isCurrent && s === "verifying" && status !== "complete" ? (
                          <Loader2 className="h-5 w-5 text-black animate-spin" strokeWidth={2.5} />
                        ) : isActive ? (
                          <Check className="h-5 w-5 text-black" strokeWidth={2.5} />
                        ) : (
                          <span className="text-sm font-medium text-white/40">{index + 1}</span>
                        )}
                        </div>

                        {isNotLast && (
                          <div className="absolute left-1/2 h-0.5 w-1/2">
                          <div className="absolute inset-0 bg-white/10" />
                            <div
                              className={cn(
                              "absolute inset-0 bg-emerald-400 transition-all duration-700",
                              index < currentIndex ? "w-full" : "w-0",
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-center">
                      <p className={cn(
                        "text-sm font-semibold transition-colors",
                        isActive ? "text-white" : "text-white/40",
                      )}>
                          {statusConfig[s].label}
                        </p>
                    </div>
                    </div>
                  )
                })}
              </div>
            </div>

          {/* Mobile Status */}
          <div className="md:hidden space-y-4">
                {statuses.map((s, index) => {
                  const isActive = index <= currentIndex
                  const isCurrent = index === currentIndex
                  const isNotLast = index < statuses.length - 1

                  return (
                <div key={s} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                        isActive ? "bg-emerald-400" : "bg-white/10",
                      )}
                    >
                      {isCurrent && s === "verifying" && status !== "complete" ? (
                        <Loader2 className="h-4 w-4 text-black animate-spin" strokeWidth={2.5} />
                      ) : isActive ? (
                        <Check className="h-4 w-4 text-black" strokeWidth={2.5} />
                      ) : (
                        <span className="text-xs font-medium text-white/40">{index + 1}</span>
                      )}
                          </div>
                          {isNotLast && (
                      <div className={cn(
                        "w-0.5 h-4 mt-1",
                        index < currentIndex ? "bg-emerald-400" : "bg-white/10"
                      )} />
                          )}
                        </div>
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-white" : "text-white/40",
                    )}>
                            {statusConfig[s].label}
                          </p>
                    <p className="text-xs text-white/40">{statusConfig[s].description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

          {/* Complete Message */}
          {status === "complete" && (
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-emerald-400 font-semibold">✓ Payment Verified</p>
              <p className="text-sm text-white/50 mt-1">Your order is being processed</p>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        {(transactionHash || fromWallet || toWallet) && (
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">Transaction Details</p>
            
            <div className="space-y-4">
              {/* Transaction Hash */}
              {transactionHash && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white/40">Transaction Hash</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-white/40 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        navigator.clipboard.writeText(transactionHash)
                        toast({ title: "Copied to clipboard" })
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-white/60 break-all hover:text-emerald-400 transition-colors leading-relaxed"
                  >
                    {transactionHash}
                  </a>
                </div>
              )}

              {/* From Wallet */}
              {fromWallet && (
                <div>
                  <p className="text-xs text-white/40 mb-1">From</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://etherscan.io/address/${fromWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/60 break-all hover:text-emerald-400 transition-colors"
                    >
                      {fromWallet}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(fromWallet)
                        toast({ title: "Copied to clipboard" })
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* To Wallet */}
              {toWallet && (
                <div>
                  <p className="text-xs text-white/40 mb-1">To</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://etherscan.io/address/${toWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/60 break-all hover:text-emerald-400 transition-colors"
                    >
                      {toWallet}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(toWallet)
                        toast({ title: "Copied to clipboard" })
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Fees */}
              {(gasFee || networkFee) && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {gasFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Gas Fee</span>
                      <div className="text-right">
                        <span className="font-mono text-white">{gasFee.eth} ETH</span>
                        <span className="text-white/40 text-xs ml-2">(${gasFee.usd.toFixed(2)})</span>
                      </div>
                    </div>
                  )}
                  {networkFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Network Fee</span>
                      <div className="text-right">
                        <span className="font-mono text-white">{networkFee.eth} ETH</span>
                        <span className="text-white/40 text-xs ml-2">(${networkFee.usd.toFixed(2)})</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">Order Details</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs text-white/40 mb-1">Customer</p>
              <p className="text-white font-medium">{customerName}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Items</p>
              <p className="text-white font-medium">{orderName}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Subtotal</span>
              <span className="font-mono text-white">${priceDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Shipping</span>
              <span className="font-mono text-white">${priceDetails.shipping.toFixed(2)}</span>
            </div>
            {priceDetails.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-white/50">Discount</span>
                <span className="font-mono text-emerald-400">-${priceDetails.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-white/10">
              <span className="font-semibold text-white">Total</span>
              <span className="font-mono font-semibold text-white">${priceDetails.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Order Amount</span>
              <span className="font-mono text-sm text-white/60">{cryptoAmount.eth} ETH</span>
            </div>
            {gasFee && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">+ Gas Fee</span>
                <span className="font-mono text-sm text-white/60">{gasFee.eth} ETH</span>
              </div>
            )}
            {networkFee && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">+ Network Fee</span>
                <span className="font-mono text-sm text-white/60">{networkFee.eth} ETH</span>
              </div>
            )}
            {(gasFee || networkFee) && (
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs text-white/50 font-medium">Total Paid</span>
                <span className="font-mono text-sm text-white font-medium">
                  {(
                    parseFloat(cryptoAmount.eth) + 
                    (gasFee ? parseFloat(gasFee.eth) : 0) + 
                    (networkFee ? parseFloat(networkFee.eth) : 0)
                  ).toFixed(8)} ETH
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">Shipping To</p>
          <div className="text-sm text-white/70 space-y-1">
            <p className="font-medium text-white">{shippingAddress.name}</p>
            <p>{shippingAddress.street}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-white/30">
            Questions? Contact support@modernhealthpro.com
          </p>
        </div>
      </div>
    </div>
  )
}
