"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Box
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import {
  getShipments,
  updateShipment,
  markShipmentDelivered,
  type Shipment,
} from "@/app/actions/shipments"
import { syncShipmentsFromSheet, syncProductCodesFromSheet, relinkShipmentItemsToProducts } from "@/app/actions/sheets-sync"
import { fetchTrackingInfo, type TrackingResult } from "@/app/actions/tracking"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  in_transit: { 
    label: "In Transit", 
    color: "border-blue-500/50 text-blue-400",
    icon: Truck 
  },
  delivered: { 
    label: "Delivered", 
    color: "border-green-500/50 text-green-400",
    icon: CheckCircle 
  },
  stopped: { 
    label: "Stopped", 
    color: "border-yellow-500/50 text-yellow-400",
    icon: AlertTriangle 
  },
  lost: { 
    label: "Lost", 
    color: "border-red-500/50 text-red-400",
    icon: XCircle 
  },
  seized: { 
    label: "Seized", 
    color: "border-red-500/50 text-red-400",
    icon: XCircle 
  },
  returned: { 
    label: "Returned", 
    color: "border-orange-500/50 text-orange-400",
    icon: Package 
  },
}

const carrierLinks: Record<string, string> = {
  'DHL': 'https://www.dhl.com/en/express/tracking.html?AWB=',
  'USPS': 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  'UPS': 'https://www.ups.com/track?tracknum=',
  'FedEx': 'https://www.fedex.com/fedextrack/?trknbr=',
  '17Track': 'https://www.17track.net/?nums=',
}

