"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Image from "next/image"
import QRCode from "react-qr-code"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

function CryptoPaymentContent({ orderTotal, merchantWallet, orderId, onPaymentComplete }: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  // Calculate ETH amount - placeholder pricing, should integrate with real ETH price API
  const ethPrice = 3000 // This should come from real-time price feed
  const ethAmount = (orderTotal / ethPrice).toFixed(6)
  const ethAmountInWei = (parseFloat(ethAmount) * 1e18).toString(16)

  // Ethereum payment deep link with real wallet address
  const ethPaymentDeepLink = `ethereum:${merchantWallet}@1?value=${ethAmountInWei}`

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
          to: merchantWallet, // Use real merchant wallet
          from: accounts[0],
          value: "0x" + ethAmountInWei,
        }
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        console.log("[CryptoPayment] Transaction sent:", txHash)
        setPaymentSent(true)
      } catch (error) {
        console.error("[CryptoPayment] Error sending transaction:", error)
      }
    }
  }

  const handlePaymentComplete = () => {
    // User confirms they've completed the payment
    onPaymentComplete()
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

        {!paymentSent ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8">
            <h2 className="mb-6 text-2xl font-bold">Payment Details</h2>

            <div className="mb-8 space-y-6">
              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Order Total</h3>
                <div className="text-3xl font-bold">${orderTotal.toFixed(2)}</div>
                <div className="mt-2 text-lg text-muted-foreground">≈ {ethAmount} ETH</div>
              </div>

              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Wallet Address</h3>
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

              <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                <div className="rounded-lg bg-white p-4">
                  <QRCode value={ethPaymentDeepLink} size={200} />
                </div>
                <p className="text-center text-sm text-muted-foreground">Scan with your mobile wallet</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleMakePayment}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Send Payment
              </button>
              <a
                href={ethPaymentDeepLink}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent lg:hidden"
              >
                Open in Wallet App
              </a>
            </div>
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
              Complete the transaction in your wallet, then click below to continue to verification.
            </p>
            <button
              onClick={handlePaymentComplete}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              I've Completed the Payment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CryptoPayment() {
  return (
    <PaymentFlowWrapper>
      {(props) => <CryptoPaymentContent {...props} />}
    </PaymentFlowWrapper>
  )
}
