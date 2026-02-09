"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import Image from "next/image"
import QRCode from "react-qr-code"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

function PayPalGuideContent({ orderTotal, merchantWallet, orderId, onPaymentComplete }: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [selectedStore, setSelectedStore] = useState<"ios" | "android" | null>(null)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [amountCopied, setAmountCopied] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
  const [addressPasted, setAddressPasted] = useState(false)
  const [paymentAmountCopied, setPaymentAmountCopied] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)

  // Use real order data
  const orderAmount = `$${orderTotal.toFixed(2)}`
  const iosDownloadLink = "https://apps.apple.com/us/app/paypal-send-shop-manage/id283646709"
  const androidDownloadLink = "https://play.google.com/store/apps/details?id=com.paypal.android.p2pmobile"
  const paypalDeepLink = "paypal://"

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(orderAmount.replace("$", ""))
      setAmountCopied(true)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(merchantWallet)
      setAddressCopied(true)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyPaymentAmount = async () => {
    try {
      await navigator.clipboard.writeText(orderAmount.replace("$", ""))
      setPaymentAmountCopied(true)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 2) {
        setSelectedStore(null)
      }
      if (currentStep === 3) {
        setPurchaseComplete(false)
      }
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <>
      <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/paypal-logo.png"
              alt="PayPal logo"
              width={160}
              height={80}
              className="h-auto w-40 object-contain"
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Using PayPal Crypto</h1>
          <p className="text-lg text-muted-foreground">Follow these simple steps to pay with Ethereum on PayPal</p>
        </div>

        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-foreground transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {showCart ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8">
            <h2 className="mb-6 text-3xl font-bold">Order Summary</h2>

            <div className="space-y-6">
              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Items</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Example</span>
                    <span className="font-medium">$85.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$15.00</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-2 text-sm font-semibold">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  123 Main Street
                  <br />
                  San Francisco, CA 94102
                  <br />
                  United States
                </p>
              </div>

              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-2 text-sm font-semibold">Promo Code</h3>
                <p className="text-sm text-muted-foreground">CRYPTO10 Applied (-$10.00)</p>
              </div>

              <div className="rounded-md border border-foreground/20 bg-card p-5">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>$100.00</span>
                </div>
              </div>

              <div className="hidden lg:block space-y-4">
                <div className="rounded-md border border-border bg-muted p-6">
                  <h3 className="mb-3 text-sm font-semibold text-center">Send Payment</h3>
                  <div className="flex justify-center mb-4">
                    <div className="rounded-md bg-white p-4 inline-block">
                      <QRCode value={walletAddress} size={180} />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="rounded-md border border-border bg-card p-4">
                      <div className="text-xs text-muted-foreground mb-1">Amount to Send</div>
                      <div className="text-3xl font-bold">$100.00</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan QR code in PayPal, enter amount, press send, then return here to complete order.
                    </p>
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  Complete Order
                </button>
              </div>

              <div className="lg:hidden space-y-4">
                {!addressPasted ? (
                  <>
                    {!addressCopied ? (
                      <>
                        <p className="text-sm text-muted-foreground text-center">
                          Tap to copy wallet address, then open PayPal to paste in Send
                        </p>
                        <button
                          onClick={copyAddress}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Copy Address
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-500 mb-2">
                          <Check className="h-4 w-4" />
                          <span>Address Copied!</span>
                        </div>
                        <a
                          href={paypalDeepLink}
                          onClick={() => setTimeout(() => setAddressPasted(true), 500)}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Open PayPal
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        <p className="text-sm text-muted-foreground text-center">
                          Hit Send → Choose Ethereum → Paste in recipient field at top → Confirm address → Return here
                          for amount
                        </p>
                      </>
                    )}
                  </>
                ) : !paymentSent ? (
                  <>
                    {!paymentAmountCopied ? (
                      <>
                        <p className="text-sm text-muted-foreground text-center">
                          Tap amount to copy, then open PayPal to paste and send
                        </p>
                        <button
                          onClick={copyPaymentAmount}
                          className="w-full rounded-md border-2 border-foreground/20 bg-muted p-8 text-center transition-all active:scale-95"
                        >
                          <div className="text-5xl font-bold">{orderAmount}</div>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-500 mb-2">
                          <Check className="h-4 w-4" />
                          <span>Amount Copied!</span>
                        </div>
                        <a
                          href={paypalDeepLink}
                          onClick={() => setTimeout(() => setPaymentSent(true), 500)}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Open PayPal
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        <p className="text-sm text-muted-foreground text-center">
                          Paste amount, hit Send, then return here to complete order
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground text-center">
                      Payment sent! Complete your order to finalize the purchase.
                    </p>
                    <button className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                      Complete Order
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setShowCart(false)
                  setAddressCopied(false)
                  setAddressPasted(false)
                  setPaymentAmountCopied(false)
                  setPaymentSent(false)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {currentStep >= 1 && (
              <div
                className={`rounded-lg border bg-card p-8 transition-all duration-500 ${
                  currentStep === 1 ? "border-foreground/20" : "border-border opacity-50"
                }`}
              >
                <h2 className="mb-3 text-2xl font-semibold">Step 1: Download PayPal</h2>
                <p className="mb-6 text-muted-foreground">Download the PayPal app or skip if already installed</p>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="hidden lg:flex flex-col items-center gap-4">
                      {!selectedStore ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground text-center mb-4">Select your device</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setSelectedStore("ios")}
                              className="flex items-center justify-center rounded-md border border-border bg-background p-6 transition-all hover:border-foreground/40 hover:bg-accent"
                            >
                              <Image
                                src="/app-store-logo.svg"
                                alt="App Store"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                              />
                            </button>
                            <button
                              onClick={() => setSelectedStore("android")}
                              className="flex items-center justify-center rounded-md border border-border bg-background p-6 transition-all hover:border-foreground/40 hover:bg-accent"
                            >
                              <Image
                                src="/google-play-logo.svg"
                                alt="Google Play"
                                width={135}
                                height={40}
                                className="h-10 w-auto object-contain"
                              />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="rounded-md bg-white p-4 inline-block">
                            <QRCode
                              value={selectedStore === "ios" ? iosDownloadLink : androidDownloadLink}
                              size={160}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scan to download from {selectedStore === "ios" ? "App Store" : "Google Play"}
                          </p>
                          <button
                            onClick={() => setSelectedStore(null)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Choose different store
                          </button>
                        </div>
                      )}
                    </div>
                    <a
                      href={iosDownloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:hidden flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                      Download PayPal
                    </a>
                    <button
                      onClick={nextStep}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      I Have PayPal on Phone
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep >= 2 && (
              <div
                className={`rounded-lg border bg-card p-8 transition-all duration-500 ${
                  currentStep === 2 ? "border-foreground/20" : "border-border opacity-50"
                }`}
              >
                <h2 className="mb-3 text-2xl font-semibold">Step 2: Enable Crypto</h2>
                <p className="mb-6 text-muted-foreground">
                  <span className="lg:hidden">
                    Open PayPal, enable crypto, complete verification. Return here after.
                  </span>
                  <span className="hidden lg:inline">
                    Open PayPal, tap Crypto tab, accept terms, complete verification
                  </span>
                </p>
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <a
                      href={paypalDeepLink}
                      className="lg:hidden flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                      Open PayPal
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep >= 3 && (
              <div
                className={`rounded-lg border bg-card p-8 transition-all duration-500 ${
                  currentStep === 3 ? "border-foreground/20" : "border-border opacity-50"
                }`}
              >
                {currentStep === 3 && !purchaseComplete ? (
                  <>
                    <h2 className="mb-3 text-2xl font-semibold">Step 3: Buy Ethereum</h2>
                    <p className="mb-6 text-muted-foreground">
                      <span className="lg:hidden">
                        {!amountCopied
                          ? "Tap amount to copy, then open PayPal to buy ETH. Return here after purchase"
                          : "Amount copied! Tap to open PayPal, buy ETH, then return here"}
                      </span>
                      <span className="hidden lg:inline">Enter this exact amount in PayPal</span>
                    </p>
                    {!amountCopied ? (
                      <button
                        onClick={copyAmount}
                        className="lg:pointer-events-none mb-6 w-full rounded-md border-2 border-foreground/20 bg-muted p-8 text-center transition-all lg:cursor-default active:scale-95 lg:active:scale-100"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="text-5xl font-bold">{orderAmount}</div>
                        </div>
                      </button>
                    ) : (
                      <>
                        <div className="hidden lg:block mb-6 w-full rounded-md border-2 border-foreground/20 bg-muted p-8 text-center">
                          <div className="text-5xl font-bold">{orderAmount}</div>
                        </div>
                        <a
                          href={paypalDeepLink}
                          className="lg:hidden mb-6 flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground/20 bg-foreground px-6 py-8 text-lg font-semibold text-background transition-all active:scale-95"
                        >
                          Open PayPal
                          <ArrowRight className="h-5 w-5" />
                        </a>
                      </>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={prevStep}
                        className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button
                        onClick={() => setPurchaseComplete(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent whitespace-nowrap"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : currentStep === 3 && purchaseComplete ? (
                  <>
                    <h2 className="mb-3 text-2xl font-semibold">Setup Complete!</h2>
                    <p className="mb-6 text-muted-foreground">You're now ready to make purchases using ETH.</p>
                    <div className="space-y-3">
                      <button
                        onClick={onPaymentComplete}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                      >
                        Complete Purchase
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPurchaseComplete(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
    </>
  )
}

export function PayPalPaymentFlow(props: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
  orderDetails?: any
  isLoading: boolean
  isProcessingPayment: boolean
}) {
  return <PayPalGuideContent {...props} />
}

export default function PayPalGuide() {
  return (
    <PaymentFlowWrapper>
      {(props) => <PayPalGuideContent {...props} />}
    </PaymentFlowWrapper>
  )
}
