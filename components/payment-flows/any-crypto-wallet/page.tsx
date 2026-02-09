"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import QRCode from "react-qr-code"
import { useIsMobile } from "@/hooks/use-mobile"

export default function OtherCryptoWalletGuide() {
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState<"extension" | "phone" | null>(null)
  const [ethPurchased, setEthPurchased] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const totalSteps = 3

  useEffect(() => {
    console.log("[v0] isMobile value:", isMobile)
    if (isMobile) {
      console.log("[v0] Setting platform to phone")
      setPlatform("phone")
    }
    // Platform remains null on desktop so users can choose
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

  const walletAddress = "0x4e394e25050793016192E9BE1Ed6BE27a1B27c54"
  const orderTotal = 90 // Total in USD
  const ethAmount = "0.03" // Placeholder - will be calculated via CoinGecko API
  const ethAmountInWei = Math.floor(Number.parseFloat(ethAmount) * 1e18).toString()

  const ethPaymentDeepLink = `ethereum:${walletAddress}@1?value=${ethAmountInWei}`
  const ethPaymentLink = `https://etherscan.io/address/${walletAddress}`

  const getTitle = () => {
    if (!platform) return "Get Started with Your Crypto Wallet"
    if (platform === "phone") return "Using Mobile Wallet"
    if (platform === "extension") return "Using Browser Extension"
  }

  const getSubtitle = () => {
    if (!platform) return "Follow these simple steps to set up your crypto wallet"
    if (platform === "phone") return "Follow these simple steps to setup mobile wallet"
    if (platform === "extension") return "Follow these simple steps to setup browser extension wallet"
  }

  const handleMakePayment = async () => {
    if (platform === "extension") {
      const provider = (window as any).ethereum
      if (provider) {
        try {
          const accounts = await provider.request({ method: "eth_requestAccounts" })

          const transactionParameters = {
            to: walletAddress,
            from: accounts[0],
            value: "0x" + Number.parseInt(ethAmountInWei).toString(16),
          }

          const txHash = await provider.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
          })

          console.log("[v0] Transaction sent:", txHash)
        } catch (error) {
          console.error("[v0] Error sending transaction:", error)
        }
      }
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
          Back to Guides
        </Link>

        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/any-crypto-wallet-logo.svg"
              alt="Any Crypto Wallet logo"
              width={300}
              height={80}
              className="h-auto w-[300px] object-contain"
            />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">{getTitle()}</h1>
          <p className="text-lg text-muted-foreground">{getSubtitle()}</p>
        </div>

        {!showCart && (
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
        )}

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
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {platform === "phone" ? (
                <div className="space-y-4">
                  <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4 lg:rounded-md lg:border lg:border-border lg:bg-muted lg:p-6">
                    <div className="rounded-lg bg-white p-4">
                      <QRCode value={ethPaymentDeepLink} size={200} />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">Scan to send payment to wallet</p>
                  </div>
                  <a
                    href={ethPaymentDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 lg:hidden"
                  >
                    Make Payment
                  </a>
                  <button
                    onClick={() => alert("Order Complete! Thank you for your purchase.")}
                    className="hidden w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent lg:flex"
                  >
                    Complete Order
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleMakePayment}
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
                <h2 className="mb-3 text-2xl font-semibold">Step 1: Choose Your Wallet</h2>
                {!isMobile && <p className="mb-6 text-muted-foreground">Select your platform to get started</p>}
                {isMobile && <p className="mb-6 text-muted-foreground">Download your preferred Ethereum wallet</p>}
                {currentStep === 1 && (
                  <>
                    {!platform && (
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
                      <div className="space-y-4">
                        <div className="rounded-md border border-border bg-muted p-5">
                          <h3 className="mb-3 text-sm font-semibold">Popular Ethereum Wallets</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Coinbase Wallet</li>
                            <li>• Rainbow Wallet</li>
                            <li>• Phantom</li>
                            <li>• Rabby Wallet</li>
                            <li>• And many more...</li>
                          </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Install your preferred Ethereum-compatible wallet extension from your browser's extension
                          store.
                        </p>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          I've Installed My Wallet
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {platform === "phone" && (
                      <div className="space-y-4">
                        <div className="rounded-md border border-border bg-muted p-5">
                          <h3 className="mb-3 text-sm font-semibold">Popular Ethereum Wallets</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Coinbase Wallet</li>
                            <li>• Rainbow Wallet</li>
                            <li>• Phantom</li>
                            <li>• Argent</li>
                            <li>• And many more...</li>
                          </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Download your preferred Ethereum-compatible wallet app from the App Store or Google Play.
                        </p>
                        <button
                          onClick={nextStep}
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          I've Downloaded My Wallet
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
                    ? "Open your wallet and create a new account"
                    : "Open the app and create a new wallet"}
                </p>
                {currentStep === 2 && (
                  <>
                    <div className="mb-6 rounded-md border border-border bg-muted p-5">
                      <h3 className="mb-2 text-sm font-semibold">Save Your Secret Recovery Phrase</h3>
                      <p className="text-sm text-muted-foreground">
                        Write down the 12 or 24-word phrase shown during setup. Store it safely—it's the only way to
                        recover your wallet.
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
                    <h2 className="mb-3 text-2xl font-semibold">Step 3: Fund Your Wallet</h2>
                    <p className="mb-6 text-muted-foreground">Add Ethereum to your wallet to complete purchases.</p>
                    <div className="mb-6 space-y-4">
                      <div className="rounded-md border border-border bg-muted p-5">
                        <h3 className="mb-2 text-sm font-semibold">Option 1: Buy in Wallet</h3>
                        <p className="text-sm text-muted-foreground">
                          Most wallets have a built-in "Buy" feature that lets you purchase ETH with a credit card or
                          bank transfer.
                        </p>
                      </div>
                      <div className="rounded-md border border-border bg-muted p-5">
                        <h3 className="mb-2 text-sm font-semibold">Option 2: Transfer from Exchange</h3>
                        <p className="text-sm text-muted-foreground">
                          If you already have ETH on an exchange (Coinbase, Kraken, etc.), you can transfer it to your
                          wallet address.
                        </p>
                      </div>
                      <div className="rounded-md border border-border bg-muted p-5">
                        <h3 className="mb-2 text-sm font-semibold">One-Time Verification</h3>
                        <p className="text-sm text-muted-foreground">
                          The first time you buy crypto, you'll need to verify your identity. This only takes a few
                          minutes. After that, future purchases are instant!
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-center text-sm text-muted-foreground">
                        Return to this page after funding your wallet
                      </p>
                      <button
                        onClick={() => setEthPurchased(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        I've Funded My Wallet
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
                        Complete Purchase
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
      </div>
    </div>
  )
}
