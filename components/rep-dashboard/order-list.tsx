"use client"

import { OrderCard } from "./order-card"
import type { RepOrder } from "@/app/actions/rep"

interface OrderListProps {
  orders: RepOrder[]
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-foreground">Recent Orders</h2>
        <span className="text-sm text-muted-foreground">{orders.length} orders found</span>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No orders yet</p>
            <p className="text-sm mt-2">Orders from your assigned customers will appear here</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}
