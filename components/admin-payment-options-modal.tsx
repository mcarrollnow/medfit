'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CreditCard,
  Loader2,
  Check,
  Copy,
  Send,
  ExternalLink,
  ArrowLeft,
  QrCode,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Cash App icon component
const CashAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.59 3.47A5.1 5.1 0 0 0 20.53.41a.13.13 0 0 0-.14 0l-.4.24a1.23 1.23 0 0 1-1.26 0L17.9.1a.13.13 0 0 0-.13 0 5.1 5.1 0 0 0-3.06 3.06.13.13 0 0 0 0 .13l.55.82a1.23 1.23 0 0 1 0 1.26l-.55.82a.13.13 0 0 0 0 .13 5.1 5.1 0 0 0 3.06 3.06.13.13 0 0 0 .13 0l.82-.55a1.23 1.23 0 0 1 1.26 0l.82.55a.13.13 0 0 0 .13 0 5.1 5.1 0 0 0 3.06-3.06.13.13 0 0 0 0-.13l-.55-.82a1.23 1.23 0 0 1 0-1.26l.55-.82a.13.13 0 0 0 0-.13zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-.75 9.75v.75a.75.75 0 0 0 1.5 0v-.75a2.25 2.25 0 0 0 0-4.5h-1.5a.75.75 0 1 1 0-1.5h2.25a.75.75 0 0 0 0-1.5h-.75v-.75a.75.75 0 0 0-1.5 0v.75a2.25 2.25 0 0 0 0 4.5h1.5a.75.75 0 1 1 0 1.5H10.5a.75.75 0 0 0 0 1.5h.75z"/>
  </svg>
)

// Ethereum icon
const EthereumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z"/>
  </svg>
)

type PaymentMethod = 'card' | 'cashapp' | 'ethereum'

interface PaymentOption {
  id: PaymentMethod
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Secure payment via Authorize.net',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    description: 'Generate Cash App payment link',
    icon: <CashAppIcon />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30',
  },
  {
    id: 'ethereum',
    name: 'Ethereum / Crypto',
    description: 'Generate crypto payment link',
    icon: <EthereumIcon />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
  },
]

interface AdminPaymentOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber?: string
  amount: number
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  items?: Array<{
    product_name: string
    quantity: number
    unit_price: number
  }>
  onSuccess: (paymentMethod: string, details?: any) => void
  onError: (message: string) => void
}

