"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Users,
  ShoppingCart,
  DollarSign,
  Tag,
  Percent,
  Clock,
  Settings,
  Plus,
  Trash2,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Package,
  Edit3,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  type RepProfile,
  type RepCustomer,
  type RepOrder,
  type DiscountCodeHistory,
  type PriceEditHistory,
  getRepCustomers,
  getRepRecentOrders,
  getRepDiscountCodeHistory,
  getRepPriceEditHistory,
  getUnassignedCustomers,
  assignCustomerToRep,
  unassignCustomerFromRep,
  updateRepCommissionRate,
  updateRepBonusCommission,
  getAllProducts,
  getRepProductPricing,
  bulkUpdateRepProductPricing,
} from "@/app/actions/rep-management"
import { createDiscountCode } from "@/app/actions/discounts"

interface RepDetailTabsProps {
  rep: RepProfile
  initialOrders?: RepOrder[]
  initialCustomers?: RepCustomer[]
}

interface ProductWithPricing {
  id: string
  name: string
  base_name: string
  variant: string | null
  retail_price: number
  color: string
  custom_price?: number | null
}

const tabs = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "customers", label: "Customers", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "pricing", label: "Pricing", icon: Tag },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "history", label: "History", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
]

function getCustomerDisplayName(customer: RepCustomer): string {
  if (customer.user?.first_name && customer.user?.last_name) {
    return `${customer.user.first_name} ${customer.user.last_name}`
  }
  if (customer.user?.first_name) return customer.user.first_name
  if (customer.company_name) return customer.company_name
  if (customer.user?.email) return customer.user.email
  return "Unknown Customer"
}

function getCustomerEmail(customer: RepCustomer): string | undefined {
  return customer.user?.email
}

function getCustomerInitial(customer: RepCustomer): string {
  const name = getCustomerDisplayName(customer)
  return name[0]?.toUpperCase() || "?"
}

