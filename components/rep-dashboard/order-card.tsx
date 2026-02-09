"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  ChevronDown,
  Package,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
  Mail,
  MessageSquare,
  FileText,
  Truck,
  MapPin,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { GrainyCard } from "./grainy-card"
import type { RepOrder } from "@/app/actions/rep"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OrderCardProps {
  order: RepOrder
}

export function OrderCard({ order }: OrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statusColor: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    refunded: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return CheckCircle2
      case "cancelled":
      case "refunded":
        return XCircle
      default:
        return Clock
    }
  }

  const StatusIcon = getStatusIcon(order.status)

  const handleShare = (method: "email" | "text" | "pdf") => {
    console.log(`Sharing via ${method}`)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <GrainyCard hoverEffect className="group relative overflow-visible">
        <div className="relative z-10">
          <CollapsibleTrigger className="w-full p-6 text-left focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Customer & ID */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <User className="h-5 w-5 text-white/70" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{order.customer.name}</h3>
                  <p className="text-sm text-white/40 font-mono">{order.id.slice(0, 8)}...</p>
                </div>
              </div>

              {/* Middle: Status & Date */}
              <div className="flex items-center gap-6">
                <Badge
                  variant="outline"
                  className={cn("px-3 py-1 capitalize border", statusColor[order.status] || statusColor.pending)}
                >
                  <StatusIcon className="mr-2 h-3 w-3" />
                  {order.status}
                </Badge>
                <span className="text-sm text-white/40 hidden sm:block">
                  {format(new Date(order.date), "MMM dd, yyyy")}
                </span>
              </div>

              {/* Right: Commission & Expand */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Commission</p>
                  <p className="text-xl font-semibold text-emerald-400">+${order.commission.toFixed(2)}</p>
                </div>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 border border-white/10",
                    isOpen && "rotate-180 bg-white/10",
                  )}
                >
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-6 pb-6 pt-0">
              <div className="mt-4 border-t border-white/5 pt-6 space-y-8">
                {/* Order Details Section with Share Button */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-medium text-white/60 flex items-center gap-2 uppercase tracking-wider">
                      <Package className="h-4 w-4" /> Order Details
                    </h4>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2 text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <Share2 className="h-4 w-4" />
                          Share Details
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/10 backdrop-blur-xl">
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer gap-2"
                          onClick={() => handleShare("email")}
                        >
                          <Mail className="h-4 w-4" /> Email Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer gap-2"
                          onClick={() => handleShare("text")}
                        >
                          <MessageSquare className="h-4 w-4" /> Text Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer gap-2"
                          onClick={() => handleShare("pdf")}
                        >
                          <FileText className="h-4 w-4" /> Save as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    {order.items.length === 0 ? (
                      <p className="text-white/40 text-sm">No items in this order</p>
                    ) : (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-sm p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 gap-3"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-white/40 font-mono text-xs bg-white/5 px-2 py-1 rounded-md">
                              x{item.quantity}
                            </span>
                            <span className="text-white font-medium text-base">{item.productName}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-white/60">${item.price.toFixed(2)}</span>
                            <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                              Comm: ${item.commission.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Timeline Tracking Section */}
                {order.tracking && order.tracking.timeline.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-6 flex items-center gap-2 uppercase tracking-wider">
                      <Truck className="h-4 w-4" /> Shipment Tracking
                    </h4>
                    <div className="relative pl-4 border-l border-white/10 ml-2 space-y-8">
                      {order.tracking.timeline.map((event, index) => (
                        <div key={index} className="relative">
                          {/* Timeline dot */}
                          <div
                            className={cn(
                              "absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2",
                              index === 0
                                ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                : "bg-black border-white/20",
                            )}
                          />
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                            <div>
                              <p className={cn("text-sm font-medium", index === 0 ? "text-white" : "text-white/60")}>
                                {event.status}
                              </p>
                              <p className="text-xs text-white/40">{event.description}</p>
                            </div>
                            <div className="text-right sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 mt-1 sm:mt-0">
                              {event.location && (
                                <div className="flex items-center gap-1 text-xs text-white/40">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                              <span className="text-xs font-mono text-white/30">{event.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/30 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span>Carrier: {order.tracking.carrier}</span>
                      <span className="w-px h-3 bg-white/10 hidden sm:block" />
                      <span className="font-mono">Tracking: {order.tracking.trackingNumber}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end items-center gap-6 text-sm border-t border-white/5 pt-6">
                  <span className="text-white/40 uppercase tracking-wider">Order Total</span>
                  <span className="text-white font-light text-2xl">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </GrainyCard>
    </Collapsible>
  )
}
