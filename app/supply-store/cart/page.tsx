"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupplyStoreCart, formatPrice } from "@/lib/supply-store/cart"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, CreditCard, Shield, Truck } from "lucide-react"
import { useState } from "react"

export default function SupplyStoreCartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useSupplyStoreCart()
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = getTotal()
  const shipping = subtotal >= 500 ? 0 : 49
  const total = subtotal + shipping

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/supply-store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout error:", data.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-24 md:py-32 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard padding="xl" className="max-w-md text-center">
            <div className="glass-button rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
              Your Cart is
              <span className="italic text-muted-foreground"> Empty</span>
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Looks like you haven&apos;t added any products yet. Browse our catalog to find professional-grade equipment
              for your facility.
            </p>
            <Link href="/supply-store/products">
              <GlassButton variant="primary" size="lg" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Browse Products
              </GlassButton>
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 md:mb-24 gap-6"
        >
          <div>
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Your Order
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
              Shopping
              <br />
              <span className="italic text-muted-foreground">Cart</span>
            </h1>
            <p className="text-muted-foreground mt-4">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <GlassButton onClick={clearCart} variant="outline" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </GlassButton>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.product.sku}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard padding="none" className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-40 aspect-square sm:aspect-auto shrink-0 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden">
                    <Image
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.product_name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div className="flex justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-1">
                          {item.product.brand}
                        </p>
                        <Link href={`/supply-store/products/${item.product.sku}`}>
                          <h3 className="font-serif text-lg md:text-xl font-light hover:text-muted-foreground transition-colors">
                            {item.product.product_name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.sku)}
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <GlassButton
                          onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                          size="sm"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </GlassButton>
                        <span className="w-12 text-center font-mono font-light">{item.quantity}</span>
                        <GlassButton onClick={() => updateQuantity(item.product.sku, item.quantity + 1)} size="sm">
                          <Plus className="w-4 h-4" />
                        </GlassButton>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-mono text-xl font-light">{formatPrice(item.product.wholesale_price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.product.wholesale_price)} each</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-32 space-y-6"
            >
              <GlassCard padding="lg">
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-mono">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground italic">Free shipping on orders over $500</p>
                  )}
                  <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                    <div className="flex justify-between">
                      <span className="font-serif text-xl font-light">Total</span>
                      <span className="font-mono text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <GlassButton
                  onClick={handleCheckout}
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 mb-4"
                >
                  <CreditCard className="w-5 h-5" />
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </GlassButton>

                <Link href="/supply-store/products">
                  <GlassButton variant="outline" size="lg" className="w-full gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Continue Shopping
                  </GlassButton>
                </Link>
              </GlassCard>

              {/* Trust Badges */}
              <GlassCard padding="md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="glass-button rounded-xl p-2">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-light">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="glass-button rounded-xl p-2">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-light">Fast Delivery</p>
                      <p className="text-xs text-muted-foreground">Ships within 2-5 business days</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
