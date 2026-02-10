"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Ticket,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Percent,
  DollarSign,
  Users,
  Copy,
  Check,
  TrendingUp,
  ChevronRight,
  Tag,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  getDiscountCodes,
  getDiscountUsage,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  toggleDiscountCodeStatus,
  getDiscountCodeProducts,
  bulkUpdateDiscountCodeProducts,
  getAllProducts,
  getReps,
  getRepProductPricing,
  bulkUpdateRepProductPricing,
  toggleRepDiscountPermission,
  getAllCustomers,
  getAllAssignedDiscounts,
  adminAssignDiscountToCustomer,
  adminRemoveAssignedDiscount,
  type DiscountCode,
  type DiscountUsage,
  type DiscountCodeProduct,
  type Rep,
  type Customer,
  type CustomerAssignedDiscount,
} from "@/app/actions/discounts"
import { useAuthStore } from "@/store/authStore"
import { format } from "date-fns"

type ViewMode = "list" | "detail" | "create" | "rep-pricing" | "customer-discounts" | "assign-discount"
type PricingMode = "code" | "rep"

export default function DiscountsPage() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null)
  const [usageHistory, setUsageHistory] = useState<DiscountUsage[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // State for the code being edited or created
  const [editingCode, setEditingCode] = useState<Partial<DiscountCode> | null>(null)
  const [saving, setSaving] = useState(false)

  // Product pricing state
  const [allProducts, setAllProducts] = useState<
    Array<{
      id: string
      name: string
      base_name: string
      variant: string | null
      retail_price: number
      color: string
    }>
  >([])
  const [productPrices, setProductPrices] = useState<Record<string, number | null>>({})
  const [existingPricing, setExistingPricing] = useState<DiscountCodeProduct[]>([])

  // Rep pricing state
  const [reps, setReps] = useState<Rep[]>([])
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null)
  const [repProductPrices, setRepProductPrices] = useState<Record<string, number | null>>({})

  // Temporary state to hold form data
  const [formData, setFormData] = useState<Partial<DiscountCode> | null>(null)

  // Customer discount assignment state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [assignedDiscounts, setAssignedDiscounts] = useState<CustomerAssignedDiscount[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState("")
  const [newCustomerDiscount, setNewCustomerDiscount] = useState<{
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

  const { user } = useAuthStore()

  useEffect(() => {
    loadDiscountCodes()
    loadAllProducts()
    loadReps()
    loadCustomers()
    loadAssignedDiscounts()
  }, [])

  useEffect(() => {
    // If editingCode is set, update the specific fields that were previously in formData
    if (editingCode) {
      setFormData(editingCode)
    }
  }, [editingCode])

  async function loadDiscountCodes() {
    setIsLoading(true)
    const codes = await getDiscountCodes()
    setDiscountCodes(codes)
    setIsLoading(false)
  }

  async function loadAllProducts() {
    const products = await getAllProducts()
    setAllProducts(products)
  }

  async function loadReps() {
    const repsList = await getReps()
    setReps(repsList)
  }

  async function loadCustomers() {
    const customersList = await getAllCustomers()
    setCustomers(customersList)
  }

  async function loadAssignedDiscounts() {
    const discounts = await getAllAssignedDiscounts()
    setAssignedDiscounts(discounts)
  }

  async function loadUsageHistory(codeId: string) {
    const usage = await getDiscountUsage(codeId)
    setUsageHistory(usage)
  }

  async function loadProductPricing(codeId: string) {
    const pricing = await getDiscountCodeProducts(codeId)
    setExistingPricing(pricing)
    // Convert to price map
    const priceMap: Record<string, number | null> = {}
    pricing.forEach((p) => {
      priceMap[p.product_id] = p.custom_price
    })
    setProductPrices(priceMap)
  }

  async function loadRepProductPricing(repId: string) {
    const pricing = await getRepProductPricing(repId)
    const priceMap: Record<string, number | null> = {}
    pricing.forEach((p) => {
      priceMap[p.product_id] = p.custom_price
    })
    setRepProductPrices(priceMap)
  }

  function handleSelectCode(code: DiscountCode) {
    setSelectedCode(code)
    setEditingCode(code) // Use editingCode state for editing
    setViewMode("detail")
    setProductPrices({})
    loadUsageHistory(code.id)
    loadProductPricing(code.id)
  }

  function handleSelectRep(rep: Rep) {
    setSelectedRep(rep)
    setViewMode("rep-pricing")
    setRepProductPrices({})
    loadRepProductPricing(rep.id)
  }

  function handleCreateNew() {
    setSelectedCode(null)
    setEditingCode({
      code: "", // Will be generated on save or on click
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_amount: 0,
      max_uses: null,
      customer_type: "all",
      valid_from: null,
      valid_until: null,
      is_active: true,
      free_shipping: false,
    })
    setViewMode("create")
    setProductPrices({})
    setExistingPricing([])
  }

  function handleBack() {
    if (viewMode === "assign-discount") {
      setViewMode("customer-discounts")
      setSelectedCustomer(null)
      setNewCustomerDiscount({
        type: "custom",
        customDiscountType: "percentage",
        customDiscountValue: 10,
        customDescription: "",
        expiresAt: "",
        notes: "",
      })
    } else {
      setViewMode("list")
      setSelectedCode(null)
      setSelectedRep(null)
      setEditingCode(null)
      setProductPrices({})
      setRepProductPrices({})
    }
  }

  function handleAssignCustomerDiscount(customer: Customer) {
    setSelectedCustomer(customer)
    setNewCustomerDiscount({
      type: "custom",
      customDiscountType: "percentage",
      customDiscountValue: 10,
      customDescription: "",
      expiresAt: "",
      notes: "",
    })
    setViewMode("assign-discount")
  }

  async function handleSaveCustomerDiscount() {
    // Get user ID from auth store or fetch from Supabase
    let userId = user?.id
    
    if (!userId) {
      // Fallback: get user from Supabase session
      const supabase = (await import("@/lib/supabase-client")).supabase
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Get the user's database ID from their auth ID
        const { data: profile } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", authUser.id)
          .single()
        
        userId = profile?.id
      }
    }
    
    console.log("[Admin] handleSaveCustomerDiscount called", { 
      userId, 
      selectedCustomer, 
      newCustomerDiscount 
    })
    
    if (!userId) {
      console.log("[Admin] No user ID found")
      alert("You must be logged in to assign discounts. Please refresh the page.")
      return
    }
    
    if (!selectedCustomer) {
      console.log("[Admin] No customer selected")
      alert("No customer selected")
      return
    }
    
    setIsSaving(true)

    try {
      console.log("[Admin] Calling adminAssignDiscountToCustomer...")
      const result = await adminAssignDiscountToCustomer(userId, selectedCustomer.id, {
        discountCodeId: newCustomerDiscount.type === "code" ? newCustomerDiscount.discountCodeId : undefined,
        customDiscountType: newCustomerDiscount.type === "custom" ? newCustomerDiscount.customDiscountType : undefined,
        customDiscountValue: newCustomerDiscount.type === "custom" ? newCustomerDiscount.customDiscountValue : undefined,
        customDescription: newCustomerDiscount.customDescription || undefined,
        expiresAt: newCustomerDiscount.expiresAt || undefined,
        notes: newCustomerDiscount.notes || undefined,
      })
      
      console.log("[Admin] Result:", result)

      if (result.success) {
        await loadAssignedDiscounts()
        setViewMode("customer-discounts")
        setSelectedCustomer(null)
      } else {
        alert(result.error || "Failed to assign discount")
      }
    } catch (error) {
      console.error("[Admin] Error assigning discount:", error)
      alert("Error: " + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemoveCustomerDiscount(assignmentId: string) {
    if (!user?.id) return
    const confirmed = window.confirm("Remove this discount from the customer?")
    if (!confirmed) return

    const result = await adminRemoveAssignedDiscount(user.id, assignmentId)
    if (result.success) {
      await loadAssignedDiscounts()
    } else {
      alert(result.error || "Failed to remove discount")
    }
  }

  // Filter customers by search
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  )

  async function handleSaveCode() {
    if (!editingCode) return
    setSaving(true)

    try {
      if (viewMode === "create") {
        // Ensure code is generated if empty
        if (!editingCode.code) {
          editingCode.code = `${["SAVE", "DEAL", "VIP", "PROMO"][Math.floor(Math.random() * 4)]}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        }

        const newCode = await createDiscountCode(
          editingCode as Omit<DiscountCode, "id" | "created_at" | "updated_at" | "current_uses">,
        )
        if (newCode) {
          const pricingUpdates = Object.entries(productPrices)
            .filter(([_, price]) => price !== null && price >= 0) // Allow 0 price
            .map(([productId, customPrice]) => ({ productId, customPrice }))

          if (pricingUpdates.length > 0) {
            await bulkUpdateDiscountCodeProducts(newCode.id, pricingUpdates)
          }

          await loadDiscountCodes()
          setViewMode("list")
          setEditingCode(null) // Clear editing state
        }
      } else if (selectedCode && editingCode) {
        await updateDiscountCode(selectedCode.id, editingCode)

        const pricingUpdates = Object.entries(productPrices).map(([productId, customPrice]) => ({
          productId,
          customPrice,
        }))
        await bulkUpdateDiscountCodeProducts(selectedCode.id, pricingUpdates)

        await loadDiscountCodes()
        // Optionally stay in detail view or go back to list
        // setViewMode("list")
        // setEditingCode(null)
      }
    } catch (error) {
      console.error("Failed to save code:", error)
      // Optionally show an error message to the user
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveRepPricing() {
    if (!selectedRep) return
    setIsSaving(true)

    const pricingUpdates = Object.entries(repProductPrices).map(([productId, customPrice]) => ({
      productId,
      customPrice,
    }))
    await bulkUpdateRepProductPricing(selectedRep.id, pricingUpdates)

    setIsSaving(false)
  }

  async function handleDelete() {
    if (!selectedCode) return
    const confirmed = window.confirm("Are you sure you want to delete this discount code?")
    if (confirmed) {
      await deleteDiscountCode(selectedCode.id)
      await loadDiscountCodes()
      handleBack()
    }
  }

  async function handleToggleStatus(code: DiscountCode) {
    await toggleDiscountCodeStatus(code.id, !code.is_active)
    await loadDiscountCodes()
  }

  function copyToClipboard(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const activeCodesCount = discountCodes.filter((c) => c.is_active).length
  const totalUsage = discountCodes.reduce((sum, c) => sum + c.current_uses, 0)

  // Group products by base_name for display
  const groupedProducts = allProducts.reduce(
    (acc, product) => {
      if (!acc[product.base_name]) {
        acc[product.base_name] = []
      }
      acc[product.base_name].push(product)
      return acc
    },
    {} as Record<string, typeof allProducts>,
  )

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
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
                  <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Discount Codes</h1>
                  <p className="text-xl text-muted-foreground">Manage promotional codes and rep pricing.</p>
                </div>
                <Button
                  onClick={handleCreateNew}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Code
                </Button>
              </div>

              {/* Stats */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Codes</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{activeCodesCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{totalUsage}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Codes</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{discountCodes.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rep Pricing Section */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rep Management</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
                        <UserCheck className="h-7 w-7 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">Rep Pricing & Permissions</h3>
                        <p className="text-muted-foreground">Assign automatic pricing and control rep discount code creation</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {reps.map((rep) => (
                        <div
                          key={rep.id}
                          className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-5 transition-all hover:bg-foreground/[0.08] hover:border-border"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              onClick={() => handleSelectRep(rep)}
                              className="flex-1 text-left hover:opacity-80 transition-opacity"
                            >
                              <p className="font-semibold text-foreground">
                                {rep.first_name} {rep.last_name}
                              </p>
                              <p className="text-muted-foreground text-sm">{rep.email}</p>
                            </button>
                            <ChevronRight 
                              onClick={() => handleSelectRep(rep)}
                              className="w-5 h-5 text-muted-foreground group-hover:text-foreground/60 transition-colors cursor-pointer flex-shrink-0 mt-1" 
                            />
                          </div>
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">Can Create Codes</p>
                                <p className="text-xs text-muted-foreground">Allow discount code creation</p>
                              </div>
                              <Switch
                                checked={rep.can_create_discount_codes || false}
                                onCheckedChange={async (checked) => {
                                  await toggleRepDiscountPermission(rep.id, checked)
                                  await loadReps()
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {reps.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No reps found</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Customer Assigned Discounts Section */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Customer Assignments</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center">
                          <Users className="h-7 w-7 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold tracking-tight text-foreground">Customer Discounts</h3>
                          <p className="text-muted-foreground">Auto-apply discounts to customer's next order</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setViewMode("customer-discounts")}
                        className="h-11 px-5 bg-foreground/10 hover:bg-foreground/20 rounded-xl font-medium"
                      >
                        Manage All
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    {/* Active discounts preview */}
                    <div className="space-y-3">
                      {assignedDiscounts.filter(d => d.status === "active").slice(0, 3).map((discount) => (
                        <div key={discount.id} className="flex items-center justify-between p-4 bg-foreground/5 border border-border rounded-2xl">
                          <div>
                            <p className="font-semibold text-foreground">{discount.customer_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {discount.discount_code 
                                ? `Code: ${discount.discount_code}` 
                                : `${discount.custom_discount_type === "percentage" ? `${discount.custom_discount_value}%` : `$${discount.custom_discount_value}`} off`
                              }
                            </p>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                            Active
                          </Badge>
                        </div>
                      ))}
                      {assignedDiscounts.filter(d => d.status === "active").length === 0 && (
                        <p className="text-muted-foreground text-center py-6">No active customer discounts</p>
                      )}
                      {assignedDiscounts.filter(d => d.status === "active").length > 3 && (
                        <button
                          onClick={() => setViewMode("customer-discounts")}
                          className="w-full text-center text-muted-foreground hover:text-foreground text-sm py-3 transition-colors"
                        >
                          View all {assignedDiscounts.filter(d => d.status === "active").length} active discounts →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Discount Codes List */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">All Discount Codes</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-2xl border border-border bg-foreground/5 p-6 animate-pulse">
                        <div className="h-6 bg-foreground/10 rounded w-1/3 mb-2" />
                        <div className="h-4 bg-foreground/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : discountCodes.length === 0 ? (
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10">
                      <div className="h-16 w-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg">No discount codes yet</p>
                      <Button
                        onClick={handleCreateNew}
                        className="mt-6 h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                      >
                        Create Your First Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {discountCodes.map((code) => (
                      <motion.div
                        key={code.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all cursor-pointer hover:bg-foreground/[0.08] hover:border-border"
                        onClick={() => handleSelectCode(code)}
                      >
                        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center border",
                                code.discount_type === "percentage" 
                                  ? "bg-blue-500/20 border-blue-500/20" 
                                  : code.discount_type === "set_price"
                                  ? "bg-purple-500/20 border-purple-500/20"
                                  : "bg-emerald-500/20 border-emerald-500/20",
                              )}
                            >
                              {code.discount_type === "percentage" ? (
                                <Percent className="h-7 w-7 text-blue-400" />
                              ) : code.discount_type === "set_price" ? (
                                <Tag className="h-7 w-7 text-purple-400" />
                              ) : (
                                <DollarSign className="h-7 w-7 text-emerald-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xl font-bold tracking-wider text-foreground">{code.code}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(code.code)
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
                                >
                                  {copiedCode === code.code ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                              <p className="text-muted-foreground text-sm mt-1">
                                {code.discount_type === "percentage"
                                  ? `${code.discount_value}% off`
                                  : code.discount_type === "set_price"
                                  ? "Custom pricing"
                                  : `$${code.discount_value} off`}
                                {code.description && ` • ${code.description}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{code.current_uses} uses</span>
                            </div>
                            <Badge
                              className={cn(
                                "rounded-full px-3 py-1",
                                code.is_active
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-foreground/10 text-muted-foreground border-border",
                              )}
                            >
                              {code.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground/60 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : viewMode === "rep-pricing" && selectedRep ? (
            <motion.div
              key="rep-pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleBack} 
                    className="h-12 w-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                      {selectedRep.first_name} {selectedRep.last_name}
                    </h1>
                    <p className="text-xl text-muted-foreground">{selectedRep.email}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSaveRepPricing}
                  disabled={isSaving}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold w-full md:w-auto"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Pricing
                    </>
                  )}
                </Button>
              </div>

              {/* Info Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <p className="relative z-10 text-amber-400">
                  <strong>Rep Pricing:</strong> Customers assigned to this rep will automatically see these custom
                  prices without needing a discount code.
                </p>
              </div>

              {/* Product Pricing Table */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Product Pricing</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="p-6 border-b border-border">
                      <h3 className="text-xl font-bold text-foreground">Custom Prices</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Set custom prices for each product. Leave blank to use regular pricing.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-foreground/20">
                            <th className="text-left p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Product</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Variant</th>
                            <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Retail Price</th>
                            <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Custom Price</th>
                            <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Discount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupedProducts).map(([baseName, products]) =>
                            products.map((product, idx) => (
                              <tr
                                key={product.id}
                                className={cn(
                                  "border-b border-border hover:bg-foreground/5 transition-colors",
                                  idx === 0 && "border-t border-border",
                                )}
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-3 h-3 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: product.color || "#888" }}
                                    />
                                    <span className="font-medium text-foreground">{product.base_name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground">{product.variant || "—"}</td>
                                <td className="p-4 text-right text-muted-foreground">
                                  ${Number(product.retail_price || 0).toFixed(2)}
                                </td>
                                <td className="p-4 text-right">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="—"
                                    value={repProductPrices[product.id] ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value ? Number.parseFloat(e.target.value) : null
                                      setRepProductPrices((prev) => ({
                                        ...prev,
                                        [product.id]: value,
                                      }))
                                    }}
                                    className="w-28 h-10 bg-foreground/5 border-border rounded-xl text-right ml-auto"
                                  />
                                </td>
                                <td className="p-4 text-right">
                                  {repProductPrices[product.id] && product.retail_price ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                      {Math.round((1 - repProductPrices[product.id]! / product.retail_price) * 100)}% off
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              </tr>
                            )),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (viewMode === "detail" || viewMode === "create") && editingCode ? (
            <motion.div
              key="detail-or-create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleBack} 
                    className="h-12 w-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                      {viewMode === "create" ? "Create Discount Code" : editingCode.code}
                    </h1>
                    {viewMode !== "create" && selectedCode && (
                      <p className="text-xl text-muted-foreground">{selectedCode.current_uses || 0} uses</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {viewMode !== "create" && selectedCode && (
                    <button
                      onClick={handleDelete}
                      className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <Button
                    onClick={handleSaveCode}
                    disabled={saving}
                    className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {viewMode === "create" ? "Create Code" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Combined Code Details and Pricing */}
              <div className="space-y-8">
                {/* Code Details Card */}
                <section className="space-y-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Code Details</h2>
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 space-y-6">

                      {/* Code Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Code</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            value={editingCode.code || ""}
                            onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value.toUpperCase() })}
                            placeholder="SUMMER20"
                            className="h-14 bg-foreground/5 border-border rounded-xl font-mono text-lg tracking-wider flex-1"
                          />
                          <Button
                            onClick={() =>
                              setEditingCode({
                                ...editingCode,
                                code: `${["SAVE", "DEAL", "VIP", "PROMO"][Math.floor(Math.random() * 4)]}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                              })
                            }
                            variant="ghost"
                            className="h-14 px-6 rounded-xl bg-foreground/5 border border-border hover:bg-foreground/10"
                          >
                            Generate
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Description</label>
                        <Textarea
                          value={editingCode.description || ""}
                          onChange={(e) => setEditingCode({ ...editingCode, description: e.target.value })}
                          placeholder="Summer sale promotion..."
                          className="bg-foreground/5 border-border rounded-xl resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Discount Type</label>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setEditingCode({ ...editingCode, discount_type: "percentage" })}
                              className={cn(
                                "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 text-base font-medium",
                                editingCode.discount_type === "percentage"
                                  ? "bg-foreground/10 border-border text-foreground"
                                  : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                              )}
                            >
                              <Percent className="w-5 h-5" />
                              <span className="hidden sm:inline">Percent</span>
                            </button>
                            <button
                              onClick={() => setEditingCode({ ...editingCode, discount_type: "fixed" })}
                              className={cn(
                                "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 text-base font-medium",
                                editingCode.discount_type === "fixed"
                                  ? "bg-foreground/10 border-border text-foreground"
                                  : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                              )}
                            >
                              <DollarSign className="w-5 h-5" />
                              <span className="hidden sm:inline">Fixed</span>
                            </button>
                            <button
                              onClick={() => setEditingCode({ ...editingCode, discount_type: "set_price", discount_value: 0 })}
                              className={cn(
                                "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 text-base font-medium",
                                editingCode.discount_type === "set_price"
                                  ? "bg-foreground/10 border-border text-foreground"
                                  : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                              )}
                            >
                              <Tag className="w-5 h-5" />
                              <span className="hidden sm:inline">Set Price</span>
                            </button>
                          </div>
                          {editingCode.discount_type === "set_price" && (
                            <p className="text-sm text-amber-400 mt-2">
                              Set custom prices for each product below. No additional discount will be applied.
                            </p>
                          )}
                        </div>
                        {editingCode.discount_type !== "set_price" && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Value</label>
                            <Input
                              type="number"
                              value={editingCode.discount_value || ""}
                              onChange={(e) =>
                                setEditingCode({ ...editingCode, discount_value: Number.parseFloat(e.target.value) || 0 })
                              }
                              placeholder={editingCode.discount_type === "percentage" ? "20" : "50.00"}
                              className="h-14 bg-foreground/5 border-border rounded-xl text-lg"
                            />
                          </div>
                        )}
                      </div>

                      {/* Min Order & Max Uses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Min Order ($)</label>
                          <Input
                            type="number"
                            value={editingCode.min_order_amount || ""}
                            onChange={(e) =>
                              setEditingCode({ ...editingCode, min_order_amount: Number.parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0"
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Max Uses</label>
                          <Input
                            type="number"
                            value={editingCode.max_uses || ""}
                            onChange={(e) =>
                              setEditingCode({ ...editingCode, max_uses: Number.parseInt(e.target.value) || null })
                            }
                            placeholder="Unlimited"
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Customer Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Customer Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["all", "retail", "b2b", "b2bvip"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setEditingCode({ ...editingCode, customer_type: type as any })}
                              className={cn(
                                "h-11 rounded-xl border text-sm font-medium transition-all capitalize",
                                editingCode.customer_type === type
                                  ? "bg-foreground/10 border-border text-foreground"
                                  : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Valid From</label>
                          <Input
                            type="date"
                            value={editingCode.valid_from?.split("T")[0] || ""}
                            onChange={(e) => setEditingCode({ ...editingCode, valid_from: e.target.value || null })}
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Valid Until</label>
                          <Input
                            type="date"
                            value={editingCode.valid_until?.split("T")[0] || ""}
                            onChange={(e) => setEditingCode({ ...editingCode, valid_until: e.target.value || null })}
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                          <div>
                            <p className="font-semibold text-foreground">Active</p>
                            <p className="text-sm text-muted-foreground">Code can be used</p>
                          </div>
                          <Switch
                            checked={editingCode.is_active || false}
                            onCheckedChange={(checked) => setEditingCode({ ...editingCode, is_active: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                          <div>
                            <p className="font-semibold text-foreground">Free Shipping</p>
                            <p className="text-sm text-muted-foreground">Waive shipping costs</p>
                          </div>
                          <Switch
                            checked={editingCode.free_shipping || false}
                            onCheckedChange={(checked) => setEditingCode({ ...editingCode, free_shipping: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Usage History (only in edit mode) */}
                {viewMode === "detail" && selectedCode && (
                  <section className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Usage History</h2>
                    <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                      <div className="relative z-10">
                        {usageHistory.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No usage yet</p>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {usageHistory.map((usage) => (
                              <div key={usage.id} className="flex items-center justify-between p-4 bg-foreground/5 border border-border rounded-2xl">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {usage.customer?.user?.first_name} {usage.customer?.user?.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{new Date(usage.used_at).toLocaleDateString()}</p>
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                  -${Number(usage.discount_amount || 0).toFixed(2)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Product Pricing Table */}
                <section className="space-y-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Product Pricing</h2>
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10">
                      <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-bold text-foreground">Custom Prices</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          Set custom prices for products when this code is applied. Leave blank for standard discount.
                        </p>
                      </div>
                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-background/80 backdrop-blur-xl">
                            <tr className="border-b border-border">
                              <th className="text-left p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Product</th>
                              <th className="text-left p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Variant</th>
                              <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Retail</th>
                              <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Custom Price</th>
                              <th className="text-right p-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">Discount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(groupedProducts).map(([baseName, products]) =>
                              products.map((product, idx) => (
                                <tr
                                  key={product.id}
                                  className={cn(
                                    "border-b border-border hover:bg-foreground/5 transition-colors",
                                    idx === 0 && "border-t border-border",
                                  )}
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: product.color || "#888" }}
                                      />
                                      <span className="font-medium text-foreground">{product.base_name}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-muted-foreground">{product.variant || "—"}</td>
                                  <td className="p-4 text-right text-muted-foreground">
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
                                        const value = e.target.value ? Number.parseFloat(e.target.value) : null
                                        setProductPrices((prev) => ({
                                          ...prev,
                                          [product.id]: value,
                                        }))
                                      }}
                                      className="w-28 h-10 bg-foreground/5 border-border rounded-xl text-right ml-auto"
                                    />
                                  </td>
                                  <td className="p-4 text-right">
                                    {productPrices[product.id] && product.retail_price ? (
                                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                        {Math.round((1 - productPrices[product.id]! / product.retail_price) * 100)}% off
                                      </Badge>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )}
                                  </td>
                                </tr>
                              )),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : viewMode === "customer-discounts" ? (
            <motion.div
              key="customer-discounts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleBack} 
                    className="h-12 w-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">Customer Discounts</h1>
                    <p className="text-xl text-muted-foreground">Assign discounts that auto-apply at checkout</p>
                  </div>
                </div>
              </div>

              {/* Search Customers */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Assign New Discount</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <input
                        type="text"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        placeholder="Search customers by name or email..."
                        className="w-full h-14 pl-5 pr-5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground text-lg"
                      />
                    </div>
                    
                    {customerSearchQuery && (
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        {filteredCustomers.slice(0, 10).map((customer) => {
                          const hasActiveDiscount = assignedDiscounts.some(d => d.customer_id === customer.id && d.status === "active")
                          return (
                            <button
                              key={customer.id}
                              onClick={() => !hasActiveDiscount && handleAssignCustomerDiscount(customer)}
                              disabled={hasActiveDiscount}
                              className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all border",
                                hasActiveDiscount 
                                  ? "bg-foreground/5 border-border opacity-50 cursor-not-allowed"
                                  : "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                              )}
                            >
                              <div>
                                <p className="font-semibold text-foreground">{customer.name}</p>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
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
                        {filteredCustomers.length === 0 && (
                          <p className="text-muted-foreground text-center py-6">No customers found</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Active Discounts */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Discounts</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-4">
                    {assignedDiscounts.filter(d => d.status === "active").map((discount) => (
                      <div key={discount.id} className="flex items-center justify-between p-5 bg-foreground/5 border border-border rounded-2xl">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-foreground">{discount.customer_name}</p>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full text-xs">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {discount.discount_code 
                              ? `Code: ${discount.discount_code}` 
                              : `${discount.custom_discount_type === "percentage" ? `${discount.custom_discount_value}%` : `$${discount.custom_discount_value}`} off`
                            }
                            {discount.custom_description && ` • ${discount.custom_description}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Assigned {format(new Date(discount.created_at), "MMM d, yyyy")}
                            {discount.assigned_by_rep_name && ` by ${discount.assigned_by_rep_name}`}
                            {discount.assigned_by_admin_name && ` by ${discount.assigned_by_admin_name}`}
                            {discount.expires_at && ` • Expires ${format(new Date(discount.expires_at), "MMM d, yyyy")}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveCustomerDiscount(discount.id)}
                          className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {assignedDiscounts.filter(d => d.status === "active").length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No active customer discounts</p>
                    )}
                  </div>
                </div>
              </section>

              {/* History */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">History</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-3 max-h-72 overflow-y-auto">
                    {assignedDiscounts.filter(d => d.status !== "active").map((discount) => (
                      <div key={discount.id} className="flex items-center justify-between p-4 bg-foreground/5 border border-border rounded-2xl">
                        <div>
                          <p className="font-semibold text-foreground">{discount.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {discount.discount_code 
                              ? `Code: ${discount.discount_code}` 
                              : `${discount.custom_discount_type === "percentage" ? `${discount.custom_discount_value}%` : `$${discount.custom_discount_value}`} off`
                            }
                          </p>
                        </div>
                        <Badge className={cn(
                          "rounded-full capitalize",
                          discount.status === "used" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                          discount.status === "expired" && "bg-gray-500/20 text-muted-foreground border-border",
                          discount.status === "removed" && "bg-red-500/20 text-red-400 border-red-500/30",
                        )}>
                          {discount.status}
                        </Badge>
                      </div>
                    ))}
                    {assignedDiscounts.filter(d => d.status !== "active").length === 0 && (
                      <p className="text-muted-foreground text-center py-6">No history yet</p>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          ) : viewMode === "assign-discount" && selectedCustomer ? (
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
                  <button 
                    onClick={handleBack} 
                    className="h-12 w-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">Assign Discount</h1>
                    <p className="text-xl text-muted-foreground">to {selectedCustomer.name} ({selectedCustomer.email})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log("[Admin] Assign discount button clicked!")
                    handleSaveCustomerDiscount()
                  }}
                  disabled={isSaving}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 w-full md:w-auto justify-center"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Assign Discount
                    </>
                  )}
                </button>
              </div>

              {/* Discount Type Selection */}
              <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Discount Configuration</h2>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Discount Type</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setNewCustomerDiscount({ ...newCustomerDiscount, type: "custom" })}
                          className={cn(
                            "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                            newCustomerDiscount.type === "custom"
                              ? "bg-foreground/10 border-border text-foreground"
                              : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                          )}
                        >
                          <Percent className="w-5 h-5" />
                          Custom Discount
                        </button>
                        <button
                          onClick={() => setNewCustomerDiscount({ ...newCustomerDiscount, type: "code" })}
                          className={cn(
                            "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                            newCustomerDiscount.type === "code"
                              ? "bg-foreground/10 border-border text-foreground"
                              : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                          )}
                        >
                          <Ticket className="w-5 h-5" />
                          Use Existing Code
                        </button>
                      </div>
                    </div>

                    {newCustomerDiscount.type === "custom" ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Discount Amount Type</label>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setNewCustomerDiscount({ ...newCustomerDiscount, customDiscountType: "percentage" })}
                                className={cn(
                                  "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                                  newCustomerDiscount.customDiscountType === "percentage"
                                    ? "bg-foreground/10 border-border text-foreground"
                                    : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                                )}
                              >
                                <Percent className="w-4 h-4" />
                                %
                              </button>
                              <button
                                onClick={() => setNewCustomerDiscount({ ...newCustomerDiscount, customDiscountType: "fixed" })}
                                className={cn(
                                  "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                                  newCustomerDiscount.customDiscountType === "fixed"
                                    ? "bg-foreground/10 border-border text-foreground"
                                    : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                                )}
                              >
                                <DollarSign className="w-4 h-4" />
                                $
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Value</label>
                            <Input
                              type="number"
                              value={newCustomerDiscount.customDiscountValue || ""}
                              onChange={(e) => setNewCustomerDiscount({ 
                                ...newCustomerDiscount, 
                                customDiscountValue: parseFloat(e.target.value) || 0 
                              })}
                              placeholder={newCustomerDiscount.customDiscountType === "percentage" ? "10" : "50.00"}
                              className="h-12 bg-foreground/5 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Description (shown to customer)</label>
                          <Input
                            value={newCustomerDiscount.customDescription}
                            onChange={(e) => setNewCustomerDiscount({ ...newCustomerDiscount, customDescription: e.target.value })}
                            placeholder="Special loyalty discount"
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Select Discount Code</label>
                        <select
                          value={newCustomerDiscount.discountCodeId || ""}
                          onChange={(e) => setNewCustomerDiscount({ ...newCustomerDiscount, discountCodeId: e.target.value })}
                          className="w-full h-12 px-4 bg-foreground/5 border border-border rounded-xl text-foreground"
                        >
                          <option value="">Select a code...</option>
                          {discountCodes.filter(c => c.is_active).map((code) => (
                            <option key={code.id} value={code.id}>
                              {code.code} - {code.discount_type === "percentage" ? `${code.discount_value}%` : `$${code.discount_value}`} off
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Expires (optional)</label>
                        <Input
                          type="date"
                          value={newCustomerDiscount.expiresAt}
                          onChange={(e) => setNewCustomerDiscount({ ...newCustomerDiscount, expiresAt: e.target.value })}
                          className="h-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Internal Notes</label>
                        <Input
                          value={newCustomerDiscount.notes}
                          onChange={(e) => setNewCustomerDiscount({ ...newCustomerDiscount, notes: e.target.value })}
                          placeholder="For internal reference..."
                          className="h-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                      <p className="relative z-10 text-amber-400 text-sm">
                        <strong>How it works:</strong> This discount will automatically appear on the customer's next order at checkout. 
                        They won't need to enter a code. The discount will be removed after they complete an order, or when it expires.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
