"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Users,
  ArrowLeft,
  Search,
  Plus,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getSupplierCustomers,
  createSupplierCustomer,
  updateSupplierCustomer,
  type SupplierCustomer,
} from "@/app/actions/supplier-portal"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { toast } from "react-hot-toast"

export default function SupplierCustomersPage() {
  const [customers, setCustomers] = useState<SupplierCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null)
  const [supplierId, setSupplierId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    companyName: "", addressLine1: "", addressLine2: "",
    city: "", state: "", zip: "",
  })

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", session.user.id)
          .single()
        if (dbUser) setSupplierId(dbUser.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (!supplierId) return
    loadCustomers()
  }, [supplierId])

  async function loadCustomers() {
    if (!supplierId) return
    setIsLoading(true)
    try {
      const data = await getSupplierCustomers(supplierId)
      setCustomers(data)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", email: "", phone: "",
      companyName: "", addressLine1: "", addressLine2: "",
      city: "", state: "", zip: "",
    })
  }

  const handleAddCustomer = async () => {
    if (!supplierId || !formData.firstName || !formData.lastName || !formData.email) {
      toast.error("First name, last name, and email are required")
      return
    }
    setIsSaving(true)
    try {
      const result = await createSupplierCustomer(supplierId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        companyName: formData.companyName || undefined,
        shippingAddress: formData.addressLine1 ? {
          line1: formData.addressLine1,
          line2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        } : undefined,
      })

      if (result.success) {
        toast.success("Customer created! They will receive an email to set up their account.")
        resetForm()
        setShowAddForm(false)
        await loadCustomers()
      } else {
        toast.error(result.error || "Failed to create customer")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateCustomer = async (customerId: string) => {
    if (!supplierId) return
    setIsSaving(true)
    try {
      const result = await updateSupplierCustomer(supplierId, customerId, {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone,
        companyName: formData.companyName,
        shippingAddress: formData.addressLine1 ? {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        } : undefined,
      })

      if (result.success) {
        toast.success("Customer updated")
        setEditingCustomer(null)
        await loadCustomers()
      } else {
        toast.error(result.error || "Failed to update customer")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const startEditing = (customer: SupplierCustomer) => {
    setEditingCustomer(customer.id)
    setFormData({
      firstName: customer.user?.first_name || customer.first_name || "",
      lastName: customer.user?.last_name || customer.last_name || "",
      email: customer.user?.email || customer.email || "",
      phone: customer.user?.phone || customer.phone || "",
      companyName: customer.company_name || "",
      addressLine1: customer.shipping_address_line1 || "",
      addressLine2: customer.shipping_address_line2 || "",
      city: customer.shipping_city || "",
      state: customer.shipping_state || "",
      zip: customer.shipping_zip || "",
    })
  }

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const name = `${c.user?.first_name || c.first_name || ""} ${c.user?.last_name || c.last_name || ""}`.toLowerCase()
    return name.includes(q) || c.user?.email?.toLowerCase().includes(q) || c.company_name?.toLowerCase().includes(q)
  })

  const getCustomerDisplayName = (c: SupplierCustomer) => {
    const first = c.user?.first_name || c.first_name || ""
    const last = c.user?.last_name || c.last_name || ""
    return `${first} ${last}`.trim() || "Unknown"
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-border text-foreground font-mono focus:outline-none focus:border-border transition-colors"
  const labelClasses = "block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <Users className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/supplier" className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Your Customers</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Customers
            <br />
            <span className="italic text-muted-foreground">Manage your customer base</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mb-16">
          {[
            { value: customers.length, label: "Total Customers" },
            { value: customers.reduce((sum, c) => sum + (c.order_count || 0), 0), label: "Total Orders" },
            { value: `$${customers.reduce((sum, c) => sum + (c.total_spent || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Total Revenue" },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="text-center">
              <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                <Package className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search customers..." className="w-full pl-10 pr-4 py-4 rounded-2xl bg-foreground/[0.04] border border-border text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-border transition-colors" />
          </div>
          <button onClick={() => { resetForm(); setShowAddForm(true) }} className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-foreground text-background font-mono text-sm hover:bg-foreground/90 transition-colors">
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>

        {/* Add Customer Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl font-light">New Customer</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className={labelClasses}>First Name *</label><input value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className={inputClasses} /></div>
                  <div><label className={labelClasses}>Last Name *</label><input value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className={inputClasses} /></div>
                  <div><label className={labelClasses}>Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className={inputClasses} /></div>
                  <div><label className={labelClasses}>Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className={inputClasses} /></div>
                  <div className="md:col-span-2"><label className={labelClasses}>Company</label><input value={formData.companyName} onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))} className={inputClasses} /></div>
                  <div className="md:col-span-2"><label className={labelClasses}>Address Line 1</label><input value={formData.addressLine1} onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))} className={inputClasses} /></div>
                  <div className="md:col-span-2"><label className={labelClasses}>Address Line 2</label><input value={formData.addressLine2} onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))} className={inputClasses} /></div>
                  <div><label className={labelClasses}>City</label><input value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} className={inputClasses} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClasses}>State</label><input value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} className={inputClasses} /></div>
                    <div><label className={labelClasses}>ZIP</label><input value={formData.zip} onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))} className={inputClasses} /></div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-xl glass-button text-muted-foreground hover:text-foreground font-mono text-sm">Cancel</button>
                  <button onClick={handleAddCustomer} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-mono text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50">
                    {isSaving ? "Creating..." : "Create Customer"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customer List */}
        <div className="space-y-4">
          {filteredCustomers.map((customer, index) => {
            const isEditing = editingCustomer === customer.id

            return (
              <motion.div key={customer.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.02 }} viewport={{ once: true }} className="glass-card rounded-2xl overflow-hidden">
                {isEditing ? (
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl font-light">Edit Customer</h3>
                      <button onClick={() => setEditingCustomer(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className={labelClasses}>First Name</label><input value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className={inputClasses} /></div>
                      <div><label className={labelClasses}>Last Name</label><input value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className={inputClasses} /></div>
                      <div><label className={labelClasses}>Phone</label><input value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className={inputClasses} /></div>
                      <div><label className={labelClasses}>Company</label><input value={formData.companyName} onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))} className={inputClasses} /></div>
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Address</label>
                        <input value={formData.addressLine1} onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))} placeholder="Address line 1" className={cn(inputClasses, "mb-2")} />
                        <div className="grid grid-cols-3 gap-2">
                          <input value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} placeholder="City" className={inputClasses} />
                          <input value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} placeholder="State" className={inputClasses} />
                          <input value={formData.zip} onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))} placeholder="ZIP" className={inputClasses} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button onClick={() => setEditingCustomer(null)} className="px-4 py-2 text-muted-foreground hover:text-foreground font-mono text-sm">Cancel</button>
                      <button onClick={() => handleUpdateCustomer(customer.id)} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-mono text-sm hover:bg-foreground/90 disabled:opacity-50">
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="glass-button rounded-xl p-3">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg md:text-xl font-light">{getCustomerDisplayName(customer)}</h3>
                          <div className="flex items-center gap-3 flex-wrap mt-1">
                            {customer.user?.email && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />{customer.user.email}
                              </span>
                            )}
                            {(customer.user?.phone || customer.phone) && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />{customer.user?.phone || customer.phone}
                              </span>
                            )}
                            {customer.company_name && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building2 className="h-3 w-3" />{customer.company_name}
                              </span>
                            )}
                          </div>
                          {customer.shipping_address_line1 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{customer.shipping_address_line1}, {customer.shipping_city} {customer.shipping_state} {customer.shipping_zip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-right">
                          <p className="font-mono text-lg font-light">{customer.order_count || 0} orders</p>
                          <p className="text-xs text-muted-foreground font-mono">${(customer.total_spent || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} spent</p>
                        </div>
                        <button onClick={() => startEditing(customer)} className="p-2 rounded-lg hover:bg-foreground/[0.07] transition-colors text-muted-foreground hover:text-foreground">
                          <Edit3 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredCustomers.length === 0 && !showAddForm && (
          <div className="text-center py-24">
            <div className="glass-button rounded-2xl p-6 inline-block mb-6">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-mono mb-6">{searchQuery ? "No customers match your search" : "No customers yet"}</p>
            {!searchQuery && (
              <button onClick={() => { resetForm(); setShowAddForm(true) }} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-mono text-sm hover:bg-foreground/90 transition-colors">
                <Plus className="h-4 w-4" />
                Add Your First Customer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
