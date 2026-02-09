"use client"

import { useState } from "react"
import { Home, Copy, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ACHPayment() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentSent, setPaymentSent] = useState(false)

  const achDetails = {
    accountName: "Your Store Inc",
    routingNumber: "123456789",
    accountNumber: "9876543210",
    accountType: "Checking",
    amount: "90.00",
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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
              src="/ach-transfer-logo.svg"
              alt="ACH Transfer"
              width={300}
              height={80}
              className="h-auto w-[300px] object-contain"
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">ACH Bank Transfer</h1>
          <p className="text-lg text-muted-foreground">Follow these steps to complete your payment</p>
        </div>

        {!paymentSent ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-foreground/20 bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Transfer Details</h2>

              <div className="space-y-6">
                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Account Name</h3>
                  <div className="flex items-center justify-between gap-3">
                    <code className="flex-1 text-sm font-medium">{achDetails.accountName}</code>
                    <button
                      onClick={() => copyToClipboard(achDetails.accountName, "accountName")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedField === "accountName" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Routing Number</h3>
                  <div className="flex items-center justify-between gap-3">
                    <code className="flex-1 text-sm font-medium">{achDetails.routingNumber}</code>
                    <button
                      onClick={() => copyToClipboard(achDetails.routingNumber, "routingNumber")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedField === "routingNumber" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Account Number</h3>
                  <div className="flex items-center justify-between gap-3">
                    <code className="flex-1 text-sm font-medium">{achDetails.accountNumber}</code>
                    <button
                      onClick={() => copyToClipboard(achDetails.accountNumber, "accountNumber")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedField === "accountNumber" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Account Type</h3>
                  <div className="text-sm font-medium">{achDetails.accountType}</div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-3 text-sm font-semibold">Transfer Amount</h3>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-3xl font-bold">${achDetails.amount}</div>
                    <button
                      onClick={() => copyToClipboard(achDetails.amount, "amount")}
                      className="rounded-md border border-border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      {copiedField === "amount" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Important Notes</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• ACH transfers typically take 1-3 business days to process</li>
                    <li>• Include your order number (#12345) in the transfer memo</li>
                    <li>• Your order will ship once the transfer is confirmed</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setPaymentSent(true)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                I've Initiated the Transfer
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
            <h2 className="mb-3 text-2xl font-bold">Transfer Initiated!</h2>
            <p className="mb-6 text-muted-foreground">
              Thank you. We'll process your order once the ACH transfer is confirmed (typically 1-3 business days).
              You'll receive email updates throughout the process.
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
