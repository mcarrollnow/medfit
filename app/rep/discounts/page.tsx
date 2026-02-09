"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  DollarSign,
  Tag,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Percent,
  Copy,
  Check,
  ChevronRight,
  Package,
  Ticket,
  Search,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getCurrentRep } from "@/app/actions/rep"
import {
  getRepProducts,
  getRepDiscountCodes,
  getRepSettings,
  createRepDiscountCode,
  updateRepDiscountCode,
  deleteRepDiscountCode,
  type RepProduct,
  type RepDiscountCode,
  type RepSettings,
} from "@/app/actions/rep-pricing"

type ViewMode = "list" | "create-code" | "edit-code"

export default function RepDiscountsPage() {
  const [repId, setRepId] = useState<string | null>(null)
  const [products, setProducts] = useState<RepProduct[]>([])
  const [discountCodes, setDiscountCodes] = useState<RepDiscountCode[]>([])
  const [settings, setSettings] = useState<RepSettings>({ can_create_discount_codes: false })
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Edit/Create code state
  const [editingCode, setEditingCode] = useState<Partial<RepDiscountCode> | null>(null)
  const [productPrices, setProductPrices] = useState<Record<string, number | null>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const rep = await getCurrentRep()
      if (rep) {
        setRepId(rep.id)
        const [repProducts, repCodes, repSettings] = await Promise.all([
          getRepProducts(rep.id),
          getRepDiscountCodes(rep.id),
          getRepSettings(rep.id),
        ])
        setProducts(repProducts)
        setDiscountCodes(repCodes)
        setSettings(repSettings)
      }
    } catch (error) {
      console.error("[Rep Discounts] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCreateCode() {
    setEditingCode({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_amount: 0,
      max_uses: null,
      valid_from: null,
      valid_until: null,
      is_active: true,
    })
    setProductPrices({})
    setViewMode("create-code")
  }

  function handleEditCode(code: RepDiscountCode) {
    setEditingCode(code)
    // Load existing product pricing
    const priceMap: Record<string, number | null> = {}
    code.product_pricing.forEach(p => {
      priceMap[p.product_id] = p.custom_price
    })
    setProductPrices(priceMap)
    setViewMode("edit-code")
  }

  function handleBack() {
    setViewMode("list")
    setEditingCode(null)
    setProductPrices({})
  }

  async function handleSaveCode() {
    if (!repId || !editingCode) return
    setIsSaving(true)

    try {
      const pricingUpdates = Object.entries(productPrices)
        .filter(([_, price]) => price !== null && price > 0)
        .map(([productId, customPrice]) => ({ productId, customPrice: customPrice! }))

      if (viewMode === "create-code") {
        // Generate code if empty
        const code = editingCode.code || `${["REP", "DEAL", "SAVE"][Math.floor(Math.random() * 3)]}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        
        const result = await createRepDiscountCode(repId, {
          code,
          description: editingCode.description || undefined,
          discount_type: editingCode.discount_type || "percentage",
          discount_value: editingCode.discount_value || 10,
          min_order_amount: editingCode.min_order_amount,
          max_uses: editingCode.max_uses,
          valid_from: editingCode.valid_from,
          valid_until: editingCode.valid_until,
        }, pricingUpdates)

        if (result.success) {
          await loadData()
          setViewMode("list")
          setEditingCode(null)
        } else {
          alert(result.error || "Failed to create code")
        }
      } else if (editingCode.id) {
        const result = await updateRepDiscountCode(
          repId,
          editingCode.id,
          {
            description: editingCode.description || undefined,
            discount_type: editingCode.discount_type,
            discount_value: editingCode.discount_value,
            min_order_amount: editingCode.min_order_amount,
            max_uses: editingCode.max_uses,
            valid_from: editingCode.valid_from,
            valid_until: editingCode.valid_until,
            is_active: editingCode.is_active,
          },
          Object.entries(productPrices).map(([productId, customPrice]) => ({ productId, customPrice }))
        )

        if (result.success) {
          await loadData()
          setViewMode("list")
          setEditingCode(null)
        } else {
          alert(result.error || "Failed to update code")
        }
      }
    } catch (error) {
      console.error("[Rep Discounts] Error saving code:", error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteCode(codeId: string) {
    if (!repId) return
    const confirmed = window.confirm("Are you sure you want to delete this discount code?")
    if (!confirmed) return

    const result = await deleteRepDiscountCode(repId, codeId)
    if (result.success) {
      await loadData()
      setViewMode("list")
    } else {
      alert(result.error || "Failed to delete code")
    }
  }

  function copyToClipboard(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Filter codes by search
  const filteredCodes = discountCodes.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group products by base_name for pricing table
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.base_name]) {
      acc[product.base_name] = []
    }
    acc[product.base_name].push(product)
    return acc
  }, {} as Record<string, RepProduct[]>)

  // Stats
  const activeCodesCount = discountCodes.filter(c => c.is_active).length
  const totalCodes = discountCodes.length

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

        <AnimatePresence mode="wait">
          {/* Discount Codes List View */}
          {viewMode === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl">Discount Codes</h1>
                  <p className="text-xl text-white/50">Create and manage promotional codes for your customers.</p>
                </div>
                {settings.can_create_discount_codes && (
                  <Button
                    onClick={handleCreateCode}
                    className="h-12 px-6 bg-white text-black hover:bg-white/90 rounded-xl font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Discount Code
                  </Button>
                )}
              </div>

              {/* Stats */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/50">Active Codes</p>
                        <p className="text-3xl font-bold tracking-tight text-white">{activeCodesCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/50">Total Codes</p>
                        <p className="text-3xl font-bold tracking-tight text-white">{totalCodes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Package className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/50">With Fixed Prices</p>
                        <p className="text-3xl font-bold tracking-tight text-white">
                          {discountCodes.filter(c => c.product_pricing.length > 0).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Search */}
              <section className="space-y-6">
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discount codes..."
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
              </section>

              {/* Codes List */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Your Discount Codes</h2>
                {filteredCodes.length === 0 ? (
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl text-center">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4 relative z-10" />
                    <p className="text-white/60 mb-2 relative z-10">
                      {discountCodes.length === 0 ? "No discount codes yet" : "No codes match your search"}
                    </p>
                    {settings.can_create_discount_codes && discountCodes.length === 0 && (
                      <Button
                        onClick={handleCreateCode}
                        className="mt-4 h-11 px-6 bg-white text-black hover:bg-white/90 rounded-xl relative z-10"
                      >
                        Create Your First Code
                      </Button>
                    )}
                    {!settings.can_create_discount_codes && discountCodes.length === 0 && (
                      <p className="text-white/40 text-sm relative z-10">Contact your admin to get discount codes assigned</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCodes.map((code) => (
                      <div
                        key={code.id}
                        onClick={() => code.created_by_rep && handleEditCode(code)}
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all",
                          code.created_by_rep && "cursor-pointer hover:bg-white/[0.08] hover:border-white/20"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              code.discount_type === "percentage" ? "bg-blue-500/20" : "bg-emerald-500/20"
                            )}>
                              {code.discount_type === "percentage" ? (
                                <Percent className="w-6 h-6 text-blue-400" />
                              ) : (
                                <DollarSign className="w-6 h-6 text-emerald-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-lg font-bold tracking-wider">{code.code}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(code.code)
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  {copiedCode === code.code ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-white/40" />
                                  )}
                                </button>
                              </div>
                              <p className="text-white/60 text-sm">
                                {code.discount_type === "percentage"
                                  ? `${code.discount_value}% off`
                                  : `$${code.discount_value} off`}
                                {code.description && ` • ${code.description}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {code.product_pricing.length > 0 && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 rounded-full">
                                {code.product_pricing.length} fixed prices
                              </Badge>
                            )}
                            <Badge className={cn(
                              "rounded-full px-3 py-1",
                              code.is_active
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-white/10 text-white/40 border-white/10"
                            )}>
                              {code.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {code.created_by_rep && (
                              <ChevronRight className="w-5 h-5 text-white/40" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* Create/Edit Code View */}
          {(viewMode === "create-code" || viewMode === "edit-code") && editingCode && (
            <motion.div
              key="edit-code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Button onClick={handleBack} variant="ghost" className="h-11 w-11 rounded-full hover:bg-white/10">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                      {viewMode === "create-code" ? "Create Discount Code" : "Edit Discount Code"}
                    </h1>
                    <p className="text-xl text-white/50">
                      {viewMode === "create-code" ? "Set up a new promotional code" : editingCode.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {viewMode === "edit-code" && editingCode.id && (
                    <Button
                      onClick={() => handleDeleteCode(editingCode.id!)}
                      variant="ghost"
                      className="h-11 w-11 rounded-full hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                  <Button
                    onClick={handleSaveCode}
                    disabled={isSaving}
                    className="h-12 px-6 bg-white text-black hover:bg-white/90 rounded-xl font-medium"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {viewMode === "create-code" ? "Create Code" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Code Details */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Code Details</h2>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-6">
                    {/* Code Input */}
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Code</label>
                      <div className="flex gap-3">
                        <Input
                          value={editingCode.code || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value.toUpperCase() })}
                          placeholder="MYCODE20"
                          className="h-14 bg-white/5 border-white/10 rounded-xl font-mono text-lg tracking-wider flex-1"
                          disabled={viewMode === "edit-code"}
                        />
                        {viewMode === "create-code" && (
                          <Button
                            onClick={() => setEditingCode({
                              ...editingCode,
                              code: `REP${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                            })}
                            variant="ghost"
                            className="h-14 px-6 rounded-xl hover:bg-white/10"
                          >
                            Generate
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Description</label>
                      <Textarea
                        value={editingCode.description || ""}
                        onChange={(e) => setEditingCode({ ...editingCode, description: e.target.value })}
                        placeholder="Special pricing for my customers..."
                        className="bg-white/5 border-white/10 rounded-xl resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Type and Value */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Discount Type</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setEditingCode({ ...editingCode, discount_type: "percentage" })}
                            className={cn(
                              "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2",
                              editingCode.discount_type === "percentage"
                                ? "bg-white/10 border-white/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                          >
                            <Percent className="w-5 h-5" />
                            Percent
                          </button>
                          <button
                            onClick={() => setEditingCode({ ...editingCode, discount_type: "fixed" })}
                            className={cn(
                              "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2",
                              editingCode.discount_type === "fixed"
                                ? "bg-white/10 border-white/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                          >
                            <DollarSign className="w-5 h-5" />
                            Fixed
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Value</label>
                        <Input
                          type="number"
                          value={editingCode.discount_value || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, discount_value: parseFloat(e.target.value) || 0 })}
                          placeholder={editingCode.discount_type === "percentage" ? "20" : "50.00"}
                          className="h-12 bg-white/5 border-white/10 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Min Order & Max Uses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Min Order ($)</label>
                        <Input
                          type="number"
                          value={editingCode.min_order_amount || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, min_order_amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="h-12 bg-white/5 border-white/10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Max Uses</label>
                        <Input
                          type="number"
                          value={editingCode.max_uses || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, max_uses: parseInt(e.target.value) || null })}
                          placeholder="Unlimited"
                          className="h-12 bg-white/5 border-white/10 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Validity Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Valid From</label>
                        <Input
                          type="date"
                          value={editingCode.valid_from?.split("T")[0] || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, valid_from: e.target.value || null })}
                          className="h-12 bg-white/5 border-white/10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Valid Until</label>
                        <Input
                          type="date"
                          value={editingCode.valid_until?.split("T")[0] || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, valid_until: e.target.value || null })}
                          className="h-12 bg-white/5 border-white/10 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Active Toggle */}
                    {viewMode === "edit-code" && (
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <p className="font-medium">Active</p>
                          <p className="text-sm text-white/60">Code can be used by customers</p>
                        </div>
                        <Switch
                          checked={editingCode.is_active || false}
                          onCheckedChange={(checked) => setEditingCode({ ...editingCode, is_active: checked })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Product Fixed Pricing */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Fixed Product Pricing (Optional)</h2>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="p-6 border-b border-white/10">
                      <p className="text-white/60 text-sm">
                        Set specific prices for products when this code is used. Leave blank for standard discount.
                      </p>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-black/80 backdrop-blur-xl">
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/60 font-medium">Product</th>
                            <th className="text-left p-4 text-white/60 font-medium">Variant</th>
                            <th className="text-right p-4 text-white/60 font-medium">Retail</th>
                            <th className="text-right p-4 text-white/60 font-medium">Fixed Price</th>
                            <th className="text-right p-4 text-white/60 font-medium">Discount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupedProducts).map(([baseName, prods]) =>
                            prods.map((product, idx) => (
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
                                <td className="p-4 text-right text-white/60">
                                  ${Number(product.retail_price || 0).toFixed(2)}
                                </td>
                                <td className="p-4 text-right">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="—"
                                    value={productPrices[product.id] ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value ? parseFloat(e.target.value) : null
                                      setProductPrices(prev => ({
                                        ...prev,
                                        [product.id]: value,
                                      }))
                                    }}
                                    className="w-28 h-10 bg-white/5 border-white/10 rounded-xl text-right ml-auto"
                                  />
                                </td>
                                <td className="p-4 text-right">
                                  {productPrices[product.id] && product.retail_price ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                      {Math.round((1 - productPrices[product.id]! / product.retail_price) * 100)}% off
                                    </Badge>
                                  ) : (
                                    <span className="text-white/30">—</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
