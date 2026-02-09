"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2,
  Download,
  Wallet,
  Link2,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Smartphone,
  Monitor,
  Apple,
} from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

interface CryptoSetupGuideProps {
  onComplete: () => void
}

type DeviceType = "ios" | "android" | "desktop" | "unknown"

export function CryptoSetupGuide({ onComplete }: CryptoSetupGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const { connector } = useAccount()
  const [walletName, setWalletName] = useState<string>("")
  const total = useCartStore((state) => state.getTotal())
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown")
  const [showDeviceSelector, setShowDeviceSelector] = useState(false)

  const ETH_PRICE = 3000 // In production, fetch from CoinGecko or similar API
  const gasFeePercentage = 0.0005 // 0.05% for gas fees
  const gasFeeUSD = total * gasFeePercentage
  const totalCostUSD = total + gasFeeUSD
  const ethNeeded = total / ETH_PRICE
  const gasFeeETH = gasFeeUSD / ETH_PRICE
  const ethWithGas = ethNeeded + gasFeeETH

  useEffect(() => {
    const detectDevice = (): DeviceType => {
      const userAgent = navigator.userAgent.toLowerCase()

      if (/iphone|ipad|ipod/.test(userAgent)) {
        return "ios"
      } else if (/android/.test(userAgent)) {
        return "android"
      } else if (/windows|macintosh|linux/.test(userAgent)) {
        return "desktop"
      }

      return "unknown"
    }

    setDeviceType(detectDevice())
  }, [])

  useEffect(() => {
    if (connector) {
      setWalletName(connector.name)
    }
  }, [connector])

  const toggleStep = (step: number) => {
    if (completedSteps.includes(step)) {
      setCompletedSteps(completedSteps.filter((s) => s !== step))
    } else {
      setCompletedSteps([...completedSteps, step])
    }
  }

  const isStepComplete = (step: number) => completedSteps.includes(step)
  const allStepsComplete = completedSteps.length >= 3

  const getCoinbaseAppLink = (device: DeviceType) => {
    // Main Coinbase app (for buying crypto with fiat)
    switch (device) {
      case "ios":
        return "https://apps.apple.com/us/app/coinbase-buy-bitcoin-ether/id886427730"
      case "android":
        return "https://play.google.com/store/apps/details?id=com.coinbase.android"
      case "desktop":
        return "https://www.coinbase.com/signup"
      default:
        return "https://www.coinbase.com/signup"
    }
  }

  const getCoinbaseWalletLink = (device: DeviceType) => {
    // Coinbase Wallet (for connecting to checkout)
    switch (device) {
      case "ios":
        return "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      case "android":
        return "https://play.google.com/store/apps/details?id=org.toshi"
      case "desktop":
        return "https://www.coinbase.com/wallet"
      default:
        return "https://www.coinbase.com/wallet"
    }
  }

  const openCoinbaseBuy = () => {
    const amount = totalCostUSD.toFixed(2)
    const isMobile = deviceType === "ios" || deviceType === "android"
    const buyUrl = `https://www.coinbase.com/buy-ethereum?amount=${amount}&currency=USD`

    if (isMobile) {
      // Mobile: Use location.href to avoid Safari errors during app handoff
      // Coinbase.com will detect mobile and redirect to app if installed
      window.location.href = buyUrl
    } else {
      // Desktop: Open in new tab
      window.open(buyUrl, "_blank")
    }

    toggleStep(2)
  }

  const handleDeviceSelect = (device: DeviceType) => {
    setDeviceType(device)
    setShowDeviceSelector(false)
    window.open(getDownloadLink(device), "_blank")
    toggleStep(1)
  }

  return (
    <div className="space-y-6">
      <Alert className="border-primary/50 bg-primary/5">
        <AlertDescription className="text-base">
          Follow these simple steps to set up your crypto wallet and complete your purchase securely.
        </AlertDescription>
      </Alert>

      <Card className={isStepComplete(1) ? "border-primary/50" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Step 1: Get Coinbase Wallet</CardTitle>
                <CardDescription>Install Coinbase Wallet to connect and pay</CardDescription>
              </div>
            </div>
            {isStepComplete(1) && <CheckCircle2 className="h-6 w-6 text-primary" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Coinbase Wallet (also called "Base") is needed to connect your wallet and pay in Step 3.
          </p>

          {deviceType !== "unknown" && !showDeviceSelector ? (
            <div className="space-y-3">
              <Alert className="border-primary/20 bg-primary/5">
                <AlertDescription className="flex items-center gap-2">
                  {deviceType === "ios" && <Apple className="h-4 w-4" />}
                  {deviceType === "android" && <Smartphone className="h-4 w-4" />}
                  {deviceType === "desktop" && <Monitor className="h-4 w-4" />}
                  <span className="font-medium">
                    Detected device:{" "}
                    {deviceType === "ios" ? "iPhone/iPad" : deviceType === "android" ? "Android" : "Desktop"}
                  </span>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.open(getCoinbaseWalletLink(deviceType), "_blank")
                    toggleStep(1)
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Coinbase Wallet for{" "}
                  {deviceType === "ios" ? "iOS" : deviceType === "android" ? "Android" : "Desktop"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeviceSelector(true)}
                  className="w-full sm:w-auto"
                >
                  Different Device?
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">Choose your device:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => handleDeviceSelect("ios")}
                >
                  <Apple className="h-6 w-6" />
                  <span>iPhone/iPad</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => handleDeviceSelect("android")}
                >
                  <Smartphone className="h-6 w-6" />
                  <span>Android</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
                  onClick={() => handleDeviceSelect("desktop")}
                >
                  <Monitor className="h-6 w-6" />
                  <span>Desktop</span>
                </Button>
              </div>
            </div>
          )}

          {!isStepComplete(1) && (
            <Button variant="ghost" size="sm" onClick={() => toggleStep(1)} className="w-full sm:w-auto">
              I Already Have Coinbase Wallet
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className={isStepComplete(2) ? "border-primary/50" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Step 2: Buy ETH on Coinbase</CardTitle>
                <CardDescription>Use the main Coinbase app (NOT Coinbase Wallet)</CardDescription>
              </div>
            </div>
            {isStepComplete(2) && <CheckCircle2 className="h-6 w-6 text-primary" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-primary bg-primary/5">
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Exact amount needed:</p>
                <div className="space-y-1">
                  <p className="text-5xl font-bold text-primary">${totalCostUSD.toFixed(2)}</p>
                  <p className="text-lg text-muted-foreground">{ethWithGas.toFixed(4)} ETH</p>
                  <div className="text-sm text-muted-foreground space-y-0.5 pt-2">
                    <p>
                      Order total: ${total.toFixed(2)} ({ethNeeded.toFixed(4)} ETH)
                    </p>
                    <p>
                      Gas fee (0.05%): ~${gasFeeUSD.toFixed(2)} ({gasFeeETH.toFixed(6)} ETH)
                    </p>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Buy ETH using the <strong>main Coinbase app</strong> (blue logo), NOT Coinbase Wallet/Base.
            You'll need to download it separately from the wallet.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto bg-[#0052FF] hover:bg-[#0045D1]" onClick={openCoinbaseBuy}>
              <Wallet className="h-4 w-4 mr-2" />
              Buy {ethWithGas.toFixed(4)} ETH on Coinbase
            </Button>
            {!isStepComplete(2) && (
              <Button variant="ghost" size="sm" onClick={() => toggleStep(2)} className="w-full sm:w-auto">
                I Already Have ETH
              </Button>
            )}
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Note:</strong> The amount shown includes 0.05% for estimated gas fees. This ensures your transaction has enough to complete successfully.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className={isStepComplete(3) ? "border-primary/50" : "border-primary/20 bg-primary/5"}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Step 3: Pay with WalletConnect</CardTitle>
                <CardDescription>Connect your wallet and complete payment</CardDescription>
              </div>
            </div>
            {isStepComplete(3) && <CheckCircle2 className="h-6 w-6 text-primary" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            On the payment page, click "Connect Wallet" to link your Coinbase Wallet. The payment
            amount will be pre-filled - just review and confirm the transaction in 2 clicks!
          </p>
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Quick & Easy:</strong> Coinbase Wallet connects instantly via WalletConnect. On
              mobile, it opens your wallet app automatically. On desktop, your browser extension connects seamlessly.
            </AlertDescription>
          </Alert>
          {!isStepComplete(3) && (
            <Button variant="ghost" size="sm" onClick={() => toggleStep(3)} className="w-full sm:w-auto">
              Mark as Complete
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={onComplete} disabled={!allStepsComplete} className="w-full sm:w-auto">
          {allStepsComplete ? (
            <>
              Continue to Payment
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            "Complete All Steps to Continue"
          )}
        </Button>
      </div>
    </div>
  )
}