export function AdminPaymentOptionsModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  customerEmail,
  customerPhone,
  onSuccess,
}: AdminPaymentOptionsModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Deep link state
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Crypto wallet state
  const [assignedWallet, setAssignedWallet] = useState<{ id: string; address: string; label: string } | null>(null)
  const [cryptoPayment, setCryptoPayment] = useState<{
    currency: string
    usdAmount: number
    cryptoAmount: string
    paymentUrl: string
    ethPrice?: number
  } | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'USDC'>('ETH')

  // SMS state
  const [smsPhone, setSmsPhone] = useState(customerPhone || '')

  const resetState = () => {
    setSelectedMethod(null)
    setLoading(false)
    setError(null)
    setSuccess(false)
    setGeneratedLink(null)
    setCopied(false)
    setAssignedWallet(null)
    setCryptoPayment(null)
    setSelectedCrypto('ETH')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleBack = () => {
    resetState()
  }

  const handleSelectMethod = async (method: PaymentMethod) => {
    setSelectedMethod(method)
    setError(null)
    setLoading(true)

    try {
      switch (method) {
        case 'card':
          await initializeCardPayment()
          break
        case 'cashapp':
          generateCashAppLink()
          break
        case 'ethereum':
          await initializeEthereumPayment('ETH')
          break
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment method')
      setLoading(false)
    }
  }

  // Card payment via Authorize.net hosted payment page
  const initializeCardPayment = async () => {
    try {
      const response = await fetch('/api/authorize-net/hosted-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          orderNumber,
          amount,
          customerEmail,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize card payment')
      }

      // Redirect to Authorize.net hosted payment page
      window.location.href = data.formUrl
    } catch (err: any) {
      setError(err.message || 'Failed to initialize card payment')
      setLoading(false)
    }
  }

  // Cash App deep link - uses cashtag
  const generateCashAppLink = () => {
    const cashAppUsername = process.env.NEXT_PUBLIC_CASHAPP_USERNAME || 'YourCashTag'
    const formattedAmount = amount.toFixed(2)
    const note = encodeURIComponent(`Order ${orderNumber || orderId}`)

    const link = `https://cash.app/$${cashAppUsername}/${formattedAmount}?note=${note}`

    setGeneratedLink(link)
    setLoading(false)
  }

  // Ethereum payment - fetch assigned wallet and initiate payment
  const initializeEthereumPayment = async (currency: 'ETH' | 'USDC' = 'ETH') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/assign-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currency }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get wallet address')
      }

      setAssignedWallet(data.wallet)
      setCryptoPayment(data.payment)
      setSelectedCrypto(currency)
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize crypto payment')
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sendSMS = async (link: string) => {
    if (!smsPhone) {
      setError('Phone number is required to send SMS')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const message = `Pay for Order ${orderNumber || orderId}: $${amount.toFixed(2)}\n\n${link}`

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          to: smsPhone,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to send SMS')
      }

      setSuccess(true)
      onSuccess(selectedMethod || 'payment_link', { sentVia: 'sms', phone: smsPhone, device: data.device })
    } catch (err: any) {
      setError(err.message || 'Failed to send SMS')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedMethod && (
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 rounded-full hover:bg-foreground/10 text-foreground/60"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedMethod ? paymentOptions.find(o => o.id === selectedMethod)?.name : 'Payment Method'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {selectedMethod ? `Order ${orderNumber || orderId}` : 'Choose how to collect payment'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-foreground/10 text-foreground/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount display */}
          <div className="px-6 py-4 border-b border-border text-center">
            <p className="text-muted-foreground text-sm">Total Amount</p>
            <p className="text-4xl font-bold text-foreground">${amount.toFixed(2)}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-3"
              >
                <Check className="w-5 h-5" />
                <p>Payment link sent successfully!</p>
              </motion.div>
            )}

            {!selectedMethod ? (
              /* Payment method selection grid */
              <div className="grid grid-cols-1 gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectMethod(option.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all text-left flex items-center gap-4",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      option.bgColor
                    )}
                  >
                    <div className={cn("p-3 rounded-xl bg-foreground/20", option.color)}>
                      {option.icon}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">{option.name}</p>
                      <p className="text-muted-foreground text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : loading ? (
              /* Loading state */
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-muted-foreground">Initializing payment...</p>
              </div>
            ) : selectedMethod === 'cashapp' && generatedLink ? (
              /* Cash App link display */
              <div className="space-y-6">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400">
                    <CashAppIcon />
                  </div>
                  <p className="text-foreground font-semibold mb-2">Cash App Payment Link</p>
                  <p className="text-muted-foreground text-sm mb-4">Share this link with the customer</p>

                  <div className="flex items-center gap-2 p-3 bg-foreground/30 rounded-lg">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 bg-transparent text-foreground/80 text-sm outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedLink)}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="tel"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="Phone number to send link"
                      className="flex-1 h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                    />
                    <Button
                      onClick={() => sendSMS(generatedLink)}
                      disabled={loading || !smsPhone}
                      className="h-12 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send SMS
                    </Button>
                  </div>

                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border text-foreground hover:bg-foreground/5 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Cash App
                  </a>
                </div>
              </div>
            ) : selectedMethod === 'ethereum' && assignedWallet ? (
              /* Ethereum payment display */
              <div className="space-y-6">
                {/* Currency Toggle */}
                <div className="flex gap-2 p-1 bg-foreground/5 rounded-xl">
                  <button
                    onClick={() => initializeEthereumPayment('ETH')}
                    disabled={loading}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2",
                      selectedCrypto === 'ETH'
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <EthereumIcon />
                    ETH
                  </button>
                  <button
                    onClick={() => initializeEthereumPayment('USDC')}
                    disabled={loading}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2",
                      selectedCrypto === 'USDC'
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <span className="text-lg font-bold">$</span>
                    USDC
                  </button>
                </div>

                <div className={cn(
                  "p-6 border rounded-xl text-center",
                  selectedCrypto === 'ETH'
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-blue-500/10 border-blue-500/30"
                )}>
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center",
                    selectedCrypto === 'ETH' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                  )}>
                    {selectedCrypto === 'ETH' ? <EthereumIcon /> : <span className="text-2xl font-bold">$</span>}
                  </div>
                  <p className="text-foreground font-semibold mb-1">{selectedCrypto} Payment</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {assignedWallet.label && <span>{assignedWallet.label}</span>}
                  </p>

                  <div className="p-4 bg-foreground/30 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
                    <p className="text-foreground font-mono text-sm break-all">{assignedWallet.address}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(assignedWallet.address)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition",
                        selectedCrypto === 'ETH'
                          ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      )}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Address'}
                    </button>
                  </div>
                </div>

                {cryptoPayment && (
                  <div className="p-4 bg-foreground/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-foreground/60 text-sm">Amount Due</p>
                      {cryptoPayment.ethPrice && (
                        <p className="text-muted-foreground text-xs">1 ETH = ${cryptoPayment.ethPrice.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-foreground">{cryptoPayment.cryptoAmount}</p>
                      <p className="text-xl text-muted-foreground">{selectedCrypto}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">${amount.toFixed(2)} USD</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="tel"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="Phone number to send address"
                      className="flex-1 h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                    />
                    <Button
                      onClick={() => sendSMS(
                        `Pay ${cryptoPayment?.cryptoAmount || amount.toFixed(2)} ${selectedCrypto} for Order ${orderNumber || orderId}\n\nWallet: ${assignedWallet.address}`
                      )}
                      disabled={loading || !smsPhone}
                      className={cn(
                        "h-12 px-6 rounded-xl text-foreground",
                        selectedCrypto === 'ETH' ? "bg-purple-500 hover:bg-purple-600" : "bg-blue-500 hover:bg-blue-600"
                      )}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      SMS
                    </Button>
                  </div>

                  {cryptoPayment?.paymentUrl && (
                    <button
                      onClick={() => copyToClipboard(cryptoPayment.paymentUrl)}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border text-foreground hover:bg-foreground/5 transition"
                    >
                      <QrCode className="w-4 h-4" />
                      Copy Payment URI
                    </button>
                  )}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Customer should send exact amount to avoid payment issues
                </p>
              </div>
            ) : null}
          </div>

          {/* Skip button */}
          {!success && (
            <div className="px-6 pb-6">
              <button
                onClick={handleClose}
                className="w-full text-center text-muted-foreground hover:text-foreground/60 text-sm py-2"
              >
                {selectedMethod ? 'Cancel' : 'Skip payment - collect later'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
