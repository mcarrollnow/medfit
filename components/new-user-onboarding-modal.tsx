"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Shield, Wallet, ArrowRight, AlertTriangle, Info } from "lucide-react"

interface NewUserOnboardingModalProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
  orderAmount: number
}

export function NewUserOnboardingModal({ open, onClose, onComplete, orderAmount }: NewUserOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step completed - call onComplete to proceed to payment
      onComplete()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Get Started with MetaMask
            </h2>
            <p className="text-base text-muted-foreground mt-2">
              Follow these simple steps to set up your crypto wallet
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Steps Container */}
          <div className="space-y-4">
            {/* Step 1: Download MetaMask */}
            {currentStep >= 1 && (
              <div
                className={`rounded-xl border border-border bg-card p-5 transition-all duration-500 ${
                  currentStep === 1 ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "opacity-50"
                }`}
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {currentStep > 1 ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Download className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">Step 1: Download MetaMask</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      MetaMask is a secure crypto wallet available on iOS and Android. Download it from the App Store to
                      get started.
                    </p>
                    {currentStep === 1 && (
                      <div className="space-y-3">
                        <a
                          href="https://apps.apple.com/us/app/metamask/id1438144202"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                        >
                          <Download className="h-5 w-5" />
                          Download from App Store
                        </a>
                        <Button
                          onClick={nextStep}
                          className="w-full"
                          variant="secondary"
                        >
                          I've Downloaded MetaMask
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Create Account */}
            {currentStep >= 2 && (
              <div
                className={`rounded-xl border border-border bg-card p-5 transition-all duration-500 ${
                  currentStep === 2 ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "opacity-50"
                }`}
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {currentStep > 2 ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">Step 2: Create Your Account</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Open the MetaMask app and follow the prompts to create a new wallet.
                    </p>
                    {currentStep === 2 && (
                      <>
                        <div className="mb-4 space-y-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                            <div>
                              <h4 className="mb-1 text-sm font-semibold text-destructive">
                                Critical: Save Your Secret Recovery Phrase
                              </h4>
                              <p className="text-xs text-destructive/90">
                                MetaMask will show you a 12-word Secret Recovery Phrase. Write it down and store it
                                somewhere safe. This is the ONLY way to recover your wallet if you lose access.
                              </p>
                            </div>
                          </div>
                        </div>
                        <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            Open MetaMask and tap "Create a new wallet"
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            Create a strong password
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            Write down your 12-word Secret Recovery Phrase
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            Confirm your phrase to complete setup
                          </li>
                        </ul>
                        <Button
                          onClick={nextStep}
                          className="w-full"
                          variant="secondary"
                        >
                          I've Created My Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Buy Ethereum */}
            {currentStep >= 3 && (
              <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-primary/20 ring-2 ring-primary transition-all duration-500">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">Step 3: Buy Ethereum (ETH)</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      You're ready to purchase ETH! Tap the button below to open MetaMask and start your purchase.
                    </p>
                    <div className="mb-4 space-y-3 rounded-lg border border-primary/50 bg-primary/10 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Recommended Amount</h4>
                          <p className="text-xs text-muted-foreground">
                            For your ${orderAmount.toFixed(2)} order, we recommend buying at least ${(orderAmount + 10).toFixed(2)} 
                            worth of ETH to cover your order plus gas fees (transaction costs).
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <a
                        href="metamask://buy"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                      >
                        <Wallet className="h-5 w-5" />
                        Buy ETH in MetaMask
                      </a>
                      <Button
                        onClick={nextStep}
                        className="w-full"
                        variant="secondary"
                      >
                        I've Purchased ETH - Continue to Payment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      This will open the MetaMask app on your device
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip - I Already Have MetaMask
            </Button>
            <p className="text-xs text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
