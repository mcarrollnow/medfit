"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  MessageSquare,
  Clock,
  Package,
  CreditCard,
  Gift,
  Percent,
  Trash2,
  Plus,
  X,
  Search,
  Tag,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import SiteHeader from "@/components/site-header"
import {
  getRepDiscountCodes,
  assignDiscountToCustomer,
  removeAssignedDiscount,
  type RepDiscountCode as DiscountCode
} from "@/app/actions/rep-pricing"
import {
  getRepTiers,
  assignCustomerTier,
  getCustomerProductPricing,
  setCustomerProductPrice,
  removeCustomerProductPrice,
  searchProductsForPricing,
  type PricingTier,
  type CustomerProductPricing,
} from "@/app/actions/rep-tiers"

interface Customer {
  id: string
  user_id: string
  customer_type: string
  company_name?: string
  phone?: string
  email?: string
  first_name?: string
  last_name?: string
  shipping_city?: string
  shipping_state?: string
  shipping_address_line1?: string
  shipping_address_line2?: string
  shipping_zip?: string
  shipping_country?: string
  created_at: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_method?: string
  created_at: string
  item_count?: number
}

interface CustomerStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  customerSince: string
  preferredPaymentMethod?: string
}

interface CustomerAssignedDiscount {
  id: string
  customer_id: string
  discount_code_id: string | null
  discount_code: string | null
  custom_discount_type: string | null
  custom_discount_value: number | null
  custom_description: string | null
  status: string
  expires_at: string | null
  created_at: string
}

type ActiveTab = "overview" | "orders" | "pricing" | "discounts"

