"use client"

import { useState } from "react"
import { Home, Copy, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ZellePayment() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  const zelleEmail = "payments@yourstore.com"
  const orderTotal = 90

  const copyToClipboard = async (text: string, type: "email" | "amount") => {
    await navigator.clipboard.writeText(text)
    if (type === "email") {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
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

        {!paymentSent ? (
          <div className="space-y-6">
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
                  <h3 className="mb-2 text-sm font-semibold">Step 4: Add Note (Optional)</h3>
                  <p className="text-sm text-muted-foreground">Include your order number: #12345</p>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Step 5: Send Payment</h3>
                  <p className="text-sm text-muted-foreground">Review the details and confirm your payment</p>
                </div>
              </div>

              <button
                onClick={() => setPaymentSent(true)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                I've Sent the Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-foreground/20 bg-card p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold">Payment Received!</h2>
            <p className="mb-6 text-muted-foreground">
              Thank you for your payment. You'll receive a confirmation email once we process your order.
            </p>
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
