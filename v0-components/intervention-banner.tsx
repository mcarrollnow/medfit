"use client"

import { AlertTriangle, MessageCircle, XCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProblematicOrder {
  id: string
  orderNumber: string
  amount: number
  daysSinceOrder: number
  paymentStatus: string
  issue: string
}

interface InterventionBannerProps {
  orders: ProblematicOrder[]
  onContactCustomer: (order: ProblematicOrder) => void
  onCancelOrder: (orderId: string) => void
  onSendToSupport: (order: ProblematicOrder) => void
}

export function InterventionBanner({
  orders,
  onContactCustomer,
  onCancelOrder,
  onSendToSupport,
}: InterventionBannerProps) {
  if (orders.length === 0) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-6 mb-6 rounded-lg border-2 border-red-500 bg-red-500/10">
      <div className="flex items-start gap-4 mb-4">
        <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1 text-red-500" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Orders Requiring Intervention</h2>
          <p className="text-base mb-4 text-muted-foreground">
            The following orders have issues that need immediate attention. Please review and take appropriate action.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Problematic Orders ({orders.length})</h3>
        {orders.map((order) => (
          <div key={order.id} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="font-bold text-foreground">Order #{order.orderNumber}</span>
                <span className="text-lg font-semibold ml-4 text-foreground">{formatCurrency(order.amount)}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
                <span>{order.daysSinceOrder} days old</span>
                <span>Payment: {order.paymentStatus}</span>
                <span className="text-red-500 font-medium">{order.issue}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onContactCustomer(order)}
                variant="outline"
                className="px-4 py-2 rounded-md font-medium border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-black"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
              <Button
                onClick={() => onCancelOrder(order.id)}
                variant="outline"
                className="px-4 py-2 rounded-md font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Order
              </Button>
              <Button
                onClick={() => onSendToSupport(order)}
                variant="outline"
                className="px-4 py-2 rounded-md font-medium"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Send to Support
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-md border border-border bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Orders older than 7 days with pending payment should be contacted immediately. Consider
          canceling orders with failed payments after 3 contact attempts.
        </p>
      </div>
    </div>
  )
}
