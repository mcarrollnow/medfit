"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import QRCode from "react-qr-code"
import { useIsMobile } from "@/hooks/use-mobile"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"

function TrustWalletGuideContent({ 
  orderTotal, 
  merchantWallet, 
  orderId, 
  onPaymentComplete, 
  orderDetails, 
  isLoading 
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
}) {
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState<"extension" | "phone" | null>(null)
  const [ethPurchased, setEthPurchased] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [amountCopied, setAmountCopied] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showBuyButton, setShowBuyButton] = useState(false)
  const totalSteps = 3

  useEffect(() => {
    console.log("[TrustWallet] isMobile value:", isMobile)
    if (isMobile) {
      console.log("[TrustWallet] Setting platform to phone")
      setPlatform("phone")
    }
  }, [isMobile])

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
  const ethPrice = 3000 // This should come from real-time price feed
  const ethAmount = (orderTotal / ethPrice).toFixed(6)
  const trustWalletBuyLink = `https://link.trustwallet.com/buy?asset=c60&provider=moonpay&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`
  const trustWalletBuyDeepLink = `trust://buy?asset=c60&provider=moonpay&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`

  const buyOptions = [
    {
      id: "moonpay-credit-card",
      name: "Credit Card",
      provider: "MoonPay",
      icon: "💳",
      link: trustWalletBuyLink,
      deepLink: trustWalletBuyDeepLink,
    },
    {
      id: "mercuryo-apple-pay",
      name: "Apple Pay",
      provider: "Mercuryo",
      icon: "🍎",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=mercuryo&payment_method=apple_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=mercuryo&payment_method=apple_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
    {
      id: "mercuryo-google-pay",
      name: "Google Pay",
      provider: "Mercuryo",
      icon: "🔵",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=mercuryo&payment_method=google_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=mercuryo&payment_method=google_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
    {
      id: "mercuryo-credit-card",
      name: "Credit Card",
      provider: "Mercuryo",
      icon: "💳",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=mercuryo&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=mercuryo&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
    {
      id: "ramp-apple-pay",
      name: "Apple Pay",
      provider: "Ramp",
      icon: "🍎",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=ramp&payment_method=apple_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=ramp&payment_method=apple_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
    {
      id: "ramp-google-pay",
      name: "Google Pay",
      provider: "Ramp",
      icon: "🔵",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=ramp&payment_method=google_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=ramp&payment_method=google_pay&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
    {
      id: "ramp-credit-card",
      name: "Credit Card",
      provider: "Ramp",
      icon: "💳",
      link: `https://link.trustwallet.com/buy?asset=c60&provider=ramp&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`,
      deepLink: `trust://buy?asset=c60&provider=ramp&payment_method=credit_card&fiat_currency=USD&fiat_quantity=${orderAmount}`,
    },
  ]

  const trustWalletPaymentLink = `https://link.trustwallet.com/send?asset=c60&address=${merchantWallet}&amount=${ethAmount}`
  const trustWalletPaymentDeepLink = `trust://send?asset=c60&address=${merchantWallet}&amount=${ethAmount}`

  const getTitle = () => {
    if (!platform) return "Get Started with Trust Wallet"
    if (platform === "phone") return "Using Mobile App"
    if (platform === "extension") return "Using Browser Extension"
  }

  const getSubtitle = () => {
    if (!platform) return "Follow these simple steps to set up your crypto wallet"
    if (platform === "phone") return "Follow these simple steps to setup mobile app wallet"
    if (platform === "extension") return "Follow these simple steps to setup browser extension wallet"
  }

  const handleExtensionBuyETH = async () => {
    try {
      const provider = (window as any).trustwallet || (window as any).ethereum
      if (!provider) {
        console.log("[v0] No Trust Wallet provider found")
        window.open("https://trustwallet.com/browser-extension", "_blank")
        return
      }

      console.log("[v0] Requesting accounts...")
      const accounts = await provider.request({ method: "eth_requestAccounts" })
      console.log("[v0] Accounts:", accounts)

      const transactionParameters = {
        to: merchantWallet,
        from: accounts[0],
        value: "0x" + (parseFloat(ethAmount) * 1e18).toString(16), // ETH in hex Wei
      }

      console.log("[TrustWallet] Sending transaction:", transactionParameters)
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })
      console.log("[TrustWallet] Transaction hash:", txHash)
      // Trigger verification flow after successful transaction
      onPaymentComplete()
    } catch (error: any) {
      console.log("[TrustWallet] Error sending transaction:", error.message)
    }
  }

  const copyOrderAmount = async () => {
    try {
      await navigator.clipboard.writeText(orderAmount.toString())
      setAmountCopied(true)
      if (isMobile && platform === "phone") {
        setShowBuyButton(true)
      }
      setTimeout(() => setAmountCopied(false), 3000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleBuyETH = (option: any) => {
    setSelectedPayment(option.id)
    window.location.href = option.deepLink
    setTimeout(() => {
      window.open(option.link, "_blank")
    }, 500)
  }

  return (
    <>
      <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/trust-wallet-logo.svg"
              alt="Trust Wallet logo"
              width={200}
              height={100}
              className="h-auto w-40 sm:w-48 lg:w-52 object-contain"
            />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{getTitle()}</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{getSubtitle()}</p>
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
              <div className="mb-6 rounded-md border border-border bg-muted p-5">
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
                      <QRCode value={trustWalletPaymentLink} size={200} />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">Scan to send payment to wallet</p>
                  </div>
                  {showBuyButton ? ( // Added condition to show the button only if showBuyButton is true
                    <a
                      href={trustWalletPaymentDeepLink}
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = trustWalletPaymentDeepLink
                        setTimeout(() => {
                          window.location.href = trustWalletPaymentLink
                        }, 500)
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 lg:hidden"
                    >
                      Make Payment
                    </a>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">Please copy the order amount first</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleExtensionBuyETH}
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
                <h2 className="mb-3 text-2xl font-semibold">Step 1: Download Trust Wallet</h2>
                {!isMobile && <p className="mb-6 text-muted-foreground">Choose your platform to get started</p>}
                {isMobile && <p className="mb-6 text-muted-foreground">Tap the button below to download</p>}
                {currentStep === 1 && (
                  <>
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
                          href="https://trustwallet.com/browser-extension"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                        >
                          Download Trust Wallet Extension
                        </a>
                        <p className="text-center text-sm text-muted-foreground">
                          After installing, return to this page to continue
                        </p>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          I've Installed Trust Wallet
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {platform === "phone" && (
                      <div className="space-y-3">
                        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                          <div className="rounded-lg bg-white p-4">
                            <QRCode value="https://trustwallet.com/download" size={200} />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            Scan to download Trust Wallet on your phone
                          </p>
                        </div>
                        <a
                          href="https://trustwallet.com/download"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 lg:hidden"
                        >
                          Download Trust Wallet
                        </a>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          I've Downloaded Trust Wallet
                          <ArrowRight className="h-4 w-4" />
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
                    ? "Open Trust Wallet and create a new wallet"
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
                    <h2 className="mb-3 text-2xl font-bold">Step 3: Buy Ethereum</h2>
                    <p className="mb-6 text-muted-foreground">
                      Purchase the required amount of ETH to complete your order
                    </p>

                    <div className="mb-6 rounded-md border border-border bg-muted p-6">
                      <h3 className="mb-3 text-sm font-semibold text-center">Amount to Purchase</h3>
                      <div
                        onClick={copyOrderAmount}
                        className={`cursor-pointer rounded-md border border-border bg-background p-6 text-center transition-all ${
                          amountCopied ? "border-green-500 bg-green-50" : "hover:border-foreground/40"
                        }`}
                      >
                        <div className="text-sm text-muted-foreground mb-2">
                          {amountCopied ? "Copied!" : "Tap to copy"}
                        </div>
                        <div className="text-4xl font-bold">${orderAmount}</div>
                      </div>
                    </div>

                    {isMobile && platform === "phone" ? (
                      <div className="space-y-4">
                        {showBuyButton ? (
                          <>
                            <a
                              href={trustWalletBuyDeepLink}
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = trustWalletBuyDeepLink
                                setTimeout(() => {
                                  window.open(trustWalletBuyLink, "_blank")
                                }, 500)
                              }}
                              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#48ff91] px-6 py-4 text-sm font-medium text-black transition-colors hover:bg-[#48ff91]/90"
                            >
                              Buy ETH
                            </a>
                            <p className="text-center text-sm text-muted-foreground">
                              Amount may be filled, delete then paste or type in ${orderAmount}
                            </p>
                            <p className="text-center text-sm text-muted-foreground">
                              After purchasing, navigate back to this page and tap Next
                            </p>
                          </>
                        ) : (
                          <p className="text-center text-sm text-muted-foreground">
                            Tap the amount above to copy, then the button will appear
                          </p>
                        )}
                      </div>
                    ) : !isMobile && platform === "phone" ? (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-muted p-6">
                          <div className="rounded-lg bg-white p-4">
                            <QRCode value={trustWalletBuyLink} size={200} />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">Scan to buy ETH</p>
                          <p className="text-center text-sm text-muted-foreground">
                            Amount may be filled, delete then paste or type in ${orderAmount}
                          </p>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                          After completing your purchase, return to this page
                        </p>
                      </div>
                    ) : platform === "extension" ? (
                      <div className="space-y-4">
                        <div className="rounded-md border border-border bg-muted p-5">
                          <div className="mb-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <Image src="/trust-shield.svg" alt="Trust Wallet" width={32} height={32} />
                              <span className="text-sm">Tap Trust Wallet Extension</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#48ff91]">
                                <svg
                                  className="text-black"
                                  fill="none"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M21.25 11.25H13.75V3.75C13.75 3.06 13.19 2.5 12.5 2.5C11.81 2.5 11.25 3.06 11.25 3.75V11.25H3.75C3.06 11.25 2.5 11.81 2.5 12.5C2.5 13.19 3.06 13.75 3.75 13.75H11.25V21.25C11.25 21.94 11.81 22.5 12.5 22.5C13.19 22.5 13.75 21.94 13.75 21.25V13.75H21.25C21.94 13.75 22.5 13.19 22.5 12.5C22.5 11.81 21.94 11.25 21.25 11.25Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <span className="text-sm">Tap Fund Button</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#48ff91]/25">
                                <svg
                                  className="text-[#48ff91]"
                                  fill="none"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M17.5 4.16675H2.5V6.66675H17.5V4.16675ZM17.5 8.75008H2.5V15.8334H17.5V8.75008ZM5 10.8334H9.16667V12.9167H5V10.8334ZM12.9167 10.8334H10.8333V12.9167H12.9167V10.8334Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <span className="text-sm">Tap Buy Crypto</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <img
                                alt="MoonPay"
                                className="h-8 w-8 rounded-full border object-contain"
                                src="https://trustwallet.com/assets/images/payments/moonpay.png"
                              />
                              <span className="text-sm">
                                Find the provider you prefer, displayed rates help you find the best deal
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Image src="/id-verification-icon.svg" alt="ID Verification" width={32} height={32} />
                              <span className="text-sm">
                                Complete verification and then purchase this amount needed to complete your order
                              </span>
                            </div>
                          </div>
                          <div
                            onClick={copyOrderAmount}
                            className={`mb-4 cursor-pointer rounded-md border border-border bg-background p-4 text-center transition-all ${
                              amountCopied ? "border-green-500 bg-green-50" : "hover:border-foreground/40"
                            }`}
                          >
                            <div className="text-xs text-muted-foreground mb-1">
                              {amountCopied ? "Copied!" : "Tap to copy"}
                            </div>
                            <div className="text-2xl font-bold">${orderAmount}</div>
                          </div>
                          <p className="text-xs italic text-muted-foreground">
                            To save time in future use the same provider. All providers require verification.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => setEthPurchased(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
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
                        Next
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

export default function TrustWalletGuide() {
  return (
    <PaymentFlowWrapper>
      {(props) => <TrustWalletGuideContent {...props} />}
    </PaymentFlowWrapper>
  )
}
