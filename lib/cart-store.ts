'use client'

import { create } from 'zustand'
import type { Product, CartItem } from '@/types'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { getAuthHeaders } from '@/lib/auth-client'

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: Product, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  fetchCart: () => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
  getItemCount: () => number
}


export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', {
        headers,
        credentials: 'include' // Include cookies for authentication
      })
      if (response.ok) {
        const data = await response.json()
        set({ items: data.items || [], isLoading: false })
      } else {
        set({ items: [], isLoading: false })
      }
    } catch (error) {
      console.error('[v0] Error fetching cart:', error)
      set({ items: [], isLoading: false })
    }
  },

  addItem: async (product: Product, quantity: number) => {
    try {
      console.log('[CartStore] Adding to cart:', product.barcode, quantity)
      
      // Check if we have a session token
      const supabase = getSupabaseBrowserClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('[CartStore] No valid session found')
        throw new Error('Please log in to add items to cart')
      }
      
      const headers = await getAuthHeaders()
      
      // Directly add to cart - the API will use auth.users.id
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ product_id: product.barcode, quantity }),
      })

      if (response.ok) {
        await get().fetchCart()
      } else if (response.status === 401) {
        console.error('[CartStore] Not authenticated - please log in')
        throw new Error('Please log in to add items to cart')
      } else {
        const error = await response.text()
        console.error('[CartStore] Error adding to cart:', error)
        throw new Error('Failed to add item to cart')
      }
    } catch (error) {
      console.error('[CartStore] Error adding to cart:', error)
      throw error
    }
  },

  removeItem: async (productId: string) => {
    // Note: productId here is actually the barcode
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers,
        credentials: 'include',
        body: JSON.stringify({ product_id: productId }),
      })

      if (response.ok) {
        await get().fetchCart()
      }
    } catch (error) {
      console.error('[v0] Error removing from cart:', error)
      throw error
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    // Note: productId here is actually the barcode
    try {
      // If quantity is 0 or less, remove the item instead
      if (quantity <= 0) {
        await get().removeItem(productId)
        return
      }

      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ product_id: productId, quantity }),
      })

      if (response.ok) {
        await get().fetchCart()
      } else {
        console.error('[CartStore] Failed to update quantity:', response.status)
      }
    } catch (error) {
      console.error('[CartStore] Error updating quantity:', error)
      throw error
    }
  },

  clearCart: async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart/clear', { 
        method: 'POST',
        headers,
        credentials: 'include'
      })
      if (response.ok) {
        set({ items: [] })
      }
    } catch (error) {
      console.error('[v0] Error clearing cart:', error)
      throw error
    }
  },

  getTotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product?.display_price || item.product?.retail_price || 0
      return total + price * item.quantity
    }, 0)
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))
