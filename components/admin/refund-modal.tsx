"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  X,
  DollarSign,
  CreditCard,
  Wallet,
  Send,
  AlertCircle,
  Check,
  Clock,
  ArrowRight,
  RefreshCw,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RefundTimelineEntry {
  id: string
  status: string
  description: string
  created_at: string
  metadata?: any
}

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber: string
  orderTotal: number
  hasStripePayment: boolean
  existingRefund?: {
    refund_id: string | null
    refund_amount: number | null
    refund_status: string | null
    refund_destination: string | null
    refund_customer_message: string | null
    refund_initiated_at: string | null
    refund_completed_at: string | null
  } | null
  onRefundComplete?: () => void
}

const refundDestinations = [
  {
    id: "original_payment",
    label: "Original Payment Method",
    description: "Refund directly to the card used for purchase",
    icon: CreditCard,
    requiresStripe: true,
  },
  {
    id: "store_credit",
    label: "Store Credit",
    description: "Add the amount to customer's account balance",
    icon: Wallet,
    requiresStripe: false,
  },
  {
    id: "manual",
    label: "Manual Refund",
    description: "Process refund manually outside the system",
    icon: DollarSign,
    requiresStripe: false,
  },
]

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof Check }> = {
  pending: { color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20", icon: Clock },
  processing: { color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", icon: RefreshCw },
  succeeded: { color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/20", icon: Check },
  failed: { color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
  cancelled: { color: "text-muted-foreground", bgColor: "bg-zinc-500/10 border-zinc-500/20", icon: X },
  initiated: { color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", icon: RotateCcw },
}

export function RefundModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  orderTotal,
  hasStripePayment,
  existingRefund,
  onRefundComplete,
}: RefundModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "processing" | "complete">("form")
  const [refundType, setRefundType] = useState<"full" | "partial">("full")
  const [refundAmount, setRefundAmount] = useState(orderTotal.toString())
  const [refundDestination, setRefundDestination] = useState<string>(
    hasStripePayment ? "original_payment" : "store_credit"
  )
  const [customerMessage, setCustomerMessage] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeline, setTimeline] = useState<RefundTimelineEntry[]>([])
  const [loadingTimeline, setLoadingTimeline] = useState(false)

  const isAlreadyRefunded = existingRefund?.refund_status === "succeeded"
  const hasPendingRefund = existingRefund?.refund_status === "processing" || existingRefund?.refund_status === "pending"

  useEffect(() => {
    if (isOpen && existingRefund?.refund_id) {
      loadTimeline()
    }
  }, [isOpen, existingRefund])

  useEffect(() => {
    if (refundType === "full") {
      setRefundAmount(orderTotal.toString())
    }
  }, [refundType, orderTotal])

  const loadTimeline = async () => {
    setLoadingTimeline(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTimeline(data.timeline || [])
      }
    } catch (err) {
      console.error("Error loading timeline:", err)
    } finally {
      setLoadingTimeline(false)
    }
  }

  const handleSubmit = async () => {
    setError(null)
    
    const amount = parseFloat(refundAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid refund amount")
      return
    }
    if (amount > orderTotal) {
      setError("Refund amount cannot exceed order total")
      return
    }

    setStep("confirm")
  }

  const processRefund = async () => {
    setLoading(true)
    setError(null)
    setStep("processing")

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          refund_amount: parseFloat(refundAmount),
          refund_destination: refundDestination,
          customer_message: customerMessage || null,
          reason: refundReason || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to process refund")
        setStep("form")
        return
      }

      setStep("complete")
      
      // Refresh timeline
      await loadTimeline()
      
      // Notify parent
      onRefundComplete?.()
    } catch (err: any) {
      console.error("Refund error:", err)
      setError(err.message || "Failed to process refund")
      setStep("form")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderTimeline = () => {
    if (loadingTimeline) {
      return (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (timeline.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No refund activity yet
        </div>
      )
    }

    return (
      <div className="relative pl-8 border-l-2 border-border ml-4 space-y-6">
        {timeline.map((entry, index) => {
          const config = statusConfig[entry.status] || statusConfig.pending
          const StatusIcon = config.icon
          const isLatest = index === timeline.length - 1

          return (
            <div key={entry.id} className="relative">
              <div
                className={cn(
                  "absolute -left-[25px] top-0 h-5 w-5 rounded-full border-2 flex items-center justify-center",
                  isLatest
                    ? `${config.bgColor} border-current ${config.color}`
                    : "bg-foreground/10 border-border"
                )}
              >
                <StatusIcon className={cn("h-3 w-3", isLatest ? config.color : "text-muted-foreground")} />
              </div>
              <div className="space-y-1">
                <p className={cn("text-sm font-semibold capitalize", isLatest ? "text-foreground" : "text-foreground/70")}>
                  {entry.status.replace("_", " ")}
                </p>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
                <p className="text-xs font-mono text-muted-foreground">{formatDate(entry.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <RotateCcw className="h-5 w-5" />
                  {isAlreadyRefunded ? "Refund Details" : hasPendingRefund ? "Refund in Progress" : "Issue Refund"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Order #{orderNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Already Refunded or Pending View */}
              {(isAlreadyRefunded || hasPendingRefund) && existingRefund && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div
                    className={cn(
                      "p-5 rounded-2xl border",
                      existingRefund.refund_status === "succeeded"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-amber-500/10 border-amber-500/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {existingRefund.refund_status === "succeeded" ? (
                        <Check className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Clock className="h-6 w-6 text-amber-400" />
                      )}
                      <div>
                        <p className={cn(
                          "font-semibold text-lg",
                          existingRefund.refund_status === "succeeded" ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {existingRefund.refund_status === "succeeded"
                            ? "Refund Completed"
                            : "Refund Processing"}
                        </p>
                        <p className="text-sm text-foreground/60">
                          ${existingRefund.refund_amount?.toFixed(2)} via{" "}
                          {existingRefund.refund_destination?.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Refund Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${existingRefund.refund_amount?.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Initiated</p>
                      <p className="text-lg font-medium text-foreground">
                        {existingRefund.refund_initiated_at
                          ? formatDate(existingRefund.refund_initiated_at)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {existingRefund.refund_customer_message && (
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">Customer Message</p>
                      <p className="text-foreground">{existingRefund.refund_customer_message}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Refund Timeline</h3>
                    {renderTimeline()}
                  </div>
                </div>
              )}

              {/* Form View */}
              {!isAlreadyRefunded && !hasPendingRefund && step === "form" && (
                <>
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="p-5 rounded-2xl bg-foreground/5 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Order Total</p>
                        <p className="text-3xl font-bold text-foreground">${orderTotal.toFixed(2)}</p>
                      </div>
                      {hasStripePayment && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                          <CreditCard className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Card Payment</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Refund Type */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">Refund Amount</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setRefundType("full")}
                        className={cn(
                          "p-4 rounded-xl border transition-all text-left",
                          refundType === "full"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-foreground/5 text-foreground border-border hover:bg-foreground/10"
                        )}
                      >
                        <p className="font-semibold">Full Refund</p>
                        <p className={cn("text-sm", refundType === "full" ? "text-black/60" : "text-muted-foreground")}>
                          ${orderTotal.toFixed(2)}
                        </p>
                      </button>
                      <button
                        onClick={() => setRefundType("partial")}
                        className={cn(
                          "p-4 rounded-xl border transition-all text-left",
                          refundType === "partial"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-foreground/5 text-foreground border-border hover:bg-foreground/10"
                        )}
                      >
                        <p className="font-semibold">Partial Refund</p>
                        <p className={cn("text-sm", refundType === "partial" ? "text-black/60" : "text-muted-foreground")}>
                          Custom amount
                        </p>
                      </button>
                    </div>

                    {refundType === "partial" && (
                      <div className="relative mt-4">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={orderTotal}
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="h-14 pl-12 rounded-xl bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground"
                        />
                      </div>
                    )}
                  </div>

                  {/* Refund Destination */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">Refund Destination</Label>
                    <div className="space-y-3">
                      {refundDestinations.map((dest) => {
                        const isDisabled = dest.requiresStripe && !hasStripePayment
                        const Icon = dest.icon

                        return (
                          <button
                            key={dest.id}
                            onClick={() => !isDisabled && setRefundDestination(dest.id)}
                            disabled={isDisabled}
                            className={cn(
                              "w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4",
                              isDisabled
                                ? "opacity-50 cursor-not-allowed bg-foreground/[0.03] border-border"
                                : refundDestination === dest.id
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-foreground/5 text-foreground border-border hover:bg-foreground/10"
                            )}
                          >
                            <div
                              className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center",
                                refundDestination === dest.id
                                  ? "bg-foreground/10"
                                  : isDisabled
                                    ? "bg-foreground/5"
                                    : "bg-foreground/10"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-6 w-6",
                                  refundDestination === dest.id
                                    ? "text-black"
                                    : isDisabled
                                      ? "text-muted-foreground"
                                      : "text-foreground/60"
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{dest.label}</p>
                              <p
                                className={cn(
                                  "text-sm",
                                  refundDestination === dest.id
                                    ? "text-black/60"
                                    : isDisabled
                                      ? "text-muted-foreground"
                                      : "text-muted-foreground"
                                )}
                              >
                                {isDisabled ? "Requires card payment" : dest.description}
                              </p>
                            </div>
                            {refundDestination === dest.id && (
                              <Check className="h-5 w-5 text-black" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">Reason (Internal)</Label>
                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full h-14 rounded-xl bg-foreground/5 border border-border text-foreground px-4 focus:outline-none focus:border-border"
                    >
                      <option value="" className="bg-background">Select a reason...</option>
                      <option value="Customer request" className="bg-background">Customer request</option>
                      <option value="Order cancelled" className="bg-background">Order cancelled</option>
                      <option value="Item out of stock" className="bg-background">Item out of stock</option>
                      <option value="Shipping issue" className="bg-background">Shipping issue</option>
                      <option value="Product quality issue" className="bg-background">Product quality issue</option>
                      <option value="Duplicate order" className="bg-background">Duplicate order</option>
                      <option value="Other" className="bg-background">Other</option>
                    </select>
                  </div>

                  {/* Customer Message */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">
                      Message to Customer <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      placeholder="This message will be sent to the customer..."
                      rows={3}
                      className="rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="h-12 px-6 rounded-xl gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Continue to Review
                    </Button>
                  </div>
                </>
              )}

              {/* Confirmation View */}
              {step === "confirm" && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-400">Confirm Refund</p>
                        <p className="text-sm text-foreground/60 mt-1">
                          This action cannot be undone. Please review the details before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-foreground/5">
                      <span className="text-foreground/60">Amount</span>
                      <span className="text-2xl font-bold text-foreground">
                        ${parseFloat(refundAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-foreground/5">
                      <span className="text-foreground/60">Destination</span>
                      <span className="font-medium text-foreground capitalize">
                        {refundDestination.replace("_", " ")}
                      </span>
                    </div>
                    {refundReason && (
                      <div className="flex justify-between items-center p-4 rounded-xl bg-foreground/5">
                        <span className="text-foreground/60">Reason</span>
                        <span className="font-medium text-foreground">{refundReason}</span>
                      </div>
                    )}
                    {customerMessage && (
                      <div className="p-4 rounded-xl bg-foreground/5">
                        <p className="text-sm text-foreground/60 mb-2">Customer Message</p>
                        <p className="text-foreground">{customerMessage}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setStep("form")}
                      className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={processRefund}
                      disabled={loading}
                      className="h-12 px-6 rounded-xl gap-2 bg-red-600 hover:bg-red-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Confirm Refund
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Processing View */}
              {step === "processing" && (
                <div className="py-16 text-center space-y-6">
                  <div className="h-20 w-20 mx-auto rounded-full bg-foreground/5 flex items-center justify-center">
                    <RefreshCw className="h-10 w-10 text-foreground/60 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">Processing Refund</p>
                    <p className="text-muted-foreground mt-2">Please wait while we process the refund...</p>
                  </div>
                </div>
              )}

              {/* Complete View */}
              {step === "complete" && (
                <div className="py-12 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Check className="h-10 w-10 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-foreground">Refund Initiated</p>
                      <p className="text-muted-foreground mt-2">
                        ${parseFloat(refundAmount).toFixed(2)} refund has been initiated
                      </p>
                    </div>
                  </div>

                  {/* Timeline after completion */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground">Refund Timeline</h3>
                    {renderTimeline()}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={onClose}
                      className="h-12 px-8 rounded-xl"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

