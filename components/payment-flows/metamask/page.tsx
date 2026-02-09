"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import QRCode from "react-qr-code"
import { useIsMobile } from "@/hooks/use-mobile"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

function MetaMaskGuideContent({ 
  orderTotal, 
  merchantWallet, 
  orderId, 
  onPaymentComplete, 
  orderDetails, 
  isLoading,
  isProcessingPayment 
}: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
  orderDetails?: {
    subtotal: number
    shipping_amount: number
    items: Array<{
      id: string
      product_name: string
      quantity: number
      unit_price: number
      total_price: number
    }>
    customer_name: string
    shipping_address: {
      line1: string
      city: string
      state: string
      zip: string
      country: string
    }
    discount_details?: {
      code: string
      amount: number
      description: string
    }
    payment_status: string
    payment_method: string
  }
  isLoading: boolean
  isProcessingPayment: boolean
}) {
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState<"extension" | "phone" | null>(null)
  const [ethPurchased, setEthPurchased] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const totalSteps = 3

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 2) {
        setPlatform(null)
      }
    }
  }

  const progress = (currentStep / totalSteps) * 100

  // Use real order data instead of hardcoded values
  const orderAmount = Math.ceil(orderTotal + 10) // Add $10 buffer for gas fees
  const metamaskBuyDeepLink = `metamask://buy?chainId=1&amount=${orderAmount}`
  const metamaskBuyLink = `https://link.metamask.io/buy?chainId=1&amount=${orderAmount}`
  
  // Calculate ETH amount based on real order total (placeholder ETH price)
  const ethPrice = 3000 // This should come from real-time price feed
  const ethAmount = (orderTotal / ethPrice).toFixed(6)
  const ethAmountInWei = (parseFloat(ethAmount) * 1e18).toString() // Convert ETH to Wei
  const metamaskPaymentLink = `https://link.metamask.io/send/${merchantWallet}@1?value=${ethAmountInWei}`

  const handleExtensionMakePayment = async () => {
    try {
      const provider = (window as any).ethereum
      if (!provider) {
        alert("MetaMask extension not detected. Please install MetaMask.")
        return
      }

      // Request account access
      const accounts = await provider.request({ method: "eth_requestAccounts" })

      // Prepare transaction
      const transactionParameters = {
        to: merchantWallet,
        from: accounts[0],
        value: "0x" + Number.parseInt(ethAmountInWei).toString(16), // Convert Wei to hex
      }

      // Send transaction
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })

      console.log("[MetaMask] Transaction sent:", txHash)
      // Trigger verification flow instead of alert
      onPaymentComplete()
    } catch (error) {
      console.error("[v0] Error sending transaction:", error)
      alert("Payment failed. Please try again.")
    }
  }

  const getTitle = () => {
    if (!platform) return "Get Started with MetaMask"
    if (platform === "phone") return "Using Mobile App"
    if (platform === "extension") return "Using Browser Extension"
  }

  const getSubtitle = () => {
    if (!platform) return "Follow these simple steps to set up your crypto wallet"
    if (platform === "phone") return "Follow these simple steps to setup mobile app wallet"
    if (platform === "extension") return "Follow these simple steps to setup browser extension wallet"
  }

  useEffect(() => {
    console.log("[v0] isMobile value:", isMobile)
    if (isMobile) {
      console.log("[v0] Setting platform to phone")
      setPlatform("phone")
    }
  }, [isMobile])

  return (
    <>

        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/metamask-logo.svg"
              alt="MetaMask logo"
              width={160}
              height={80}
              className="h-auto w-40 object-contain"
            />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{getTitle()}</h1>
          <p className="text-base sm:text-lg text-muted-foreground">{getSubtitle()}</p>
        </div>

        {!showCart && (
          <div className="mb-8 sm:mb-10">
            <div className="mb-3 flex items-center justify-between text-base sm:text-sm">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="font-semibold">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-foreground transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {showCart ? (
          <div className="rounded-lg border border-foreground/20 bg-card p-8">
            <h2 className="mb-6 text-3xl font-bold">Order Summary</h2>

            <div className="space-y-6">
              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-3 text-sm font-semibold">Items</h3>
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading order details...</div>
                ) : orderDetails?.items ? (
                  <div className="space-y-2 text-sm">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.product_name} (x{item.quantity})
                        </span>
                        <span className="font-medium">${item.total_price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">${orderDetails.shipping_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Order details unavailable</div>
                )}
              </div>

              <div className="rounded-md border border-border bg-muted p-5">
                <h3 className="mb-2 text-sm font-semibold">Shipping To</h3>
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading customer info...</div>
                ) : orderDetails ? (
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">
                      {orderDetails.customer_name}
                    </div>
                    {orderDetails.shipping_address.line1}
                    <br />
                    {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.zip}
                    <br />
                    {orderDetails.shipping_address.country}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Customer info unavailable</p>
                )}
              </div>

              {orderDetails?.discount_details ? (
                <div className="rounded-md border border-green-500/20 bg-green-500/5 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">Promo Code Applied</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {orderDetails.discount_details.code} - ${orderDetails.discount_details.amount.toFixed(2)} off
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-border bg-muted p-5">
                  <h3 className="mb-2 text-sm font-semibold">Order Details</h3>
                  <p className="text-sm text-muted-foreground">All fees and taxes included in total</p>
                </div>
              )}

              <div className="rounded-md border border-foreground/20 bg-card p-5">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {platform === "phone" ? (
                <div className="space-y-4">
                  <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                    <div className="rounded-lg bg-white p-4">
                      <QRCode value={metamaskPaymentLink} size={200} />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">Scan to send payment to wallet</p>
                  </div>
                  <div className="hidden lg:block lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-5">
                    <p className="text-center text-sm text-muted-foreground">
                      After sending the payment from your phone, press the button below to complete your order.
                    </p>
                  </div>
                  {/* Desktop: QR + Complete Order */}
                  <button
                    onClick={onPaymentComplete}
                    disabled={isProcessingPayment}
                    className="hidden w-full lg:flex lg:items-center lg:justify-center lg:gap-2 lg:rounded-lg lg:bg-foreground lg:px-8 lg:py-6 lg:text-base lg:font-semibold lg:text-background lg:transition-colors hover:lg:bg-foreground/90 disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Processing Order...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </button>
                  
                  {/* Mobile: Payment Link + Complete Order */}
                  <div className="lg:hidden space-y-4">
                    <a
                      href={metamaskPaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 py-6 text-lg font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                      Send Payment in MetaMask
                      <ArrowRight className="h-6 w-6" />
                    </a>
                    
                    <div className="rounded-lg bg-muted p-6">
                      <p className="text-center text-base text-muted-foreground mb-4">
                        After sending the payment in MetaMask, return here and tap:
                      </p>
                      <button
                        onClick={onPaymentComplete}
                        disabled={isProcessingPayment}
                        className="w-full flex items-center justify-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="h-6 w-6 animate-spin rounded-full border-3 border-background border-t-transparent" />
                            Processing Order...
                          </>
                        ) : (
                          "Complete Order"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleExtensionMakePayment}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Make Payment
                </button>
              )}

              <button
                onClick={() => setShowCart(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1 */}
            {currentStep >= 1 && (
              <div
                className={`rounded-lg border bg-card p-8 transition-all duration-500 ${
                  currentStep === 1 ? "border-foreground/20" : "border-border opacity-50"
                }`}
              >
                <h2 className="mb-4 text-xl sm:text-2xl font-semibold">Step 1: Download MetaMask</h2>
                {!isMobile && <p className="mb-6 text-base sm:text-lg text-muted-foreground">Choose your platform to get started</p>}
                {isMobile && <p className="mb-6 text-base sm:text-lg text-muted-foreground">Tap the button below to download</p>}
                {currentStep === 1 && (
                  <>
                    {console.log("[v0] Current platform:", platform, "isMobile:", isMobile)}

                    {!platform && !isMobile && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                          onClick={() => setPlatform("extension")}
                          className="rounded-md border border-border bg-background p-6 text-center transition-colors hover:border-foreground/20 hover:bg-accent"
                        >
                          <div className="mb-2 text-lg font-semibold">Browser Extension</div>
                          <div className="text-sm text-muted-foreground">Chrome, Firefox, etc.</div>
                        </button>
                        <button
                          onClick={() => setPlatform("phone")}
                          className="rounded-md border border-border bg-background p-6 text-center transition-colors hover:border-foreground/20 hover:bg-accent"
                        >
                          <div className="mb-2 text-lg font-semibold">Phone App</div>
                          <div className="text-sm text-muted-foreground">iOS or Android</div>
                        </button>
                      </div>
                    )}

                    {platform === "extension" && (
                      <div className="space-y-3">
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Download MetaMask Extension
                        </a>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          I've Installed MetaMask
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {platform === "phone" && (
                      <div className="space-y-3">
                        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                          <div className="rounded-lg bg-white p-4">
                            <QRCode value="https://metamask.io/download/" size={200} />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            Scan with your phone to download MetaMask
                          </p>
                        </div>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 lg:hidden"
                        >
                          Download MetaMask
                          <ArrowRight className="h-6 w-6" />
                        </a>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-8 py-6 text-lg font-semibold transition-colors hover:bg-accent"
                        >
                          I've Downloaded MetaMask
                          <ArrowRight className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 2 */}
            {currentStep >= 2 && (
              <div
                className={`rounded-lg border bg-card p-8 transition-all duration-500 ${
                  currentStep === 2 ? "border-foreground/20" : "border-border opacity-50"
                }`}
              >
                <h2 className="mb-3 text-2xl font-semibold">Step 2: Create Your Account</h2>
                <p className="mb-6 text-muted-foreground">
                  {platform === "extension"
                    ? "Open MetaMask and create a new wallet"
                    : "Open the app and create a new wallet"}
                </p>
                {currentStep === 2 && (
                  <>
                    <div className="mb-6 rounded-md border border-border bg-muted p-5">
                      <h3 className="mb-2 text-sm font-semibold">Save Your Secret Recovery Phrase</h3>
                      <p className="text-sm text-muted-foreground">
                        Write down the 12-word phrase shown during setup. Store it safely—it's the only way to recover
                        your wallet.
                      </p>
                    </div>
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
                        Account Created
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3 */}
            {currentStep >= 3 && (
              <div className="rounded-lg border border-foreground/20 bg-card p-8 transition-all duration-500">
                {!ethPurchased ? (
                  <>
                    <h2 className="mb-3 text-2xl font-semibold">Step 3: Buy Ethereum (ETH)</h2>
                    <p className="mb-6 text-muted-foreground">
                      This button opens MetaMask with the exact ETH amount needed for your purchase.
                    </p>
                    <div className="mb-6 rounded-md border border-border bg-muted p-5">
                      <h3 className="mb-2 text-sm font-semibold">One-Time Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        The first time you buy crypto, you'll need to verify your identity. This only takes a few
                        minutes. After that, future purchases are instant!
                      </p>
                    </div>
                    <div className="space-y-3">
                      {platform === "phone" && (
                        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4">
                          <div className="rounded-lg bg-white p-4">
                            <QRCode value={metamaskBuyLink} size={200} />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            Scan to open MetaMask with prefilled amount
                          </p>
                        </div>
                      )}
                      {platform === "extension" && (
                        <a
                          href={metamaskBuyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Buy ETH in MetaMask
                        </a>
                      )}
                      {platform === "phone" && (
                        <a
                          href={metamaskBuyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-3 rounded-lg bg-foreground px-8 py-6 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 lg:hidden"
                        >
                          Buy ETH in MetaMask
                          <ArrowRight className="h-6 w-6" />
                        </a>
                      )}
                      <p className="text-center text-base text-muted-foreground">
                        Return to this page after purchasing ETH
                      </p>
                      <button
                        onClick={() => setEthPurchased(true)}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-8 py-6 text-lg font-semibold transition-colors hover:bg-accent"
                      >
                        I've Purchased ETH
                        <ArrowRight className="h-6 w-6" />
                      </button>
                      <button
                        onClick={prevStep}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-3 text-2xl font-semibold">Setup Complete!</h2>
                    <p className="mb-6 text-muted-foreground">You're now ready to make purchases using ETH.</p>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowCart(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                      >
                        {platform === "phone" && !isMobile ? "Next" : "Complete Purchase"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEthPurchased(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
    </>
  )
}

export function MetaMaskPaymentFlow(props: {
  orderTotal: number
  merchantWallet: string
  orderId: string
  onPaymentComplete: () => void
  orderDetails?: any
  isLoading: boolean
  isProcessingPayment: boolean
}) {
  return <MetaMaskGuideContent {...props} />
}

export default function MetaMaskGuide() {
  return (
    <PaymentFlowWrapper>
      {(props) => <MetaMaskGuideContent {...props} />}
    </PaymentFlowWrapper>
  )
}
