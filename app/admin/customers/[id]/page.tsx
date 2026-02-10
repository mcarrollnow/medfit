"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  MessageSquare,
  Package,
  Ticket,
  Wallet,
  UserCog,
  Send,
  DollarSign,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Gift,
  Percent,
  Trash2,
  Plus,
  UserPlus,
  Copy,
  Share2,
  Sparkles,
  Edit2,
  RefreshCw,
} from "lucide-react"
import {
  getCustomerDetailData,
  getCustomerById,
  getCustomerOrders,
  updateCustomer,
  assignRepToCustomer,
  assignWalletToCustomer,
  updateCustomerRewardPoints,
  type Customer,
  type Rep,
  type BusinessWallet,
  type Order,
  type SupportTicket,
} from "@/app/actions/customers"
import { AdminOrderCard } from "@/components/admin/admin-order-card"
import {
  adminAssignDiscountToCustomer,
  adminRemoveAssignedDiscount,
  type DiscountCode,
} from "@/app/actions/discounts"
import { promoteCustomerToRep } from "@/app/actions/rep-management"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { generateReferralCode, applyReferralToCustomer, validateReferralCode, updateReferralCode } from "@/app/actions/referrals"

const typeLabels: Record<string, string> = {
  retail: "Retail",
  b2b: "B2B",
  b2bvip: "B2B VIP",
}

type ActiveTab = "profile" | "orders" | "support" | "discounts"

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
  assigned_by_admin_id: string | null
  assigned_by_rep_id: string | null
}

