"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { 
  Wallet, 
  Smartphone, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Download,
  Shield,
  Zap,
  Users
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileWalletConnectProps {
  onConnect?: () => void
  showEducation?: boolean
}

export function MobileWalletConnect({ onConnect, showEducation = true }: MobileWalletConnectProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const isMobile = useIsMobile()

  // Check if user is new to crypto wallets
  useEffect(() => {
    const hasConnectedBefore = localStorage.getItem('wallet_connected_before')
    const hasSeenOnboarding = localStorage.getItem('wallet_onboarding_seen')
    
    if (!hasConnectedBefore && !hasSeenOnboarding) {
      setIsFirstTime(true)
      setShowOnboarding(true)
    }
  }, [])

  // Mark user as having connected
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('wallet_connected_before', 'true')
      onConnect?.()
    }
  }, [isConnected, address, onConnect])

  const onboardingSteps = [
    {
      title: "Welcome to Crypto Payments! 🚀",
      description: "Pay securely with cryptocurrency using your mobile wallet",
      icon: <Wallet className="h-8 w-8 text-green-accent" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-accent" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-accent" />
            <span>No Credit Card Needed</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-accent" />
            <span>Instant Transactions</span>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Mobile Wallet 📱",
      description: "We recommend Trust Wallet for the best experience",
      icon: <Smartphone className="h-8 w-8 text-blue-accent" />,
      content: (
        <div className="space-y-3">
          <Card className="p-3 border-2 border-green-accent bg-green-accent/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <div>
                <div className="font-medium">Trust Wallet</div>
                <div className="text-sm text-muted-foreground">Recommended</div>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-accent text-black">Best Choice</Badge>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div>
                <div className="font-medium">MetaMask</div>
                <div className="text-sm text-muted-foreground">Alternative option</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <div>
                <div className="font-medium">Coinbase Wallet</div>
                <div className="text-sm text-muted-foreground">Alternative option</div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Get USDC for Payment 💳",
      description: "You'll need USDC (a stable digital dollar) to complete your purchase",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              USDC = US Dollar Coin. It's always worth $1 and is perfect for payments.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-accent" />
              <span className="text-sm">Buy directly in your wallet app</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-accent" />
              <span className="text-sm">Use Coinbase Pay (we'll show you)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-accent" />
              <span className="text-sm">Transfer from exchange</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Connect! 🎉",
      description: "Your wallet will open automatically. Tap 'Connect' to link your wallet.",
      icon: <Shield className="h-8 w-8 text-green-accent" />,
      content: (
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              We never store your wallet info. You stay in complete control.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            After connecting, you can disconnect anytime from your wallet app or here.
          </div>
        </div>
      )
    }
  ]

  const WalletEducationContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Wallet className="h-12 w-12 text-green-accent mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">New to Crypto Wallets?</h3>
        <p className="text-muted-foreground">
          Don't worry! We'll guide you through everything step by step.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-blue-accent mt-0.5" />
            <div>
              <h4 className="font-medium">Trusted by Millions</h4>
              <p className="text-sm text-muted-foreground">
                Over 100 million people use crypto wallets safely every day
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-accent mt-0.5" />
            <div>
              <h4 className="font-medium">Bank-Level Security</h4>
              <p className="text-sm text-muted-foreground">
                Your keys, your crypto. More secure than traditional payments
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Instant Payments</h4>
              <p className="text-sm text-muted-foreground">
                No waiting for bank transfers. Payments settle in seconds
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Button 
        onClick={() => setShowOnboarding(true)} 
        className="w-full !bg-green-accent !text-black hover:!bg-green-accent/90"
      >
        Get Started - Show Me How
      </Button>
    </div>
  )

  const OnboardingDialog = () => {
    const DialogComponent = isMobile ? Drawer : Dialog

    return (
      <DialogComponent open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogComponent>
          {isMobile ? (
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <div className="flex items-center justify-center mb-4">
                  {onboardingSteps[currentStep].icon}
                </div>
                <DrawerTitle>{onboardingSteps[currentStep].title}</DrawerTitle>
                <DrawerDescription>
                  {onboardingSteps[currentStep].description}
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-6">
                {onboardingSteps[currentStep].content}
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-1">
                    {onboardingSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-green-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep < onboardingSteps.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="!bg-green-accent !text-black hover:!bg-green-accent/90"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowOnboarding(false)
                          localStorage.setItem('wallet_onboarding_seen', 'true')
                        }}
                        className="!bg-green-accent !text-black hover:!bg-green-accent/90"
                      >
                        Let's Connect!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DrawerContent>
          ) : (
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  {onboardingSteps[currentStep].icon}
                </div>
                <DialogTitle>{onboardingSteps[currentStep].title}</DialogTitle>
                <DialogDescription>
                  {onboardingSteps[currentStep].description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {onboardingSteps[currentStep].content}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {onboardingSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-green-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep < onboardingSteps.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="!bg-green-accent !text-black hover:!bg-green-accent/90"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowOnboarding(false)
                          localStorage.setItem('wallet_onboarding_seen', 'true')
                        }}
                        className="!bg-green-accent !text-black hover:!bg-green-accent/90"
                      >
                        Let's Connect!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </DialogComponent>
      </DialogComponent>
    )
  }

  if (isConnected) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-accent/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-accent" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Wallet Connected</div>
              <div className="text-sm text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4">
      {showEducation && isFirstTime && !showOnboarding ? (
        <Card>
          <CardContent className="pt-6">
            <WalletEducationContent />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Wallet className="h-8 w-8 text-green-accent mx-auto" />
              <div>
                <h3 className="font-medium mb-1">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your crypto wallet to pay with USDC
                </p>
              </div>
              <ConnectButton />
              
              {showEducation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                  className="text-blue-accent hover:text-blue-accent/80"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Need Help?
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <OnboardingDialog />
    </div>
  )
}
