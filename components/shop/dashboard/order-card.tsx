"use client"

import { useState } from "react"
import { ChevronDown, Package, Truck, CreditCard, Clock, MessageSquare, Copy, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderProps {
  order: any // Using any for simplicity in this mock, ideally define a type
}

export function OrderCard({ order }: OrderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group overflow-hidden rounded-3xl border border-border bg-foreground/40 backdrop-blur-xl transition-all duration-300 hover:border-border"
    >
      {/* Card Header / Summary */}
      <CollapsibleTrigger className="flex w-full flex-col gap-6 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 border border-border">
            <Package className="h-8 w-8 text-foreground/80" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold tracking-tight text-foreground">{order.id}</h4>
              <span className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border",
                order.status === "Delivered" 
                  ? "bg-foreground/10 border-border text-foreground" 
                  : "bg-primary text-primary-foreground border-transparent"
              )}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-foreground/60">{order.date} • {order.items.length} Items</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8 md:justify-end">
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-foreground">{order.total}</p>
            <p className="text-xs text-muted-foreground">+{order.points_earned} Points</p>
          </div>
          <ChevronDown className={cn(
            "h-6 w-6 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>

      {/* Expanded Details */}
      <CollapsibleContent className="bg-background">
        <div className="border-t border-border bg-background p-6 md:p-8">
          <div className="space-y-10">
            
            {/* Timeline Section */}
            <div>
              <h5 className="mb-8 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-5 w-5" /> Order Timeline
              </h5>
              <div className="relative flex w-full justify-between px-4">
                {/* Connecting Line */}
                <div className="absolute left-0 top-3 h-0.5 w-full bg-foreground/10" />
                
                {order.timeline.map((step: any, index: number) => (
                  <div key={index} className="relative flex flex-col items-center gap-3">
                    <div className={cn(
                      "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-500",
                      step.completed 
                        ? "border-primary bg-white" 
                        : "border-border bg-background"
                    )}>
                      {step.completed && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                    <div className="text-center">
                      <p className={cn(
                        "text-sm font-semibold whitespace-nowrap mb-1",
                        step.completed ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="tracking" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3 rounded-xl border border-border bg-foreground/60 h-auto">
                <TabsTrigger 
                  value="tracking" 
                  className="rounded-xl py-4 text-base font-bold text-foreground/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg h-full"
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger 
                  value="payment"
                  className="rounded-xl py-4 text-base font-bold text-foreground/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg h-full"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment
                </TabsTrigger>
                <TabsTrigger 
                  value="support"
                  className="rounded-xl py-4 text-base font-bold text-foreground/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg h-full"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Support
                </TabsTrigger>
              </TabsList>
              {/* </CHANGE> */}

              {/* Tracking Tab Content */}
              <TabsContent value="tracking" className="mt-0">
                <div className="rounded-2xl border border-border bg-foreground/60 p-8">
                  <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                    Shipment Details
                  </h5>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Carrier</p>
                      <p className="text-xl font-semibold text-foreground">{order.tracking.carrier}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Tracking Number</p>
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-2xl font-bold text-foreground">{order.tracking.number}</p>
                        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
                          <Copy className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <a 
                        href="#" 
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-card/90"
                      >
                        Track Shipment <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Payment Tab Content */}
              <TabsContent value="payment" className="mt-0">
                <div className="rounded-2xl border border-border bg-foreground/60 p-8">
                  <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                    Payment Details
                  </h5>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Payment Method</p>
                      <p className="text-xl font-semibold text-foreground">{order.payment.method}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Transaction Hash</p>
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-base text-foreground/80 break-all">{order.payment.hash}</p>
                        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Total Paid</p>
                      <p className="font-mono text-3xl font-bold text-foreground">{order.payment.amount}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Support Tab Content */}
              <TabsContent value="support" className="mt-0">
                <div className="rounded-2xl border border-border bg-foreground/60 p-8">
                  <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                    Order Support
                  </h5>
                  <div className="space-y-6">
                    <p className="text-base leading-relaxed text-foreground/70">
                      Need assistance with this order? Our research support team is available 24/7 to help with any questions or concerns about your peptide research materials.
                    </p>
                    <div className="space-y-4 pt-4">
                      <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-card/90">
                        Open Support Ticket
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border bg-foreground/5 p-4 text-center">
                          <p className="mb-1 text-xs text-muted-foreground">Response Time</p>
                          <p className="text-lg font-bold text-foreground">{'<'} 2 Hours</p>
                        </div>
                        <div className="rounded-xl border border-border bg-foreground/5 p-4 text-center">
                          <p className="mb-1 text-xs text-muted-foreground">Support Status</p>
                          <p className="text-lg font-bold text-foreground">Available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            {/* </CHANGE> */}

          </div>

          {/* Order Items List */}
          <div className="mt-10 rounded-2xl border border-border bg-foreground/60 p-8">
             <h5 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                Order Items
              </h5>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-foreground/10" />
                      <div>
                        <p className="text-base font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-mono text-lg font-bold text-foreground">{item.price}</p>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
