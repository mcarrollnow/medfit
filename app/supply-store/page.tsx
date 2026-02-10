"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { SupplyStoreProductCard } from "@/components/supply-store/product-card"
import { useSupplyStoreBusinessType } from "@/lib/supply-store/business-context"
import { SUPPLY_STORE_BUSINESS_TYPES, type SupplyStoreBusinessType } from "@/lib/supply-store/types"
import { ArrowRight, Shield, Truck, Headphones, Award, Dumbbell, Sparkles, Heart, ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import type { SupplyStoreProduct } from "@/lib/supply-store/types"

const categoryImages: Record<string, string> = {
  "Recovery Equipment": "/product_images/recovery/REC-001_normatec_elite.jpg",
  "Cold Plunge & Heat Therapy": "/product_images/cold_plunge/CPH-001_the_plunge_gen_2_pro_chiller.png",
  "Cardio Equipment": "/product_images/cardio/CAR-003_rowerg_model_d.png",
  "Strength Equipment": "/product_images/strength/STR-001_rep_x_pépin_fast_series_85lb_pair.png",
  "Accessories & Consumables": "/product_images/accessories/ACC-001_resistance_band_set_5_levels.png",
  "Supplements": "/product_images/supplements/SUP-006_electrolyte_powder_90_servings.png",
}

const icons = {
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  heart: Heart,
}

export default function SupplyStoreHomePage() {
  const { businessType, setBusinessType } = useSupplyStoreBusinessType()
  const currentBusiness = SUPPLY_STORE_BUSINESS_TYPES[businessType]
  const [products, setProducts] = useState<SupplyStoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/supply-store/products?business_type=${businessType}&limit=4`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [businessType])

  const relevantCategories = currentBusiness.categories

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Eyebrow */}
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
                B2B Wholesale Pricing
              </p>

              {/* Hero Title - Chronicles style */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9]">
                Equip Your
                <br />
                <span className="italic text-muted-foreground">Wellness Facility</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Premium wholesale equipment and supplies for {currentBusiness.name.toLowerCase()}. Professional-grade
                recovery, fitness, and wellness products at competitive B2B prices.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/supply-store/products">
                  <GlassButton size="lg" variant="primary" className="gap-2">
                    Browse Products
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/supply-store/contact">
                  <GlassButton size="lg" variant="outline">
                    Request Quote
                  </GlassButton>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm">Free Shipping $500+</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <GlassCard className="aspect-square" padding="lg">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src="/product_images/cold_plunge/CPH-001_the_plunge_gen_2_pro_chiller.png"
                    alt="Featured Product"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </GlassCard>
              <div className="absolute -bottom-6 -left-6">
                <GlassCard padding="md">
                  <p className="font-mono text-3xl font-light">76+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </GlassCard>
              </div>
              <div className="absolute -top-6 -right-6">
                <GlassCard padding="md">
                  <p className="font-mono text-3xl font-light">20%</p>
                  <p className="text-sm text-muted-foreground">Avg Savings</p>
                </GlassCard>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="flex justify-center mt-16"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Business Type Selection */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Select Your Business
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance">
              Who Are You
              <br />
              <span className="italic text-muted-foreground">Shopping For?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {Object.values(SUPPLY_STORE_BUSINESS_TYPES).map((type, index) => {
              const Icon = icons[type.icon]
              const isActive = businessType === type.id

              return (
                <motion.button 
                  key={type.id} 
                  onClick={() => setBusinessType(type.id as SupplyStoreBusinessType)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="text-left w-full"
                >
                  <GlassCard
                    hover
                    className={`h-full transition-all duration-500 ${isActive ? "ring-2 ring-foreground/30" : ""}`}
                    padding="lg"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isActive ? "bg-foreground text-background" : "bg-foreground/[0.06]"}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-light mb-2">{type.name}</h3>
                    <p className="text-muted-foreground mb-6">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.categories.slice(0, 3).map((cat) => (
                        <span key={cat} className="px-3 py-1 rounded-full bg-foreground/[0.06] text-xs text-muted-foreground">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16 md:mb-24"
          >
            <div>
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
                Browse Categories
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance">
                Shop by
                <br />
                <span className="italic text-muted-foreground">Category</span>
              </h2>
            </div>
            <Link
              href="/supply-store/products"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relevantCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/supply-store/products?category=${encodeURIComponent(category)}`}>
                  <GlassCard hover className="group" padding="none">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                      <Image
                        src={categoryImages[category] || "/placeholder.svg"}
                        alt={category}
                        fill
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="font-serif text-xl md:text-2xl font-light mb-2">{category}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">Explore products</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16 md:mb-24"
          >
            <div>
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
                Top Picks
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance">
                Featured
                <br />
                <span className="italic text-muted-foreground">Products</span>
              </h2>
            </div>
            <Link
              href="/supply-store/products"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-foreground/[0.04] rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.sku}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SupplyStoreProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Why Us
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance max-w-3xl mx-auto">
              Why Choose
              <br />
              <span className="italic text-muted-foreground">Medfit 90</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "Authentic Products",
                description: "100% genuine products directly from authorized distributors",
              },
              {
                icon: Truck,
                title: "Fast Shipping",
                description: "Free shipping on orders over $500 with tracking included",
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "Dedicated account managers for personalized assistance",
              },
              {
                icon: Award,
                title: "Volume Discounts",
                description: "Competitive wholesale pricing with bulk order savings",
              },
            ].map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                  <prop.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p className="font-mono text-lg md:text-xl font-light mb-2">{prop.title}</p>
                <p className="text-sm text-muted-foreground">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard padding="xl" className="text-center">
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
                Get Started
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance mb-6">
                Ready to Outfit
                <br />
                <span className="italic text-muted-foreground">Your Facility?</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Get in touch with our team for custom quotes, volume pricing, and expert consultation on the best
                equipment for your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/supply-store/contact">
                  <GlassButton size="lg" variant="primary" className="gap-2">
                    Request a Quote
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/supply-store/products">
                  <GlassButton size="lg" variant="outline">
                    Browse Catalog
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
