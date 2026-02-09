"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import Image from "next/image"
import QRCode from "react-qr-code"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

export default function CryptoPaymentIntegrated() {
  return (
    <PaymentFlowWrapper>
      {({ orderTotal, merchantWallet, orderId, onPaymentComplete }) => (
        <CryptoPaymentContent
          orderTotal={orderTotal}
          merchantWallet={merchantWallet}
          orderId={orderId}
          onPaymentComplete={onPaymentComplete}
        />
      )}
    </PaymentFlowWrapper>
  )
}

function CryptoPaymentContent({
  orderTotal,
  merchantWallet,
  orderId,
  onPaymentComplete
}: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  // Calculate ETH amount (you can integrate real-time pricing here)
  const ethPrice = 3000 // Placeholder
  const ethAmount = (orderTotal / ethPrice).toFixed(6)
  const ethAmountInWei = (parseFloat(ethAmount) * 1e18).toString(16)

  // Generic Ethereum payment deep link
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
          to: merchantWallet,
          from: accounts[0],
          value: "0x" + ethAmountInWei,
        }
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        console.log("Transaction sent:", txHash)
        setPaymentSent(true)
      } catch (error) {
        console.error("Error sending transaction:", error)
      }
    }
  }

  const handleCompleteOrder = () => {
    // User confirms payment was sent
    onPaymentComplete()
  }

  return (
    <>
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
              <p className="text-sm text-muted-foreground">Scan with your mobile wallet</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleMakePayment}
              className="w-full rounded-lg bg-foreground py-4 font-semibold text-background transition-opacity hover:opacity-90"
            >
              Make Payment
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Opens your wallet to complete the transaction
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="mb-4 text-2xl font-bold">Payment Initiated!</h2>
          <p className="mb-8 text-muted-foreground">
            Please complete the transaction in your wallet, then click below to continue.
          </p>
          <button
            onClick={handleCompleteOrder}
            className="w-full max-w-md rounded-lg bg-foreground py-4 font-semibold text-background transition-opacity hover:opacity-90"
          >
            I've Completed the Payment
          </button>
        </div>
      )}
    </>
  )
}
