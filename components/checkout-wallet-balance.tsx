'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Wallet, Plus, Loader2, AlertCircle, Check, RefreshCw,
  ChevronDown, ChevronUp, Zap, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StripeOnRamp } from './stripe-onramp'

interface CheckoutWalletBalanceProps {
  onPayWithWallet?: (walletId: string) => void
  requiredAmount: number
  isPaymentDisabled?: boolean
}

interface WalletData {
  id: string
  label: string
  address: string
  currency: string
  is_primary: boolean
  has_pin: boolean
  has_password: boolean
  has_biometric: boolean
}

export function CheckoutWalletBalance({ 
  onPayWithWallet, 
  requiredAmount,
  isPaymentDisabled = false 
}: CheckoutWalletBalanceProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [usdBalance, setUsdBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [ethPrice, setEthPrice] = useState(3000)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch primary wallet and balance
  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch primary wallet
      const walletResponse = await fetch('/api/customer-wallet/primary')
      const walletData = await walletResponse.json()
      
      if (walletData.success && walletData.wallet) {
        setWallet(walletData.wallet)
        
        // Fetch balance
        await fetchBalance(walletData.wallet.address, walletData.wallet.currency)
      }
    } catch (error) {
      console.log('Failed to fetch wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBalance = async (address: string, currency: string) => {
    try {
      setIsRefreshing(true)
      
      // Fetch ETH price
      try {
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        )
        const priceData = await priceResponse.json()
        setEthPrice(priceData.ethereum?.usd || 3000)
      } catch {
        setEthPrice(3000)
      }
      
      // Fetch balance
      const balanceResponse = await fetch(
        `/api/customer-wallet/balance?address=${address}&currency=${currency}`
      )
      const balanceData = await balanceResponse.json()
      
      if (balanceData.success) {
        setBalance(balanceData.balance || '0')
        const ethBalance = parseFloat(balanceData.balance || '0')
        setUsdBalance(ethBalance * ethPrice)
      }
    } catch (error) {
      console.log('Failed to fetch balance:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    if (wallet) {
      fetchBalance(wallet.address, wallet.currency)
    }
  }

  const handleAddFundsSuccess = () => {
    // Refresh balance after successful funding
    if (wallet) {
      fetchBalance(wallet.address, wallet.currency)
    }
    // Close modal after a brief delay
    setTimeout(() => {
      setShowAddFunds(false)
    }, 2000)
  }

  const hasEnoughBalance = usdBalance >= requiredAmount
  const shortfall = requiredAmount - usdBalance
  const suggestedTopUp = Math.max(50, Math.ceil(shortfall / 10) * 10) // Round up to nearest $10, min $50

  // No wallet - prompt to create one
  if (!isLoading && !wallet) {
    return (
      <div className="rounded-2xl bg-foreground/[0.04] border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-foreground/70 text-sm font-medium">Want faster checkout?</p>
            <p className="text-muted-foreground text-xs">Create a wallet for express payments</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => window.location.href = '/wallet'}
          >
            Set Up
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-foreground/[0.04] border border-border p-4">
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Wallet Balance Card */}
      <div className={cn(
        "rounded-2xl border transition-all duration-300",
        hasEnoughBalance 
          ? "bg-emerald-500/5 border-emerald-500/20" 
          : "bg-amber-500/5 border-amber-500/20"
      )}>
        {/* Main Row - Always Visible */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                hasEnoughBalance ? "bg-emerald-500/20" : "bg-amber-500/20"
              )}>
                <Wallet className={cn(
                  "w-5 h-5",
                  hasEnoughBalance ? "text-emerald-400" : "text-amber-400"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    ${usdBalance.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({parseFloat(balance).toFixed(4)} {wallet?.currency})
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRefresh()
                    }}
                    className="text-muted-foreground hover:text-foreground/60 transition-colors"
                  >
                    <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                  </button>
                </div>
                <p className="text-muted-foreground text-xs">{wallet?.label}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Indicator */}
              {hasEnoughBalance ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Ready
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium bg-amber-500/10 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Need ${shortfall.toFixed(2)} more
                </div>
              )}
              
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border">
                {/* Progress Bar */}
                <div className="pt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="text-foreground font-medium">${requiredAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        hasEnoughBalance 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                      )}
                      style={{ width: `${Math.min(100, (usdBalance / requiredAmount) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!hasEnoughBalance && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddFunds(true)
                      }}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add ${suggestedTopUp}
                    </Button>
                  )}
                  
                  {hasEnoughBalance && onPayWithWallet && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onPayWithWallet(wallet!.id)
                      }}
                      disabled={isPaymentDisabled}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Pay ${requiredAmount.toFixed(2)} Now
                    </Button>
                  )}
                  
                  {hasEnoughBalance && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAddFunds(true)
                      }}
                      variant="outline"
                      className="h-11 rounded-xl border-border text-foreground hover:bg-foreground/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Quick Info */}
                <p className="text-xs text-muted-foreground text-center">
                  {hasEnoughBalance 
                    ? `Pay instantly with ${wallet?.has_biometric ? 'Face ID' : wallet?.has_pin ? 'PIN' : 'password'}`
                    : 'Add funds with credit card or bank transfer'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && wallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddFunds(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Add Funds</h2>
                  <p className="text-muted-foreground text-sm">
                    Add ${shortfall > 0 ? shortfall.toFixed(2) : 'any amount'} to complete your purchase
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <StripeOnRamp
                walletAddress={wallet.address}
                currency={wallet.currency}
                defaultAmount={suggestedTopUp}
                onSuccess={handleAddFundsSuccess}
                onClose={() => setShowAddFunds(false)}
                returnUrl={window.location.href}
                compact
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

