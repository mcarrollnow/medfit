"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Package,
  DollarSign,
  Shield,
  TrendingUp,
  Check,
  Edit3,
  Save,
  AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  base_name: string
  variant: string | null
  cost_price: number
  retail_price: number
  color: string
}

interface PricingFormula {
  id: string
  name: string
  min_markup_multiplier: number
  max_markup_multiplier: number
  is_active: boolean
}

export default function PricingFormulaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [formula, setFormula] = useState<PricingFormula | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Editable formula settings
  const [editing, setEditing] = useState(false)
  const [minMarkup, setMinMarkup] = useState("2.0")
  const [maxMarkup, setMaxMarkup] = useState("4.0")
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch products
      const productsRes = await fetch("/api/admin/products")
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || productsData || [])
      }
      
      // Fetch active formula
      const formulaRes = await fetch("/api/admin/pricing-formula")
      if (formulaRes.ok) {
        const formulaData = await formulaRes.json()
        setFormula(formulaData)
        setMinMarkup(formulaData.min_markup_multiplier?.toString() || "2.0")
        setMaxMarkup(formulaData.max_markup_multiplier?.toString() || "4.0")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSaveFormula = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/pricing-formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          min_markup_multiplier: parseFloat(minMarkup),
          max_markup_multiplier: parseFloat(maxMarkup),
        }),
      })
      
      if (res.ok) {
        toast.success("Pricing formula updated")
        setEditing(false)
        loadData()
      } else {
        toast.error("Failed to update formula")
      }
    } catch (error) {
      toast.error("Failed to update formula")
    } finally {
      setSaving(false)
    }
  }

  const minMultiplier = parseFloat(minMarkup) || 2.0
  const maxMultiplier = parseFloat(maxMarkup) || 4.0

  // Calculate totals
  const totalCost = products.reduce((sum, p) => sum + (Number(p.cost_price) || 0), 0)
  const totalMinPrice = products.reduce((sum, p) => sum + (Number(p.cost_price) || 0) * minMultiplier, 0)
  const totalRetail = products.reduce((sum, p) => sum + (Number(p.retail_price) || 0), 0)
  const totalGuaranteedProfit = totalMinPrice - totalCost
  const totalCommissionPool = products.reduce((sum, p) => {
    const cost = Number(p.cost_price) || 0
    const retail = Number(p.retail_price) || 0
    const minPrice = cost * minMultiplier
    const maxPrice = cost * maxMultiplier
    const pool = Math.min(Math.max(0, retail - minPrice), maxPrice - minPrice)
    return sum + pool
  }, 0)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-0">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Pricing Formula
          </h1>
          <p className="text-white/50">
            Your products with cost protection and commission calculation
          </p>
        </div>

        {/* Formula Settings */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Active Formula Settings
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSaveFormula}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-white/60">Min Markup (× Cost)</Label>
              {editing ? (
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  value={minMarkup}
                  onChange={(e) => setMinMarkup(e.target.value)}
                  className="h-12 rounded-xl bg-white/10 border-white/20 text-white text-lg"
                />
              ) : (
                <p className="text-2xl font-bold text-amber-400">{minMarkup}×</p>
              )}
              <p className="text-xs text-white/40">Profit floor - never touched</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/60">Max Markup (× Cost)</Label>
              {editing ? (
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  value={maxMarkup}
                  onChange={(e) => setMaxMarkup(e.target.value)}
                  className="h-12 rounded-xl bg-white/10 border-white/20 text-white text-lg"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-400">{maxMarkup}×</p>
              )}
              <p className="text-xs text-white/40">Commission ceiling</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/60">Guaranteed Profit %</Label>
              <p className="text-2xl font-bold text-green-400">
                {((minMultiplier - 1) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-white/40">Minimum profit on every sale</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/60">Commission Range</Label>
              <p className="text-2xl font-bold text-purple-400">
                {minMarkup}× - {maxMarkup}×
              </p>
              <p className="text-xs text-white/40">Rep earns % of this range</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-red-400/60 mt-1">Protected</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Min Price Total</p>
            <p className="text-2xl font-bold text-white">${totalMinPrice.toFixed(2)}</p>
            <p className="text-xs text-amber-400/60 mt-1">{minMarkup}× cost</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Guaranteed Profit</p>
            <p className="text-2xl font-bold text-green-400">${totalGuaranteedProfit.toFixed(2)}</p>
            <p className="text-xs text-green-400/60 mt-1">Always yours</p>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Commission Pool</p>
            <p className="text-2xl font-bold text-white">${totalCommissionPool.toFixed(2)}</p>
            <p className="text-xs text-blue-400/60 mt-1">Available for reps</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Retail Total</p>
            <p className="text-2xl font-bold text-white">${totalRetail.toFixed(2)}</p>
            <p className="text-xs text-white/40 mt-1">Current prices</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-white/50" />
              Products ({products.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-white/50">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                    <th className="p-4">Product</th>
                    <th className="p-4 text-right">Cost</th>
                    <th className="p-4 text-right">Min Price ({minMarkup}×)</th>
                    <th className="p-4 text-right">Max Price ({maxMarkup}×)</th>
                    <th className="p-4 text-right">Retail</th>
                    <th className="p-4 text-right">Guaranteed Profit</th>
                    <th className="p-4 text-right">Commission Pool</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const cost = Number(product.cost_price) || 0
                    const retail = Number(product.retail_price) || 0
                    const minPrice = cost * minMultiplier
                    const maxPrice = cost * maxMultiplier
                    const guaranteedProfit = minPrice - cost
                    const maxPool = maxPrice - minPrice
                    const commissionPool = Math.min(Math.max(0, retail - minPrice), maxPool)
                    
                    const isBelowMin = retail < minPrice
                    const isAboveMax = retail > maxPrice
                    const isInRange = !isBelowMin && !isAboveMax
                    
                    return (
                      <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{product.base_name || product.name}</p>
                            {product.variant && (
                              <p className="text-sm text-white/50">{product.variant}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-red-400 font-medium">${cost.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-amber-400 font-medium">${minPrice.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-blue-400 font-medium">${maxPrice.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-bold ${isBelowMin ? 'text-red-400' : 'text-white'}`}>
                            ${retail.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-green-400 font-medium">${guaranteedProfit.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-purple-400 font-medium">${commissionPool.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-center">
                          {isBelowMin ? (
                            <Badge className="bg-red-500/20 text-red-400 border-0">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Below Min
                            </Badge>
                          ) : isAboveMax ? (
                            <Badge className="bg-blue-500/20 text-blue-400 border-0">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Above Max
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-0">
                              <Check className="h-3 w-3 mr-1" />
                              Good
                            </Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
