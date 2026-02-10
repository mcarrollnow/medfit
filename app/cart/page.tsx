"use client"

import { useCartStore } from "@/lib/cart-store"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import GlobalNav from "@/components/global-nav"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function CartPage() {
  const { items, fetchCart, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()

  // Restore session from URL parameters and fetch cart from Supabase
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    const searchParams = new URLSearchParams(window.location.search)
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    // Restore session
    if (accessToken && refreshToken) {
      console.log('[Cart] Restoring session from URL params')
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (error) {
          console.error('[Cart] Error restoring session:', error)
        } else {
          console.log('[Cart] Session restored successfully')
          fetchCart()
        }
        window.history.replaceState({}, '', window.location.pathname)
      })
    } else {
      fetchCart()
    }
  }, [fetchCart])

  const total = getTotal()
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <>
        <GlobalNav />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)] p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/[0.1] mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button className="bg-foreground/[0.08] hover:bg-foreground/[0.15] border border-border hover:border-border text-foreground backdrop-blur-sm" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)] p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)] p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout */}
              <Button
                className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl"
                size="lg"
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              <Button variant="ghost" className="w-full mt-3 text-foreground/60 hover:text-foreground hover:bg-foreground/[0.08]" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}