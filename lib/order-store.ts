"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./cart-store"

export interface Order {
  id: string
  items: CartItem[]
  total: number
  token: string
  transactionHash: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
}

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  addOrder: (order: Omit<Order, "id" | "timestamp" | "status">) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  setCurrentOrder: (order: Order | null) => void
  getOrderByTxHash: (txHash: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      addOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: `order-${Date.now()}`,
          timestamp: Date.now(),
          status: "pending",
        }

        set((state) => ({
          orders: [order, ...state.orders],
          currentOrder: order,
        }))

        return order
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
          currentOrder: state.currentOrder?.id === orderId ? { ...state.currentOrder, status } : state.currentOrder,
        }))
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order })
      },

      getOrderByTxHash: (txHash) => {
        return get().orders.find((order) => order.transactionHash === txHash)
      },
    }),
    {
      name: "order-storage",
    },
  ),
)
