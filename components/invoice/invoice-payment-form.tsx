"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, CreditCard, AlertCircle } from 'lucide-react'

// Declare Accept.js global
declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: {
          authData: {
            clientKey: string
            apiLoginID: string
          }
          cardData: {
            cardNumber: string
            month: string
            year: string
            cardCode: string
          }
        },
        callback: (response: AcceptJsResponse) => void
      ) => void
    }
  }
}

interface AcceptJsResponse {
  messages: {
    resultCode: 'Ok' | 'Error'
    message: Array<{ code: string; text: string }>
  }
  opaqueData?: {
    dataDescriptor: string
    dataValue: string
  }
}

interface LineItem {
  description: string
  quantity: number
  rate: number
}

interface InvoicePaymentFormProps {
  invoiceId: string
  invoiceNumber: string
  customerEmail?: string
  items: LineItem[]
  subtotal: number
  discount: number
  total: number
  onSuccess: (transactionId: string) => void
  onError: (message: string) => void
  onCancel?: () => void
}

export function InvoicePaymentForm({
  invoiceId,
  invoiceNumber,
  customerEmail,
  items,
  subtotal,
  discount,
  total,
  onSuccess,
  onError,
  onCancel,
}: InvoicePaymentFormProps) {
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [credentials, setCredentials] = useState<{ apiLoginId: string; clientKey: string } | null>(null)

  // Form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const hasDiscount = discount < 0
  const discountAmount = Math.abs(discount)

  // Load Accept.js
  useEffect(() => {
    const loadAcceptJs = () => {
      if (window.Accept) {
        setScriptLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = process.env.NEXT_PUBLIC_AUTHORIZE_NET_ENVIRONMENT === 'sandbox'
        ? 'https://jstest.authorize.net/v1/Accept.js'
        : 'https://js.authorize.net/v1/Accept.js'
      script.async = true
      script.onload = () => setScriptLoaded(true)
      script.onerror = () => {
        setError('Payment system requires a secure connection.')
        setLoading(false)
      }
      document.head.appendChild(script)
    }

    loadAcceptJs()
    fetchCredentials()
  }, [])

  async function fetchCredentials() {
    try {
      const response = await fetch('/api/authorize-net/credentials')
      const data = await response.json()
      if (!response.ok || !data.apiLoginId || !data.clientKey) {
        throw new Error(data.error || 'Failed to load payment credentials')
      }
      setCredentials({ apiLoginId: data.apiLoginId, clientKey: data.clientKey })
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = []
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4))
    }
    return parts.join(' ')
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {}
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    
    if (!cleanCardNumber || cleanCardNumber.length < 13) {
      errors.cardNumber = 'Enter a valid card number'
    }
    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      errors.expiry = 'Invalid expiry'
    }
    const currentYear = new Date().getFullYear() % 100
    if (!expiryYear || parseInt(expiryYear) < currentYear) {
      errors.expiry = 'Invalid expiry'
    }
    if (!cvv || cvv.length < 3) {
      errors.cvv = 'Invalid'
    }
    if (!cardholderName.trim()) {
      errors.cardholderName = 'Enter cardholder name'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    if (!window.Accept || !credentials) {
      setError('Payment system not ready. Please refresh.')
      return
    }

    setProcessing(true)
    setError(null)

    const secureData = {
      authData: {
        clientKey: credentials.clientKey,
        apiLoginID: credentials.apiLoginId,
      },
      cardData: {
        cardNumber: cardNumber.replace(/\s/g, ''),
        month: expiryMonth.padStart(2, '0'),
        year: expiryYear,
        cardCode: cvv,
      },
    }

    window.Accept.dispatchData(secureData, async (response) => {
      if (response.messages.resultCode === 'Error') {
        const errorMessage = response.messages.message[0]?.text || 'Payment failed'
        setError(errorMessage)
        setProcessing(false)
        onError(errorMessage)
        return
      }

      if (!response.opaqueData) {
        setError('Failed to process card')
        setProcessing(false)
        return
      }

      try {
        const paymentResponse = await fetch('/api/authorize-net/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: invoiceId,
            orderNumber: invoiceNumber,
            amount: total,
            customerEmail,
            opaqueData: response.opaqueData,
            cardholderName,
          }),
        })

        const result = await paymentResponse.json()
        if (!paymentResponse.ok || !result.success) {
          throw new Error(result.error || 'Payment failed')
        }

        onSuccess(result.transactionId)
      } catch (err: any) {
        setError(err.message || 'Payment failed')
        onError(err.message || 'Payment failed')
      } finally {
        setProcessing(false)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#888888] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs tracking-[0.2em] text-[#888888] uppercase">Loading Payment</p>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Line Items */}
      <div>
        <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-6">Order Summary</p>
        <div className="divide-y divide-white/5">
          {items.map((item, idx) => (
            <div key={idx} className="py-4 flex justify-between items-start">
              <div>
                <p className="font-serif text-lg font-light text-[#f0f0f0]">{item.description}</p>
                <p className="text-sm text-[#888888]">{item.quantity} × {formatCurrency(item.rate)}</p>
              </div>
              <p className="font-mono text-[#f0f0f0]">{formatCurrency(item.quantity * item.rate)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-white/10 pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#999999]">Subtotal</span>
            <span className="font-mono text-[#f0f0f0]">{formatCurrency(subtotal)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-400 font-medium">Discount</span>
              <span className="font-mono text-emerald-400">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
          <span className="font-mono text-xs tracking-[0.3em] text-[#888888] uppercase">Total Due</span>
          <div className="text-right">
            {hasDiscount && (
              <span className="font-mono text-lg text-[#666666] line-through block mb-1">
                {formatCurrency(subtotal)}
              </span>
            )}
            <span className="font-serif text-3xl font-light text-[#f0f0f0]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="pt-4">
        <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-6">Payment Details</p>
        
        <div className="space-y-5">
          {/* Cardholder Name */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              disabled={processing}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 font-serif text-lg text-[#f0f0f0] placeholder:text-[#555555] focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            {formErrors.cardholderName && (
              <p className="text-red-400 text-xs mt-1.5">{formErrors.cardholderName}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                disabled={processing}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pr-12 font-mono text-lg text-[#f0f0f0] placeholder:text-[#555555] focus:outline-none focus:border-white/30 tracking-wider transition-colors disabled:opacity-50"
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555555]" />
            </div>
            {formErrors.cardNumber && (
              <p className="text-red-400 text-xs mt-1.5">{formErrors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase mb-2">
                Month
              </label>
              <input
                type="text"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="MM"
                maxLength={2}
                disabled={processing}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-lg text-[#f0f0f0] placeholder:text-[#555555] text-center focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase mb-2">
                Year
              </label>
              <input
                type="text"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="YY"
                maxLength={2}
                disabled={processing}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-lg text-[#f0f0f0] placeholder:text-[#555555] text-center focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                disabled={processing}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-lg text-[#f0f0f0] placeholder:text-[#555555] text-center focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
              {formErrors.cvv && (
                <p className="text-red-400 text-xs mt-1.5">{formErrors.cvv}</p>
              )}
            </div>
          </div>
          {formErrors.expiry && (
            <p className="text-red-400 text-xs -mt-3">{formErrors.expiry}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={processing || !scriptLoaded || !credentials}
          className="w-full bg-[#f0f0f0] text-[#0a0a0a] rounded-full py-4 font-mono text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay {formatCurrency(total)}
            </>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#666666]">
          <Lock className="w-3 h-3" />
          <span className="font-mono tracking-wider">256-bit SSL Encrypted</span>
        </div>
      </div>

      {/* Cancel */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="w-full text-[#888888] hover:text-[#f0f0f0] font-mono text-xs tracking-[0.2em] uppercase py-3 transition-colors"
        >
          Cancel Payment
        </button>
      )}
    </motion.form>
  )
}
