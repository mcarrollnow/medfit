"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  paymentUrl: string
  onWalletSelected: (wallet: string) => void
}

const wallets = [
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Recommended',
    color: 'bg-blue-500'
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Popular choice',
    color: 'bg-orange-500'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Easy to use',
    color: 'bg-blue-600'
  }
]

export function WalletConnectModal({ 
  isOpen, 
  onClose, 
  paymentUrl,
  onWalletSelected 
}: WalletConnectModalProps) {
  
  const handleWalletClick = (walletId: string) => {
    // Open payment URL
    window.location.href = paymentUrl
    
    // Notify parent component
    onWalletSelected(walletId)
    
    // Close modal
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Select Wallet</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose your preferred wallet to complete payment
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id)}
              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary transition-all hover:bg-accent/50 flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-full ${wallet.color} flex items-center justify-center text-2xl`}>
                {wallet.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-lg">{wallet.name}</div>
                <div className="text-sm text-muted-foreground">{wallet.description}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            By connecting, you'll be redirected to your wallet to approve the payment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
