"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RevolutPayButtonProps {
  amount: number
  currency?: string
  description?: string
  customerEmail?: string
  reference?: string
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export function RevolutPayButton({
  amount,
  currency = "USD",
  description,
  customerEmail,
  reference,
  onSuccess,
  onError,
  disabled = false,
  className,
}: RevolutPayButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/revolut/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          description,
          customer_email: customerEmail,
          reference,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create payment")
      }

      const data = await response.json()
      
      if (data.checkout_url) {
        // Redirect to Revolut checkout
        window.location.href = data.checkout_url
      } else {
        throw new Error("No checkout URL received")
      }

      onSuccess?.(data.order?.id)
    } catch (err: any) {
      console.error("[Revolut Pay] Error:", err)
      onError?.(err.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading || amount <= 0}
      className={cn(
        "w-full h-14 text-base font-semibold rounded-xl",
        "bg-card hover:bg-secondary text-foreground",
        "border border-border",
        "flex items-center justify-center gap-3",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <RevolutLogo className="h-5 w-5" />
          Pay with Revolut
        </>
      )}
    </Button>
  )
}

function RevolutLogo({ className }: { className?: string }) {
  return (
    <img
      src="https://bteugdayafihvdzhpnlv.supabase.co/storage/v1/object/public/theme-assets/Revolut-Icon-Logo.wine.svg"
      alt="Revolut"
      className={className}
    />
  )
}

// Alternative: Revolut Pay Widget Component (for embed)
export function RevolutPayWidget({
  amount,
  currency = "USD",
  description,
  customerEmail,
  className,
}: {
  amount: number
  currency?: string
  description?: string
  customerEmail?: string
  className?: string
}) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/revolut/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          description,
          customer_email: customerEmail,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to create order")
      }

      const data = await response.json()
      setCheckoutUrl(data.checkout_url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className={cn("p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm", className)}>
        {error}
        <Button variant="outline" size="sm" onClick={createOrder} className="mt-2 w-full">
          Try Again
        </Button>
      </div>
    )
  }

  if (checkoutUrl) {
    return (
      <div className={cn("space-y-3", className)}>
        <Button
          onClick={() => window.location.href = checkoutUrl}
          className="w-full h-14 bg-[#0075EB] hover:bg-[#0066CC] text-foreground font-semibold rounded-xl"
        >
          <RevolutLogo className="h-5 w-5 mr-2" />
          Continue to Revolut Pay
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You will be redirected to complete your payment
        </p>
      </div>
    )
  }

  return (
    <Button
      onClick={createOrder}
      disabled={loading || amount <= 0}
      className={cn(
        "w-full h-14 bg-[#0075EB] hover:bg-[#0066CC] text-foreground font-semibold rounded-xl",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <RevolutLogo className="h-5 w-5 mr-2" />
          Pay ${amount.toFixed(2)} with Revolut
        </>
      )}
    </Button>
  )
}

