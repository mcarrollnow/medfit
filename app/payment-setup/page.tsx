"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock, Check, AlertCircle, Loader2 } from "lucide-react"
import GlobalNav from "@/components/global-nav"

function PaymentSetupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      setVerifying(false)
    } else {
      setError("Invalid setup link")
      setVerifying(false)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (pin.length < 4) {
      setError("PIN must be at least 4 digits")
      return
    }

    if (pin !== confirmPin) {
      setError("PINs do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payment-pin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          pin,
          customerEmail: email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Failed to create PIN")
      }
    } catch (error) {
      console.error('Error creating PIN:', error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-foreground/20 bg-card p-8 sm:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl sm:text-4xl font-bold">PIN Created Successfully!</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Your payment PIN has been set up. You can now use ACH Transfer and Zelle payment methods during checkout.
            </p>
            <p className="text-muted-foreground">
              <strong>Important:</strong> Please remember your PIN. You'll need it to access payment details when making a purchase.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-foreground/20 bg-card p-8 sm:p-12">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
              <Lock className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-center">Set Up Payment PIN</h1>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Create a secure PIN to access ACH Transfer and Zelle payment methods
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Use the email address associated with your account
              </p>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-semibold mb-2">
                Create PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4+ digit PIN"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                minLength={4}
              />
            </div>

            <div>
              <label htmlFor="confirmPin" className="block text-sm font-semibold mb-2">
                Confirm PIN
              </label>
              <input
                id="confirmPin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Re-enter PIN"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                minLength={4}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-500">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-foreground px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating PIN..." : "Create PIN"}
            </button>

            <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Security Information:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Your PIN will be encrypted and stored securely</li>
                <li>You'll need this PIN to view payment details during checkout</li>
                <li>Keep your PIN confidential</li>
                <li>This link expires in 7 days</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSetupPage() {
  return (
    <>
      <GlobalNav />
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <PaymentSetupContent />
      </Suspense>
    </>
  )
}
