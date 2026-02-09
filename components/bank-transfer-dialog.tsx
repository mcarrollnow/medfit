"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle2, AlertCircle } from "lucide-react"

interface BankTransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  orderNumber?: string
}

export function BankTransferDialog({ open, onOpenChange, total, orderNumber }: BankTransferDialogProps) {
  const [pin, setPin] = useState("")
  const [pinVerified, setPinVerified] = useState(false)
  const [error, setError] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Bank information from environment variables
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "Your Bank Name"
  const accountNumber = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || "1234567890"
  const routingNumber = process.env.NEXT_PUBLIC_ROUTING_NUMBER || "987654321"

  const orderRef = orderNumber || `ORD-${Date.now()}`

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === "1234") {
      setPinVerified(true)
      setError("")
    } else {
      setError("Invalid PIN. Please try again.")
      setPin("")
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleClose = () => {
    setPin("")
    setPinVerified(false)
    setError("")
    setCopiedField(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay by Bank Transfer</DialogTitle>
          <DialogDescription>
            {!pinVerified
              ? "Enter your PIN to view bank transfer details"
              : "Use the information below to complete your bank transfer"}
          </DialogDescription>
        </DialogHeader>

        {!pinVerified ? (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="pin">PIN Code</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">For testing, use PIN: 1234</p>
            </div>

            <Button type="submit" className="w-full">
              Verify PIN
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-accent bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertDescription>
                <span className="font-medium">Transfer Amount: ${total.toFixed(2)}</span>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <div className="flex gap-2">
                  <Input value={bankName} readOnly className="flex-1" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(bankName, "bank")}>
                    {copiedField === "bank" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="flex gap-2">
                  <Input value={accountNumber} readOnly className="flex-1" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(accountNumber, "account")}>
                    {copiedField === "account" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Routing Number</Label>
                <div className="flex gap-2">
                  <Input value={routingNumber} readOnly className="flex-1" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(routingNumber, "routing")}>
                    {copiedField === "routing" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Order Reference - for memo</Label>
                <div className="flex gap-2">
                  <Input value={orderRef} readOnly className="flex-1 font-mono" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(orderRef, "order")}>
                    {copiedField === "order" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Important:</strong> Please include your order reference <strong>{orderRef}</strong> in the
                transfer memo. After completing the transfer, your order will be processed within 1-2 business days.
              </AlertDescription>
            </Alert>

            <Button onClick={handleClose} className="w-full bg-transparent" variant="outline">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
