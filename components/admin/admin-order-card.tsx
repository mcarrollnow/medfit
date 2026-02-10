"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  ChevronDown,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Copy,
  RefreshCw,
  AlertTriangle,
  Edit2,
  Save,
  Wallet,
  FileText,
  Check,
  ShoppingBag,
  CreditCard,
  History,
  RotateCcw,
} from "lucide-react"
import { RefundModal } from "@/components/admin/refund-modal"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  getOrderItems,
  getOrderTimeline,
  updateOrderStatus,
  updateOrderTracking,
  addOrderNote,
  refundOrder,
} from "@/app/actions/customers"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price_at_time: number
  product_id?: string
}

interface OrderTimeline {
  id: string
  created_at: string
  status: string
  description: string
  location?: string
  notes?: string
}

interface Order {
  id: string
  order_number?: string
  status: string
  total_amount?: number
  total?: number
  created_at: string
  updated_at?: string
  shipping_address_line1?: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip?: string
  shipping_country?: string
  tracking_number?: string
  carrier?: string
  shipped_at?: string
  delivered_at?: string
  crypto_payment_address?: string
  crypto_payment_amount?: string
  crypto_payment_currency?: string
  crypto_transaction_hash?: string
  admin_notes?: string
  refund_reason?: string
  payment_method?: string
  stripe_payment_intent_id?: string
  // Refund fields
  refund_id?: string
  refund_amount?: number
  refund_status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  refund_destination?: 'original_payment' | 'store_credit' | 'manual'
  refund_customer_message?: string
  refund_initiated_at?: string
  refund_completed_at?: string
}

interface AdminOrderCardProps {
  order: Order
  onOrderUpdated?: () => void
}

