'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Loader2,
  ExternalLink,
  Copy,
  MessageCircle,
  AlertCircle,
  Zap,
  Check,
  Mail,
  MapPin
} from 'lucide-react'

interface OrderData {
  id: string
  order_number: string
  customer_name?: string
  status: string
  payment_status: string
  total_amount: number
  expected_payment_amount?: number
  expected_payment_currency?: string
  transaction_hash?: string
  payment_initiated_at?: string
  payment_verified_at?: string
  customers?: {
    shipping_address_line1?: string
    shipping_city?: string
    shipping_state?: string
    shipping_zip?: string
    shipping_country?: string
    phone?: string
  }
  items: any[]
  created_at: string
}

interface BlockchainData {
  transactionHash?: string
  blockNumber?: number
  confirmations?: number
  paymentState?: 'waiting' | 'detected' | 'confirmed'
}

export default function OrderStatusPage() {
  const params = useParams()
  const orderId = params?.orderId as string
  
  const [order, setOrder] = useState<OrderData | null>(null)
  const [blockchain, setBlockchain] = useState<BlockchainData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch order data
  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        // Use query parameter instead of path parameter for order numbers
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || `${siteConfig.appUrl}/api`}/orders/public-status?orderId=${encodeURIComponent(orderId)}`
        console.log('[OrderStatus] Fetching order data from:', apiUrl)
        console.log('[OrderStatus] Order ID parameter:', orderId)
        
        const response = await fetch(apiUrl)
        console.log('[OrderStatus] Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('[OrderStatus] API error response:', errorText)
          setError(`Order not found (${response.status})`)
          setLoading(false)
          return
        }

        // Get raw response text to debug parsing issues
        const responseText = await response.text()
        console.log('[OrderStatus] Raw API response:', responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
          console.log('[OrderStatus] Parsed JSON successfully:', data)
        } catch (parseError) {
          console.error('[OrderStatus] JSON parse error:', parseError)
          console.error('[OrderStatus] Problematic response text:', responseText.substring(0, 500))
          setError('Invalid response format from server')
          setLoading(false)
          return
        }
        setOrder(data.order)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order')
        setLoading(false)
      }
    }

    fetchOrder()
    const interval = setInterval(fetchOrder, 10000)
    return () => clearInterval(interval)
  }, [orderId])

  // Poll blockchain for crypto payments
  useEffect(() => {
    if (!order || order.payment_status !== 'payment_processing') return

    const pollBlockchain = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${siteConfig.appUrl}/api`}/orders/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id })
        })

        if (response.ok) {
          const data = await response.json()
          setBlockchain({
            transactionHash: data.transactionHash,
            blockNumber: data.blockNumber,
            confirmations: data.confirmations,
            paymentState: data.paymentState
          })
        }
      } catch (err) {
        console.error('Blockchain poll error:', err)
      }
    }

    pollBlockchain()
    const interval = setInterval(pollBlockchain, 5000)
    return () => clearInterval(interval)
  }, [order])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusStep = () => {
    if (order?.payment_status === 'paid') return 4
    if (order?.payment_status === 'payment_processing') {
      if (blockchain.paymentState === 'confirmed') return 3
      if (blockchain.paymentState === 'detected') return 2
      return 1
    }
    return 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-2 border-destructive max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{error || 'Order Not Found'}</h1>
            <p className="text-muted-foreground mb-6">
              Please check your order link and try again
            </p>
            <Button asChild variant="outline">
              <a href={siteConfig.appUrl}>Return to Store</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusStep = getStatusStep()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">Order Status</h1>
            <span className="text-sm text-muted-foreground">{order.order_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusStep >= 4 ? 'bg-green-500' : 'bg-primary'} animate-pulse`} />
            <span className="text-sm font-medium">
              {order.payment_status === 'paid' ? 'Paid' : 'Processing Payment'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-6xl">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
              <p className="text-muted-foreground text-lg">
                Real-time updates for order #{order.order_number}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <div className={`w-3 h-3 rounded-full ${statusStep >= 4 ? 'bg-green-500' : 'bg-primary'} animate-pulse`} />
                <span className="text-xl font-bold">
                  {order.payment_status === 'paid' ? 'Payment Confirmed' : 'Processing Payment'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Content - Mobile: full width, Desktop: 2 cols */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            
            {/* Payment Progress */}
            <Card className="border-2 border-primary overflow-hidden">
              <CardContent className="p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold mb-6">Payment Status</h2>
                
                {/* Progress Steps */}
                <div className="space-y-4">
                  <StepItem 
                    icon={<Zap />}
                    title="Payment Initiated"
                    description={order.payment_initiated_at ? new Date(order.payment_initiated_at).toLocaleString() : 'Waiting...'}
                    active={statusStep >= 1}
                    completed={statusStep > 1}
                  />
                  
                  <StepItem 
                    icon={<Clock />}
                    title="Transaction Detected"
                    description={blockchain.transactionHash ? `TX: ${blockchain.transactionHash.substring(0, 10)}...` : 'Scanning blockchain...'}
                    active={statusStep >= 2}
                    completed={statusStep > 2}
                  />
                  
                  <StepItem 
                    icon={<CheckCircle />}
                    title="Payment Confirmed"
                    description={blockchain.confirmations ? `${blockchain.confirmations} confirmations` : 'Waiting for confirmations...'}
                    active={statusStep >= 3}
                    completed={statusStep > 3}
                  />
                  
                  <StepItem 
                    icon={<Package />}
                    title="Order Processing"
                    description={order.payment_verified_at ? 'Preparing shipment' : 'Awaiting payment'}
                    active={statusStep >= 4}
                    completed={statusStep > 4}
                  />
                </div>

                {/* Blockchain Info */}
                {blockchain.transactionHash && (
                  <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                        <p className="text-xs font-mono break-all">{blockchain.transactionHash}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(blockchain.transactionHash!)}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <a 
                            href={`https://etherscan.io/tx/${blockchain.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    {blockchain.blockNumber && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Block</p>
                          <p className="font-mono font-bold">{blockchain.blockNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Confirmations</p>
                          <p className="font-mono font-bold text-primary">{blockchain.confirmations || 0}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items - Desktop only */}
            <Card className="hidden lg:block border-2 border-border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${(item.unit_price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">${order.total_amount.toFixed(2)}</span>
                  </div>
                  {order.expected_payment_amount && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Paid</span>
                      <span className="text-sm font-mono">
                        {order.expected_payment_amount} {order.expected_payment_currency}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            
            {/* AI Assistant CTA */}
            <Card className="border-2 border-primary bg-primary/5">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Text us anytime! Our AI assistant has your order details and can help instantly.
                    </p>
                  </div>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <a href={`sms:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+16028604936'}?body=Hi! I have a question about order ${order.order_number}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Text Message
                  </a>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Powered by Claude AI • Instant responses 24/7
                </p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-2 border-border">
              <CardContent className="p-4 lg:p-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-mono font-semibold">{order.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold text-primary">${order.total_amount.toFixed(2)}</span>
                  </div>
                  {order.expected_payment_amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crypto Payment</span>
                      <span className="font-mono text-xs">{order.expected_payment_amount} {order.expected_payment_currency}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            {order.customers && (
              <Card className="border-2 border-border">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Shipping Address</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">
                      {order.customer_name}
                    </p>
                    <p className="text-muted-foreground">{order.customers.shipping_address_line1}</p>
                    <p className="text-muted-foreground">
                      {order.customers.shipping_city}, {order.customers.shipping_state} {order.customers.shipping_zip}
                    </p>
                    <p className="text-muted-foreground">{order.customers.shipping_country || 'USA'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mobile: Order Items */}
            <Card className="lg:hidden border-2 border-border">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3">Items</h3>
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-background rounded">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">${(item.unit_price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepItem({ 
  icon, 
  title, 
  description, 
  active, 
  completed 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        completed ? 'bg-green-500 text-white' : 
        active ? 'bg-primary text-primary-foreground' : 
        'bg-muted text-muted-foreground'
      }`}>
        {completed ? <Check className="w-6 h-6" /> : icon}
      </div>
      <div className="flex-1 pt-2">
        <h3 className={`font-semibold mb-1 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
