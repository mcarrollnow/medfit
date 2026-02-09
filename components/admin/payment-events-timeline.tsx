'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Receipt,
  RefreshCw,
  ExternalLink
} from 'lucide-react'

interface PaymentEvent {
  id: string
  stripe_event_id: string
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  event_type: string
  status: string
  amount: number | null
  currency: string | null
  failure_code: string | null
  failure_message: string | null
  payment_method_type: string | null
  payment_method_last4: string | null
  payment_method_brand: string | null
  customer_email: string | null
  receipt_url: string | null
  event_timestamp: string
  created_at: string
}

interface PaymentEventsTimelineProps {
  orderId: string
}

const getEventIcon = (status: string) => {
  switch (status) {
    case 'succeeded':
      return <CheckCircle className="w-5 h-5 text-emerald-400" />
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-400" />
    case 'canceled':
    case 'expired':
      return <XCircle className="w-5 h-5 text-orange-400" />
    case 'requires_action':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    case 'refunded':
      return <Receipt className="w-5 h-5 text-blue-400" />
    default:
      return <Clock className="w-5 h-5 text-white/50" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'succeeded':
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
    case 'failed':
      return 'bg-red-500/20 border-red-500/30 text-red-400'
    case 'canceled':
    case 'expired':
      return 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    case 'requires_action':
      return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    case 'refunded':
      return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    default:
      return 'bg-white/10 border-white/20 text-white/60'
  }
}

const formatEventType = (eventType: string) => {
  const typeMap: Record<string, string> = {
    'payment_intent.succeeded': 'Payment Completed',
    'payment_intent.payment_failed': 'Payment Failed',
    'payment_intent.canceled': 'Payment Canceled',
    'payment_intent.requires_action': 'Action Required',
    'checkout.session.completed': 'Checkout Completed',
    'checkout.session.expired': 'Checkout Expired',
    'charge.succeeded': 'Charge Succeeded',
    'charge.failed': 'Charge Failed',
    'charge.refunded': 'Payment Refunded',
  }
  return typeMap[eventType] || eventType.replace(/_/g, ' ').replace(/\./g, ' - ')
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

const formatAmount = (amount: number | null, currency: string | null) => {
  if (!amount) return null
  const dollars = amount / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(dollars)
}

const formatCardBrand = (brand: string | null) => {
  if (!brand) return null
  const brandMap: Record<string, string> = {
    'visa': 'Visa',
    'mastercard': 'Mastercard',
    'amex': 'American Express',
    'discover': 'Discover',
    'diners': 'Diners Club',
    'jcb': 'JCB',
    'unionpay': 'UnionPay'
  }
  return brandMap[brand.toLowerCase()] || brand
}

export function PaymentEventsTimeline({ orderId }: PaymentEventsTimelineProps) {
  const [events, setEvents] = useState<PaymentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/orders/${orderId}/payment-events`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch payment events')
      }

      const data = await response.json()
      setEvents(data)
    } catch (err) {
      console.error('Error fetching payment events:', err)
      setError(err instanceof Error ? err.message : 'Failed to load payment events')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
        <div className="relative z-10 flex items-center justify-center py-8">
          <RefreshCw className="w-5 h-5 animate-spin text-white/40 mr-3" />
          <span className="text-white/40">Loading payment history...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
        <div className="relative z-10 text-center py-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-4 text-white/50 hover:text-white transition-colors text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
        <div className="relative z-10">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-3 text-white/50" />
            Payment History
          </h4>
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No payment events recorded yet</p>
            <p className="text-white/30 text-sm mt-1">
              Payment activity will appear here when Stripe events are received
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-3 text-white/50" />
            Payment History
          </h4>
          <button
            onClick={fetchEvents}
            className="text-white/40 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`relative pl-8 pb-4 ${index < events.length - 1 ? 'border-l-2 border-white/10 ml-2.5' : 'ml-2.5'}`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[11px] top-0 bg-black rounded-full p-1">
                {getEventIcon(event.status)}
              </div>

              {/* Event content */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-white">
                        {formatEventType(event.event_type)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm mt-1">
                      {formatTimestamp(event.event_timestamp)}
                    </p>
                  </div>
                  {event.amount && (
                    <span className={`text-lg font-bold ${event.status === 'succeeded' ? 'text-emerald-400' : event.status === 'failed' ? 'text-red-400' : 'text-white'}`}>
                      {formatAmount(event.amount, event.currency)}
                    </span>
                  )}
                </div>

                {/* Payment details */}
                <div className="mt-3 space-y-2">
                  {event.payment_method_brand && event.payment_method_last4 && (
                    <div className="flex items-center text-sm text-white/60">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {formatCardBrand(event.payment_method_brand)} •••• {event.payment_method_last4}
                    </div>
                  )}

                  {event.customer_email && (
                    <p className="text-sm text-white/50">
                      Customer: {event.customer_email}
                    </p>
                  )}

                  {event.failure_message && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">
                        <strong>Error:</strong> {event.failure_message}
                      </p>
                      {event.failure_code && (
                        <p className="text-red-400/60 text-xs mt-1">
                          Code: {event.failure_code}
                        </p>
                      )}
                    </div>
                  )}

                  {event.receipt_url && (
                    <a
                      href={event.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      View Receipt
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>

                {/* Stripe IDs (collapsed) */}
                <details className="mt-3">
                  <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-2 text-xs text-white/30 space-y-1 font-mono">
                    <p>Event ID: {event.stripe_event_id}</p>
                    {event.stripe_payment_intent_id && (
                      <p>Payment Intent: {event.stripe_payment_intent_id}</p>
                    )}
                    {event.stripe_checkout_session_id && (
                      <p>Checkout Session: {event.stripe_checkout_session_id}</p>
                    )}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

