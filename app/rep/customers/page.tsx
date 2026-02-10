"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  ChevronDown, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Building, 
  Gift, 
  DollarSign, 
  ShoppingCart,
  Users,
  Tag,
  Percent,
  Ticket,
  ChevronRight,
  Trash2,
  Save,
} from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { getCurrentRep } from "@/app/actions/rep"
import {
  getRepCustomers,
  getRepDiscountCodes,
  getRepAssignedDiscounts,
  assignDiscountToCustomer,
  removeAssignedDiscount,
  type RepCustomer,
  type RepDiscountCode,
  type CustomerAssignedDiscount,
} from "@/app/actions/rep-pricing"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  user_id: string
  customer_type: string
  company_name?: string
  phone?: string
  shipping_city?: string
  shipping_state?: string
  shipping_address_line1?: string
  shipping_zip?: string
  created_at: string
  user?: {
    email: string
    first_name?: string
    last_name?: string
  }
  total_orders?: number
  total_spent?: number
  has_active_discount?: boolean
}

type ViewMode = "customers" | "discounts" | "assign-discount"

const typeColors: Record<string, { bg: string; text: string; glow: string }> = {
  retail: { bg: "bg-zinc-500/20", text: "text-muted-foreground", glow: "rgba(161,161,170,0.3)" },
  b2b: { bg: "bg-blue-500/20", text: "text-blue-400", glow: "rgba(59,130,246,0.3)" },
  b2bvip: { bg: "bg-purple-500/20", text: "text-purple-400", glow: "rgba(192,132,252,0.3)" },
}

const typeLabels: Record<string, string> = {
  retail: "Retail",
  b2b: "B2B",
  b2bvip: "B2B VIP",
}

