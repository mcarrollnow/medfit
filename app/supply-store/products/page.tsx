"use client"

import type React from "react"
import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { SupplyStoreProductCard } from "@/components/supply-store/product-card"
import { useSupplyStoreBusinessType } from "@/lib/supply-store/business-context"
import { useSupplyStoreCart, formatPrice } from "@/lib/supply-store/cart"
import { SUPPLY_STORE_BUSINESS_TYPES, SUPPLY_STORE_CATEGORIES, type SupplyStoreProduct } from "@/lib/supply-store/types"
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList, Plus, Check } from "lucide-react"

function ProductsContent() {
  const searchParams = useSearchParams()
  const { businessType } = useSupplyStoreBusinessType()
  const currentBusiness = SUPPLY_STORE_BUSINESS_TYPES[businessType]

  const [products, setProducts] = useState<SupplyStoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"))
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "brand">("name")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(`/api/supply-store/products?business_type=${businessType}`)
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

  // Update category from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  // Get unique brands from products
  const brands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand))
    return Array.from(brandSet).sort()
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    switch (sortBy) {
      case "name":
        result = [...result].sort((a, b) => a.product_name.localeCompare(b.product_name))
        break
      case "price-asc":
        result = [...result].sort((a, b) => a.wholesale_price - b.wholesale_price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.wholesale_price - a.wholesale_price)
        break
      case "brand":
        result = [...result].sort((a, b) => a.brand.localeCompare(b.brand))
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedBrand(null)
    setSortBy("name")
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedBrand

  if (loading) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-foreground/[0.04] rounded-xl w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-foreground/[0.04] rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
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
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Catalog
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
            Products
            <br />
            <span className="italic text-muted-foreground">for {currentBusiness.name}</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-6">
              {/* Search */}
              <GlassCard padding="md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-foreground/[0.06] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(58,66,51,0.12)]"
                  />
                </div>
              </GlassCard>

              {/* Categories */}
              <GlassCard padding="md">
                <h3 className="font-serif text-xl font-light mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                      !selectedCategory
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
                    }`}
                  >
                    All Categories
                  </button>
                  {SUPPLY_STORE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                        selectedCategory === cat
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Brands */}
              <GlassCard padding="md">
                <h3 className="font-serif text-xl font-light mb-4">Brands</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                      !selectedBrand
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                        selectedBrand === brand
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {hasActiveFilters && (
                <GlassButton onClick={clearFilters} className="w-full" variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </GlassButton>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/[0.06] border border-border"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>

                <p className="text-muted-foreground font-mono text-sm">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 rounded-xl bg-foreground/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(58,66,51,0.12)]"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="brand">Brand</option>
                </select>

                <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-foreground/[0.06] border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="lg:hidden mb-8"
              >
                <GlassCard padding="md">
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-foreground/[0.06] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(58,66,51,0.12)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono tracking-wider text-muted-foreground uppercase mb-2">Category</label>
                      <select
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(58,66,51,0.12)]"
                      >
                        <option value="">All Categories</option>
                        {SUPPLY_STORE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-mono tracking-wider text-muted-foreground uppercase mb-2">Brand</label>
                      <select
                        value={selectedBrand || ""}
                        onChange={(e) => setSelectedBrand(e.target.value || null)}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(58,66,51,0.12)]"
                      >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    {hasActiveFilters && (
                      <GlassButton onClick={clearFilters} className="w-full" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </GlassButton>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.06] border border-border text-sm">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.06] border border-border text-sm">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.06] border border-border text-sm">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand(null)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8" : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product, index) =>
                  viewMode === "grid" ? (
                    <motion.div
                      key={product.sku}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <SupplyStoreProductCard product={product} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={product.sku}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.03 }}
                      viewport={{ once: true }}
                    >
                      <ProductListItem product={product} />
                    </motion.div>
                  ),
                )}
              </div>
            ) : (
              <GlassCard padding="xl" className="text-center">
                <p className="text-muted-foreground text-lg mb-4 italic">No products found matching your criteria.</p>
                <GlassButton onClick={clearFilters} variant="outline">
                  Clear Filters
                </GlassButton>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductListItem({ product }: { product: SupplyStoreProduct }) {
  const { addItem } = useSupplyStoreCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link href={`/supply-store/products/${product.sku}`}>
      <GlassCard hover padding="none" className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.product_name}
            fill
            className="object-contain p-4"
          />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-1">{product.brand}</p>
            <h3 className="font-serif text-lg md:text-xl font-light mb-1">{product.product_name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-xl font-light">{formatPrice(product.wholesale_price)}</p>
              <p className="text-sm text-muted-foreground line-through">MSRP {formatPrice(product.retail_price)}</p>
            </div>
            <GlassButton
              onClick={handleAddToCart}
              disabled={!product.in_stock || added}
              variant={added ? "primary" : "default"}
            >
              {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

export default function SupplyStoreProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-foreground/[0.04] rounded-xl w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-foreground/[0.04] rounded-3xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