export default function RepCustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    customerSince: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview")
  
  // Discount states
  const [assignedDiscounts, setAssignedDiscounts] = useState<CustomerAssignedDiscount[]>([])
  const [availableDiscounts, setAvailableDiscounts] = useState<DiscountCode[]>([])
  const [showAssignDiscount, setShowAssignDiscount] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    type: "custom" as "custom" | "existing",
    discountCodeId: "",
    customType: "percentage" as "percentage" | "fixed",
    customValue: "",
    description: "",
    expiresAt: ""
  })
  const [assigningDiscount, setAssigningDiscount] = useState(false)

  // Pricing tier states
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([])
  const [currentTierId, setCurrentTierId] = useState<string | null>(null)
  const [savingTier, setSavingTier] = useState(false)
  
  // Per-product pricing states
  const [productOverrides, setProductOverrides] = useState<CustomerProductPricing[]>([])
  const [showAddOverride, setShowAddOverride] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [productResults, setProductResults] = useState<Array<{ id: string; name: string; variant: string | null; retail_price: number; b2b_price: number | null }>>([])
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; variant: string | null; retail_price: number; b2b_price: number | null } | null>(null)
  const [overridePrice, setOverridePrice] = useState("")
  const [savingOverride, setSavingOverride] = useState(false)
  const [searchingProducts, setSearchingProducts] = useState(false)

  useEffect(() => {
    loadCustomerData()
  }, [id])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = getSupabaseBrowserClient()
      
      // Get current user (rep)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Not authenticated")
        return
      }
      
      // Get rep's user record
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single()
      
      if (!repUser) {
        setError("Rep profile not found")
        return
      }

      // Load customer (only if assigned to this rep)
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .eq("rep_id", repUser.id)
        .single()

      if (customerError || !customerData) {
        setError("Customer not found or not assigned to you")
        return
      }

      // Get user data for email
      if (customerData.user_id) {
        const { data: userData } = await supabase
          .from("users")
          .select("email, first_name, last_name")
          .eq("id", customerData.user_id)
          .single()

        if (userData) {
          customerData.email = userData.email
          customerData.first_name = userData.first_name
          customerData.last_name = userData.last_name
        }
      }

      setCustomer(customerData)

      // Load customer orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerData.id)
        .order("created_at", { ascending: false })

      if (ordersData) {
        setOrders(ordersData)

        // Calculate stats
        const totalSpent = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        const stats: CustomerStats = {
          totalOrders: ordersData.length,
          totalSpent,
          averageOrderValue: ordersData.length > 0 ? totalSpent / ordersData.length : 0,
          lastOrderDate: ordersData[0]?.created_at,
          customerSince: customerData.created_at,
          preferredPaymentMethod: ordersData[0]?.payment_method
        }
        setStats(stats)
      }

      // Load assigned discounts
      const { data: discountsData } = await supabase
        .from("customer_assigned_discounts")
        .select(`
          *,
          discount_codes(code)
        `)
        .eq("customer_id", customerData.id)
        .order("created_at", { ascending: false })
      
      if (discountsData) {
        setAssignedDiscounts(discountsData.map((d: any) => ({
          id: d.id,
          customer_id: d.customer_id,
          discount_code_id: d.discount_code_id,
          discount_code: d.discount_codes?.code || null,
          custom_discount_type: d.custom_discount_type,
          custom_discount_value: d.custom_discount_value,
          custom_description: d.custom_description,
          status: d.status,
          expires_at: d.expires_at,
          created_at: d.created_at,
        })))
      }

      // Load available discount codes (rep's codes)
      const repDiscounts = await getRepDiscountCodes(repUser.id)
      setAvailableDiscounts(repDiscounts)

      // Load pricing tiers
      const tiersData = await getRepTiers(repUser.id)
      setPricingTiers(tiersData)
      setCurrentTierId(customerData.pricing_tier_id || null)

      // Load per-product pricing overrides
      const overridesData = await getCustomerProductPricing(customerData.id)
      setProductOverrides(overridesData)

    } catch (error) {
      console.error("Error loading customer:", error)
      setError("Failed to load customer data")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignDiscount = async () => {
    if (!customer) return
    setAssigningDiscount(true)
    
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) {
        alert("You must be logged in to assign discounts")
        return
      }
      
      // Get rep's database user ID
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single()
      
      if (!repUser) {
        alert("Rep profile not found")
        return
      }
      
      // Parameters: repId, customerId, discount object
      const result = await assignDiscountToCustomer(
        repUser.id,
        customer.id,
        {
          discountCodeId: newDiscount.type === "existing" ? newDiscount.discountCodeId : undefined,
          customDiscountType: newDiscount.type === "custom" ? newDiscount.customType : undefined,
          customDiscountValue: newDiscount.type === "custom" ? parseFloat(newDiscount.customValue) : undefined,
          customDescription: newDiscount.description || undefined,
          expiresAt: newDiscount.expiresAt || undefined,
        }
      )
      
      if (result.success) {
        // Reload discounts
        const { data: discountsData } = await supabase
          .from("customer_assigned_discounts")
          .select(`
            *,
            discount_codes(code)
          `)
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })
        
        if (discountsData) {
          setAssignedDiscounts(discountsData.map((d: any) => ({
            id: d.id,
            customer_id: d.customer_id,
            discount_code_id: d.discount_code_id,
            discount_code: d.discount_codes?.code || null,
            custom_discount_type: d.custom_discount_type,
            custom_discount_value: d.custom_discount_value,
            custom_description: d.custom_description,
            status: d.status,
            expires_at: d.expires_at,
            created_at: d.created_at,
          })))
        }
        
        setShowAssignDiscount(false)
        setNewDiscount({
          type: "custom",
          discountCodeId: "",
          customType: "percentage",
          customValue: "",
          description: "",
          expiresAt: ""
        })
      } else {
        alert(result.error || "Failed to assign discount")
      }
    } catch (error) {
      console.error("Error assigning discount:", error)
      alert("Failed to assign discount")
    } finally {
      setAssigningDiscount(false)
    }
  }
  
  const handleRemoveDiscount = async (discountId: string) => {
    if (!confirm("Are you sure you want to remove this discount?")) return
    
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single()
      
      // Parameters: repId first, then assignmentId
      const result = await removeAssignedDiscount(repUser?.id || "", discountId)
      
      if (result.success && customer) {
        setAssignedDiscounts(prev => prev.map(d => 
          d.id === discountId ? { ...d, status: "removed" } : d
        ))
      } else {
        alert(result.error || "Failed to remove discount")
      }
    } catch (error) {
      console.error("Error removing discount:", error)
      alert("Failed to remove discount")
    }
  }

  // Pricing tier handlers
  const handleTierChange = async (tierId: string) => {
    if (!customer) return
    setSavingTier(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single()

      if (!repUser) return

      const newTierId = tierId === "" ? null : tierId
      const result = await assignCustomerTier(repUser.id, customer.id, newTierId)
      if (result.success) {
        setCurrentTierId(newTierId)
      } else {
        alert(result.error || "Failed to assign tier")
      }
    } catch (error) {
      console.error("Error assigning tier:", error)
      alert("Failed to assign tier")
    } finally {
      setSavingTier(false)
    }
  }

  // Product search for overrides
  const handleProductSearch = async (query: string) => {
    setProductSearch(query)
    if (query.length < 2) {
      setProductResults([])
      return
    }
    setSearchingProducts(true)
    try {
      const results = await searchProductsForPricing(query)
      // Filter out products that already have overrides
      const existingIds = new Set(productOverrides.map(o => o.product_id))
      setProductResults(results.filter(r => !existingIds.has(r.id)))
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setSearchingProducts(false)
    }
  }

  const handleAddOverride = async () => {
    if (!customer || !selectedProduct || !overridePrice) return
    setSavingOverride(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single()

      if (!repUser) return

      const result = await setCustomerProductPrice(
        repUser.id,
        customer.id,
        selectedProduct.id,
        parseFloat(overridePrice)
      )

      if (result.success) {
        // Reload overrides
        const overridesData = await getCustomerProductPricing(customer.id)
        setProductOverrides(overridesData)
        setShowAddOverride(false)
        setSelectedProduct(null)
        setOverridePrice("")
        setProductSearch("")
        setProductResults([])
      } else {
        alert(result.error || "Failed to set price override")
      }
    } catch (error) {
      console.error("Error adding override:", error)
      alert("Failed to set price override")
    } finally {
      setSavingOverride(false)
    }
  }

  const handleRemoveOverride = async (overrideId: string) => {
    if (!confirm("Remove this price override?")) return
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: repUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single()

      if (!repUser) return

      const result = await removeCustomerProductPrice(repUser.id, overrideId)
      if (result.success) {
        setProductOverrides(prev => prev.filter(o => o.id !== overrideId))
      } else {
        alert(result.error || "Failed to remove override")
      }
    } catch (error) {
      console.error("Error removing override:", error)
      alert("Failed to remove override")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "delivered":
        return "text-green-400"
      case "pending":
      case "processing":
        return "text-yellow-400"
      case "cancelled":
      case "failed":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: User },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "pricing" as const, label: "Pricing", icon: Tag },
    { id: "discounts" as const, label: "Discounts", icon: Gift },
  ]

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-background flex items-center justify-center">
        <div className="text-foreground">Loading customer details...</div>
      </div>
      </>
    )
  }

  if (error || !customer) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-background flex flex-col items-center justify-center">
          <h1 className="text-2xl text-foreground mb-4">{error || "Customer not found"}</h1>
          <Link href="/rep/customers" className="text-muted-foreground hover:text-foreground transition">
            ← Back to Customers
        </Link>
      </div>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background text-foreground px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-base font-medium">Back to Customers</span>
          </button>

        {/* Header */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">
                {customer.first_name} {customer.last_name}
              </h1>
                <Badge className={`px-4 py-2 text-base font-bold border-0 ${
                  customer.customer_type === "b2b" 
                    ? "bg-blue-500/20 text-blue-400"
                    : customer.customer_type === "b2bvip"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-zinc-500/20 text-muted-foreground"
                }`}>
                  {customer.customer_type === "b2b" ? "B2B" : customer.customer_type === "b2bvip" ? "B2B VIP" : "Retail"}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground">{customer.email || "No email"}</p>
              {customer.company_name && (
                <p className="text-lg text-muted-foreground">{customer.company_name}</p>
              )}
            </div>
        </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Spent",
                value: formatCurrency(stats.totalSpent),
                icon: DollarSign,
                color: "bg-green-500/20 text-green-400",
              },
              {
                label: "Total Orders",
                value: stats.totalOrders.toString(),
                icon: ShoppingCart,
                color: "bg-blue-500/20 text-blue-400",
              },
              {
                label: "Avg. Order",
                value: formatCurrency(stats.averageOrderValue),
                icon: TrendingUp,
                color: "bg-purple-500/20 text-purple-400",
              },
              {
                label: "Last Order",
                value: stats.lastOrderDate ? formatDate(stats.lastOrderDate) : "Never",
                icon: Calendar,
                color: "bg-yellow-500/20 text-yellow-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl border border-border bg-foreground/[0.08] backdrop-blur-xl p-6"
              >
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color.split(" ")[0]}`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color.split(" ")[1]}`} />
        </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
                </div>
              </div>
            ))}
            </div>

          {/* Bold Tabs */}
          <div className="grid grid-cols-4 gap-3">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center gap-2 rounded-2xl px-4 md:px-8 py-4 md:py-5 text-base md:text-lg font-bold transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground border border-border"
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
              <TabsContent value="overview" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
                  <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                Contact Information
                    </h3>

                    <div className="space-y-4">
                {customer.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a href={`mailto:${customer.email}`} className="text-foreground hover:text-foreground/80">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                )}

                {customer.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <a href={`tel:${customer.phone}`} className="text-foreground hover:text-foreground/80">
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {customer.company_name && (
                        <div className="flex items-start gap-3">
                          <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                            <p className="text-sm text-muted-foreground">Company</p>
                      <p className="text-foreground">{customer.company_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
                  <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                  Shipping Address
                    </h3>

                    {customer.shipping_address_line1 ? (
                      <div className="text-foreground/70 space-y-1">
                    <p>{customer.shipping_address_line1}</p>
                        {customer.shipping_address_line2 && <p>{customer.shipping_address_line2}</p>}
                    <p>
                      {customer.shipping_city && `${customer.shipping_city}, `}
                      {customer.shipping_state} {customer.shipping_zip}
                        </p>
                        {customer.shipping_country && <p>{customer.shipping_country}</p>}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No shipping address on file</p>
                    )}
                  </div>

                  {/* Customer Timeline */}
                  <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6 md:col-span-2">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      Customer Timeline
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Since</p>
                        <p className="text-lg font-semibold text-foreground">{formatDate(stats.customerSince)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Order</p>
                        <p className="text-lg font-semibold text-foreground">{formatDate(stats.lastOrderDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Payment</p>
                        <p className="text-lg font-semibold text-foreground capitalize">{stats.preferredPaymentMethod || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Discounts</p>
                        <p className="text-lg font-semibold text-purple-400">
                          {assignedDiscounts.filter(d => d.status === "active").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Order History</h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-6 bg-foreground/[0.06] rounded-xl hover:bg-foreground/[0.08] transition border border-border"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground font-medium text-lg">Order #{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                              {order.item_count && (
                                <p className="text-sm text-muted-foreground">{order.item_count} items</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-foreground font-bold text-lg">{formatCurrency(order.total_amount)}</p>
                              <p className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                                {order.status.replace("_", " ")}
                              </p>
                              {order.payment_method && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  {order.payment_method}
                    </p>
                  )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <div className="space-y-8">
                  {/* Pricing Tier Assignment */}
                  <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-foreground flex items-center gap-3">
                        <Layers className="h-5 w-5 text-muted-foreground" />
                        Pricing Tier
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Assign this customer to a pricing tier for automatic discount application.
                      </p>
                    </div>

                    {pricingTiers.length === 0 ? (
                      <div className="rounded-xl border border-border bg-foreground/[0.04] p-6 text-center space-y-3">
                        <Layers className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                        <p className="text-muted-foreground text-sm">No pricing tiers created yet.</p>
                        <Link
                          href="/rep/pricing-tiers"
                          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Create Pricing Tiers
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <select
                          value={currentTierId || ""}
                          onChange={(e) => handleTierChange(e.target.value)}
                          disabled={savingTier}
                          className="w-full h-14 px-6 rounded-2xl bg-foreground/[0.06] border border-border text-foreground text-lg hover:bg-foreground/[0.08] cursor-pointer focus:outline-none focus:border-border disabled:opacity-50 transition-all"
                        >
                          <option value="" className="bg-card">No Tier Assigned</option>
                          {pricingTiers.map((tier) => (
                            <option key={tier.id} value={tier.id} className="bg-card">
                              {tier.name} — {tier.discount_percentage}% discount
                            </option>
                          ))}
                        </select>
                        {currentTierId && (
                          <div className="rounded-xl border border-border bg-foreground/[0.04] p-4">
                            {(() => {
                              const tier = pricingTiers.find(t => t.id === currentTierId)
                              if (!tier) return null
                              return (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-foreground font-medium">{tier.name}</p>
                                    {tier.description && <p className="text-muted-foreground text-sm">{tier.description}</p>}
                                  </div>
                                  <p className="font-serif text-3xl font-light text-foreground">
                                    {tier.discount_percentage}<span className="text-lg text-muted-foreground">%</span>
                                  </p>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Per-Product Price Overrides */}
                  <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-light text-foreground flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          Product Price Overrides
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Set custom prices for specific products. These override tier discounts.
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowAddOverride(true)}
                        className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Override
                      </Button>
                    </div>

                    {productOverrides.length === 0 ? (
                      <div className="rounded-xl border border-border bg-foreground/[0.04] p-8 text-center space-y-3">
                        <DollarSign className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                        <p className="text-muted-foreground">No product price overrides set</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {productOverrides.map((override) => (
                          <div
                            key={override.id}
                            className="rounded-xl border border-border bg-foreground/[0.04] p-5 flex items-center justify-between group hover:bg-foreground/[0.06] transition-all"
                          >
                            <div className="space-y-1">
                              <p className="text-foreground font-medium">{override.product_name}</p>
                              {override.product_variant && (
                                <p className="text-muted-foreground text-sm">{override.product_variant}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm">
                                {override.product_retail_price && (
                                  <span className="text-muted-foreground line-through">
                                    ${override.product_retail_price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-serif text-2xl font-light text-foreground">
                                ${override.custom_price.toFixed(2)}
                              </p>
                              <button
                                onClick={() => handleRemoveOverride(override.id)}
                                className="p-2 rounded-lg text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="discounts" className="mt-0">
                <div className="rounded-2xl bg-foreground/[0.08] backdrop-blur-xl border border-border p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Assigned Discounts</h3>
                      <p className="text-muted-foreground">Discounts that auto-apply at checkout for this customer.</p>
                    </div>
                    <Button
                      onClick={() => setShowAssignDiscount(true)}
                      className="h-12 px-6 rounded-xl gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Assign Discount
                    </Button>
                  </div>

                  {/* Active Discounts */}
                  <div className="space-y-4">
                    {assignedDiscounts.filter(d => d.status === "active").length === 0 ? (
                      <div className="text-center py-12">
                        <Gift className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">No active discounts assigned</p>
                      </div>
                    ) : (
                      assignedDiscounts.filter(d => d.status === "active").map((discount) => (
                        <div
                          key={discount.id}
                          className="rounded-2xl border border-border bg-foreground/[0.06] p-6"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Percent className="h-6 w-6 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-foreground">
                                  {discount.custom_discount_type === "percentage" 
                                    ? `${discount.custom_discount_value}% Off`
                                    : `$${discount.custom_discount_value} Off`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {discount.custom_description || (discount.discount_code ? `Code: ${discount.discount_code}` : "Custom discount")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {discount.expires_at && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Expires: {new Date(discount.expires_at).toLocaleDateString()}
              </div>
            )}
                              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDiscount(discount.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Past Discounts */}
                  {assignedDiscounts.filter(d => d.status !== "active").length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h4 className="text-lg font-semibold text-foreground/60">Discount History</h4>
                      {assignedDiscounts.filter(d => d.status !== "active").map((discount) => (
                        <div
                          key={discount.id}
                          className="rounded-xl border border-border bg-foreground/[0.03] p-4 opacity-60"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                {discount.custom_discount_type === "percentage" 
                                  ? `${discount.custom_discount_value}% Off`
                                  : `$${discount.custom_discount_value} Off`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {discount.custom_description || "Custom discount"}
                              </p>
                            </div>
                            <Badge className={
                              discount.status === "used" ? "bg-blue-500/20 text-blue-400" :
                              discount.status === "expired" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-zinc-500/20 text-muted-foreground"
                            }>
                              {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Add Product Override Modal */}
        <AnimatePresence>
          {showAddOverride && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => { setShowAddOverride(false); setSelectedProduct(null); setProductSearch(""); setProductResults([]); setOverridePrice("") }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-card border border-border p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-light text-foreground">Add Price Override</h3>
                    <p className="text-sm text-muted-foreground mt-1">Set a custom price for a specific product</p>
                  </div>
                  <button
                    onClick={() => { setShowAddOverride(false); setSelectedProduct(null); setProductSearch(""); setProductResults([]); setOverridePrice("") }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {!selectedProduct ? (
                    <>
                      {/* Product Search */}
                      <div className="space-y-2">
                        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Search Product</Label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={productSearch}
                            onChange={(e) => handleProductSearch(e.target.value)}
                            placeholder="Search by product name or barcode..."
                            className="h-12 pl-10 rounded-xl bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground/50"
                          />
                          {searchingProducts && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 border-2 border-border border-t-white rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Results */}
                      {productResults.length > 0 && (
                        <div className="max-h-60 overflow-y-auto rounded-xl border border-border divide-y divide-white/5">
                          {productResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => { setSelectedProduct(product); setProductResults([]); setProductSearch("") }}
                              className="w-full text-left p-4 hover:bg-foreground/5 transition-colors"
                            >
                              <p className="text-foreground font-medium">{product.name}</p>
                              <div className="flex items-center gap-3 mt-1 text-sm">
                                {product.variant && <span className="text-muted-foreground">{product.variant}</span>}
                                <span className="text-muted-foreground">Retail: ${product.retail_price.toFixed(2)}</span>
                                {product.b2b_price && <span className="text-muted-foreground">B2B: ${product.b2b_price.toFixed(2)}</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Selected product */}
                      <div className="rounded-xl border border-border bg-foreground/[0.04] p-4 flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">{selectedProduct.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            {selectedProduct.variant && <span className="text-muted-foreground">{selectedProduct.variant}</span>}
                            <span className="text-muted-foreground">Retail: ${selectedProduct.retail_price.toFixed(2)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Custom price input */}
                      <div className="space-y-2">
                        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Custom Price</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={overridePrice}
                            onChange={(e) => setOverridePrice(e.target.value)}
                            placeholder="0.00"
                            className="h-14 pl-8 rounded-xl bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground/50"
                          />
                        </div>
                        {overridePrice && parseFloat(overridePrice) < selectedProduct.retail_price && (
                          <p className="text-sm text-muted-foreground">
                            Savings: ${(selectedProduct.retail_price - parseFloat(overridePrice)).toFixed(2)} ({Math.round(((selectedProduct.retail_price - parseFloat(overridePrice)) / selectedProduct.retail_price) * 100)}% off retail)
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setShowAddOverride(false); setSelectedProduct(null); setProductSearch(""); setProductResults([]); setOverridePrice("") }}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddOverride}
                    disabled={savingOverride || !selectedProduct || !overridePrice || parseFloat(overridePrice) < 0}
                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 gap-2"
                  >
                    {savingOverride ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Set Price"
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assign Discount Modal */}
        <AnimatePresence>
          {showAssignDiscount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAssignDiscount(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-card border border-border p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Assign Discount</h3>
                    <p className="text-sm text-muted-foreground mt-1">This discount will auto-apply at checkout</p>
                  </div>
                  <button
                    onClick={() => setShowAssignDiscount(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Discount Type Toggle */}
                  <div className="flex gap-2 p-1 bg-foreground/5 rounded-xl">
                    <button
                      onClick={() => setNewDiscount(prev => ({ ...prev, type: "custom" }))}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        newDiscount.type === "custom" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Custom Discount
                    </button>
                    {availableDiscounts.length > 0 && (
                      <button
                        onClick={() => setNewDiscount(prev => ({ ...prev, type: "existing" }))}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                          newDiscount.type === "existing" 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        My Codes
                      </button>
                    )}
                  </div>

                  {newDiscount.type === "custom" ? (
                    <>
                      {/* Custom Discount Type */}
                      <div className="space-y-2">
                        <Label className="text-foreground">Discount Type</Label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNewDiscount(prev => ({ ...prev, customType: "percentage" }))}
                            className={`flex-1 py-3 rounded-lg font-medium border transition-all ${
                              newDiscount.customType === "percentage" 
                                ? "bg-purple-500/20 border-purple-500/50 text-purple-300" 
                                : "border-border text-foreground/60 hover:text-foreground"
                            }`}
                          >
                            Percentage %
                          </button>
                          <button
                            onClick={() => setNewDiscount(prev => ({ ...prev, customType: "fixed" }))}
                            className={`flex-1 py-3 rounded-lg font-medium border transition-all ${
                              newDiscount.customType === "fixed" 
                                ? "bg-green-500/20 border-green-500/50 text-green-300" 
                                : "border-border text-foreground/60 hover:text-foreground"
                            }`}
                          >
                            Fixed Amount $
                          </button>
              </div>
            </div>

                      {/* Discount Value */}
                      <div className="space-y-2">
                        <Label className="text-foreground">
                          {newDiscount.customType === "percentage" ? "Percentage" : "Amount"}
                        </Label>
                        <Input
                          type="number"
                          value={newDiscount.customValue}
                          onChange={(e) => setNewDiscount(prev => ({ ...prev, customValue: e.target.value }))}
                          placeholder={newDiscount.customType === "percentage" ? "e.g. 15" : "e.g. 10.00"}
                          className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-foreground">Select Discount Code</Label>
                      <select
                        value={newDiscount.discountCodeId}
                        onChange={(e) => setNewDiscount(prev => ({ ...prev, discountCodeId: e.target.value }))}
                        className="w-full h-12 rounded-xl bg-foreground/5 border border-border text-foreground px-4 focus:outline-none focus:border-border"
                      >
                        <option value="" className="bg-background">Select a discount code...</option>
                        {availableDiscounts.filter(d => d.is_active).map((discount) => (
                          <option key={discount.id} value={discount.id} className="bg-background">
                            {discount.code} - {discount.discount_type === "percentage" ? `${discount.discount_value}%` : discount.discount_type === "set_price" ? "Custom pricing" : `$${discount.discount_value}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Description */}
              <div className="space-y-2">
                    <Label className="text-foreground">Description (Optional)</Label>
                    <Input
                      value={newDiscount.description}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Loyalty reward, First order discount"
                      className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                    />
              </div>

                  {/* Expiration */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Expires (Optional)</Label>
                    <Input
                      type="date"
                      value={newDiscount.expiresAt}
                      onChange={(e) => setNewDiscount(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                    />
            </div>
          </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignDiscount(false)}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignDiscount}
                    disabled={assigningDiscount || (newDiscount.type === "custom" && !newDiscount.customValue) || (newDiscount.type === "existing" && !newDiscount.discountCodeId)}
                    className="h-12 px-6 rounded-xl gap-2"
                  >
                    {assigningDiscount ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4" />
                        Assign Discount
                      </>
                    )}
                  </Button>
        </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
