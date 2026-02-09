"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { GlassCard } from "./glass-card"
import { GlassButton } from "./glass-button"
import { useSupplyStoreCart, formatPrice } from "@/lib/supply-store/cart"
import type { SupplyStoreProduct } from "@/lib/supply-store/types"
import { Plus, Check } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: SupplyStoreProduct
}

export function SupplyStoreProductCard({ product }: ProductCardProps) {
  const { addItem } = useSupplyStoreCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const savings = product.retail_price - product.wholesale_price
  const savingsPercent = Math.round((savings / product.retail_price) * 100)

  return (
    <Link href={`/supply-store/products/${product.sku}`}>
      <GlassCard hover className="h-full flex flex-col group" padding="none">
        {/* Large Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.product_name}
            fill
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-mono tracking-wider text-muted-foreground uppercase">Out of Stock</span>
            </div>
          )}
          {product.in_stock && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-foreground/90 text-background text-xs font-mono">
                Save {savingsPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 md:p-8">
          <div className="flex-1">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">{product.brand}</p>
            <h3 className="font-serif text-lg md:text-xl font-light mb-2 line-clamp-2">{product.product_name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
          </div>

          <div className="flex items-end justify-between gap-4 mt-auto">
            <div>
              <p className="font-mono text-2xl font-light">{formatPrice(product.wholesale_price)}</p>
              <p className="text-sm text-muted-foreground line-through">MSRP {formatPrice(product.retail_price)}</p>
            </div>
            <GlassButton
              onClick={handleAddToCart}
              disabled={!product.in_stock || added}
              size="md"
              variant={added ? "primary" : "default"}
              className="shrink-0"
            >
              {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
