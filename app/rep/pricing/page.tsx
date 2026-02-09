"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  X,
  Package,
  ArrowLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getCurrentRep } from "@/app/actions/rep"
import {
  getRepProducts,
  type RepProduct,
} from "@/app/actions/rep-pricing"

export default function RepPricingPage() {
  const [repId, setRepId] = useState<string | null>(null)
  const [products, setProducts] = useState<RepProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const rep = await getCurrentRep()
      if (rep) {
        setRepId(rep.id)
        const repProducts = await getRepProducts(rep.id)
        setProducts(repProducts)
      }
    } catch (error) {
      console.error("[Rep Pricing] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.base_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group products by base_name
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.base_name]) {
      acc[product.base_name] = []
    }
    acc[product.base_name].push(product)
    return acc
  }, {} as Record<string, RepProduct[]>)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl">Pricing</h1>
          <p className="text-xl text-white/50">View your product pricing and compare rates.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="h-14 pl-12 bg-white/[0.05] border-white/10 rounded-2xl text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          )}
        </div>

        {/* Pricing Legend */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Legend</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-white/60">Your Rep Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white/60">B2B Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/30" />
              <span className="text-white/60">Retail Price</span>
            </div>
          </div>
        </section>

        {/* Products Table */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Product Catalog</h2>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 font-medium">Product</th>
                    <th className="text-left p-4 text-white/60 font-medium">Variant</th>
                    <th className="text-right p-4 text-white/60 font-medium">Retail</th>
                    <th className="text-right p-4 text-white/60 font-medium">B2B</th>
                    <th className="text-right p-4 text-white/60 font-medium">Your Price</th>
                    <th className="text-right p-4 text-white/60 font-medium">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedProducts).map(([baseName, prods]) =>
                    prods.map((product, idx) => {
                      const effectivePrice = product.rep_price || product.b2b_price || product.retail_price
                      const savings = product.retail_price - effectivePrice
                      const savingsPercent = product.retail_price > 0 
                        ? Math.round((savings / product.retail_price) * 100) 
                        : 0

                      return (
                        <tr
                          key={product.id}
                          className={cn(
                            "border-b border-white/5 hover:bg-white/[0.03] transition-colors relative",
                            idx === 0 && "border-t border-white/10"
                          )}
                          style={{
                            background: `linear-gradient(90deg, ${product.color}08 0%, transparent 20%)`,
                          }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                                style={{ 
                                  backgroundColor: product.color || "#888",
                                  boxShadow: `0 0 10px ${product.color || "#888"}40`
                                }}
                              />
                              <span className="font-medium">{product.base_name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-white/60">{product.variant || "—"}</td>
                          <td className="p-4 text-right text-white/40 line-through">
                            ${Number(product.retail_price || 0).toFixed(2)}
                          </td>
                          <td className="p-4 text-right text-blue-400">
                            {product.b2b_price ? `$${Number(product.b2b_price).toFixed(2)}` : "—"}
                          </td>
                          <td className="p-4 text-right">
                            <span className={cn(
                              "font-semibold text-lg",
                              product.rep_price ? "text-emerald-400" : "text-white/80"
                            )}>
                              ${Number(effectivePrice).toFixed(2)}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {savingsPercent > 0 ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                {savingsPercent}% off
                              </Badge>
                            ) : (
                              <span className="text-white/30">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">No products found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
