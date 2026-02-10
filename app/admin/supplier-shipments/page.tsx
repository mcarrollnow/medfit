"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Box,
  Truck,
  CheckCircle2,
  Lock,
  ChevronDown,
  PackagePlus,
  Image as ImageIcon,
  Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getAllSupplierShipments,
  markShipmentReceived,
  type SupplierShipment,
} from "@/app/actions/supplier-portal"
import { toast } from "react-hot-toast"

const STATUS_LABELS: Record<string, string> = {
  building: "Building",
  sealed: "Sealed",
  shipped: "Shipped",
  received: "Received",
}

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "shipped", label: "Shipped" },
  { value: "received", label: "Received" },
  { value: "building", label: "Building" },
]

export default function AdminSupplierShipmentsPage() {
  const [shipments, setShipments] = useState<SupplierShipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadShipments()
  }, [statusFilter])

  async function loadShipments() {
    setIsLoading(true)
    try {
      const data = await getAllSupplierShipments(statusFilter)
      setShipments(data)
    } catch (error) {
      console.error("Error loading shipments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkReceived = async (shipmentId: string, addToInventory: boolean) => {
    setProcessingId(shipmentId)
    try {
      const result = await markShipmentReceived(shipmentId, addToInventory)
      if (result.success) {
        toast.success(
          addToInventory
            ? `Marked received — ${result.itemsAdded} units added to inventory`
            : "Marked as received"
        )
        await loadShipments()
      } else {
        toast.error(result.error || "Failed to update")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  // Stats
  const shipped = shipments.filter(s => s.status === "shipped").length
  const received = shipments.filter(s => s.status === "received").length
  const totalItems = shipments.reduce((sum, s) => sum + (s.items?.reduce((is, i) => is + i.quantity, 0) || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <Package className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading supplier shipments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Admin</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Supplier Pipeline</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Supplier Shipments
            <br />
            <span className="italic text-muted-foreground">Receive and add to inventory</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mb-16">
          {[
            { value: shipped, label: "Awaiting Receipt" },
            { value: received, label: "Received" },
            { value: totalItems, label: "Total Items" },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="text-center">
              <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                <Package className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-4 py-3 rounded-xl font-mono text-sm whitespace-nowrap transition-all",
                statusFilter === tab.value
                  ? "bg-foreground text-background"
                  : "glass-button text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {shipments.map((shipment, index) => {
            const isExpanded = expandedShipment === shipment.id
            const itemCount = shipment.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
            const isProcessing = processingId === shipment.id

            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedShipment(isExpanded ? null : shipment.id)}
                  className="w-full p-6 md:p-8 text-left hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="glass-button rounded-xl p-3">
                        <Box className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-mono text-lg font-light">{shipment.shipment_number}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-mono bg-foreground/[0.07] border border-border">
                            {STATUS_LABELS[shipment.status]}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {itemCount} items
                          {shipment.photos?.length ? ` | ${shipment.photos.length} photos` : ""}
                          {shipment.tracking_number ? ` | ${shipment.tracking_number}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground font-mono">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </p>
                        {shipment.shipped_at && (
                          <p className="text-xs text-muted-foreground">
                            Shipped {new Date(shipment.shipped_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-border p-6 md:p-8 space-y-8">
                    {/* Items */}
                    <div>
                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Contents</p>
                      <div className="space-y-3">
                        {shipment.items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-foreground/[0.03] border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="glass-button rounded-lg p-2"><Box className="h-4 w-4" /></div>
                              <div>
                                <p className="text-foreground">{item.product_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.supplier_code && <span className="text-xs text-muted-foreground font-mono"><Hash className="h-3 w-3 inline mr-1" />{item.supplier_code}</span>}
                                  {item.product && <span className="text-xs text-muted-foreground font-mono">Linked: {item.product.name}</span>}
                                  {!item.product_id && <span className="text-xs text-muted-foreground font-mono italic">Not linked to product</span>}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono text-foreground">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Photos */}
                    {shipment.photos && shipment.photos.length > 0 && (
                      <div>
                        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Photos</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {shipment.photos.map((photo) => (
                            <a key={photo.id} href={photo.photo_url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden aspect-square border border-border hover:border-primary/[0.2] transition-colors">
                              <img src={photo.photo_url} alt={photo.caption || "Shipment photo"} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tracking */}
                    {shipment.tracking_number && (
                      <div>
                        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">Tracking</p>
                        <div className="bg-foreground/[0.03] border border-border rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-mono">{shipment.tracking_number}</p>
                              <p className="text-sm text-muted-foreground">{shipment.carrier || "Unknown carrier"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {shipment.status === "shipped" && (
                      <div className="flex flex-col md:flex-row gap-3">
                        <button
                          onClick={() => handleMarkReceived(shipment.id, true)}
                          disabled={isProcessing}
                          className="flex-1 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <PackagePlus className="h-5 w-5" />
                          {isProcessing ? "Processing..." : "Receive & Add to Inventory"}
                        </button>
                        <button
                          onClick={() => handleMarkReceived(shipment.id, false)}
                          disabled={isProcessing}
                          className="flex-1 py-4 rounded-2xl glass-button font-mono hover:bg-foreground/[0.08] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Receive Only
                        </button>
                      </div>
                    )}

                    {shipment.status === "received" && (
                      <div className="bg-foreground/[0.03] border border-border rounded-xl p-4 text-center">
                        <p className="text-muted-foreground font-mono text-sm">
                          Received {shipment.received_at ? new Date(shipment.received_at).toLocaleDateString() : ""}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {shipments.length === 0 && (
          <div className="text-center py-24">
            <div className="glass-button rounded-2xl p-6 inline-block mb-6">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-mono">No supplier shipments yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
