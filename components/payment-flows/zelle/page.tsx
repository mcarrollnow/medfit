"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

interface ZelleDetails {
  zelleEmail?: string
  zellePhone?: string
  recipientName?: string
}

function ZellePaymentContent({ orderTotal, merchantWallet, orderId, onPaymentComplete }: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
}) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)
  const [pinUnlocked, setPinUnlocked] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [zelleDetails, setZelleDetails] = useState<ZelleDetails | null>(null)
  const [customerEmail, setCustomerEmail] = useState("")

  // Get customer email from Supabase session
  useEffect(() => {
    const getCustomerEmail = async () => {
      const { getSupabaseBrowserClient } = await import('@/lib/supabase')
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setCustomerEmail(user.email)
      }
    }
    getCustomerEmail()
  }, [])

  const verifyPin = async () => {
    if (!pin) {
      setPinError("Please enter your PIN")
      return
    }

    if (!customerEmail) {
      setPinError("Unable to verify identity. Please refresh and try again.")
      return
    }

    setIsVerifying(true)
    setPinError("")

    try {
      const response = await fetch('/api/ach-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin, customerEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setZelleDetails(data.zelleDetails)
        setPinUnlocked(true)
        setPinError("")
      } else {
        setPinError(data.error || "Invalid PIN")
      }
    } catch (error) {
      console.error('Error verifying PIN:', error)
      setPinError("Failed to verify PIN. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      verifyPin()
    }
  }

  const copyToClipboard = async (text: string, type: "email" | "phone" | "amount") => {
    await navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else if (type === "phone") {
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } else {
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 2000)
    }
  }

  return (
    <>
      <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/zelle-logo.svg"
              alt="Zelle"
              width={240}
              height={96}
              className="h-auto w-[200px] sm:w-[240px] object-contain"
            />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Follow these steps to complete your payment</p>
        </div>

        {!pinUnlocked ? (
          <div className="max-w-md mx-auto">
            <div className="rounded-lg border border-foreground/20 bg-card p-6 sm:p-8">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                  <Lock className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <h2 className="mb-4 text-xl sm:text-2xl font-bold text-center">Enter Your PIN</h2>
              <p className="mb-6 text-center text-muted-foreground">
                To protect sensitive payment information, please enter your PIN to view Zelle details.
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={handlePinKeyDown}
                    placeholder="Enter PIN"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isVerifying}
                    autoFocus
                  />
                </div>

                {pinError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-500">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{pinError}</p>
                  </div>
                )}

                <button
                  onClick={verifyPin}
                  disabled={isVerifying || !pin}
                  className="w-full rounded-lg bg-foreground px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "Unlock Details"}
                </button>
              </div>
            </div>
          </div>
        ) : !paymentSent ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-foreground/20 bg-card p-6 sm:p-8">
              <h2 className="mb-6 text-xl sm:text-2xl font-bold">Payment Instructions</h2>

              <div className="space-y-6">
                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-3 text-lg sm:text-base font-semibold">Step 1: Open Zelle</h3>
                  <p className="text-base text-muted-foreground">Open your banking app and navigate to Zelle</p>
                </div>

                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-4 text-lg sm:text-base font-semibold">Step 2: Enter Recipient</h3>
                  {zelleDetails?.zelleEmail && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <p className="text-base text-muted-foreground mb-3">Send to this email:</p>
                        <code className="block break-all text-base sm:text-sm font-medium bg-background p-3 rounded border">{zelleDetails.zelleEmail}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(zelleDetails.zelleEmail || '', "email")}
                        className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent active:scale-95"
                      >
                        {copiedEmail ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                      </button>
                    </div>
                  )}
                  {zelleDetails?.zellePhone && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-base text-muted-foreground mb-3">Or send to this phone:</p>
                        <code className="block break-all text-base sm:text-sm font-medium bg-background p-3 rounded border">{zelleDetails.zellePhone}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(zelleDetails.zellePhone || '', "phone")}
                        className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent active:scale-95"
                      >
                        {copiedPhone ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-4 text-lg sm:text-base font-semibold">Step 3: Enter Amount</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-3xl sm:text-4xl font-bold bg-background p-4 rounded border">${orderTotal.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(orderTotal.toString(), "amount")}
                      className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent active:scale-95"
                    >
                      {copiedAmount ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-3 text-lg sm:text-base font-semibold">Step 4: Add Note (Optional)</h3>
                  <p className="text-base text-muted-foreground">Include your order number: #{orderId}</p>
                </div>

                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-3 text-lg sm:text-base font-semibold">Step 5: Send Payment</h3>
                  <p className="text-base text-muted-foreground">Review the details and confirm your payment</p>
                </div>
              </div>

              <button
                onClick={() => setPaymentSent(true)}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-98"
              >
                I've Sent the Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-foreground/20 bg-card p-6 sm:p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h2 className="mb-4 text-xl sm:text-2xl font-bold">Payment Sent!</h2>
            <p className="mb-6 text-base text-muted-foreground">
              We'll confirm your Zelle payment and process your order. Click below to continue to verification.
            </p>
            <button
              onClick={onPaymentComplete}
              className="inline-flex items-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-98"
            >
              Continue to Verification
            </button>
          </div>
        )}
    </>
  )
}

export default function ZellePayment() {
  return (
    <PaymentFlowWrapper>
      {(props) => <ZellePaymentContent {...props} />}
    </PaymentFlowWrapper>
  )
}
