"use client"

import { useState } from "react"
import {
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  Clock,
  MessageSquare,
  Copy,
  Receipt,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReceiptModal } from "./receipt-modal"
import { SupportTicketFlow } from "./support-ticket-flow"
import { TrackingInfoDisplay } from "./tracking-info-display"

interface OrderProps {
  order: any // Using any for simplicity in this mock, ideally define a type
}

export function OrderCard({ order }: OrderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
      >
        {/* Card Header / Summary */}
        <CollapsibleTrigger className="flex w-full flex-col gap-6 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Package className="h-8 w-8 text-white/80" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-bold tracking-tight text-white">{order.id}</h4>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border",
                    order.status === "Delivered"
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white text-black border-transparent",
                  )}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-white/60">
                {order.date} • {order.items.length} Items
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-8 md:justify-end">
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-white">{order.total}</p>
              <p className="text-xs text-white/40">+{order.points_earned} Points</p>
            </div>
            <ChevronDown
              className={cn("h-6 w-6 text-white/40 transition-transform duration-300", isOpen && "rotate-180")}
            />
          </div>
        </CollapsibleTrigger>

        {/* Expanded Details */}
        <CollapsibleContent>
          <div className="border-t border-white/10 p-6 md:p-8">
            <div className="space-y-10">
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowReceipt(true)
                  }}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-bold text-white transition-all hover:bg-white/10"
                >
                  <Receipt className="h-5 w-5" />
                  Create Receipt
                </button>
              </div>

              {/* Timeline Section */}
              <div>
                <h5 className="mb-8 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-white/40">
                  <Clock className="h-5 w-5" /> Order Timeline
                </h5>
                <div className="relative flex w-full justify-between px-4">
                  {/* Connecting Line */}
                  <div className="absolute left-0 top-3 h-0.5 w-full bg-white/10" />

                  {order.timeline.map((step: any, index: number) => (
                    <div key={index} className="relative flex flex-col items-center gap-3">
                      <div
                        className={cn(
                          "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-500",
                          step.completed ? "border-white bg-white" : "border-white/20 bg-black",
                        )}
                      >
                        {step.completed && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-sm font-semibold whitespace-nowrap mb-1",
                            step.completed ? "text-white" : "text-white/40",
                          )}
                        >
                          {step.status}
                        </p>
                        {step.date && <p className="text-xs text-white/40">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="tracking" className="w-full">
                <TabsList className="mb-8 grid w-full grid-cols-2 rounded-xl border border-white/10 bg-white/5 h-auto">
                  <TabsTrigger
                    value="tracking"
                    className="rounded-xl py-4 text-base font-bold text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg h-full"
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    Tracking
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="rounded-xl py-4 text-base font-bold text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg h-full"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment
                  </TabsTrigger>
                </TabsList>

                {/* Tracking Tab Content */}
                <TabsContent value="tracking" className="mt-0">
                  <TrackingInfoDisplay 
                    trackingNumber={order.tracking?.number || order._original?.tracking_number || null}
                    carrier={order.tracking?.carrier || order._original?.shipping_carrier}
                  />
                </TabsContent>

                {/* Payment Tab Content */}
                <TabsContent value="payment" className="mt-0">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                    <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-white">Payment Details</h5>
                    <div className="space-y-6">
                      <div>
                        <p className="mb-2 text-sm font-medium text-white/40">Payment Method</p>
                        <p className="text-xl font-semibold text-white">{order.payment.method}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-white/40">Transaction Hash</p>
                        <div className="flex items-center gap-3">
                          <p className="font-mono text-base text-white/80 break-all">{order.payment.hash}</p>
                          <button className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-white/40">Total Paid</p>
                        <p className="font-mono text-3xl font-bold text-white">{order.payment.amount}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Items List */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
              <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-white">Order Items</h5>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-white/10" />
                      <div>
                        <p className="text-base font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-white/40">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-mono text-lg font-bold text-white">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div className="mt-8 border-t border-white/10 pt-8">
              <button
                onClick={() => setShowSupport(!showSupport)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-left transition-colors duration-200 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-base font-bold text-white">Need help with this order?</span>
                </div>
                <ChevronDown
                  className={cn("h-5 w-5 text-white/60 transition-transform duration-300", showSupport && "rotate-180")}
                />
              </button>

              {showSupport && (
                <div className="mt-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <SupportTicketFlow
                      orderId={order.dbId || order.id}
                      onClose={() => {
                        setShowSupport(false)
                        console.log("Ticket flow completed")
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <ReceiptModal order={order} isOpen={showReceipt} onClose={() => setShowReceipt(false)} />
    </>
  )
}