export default function RepCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("customers")
  
  // For customer discounts
  const [repId, setRepId] = useState<string | null>(null)
  const [repCustomers, setRepCustomers] = useState<RepCustomer[]>([])
  const [discountCodes, setDiscountCodes] = useState<RepDiscountCode[]>([])
  const [assignedDiscounts, setAssignedDiscounts] = useState<CustomerAssignedDiscount[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<RepCustomer | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newDiscount, setNewDiscount] = useState<{
    type: "code" | "custom"
    discountCodeId?: string
    customDiscountType: "percentage" | "fixed"
    customDiscountValue: number
    customDescription: string
    expiresAt: string
    notes: string
  }>({
    type: "custom",
    customDiscountType: "percentage",
    customDiscountValue: 10,
    customDescription: "",
    expiresAt: "",
    notes: "",
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log("[Rep Customers] Auth user:", user?.id)
      if (!user) {
        console.log("[Rep Customers] No auth user found")
        setLoading(false)
        return
      }
      
      const { data: repUser, error: repUserError } = await supabase
        .from("users")
        .select("id, role")
        .eq("auth_id", user.id)
        .single()
      
      console.log("[Rep Customers] Rep user lookup:", { repUser, error: repUserError })
      
      if (!repUser) {
        console.log("[Rep Customers] No rep user found for auth_id:", user.id)
        setLoading(false)
        return
      }
      
      setRepId(repUser.id)
      
      // Get customer IDs assigned to this rep
      const { data: assignments, error: assignmentError } = await supabase
        .from("customer_rep_assignments")
        .select("customer_id")
        .eq("rep_id", repUser.id)
        .eq("is_current", true)
      
      console.log("[Rep Customers] Assignments:", { count: assignments?.length, error: assignmentError })
      
      if (assignmentError || !assignments || assignments.length === 0) {
        setCustomers([])
        
        // Still load discount-related data
        try {
          const [repCusts, codes, assigned] = await Promise.all([
            getRepCustomers(repUser.id),
            getRepDiscountCodes(repUser.id),
            getRepAssignedDiscounts(repUser.id),
          ])
          console.log("[Rep Customers] Discount data loaded:", { repCusts: repCusts?.length, codes: codes?.length, assigned: assigned?.length })
          setRepCustomers(repCusts || [])
          setDiscountCodes(codes || [])
          setAssignedDiscounts(assigned || [])
        } catch (discountError) {
          console.error("[Rep Customers] Error loading discount data:", discountError)
        }
        setLoading(false)
        return
      }
      
      const customerIds = assignments.map((a) => a.customer_id)
      
      // Fetch the actual customer data
      const { data: customersData, error } = await supabase
        .from("customers")
        .select(`
          *,
          user:users!customers_user_id_fkey(email, first_name, last_name)
        `)
        .in("id", customerIds)
        .order("created_at", { ascending: false })
      
      console.log("[Rep Customers] Customers data:", { count: customersData?.length, error })
      
      if (error) {
        console.error("[Rep Customers] Error fetching customers:", error)
        setLoading(false)
        return
      }
      
      const customersWithStats = await Promise.all((customersData || []).map(async (customer: any) => {
        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount")
          .eq("customer_id", customer.id)
        
        const { data: activeDiscount } = await supabase
          .from("customer_assigned_discounts")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("status", "active")
          .limit(1)
        
        const totalOrders = orders?.length || 0
        const totalSpent = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
        
        return {
          ...customer,
          user: customer.user,
          total_orders: totalOrders,
          total_spent: totalSpent,
          has_active_discount: (activeDiscount?.length || 0) > 0
        }
      }))
      
      setCustomers(customersWithStats)
      
      // Load discount-related data
      try {
        const [repCusts, codes, assigned] = await Promise.all([
          getRepCustomers(repUser.id),
          getRepDiscountCodes(repUser.id),
          getRepAssignedDiscounts(repUser.id),
        ])
        setRepCustomers(repCusts || [])
        setDiscountCodes(codes || [])
        setAssignedDiscounts(assigned || [])
      } catch (discountError) {
        console.error("[Rep Customers] Error loading discount data:", discountError)
      }
    } catch (error) {
      console.error("[Rep Customers] Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase()
    const email = customer.user?.email || ""
    const phone = customer.phone || ""
    const company = customer.company_name || ""
    const city = customer.shipping_city || ""
    const firstName = customer.user?.first_name || ""
    const lastName = customer.user?.last_name || ""

    return (
      email.toLowerCase().includes(searchLower) ||
      phone.includes(searchLower) ||
      company.toLowerCase().includes(searchLower) ||
      city.toLowerCase().includes(searchLower) ||
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower)
    )
  })

  const getDisplayName = (customer: Customer | RepCustomer): string => {
    if ('user' in customer && customer.user) {
      if (customer.user.first_name || customer.user.last_name) {
        return `${customer.user.first_name || ""} ${customer.user.last_name || ""}`.trim()
      }
    }
    if ('name' in customer && customer.name) return String(customer.name)
    if ('company_name' in customer && customer.company_name) return String(customer.company_name)
    if ('user' in customer && customer.user?.email) return String(customer.user.email)
    if ('email' in customer && customer.email) return String(customer.email)
    return "Unknown Customer"
  }

  // Customer discount handlers
  function handleAssignDiscount(customer: RepCustomer) {
    setSelectedCustomer(customer)
    setNewDiscount({
      type: "custom",
      customDiscountType: "percentage",
      customDiscountValue: 10,
      customDescription: "",
      expiresAt: "",
      notes: "",
    })
    setViewMode("assign-discount")
  }

  async function handleSaveAssignment() {
    let currentRepId = repId
    
    if (!currentRepId) {
      const rep = await getCurrentRep()
      currentRepId = rep?.id || null
      if (currentRepId) {
        setRepId(currentRepId)
      }
    }
    
    if (!currentRepId || !selectedCustomer) {
      alert("Unable to identify your account or customer. Please refresh the page.")
      return
    }
    
    setIsSaving(true)

    try {
      const result = await assignDiscountToCustomer(currentRepId, selectedCustomer.id, {
        discountCodeId: newDiscount.type === "code" ? newDiscount.discountCodeId : undefined,
        customDiscountType: newDiscount.type === "custom" ? newDiscount.customDiscountType : undefined,
        customDiscountValue: newDiscount.type === "custom" ? newDiscount.customDiscountValue : undefined,
        customDescription: newDiscount.customDescription || undefined,
        expiresAt: newDiscount.expiresAt || undefined,
        notes: newDiscount.notes || undefined,
      })

      if (result.success) {
        await loadCustomers()
        setViewMode("discounts")
        setSelectedCustomer(null)
      } else {
        alert(result.error || "Failed to assign discount")
      }
    } catch (error) {
      console.error("Error assigning discount:", error)
      alert("An error occurred. Check console for details.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemoveAssignment(assignmentId: string) {
    if (!repId) return
    const confirmed = window.confirm("Remove this discount from the customer?")
    if (!confirmed) return

    const result = await removeAssignedDiscount(repId, assignmentId)
    if (result.success) {
      await loadCustomers()
    } else {
      alert(result.error || "Failed to remove discount")
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Customers</h1>
            <p className="text-xl text-muted-foreground">Loading customers...</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-foreground/5" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Customers</h1>
          <p className="text-xl text-muted-foreground">View and manage your assigned customers.</p>
        </div>

        {/* Tab Navigation */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/[0.07] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10 p-3">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("customers")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                  viewMode === "customers"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                )}
              >
                <Users className="w-5 h-5" />
                <span>My Customers</span>
              </button>
              <button
                onClick={() => setViewMode("discounts")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                  viewMode === "discounts" || viewMode === "assign-discount"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                )}
              >
                <Gift className="w-5 h-5" />
                <span>Customer Discounts</span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Customers List View */}
          {viewMode === "customers" && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Search */}
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, or company..."
                  className="h-14 pl-12 pr-6 bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground focus:border-border focus:ring-0 rounded-xl"
                />
              </div>

              {/* Customer Cards */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Customers</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredCustomers.length} of {customers.length}
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredCustomers.map((customer) => {
                    const isExpanded = expandedId === customer.id
                    const typeStyle = typeColors[customer.customer_type] || typeColors.retail

                    return (
                      <motion.div
                        key={customer.id}
                        layout
                        className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                        {/* Card Header */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                          className="relative z-10 w-full p-6 text-left"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            {/* Customer Info */}
                            <div className="flex items-center gap-4">
                              <div
                                className="flex h-14 w-14 items-center justify-center rounded-xl border border-border"
                                style={{ backgroundColor: `${typeStyle.glow}` }}
                              >
                                {customer.company_name ? (
                                  <Building className="h-6 w-6 text-foreground" />
                                ) : (
                                  <User className="h-6 w-6 text-foreground" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h3 className="text-xl font-bold tracking-tight text-foreground">{getDisplayName(customer)}</h3>
                                  <Badge className={`${typeStyle.bg} ${typeStyle.text} border-0 px-2 py-0.5 text-xs font-semibold`}>
                                    {typeLabels[customer.customer_type] || customer.customer_type}
                                  </Badge>
                                  {customer.has_active_discount && (
                                    <Badge className="bg-purple-500/20 text-purple-400 border-0 px-2 py-0.5 text-xs font-semibold">
                                      <Gift className="h-3 w-3 mr-1" />
                                      Discount
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{customer.user?.email || "No email"}</p>
                              </div>
                            </div>

                            {/* Stats & Chevron */}
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="flex gap-4 md:gap-6 flex-wrap">
                                <div className="text-center min-w-[50px]">
                                  <p className="text-lg font-bold text-foreground">{customer.total_orders || 0}</p>
                                  <p className="text-xs text-muted-foreground">Orders</p>
                                </div>
                                <div className="text-center min-w-[70px]">
                                  <p className="text-lg font-bold text-emerald-400">
                                    ${(customer.total_spent || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Spent</p>
                                </div>
                                <div className="text-center min-w-[50px]">
                                  <p className="text-lg font-bold text-foreground">{customer.shipping_city || "—"}</p>
                                  <p className="text-xs text-muted-foreground">City</p>
                                </div>
                              </div>
                              <ChevronDown
                                className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>
                          </div>
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="relative z-10 border-t border-border p-6">
                                <div className="grid gap-6 md:grid-cols-3">
                                  {/* Contact Info */}
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact</h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 text-foreground/70">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {customer.user?.email || "No email"}
                                      </div>
                                      <div className="flex items-center gap-3 text-foreground/70">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {customer.phone || <span className="text-muted-foreground">No phone</span>}
                                      </div>
                                      {customer.shipping_address_line1 && (
                                        <p className="text-muted-foreground text-sm">
                                          {customer.shipping_address_line1}, {customer.shipping_city},{" "}
                                          {customer.shipping_state} {customer.shipping_zip}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Stats */}
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stats</h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 text-foreground/70">
                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                        {customer.total_orders || 0} orders placed
                                      </div>
                                      <div className="flex items-center gap-3 text-foreground/70">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        ${(customer.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} total spent
                                      </div>
                                      {customer.has_active_discount && (
                                        <div className="flex items-center gap-3 text-purple-400">
                                          <Gift className="h-4 w-4" />
                                          Has active discount
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</h4>
                                    <Link
                                      href={`/rep/customers/${customer.id}`}
                                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-card/90"
                                    >
                                      View Full Profile
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}

                  {filteredCustomers.length === 0 && (
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                      <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 relative z-10" />
                      <p className="text-lg text-muted-foreground relative z-10">
                        {customers.length === 0 
                          ? "No customers assigned to you yet" 
                          : "No customers found matching your search"}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {/* Customer Discounts View */}
          {viewMode === "discounts" && (
            <motion.div
              key="discounts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Active Discounts */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Customer Discounts</h2>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                    {assignedDiscounts.filter(d => d.status === "active").length} active
                  </Badge>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-3">
                    {assignedDiscounts.filter(d => d.status === "active").map((discount) => (
                      <div key={discount.id} className="flex items-center justify-between p-4 bg-foreground/[0.04] rounded-xl border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-foreground">{discount.customer_name}</p>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full text-xs">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/60 mt-1">
                            {discount.discount_code 
                              ? `Code: ${discount.discount_code}` 
                              : `${discount.custom_discount_type === "percentage" ? `${discount.custom_discount_value}%` : `$${discount.custom_discount_value}`} off`
                            }
                            {discount.custom_description && ` • ${discount.custom_description}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Assigned {format(new Date(discount.created_at), "MMM d, yyyy")}
                            {discount.expires_at && ` • Expires ${format(new Date(discount.expires_at), "MMM d, yyyy")}`}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveAssignment(discount.id)}
                          variant="ghost"
                          className="h-10 w-10 rounded-full hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {assignedDiscounts.filter(d => d.status === "active").length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No active customer discounts</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Assign New Discount */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Assign New Discount</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <p className="text-foreground/60 text-sm mb-4">Select a customer to assign a discount to their next order</p>
                    <div className="space-y-3">
                      {repCustomers.map((customer) => {
                        const hasActiveDiscount = assignedDiscounts.some(d => d.customer_id === customer.id && d.status === "active")
                        return (
                          <button
                            key={customer.id}
                            onClick={() => !hasActiveDiscount && handleAssignDiscount(customer)}
                            disabled={hasActiveDiscount}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl text-left transition-all",
                              hasActiveDiscount 
                                ? "bg-foreground/[0.03] opacity-50 cursor-not-allowed"
                                : "bg-foreground/[0.04] hover:bg-foreground/[0.07]"
                            )}
                          >
                            <div>
                              <p className="font-medium text-foreground">{customer.name}</p>
                              <p className="text-sm text-foreground/60">{customer.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {customer.total_orders} orders • ${customer.total_spent.toFixed(2)} spent
                              </p>
                            </div>
                            {hasActiveDiscount ? (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 rounded-full">
                                Has Discount
                              </Badge>
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        )
                      })}
                      {repCustomers.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No customers assigned to you</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* History */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">History</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-3 max-h-64 overflow-y-auto">
                    {assignedDiscounts.filter(d => d.status !== "active").map((discount) => (
                      <div key={discount.id} className="flex items-center justify-between p-3 bg-foreground/[0.04] rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{discount.customer_name}</p>
                          <p className="text-sm text-foreground/60">
                            {discount.discount_code 
                              ? `Code: ${discount.discount_code}` 
                              : `${discount.custom_discount_type === "percentage" ? `${discount.custom_discount_value}%` : `$${discount.custom_discount_value}`} off`
                            }
                          </p>
                        </div>
                        <Badge className={cn(
                          "rounded-full",
                          discount.status === "used" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                          discount.status === "expired" && "bg-gray-500/20 text-muted-foreground border-border",
                          discount.status === "removed" && "bg-red-500/20 text-red-400 border-red-500/30",
                        )}>
                          {discount.status}
                        </Badge>
                      </div>
                    ))}
                    {assignedDiscounts.filter(d => d.status !== "active").length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No history yet</p>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Assign Discount View */}
          {viewMode === "assign-discount" && selectedCustomer && (
            <motion.div
              key="assign-discount"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => {
                      setViewMode("discounts")
                      setSelectedCustomer(null)
                    }} 
                    variant="ghost" 
                    className="h-11 w-11 rounded-full hover:bg-foreground/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground">Assign Discount</h2>
                    <p className="text-xl text-foreground/60">to {selectedCustomer.name}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSaveAssignment}
                  disabled={isSaving}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-medium"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Assign Discount
                    </>
                  )}
                </Button>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-6">
                  {/* Discount Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm text-foreground/60">Discount Type</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setNewDiscount({ ...newDiscount, type: "custom" })}
                        className={cn(
                          "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2",
                          newDiscount.type === "custom"
                            ? "bg-foreground/10 border-border"
                            : "bg-foreground/5 border-border hover:bg-foreground/10"
                        )}
                      >
                        <Percent className="w-5 h-5" />
                        Custom Discount
                      </button>
                      <button
                        onClick={() => setNewDiscount({ ...newDiscount, type: "code" })}
                        className={cn(
                          "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2",
                          newDiscount.type === "code"
                            ? "bg-foreground/10 border-border"
                            : "bg-foreground/5 border-border hover:bg-foreground/10"
                        )}
                      >
                        <Ticket className="w-5 h-5" />
                        Use Existing Code
                      </button>
                    </div>
                  </div>

                  {newDiscount.type === "custom" ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Amount Type</label>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setNewDiscount({ ...newDiscount, customDiscountType: "percentage" })}
                              className={cn(
                                "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2",
                                newDiscount.customDiscountType === "percentage"
                                  ? "bg-foreground/10 border-border"
                                  : "bg-foreground/5 border-border hover:bg-foreground/10"
                              )}
                            >
                              <Percent className="w-4 h-4" />
                              %
                            </button>
                            <button
                              onClick={() => setNewDiscount({ ...newDiscount, customDiscountType: "fixed" })}
                              className={cn(
                                "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2",
                                newDiscount.customDiscountType === "fixed"
                                  ? "bg-foreground/10 border-border"
                                  : "bg-foreground/5 border-border hover:bg-foreground/10"
                              )}
                            >
                              <DollarSign className="w-4 h-4" />
                              $
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Value</label>
                          <Input
                            type="number"
                            value={newDiscount.customDiscountValue || ""}
                            onChange={(e) => setNewDiscount({ 
                              ...newDiscount, 
                              customDiscountValue: parseFloat(e.target.value) || 0 
                            })}
                            placeholder={newDiscount.customDiscountType === "percentage" ? "10" : "50.00"}
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-foreground/60">Description (shown to customer)</label>
                        <Input
                          value={newDiscount.customDescription}
                          onChange={(e) => setNewDiscount({ ...newDiscount, customDescription: e.target.value })}
                          placeholder="Special loyalty discount"
                          className="h-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm text-foreground/60">Select Discount Code</label>
                      <select
                        value={newDiscount.discountCodeId || ""}
                        onChange={(e) => setNewDiscount({ ...newDiscount, discountCodeId: e.target.value })}
                        className="w-full h-12 px-4 bg-foreground/5 border border-border rounded-xl text-foreground"
                      >
                        <option value="">Select a code...</option>
                        {discountCodes.filter(c => c.is_active).map((code) => (
                          <option key={code.id} value={code.id}>
                            {code.code} - {code.discount_type === "percentage" ? `${code.discount_value}%` : code.discount_type === "set_price" ? "Custom pricing" : `$${code.discount_value}`} off
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-foreground/60">Expires (optional)</label>
                      <Input
                        type="date"
                        value={newDiscount.expiresAt}
                        onChange={(e) => setNewDiscount({ ...newDiscount, expiresAt: e.target.value })}
                        className="h-12 bg-foreground/5 border-border rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-foreground/60">Notes</label>
                      <Input
                        value={newDiscount.notes}
                        onChange={(e) => setNewDiscount({ ...newDiscount, notes: e.target.value })}
                        placeholder="Internal notes..."
                        className="h-12 bg-foreground/5 border-border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-amber-400 text-sm">
                      <strong>How it works:</strong> This discount will automatically appear on {selectedCustomer.name}'s next order. 
                      They won't need to enter a code.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