type DateRange = '30' | '90' | '180' | '365' | 'all'

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; synced: number } | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange>("90")
  const [search, setSearch] = useState("")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [trackingInfo, setTrackingInfo] = useState<TrackingResult | null>(null)
  const [loadingTracking, setLoadingTracking] = useState(false)

  useEffect(() => {
    // Auto-sync from Google Sheets on page load
    const autoSync = async () => {
      setSyncing(true)
      try {
        // 1. Sync product codes from "USA current inventory" sheet
        // This updates products.barcode with codes like 482802
        const codeResult = await syncProductCodesFromSheet()
        console.log('Product codes synced:', codeResult.synced)
        
        // 2. Sync shipments from "Items in transit" sheet
        const shipResult = await syncShipmentsFromSheet()
        console.log('Shipments synced:', shipResult.synced)
        
        // 3. Re-link any existing shipment items to products
        const linkResult = await relinkShipmentItemsToProducts()
        console.log('Items re-linked:', linkResult.synced)
        
        const totalSynced = codeResult.synced + shipResult.synced + linkResult.synced
        if (totalSynced > 0) {
          setSyncResult({ success: true, synced: totalSynced })
          setTimeout(() => setSyncResult(null), 3000)
        }
      } catch (error) {
        console.error('Auto-sync failed:', error)
      }
      setSyncing(false)
      loadShipments()
    }
    autoSync()
  }, [])

  useEffect(() => {
    if (!syncing) loadShipments()
  }, [statusFilter])

  const loadShipments = async () => {
    setLoading(true)
    const data = await getShipments(statusFilter)
    setShipments(data)
    setLoading(false)
  }

  // Handle selecting a shipment and fetch tracking info
  const handleSelectShipment = async (shipment: Shipment) => {
    console.log('[Shipments] Selected shipment:', shipment.id, 'tracking:', shipment.tracking_number)
    setSelectedShipment(shipment)
    setTrackingInfo(null)
    
    // Only fetch if there's a tracking number
    if (shipment.tracking_number) {
      console.log('[Shipments] Fetching tracking for:', shipment.tracking_number)
      setLoadingTracking(true)
      try {
        const info = await fetchTrackingInfo(shipment.tracking_number, shipment.carrier || undefined)
        console.log('[Shipments] Tracking result:', info?.success ? 'SUCCESS' : 'FAILED', info)
        setTrackingInfo(info)
      } catch (error) {
        console.error('[Shipments] Error fetching tracking:', error)
      }
      setLoadingTracking(false)
    } else {
      console.log('[Shipments] No tracking number for this shipment')
    }
  }

  // Filter by date range
  const getDateCutoff = () => {
    if (dateRange === 'all') return null
    const days = parseInt(dateRange)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return cutoff
  }

  const filteredShipments = shipments.filter(s => {
    // Date filter
    const cutoff = getDateCutoff()
    if (cutoff && s.shipped_date) {
      const shipDate = new Date(s.shipped_date)
      if (shipDate < cutoff) return false
    }
    
    // Search filter
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      s.tracking_number?.toLowerCase().includes(searchLower) ||
      s.notes?.toLowerCase().includes(searchLower) ||
      s.items?.some(item => 
        item.product_code?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    )
  })

  const handleMarkDelivered = async (id: string) => {
    const addToInventory = confirm("Add items to inventory stock?")
    await markShipmentDelivered(id, addToInventory)
    loadShipments()
    setSelectedShipment(null)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateShipment(id, { status: newStatus })
    loadShipments()
  }

  const getTrackingLink = (shipment: Shipment) => {
    if (!shipment.tracking_number) return null
    const carrier = shipment.carrier || ''
    const baseUrl = carrierLinks[carrier] || carrierLinks['17Track']
    return `${baseUrl}${shipment.tracking_number}`
  }

  const stats = {
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    delivered: filteredShipments.filter(s => s.status === 'delivered').length,
    issues: shipments.filter(s => ['stopped', 'lost', 'seized', 'returned'].includes(s.status)).length,
  }

  // Detail View
  if (selectedShipment) {
    const StatusIcon = statusConfig[selectedShipment.status]?.icon || Package
    
    return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setSelectedShipment(null)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Shipments</span>
          </button>

          <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={statusConfig[selectedShipment.status]?.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[selectedShipment.status]?.label}
                </Badge>
                {selectedShipment.shipped_date && (
                  <span className="text-muted-foreground">
                    {new Date(selectedShipment.shipped_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-mono">
                {selectedShipment.tracking_number || 'No Tracking'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {selectedShipment.carrier || 'Unknown Carrier'} • {selectedShipment.items?.length || 0} items
              </p>
            </div>
            <div className="flex gap-3">
              {selectedShipment.tracking_number && (
                <a
                  href={getTrackingLink(selectedShipment) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="rounded-xl border-border text-foreground hover:bg-foreground/10">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                </a>
              )}
              {selectedShipment.status === 'in_transit' && (
                <Button 
                  onClick={() => handleMarkDelivered(selectedShipment.id)}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-card/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Delivered
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Tracking Info */}
          {selectedShipment.tracking_number && (
            <div className="rounded-2xl bg-foreground/5 border border-border p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Live Tracking
                  {loadingTracking && (
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
                  )}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectShipment(selectedShipment)}
                  disabled={loadingTracking}
                  className="text-foreground/60 hover:text-foreground"
                >
                  <RefreshCw className={cn("h-4 w-4", loadingTracking && "animate-spin")} />
                </Button>
              </div>
              
              {loadingTracking ? (
                <div className="text-center py-8 text-muted-foreground">
                  Fetching tracking information...
                </div>
              ) : trackingInfo ? (
                <div className="space-y-6">
                  {/* Carrier Info */}
                  {trackingInfo.carrier_name && trackingInfo.carrier_name !== 'Unknown' && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="text-foreground font-medium">{trackingInfo.carrier_name}</span>
                      {trackingInfo.origin_country && trackingInfo.destination_country && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground/60">
                            {trackingInfo.origin_country} → {trackingInfo.destination_country}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Status Banner */}
                  <div className={cn(
                    "rounded-xl p-4 border",
                    trackingInfo.status === 'Delivered' ? "bg-green-500/10 border-green-500/30" :
                    trackingInfo.status === 'InTransit' ? "bg-blue-500/10 border-blue-500/30" :
                    trackingInfo.status === 'OutForDelivery' ? "bg-cyan-500/10 border-cyan-500/30" :
                    trackingInfo.status === 'Exception' ? "bg-red-500/10 border-red-500/30" :
                    trackingInfo.status === 'AttemptFail' ? "bg-yellow-500/10 border-yellow-500/30" :
                    "bg-foreground/5 border-border"
                  )}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("text-lg font-semibold", trackingInfo.status_color)}>
                          {trackingInfo.status_label}
                        </p>
                        {trackingInfo.last_location && (
                          <p className="text-muted-foreground text-sm mt-1">
                            Last seen: {trackingInfo.last_location}
                          </p>
                        )}
                        {trackingInfo.last_update && (
                          <p className="text-muted-foreground text-xs mt-1">
                            Updated: {new Date(trackingInfo.last_update).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {trackingInfo.estimated_delivery && (
                          <div>
                            <p className="text-xs text-muted-foreground">Est. Delivery</p>
                            <p className="text-foreground font-mono">
                              {new Date(trackingInfo.estimated_delivery).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {trackingInfo.status === 'Delivered' && trackingInfo.last_update && (
                          <div>
                            <p className="text-xs text-muted-foreground">Delivered</p>
                            <p className="text-green-400 font-mono">
                              {new Date(trackingInfo.last_update).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {trackingInfo.events && trackingInfo.events.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">Tracking History</p>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {trackingInfo.events.slice(0, 10).map((event, idx, eventsArray) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "flex items-start gap-4 relative pl-6",
                              idx === 0 ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {/* All dots solid white, only current (first) step has black inner dot */}
                            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                              {idx === 0 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-background" />
                              )}
                            </div>
                            {idx < eventsArray.length - 1 && (
                              <div className="absolute left-[5px] top-5 w-[2px] h-full bg-foreground/10" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.description}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{new Date(event.date).toLocaleString()}</span>
                                {event.location && (
                                  <>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tracking data available</p>
                  <p className="text-sm mt-1">The package may not be in the carrier system yet</p>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div className="rounded-2xl bg-foreground/5 border border-border p-8 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Box className="h-5 w-5" />
              Shipment Items
            </h3>
            <div className="space-y-4">
              {selectedShipment.items && selectedShipment.items.length > 0 ? (
                selectedShipment.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-xl bg-foreground/5 border border-border p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-foreground/60" />
                      </div>
                      <div>
                        {item.product ? (
                          <>
                            <p className="text-foreground font-semibold">
                              {item.product.base_name} {item.product.variant}
                            </p>
                            <p className="text-sm text-muted-foreground font-mono">{item.product_code}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-mono text-foreground font-semibold">{item.product_code}</p>
                            <p className="text-sm text-yellow-400/80">Not linked to product</p>
                          </>
                        )}
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{item.quantity}</p>
                      <p className="text-xs text-muted-foreground">units</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No items listed</p>
              )}
            </div>
          </div>

          {/* Notes & Status */}
          <div className="rounded-2xl bg-foreground/5 border border-border p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">Status & Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Status</label>
                <Select 
                  value={selectedShipment.status} 
                  onValueChange={(v) => handleStatusChange(selectedShipment.id, v)}
                >
                  <SelectTrigger className="rounded-xl bg-foreground/5 border-border text-foreground w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="seized">Seized</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedShipment.notes && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Notes</label>
                  <p className="text-foreground/80">{selectedShipment.notes}</p>
                </div>
              )}
              {selectedShipment.counted_in_inventory && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Added to Inventory
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Incoming Shipments</h1>
            {syncing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Syncing...</span>
              </div>
            )}
            {syncResult && (
              <span className="text-sm text-green-400">✓ Synced {syncResult.synced} shipments</span>
            )}
          </div>
          <p className="text-lg text-muted-foreground">Track packages and inventory arrivals from Google Sheets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl bg-foreground/5 border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.inTransit}</p>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-foreground/5 border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.delivered}</p>
                <p className="text-sm text-muted-foreground">Delivered ({dateRange}d)</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-foreground/5 border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.issues}</p>
                <p className="text-sm text-muted-foreground">Issues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracking, codes, notes..."
              className="rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground h-12"
            />
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="rounded-xl bg-foreground/5 border-border text-foreground w-40 h-12">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 180 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="rounded-xl bg-foreground/5 border-border text-foreground w-40 h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="seized">Seized</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shipments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading shipments...</div>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No shipments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShipments.map((shipment, index) => {
              const StatusIcon = statusConfig[shipment.status]?.icon || Package
              const totalItems = shipment.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
              
              // Get product names for display
              const productNames = shipment.items?.map(item => 
                item.product 
                  ? `${item.product.base_name} ${item.product.variant || ''}`.trim()
                  : item.product_code
              ) || []
              const uniqueProducts = [...new Set(productNames)]
              
              return (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelectShipment(shipment)}
                  className="rounded-2xl bg-foreground/5 border border-border p-6 cursor-pointer hover:bg-foreground/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Status icon + Products */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          shipment.status === 'delivered' ? 'bg-green-500/20' :
                          shipment.status === 'in_transit' ? 'bg-blue-500/20' :
                          'bg-red-500/20'
                        )}
                      >
                        <StatusIcon 
                          className={cn(
                            "h-6 w-6",
                            shipment.status === 'delivered' ? 'text-green-400' :
                            shipment.status === 'in_transit' ? 'text-blue-400' :
                            'text-red-400'
                          )} 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Products as main content */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {uniqueProducts.slice(0, 4).map((name, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-foreground/10 border-border text-foreground font-medium"
                            >
                              {name}
                            </Badge>
                          ))}
                          {uniqueProducts.length > 4 && (
                            <Badge className="bg-foreground/5 border-border text-muted-foreground">
                              +{uniqueProducts.length - 4} more
                            </Badge>
                          )}
                          {uniqueProducts.length === 0 && (
                            <span className="text-muted-foreground text-sm">No items</span>
                          )}
                        </div>
                        {/* Secondary info */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant="outline" className={cn("text-xs", statusConfig[shipment.status]?.color)}>
                            {statusConfig[shipment.status]?.label}
                          </Badge>
                          <span>{totalItems} units</span>
                          {shipment.tracking_number && (
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[150px]">
                              {shipment.tracking_number.split(/[\n,]/)[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date + Arrow */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          {shipment.shipped_date 
                            ? new Date(shipment.shipped_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : '—'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shipment.status === 'delivered' ? 'Delivered' : 'Shipped'}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground/60 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
