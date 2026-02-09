"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Hash,
  Box,
  RefreshCw,
  ExternalLink,
  Clock,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  getShipments,
  getShipmentStats,
  type Shipment,
} from "@/app/actions/shipments"

type StatusFilter = 'all' | 'in_transit' | 'delivered' | 'issues'

interface TrackingEvent {
  date: string
  description: string
  location: string
  tag: string
}

interface TrackingInfo {
  tracking_number: string
  status_code: string
  status_description: string
  carrier: string
  carrier_name: string
  carrier_link: string | null
  estimated_delivery: string | null
  origin_country: string | null
  destination_country: string | null
  last_location: string | null
  last_update: string | null
  events: TrackingEvent[]
}

const statusConfig = {
  in_transit: { label: "In Transit", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
  stopped: { label: "Stopped", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  lost: { label: "Lost", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  seized: { label: "Seized", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  returned: { label: "Returned", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
}

export default function SupplierShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [stats, setStats] = useState({ inTransit: 0, delivered: 0, issues: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [trackingData, setTrackingData] = useState<Record<string, TrackingInfo | null>>({})
  const [loadingTracking, setLoadingTracking] = useState<Record<string, boolean>>({})
  const [trackingErrors, setTrackingErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [shipmentsData, statsData] = await Promise.all([
          getShipments(),
          getShipmentStats(),
        ])
        setShipments(shipmentsData)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading shipments:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchTrackingTimeline = useCallback(async (trackingNumber: string) => {
    if (!trackingNumber || loadingTracking[trackingNumber]) {
      return
    }

    // Allow retry if there was an error
    if (trackingData[trackingNumber] && !trackingErrors[trackingNumber]) {
      return
    }

    setLoadingTracking(prev => ({ ...prev, [trackingNumber]: true }))
    setTrackingErrors(prev => ({ ...prev, [trackingNumber]: '' }))

    try {
      console.log('[Tracking] Fetching:', trackingNumber)
      const response = await fetch(`/api/supplier/tracking?tracking=${encodeURIComponent(trackingNumber)}`)
      const data = await response.json()
      
      console.log('[Tracking] Response:', response.status, data)
      
      if (response.ok && data.events) {
        setTrackingData(prev => ({ ...prev, [trackingNumber]: data }))
      } else {
        setTrackingData(prev => ({ ...prev, [trackingNumber]: null }))
        setTrackingErrors(prev => ({ 
          ...prev, 
          [trackingNumber]: data.error || 'Could not fetch tracking info' 
        }))
      }
    } catch (error) {
      console.error("Error fetching tracking:", error)
      setTrackingData(prev => ({ ...prev, [trackingNumber]: null }))
      setTrackingErrors(prev => ({ 
        ...prev, 
        [trackingNumber]: 'Network error - please try again' 
      }))
    } finally {
      setLoadingTracking(prev => ({ ...prev, [trackingNumber]: false }))
    }
  }, [loadingTracking, trackingData, trackingErrors])

  const filteredShipments = shipments.filter((s) => {
    if (statusFilter === "in_transit" && s.status !== "in_transit") return false
    if (statusFilter === "delivered" && s.status !== "delivered") return false
    if (statusFilter === "issues" && !["stopped", "lost", "seized", "returned"].includes(s.status)) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTracking = s.tracking_number?.toLowerCase().includes(query)
      const matchesCarrier = s.carrier?.toLowerCase().includes(query)
      const matchesNotes = s.notes?.toLowerCase().includes(query)
      const matchesItems = s.items?.some(
        (item) =>
          item.product_code?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.product?.name?.toLowerCase().includes(query)
      )
      return matchesTracking || matchesCarrier || matchesNotes || matchesItems
    }

    return true
  })

  const getTrackingUrl = (carrier: string | null, tracking: string | null) => {
    if (!tracking) return null
    const c = carrier?.toLowerCase() || ""
    if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${tracking}`
    if (c.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`
    if (c.includes("dhl")) return `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${tracking}`
    if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`
    if (tracking.match(/^[A-Z]{2}\d+[A-Z]{2}$/i)) return `https://www.17track.net/en/track?nums=${tracking}`
    return `https://www.google.com/search?q=${tracking}+tracking`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-500/10 rounded-2xl p-6 inline-block mb-6">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          </div>
          <p className="text-muted-foreground font-mono">Loading shipments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/supplier"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Shipment Tracking
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance">
            Items in Transit
            <br />
            <span className="italic text-muted-foreground">Track and monitor deliveries</span>
          </h1>
        </motion.div>

        {/* Stats as Filter Buttons */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mb-16">
          {[
            { key: 'in_transit', value: stats.inTransit, label: 'In Transit', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10', activeBg: 'bg-blue-500/20' },
            { key: 'delivered', value: stats.delivered, label: 'Delivered', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', activeBg: 'bg-green-500/20' },
            { key: 'issues', value: stats.issues, label: 'Issues', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', activeBg: 'bg-red-500/20' },
          ].map((stat, index) => (
            <motion.button
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setStatusFilter(statusFilter === stat.key as StatusFilter ? "all" : stat.key as StatusFilter)}
              className={cn(
                "text-center transition-all duration-300",
                statusFilter === stat.key ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
            >
              <div className={cn(
                "rounded-2xl p-4 md:p-6 inline-block mb-4 transition-all border",
                statusFilter === stat.key 
                  ? `${stat.activeBg} border-white/20` 
                  : `${stat.bg} border-transparent`
              )}>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking, product, or description..."
              className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </motion.div>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.map((shipment, index) => {
            const config = statusConfig[shipment.status] || statusConfig.in_transit
            const StatusIcon = config.icon
            const isExpanded = expandedId === shipment.id
            const trackingUrl = getTrackingUrl(shipment.carrier, shipment.tracking_number)
            const totalItems = shipment.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : shipment.id)}
                  className="p-6 md:p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl p-3 ${config.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {shipment.tracking_number ? (
                            <span className="font-mono font-light">
                              {shipment.tracking_number.length > 20
                                ? `${shipment.tracking_number.slice(0, 20)}...`
                                : shipment.tracking_number}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">No tracking</span>
                          )}
                          <span className={`px-2 py-1 rounded-lg ${config.bg} text-xs font-mono ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {shipment.shipped_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(shipment.shipped_date).toLocaleDateString()}
                            </span>
                          )}
                          {shipment.carrier && (
                            <span className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {shipment.carrier}
                            </span>
                          )}
                          {totalItems > 0 && (
                            <span className="flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              {totalItems} items
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {trackingUrl && (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-blue-500/10 hover:bg-blue-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-blue-400 transition-colors"
                        >
                          <MapPin className="h-4 w-4" />
                          Track
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/[0.08]">
                        {/* Tracking Timeline */}
                        {shipment.tracking_number && (
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                                Tracking Timeline
                              </p>
                              {(!trackingData[shipment.tracking_number] || trackingErrors[shipment.tracking_number]) && !loadingTracking[shipment.tracking_number] && (
                                <button
                                  onClick={() => fetchTrackingTimeline(shipment.tracking_number!)}
                                  className="bg-blue-500/10 hover:bg-blue-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-mono text-blue-400 transition-colors"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  {trackingErrors[shipment.tracking_number] ? 'Retry' : 'Load Timeline'}
                                </button>
                              )}
                            </div>

                            {loadingTracking[shipment.tracking_number] && (
                              <div className="flex items-center justify-center py-8 text-blue-400">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                <span className="font-mono text-sm">Loading tracking info...</span>
                              </div>
                            )}

                            {trackingData[shipment.tracking_number] && (
                              <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                                {/* Status Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "rounded-xl p-3",
                                      trackingData[shipment.tracking_number]?.status_code === 'Delivered' 
                                        ? "bg-green-500/10" 
                                        : trackingData[shipment.tracking_number]?.status_code === 'InTransit'
                                        ? "bg-blue-500/10"
                                        : trackingData[shipment.tracking_number]?.status_code === 'Exception'
                                        ? "bg-red-500/10"
                                        : "bg-white/5"
                                    )}>
                                      {trackingData[shipment.tracking_number]?.status_code === 'Delivered' ? (
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                      ) : trackingData[shipment.tracking_number]?.status_code === 'InTransit' ? (
                                        <Truck className="h-5 w-5 text-blue-400" />
                                      ) : trackingData[shipment.tracking_number]?.status_code === 'Exception' ? (
                                        <AlertTriangle className="h-5 w-5 text-red-400" />
                                      ) : (
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-serif text-lg font-light">
                                        {trackingData[shipment.tracking_number]?.status_description}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        via {trackingData[shipment.tracking_number]?.carrier_name}
                                      </p>
                                    </div>
                                  </div>
                                  {trackingData[shipment.tracking_number]?.estimated_delivery && (
                                    <div className="text-left md:text-right">
                                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-1">
                                        Estimated Delivery
                                      </p>
                                      <p className="font-mono font-light text-green-400">
                                        {new Date(trackingData[shipment.tracking_number]!.estimated_delivery!).toLocaleDateString('en-US', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Timeline Events */}
                                <div className="space-y-0">
                                  {trackingData[shipment.tracking_number]?.events.slice(0, 10).map((event, idx) => (
                                    <div key={idx} className="relative pl-8 pb-6 last:pb-0">
                                      {idx < (trackingData[shipment.tracking_number]?.events.length || 0) - 1 && idx < 9 && (
                                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-white/10" />
                                      )}
                                      <div className={cn(
                                        "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center",
                                        idx === 0 
                                          ? event.tag === 'Delivered' 
                                            ? "bg-green-500" 
                                            : "bg-blue-500"
                                          : "bg-white/10 border border-white/20"
                                      )}>
                                        {idx === 0 ? (
                                          event.tag === 'Delivered' ? (
                                            <CheckCircle className="h-3 w-3 text-white" />
                                          ) : (
                                            <Clock className="h-3 w-3 text-white" />
                                          )
                                        ) : (
                                          <div className="w-2 h-2 rounded-full bg-white/40" />
                                        )}
                                      </div>
                                      <div>
                                        <p className={cn(
                                          "font-light",
                                          idx === 0 ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                          {event.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1 font-mono text-xs">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: 'numeric',
                                              minute: '2-digit'
                                            })}
                                          </span>
                                          {event.location && (
                                            <span className="flex items-center gap-1 text-xs">
                                              <MapPin className="h-3 w-3" />
                                              {event.location}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(trackingData[shipment.tracking_number]?.events.length || 0) > 10 && (
                                    <p className="text-sm text-muted-foreground pl-8 pt-2 font-mono">
                                      +{(trackingData[shipment.tracking_number]?.events.length || 0) - 10} more events
                                    </p>
                                  )}
                                </div>

                                {trackingData[shipment.tracking_number]?.events.length === 0 && (
                                  <div className="text-center py-8">
                                    <div className="bg-blue-500/10 rounded-xl p-4 inline-block mb-4">
                                      <Clock className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <p className="text-muted-foreground font-mono text-sm">No tracking events yet</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {trackingErrors[shipment.tracking_number] && !loadingTracking[shipment.tracking_number] && (
                              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
                                <div className="bg-red-500/10 rounded-xl p-4 inline-block mb-4">
                                  <AlertTriangle className="h-6 w-6 text-red-400" />
                                </div>
                                <p className="text-red-400">{trackingErrors[shipment.tracking_number]}</p>
                                <p className="text-xs text-muted-foreground mt-2 font-mono">
                                  The carrier may not be supported or tracking hasn&apos;t updated yet
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Notes */}
                        {shipment.notes && (
                          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-8">
                            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">Notes</p>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{shipment.notes}</p>
                          </div>
                        )}

                        {/* Items */}
                        {shipment.items && shipment.items.length > 0 ? (
                          <div>
                            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
                              Items ({shipment.items.length})
                            </p>
                            <div className="space-y-3">
                              {shipment.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="bg-blue-500/10 rounded-lg p-2">
                                      <Hash className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        {item.product_code && (
                                          <span className="font-mono text-sm text-blue-400">
                                            {item.product_code}
                                          </span>
                                        )}
                                        {item.product && (
                                          <>
                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm">
                                              {item.product.name}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-mono text-lg font-light">
                                      {item.quantity}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">units</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="bg-white/5 rounded-xl p-4 inline-block mb-4">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-mono text-sm">No items recorded for this shipment</p>
                          </div>
                        )}

                        {/* Inventory Status */}
                        <div className="mt-8 pt-6 border-t border-white/[0.08]">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono",
                            shipment.counted_in_inventory
                              ? "bg-green-500/10 text-green-400"
                              : "bg-white/5 text-muted-foreground"
                          )}>
                            {shipment.counted_in_inventory ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Added to Inventory
                              </>
                            ) : (
                              "Not yet added to inventory"
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {filteredShipments.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-white/5 rounded-2xl p-6 inline-block mb-6">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-mono">No shipments found</p>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
