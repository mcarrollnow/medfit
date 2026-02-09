"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, AlertCircle, Lock, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    message: Array<{
      code: string
      text: string
    }>
  }
  opaqueData?: {
    dataDescriptor: string
    dataValue: string
  }
}

interface ShippingAddressData {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

interface AuthorizeNetCheckoutProps {
  orderId: string
  orderNumber: string
  amount: number
  customerEmail?: string
  customerId?: string
  shippingAddress?: ShippingAddressData
  onSuccess: (transactionId: string) => void
  onError: (message: string) => void
  onCancel?: () => void
}

export function AuthorizeNetCheckout({
  orderId,
  orderNumber,
  amount,
  customerEmail,
  customerId,
  shippingAddress,
  onSuccess,
  onError,
  onCancel,
}: AuthorizeNetCheckoutProps) {
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
  
  // Billing address state
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false)
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  // Load Accept.js script
  useEffect(() => {
    const loadAcceptJs = () => {
      // Check if we're on HTTPS (required for Accept.js)
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
        console.warn('[Accept.js] HTTPS required - Accept.js may not load on HTTP')
      }
      
      // Check if already loaded
      if (window.Accept) {
        setScriptLoaded(true)
        return
      }

      const script = document.createElement('script')
      // Use production or sandbox based on environment
      script.src = process.env.NEXT_PUBLIC_AUTHORIZE_NET_ENVIRONMENT === 'sandbox'
        ? 'https://jstest.authorize.net/v1/Accept.js'
        : 'https://js.authorize.net/v1/Accept.js'
      script.async = true
      script.onload = () => {
        console.log('[Accept.js] Script loaded successfully')
        setScriptLoaded(true)
      }
      script.onerror = () => {
        console.error('[Accept.js] Failed to load script - HTTPS may be required')
        setError('Payment system requires a secure connection. Please use HTTPS.')
        setLoading(false)
      }
      document.head.appendChild(script)
    }

    loadAcceptJs()
    fetchCredentials()
  }, [])

  // Fetch public credentials from our API
  async function fetchCredentials() {
    try {
      const response = await fetch('/api/authorize-net/credentials')
      const data = await response.json()
      
      if (!response.ok || !data.apiLoginId || !data.clientKey) {
        throw new Error(data.error || 'Failed to load payment credentials')
      }
      
      setCredentials({
        apiLoginId: data.apiLoginId,
        clientKey: data.clientKey,
      })
      setLoading(false)
    } catch (err: any) {
      console.error('[Accept.js] Error fetching credentials:', err)
      setError(err.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  // Format card number with spaces
  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : v
  }

  // Validate form
  function validateForm(): boolean {
    const errors: Record<string, string> = {}
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      errors.cardNumber = 'Please enter a valid card number'
    }
    
    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      errors.expiryMonth = 'Invalid month'
    }
    
    const currentYear = new Date().getFullYear() % 100
    if (!expiryYear || parseInt(expiryYear) < currentYear) {
      errors.expiryYear = 'Invalid year'
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      errors.cvv = 'Invalid CVV'
    }
    
    if (!cardholderName.trim()) {
      errors.cardholderName = 'Please enter cardholder name'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle payment submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!window.Accept || !credentials) {
      setError('Payment system not ready. Please refresh and try again.')
      return
    }
    
    setProcessing(true)
    setError(null)
    
    try {
      // Prepare secure data for Accept.js
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
      
      console.log('[Accept.js] Dispatching card data for tokenization')
      
      // Get payment nonce from Accept.js
      window.Accept.dispatchData(secureData, async (response) => {
        if (response.messages.resultCode === 'Error') {
          const errorMessage = response.messages.message[0]?.text || 'Payment failed'
          console.error('[Accept.js] Tokenization error:', errorMessage)
          setError(errorMessage)
          setProcessing(false)
          onError(errorMessage)
          return
        }
        
        if (!response.opaqueData) {
          setError('Failed to process card data')
          setProcessing(false)
          return
        }
        
        console.log('[Accept.js] Card tokenized successfully')
        
        // Send the payment nonce to our server to process the transaction
        try {
          const paymentResponse = await fetch('/api/authorize-net/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              orderNumber,
              amount,
              customerEmail,
              customerId,
              opaqueData: response.opaqueData,
              cardholderName,
              // Use custom billing address if selected, otherwise use shipping address
              billingAddress: differentBillingAddress 
                ? billingAddress 
                : shippingAddress 
                  ? {
                      firstName: shippingAddress.firstName || cardholderName.split(' ')[0] || '',
                      lastName: shippingAddress.lastName || cardholderName.split(' ').slice(1).join(' ') || '',
                      address: shippingAddress.address,
                      city: shippingAddress.city,
                      state: shippingAddress.state,
                      zip: shippingAddress.zip,
                      country: shippingAddress.country || 'US',
                    }
                  : null,
            }),
          })
          
          const paymentResult = await paymentResponse.json()
          
          if (!paymentResponse.ok || !paymentResult.success) {
            throw new Error(paymentResult.error || 'Payment processing failed')
          }
          
          console.log('[Accept.js] Payment processed successfully:', paymentResult.transactionId)
          onSuccess(paymentResult.transactionId)
          
        } catch (err: any) {
          console.error('[Accept.js] Payment processing error:', err)
          setError(err.message || 'Payment processing failed')
          onError(err.message || 'Payment processing failed')
        } finally {
          setProcessing(false)
        }
      })
      
    } catch (err: any) {
      console.error('[Accept.js] Error:', err)
      setError(err.message || 'An error occurred')
      setProcessing(false)
      onError(err.message || 'An error occurred')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        <p className="text-white/50 text-sm">Loading secure payment form...</p>
      </div>
    )
  }

  // Error state - can't load
  if (error && !scriptLoaded) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="w-full">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Order summary */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Order Total</span>
          <span className="text-2xl font-bold text-white">${amount.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Card form */}
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholderName" className="text-white/70">Cardholder Name</Label>
          <Input
            id="cardholderName"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
            disabled={processing}
          />
          {formErrors.cardholderName && (
            <p className="text-red-400 text-xs">{formErrors.cardholderName}</p>
          )}
        </div>
        
        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-white/70">Card Number</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 pr-12"
              disabled={processing}
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          </div>
          {formErrors.cardNumber && (
            <p className="text-red-400 text-xs">{formErrors.cardNumber}</p>
          )}
        </div>
        
        {/* Expiry and CVV */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="expiryMonth" className="text-white/70">Month</Label>
            <Input
              id="expiryMonth"
              type="text"
              placeholder="MM"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
              maxLength={2}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 text-center"
              disabled={processing}
            />
            {formErrors.expiryMonth && (
              <p className="text-red-400 text-xs">{formErrors.expiryMonth}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryYear" className="text-white/70">Year</Label>
            <Input
              id="expiryYear"
              type="text"
              placeholder="YY"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
              maxLength={2}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 text-center"
              disabled={processing}
            />
            {formErrors.expiryYear && (
              <p className="text-red-400 text-xs">{formErrors.expiryYear}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-white/70">CVV</Label>
            <Input
              id="cvv"
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 text-center"
              disabled={processing}
            />
            {formErrors.cvv && (
              <p className="text-red-400 text-xs">{formErrors.cvv}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Billing Address Option */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="differentBilling"
            checked={differentBillingAddress}
            onChange={(e) => setDifferentBillingAddress(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-500/20"
            disabled={processing}
          />
          <Label htmlFor="differentBilling" className="text-white/70 cursor-pointer">
            Use a different billing address
          </Label>
        </div>
        
        {differentBillingAddress && (
          <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="billingFirstName" className="text-white/70">First Name</Label>
                <Input
                  id="billingFirstName"
                  type="text"
                  placeholder="John"
                  value={billingAddress.firstName}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingLastName" className="text-white/70">Last Name</Label>
                <Input
                  id="billingLastName"
                  type="text"
                  placeholder="Doe"
                  value={billingAddress.lastName}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  disabled={processing}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingAddress" className="text-white/70">Street Address</Label>
              <Input
                id="billingAddress"
                type="text"
                placeholder="123 Main St"
                value={billingAddress.address}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                disabled={processing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="billingCity" className="text-white/70">City</Label>
                <Input
                  id="billingCity"
                  type="text"
                  placeholder="New York"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState" className="text-white/70">State</Label>
                <Input
                  id="billingState"
                  type="text"
                  placeholder="NY"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  maxLength={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  disabled={processing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="billingZip" className="text-white/70">ZIP Code</Label>
                <Input
                  id="billingZip"
                  type="text"
                  placeholder="10001"
                  value={billingAddress.zip}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  maxLength={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCountry" className="text-white/70">Country</Label>
                <Input
                  id="billingCountry"
                  type="text"
                  value="United States"
                  disabled
                  className="bg-white/5 border-white/10 text-white/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Submit button */}
      <Button
        type="submit"
        disabled={processing || !scriptLoaded || !credentials}
        className="w-full h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold text-lg rounded-xl disabled:opacity-50"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>
      
      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/40">
        <Lock className="w-3 h-3" />
        <span>256-bit SSL encrypted • PCI compliant</span>
      </div>
      
      {/* Cancel button */}
      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="w-full text-white/50 hover:text-white"
          disabled={processing}
        >
          Cancel Payment
        </Button>
      )}
    </form>
  )
}
