"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { InvoicePaymentForm } from '@/components/invoice/invoice-payment-form'

interface InvoiceItem {
  name?: string
  description: string
  quantity: number
  unit_price: number
}

interface Invoice {
  id: string
  invoice_number: string
  customer_email: string
  customer_name: string
  items: string | InvoiceItem[]
  subtotal: number
  manual_adjustment: number
  total: number
  status: string
}

export default function InvoicePayPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  async function fetchInvoice() {
    try {
      const response = await fetch(`/api/invoice/${invoiceId}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data.invoice)
        
        // Check if already paid
        if (data.invoice.status === 'paid') {
          setPaymentSuccess(true)
        }
      } else {
        const err = await response.json()
        setError(err.error || 'Invoice not found')
      }
    } catch (err) {
      setError('Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (txnId: string) => {
    setTransactionId(txnId)
    setPaymentSuccess(true)
    
    // Update invoice status to paid
    try {
      await fetch(`/api/invoice/${invoiceId}/mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txnId }),
      })
    } catch (err) {
      console.error('Failed to update invoice status:', err)
    }
  }

  const handlePaymentError = (message: string) => {
    setError(message)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-[#999999]">Loading invoice...</div>
      </div>
    )
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-light text-[#f0f0f0] mb-2">Error</h1>
          <p className="text-[#999999]">{error}</p>
          <Link href="/" className="mt-6 inline-block text-emerald-400 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (!invoice) return null

  // Parse items from database
  // Items are stored with 'name' as the product name and 'description' as details
  const rawItems: InvoiceItem[] = typeof invoice.items === 'string' 
    ? JSON.parse(invoice.items) 
    : invoice.items || []

  // Transform to form format (ensure numbers are parsed from potential strings)
  const items = rawItems.map(item => ({
    description: item.name || item.description || '',
    quantity: Number(item.quantity) || 0,
    rate: Number(item.unit_price) || 0,
  }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-lg mx-auto px-6 py-12 md:py-16">
        {/* Back link */}
        <Link 
          href={`/invoice/${invoiceId}`}
          className="inline-flex items-center gap-2 text-[#999999] hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Invoice</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {paymentSuccess ? (
            // Success state
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="font-serif text-3xl font-light text-foreground mb-3">Payment Successful</h1>
              <p className="text-[#999999] mb-6">
                Thank you for your payment of ${invoice.total.toFixed(2)}
              </p>
              {transactionId && (
                <p className="font-mono text-xs text-[#666666] mb-8">
                  Transaction ID: {transactionId}
                </p>
              )}
              <Link 
                href={`/invoice/${invoiceId}`}
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-mono text-sm uppercase tracking-wider hover:bg-card/90 transition-colors"
              >
                View Invoice
              </Link>
            </div>
          ) : (
            // Payment form
            <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16">
              {/* Header */}
              <div className="mb-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888] mb-3">
                  Invoice Payment
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-[#f0f0f0] mb-2">
                  {invoice.invoice_number}
                </h1>
                <p className="text-[#888888]">{invoice.customer_name}</p>
              </div>

              {/* Payment form with line items */}
              <InvoicePaymentForm
                invoiceId={invoice.id}
                invoiceNumber={invoice.invoice_number}
                customerEmail={invoice.customer_email}
                items={items}
                subtotal={Number(invoice.subtotal) || 0}
                discount={Number(invoice.manual_adjustment) || 0}
                total={Number(invoice.total) || 0}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={() => router.push(`/invoice/${invoiceId}`)}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Glass styles */}
      <style jsx global>{`
        .glass-card {
          background: rgba(58,66,51,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(58, 66, 51, 0.08);
          box-shadow: 0 8px 32px rgba(58,66,51,0.2);
        }
      `}</style>
    </div>
  )
}
