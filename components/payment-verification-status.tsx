"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface PaymentVerificationStatusProps {
  orderId: string
  expectedAmount: string
  expectedCurrency: string
  onVerified: (txHash: string) => void
}

type PaymentState = 'waiting' | 'detected' | 'confirmed'

export function PaymentVerificationStatus({ 
  orderId, 
  expectedAmount, 
  expectedCurrency,
  onVerified 
}: PaymentVerificationStatusProps) {
  const [state, setState] = useState<PaymentState>('waiting')
  const [txHash, setTxHash] = useState<string | null>(null)

  // Poll for payment verification
  useEffect(() => {
    let pollInterval: NodeJS.Timeout

    const pollPayment = async () => {
      try {
        // Get auth session for authentication
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.error('[Payment Verification] No active session')
          return
        }

        const response = await fetch('/api/orders/verify-payment', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ orderId })
        })

        if (!response.ok) {
          console.error('[Payment Verification] Request failed:', response.status)
          return
        }

        const data = await response.json()

        if (data.paymentState === 'detected' && state === 'waiting') {
          setState('detected')
          setTxHash(data.transactionHash)
        }

        if (data.verified && data.paymentState === 'confirmed') {
          setState('confirmed')
          setTxHash(data.transactionHash)
          clearInterval(pollInterval)
          
          // Call success callback
          setTimeout(() => onVerified(data.transactionHash), 1500)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
      }
    }

    // Poll every 5 seconds
    pollPayment()
    pollInterval = setInterval(pollPayment, 5000)

    return () => clearInterval(pollInterval)
  }, [orderId, state, onVerified])

  return (
    <Card className="border-2 border-primary">
      <CardContent className="pt-12 pb-12 text-center space-y-6">
        
        {/* Simple Icon */}
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          {state === 'waiting' && <Clock className="w-10 h-10 text-primary animate-pulse" />}
          {state === 'detected' && <Loader2 className="w-10 h-10 text-primary animate-spin" />}
          {state === 'confirmed' && <CheckCircle2 className="w-10 h-10 text-green-600" />}
        </div>

        {/* Status Text */}
        <div>
          {state === 'waiting' && (
            <>
              <h2 className="text-2xl font-bold mb-2">Checking Blockchain</h2>
              <p className="text-muted-foreground">Waiting for {expectedAmount} {expectedCurrency}</p>
            </>
          )}
          
          {state === 'detected' && (
            <>
              <h2 className="text-2xl font-bold mb-2">Payment Detected</h2>
              <p className="text-muted-foreground">Confirming...</p>
            </>
          )}
          
          {state === 'confirmed' && (
            <>
              <h2 className="text-2xl font-bold mb-2 text-green-600">Payment Confirmed</h2>
              <p className="text-muted-foreground">Transaction verified</p>
            </>
          )}
        </div>

        {/* Simple Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`w-3 h-3 rounded-full ${state === 'waiting' ? 'bg-primary' : 'bg-green-500'}`} />
          <div className="w-8 h-0.5 bg-muted" />
          <div className={`w-3 h-3 rounded-full ${state === 'detected' || state === 'confirmed' ? 'bg-primary' : 'bg-muted'}`} />
          <div className="w-8 h-0.5 bg-muted" />
          <div className={`w-3 h-3 rounded-full ${state === 'confirmed' ? 'bg-green-500' : 'bg-muted'}`} />
        </div>

      </CardContent>
    </Card>
  )
}
