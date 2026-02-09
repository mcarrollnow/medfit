"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SupplyStoreProduct, SupplyStoreCartItem } from "./types"

interface SupplyStoreCartStore {
  items: SupplyStoreCartItem[]
  addItem: (product: SupplyStoreProduct, quantity?: number) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useSupplyStoreCart = create<SupplyStoreCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.sku === product.sku)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.sku === product.sku 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item,
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },
      removeItem: (sku) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.sku !== sku),
        }))
      },
      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(sku)
          return
        }
        set((state) => ({
          items: state.items.map((item) => 
            item.product.sku === sku ? { ...item, quantity } : item
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.wholesale_price * item.quantity, 
          0
        )
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "supply-store-cart",
    },
  ),
)

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