export function RepDetailTabs({ rep, initialOrders, initialCustomers }: RepDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showTabMenu, setShowTabMenu] = useState(false)
  const [customers, setCustomers] = useState<RepCustomer[]>(initialCustomers || [])
  const [orders, setOrders] = useState<RepOrder[]>(initialOrders || [])
  const [discountHistory, setDiscountHistory] = useState<DiscountCodeHistory[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceEditHistory[]>([])
  const [unassignedCustomers, setUnassignedCustomers] = useState<RepCustomer[]>([])
  const [allProducts, setAllProducts] = useState<ProductWithPricing[]>([])
  const [repPricing, setRepPricing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Settings state
  const [commissionRate, setCommissionRate] = useState(rep.commission_rate || 10)
  const [bonusCommission, setBonusCommission] = useState(rep.bonus_commission || 0)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Customer state
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")

  // Pricing state
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])
  const [editingPrices, setEditingPrices] = useState<Record<string, string>>({})
  const [savingPrices, setSavingPrices] = useState<Record<string, boolean>>({})

  // Discount code creation state
  const [showCreateDiscount, setShowCreateDiscount] = useState(false)
  const [newDiscountCode, setNewDiscountCode] = useState("")
  const [newDiscountType, setNewDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [newDiscountValue, setNewDiscountValue] = useState("")
  const [creatingDiscount, setCreatingDiscount] = useState(false)

  useEffect(() => {
    // Only load data if initial data wasn't provided
    if (!initialOrders && !initialCustomers) {
      loadData()
    } else {
      setLoading(false) // If initial data is provided, we are already loaded
    }
  }, [rep.id, initialOrders, initialCustomers]) // Re-run if rep ID changes or initial data changes

  async function loadData() {
    setLoading(true)
    try {
      const [customersData, ordersData, discountData, priceData, unassignedData, productsData, pricingData] =
        await Promise.all([
          getRepCustomers(rep.id),
          getRepRecentOrders(rep.id),
          getRepDiscountCodeHistory(rep.id),
          getRepPriceEditHistory(rep.id),
          getUnassignedCustomers(),
          getAllProducts(),
          getRepProductPricing(rep.id),
        ])

      setCustomers(customersData)
      setOrders(ordersData)
      setDiscountHistory(discountData)
      setPriceHistory(priceData)
      setUnassignedCustomers(unassignedData)
      setRepPricing(pricingData)

      // Merge products with custom pricing
      const pricingMap = new Map(pricingData.map((p: any) => [p.product_id, p.custom_price]))
      const productsWithPricing = productsData.map((p: any) => ({
        ...p,
        custom_price: pricingMap.get(p.id) || null,
      }))
      setAllProducts(productsWithPricing)
    } catch (error) {
      console.error("[rep-detail] Error loading rep data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Group products by base_name
  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductWithPricing[]> = {}
    allProducts.forEach((product) => {
      const key = product.base_name || product.name
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(product)
    })
    return Object.entries(groups).map(([base_name, variants]) => ({
      base_name,
      variants: variants.sort((a, b) => (a.variant || "").localeCompare(b.variant || "")),
    }))
  }, [allProducts])

  const safeNumber = (value: number | undefined | null): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0
  }

  const totalSales = rep.total_sales
  const totalCommission = rep.total_commission_earned

  async function handleSaveSettings() {
    setSavingSettings(true)
    try {
      await updateRepCommissionRate(rep.id, commissionRate)
      await updateRepBonusCommission(rep.id, bonusCommission)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2000)
    } finally {
      setSavingSettings(false)
    }
  }

  async function handleAssignCustomer(customerId: string) {
    await assignCustomerToRep(customerId, rep.id)
    loadData()
    setShowAddCustomer(false)
    setCustomerSearch("")
  }

  async function handleUnassignCustomer(customerId: string) {
    await unassignCustomerFromRep(customerId)
    loadData()
  }

  async function handleSavePrice(productId: string) {
    const newPrice = editingPrices[productId]
    if (!newPrice) return

    setSavingPrices((prev) => ({ ...prev, [productId]: true }))
    try {
      await bulkUpdateRepProductPricing(rep.id, [{ productId, customPrice: Number.parseFloat(newPrice) || null }])
      await loadData()
      setEditingPrices((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
    } finally {
      setSavingPrices((prev) => ({ ...prev, [productId]: false }))
    }
  }

  async function handleRemovePrice(productId: string) {
    await bulkUpdateRepProductPricing(rep.id, [{ productId, customPrice: null }])
    loadData()
  }

  async function handleCreateDiscountCode() {
    if (!newDiscountCode || !newDiscountValue) return
    setCreatingDiscount(true)
    try {
      await createDiscountCode({
        code: newDiscountCode.toUpperCase(),
        description: `Created for rep ${rep.first_name || rep.email}`,
        discount_type: newDiscountType,
        discount_value: Number.parseFloat(newDiscountValue),
        min_order_amount: 0,
        max_uses: null,
        customer_type: "all",
        valid_from: null,
        valid_until: null,
        is_active: true,
        free_shipping: false,
      })
      setShowCreateDiscount(false)
      setNewDiscountCode("")
      setNewDiscountValue("")
      loadData()
    } finally {
      setCreatingDiscount(false)
    }
  }

  const filteredUnassignedCustomers = unassignedCustomers.filter((c) => {
    const search = customerSearch.toLowerCase()
    return (
      getCustomerEmail(c)?.toLowerCase().includes(search) ||
      getCustomerDisplayName(c).toLowerCase().includes(search) ||
      c.company_name?.toLowerCase().includes(search)
    )
  })

  const activeTabData = tabs.find((t) => t.id === activeTab)
  const ActiveIcon = activeTabData?.icon || Users

  return (
    <div className="space-y-8 px-4 py-6 lg:px-0">
      {/* Header */}
      <div className="space-y-6">
        <Link
          href="/admin/reps"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Representatives</span>
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl lg:rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/5 text-2xl lg:text-3xl font-bold text-white shrink-0">
              {(rep.first_name?.[0] || rep.email?.[0] || "?").toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-xl lg:text-4xl font-bold tracking-tight text-foreground truncate">
                {rep.first_name && rep.last_name ? `${rep.first_name} ${rep.last_name}` : rep.email}
              </h1>
              <p className="text-sm lg:text-lg text-muted-foreground truncate">{rep.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className="bg-foreground/10 text-foreground/70 border-0 px-2 py-0.5 text-xs lg:px-3 lg:py-1 lg:text-sm">
                  {safeNumber(rep.commission_rate)}% Commission
                </Badge>
                {safeNumber(rep.bonus_commission) > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 px-2 py-0.5 text-xs lg:px-3 lg:py-1 lg:text-sm">
                    +${safeNumber(rep.bonus_commission)} Bonus
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action - Link to Payouts */}
          <Link
            href="/admin/payouts"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-6 text-base font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] w-full lg:w-auto lg:self-end"
          >
            <DollarSign className="h-5 w-5" />
            Manage Payouts
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards - Always 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Customers</p>
          <p className="mt-1 text-xl lg:text-3xl font-bold text-foreground">{customers.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Orders</p>
          <p className="mt-1 text-xl lg:text-3xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</p>
          <p className="mt-1 text-xl lg:text-3xl font-bold text-emerald-400">${totalSales.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Commission</p>
          <p className="mt-1 text-xl lg:text-3xl font-bold text-amber-400">${totalCommission.toFixed(2)}</p>
        </div>
      </div>

      <div className="relative">
        {/* Mobile/Tablet: Dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowTabMenu(!showTabMenu)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-foreground/5 border border-border"
          >
            <div className="flex items-center gap-3">
              <ActiveIcon className="h-5 w-5 text-foreground" />
              <span className="font-medium text-foreground">{activeTabData?.label}</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showTabMenu ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showTabMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl bg-background/95 border border-border backdrop-blur-xl overflow-hidden"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setShowTabMenu(false)
                      }}
                      className={`w-full flex items-center gap-3 p-4 transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-foreground/10"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Inline tabs - only on lg and up */}
        <div className="hidden lg:flex gap-2 p-2 rounded-2xl bg-foreground/5 border border-border flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-foreground/5" />
            ))}
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Recent Orders */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Orders</h2>
                  {orders.slice(0, 5).length === 0 ? (
                    <div className="rounded-2xl border border-border bg-foreground/5 p-12 text-center">
                      <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="rounded-2xl border border-border bg-foreground/5 p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-foreground text-sm lg:text-base truncate">
                                  Order #{order.order_number}
                                </p>
                                <p className="text-xs lg:text-sm text-muted-foreground truncate">{order.customer_name}</p>
                              </div>
                              <Badge
                                className={`shrink-0 text-xs
                                ${order.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : ""}
                                ${order.status === "pending" ? "bg-amber-500/20 text-amber-400" : ""}
                                ${order.status === "processing" ? "bg-blue-500/20 text-blue-400" : ""}
                                border-0 px-2 py-0.5
                              `}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {order.created_at ? format(new Date(order.created_at), "MMM d, yyyy") : ""}
                              </p>
                              <div className="text-right">
                                <p className="text-base lg:text-lg font-bold text-foreground">
                                  ${safeNumber(order.total_amount).toFixed(2)}
                                </p>
                                <p className="text-xs text-emerald-400">
                                  +$
                                  {(safeNumber(order.total_amount) * (safeNumber(rep.commission_rate) / 100)).toFixed(
                                    2,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Customers */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Assigned Customers</h2>
                  {customers.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-foreground/5 p-12 text-center">
                      <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No customers assigned</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customers.slice(0, 4).map((customer) => (
                        <div key={customer.id} className="rounded-2xl border border-border bg-foreground/5 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-foreground/10 text-base lg:text-lg font-bold text-foreground shrink-0">
                              {getCustomerInitial(customer)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground text-sm lg:text-base truncate">
                                {getCustomerDisplayName(customer)}
                              </p>
                              <p className="text-xs lg:text-sm text-muted-foreground truncate">{getCustomerEmail(customer)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground">{customers.length} customers assigned</p>
                  <button
                    onClick={() => setShowAddCustomer(!showAddCustomer)}
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-5 w-5" />
                    Add Customer
                  </button>
                </div>

                {/* Add Customer Panel */}
                <AnimatePresence>
                  {showAddCustomer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border border-border bg-foreground/5 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground text-lg">Add Customer</h3>
                          <button
                            onClick={() => setShowAddCustomer(false)}
                            className="p-3 rounded-xl hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            placeholder="Search unassigned customers..."
                            className="rounded-xl h-14 pl-12 bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                          {filteredUnassignedCustomers.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">No unassigned customers found</p>
                          ) : (
                            filteredUnassignedCustomers.map((customer) => (
                              <button
                                key={customer.id}
                                onClick={() => handleAssignCustomer(customer.id)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-left"
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10 text-lg font-bold text-foreground shrink-0">
                                  {getCustomerInitial(customer)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-foreground truncate">{getCustomerDisplayName(customer)}</p>
                                  {customer.company_name && (
                                    <p className="text-sm text-muted-foreground truncate">{customer.company_name}</p>
                                  )}
                                </div>
                                <Plus className="h-6 w-6 text-muted-foreground shrink-0" />
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Customer List */}
                {customers.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-foreground/5 p-16 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-bold text-foreground">No customers assigned</h3>
                    <p className="mt-2 text-muted-foreground">Add customers to this representative</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customers.map((customer) => (
                      <div key={customer.id} className="rounded-2xl border border-border bg-foreground/5 p-4 md:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10 text-lg font-bold text-foreground shrink-0">
                              {getCustomerInitial(customer)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{getCustomerDisplayName(customer)}</p>
                              <p className="text-sm text-muted-foreground">{getCustomerEmail(customer) || ""}</p>
                              {customer.company_name && (
                                <p className="text-sm text-muted-foreground truncate">{customer.company_name}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnassignCustomer(customer.id)}
                            className="p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-foreground/5 p-16 text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-bold text-foreground">No orders yet</h3>
                    <p className="mt-2 text-muted-foreground">Orders from this rep's customers will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-2xl border border-border bg-foreground/5 p-4 md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <p className="text-lg font-semibold text-foreground">Order #{order.order_number}</p>
                            <p className="text-muted-foreground">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(order.created_at), "PPP")}</p>
                          </div>
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className="text-right">
                              <p className="text-xl md:text-2xl font-bold text-foreground">
                                ${safeNumber(order.total_amount).toFixed(2)}
                              </p>
                              <p className="text-sm text-emerald-400">
                                +$
                                {(safeNumber(order.total_amount) * (safeNumber(rep.commission_rate) / 100)).toFixed(2)}{" "}
                                commission
                              </p>
                            </div>
                            <Badge
                              className={`
                              ${order.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : ""}
                              ${order.status === "pending" ? "bg-amber-500/20 text-amber-400" : ""}
                              ${order.status === "processing" ? "bg-blue-500/20 text-blue-400" : ""}
                              border-0 px-4 py-2
                            `}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Custom Product Pricing</h2>
                  <p className="text-muted-foreground mt-1">Set special prices for this rep's discount codes</p>
                </div>

                {groupedProducts.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-foreground/5 p-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-bold text-foreground">No products</h3>
                    <p className="mt-2 text-muted-foreground">Products will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedProducts.map((group) => {
                      const isExpanded = expandedProducts.includes(group.base_name)
                      const hasCustomPricing = group.variants.some((v) => v.custom_price)

                      return (
                        <div
                          key={group.base_name}
                          className="rounded-2xl border border-border bg-foreground/5 overflow-hidden"
                        >
                          {/* Product Header */}
                          <button
                            onClick={() =>
                              setExpandedProducts((prev) =>
                                isExpanded ? prev.filter((p) => p !== group.base_name) : [...prev, group.base_name],
                              )
                            }
                            className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-foreground/5 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10 shrink-0">
                                <Package className="h-6 w-6 text-foreground/60" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <p className="font-semibold text-foreground text-lg">{group.base_name}</p>
                                  {hasCustomPricing && (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 px-2 py-0.5 text-xs">
                                      Custom Pricing
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {group.variants.length} variant{group.variants.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>

                          {/* Expanded Variants */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-border p-4 md:p-6 space-y-4">
                                  {group.variants.map((variant) => {
                                    const percentDiff = variant.custom_price
                                      ? (
                                          ((variant.retail_price - variant.custom_price) / variant.retail_price) *
                                          100
                                        ).toFixed(0)
                                      : null
                                    const isEditing = editingPrices[variant.id] !== undefined
                                    const isSaving = savingPrices[variant.id]

                                    return (
                                      <div
                                        key={variant.id}
                                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-foreground/5"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-foreground">{variant.variant || variant.name}</p>
                                          {variant.color && <p className="text-sm text-muted-foreground">{variant.color}</p>}
                                        </div>

                                        {/* Price Display */}
                                        <div className="flex items-center gap-4 flex-wrap">
                                          <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase">Retail</p>
                                            <p className="font-bold text-foreground">${variant.retail_price.toFixed(2)}</p>
                                          </div>

                                          <div className="text-right min-w-[100px]">
                                            <p className="text-xs text-muted-foreground uppercase">Rep Price</p>
                                            {isEditing ? (
                                              <div className="flex items-center gap-2">
                                                <Input
                                                  type="number"
                                                  step="0.01"
                                                  value={editingPrices[variant.id]}
                                                  onChange={(e) =>
                                                    setEditingPrices((prev) => ({
                                                      ...prev,
                                                      [variant.id]: e.target.value,
                                                    }))
                                                  }
                                                  className="h-10 w-24 rounded-xl bg-foreground/10 border-border text-foreground text-right"
                                                  autoFocus
                                                />
                                                <button
                                                  onClick={() => handleSavePrice(variant.id)}
                                                  disabled={isSaving}
                                                  className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                                >
                                                  <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setEditingPrices((prev) => {
                                                      const updated = { ...prev }
                                                      delete updated[variant.id]
                                                      return updated
                                                    })
                                                  }
                                                  className="p-2 rounded-lg bg-foreground/10 text-muted-foreground hover:bg-foreground/20"
                                                >
                                                  <X className="h-4 w-4" />
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-2">
                                                {variant.custom_price ? (
                                                  <>
                                                    <p className="font-bold text-emerald-400">
                                                      ${variant.custom_price.toFixed(2)}
                                                    </p>
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 px-2 py-0.5 text-xs">
                                                      -{percentDiff}%
                                                    </Badge>
                                                  </>
                                                ) : (
                                                  <p className="text-muted-foreground">—</p>
                                                )}
                                              </div>
                                            )}
                                          </div>

                                          {/* Actions */}
                                          {!isEditing && (
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() =>
                                                  setEditingPrices((prev) => ({
                                                    ...prev,
                                                    [variant.id]: variant.custom_price?.toString() || "",
                                                  }))
                                                }
                                                className="p-3 rounded-xl bg-foreground/10 text-foreground/60 hover:bg-foreground/20 hover:text-foreground transition-colors"
                                              >
                                                <Edit3 className="h-4 w-4" />
                                              </button>
                                              {variant.custom_price && (
                                                <button
                                                  onClick={() => handleRemovePrice(variant.id)}
                                                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "discounts" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Discount Codes</h2>
                    <p className="text-muted-foreground">Discount codes created by this rep</p>
                  </div>
                  <button
                    onClick={() => setShowCreateDiscount(!showCreateDiscount)}
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-5 w-5" />
                    Create Code
                  </button>
                </div>

                {/* Create Discount Panel */}
                <AnimatePresence>
                  {showCreateDiscount && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border border-border bg-foreground/5 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground text-lg">Create Discount Code</h3>
                          <button
                            onClick={() => setShowCreateDiscount(false)}
                            className="p-3 rounded-xl hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label className="text-foreground/60">Code</Label>
                            <Input
                              value={newDiscountCode}
                              onChange={(e) => setNewDiscountCode(e.target.value.toUpperCase())}
                              placeholder="SUMMER20"
                              className="rounded-xl h-14 bg-foreground/5 border-border text-foreground uppercase placeholder:text-muted-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground/60">Type</Label>
                            <select
                              value={newDiscountType}
                              onChange={(e) => setNewDiscountType(e.target.value as "percentage" | "fixed")}
                              className="w-full h-14 rounded-xl bg-foreground/5 border border-border text-foreground px-4"
                            >
                              <option value="percentage" className="bg-background">
                                Percentage
                              </option>
                              <option value="fixed" className="bg-background">
                                Fixed Amount
                              </option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground/60">Value</Label>
                            <Input
                              type="number"
                              value={newDiscountValue}
                              onChange={(e) => setNewDiscountValue(e.target.value)}
                              placeholder={newDiscountType === "percentage" ? "20" : "10.00"}
                              className="rounded-xl h-14 bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCreateDiscountCode}
                          disabled={!newDiscountCode || !newDiscountValue || creatingDiscount}
                          className="w-full h-14 rounded-2xl bg-white font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                          {creatingDiscount ? "Creating..." : "Create Discount Code"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {discountHistory.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-foreground/5 p-16 text-center">
                    <Percent className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-bold text-foreground">No discount codes</h3>
                    <p className="mt-2 text-muted-foreground">Create a discount code for this rep</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {discountHistory.map((discount) => (
                      <div key={discount.id} className="rounded-2xl border border-border bg-foreground/5 p-4 md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="text-lg font-bold text-foreground font-mono">{discount.code}</p>
                              <Badge
                                className={`
                                ${(discount.times_used || 0) > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-foreground/10 text-foreground/60"}
                                border-0 px-3 py-1
                              `}
                              >
                                {(discount.times_used || 0) > 0 ? `Used ${discount.times_used}x` : "Unused"}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {discount.discount_type === "percentage"
                                ? `${discount.discount_value}% off`
                                : `$${discount.discount_value} off`}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="text-foreground/60">{format(new Date(discount.created_at), "PPP")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Price Edit History</h2>
                {priceHistory.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-foreground/5 p-16 text-center">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-xl font-bold text-foreground">No history</h3>
                    <p className="mt-2 text-muted-foreground">Price changes will be logged here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {priceHistory.map((edit) => (
                      <div key={edit.id} className="rounded-2xl border border-border bg-foreground/5 p-4 md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10 shrink-0">
                              <Package className="h-5 w-5 text-foreground/60" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{edit.product_name}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">${safeNumber(edit.old_price).toFixed(2)}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-emerald-400">${safeNumber(edit.new_price).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{format(new Date(edit.created_at), "PPP 'at' p")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-border bg-foreground/5 p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Commission Settings</h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-foreground/60">Commission Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        className="rounded-xl h-14 bg-foreground/5 border-border text-foreground text-lg"
                      />
                      <p className="text-sm text-muted-foreground">Percentage of each sale this rep earns</p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground/60">Bonus Commission ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={bonusCommission}
                        onChange={(e) => setBonusCommission(Number(e.target.value))}
                        className="rounded-xl h-14 bg-foreground/5 border-border text-foreground text-lg"
                      />
                      <p className="text-sm text-muted-foreground">Extra bonus amount added to pending commissions</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 w-full md:w-auto"
                  >
                    {settingsSaved ? (
                      <>
                        <Check className="h-5 w-5" />
                        Saved!
                      </>
                    ) : savingSettings ? (
                      "Saving..."
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>

                <div className="rounded-2xl border border-border bg-foreground/5 p-6 md:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Rep Information</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{rep.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground">
                        {rep.first_name && rep.last_name ? `${rep.first_name} ${rep.last_name}` : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-foreground">{format(new Date(rep.created_at), "PPP")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 px-3 py-1">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

