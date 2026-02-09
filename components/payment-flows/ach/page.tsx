"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

interface ACHDetails {
  recipientName: string
  recipientAddress: string
  accountNumber: string
  achRoutingNumber: string
  wireRoutingNumber: string
  swiftBic: string
  intermediaryBic: string
}

function ACHPaymentContent({ orderTotal, merchantWallet, orderId, onPaymentComplete }: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentSent, setPaymentSent] = useState(false)
  const [pinUnlocked, setPinUnlocked] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [achDetails, setAchDetails] = useState<ACHDetails | null>(null)
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
        setAchDetails(data.achDetails)
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

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <>
      <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/ach-transfer-logo.svg"
              alt="ACH Transfer"
              width={350}
              height={96}
              className="h-auto w-[280px] sm:w-[320px] lg:w-[350px] object-contain"
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
                To protect sensitive banking information, please enter your PIN to view transfer details.
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
              <h2 className="mb-6 text-xl sm:text-2xl font-bold">Transfer Details</h2>

              <div className="space-y-6">
                {/* Recipient Information */}
                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-4 text-lg font-semibold">Recipient</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <code className="flex-1 text-base font-medium bg-background p-3 rounded border break-all">{achDetails?.recipientName || ''}</code>
                    <button
                      onClick={() => copyToClipboard(achDetails?.recipientName || '', "recipientName")}
                      className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent active:scale-95"
                    >
                      {copiedField === "recipientName" ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <code className="flex-1 text-sm text-muted-foreground bg-background p-3 rounded border break-all">{achDetails?.recipientAddress || ''}</code>
                    <button
                      onClick={() => copyToClipboard(achDetails?.recipientAddress || '', "recipientAddress")}
                      className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent active:scale-95"
                    >
                      {copiedField === "recipientAddress" ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                    </button>
                  </div>
                </div>

                {/* Transfer Amount */}
                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-3 text-lg font-semibold">Transfer Amount</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-3xl font-bold">${orderTotal.toFixed(2)}</div>
                    <button
                      onClick={() => copyToClipboard(orderTotal.toFixed(2), "amount")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedField === "amount" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* US Bank Transfer (ACH) */}
                <div className="rounded-md border-2 border-blue-500/30 bg-blue-500/5 p-6">
                  <h3 className="mb-4 text-lg font-bold text-blue-600 dark:text-blue-400">Transfer from a US Bank (ACH)</h3>
                  
                  <div className="space-y-4">
                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">Account Number</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.accountNumber || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.accountNumber || '', "accountNumber")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "accountNumber" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">ACH Routing Number</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.achRoutingNumber || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.achRoutingNumber || '', "achRoutingNumber")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "achRoutingNumber" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Wire Transfer */}
                <div className="rounded-md border-2 border-purple-500/30 bg-purple-500/5 p-6">
                  <h3 className="mb-4 text-lg font-bold text-purple-600 dark:text-purple-400">Transfer from Outside the USA (Wire)</h3>
                  
                  <div className="space-y-4">
                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">Account Number</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.accountNumber || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.accountNumber || '', "accountNumber2")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "accountNumber2" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">Wire Routing Number</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.wireRoutingNumber || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.wireRoutingNumber || '', "wireRoutingNumber")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "wireRoutingNumber" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">SWIFT/BIC</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.swiftBic || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.swiftBic || '', "swiftBic")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "swiftBic" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-background p-4">
                      <h4 className="mb-2 text-sm font-semibold">Intermediary BIC</h4>
                      <div className="flex items-center justify-between gap-3">
                        <code className="flex-1 text-base font-medium">{achDetails?.intermediaryBic || ''}</code>
                        <button
                          onClick={() => copyToClipboard(achDetails?.intermediaryBic || '', "intermediaryBic")}
                          className="rounded-md border border-border bg-muted p-2 transition-colors hover:bg-accent"
                        >
                          {copiedField === "intermediaryBic" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Important Notes</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• ACH transfers typically take 1-3 business days to process</li>
                    <li>• Wire transfers are usually processed within 24 hours</li>
                    <li>• Include your order ID in the transfer memo/reference</li>
                    <li>• Your order will ship once the transfer is confirmed</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setPaymentSent(true)}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-98"
              >
                I've Initiated the Transfer
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
            <h2 className="mb-4 text-xl sm:text-2xl font-bold">Transfer Initiated!</h2>
            <p className="mb-6 text-base text-muted-foreground">
              We'll process your order once the ACH transfer is confirmed (typically 1-3 business days). 
              Click below to continue to verification.
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

export default function ACHPayment() {
  return (
    <PaymentFlowWrapper>
      {(props) => <ACHPaymentContent {...props} />}
    </PaymentFlowWrapper>
  )
}