export function AdminOrderCard({ order, onOrderUpdated }: AdminOrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([])
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"items" | "shipping" | "payment" | "timeline" | "notes">("items")
  const [editingTracking, setEditingTracking] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "")
  const [carrier, setCarrier] = useState(order.carrier || "")
  const [notes, setNotes] = useState(order.admin_notes || "")
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [refundModalOpen, setRefundModalOpen] = useState(false)

  const sampleShippingAddress = {
    line1: "1847 Luxury Boulevard, Suite 200",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    country: "United States",
  }

  const sampleTracking = {
    carrier: "FedEx Priority",
    tracking_number: "7489201847562890",
    shipped_at: new Date().toISOString(),
  }

  const samplePayment = {
    currency: "USDT",
    amount: "2,450.00",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8B2E1a9c8D4f2",
    transaction_hash: "0x8f7d3c2e1b0a9876543210fedcba9876543210abcdef1234567890abcdef1234",
  }

  const sampleTimeline = [
    {
      id: "1",
      status: "Order Placed",
      notes: "Customer completed checkout with crypto payment",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: "",
    },
    {
      id: "2",
      status: "Payment Confirmed",
      notes: "USDT payment verified on blockchain - 12 confirmations",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      description: "",
    },
    {
      id: "3",
      status: "Processing",
      notes: "Order sent to fulfillment center for packaging",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "",
    },
    {
      id: "4",
      status: "Shipped",
      notes: "Package handed to FedEx Priority - estimated delivery in 2-3 business days",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "",
    },
    {
      id: "5",
      status: "Out for Delivery",
      notes: "Package is on the delivery truck and will arrive today",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      description: "",
    },
  ]

  const displayTimeline = timeline.length > 0 ? timeline : sampleTimeline
  const hasRealShipping = order.shipping_address_line1
  const hasRealTracking = order.tracking_number
  const hasRealPayment = order.crypto_payment_address || order.crypto_transaction_hash

  const statusConfig: Record<string, { color: string; bgColor: string; icon: any }> = {
    completed: { color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
    delivered: { color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
    shipped: { color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", icon: Truck },
    processing: { color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20", icon: Clock },
    pending: { color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20", icon: Clock },
    cancelled: { color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", icon: XCircle },
    refunded: { color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", icon: XCircle },
  }

  const currentStatus = statusConfig[order.status] || statusConfig.pending
  const CurrentStatusIcon = currentStatus.icon

  useEffect(() => {
    if (isOpen && items.length === 0) {
      loadOrderDetails()
    }
  }, [isOpen])

  async function loadOrderDetails() {
    setLoading(true)
    const [orderItems, orderTimeline] = await Promise.all([getOrderItems(order.id), getOrderTimeline(order.id)])
    setItems(orderItems)
    setTimeline(orderTimeline)
    setLoading(false)
  }

  async function handleStatusChange(newStatus: string) {
    setSaving(true)
    await updateOrderStatus(order.id, newStatus)
    await loadOrderDetails()
    onOrderUpdated?.()
    setSaving(false)
  }

  async function handleSaveTracking() {
    setSaving(true)
    await updateOrderTracking(order.id, trackingNumber, carrier)
    setEditingTracking(false)
    await loadOrderDetails()
    onOrderUpdated?.()
    setSaving(false)
  }

  async function handleSaveNotes() {
    setSaving(true)
    await addOrderNote(order.id, notes)
    setEditingNotes(false)
    onOrderUpdated?.()
    setSaving(false)
  }

  const handleOpenRefundModal = () => {
    setRefundModalOpen(true)
  }

  const handleRefundComplete = async () => {
    await loadOrderDetails()
    onOrderUpdated?.()
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const orderTotal = Number(order.total_amount || order.total || 0)

  const tabs = [
    { id: "items", label: "Items", icon: ShoppingBag },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "notes", label: "Notes", icon: FileText },
  ] as const

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="relative rounded-3xl bg-foreground/5 backdrop-blur-xl border border-border overflow-hidden transition-all duration-300 hover:border-border hover:bg-card/[0.07]">
        {/* Header */}
        <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 sm:p-6 text-left">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-foreground/5 border border-border flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 sm:h-7 sm:w-7 text-foreground/60" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground truncate">
                  Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{format(new Date(order.created_at), "MMM dd, yyyy")}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 lg:gap-8">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-medium",
                  currentStatus.bgColor,
                  currentStatus.color,
                )}
              >
                <CurrentStatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="capitalize">{order.status}</span>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">${orderTotal.toFixed(2)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{order.payment_method || "Pending"}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </div>
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="px-6 sm:px-8 pb-8 pt-0">
            <div className="border-t border-border pt-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Admin Status Actions */}
                  <div className="flex flex-wrap items-center gap-3 p-6 rounded-2xl bg-foreground/5 border border-border">
                    <span className="text-sm font-medium text-foreground/60 mr-2">Update Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "processing", "shipped", "delivered", "completed", "cancelled"].map((status) => {
                        const isActive = order.status === status
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={saving || isActive}
                            className={cn(
                              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all border capitalize",
                              isActive
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-foreground/5 text-foreground/70 border-border hover:bg-foreground/10 hover:border-border",
                            )}
                          >
                            {status}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex-1" />
                    <Button
                      variant="outline"
                      className="h-11 px-6 gap-2 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent"
                      onClick={handleOpenRefundModal}
                      disabled={saving || order.status === "refunded" || order.refund_status === "succeeded"}
                    >
                      <RotateCcw className="h-4 w-4" />
                      {order.refund_status === "succeeded" ? "Refunded" :
                       order.refund_status === "processing" ? "View Refund" :
                       "Issue Refund"}
                    </Button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "px-4 py-3 rounded-xl font-medium transition-all text-sm sm:text-base text-center",
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                        )}
                      >
                        {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    {/* Items Tab */}
                    {activeTab === "items" && (
                      <div className="space-y-4">
                        {items.length > 0 ? (
                          items.map((item, idx) => (
                            <div key={idx} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-foreground/5 border border-border">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/60" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-base sm:text-lg text-foreground truncate">
                                      {item.product_name || `Product ${idx + 1}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-lg sm:text-xl font-bold text-foreground">
                                    ${(Number(item.price_at_time || 0) * Number(item.quantity || 1)).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">${Number(item.price_at_time || 0).toFixed(2)} each</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 sm:py-12 text-center text-muted-foreground">
                            <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-base sm:text-lg">Loading order items...</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Shipping Tab */}
                    {activeTab === "shipping" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-foreground/60" />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">Shipping Address</h4>
                            {!hasRealShipping && (
                              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                                Sample Data
                              </span>
                            )}
                          </div>
                          <div className="text-base text-foreground/80 space-y-1 pl-13">
                            <p>{hasRealShipping ? order.shipping_address_line1 : sampleShippingAddress.line1}</p>
                            <p>
                              {hasRealShipping
                                ? `${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}`
                                : `${sampleShippingAddress.city}, ${sampleShippingAddress.state} ${sampleShippingAddress.zip}`}
                            </p>
                            <p>{hasRealShipping ? order.shipping_country : sampleShippingAddress.country}</p>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-foreground/60" />
                              </div>
                              <h4 className="text-lg font-semibold text-foreground">Tracking Info</h4>
                              {!hasRealTracking && !editingTracking && (
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                                  Sample Data
                                </span>
                              )}
                            </div>
                            {!editingTracking && (
                              <Button
                                variant="ghost"
                                className="h-10 w-10 p-0 rounded-xl hover:bg-foreground/10"
                                onClick={() => setEditingTracking(true)}
                              >
                                <Edit2 className="h-4 w-4 text-foreground/60" />
                              </Button>
                            )}
                          </div>
                          {editingTracking ? (
                            <div className="space-y-4">
                              <Input
                                placeholder="Tracking number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="h-12 rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground"
                              />
                              <Input
                                placeholder="Carrier (UPS, FedEx, USPS, etc.)"
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="h-12 rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground"
                              />
                              <div className="flex gap-3">
                                <Button
                                  className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90"
                                  onClick={handleSaveTracking}
                                  disabled={saving}
                                >
                                  <Save className="h-4 w-4 mr-2" /> Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-11 px-6 rounded-xl hover:bg-foreground/10"
                                  onClick={() => setEditingTracking(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                                <span className="text-muted-foreground">Carrier</span>
                                <span className="font-medium text-foreground">
                                  {hasRealTracking ? order.carrier || "N/A" : sampleTracking.carrier}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                                <span className="text-muted-foreground">Tracking #</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-foreground">
                                    {hasRealTracking ? order.tracking_number : sampleTracking.tracking_number}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-foreground/10"
                                    onClick={() =>
                                      copyToClipboard(
                                        hasRealTracking ? order.tracking_number! : sampleTracking.tracking_number,
                                        "tracking",
                                      )
                                    }
                                  >
                                    {copied === "tracking" ? (
                                      <Check className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                      <Copy className="h-4 w-4 text-foreground/60" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                                <span className="text-muted-foreground">Shipped</span>
                                <span className="text-foreground">
                                  {format(
                                    new Date(
                                      hasRealTracking && order.shipped_at ? order.shipped_at : sampleTracking.shipped_at,
                                    ),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Tab */}
                    {activeTab === "payment" && (
                      <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-foreground/60" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground">Payment Details</h4>
                          {!hasRealPayment && (
                            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                              Sample Data
                            </span>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                            <span className="text-muted-foreground">Currency</span>
                            <span className="font-semibold text-foreground uppercase">
                              {hasRealPayment ? order.crypto_payment_currency || "USDT" : samplePayment.currency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-mono text-xl font-bold text-foreground">
                              {hasRealPayment ? order.crypto_payment_amount || "—" : samplePayment.amount}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl bg-foreground/5 space-y-2">
                            <span className="text-muted-foreground text-sm">Payment Address</span>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm text-foreground break-all flex-1">
                                {hasRealPayment ? order.crypto_payment_address || "—" : samplePayment.address}
                              </p>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-foreground/10 shrink-0"
                                onClick={() =>
                                  copyToClipboard(
                                    hasRealPayment ? order.crypto_payment_address! : samplePayment.address,
                                    "address",
                                  )
                                }
                              >
                                {copied === "address" ? (
                                  <Check className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <Copy className="h-4 w-4 text-foreground/60" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-foreground/5 space-y-2">
                            <span className="text-muted-foreground text-sm">Transaction Hash</span>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm text-foreground break-all flex-1">
                                {hasRealPayment ? order.crypto_transaction_hash || "—" : samplePayment.transaction_hash}
                              </p>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-foreground/10 shrink-0"
                                onClick={() =>
                                  copyToClipboard(
                                    hasRealPayment ? order.crypto_transaction_hash! : samplePayment.transaction_hash,
                                    "hash",
                                  )
                                }
                              >
                                {copied === "hash" ? (
                                  <Check className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <Copy className="h-4 w-4 text-foreground/60" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-emerald-400/80">Payment Status</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-semibold text-emerald-400">Confirmed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === "timeline" && (
                      <div className="p-6 rounded-2xl bg-foreground/5 border border-border">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                            <History className="h-5 w-5 text-foreground/60" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground">Order Timeline</h4>
                          {timeline.length === 0 && (
                            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                              Sample Data
                            </span>
                          )}
                        </div>
                        <div className="relative pl-8 border-l-2 border-border ml-4 space-y-8">
                          {displayTimeline.map((event, index) => {
                            const isLatest = index === displayTimeline.length - 1
                            return (
                              <div key={event.id} className="relative">
                                <div
                                  className={cn(
                                    "absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2",
                                    isLatest
                                      ? "bg-white border-primary shadow-[0_0_12px_rgba(58,66,51,0.15)]"
                                      : "bg-foreground/10 border-border",
                                  )}
                                />
                                <div className="space-y-1">
                                  <p className={cn("text-base font-semibold", isLatest ? "text-foreground" : "text-foreground/70")}>
                                    {event.status}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{event.notes || event.description}</p>
                                  <p className="text-xs font-mono text-muted-foreground">
                                    {format(new Date(event.created_at), "MMM dd, yyyy 'at' h:mm a")}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Notes Tab */}
                    {activeTab === "notes" && (
                      <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-foreground/60" />
                            </div>
                            <h4 className="text-lg font-semibold text-foreground">Admin Notes</h4>
                          </div>
                          {!editingNotes && (
                            <Button
                              variant="ghost"
                              className="h-10 w-10 p-0 rounded-xl hover:bg-foreground/10"
                              onClick={() => setEditingNotes(true)}
                            >
                              <Edit2 className="h-4 w-4 text-foreground/60" />
                            </Button>
                          )}
                        </div>
                        {editingNotes ? (
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Add internal notes about this order..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[150px] rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground resize-none"
                            />
                            <div className="flex gap-3">
                              <Button
                                className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90"
                                onClick={handleSaveNotes}
                                disabled={saving}
                              >
                                <Save className="h-4 w-4 mr-2" /> Save Notes
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-11 px-6 rounded-xl hover:bg-foreground/10"
                                onClick={() => {
                                  setNotes(order.admin_notes || "")
                                  setEditingNotes(false)
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : notes ? (
                          <div className="p-5 rounded-xl bg-foreground/5 border border-border">
                            <p className="text-base text-foreground/80 whitespace-pre-wrap leading-relaxed">{notes}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4" />
                            <p className="text-lg mb-2">No notes yet</p>
                            <Button
                              variant="ghost"
                              className="text-foreground/60 hover:text-foreground"
                              onClick={() => setEditingNotes(true)}
                            >
                              Add a note
                            </Button>
                          </div>
                        )}

                        {order.refund_reason && (
                          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-sm font-medium text-red-400 mb-2">Refund Reason</p>
                            <p className="text-base text-foreground/80">{order.refund_reason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
      
      {/* Refund Modal */}
      <RefundModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        orderId={order.id}
        orderNumber={order.order_number || order.id.slice(0, 8).toUpperCase()}
        orderTotal={orderTotal}
        hasStripePayment={!!order.stripe_payment_intent_id}
        existingRefund={order.refund_status ? {
          refund_id: order.refund_id || null,
          refund_amount: order.refund_amount || null,
          refund_status: order.refund_status,
          refund_destination: order.refund_destination || null,
          refund_customer_message: order.refund_customer_message || null,
          refund_initiated_at: order.refund_initiated_at || null,
          refund_completed_at: order.refund_completed_at || null,
        } : null}
        onRefundComplete={handleRefundComplete}
      />
    </Collapsible>
  )
}

