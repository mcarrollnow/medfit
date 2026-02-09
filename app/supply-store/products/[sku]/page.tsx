"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { SupplyStoreProductCard } from "@/components/supply-store/product-card"
import { useSupplyStoreCart, formatPrice } from "@/lib/supply-store/cart"
import type { SupplyStoreProduct } from "@/lib/supply-store/types"
import { ArrowLeft, Plus, Minus, Check, ExternalLink, Shield, Truck, RotateCcw, Tag } from "lucide-react"

export default function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = use(params)
  const [product, setProduct] = useState<SupplyStoreProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<SupplyStoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/supply-store/products/${sku}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data.product)
          setRelatedProducts(data.relatedProducts || [])
        } else if (res.status === 404) {
          notFound()
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [sku])

  if (loading) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[rgba(255,255,255,0.03)] rounded w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-[rgba(255,255,255,0.03)] rounded-3xl" />
              <div className="space-y-4">
                <div className="h-8 bg-[rgba(255,255,255,0.03)] rounded w-3/4" />
                <div className="h-4 bg-[rgba(255,255,255,0.03)] rounded w-1/2" />
                <div className="h-32 bg-[rgba(255,255,255,0.03)] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}

function ProductDetail({ product, relatedProducts }: { product: SupplyStoreProduct; relatedProducts: SupplyStoreProduct[] }) {
  const { addItem, items } = useSupplyStoreCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const cartItem = items.find((item) => item.product.sku === product.sku)
  const savings = product.retail_price - product.wholesale_price
  const savingsPercent = Math.round((savings / product.retail_price) * 100)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  return (
    <div className="min-h-screen px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/supply-store/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24 md:mb-32">
          {/* Large Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard padding="none" className="sticky top-32">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.product_name}
                  fill
                  className="object-contain p-12"
                  priority
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg font-mono tracking-wider text-muted-foreground uppercase">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full bg-foreground/90 text-background text-sm font-mono">
                    Save {savingsPercent}%
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-sm font-mono tracking-wider text-muted-foreground uppercase">
                  {product.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-sm font-mono tracking-wider text-muted-foreground uppercase">
                  {product.brand}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 text-balance">
                {product.product_name}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing */}
            <GlassCard padding="lg">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm font-mono tracking-wider text-muted-foreground uppercase mb-1">Wholesale Price</p>
                  <p className="font-mono text-4xl font-light">{formatPrice(product.wholesale_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono tracking-wider text-muted-foreground uppercase mb-1">MSRP</p>
                  <p className="font-mono text-xl text-muted-foreground line-through">{formatPrice(product.retail_price)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                <Tag className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-light">
                  You save {formatPrice(savings)} ({savingsPercent}% off retail)
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <GlassButton onClick={decrementQuantity} size="md" disabled={quantity <= 1}>
                    <Minus className="w-5 h-5" />
                  </GlassButton>
                  <span className="w-16 text-center font-mono text-xl">{quantity}</span>
                  <GlassButton onClick={incrementQuantity} size="md">
                    <Plus className="w-5 h-5" />
                  </GlassButton>
                </div>
                <GlassButton
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || added}
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </GlassButton>
              </div>

              {cartItem && (
                <p className="text-sm text-muted-foreground mt-4 text-center italic">
                  {cartItem.quantity} already in cart ({formatPrice(cartItem.quantity * product.wholesale_price)})
                </p>
              )}
            </GlassCard>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: "Authentic Product" },
                { icon: Truck, label: "Free Shipping $500+" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <GlassCard key={label} padding="md" className="text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <GlassCard padding="lg">
                <h3 className="font-serif text-xl md:text-2xl font-light mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <GlassCard padding="lg">
                <h3 className="font-serif text-xl md:text-2xl font-light mb-4">Specifications</h3>
                <div className="divide-y divide-[rgba(255,255,255,0.08)]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Source Link */}
            {product.source_url && (
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on manufacturer website
              </a>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
                You May Also Like
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                Related
                <span className="italic text-muted-foreground"> Products</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p, index) => (
                <motion.div
                  key={p.sku}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SupplyStoreProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
