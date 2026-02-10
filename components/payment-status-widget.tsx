'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Loader, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'

interface PaymentData {
  orderId: string
  orderNumber: string
  amount: string
  currency: string
  timestamp: number
}

type PaymentState = 'waiting' | 'detected' | 'confirmed' | 'failed'

export function PaymentStatusWidget() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [state, setState] = useState<PaymentState>('waiting')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const checkPayment = () => {
      const data = localStorage.getItem('active_payment')
      if (data) {
        try {
          const payment = JSON.parse(data) as PaymentData
          setPaymentData(payment)
          setIsVisible(true)
        } catch (e) {
          console.error('[Payment Widget] Failed to parse payment data:', e)
        }
      }
    }

    checkPayment()
    
    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', checkPayment)
    
    return () => window.removeEventListener('storage', checkPayment)
  }, [])

  // Poll for payment verification
  useEffect(() => {
    if (!paymentData) return

    let pollInterval: NodeJS.Timeout

    const pollPayment = async () => {
      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('sb-bteugdayafihvdzhpnlv-auth-token')
        const authData = token ? JSON.parse(token) : null
        const accessToken = authData?.access_token
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${siteConfig.appUrl}/api`}/orders/verify-payment`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
          },
          body: JSON.stringify({ orderId: paymentData.orderId })
        })

        if (!response.ok) {
          console.error('[Payment Widget] Verify failed:', response.status)
          return
        }

        const data = await response.json()

        if (data.paymentState === 'detected' && state === 'waiting') {
          setState('detected')
        }

        if (data.verified && data.paymentState === 'confirmed') {
          setState('confirmed')
          clearInterval(pollInterval)
          
          // Clear after showing success for 3 seconds
          setTimeout(() => {
            handleClose()
          }, 3000)
        }

        // Check for failure (timeout after 30 minutes)
        const elapsed = Date.now() - paymentData.timestamp
        if (elapsed > 30 * 60 * 1000 && state === 'waiting') {
          setState('failed')
          clearInterval(pollInterval)
        }

      } catch (error) {
        console.error('[Payment Widget] Poll error:', error)
      }
    }

    // Poll every 5 seconds
    pollPayment()
    pollInterval = setInterval(pollPayment, 5000)

    return () => clearInterval(pollInterval)
  }, [paymentData, state])

  const handleClose = () => {
    localStorage.removeItem('active_payment')
    setIsVisible(false)
    setPaymentData(null)
  }

  if (!isVisible || !paymentData) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 animate-in slide-in-from-bottom-5">
      {/* Minimized View */}
      {isMinimized ? (
        <div className="bg-card border-2 border-primary/60 rounded-lg p-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {state === 'waiting' && <Clock className="w-4 h-4 text-primary animate-pulse" />}
              {state === 'detected' && <Loader className="w-4 h-4 text-primary animate-spin" />}
              {state === 'confirmed' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {state === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
              <span className="text-sm font-medium text-foreground">
                {state === 'waiting' && 'Processing Payment'}
                {state === 'detected' && 'Confirming...'}
                {state === 'confirmed' && 'Payment Confirmed!'}
                {state === 'failed' && 'Payment Timeout'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 hover:bg-secondary rounded transition"
              >
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              </button>
              {(state === 'confirmed' || state === 'failed') && (
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-secondary rounded transition"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Expanded View */
        <div className="bg-card border-2 border-primary/60 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-secondary/50 px-4 py-2 flex items-center justify-between border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Payment Status</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {(state === 'confirmed' || state === 'failed') && (
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-700 rounded transition"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {state === 'waiting' && <Clock className="w-8 h-8 text-primary animate-pulse" />}
                {state === 'detected' && <Loader className="w-8 h-8 text-primary animate-spin" />}
                {state === 'confirmed' && <CheckCircle className="w-8 h-8 text-green-500" />}
                {state === 'failed' && <AlertCircle className="w-8 h-8 text-red-500" />}
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              {state === 'waiting' && (
                <>
                  <p className="text-lg font-semibold text-foreground mb-1">Checking Blockchain</p>
                  <p className="text-sm text-muted-foreground">Waiting for payment...</p>
                </>
              )}
              
              {state === 'detected' && (
                <>
                  <p className="text-lg font-semibold text-primary mb-1">Payment Detected!</p>
                  <p className="text-sm text-muted-foreground">Confirming transaction...</p>
                </>
              )}
              
              {state === 'confirmed' && (
                <>
                  <p className="text-lg font-semibold text-green-500 mb-1">Payment Confirmed!</p>
                  <p className="text-sm text-muted-foreground">Order processing...</p>
                </>
              )}

              {state === 'failed' && (
                <>
                  <p className="text-lg font-semibold text-red-500 mb-1">Payment Timeout</p>
                  <p className="text-sm text-muted-foreground">Please contact support</p>
                </>
              )}
            </div>

            {/* Amount */}
            <div className="text-center py-2 bg-secondary/50 rounded-lg">
              <p className="text-xl font-bold text-foreground">
                {paymentData.amount} {paymentData.currency}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Order: {paymentData.orderNumber}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${
                state === 'waiting' ? 'bg-primary scale-110' : 'bg-green-500'
              }`} />
              <div className="w-12 h-0.5 bg-gray-700" />
              <div className={`w-3 h-3 rounded-full transition-all ${
                state === 'detected' ? 'bg-primary scale-110' : 
                state === 'confirmed' ? 'bg-green-500' : 'bg-gray-700'
              }`} />
              <div className="w-12 h-0.5 bg-gray-700" />
              <div className={`w-3 h-3 rounded-full transition-all ${
                state === 'confirmed' ? 'bg-green-500 scale-110' : 'bg-gray-700'
              }`} />
            </div>

            {/* View Order Button */}
            {state === 'confirmed' && (
              <Button
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl}/dashboard`
                }}
                className="w-full"
                variant="default"
              >
                View Order
              </Button>
            )}

            {/* Retry Button */}
            {state === 'failed' && (
              <Button
                onClick={handleClose}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