export default function CustomerDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ""
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile")
  const [smsOpen, setSmsOpen] = useState(false)
  const [smsMessage, setSmsMessage] = useState("")
  const [sendingSms, setSendingSms] = useState(false)
  const [loading, setLoading] = useState(true)

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [reps, setReps] = useState<Rep[]>([])
  const [wallets, setWallets] = useState<BusinessWallet[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])

  const [selectedRepId, setSelectedRepId] = useState<string | null>(null)
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [phone, setPhone] = useState("")
  
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
  
  // Promote to rep states
  const [showPromoteToRep, setShowPromoteToRep] = useState(false)
  const [promoteCommissionRate, setPromoteCommissionRate] = useState("10")
  const [promoting, setPromoting] = useState(false)
  
  // Referral states
  const [referralCodeCopied, setReferralCodeCopied] = useState(false)
  const [generatingReferralCode, setGeneratingReferralCode] = useState(false)
  const [referredByInput, setReferredByInput] = useState("")
  const [applyingReferral, setApplyingReferral] = useState(false)
  const [referralApplyError, setReferralApplyError] = useState<string | null>(null)
  const [editingReferralCode, setEditingReferralCode] = useState(false)
  const [editReferralCodeValue, setEditReferralCodeValue] = useState("")
  const [savingReferralCode, setSavingReferralCode] = useState(false)
  const [referralCodeError, setReferralCodeError] = useState<string | null>(null)
  
  // Reward points states
  const [showAdjustPoints, setShowAdjustPoints] = useState(false)
  const [pointsAdjustment, setPointsAdjustment] = useState({
    amount: "",
    reason: "",
    type: "add" as "add" | "subtract"
  })
  const [adjustingPoints, setAdjustingPoints] = useState(false)
  
  // Delete customer states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      // Single consolidated fetch - reduces HTTP roundtrips from 7 to 1
      const data = await getCustomerDetailData(id)

      if (data) {
        setCustomer(data.customer)
        setSelectedRepId(data.customer.rep_id)
        setSelectedWalletId(data.customer.default_wallet_id)
        setNotes(data.customer.notes || "")
        setPhone(data.customer.phone || "")
        setReps(data.reps)
        setWallets(data.wallets)
        setOrders(data.orders)
        setTickets(data.tickets)
        setAssignedDiscounts(data.assignedDiscounts)
        setAvailableDiscounts(data.availableDiscounts)
      }
      setLoading(false)
    }
    loadData()
  }, [id])
  
  const getDisplayName = () => {
    if (!customer) return "Loading..."
    if (customer.user?.first_name || customer.user?.last_name) {
      return `${customer.user.first_name || ""} ${customer.user.last_name || ""}`.trim()
    }
    if (customer.company_name) return customer.company_name
    return customer.user?.email || "Unknown Customer"
  }

  const handleSave = async () => {
    if (!customer) return
    setSaving(true)

    await updateCustomer(customer.id, { notes, phone })

    if (selectedRepId !== customer.rep_id) {
      await assignRepToCustomer(customer.id, selectedRepId)
    }

    if (selectedWalletId !== customer.default_wallet_id) {
      await assignWalletToCustomer(customer.id, selectedWalletId)
    }

    // Refresh customer data to show updated values
    const refreshedCustomer = await getCustomerById(customer.id)
    if (refreshedCustomer) {
      setCustomer(refreshedCustomer)
      setNotes(refreshedCustomer.notes || "")
      setPhone(refreshedCustomer.phone || "")
      setSelectedRepId(refreshedCustomer.rep_id)
      setSelectedWalletId(refreshedCustomer.default_wallet_id)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSendSms = async () => {
    if (!customer?.phone) return
    setSendingSms(true)
    console.log("Sending SMS to:", customer.phone, "Message:", smsMessage)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSendingSms(false)
    setSmsOpen(false)
    setSmsMessage("")
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: UserCog },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "discounts" as const, label: "Discounts", icon: Gift },
    { id: "support" as const, label: "Support Tickets", icon: Ticket },
  ]
  
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
      
      // Parameters: adminId, customerId, discount object
      const result = await adminAssignDiscountToCustomer(
        user.id,
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
        const data = await getCustomerDetailData(customer.id)
        if (data) setAssignedDiscounts(data.assignedDiscounts)
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
      
      // Parameters: adminId first, then assignmentId
      const result = await adminRemoveAssignedDiscount(user?.id || "", discountId)
      
      if (result.success && customer) {
        const data = await getCustomerDetailData(customer.id)
        if (data) setAssignedDiscounts(data.assignedDiscounts)
      } else {
        alert(result.error || "Failed to remove discount")
      }
    } catch (error) {
      console.error("Error removing discount:", error)
      alert("Failed to remove discount")
    }
  }
  
  const handlePromoteToRep = async () => {
    if (!customer) return
    setPromoting(true)
    
    try {
      const rate = parseFloat(promoteCommissionRate) || 10
      const result = await promoteCustomerToRep(customer.id, rate)
      
      if (result.success) {
        setShowPromoteToRep(false)
        alert("Customer has been promoted to rep! They can now access the rep dashboard.")
        // Redirect to the new rep's profile
        if (result.repId) {
          router.push(`/admin/reps/${result.repId}`)
        }
      } else {
        alert(result.error || "Failed to promote customer")
      }
    } catch (error) {
      console.error("Error promoting customer:", error)
      alert("Failed to promote customer to rep")
    } finally {
      setPromoting(false)
    }
  }
  
  const handleCopyReferralCode = async () => {
    if (!customer?.referral_code) return
    await navigator.clipboard.writeText(customer.referral_code)
    setReferralCodeCopied(true)
    setTimeout(() => setReferralCodeCopied(false), 2000)
  }

  const handleApplyReferralCode = async () => {
    if (!customer || !referredByInput.trim()) {
      setReferralApplyError("Please enter a referral code")
      return
    }

    setApplyingReferral(true)
    setReferralApplyError(null)

    try {
      // First validate the code
      const validation = await validateReferralCode(referredByInput.trim())
      if (!validation.valid) {
        setReferralApplyError(validation.error || "Invalid referral code")
        return
      }

      // Apply the referral
      const result = await applyReferralToCustomer(customer.id, referredByInput.trim())
      if (result.success) {
        // Refresh customer data to show the applied code
        const updatedCustomer = await getCustomerById(customer.id)
        if (updatedCustomer) {
          setCustomer(updatedCustomer)
        }
        setReferredByInput("")
      } else {
        setReferralApplyError(result.error || "Failed to apply referral code")
      }
    } catch (err) {
      console.error("Failed to apply referral code:", err)
      setReferralApplyError("Failed to apply referral code")
    } finally {
      setApplyingReferral(false)
    }
  }
  
  const handleGenerateReferralCode = async () => {
    if (!customer) return
    setGeneratingReferralCode(true)
    
    try {
      const result = await generateReferralCode(customer.id)
      if (result.success && result.code) {
        // Refresh customer data to get the new code
        const updatedCustomer = await getCustomerById(customer.id)
        if (updatedCustomer) {
          setCustomer(updatedCustomer)
        }
      } else {
        alert(result.error || "Failed to generate referral code")
      }
    } catch (error) {
      console.error("Error generating referral code:", error)
      alert("Failed to generate referral code")
    } finally {
      setGeneratingReferralCode(false)
    }
  }

  const handleSaveReferralCode = async () => {
    if (!customer || !editReferralCodeValue.trim()) return
    setSavingReferralCode(true)
    setReferralCodeError(null)
    
    try {
      const result = await updateReferralCode(customer.id, editReferralCodeValue.trim())
      if (result.success) {
        // Refresh customer data
        const updatedCustomer = await getCustomerById(customer.id)
        if (updatedCustomer) {
          setCustomer(updatedCustomer)
        }
        setEditingReferralCode(false)
        setEditReferralCodeValue("")
      } else {
        setReferralCodeError(result.error || "Failed to update referral code")
      }
    } catch (error) {
      console.error("Error updating referral code:", error)
      setReferralCodeError("Failed to update referral code")
    } finally {
      setSavingReferralCode(false)
    }
  }

  const handleRegenerateReferralCode = async () => {
    if (!customer) return
    setGeneratingReferralCode(true)
    
    try {
      const result = await generateReferralCode(customer.id, true) // Force regenerate
      if (result.success && result.code) {
        const updatedCustomer = await getCustomerById(customer.id)
        if (updatedCustomer) {
          setCustomer(updatedCustomer)
        }
      } else {
        alert(result.error || "Failed to regenerate referral code")
      }
    } catch (error) {
      console.error("Error regenerating referral code:", error)
      alert("Failed to regenerate referral code")
    } finally {
      setGeneratingReferralCode(false)
    }
  }
  
  const handleAdjustPoints = async () => {
    if (!customer || !pointsAdjustment.amount || !pointsAdjustment.reason) return
    setAdjustingPoints(true)
    
    try {
      const amount = parseInt(pointsAdjustment.amount) || 0
      const adjustedAmount = pointsAdjustment.type === "subtract" ? -amount : amount
      
      const result = await updateCustomerRewardPoints(
        customer.id,
        adjustedAmount,
        pointsAdjustment.reason
      )
      
      if (result.success) {
        // Refresh customer data to get the new points
        const updatedCustomer = await getCustomerById(customer.id)
        if (updatedCustomer) {
          setCustomer(updatedCustomer)
        }
        setShowAdjustPoints(false)
        setPointsAdjustment({ amount: "", reason: "", type: "add" })
      } else {
        alert(result.error || "Failed to adjust points")
      }
    } catch (error) {
      console.error("Error adjusting points:", error)
      alert("Failed to adjust points")
    } finally {
      setAdjustingPoints(false)
    }
  }
  
  const handleDeleteCustomer = async () => {
    if (!customer) return
    if (deleteConfirmText !== "DELETE") return
    
    setDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/customers/${customer.id}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        // Success - redirect to customers list
        router.push('/admin/customers')
      } else {
        alert(result.error || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          <div className="h-8 w-40 animate-pulse rounded bg-foreground/10" />
          <div className="h-16 w-96 animate-pulse rounded bg-foreground/10" />
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl glass-card" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen overflow-x-hidden px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm md:text-base font-mono tracking-[0.2em] uppercase">Back to Customers</span>
          </button>
          <div className="text-center py-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">Customer not found</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-4">The customer you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length

  return (
    <div className="min-h-screen overflow-x-hidden px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm md:text-base font-mono tracking-[0.2em] uppercase">Back to Customers</span>
        </button>

        {/* Section header: eyebrow + title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Customer Profile</p>
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">{getDisplayName()}</h1>
                <span className="glass-button rounded-2xl px-4 py-2 text-sm md:text-base font-mono text-muted-foreground border border-border">
                  {typeLabels[customer.customer_type] || customer.customer_type}
                </span>
              </div>
              <p className="text-base md:text-lg text-muted-foreground">{customer.user?.email || "No email"}</p>
            </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {customer.user_id && customer.user?.role !== "rep" && customer.user?.role !== "admin" && (
              <Button
                onClick={() => setShowPromoteToRep(true)}
                variant="outline"
                className="h-14 px-6 rounded-2xl border-border text-foreground hover:bg-foreground/10 bg-transparent gap-3 text-base font-semibold"
              >
                <UserPlus className="h-5 w-5" />
                Make Rep
              </Button>
            )}
            {customer.sms_enabled && customer.phone && (
              <Button
                onClick={() => setSmsOpen(true)}
                variant="outline"
                className="h-14 px-6 rounded-2xl border-border text-foreground hover:bg-foreground/10 bg-transparent gap-3 text-base font-semibold"
              >
                <MessageSquare className="h-5 w-5" />
                Send SMS
              </Button>
            )}
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="h-14 px-6 rounded-2xl border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent gap-3 text-base font-semibold"
            >
              <Trash2 className="h-5 w-5" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={saving} className="h-12 md:h-14 px-6 md:px-8 rounded-2xl gap-2 md:gap-3 text-sm md:text-base font-light glass-button border-border text-foreground hover:border-border">
              {saved ? (
                <>
                  <Check className="h-4 w-4 md:h-5 md:w-5" />
                  Saved
                </>
              ) : saving ? (
                <>
                  <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-border border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 md:h-5 md:w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        </motion.div>

        {/* Stats Cards - Chronicles style */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { label: "Total Spent", value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign },
            { label: "Total Orders", value: orders.length.toString(), icon: Package },
            { label: "Reward Points", value: (customer.reward_points || 0).toLocaleString(), icon: Gift },
            { label: "Wallets", value: (customer.wallet_addresses?.length || 0).toString(), icon: Wallet },
            { label: "Open Tickets", value: openTickets.toString(), icon: Ticket },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-3 md:mb-4">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/70" />
              </div>
              <p className="font-mono text-xl md:text-2xl lg:text-3xl font-light text-foreground mb-1 md:mb-2">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs - Chronicles glass-button style */}
        <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center justify-center gap-2 rounded-2xl px-4 md:px-8 py-3 md:py-4 text-sm md:text-base font-light transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "glass-button bg-foreground/10 border-border text-foreground"
                    : "glass-button text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              <tab.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
            <TabsContent value="profile" className="mt-8 md:mt-10">
              <div className="glass-card rounded-3xl p-6 md:p-8 lg:p-12 space-y-10 md:space-y-12">
                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Email Address</Label>
                      <Input
                        value={customer.user?.email || ""}
                        readOnly
                        className="h-14 rounded-xl bg-foreground/5 border-border text-foreground text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Phone Number</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="h-14 rounded-xl bg-foreground/5 border border-border text-foreground text-base placeholder:text-muted-foreground"
                      />
                    </div>
                    {customer.company_name && (
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Company</Label>
                        <Input
                          value={customer.company_name}
                          readOnly
                          className="h-14 rounded-xl bg-foreground/5 border border-border text-foreground text-base"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Shipping Address</Label>
                      <Input
                        value={
                          customer.shipping_address_line1
                            ? `${customer.shipping_address_line1}, ${customer.shipping_city}, ${customer.shipping_state} ${customer.shipping_zip}`
                            : "No address on file"
                        }
                        readOnly
                        className="h-14 rounded-xl bg-foreground/5 border border-border text-foreground text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Member Since</Label>
                      <Input
                        value={new Date(customer.created_at).toLocaleDateString()}
                        readOnly
                        className="h-14 rounded-xl bg-foreground/5 border border-border text-foreground text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Referral Code Section */}
                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light text-foreground flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                    Referral Program
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Referral Code</Label>
                      {editingReferralCode ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Input
                              value={editReferralCodeValue}
                              onChange={(e) => setEditReferralCodeValue(e.target.value.toUpperCase())}
                              placeholder="Enter new code (4-12 characters)"
                              className="flex-1 h-14 rounded-xl bg-foreground/5 border border-purple-500/50 text-foreground text-xl font-bold tracking-wider uppercase"
                              maxLength={12}
                            />
                            <Button
                              onClick={handleSaveReferralCode}
                              disabled={savingReferralCode || editReferralCodeValue.length < 4}
                              className="h-14 px-6 rounded-xl gap-2"
                            >
                              {savingReferralCode ? (
                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              Save
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingReferralCode(false)
                                setEditReferralCodeValue("")
                                setReferralCodeError(null)
                              }}
                              variant="outline"
                              className="h-14 px-4 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                          {referralCodeError && (
                            <p className="text-sm text-red-400">{referralCodeError}</p>
                          )}
                        </div>
                      ) : customer.referral_code ? (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-14 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center px-4">
                            <code className="text-xl font-bold text-foreground tracking-wider">{customer.referral_code}</code>
                          </div>
                          <Button
                            onClick={handleCopyReferralCode}
                            variant="outline"
                            className="h-14 px-4 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                            title="Copy code"
                          >
                            {referralCodeCopied ? (
                              <Check className="h-5 w-5 text-green-400" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setEditReferralCodeValue(customer.referral_code || "")
                              setEditingReferralCode(true)
                              setReferralCodeError(null)
                            }}
                            variant="outline"
                            className="h-14 px-4 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                            title="Edit code"
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={handleRegenerateReferralCode}
                            disabled={generatingReferralCode}
                            variant="outline"
                            className="h-14 px-4 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                            title="Regenerate random code"
                          >
                            {generatingReferralCode ? (
                              <div className="h-4 w-4 border-2 border-border border-t-white rounded-full animate-spin" />
                            ) : (
                              <RefreshCw className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-14 rounded-xl bg-foreground/5 border border-border flex items-center px-4">
                            <span className="text-muted-foreground">No referral code generated</span>
                          </div>
                          <Button
                            onClick={handleGenerateReferralCode}
                            disabled={generatingReferralCode}
                            className="h-14 px-6 rounded-xl gap-2"
                          >
                            {generatingReferralCode ? (
                              <>
                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        This code can be shared with friends to give them a discount on their first order
                      </p>
                    </div>
                    
                    {customer.referred_by_code ? (
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Referred By</Label>
                        <div className="h-14 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center px-4">
                          <code className="text-lg font-semibold text-green-400">{customer.referred_by_code}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This customer signed up using another customer&apos;s referral code
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Add Referral Code</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Apply a referral code to this customer (one-time only)
                        </p>
                        {referralApplyError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-2">
                            {referralApplyError}
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Input
                            value={referredByInput}
                            onChange={(e) => {
                              setReferredByInput(e.target.value.toUpperCase())
                              setReferralApplyError(null)
                            }}
                            placeholder="Enter referral code (e.g. JOHN1234)"
                            maxLength={10}
                            className="flex-1 h-14 rounded-xl bg-foreground/5 border-border text-foreground font-mono tracking-wider placeholder:text-muted-foreground"
                          />
                          <Button
                            onClick={handleApplyReferralCode}
                            disabled={applyingReferral || !referredByInput.trim()}
                            className="h-14 px-6 rounded-xl gap-2"
                          >
                            {applyingReferral ? (
                              <>
                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Gift className="h-4 w-4" />
                                Apply
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {customer.rewards_tier && (
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Rewards Tier</Label>
                        <div className="h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center px-4">
                          <span className="text-lg font-semibold text-amber-400">{customer.rewards_tier}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reward Points Section */}
                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light text-foreground flex items-center gap-2">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                    Reward Points
                  </h3>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Available Points</Label>
                        <div className="h-14 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between px-4">
                          <span className="text-2xl font-bold text-amber-400">
                            {(customer.reward_points || 0).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">pts</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Lifetime Earned</Label>
                        <div className="h-14 rounded-xl bg-foreground/5 border border-border flex items-center justify-between px-4">
                          <span className="text-2xl font-bold text-foreground/70">
                            {(customer.lifetime_points_earned || 0).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">pts</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setShowAdjustPoints(true)}
                      variant="outline"
                      className="h-12 px-6 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 bg-transparent gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adjust Points
                    </Button>
                    
                    <p className="text-sm text-muted-foreground">
                      Add or subtract reward points for this customer. Points adjustments are logged for audit purposes.
                    </p>
                  </div>
                </div>

                {customer.wallet_addresses && customer.wallet_addresses.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="font-serif text-xl md:text-2xl font-light text-foreground">Customer Wallets</h3>
                    <div className="space-y-3">
                      {customer.wallet_addresses.map((wallet, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border"
                        >
                          <code className="text-sm text-foreground/70 font-mono">{wallet.address}</code>
                          <span className="text-xs text-muted-foreground">
                            Last used: {new Date(wallet.last_used).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light text-foreground">Assigned Business Wallet</h3>
                  <div className="space-y-3">
                    <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Business Wallet for Payments</Label>
                    <select
                      value={selectedWalletId || ""}
                      onChange={(e) => setSelectedWalletId(e.target.value || null)}
                      className="w-full h-14 rounded-xl bg-foreground/5 border border-border text-foreground px-4 focus:outline-none focus:border-border"
                    >
                      <option value="" className="bg-background">
                        No wallet assigned
                      </option>
                      {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id} className="bg-background">
                          {wallet.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-muted-foreground">
                      Select a business wallet to receive crypto payments from this customer
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light text-foreground">Representative</h3>
                  <div className="space-y-3">
                    <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Assigned Representative</Label>
                    <select
                      value={selectedRepId || ""}
                      onChange={(e) => setSelectedRepId(e.target.value || null)}
                      className="w-full h-14 rounded-xl bg-foreground/5 border border-border text-foreground px-4 focus:outline-none focus:border-border"
                    >
                      <option value="" className="bg-background">
                        Unassigned
                      </option>
                      {reps.map((rep) => (
                        <option key={rep.id} value={rep.id} className="bg-background">
                          {rep.first_name && rep.last_name ? `${rep.first_name} ${rep.last_name}` : rep.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light text-foreground">Customer Notes</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this customer..."
                    rows={5}
                    className="rounded-xl bg-foreground/5 border-border text-foreground text-base placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-8 md:mt-10">
              <div className="glass-card rounded-3xl p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">Order History</h3>
                  <p className="text-base md:text-lg text-muted-foreground">All orders placed by this customer.</p>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <AdminOrderCard
                        key={order.id}
                        order={order}
                        onOrderUpdated={async () => {
                          const refreshedOrders = await getCustomerOrders(id)
                          setOrders(refreshedOrders)
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-8 md:mt-10">
              <div className="glass-card rounded-3xl p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">Support Tickets</h3>
                  <p className="text-base md:text-lg text-muted-foreground">Customer support requests and their status.</p>
                </div>

                <div className="space-y-4">
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <Ticket className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No support tickets</p>
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="glass-card rounded-2xl p-6 hover:bg-foreground/[0.05] transition-all duration-500 cursor-pointer"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="h-12 w-12 rounded-xl glass-button flex items-center justify-center flex-shrink-0">
                              {ticket.status === "open" || ticket.status === "in_progress" ? (
                                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                              ) : (
                                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="space-y-1 min-w-0">
                              <p className="font-serif text-lg md:text-xl font-light text-foreground">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">Priority: {ticket.priority}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="glass-button rounded-xl px-3 py-1.5 text-xs md:text-sm font-mono text-muted-foreground border border-border">
                              {ticket.status.replace("_", " ").charAt(0).toUpperCase() +
                                ticket.status.replace("_", " ").slice(1)}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discounts" className="mt-8 md:mt-10">
              <div className="glass-card rounded-3xl p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">Assigned Discounts</h3>
                    <p className="text-base md:text-lg text-muted-foreground">Discounts that auto-apply at checkout for this customer.</p>
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
                        className="glass-card rounded-2xl p-6 hover:bg-foreground/[0.05] transition-all duration-500"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-12 w-12 rounded-xl glass-button flex items-center justify-center flex-shrink-0">
                              <Percent className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-serif text-lg md:text-xl font-light text-foreground">
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
                            <span className="glass-button rounded-xl px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border">Active</span>
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
                          <span className="glass-button rounded-xl px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border">
                            {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

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
                    <button
                      onClick={() => setNewDiscount(prev => ({ ...prev, type: "existing" }))}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        newDiscount.type === "existing" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      Existing Code
                    </button>
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

        {/* SMS Modal */}
        <AnimatePresence>
          {smsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSmsOpen(false)}
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
                    <h3 className="text-xl font-bold text-foreground">Send SMS</h3>
                    <p className="text-sm text-muted-foreground mt-1">To: {customer.phone}</p>
                  </div>
                  <button
                    onClick={() => setSmsOpen(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={5}
                  className="rounded-xl bg-foreground/5 border-border text-foreground text-base placeholder:text-muted-foreground resize-none"
                  autoFocus
                />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSmsOpen(false)}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendSms}
                    disabled={sendingSms || !smsMessage.trim()}
                    className="h-12 px-6 rounded-xl gap-2"
                  >
                    {sendingSms ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adjust Points Modal */}
        <AnimatePresence>
          {showAdjustPoints && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAdjustPoints(false)}
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
                    <h3 className="text-xl font-bold text-foreground">Adjust Reward Points</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current balance: {(customer?.reward_points || 0).toLocaleString()} pts
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAdjustPoints(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Add/Subtract Toggle */}
                  <div className="flex gap-2 p-1 bg-foreground/5 rounded-xl">
                    <button
                      onClick={() => setPointsAdjustment(prev => ({ ...prev, type: "add" }))}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        pointsAdjustment.type === "add" 
                          ? "bg-emerald-500 text-white" 
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Points
                    </button>
                    <button
                      onClick={() => setPointsAdjustment(prev => ({ ...prev, type: "subtract" }))}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        pointsAdjustment.type === "subtract" 
                          ? "bg-red-500 text-white" 
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <span className="mr-2">−</span>
                      Subtract Points
                    </button>
                  </div>

                  {/* Points Amount */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Points Amount</Label>
                    <Input
                      type="number"
                      value={pointsAdjustment.amount}
                      onChange={(e) => setPointsAdjustment(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter points amount"
                      min="1"
                      className="h-12 rounded-xl bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Reason *</Label>
                    <select
                      value={pointsAdjustment.reason}
                      onChange={(e) => setPointsAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full h-12 rounded-xl bg-foreground/5 border border-border text-foreground px-4 focus:outline-none focus:border-border"
                    >
                      <option value="" className="bg-background">Select a reason...</option>
                      <option value="Loyalty bonus" className="bg-background">Loyalty bonus</option>
                      <option value="Customer service credit" className="bg-background">Customer service credit</option>
                      <option value="Promotional reward" className="bg-background">Promotional reward</option>
                      <option value="Referral bonus" className="bg-background">Referral bonus</option>
                      <option value="Purchase reward" className="bg-background">Purchase reward</option>
                      <option value="Birthday bonus" className="bg-background">Birthday bonus</option>
                      <option value="Manual correction" className="bg-background">Manual correction</option>
                      <option value="Points redemption" className="bg-background">Points redemption</option>
                      <option value="Points expiration" className="bg-background">Points expiration</option>
                      <option value="Other" className="bg-background">Other</option>
                    </select>
                  </div>

                  {/* Preview */}
                  {pointsAdjustment.amount && (
                    <div className={`rounded-xl p-4 ${
                      pointsAdjustment.type === "add" 
                        ? "bg-emerald-500/10 border border-emerald-500/20" 
                        : "bg-red-500/10 border border-red-500/20"
                    }`}>
                      <p className="text-sm text-foreground/70 mb-1">New Balance Preview</p>
                      <p className={`text-2xl font-bold ${
                        pointsAdjustment.type === "add" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {Math.max(0, (customer?.reward_points || 0) + (
                          pointsAdjustment.type === "add" 
                            ? parseInt(pointsAdjustment.amount) || 0 
                            : -(parseInt(pointsAdjustment.amount) || 0)
                        )).toLocaleString()} pts
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pointsAdjustment.type === "add" ? "+" : "-"}
                        {parseInt(pointsAdjustment.amount) || 0} from current {(customer?.reward_points || 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdjustPoints(false)}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdjustPoints}
                    disabled={adjustingPoints || !pointsAdjustment.amount || !pointsAdjustment.reason}
                    className={`h-12 px-6 rounded-xl gap-2 ${
                      pointsAdjustment.type === "add"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {adjustingPoints ? (
                      <>
                        <div className="h-4 w-4 border-2 border-border border-t-white rounded-full animate-spin" />
                        Adjusting...
                      </>
                    ) : (
                      <>
                        {pointsAdjustment.type === "add" ? <Plus className="h-4 w-4" /> : <span>−</span>}
                        {pointsAdjustment.type === "add" ? "Add" : "Subtract"} Points
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promote to Rep Modal */}
        <AnimatePresence>
          {showPromoteToRep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPromoteToRep(false)}
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
                    <h3 className="text-xl font-bold text-foreground">Promote to Rep</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make {getDisplayName()} a sales representative
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPromoteToRep(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                  <p className="text-amber-400 text-sm">
                    This will give this customer access to the rep dashboard where they can manage their own customers, view commissions, and set custom pricing.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">Commission Rate (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      value={promoteCommissionRate}
                      onChange={(e) => setPromoteCommissionRate(e.target.value)}
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.1"
                      className="h-14 pl-12 rounded-xl bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The percentage of each sale this rep will earn as commission
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPromoteToRep(false)}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePromoteToRep}
                    disabled={promoting}
                    className="h-12 px-6 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {promoting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-border border-t-white rounded-full animate-spin" />
                        Promoting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Make Rep
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Customer Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeleteConfirmText("")
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-card border border-red-500/30 p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Delete Customer</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText("")
                    }}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 space-y-3">
                  <p className="text-red-400 text-sm font-medium">
                    You are about to permanently delete:
                  </p>
                  <ul className="text-sm text-foreground/70 space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Customer record for <strong className="text-foreground">{getDisplayName()}</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      User account from users table
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Authentication record (allows email reuse)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      All assigned discounts and reward points
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-red-500/20">
                    Note: Order history will be preserved but unlinked from this customer.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm md:text-base font-mono tracking-wider text-muted-foreground uppercase">
                    Type <span className="text-red-400 font-mono">DELETE</span> to confirm
                  </Label>
                  <Input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="Type DELETE here"
                    className="h-14 rounded-xl bg-foreground/5 border-border text-foreground text-lg placeholder:text-muted-foreground font-mono tracking-wider"
                    autoComplete="off"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText("")
                    }}
                    className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-foreground/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteCustomer}
                    disabled={deleting || deleteConfirmText !== "DELETE"}
                    className="h-12 px-6 rounded-xl gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-border border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Forever
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

