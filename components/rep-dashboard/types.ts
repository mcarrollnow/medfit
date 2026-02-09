export type OrderStatus = "completed" | "processing" | "pending" | "cancelled"

export interface Customer {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  commission: number
}

export interface TrackingEvent {
  status: string
  date: string
  description: string
  location?: string
}

export interface Order {
  id: string
  customer: Customer
  date: string
  status: OrderStatus
  total: number
  commission: number
  items: OrderItem[]
  tracking?: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    timeline: TrackingEvent[]
  }
}

export interface EarningsData {
  date: string
  amount: number
}

export interface RepStats {
  totalEarnings: number
  pendingCommission: number
  activeOrders: number
  totalCustomers: number
}

