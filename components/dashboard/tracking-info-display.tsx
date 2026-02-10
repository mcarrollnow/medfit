"use client"

import { useState, useEffect } from "react"
import { 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Copy,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchTrackingInfo, type TrackingResult } from "@/app/actions/tracking"

interface TrackingInfoDisplayProps {
  trackingNumber: string | null
  carrier?: string
  className?: string
}

// Status icons based on AfterShip status codes
const statusIcons: Record<string, typeof Package> = {
  'Pending': Clock,
  'InfoReceived': Package,
  'InTransit': Truck,
  'OutForDelivery': Truck,
  'AttemptFail': AlertCircle,
  'Delivered': CheckCircle2,
  'AvailableForPickup': MapPin,
  'Exception': AlertCircle,
  'Expired': AlertCircle,
}

const statusColors: Record<string, string> = {
  'Pending': 'text-muted-foreground bg-foreground/10 border-border',
  'InfoReceived': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  'InTransit': 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
  'OutForDelivery': 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  'AttemptFail': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  'Delivered': 'text-green-400 bg-green-500/20 border-green-500/30',
  'AvailableForPickup': 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  'Exception': 'text-red-400 bg-red-500/20 border-red-500/30',
  'Expired': 'text-muted-foreground bg-foreground/5 border-border',
}

export function TrackingInfoDisplay({ trackingNumber, carrier, className }: TrackingInfoDisplayProps) {
  const [tracking, setTracking] = useState<TrackingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchTracking = async () => {
    if (!trackingNumber || trackingNumber === 'Pending') return
    
    setLoading(true)
    try {
      const result = await fetchTrackingInfo(trackingNumber, carrier)
      setTracking(result)
    } catch (error) {
      console.error('Failed to fetch tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracking()
  }, [trackingNumber, carrier])

  const handleCopy = async () => {
    if (!trackingNumber) return
    await navigator.clipboard.writeText(trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // No tracking number yet
  if (!trackingNumber || trackingNumber === 'Pending') {
    return (
      <div className={cn("rounded-2xl border border-border bg-foreground/5 p-6", className)}>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-foreground/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Tracking Pending</p>
            <p className="text-sm text-muted-foreground">Tracking number will be available once your order ships</p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading && !tracking) {
    return (
      <div className={cn("rounded-2xl border border-border bg-foreground/5 p-6", className)}>
        <div className="flex items-center justify-center gap-3 py-8">
          <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
          <span className="text-muted-foreground">Loading tracking information...</span>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[tracking?.status || 'Pending'] || Package
  const statusColorClass = statusColors[tracking?.status || 'Pending'] || statusColors['Pending']

  return (
    <div className={cn("rounded-2xl border border-border bg-foreground/5 overflow-hidden", className)}>
      {/* Header with status */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn("h-14 w-14 rounded-xl border flex items-center justify-center", statusColorClass)}>
              <StatusIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={cn("text-lg font-bold", tracking?.status_color || 'text-foreground')}>
                  {tracking?.status_label || 'Unknown'}
                </span>
                {tracking?.estimated_delivery && (
                  <span className="text-sm text-muted-foreground">
                    Est. {formatDate(tracking.estimated_delivery)}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60">
                {tracking?.carrier_name || carrier || 'Carrier'} • {trackingNumber}
              </p>
              {tracking?.last_location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {tracking.last_location}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
              title="Copy tracking number"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={fetchTracking}
              disabled={loading}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors disabled:opacity-50"
              title="Refresh tracking"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Events Timeline */}
      {tracking?.events && tracking.events.length > 0 ? (
        <div className="p-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Tracking History
          </h4>
          <div className="space-y-1">
            {tracking.events.slice(0, 10).map((event, index, eventsArray) => {
              const isCurrent = index === 0  // Most recent event is first in the array
              const isDelivered = event.tag === 'Delivered'
              
              return (
                <div key={index} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index < eventsArray.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-0.5 h-full bg-foreground/10" />
                  )}
                  
                  {/* Timeline dot - all solid white, only current step has black inner dot */}
                  <div className={cn(
                    "relative z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    isCurrent && isDelivered 
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-primary"
                  )}>
                    {isCurrent && isDelivered && (
                      <CheckCircle2 className="h-4 w-4 text-foreground" />
                    )}
                    {isCurrent && !isDelivered && (
                      <div className="h-2 w-2 rounded-full bg-background" />
                    )}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 pb-6">
                    <p className={cn(
                      "font-medium",
                      isCurrent ? "text-foreground" : "text-foreground/60"
                    )}>
                      {event.description || 'Status update'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                      {event.location && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {tracking.events.length > 10 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              + {tracking.events.length - 10} more events
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No tracking events available yet</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for updates</p>
        </div>
      )}

      {/* Footer with carrier link */}
      {tracking?.carrier_link && (
        <div className="px-6 pb-6">
          <a
            href={tracking.carrier_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-card/90"
          >
            Track on {tracking.carrier_name} <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      )}
    </div>
  )
}

