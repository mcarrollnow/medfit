"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import GlobalNav from "@/components/global-nav"
import { GlobalFooter } from "@/components/global-footer"
import { createClient } from "@/lib/supabase/client"
import { mockProducts } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"
import { EagleLogo } from "@/components/eagle-logo"
import { PurchaseOrderForm } from "@/components/purchase-order-form"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText, Grid } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { useAuthStore } from "@/lib/auth-store"

interface ShopSettings {
  shop_hero_title: string
  shop_hero_subtitle: string
}

const defaultShopSettings: ShopSettings = {
  shop_hero_title: 'Innovation is born where research lives.',
  shop_hero_subtitle: 'Premium quality compounds for scientific research. All products are ≥99% pure and third-party tested.',
}

interface ProductWithCategory extends Product {
  category_data?: {
    id: string
    name: string
    color: string | null
  } | null
}

interface GroupedProduct {
  base_name: string
  variants: Product[]
  lowestPrice: number
  category: string
  color: string
}

export default function Home() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<GroupedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "form">("grid")
  const [authChecked, setAuthChecked] = useState(false)
  const [shopSettings, setShopSettings] = useState<ShopSettings>(defaultShopSettings)
  const router = useRouter()

  // Check if user is logged in using Zustand store (already synced by AuthProvider)
  const session = useAuthStore((state) => state.session)
  const isLoading = useAuthStore((state) => state.isLoading)
  
  const [redirectingToSetPassword, setRedirectingToSetPassword] = useState(false)
  const [customerType, setCustomerType] = useState<string>("retail")
  const [tierDiscountPct, setTierDiscountPct] = useState<number>(0)
  const [productOverrides, setProductOverrides] = useState<Record<string, number>>({})
  
  useEffect(() => {
    // First, check if there are auth tokens in the hash - redirect to set-password
    const hash = window.location.hash
    if (hash && !redirectingToSetPassword) {
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')
      
      if (accessToken && (type === 'recovery' || type === 'invite' || type === 'signup')) {
        console.log('[Home] Auth tokens detected, redirecting to set-password')
        setRedirectingToSetPassword(true)
        window.location.href = `/set-password${hash}`
        return
      }
    }
    
    // Don't redirect to landing if we're about to redirect to set-password
    if (redirectingToSetPassword) return
    
    // Once loading is complete, check session from Zustand store
    if (!isLoading) {
      if (session) {
        console.log('[Home] Session found in store, showing shop')
        setAuthChecked(true)
      } else {
        console.log('[Home] No session in store, redirecting to login')
        router.push('/login')
      }
    }
  }, [router, session, isLoading, redirectingToSetPassword])

  // Fetch shop settings
  useEffect(() => {
    if (!authChecked) return
    
    async function fetchShopSettings() {
      try {
        const supabase = createClient()
        if (!supabase) return
        
        const { data, error } = await supabase
          .from('site_settings')
          .select('shop_hero_title, shop_hero_subtitle')
          .single()
        
        if (!error && data) {
          setShopSettings({
            shop_hero_title: data.shop_hero_title || defaultShopSettings.shop_hero_title,
            shop_hero_subtitle: data.shop_hero_subtitle || defaultShopSettings.shop_hero_subtitle,
          })
        }
      } catch (error) {
        console.error('Error fetching shop settings:', error)
      }
    }
    
    fetchShopSettings()
  }, [authChecked])

  useEffect(() => {
    if (!authChecked) return
    
    async function fetchProducts() {
      try {
        const supabase = createClient()

        if (!supabase) {
          console.log("[v0] Using mock data - Supabase not configured")
          setProducts(mockProducts)
          const grouped = groupProductsByBaseName(mockProducts)
          setFilteredProducts(grouped)
          setLoading(false)
          return
        }

        // Detect customer type, tier discount, and per-product overrides
        let detectedType = 'retail'
        let detectedTierDiscount = 0
        let detectedOverrides: Record<string, number> = {}
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: publicUser } = await supabase
              .from('users')
              .select('id')
              .eq('auth_id', user.id)
              .single()
            if (publicUser) {
              const { data: customer } = await supabase
                .from('customers')
                .select('id, customer_type, pricing_tier_id')
                .eq('user_id', publicUser.id)
                .single()
              if (customer) {
                detectedType = customer.customer_type

                // Fetch tier discount
                if (customer.pricing_tier_id) {
                  const { data: tier } = await supabase
                    .from('rep_pricing_tiers')
                    .select('discount_percentage')
                    .eq('id', customer.pricing_tier_id)
                    .single()
                  if (tier) {
                    detectedTierDiscount = Number(tier.discount_percentage)
                  }
                }

                // Fetch per-product overrides
                const { data: overrides } = await supabase
                  .from('customer_product_pricing')
                  .select('product_id, custom_price')
                  .eq('customer_id', customer.id)
                if (overrides) {
                  overrides.forEach((o: any) => {
                    detectedOverrides[o.product_id] = Number(o.custom_price)
                  })
                }
              }
            }
          }
        } catch (e) {
          // Non-critical - default to retail
        }
        setCustomerType(detectedType)
        setTierDiscountPct(detectedTierDiscount)
        setProductOverrides(detectedOverrides)

        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            category_data:categories(id, name, color)
          `)
          .eq("is_active", true)
          .order("name", { ascending: true })

        if (error) {
          console.error("[v0] Error fetching products:", error)
          console.error("[v0] Error details:", error.message, error.details, error.hint)
          console.log("[v0] Falling back to mock data")
          setProducts(mockProducts)
          const grouped = groupProductsByBaseName(mockProducts, detectedType, detectedTierDiscount, detectedOverrides)
          setFilteredProducts(grouped)
          return
        }

        setProducts(data || [])
        const grouped = groupProductsByBaseName(data || [], detectedType, detectedTierDiscount, detectedOverrides)
        setFilteredProducts(grouped)
      } catch (error) {
        console.error("[v0] Error:", error)
        console.log("[v0] Falling back to mock data")
        setProducts(mockProducts)
        const grouped = groupProductsByBaseName(mockProducts)
        setFilteredProducts(grouped)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [authChecked])

  const groupProductsByBaseName = (productList: ProductWithCategory[], custType: string = 'retail', tierPct: number = 0, overrides: Record<string, number> = {}): GroupedProduct[] => {
    // Determine which price field to use based on customer type
    // Priority: per-product override > tier discount > customer_type pricing > retail
    const getPriceField = (v: any): number => {
      // 1. Per-product override (highest priority)
      if (v.id && overrides[v.id] !== undefined) {
        return overrides[v.id]
      }

      // 2. Base price by customer type
      let basePrice: number
      switch (custType) {
        case 'supplier_customer':
          basePrice = typeof v.supplier_price === 'string' ? Number.parseFloat(v.supplier_price) : (v.supplier_price || 0)
          break
        case 'b2b':
        case 'b2bvip':
        case 'rep':
          basePrice = typeof v.b2b_price === 'string' ? Number.parseFloat(v.b2b_price) : (v.b2b_price || 0)
          break
        default:
          basePrice = typeof v.retail_price === 'string' ? Number.parseFloat(v.retail_price) : v.retail_price
      }

      // 3. Apply tier discount if present
      if (tierPct > 0) {
        return Math.round(basePrice * (1 - tierPct / 100) * 100) / 100
      }

      return basePrice
    }

    const grouped = productList.reduce(
      (acc, product) => {
        const key = product.base_name
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(product)
        return acc
      },
      {} as Record<string, ProductWithCategory[]>,
    )

    return Object.entries(grouped).map(([base_name, variants]) => {
      const prices = variants.map((v) => getPriceField(v) || (typeof v.retail_price === 'string' ? Number.parseFloat(v.retail_price) : v.retail_price))
      const lowestPrice = Math.min(...prices)
      const firstVariant = variants[0] as any

      // Build ratings array from individual columns (from Supabase)
      const ratings: { label: string; value: number }[] = []
      if (firstVariant.rating_label_1 && firstVariant.rating_value_1 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_1, value: Number(firstVariant.rating_value_1) })
      }
      if (firstVariant.rating_label_2 && firstVariant.rating_value_2 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_2, value: Number(firstVariant.rating_value_2) })
      }
      if (firstVariant.rating_label_3 && firstVariant.rating_value_3 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_3, value: Number(firstVariant.rating_value_3) })
      }

      return {
        base_name,
        variants: variants.sort((a, b) => {
          const priceA = getPriceField(a) || (typeof a.retail_price === 'string' ? Number.parseFloat(a.retail_price) : a.retail_price)
          const priceB = getPriceField(b) || (typeof b.retail_price === 'string' ? Number.parseFloat(b.retail_price) : b.retail_price)
          return priceA - priceB
        }),
        lowestPrice,
        // Use category_data.name from join, fallback to product.category for mock data
        category: firstVariant.category_data?.name || (firstVariant as any).category || "Uncategorized",
        // Use category_data.color from join, fallback to product.color
        color: firstVariant.category_data?.color || firstVariant.color || "#8B5CF6",
        // Ratings from database columns
        ratings: ratings.length > 0 ? ratings : undefined,
      }
    })
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      const grouped = groupProductsByBaseName(products, customerType, tierDiscountPct, productOverrides)
      setFilteredProducts(grouped)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.base_name.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query) ||
        product.variant?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query),
    )
    const grouped = groupProductsByBaseName(filtered, customerType, tierDiscountPct, productOverrides)
    setFilteredProducts(grouped)
  }, [searchQuery, products, customerType, tierDiscountPct, productOverrides])

  // Don't render shop until auth is confirmed
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  return (
    <>
      <GlobalNav />
      <div className="min-h-screen bg-background">
        {/* Hero Section - Chronicles Style */}
        <section className="border-b border-white/5">
          <div className="container mx-auto px-6 md:px-12 py-24 md:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-5xl text-center"
            >
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
                Research Compounds
              </p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] mb-8 text-balance whitespace-pre-line">
                {shopSettings.shop_hero_title.split(' ').slice(0, 3).join(' ')}
                <br />
                <span className="italic text-muted-foreground">{shopSettings.shop_hero_title.split(' ').slice(3).join(' ') || 'lives.'}</span>
              </h1>
              <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed mb-12">
                {shopSettings.shop_hero_subtitle}
              </p>

              <div className="flex flex-col items-center gap-8">
                <SearchBar onSearch={setSearchQuery} className="mx-auto max-w-2xl w-full" />

                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "form" : "grid")}
                  className="glass-button rounded-2xl px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  {viewMode === "grid" ? (
                    <>
                      <FileText className="w-4 h-4 mr-2 inline" />
                      Try our purchase form tailored to those who are used to purchasing by request forms.
                    </>
                  ) : (
                    <>
                      <Grid className="w-4 h-4 mr-2 inline" />
                      Switch back to Product Grid View
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section - Chronicles Style */}
        <section className="container mx-auto px-6 md:px-12 py-24 md:py-32 min-h-[800px]">
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6 }}
              >
                {loading ? (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center">
                    <div className="glass-button rounded-2xl p-6">
                      <EagleLogo className="h-16 w-auto opacity-40" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl md:text-3xl font-light">No products found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? "Try adjusting your search query" : "No products available at this time"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-12 flex items-center justify-between">
                      <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                      </p>
                    </div>
                    <div className="grid gap-6 md:gap-8 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredProducts.map((groupedProduct, index) => (
                        <motion.div
                          key={groupedProduct.base_name}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <ProductCard groupedProduct={groupedProduct} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6 }}
              >
                <PurchaseOrderForm products={products} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <GlobalFooter />
      </div>
    </>
  )
}
