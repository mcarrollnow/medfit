"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, User, ArrowLeft, Building, Wallet, Plus, X, Check, Copy, RefreshCw, Link as LinkIcon, Save, Trash2, Package, DollarSign, Ticket, AlertCircle, CheckCircle2, ArrowRight, Gift, ExternalLink } from "lucide-react"
import Link from "next/link"
import { type Customer } from "@/app/actions/customers"
import { applyReferralToCustomer, validateReferralCode } from "@/app/actions/referrals"
import { cn } from "@/lib/utils"

const typeLabels: Record<string, string> = {
  retail: "Retail",
  b2b: "B2B",
  b2bvip: "B2B VIP",
}

interface CustomersClientProps {
  initialCustomers: Customer[]
}

// Function to fetch fresh customers from API
async function fetchFreshCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch('/api/admin/customers', { 
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    if (response.ok) {
      const data = await response.json()
      const rawCustomers = Array.isArray(data) ? data : data.customers || []
      
      return rawCustomers.map((c: any) => ({
        id: c.id,
        user_id: c.user_id,
        company_name: c.company_name,
        customer_type: c.customer_type,
        phone: c.phone,
        shipping_address_line1: c.shipping_address_line1,
        shipping_city: c.shipping_city,
        shipping_state: c.shipping_state,
        shipping_zip: c.shipping_zip,
        shipping_country: c.shipping_country,
        notes: c.notes,
        rep_id: c.rep_id,
        default_wallet_id: c.default_wallet_id,
        created_at: c.created_at,
        updated_at: c.updated_at,
        wallet_addresses: c.wallet_addresses || [],
        sms_enabled: c.sms_enabled || false,
        referral_code: c.referral_code,
        reward_points: c.reward_points || 0,
        user: c.email ? {
          id: c.user_id,
          email: c.email,
          first_name: c.first_name,
          last_name: c.last_name,
          role: c.user_role || 'customer'
        } : c.user || undefined,
        rep: c.rep_name ? {
          id: c.rep_id,
          email: '',
          first_name: c.rep_name?.split(' ')[0] || '',
          last_name: c.rep_name?.split(' ').slice(1).join(' ') || ''
        } : c.rep || undefined,
        default_wallet: c.default_wallet || undefined
      })) as Customer[]
    }
  } catch (error) {
    console.error('[Customers] Error fetching fresh data:', error)
  }
  return []
}

interface Rep {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
}

interface BusinessWallet {
  id: string
  label: string
  address: string
  currency: string
}

interface CustomerOrder {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  payment_date?: string
}

interface SupportTicket {
  id: string
  subject: string
  status: string
  priority: string
  created_at: string
}

interface CustomerEdit {
  phone: string
  notes: string
  customer_type: string
  company_name: string
  shipping_address_line1: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  rep_id: string | null
  default_wallet_id: string | null
}

// Custom dropdown component
function GlassDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder,
  loading 
}: { 
  value: string | null
  options: { id: string; label: string }[]
  onChange: (value: string | null) => void
  placeholder: string
  loading?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.id === value)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className={cn(
          "w-full h-12 px-4 rounded-xl text-left flex items-center justify-between",
          "bg-white/5 border border-white/10 transition-all",
          isOpen ? "border-white/30" : "hover:border-white/20",
          loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {loading ? "Loading..." : selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 py-2 rounded-xl glass-card border border-white/10 shadow-2xl max-h-60 overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => { onChange(null); setIsOpen(false) }}
              className={cn(
                "w-full px-4 py-3 text-left text-sm transition-colors",
                !value ? "text-foreground bg-white/5" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {placeholder}
            </button>
            {options.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => { onChange(option.id); setIsOpen(false) }}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm transition-colors",
                  value === option.id 
                    ? "text-foreground bg-white/5" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  
  // Edit state per customer
  const [editData, setEditData] = useState<Record<string, CustomerEdit>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  
  // Helper data
  const [reps, setReps] = useState<Rep[]>([])
  const [wallets, setWallets] = useState<BusinessWallet[]>([])
  const [loadingHelpers, setLoadingHelpers] = useState(false)
  
  // Customer orders and tickets
  const [customerOrders, setCustomerOrders] = useState<Record<string, CustomerOrder[]>>({})
  const [customerTickets, setCustomerTickets] = useState<Record<string, SupportTicket[]>>({})
  const [loadingOrdersFor, setLoadingOrdersFor] = useState<string | null>(null)

  // Referral code state
  const [referralInputs, setReferralInputs] = useState<Record<string, string>>({})
  const [applyingReferral, setApplyingReferral] = useState<string | null>(null)
  const [referralError, setReferralError] = useState<Record<string, string>>({})
  const [referredByCodes, setReferredByCodes] = useState<Record<string, string>>({})
  
  // Create customer modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createdCustomer, setCreatedCustomer] = useState<{
    id: string
    first_name: string | null
    last_name: string | null
    email: string | null
    invite_link?: string
    message?: string
  } | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    customer_type: 'retail' as 'retail' | 'b2b',
    shipping_address_line1: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: 'USA'
  })

  // Fetch fresh data on mount
  useEffect(() => {
    const loadFreshData = async () => {
      const freshCustomers = await fetchFreshCustomers()
      if (freshCustomers.length > 0) {
        setCustomers(freshCustomers)
      }
    }
    loadFreshData()
  }, [])

  // Load reps and wallets when a card is expanded
  useEffect(() => {
    if (expandedId && reps.length === 0 && !loadingHelpers) {
      loadHelperData()
    }
    if (expandedId && !customerOrders[expandedId]) {
      loadCustomerData(expandedId)
    }
  }, [expandedId])

  const loadHelperData = async () => {
    setLoadingHelpers(true)
    try {
      const [repsRes, walletsRes] = await Promise.all([
        fetch('/api/admin/reps', { credentials: 'include' }),
        fetch('/api/admin/wallets', { credentials: 'include' })
      ])
      
      if (repsRes.ok) {
        const repsData = await repsRes.json()
        let repsArray: Rep[] = []
        if (Array.isArray(repsData)) {
          repsArray = repsData
        } else if (Array.isArray(repsData.reps)) {
          repsArray = repsData.reps
        } else if (Array.isArray(repsData.data)) {
          repsArray = repsData.data
        }
        setReps(repsArray)
      }
      
      if (walletsRes.ok) {
        const walletsData = await walletsRes.json()
        const walletsArray = Array.isArray(walletsData) ? walletsData : walletsData.wallets || []
        setWallets(walletsArray)
      }
    } catch (error) {
      console.error('[Customers] Error loading helper data:', error)
    } finally {
      setLoadingHelpers(false)
    }
  }

  const loadCustomerData = async (customerId: string) => {
    setLoadingOrdersFor(customerId)
    try {
      const [ordersRes, ticketsRes] = await Promise.all([
        fetch(`/api/admin/customers/${customerId}/orders`, { credentials: 'include' }),
        fetch(`/api/admin/customers/${customerId}/tickets`, { credentials: 'include' })
      ])
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setCustomerOrders(prev => ({
          ...prev,
          [customerId]: Array.isArray(ordersData) ? ordersData : ordersData.orders || []
        }))
      } else {
        setCustomerOrders(prev => ({ ...prev, [customerId]: [] }))
      }
      
      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json()
        setCustomerTickets(prev => ({
          ...prev,
          [customerId]: Array.isArray(ticketsData) ? ticketsData : ticketsData.tickets || []
        }))
      } else {
        setCustomerTickets(prev => ({ ...prev, [customerId]: [] }))
      }
    } catch (error) {
      console.error('[Customers] Error loading customer data:', error)
      setCustomerOrders(prev => ({ ...prev, [customerId]: [] }))
      setCustomerTickets(prev => ({ ...prev, [customerId]: [] }))
    } finally {
      setLoadingOrdersFor(null)
    }
  }

  const initEditData = (customer: Customer) => {
    if (!editData[customer.id]) {
      setEditData(prev => ({
        ...prev,
        [customer.id]: {
          phone: customer.phone || '',
          notes: customer.notes || '',
          customer_type: customer.customer_type || 'retail',
          company_name: customer.company_name || '',
          shipping_address_line1: customer.shipping_address_line1 || '',
          shipping_city: customer.shipping_city || '',
          shipping_state: customer.shipping_state || '',
          shipping_zip: customer.shipping_zip || '',
          rep_id: customer.rep_id || null,
          default_wallet_id: customer.default_wallet_id || null
        }
      }))
    }
  }

  const updateEditField = (customerId: string, field: keyof CustomerEdit, value: string | null) => {
    setEditData(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value
      }
    }))
  }

  const handleSaveCustomer = async (customerId: string) => {
    const data = editData[customerId]
    if (!data) return
    
    setSavingId(customerId)
    
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      
      const responseData = await response.json()
      
      if (response.ok && responseData && !responseData.error) {
        setCustomers(prev => prev.map(c => {
          if (c.id === customerId) {
            return {
              ...c,
              phone: responseData.phone ?? data.phone,
              notes: responseData.notes ?? data.notes,
              customer_type: responseData.customer_type ?? data.customer_type as any,
              company_name: responseData.company_name ?? data.company_name,
              shipping_address_line1: responseData.shipping_address_line1 ?? data.shipping_address_line1,
              shipping_city: responseData.shipping_city ?? data.shipping_city,
              shipping_state: responseData.shipping_state ?? data.shipping_state,
              shipping_zip: responseData.shipping_zip ?? data.shipping_zip,
              rep_id: responseData.rep_id ?? data.rep_id,
              default_wallet_id: responseData.default_wallet_id ?? data.default_wallet_id
            }
          }
          return c
        }))
        
        setEditData(prev => ({
          ...prev,
          [customerId]: {
            phone: responseData.phone || '',
            notes: responseData.notes || '',
            customer_type: responseData.customer_type || 'retail',
            company_name: responseData.company_name || '',
            shipping_address_line1: responseData.shipping_address_line1 || '',
            shipping_city: responseData.shipping_city || '',
            shipping_state: responseData.shipping_state || '',
            shipping_zip: responseData.shipping_zip || '',
            rep_id: responseData.rep_id || null,
            default_wallet_id: responseData.default_wallet_id || null
          }
        }))
        
        setSavedId(customerId)
        setTimeout(() => setSavedId(null), 2000)
      } else {
        alert(responseData.error || 'Failed to save')
      }
    } catch (error) {
      console.error('[Customers] Error saving customer:', error)
      alert('Failed to save customer')
    } finally {
      setSavingId(null)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (deleteConfirmText !== 'DELETE') return
    
    setDeletingId(customerId)
    
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setCustomers(prev => prev.filter(c => c.id !== customerId))
        setDeleteConfirmId(null)
        setDeleteConfirmText('')
        setExpandedId(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateCustomer = async () => {
    if (!newCustomer.first_name.trim() && !newCustomer.company_name.trim()) {
      setCreateError('Please enter a name or company name')
      return
    }

    setIsCreating(true)
    setCreateError(null)

    try {
      const response = await fetch('/api/admin/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCustomer)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create customer')
      }

      const result = await response.json()
      setCreatedCustomer(result)
      
      const newCustomerForList: Customer = {
        id: result.id,
        user_id: result.user_id,
        company_name: result.company_name,
        customer_type: result.customer_type,
        phone: result.phone,
        shipping_address_line1: result.shipping_address_line1,
        shipping_city: result.shipping_city,
        shipping_state: result.shipping_state,
        shipping_zip: result.shipping_zip,
        shipping_country: result.shipping_country,
        notes: null,
        rep_id: null,
        default_wallet_id: null,
        created_at: new Date().toISOString(),
        user: {
          email: result.email,
          first_name: result.first_name,
          last_name: result.last_name,
          role: 'customer',
          commission_rate: 0
        },
        rep: null,
        default_wallet: null,
        orders: [],
        wallet_addresses: [],
        sms_enabled: false,
        sms_phone: null
      }
      setCustomers(prev => [newCustomerForList, ...prev])
      
    } catch (err) {
      console.error('Error creating customer:', err)
      setCreateError(err instanceof Error ? err.message : 'Failed to create customer')
    } finally {
      setIsCreating(false)
    }
  }

  const handleApplyReferralCode = async (customerId: string) => {
    const code = referralInputs[customerId]?.trim()
    if (!code) {
      setReferralError(prev => ({ ...prev, [customerId]: "Please enter a referral code" }))
      return
    }

    setApplyingReferral(customerId)
    setReferralError(prev => ({ ...prev, [customerId]: "" }))

    try {
      const validation = await validateReferralCode(code)
      if (!validation.valid) {
        setReferralError(prev => ({ ...prev, [customerId]: validation.error || "Invalid referral code" }))
        return
      }

      const result = await applyReferralToCustomer(customerId, code)
      if (result.success) {
        setReferredByCodes(prev => ({ ...prev, [customerId]: code.toUpperCase() }))
        setReferralInputs(prev => ({ ...prev, [customerId]: "" }))
        // Update the customer in the list
        setCustomers(prev => prev.map(c =>
          c.id === customerId ? { ...c, referred_by_code: code.toUpperCase() } as Customer : c
        ))
      } else {
        setReferralError(prev => ({ ...prev, [customerId]: result.error || "Failed to apply referral code" }))
      }
    } catch (err) {
      console.error("Error applying referral code:", err)
      setReferralError(prev => ({ ...prev, [customerId]: "Failed to apply referral code" }))
    } finally {
      setApplyingReferral(null)
    }
  }

  const resetCreateModal = () => {
    setShowCreateModal(false)
    setCreatedCustomer(null)
    setCreateError(null)
    setLinkCopied(false)
    setNewCustomer({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company_name: '',
      customer_type: 'retail',
      shipping_address_line1: '',
      shipping_city: '',
      shipping_state: '',
      shipping_zip: '',
      shipping_country: 'USA'
    })
  }

  const copyInviteLink = async () => {
    if (createdCustomer?.invite_link) {
      await navigator.clipboard.writeText(createdCustomer.invite_link)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
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

  const getDisplayName = (customer: Customer) => {
    if (customer.user?.first_name || customer.user?.last_name) {
      return `${customer.user.first_name || ""} ${customer.user.last_name || ""}`.trim()
    }
    if (customer.company_name) return customer.company_name
    return customer.user?.email || "Unknown Customer"
  }

  // Prepare dropdown options
  const repOptions = reps.map(rep => ({
    id: rep.id,
    label: rep.first_name && rep.last_name ? `${rep.first_name} ${rep.last_name}` : rep.email
  }))

  const walletOptions = wallets.map(wallet => ({
    id: wallet.id,
    label: `${wallet.label} (${wallet.currency})`
  }))

  return (
    <div className="min-h-screen overflow-x-hidden px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Back - Chronicles eyebrow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm md:text-base font-mono tracking-[0.2em] uppercase">Back to Admin</span>
          </Link>
        </motion.div>

        {/* Section header - Chronicles style */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            People Management
          </p>
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-tight text-foreground">
              Customers
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="glass-button rounded-2xl px-6 md:px-8 py-3 md:py-4 flex items-center gap-2 md:gap-3 text-foreground font-light text-sm md:text-base hover:border-white/20 transition-all"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              Create Customer
            </button>
          </div>
        </motion.div>

        {/* Search - Chronicles glass-card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-6 md:p-8 lg:p-12 mb-12 md:mb-16"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, company, or city..."
              className="w-full pl-12 pr-4 h-12 md:h-14 text-base md:text-lg glass-button border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 rounded-xl transition-colors"
            />
          </div>
          <p className="text-sm md:text-base text-muted-foreground mt-4">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </motion.div>

        {/* Customer Cards - Chronicles style */}
        <section className="space-y-6 md:space-y-8">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
            All Customers
          </p>
          
          <div className="space-y-4 md:space-y-6">
            {filteredCustomers.map((customer, index) => {
              const isExpanded = expandedId === customer.id

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className={`glass-card rounded-3xl overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                    className="w-full p-6 md:p-8 lg:p-10 text-left"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      {/* Customer Info */}
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <div className="glass-button rounded-2xl p-3 md:p-4 flex-shrink-0">
                          {customer.company_name ? (
                            <Building className="w-6 h-6 md:w-7 md:h-7 text-foreground/70" />
                          ) : (
                            <User className="w-6 h-6 md:w-7 md:h-7 text-foreground/70" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground truncate">
                              {getDisplayName(customer)}
                            </h3>
                            <span className="glass-button rounded-xl px-3 py-1 text-xs font-mono tracking-wider uppercase text-muted-foreground border border-white/10 flex-shrink-0">
                              {typeLabels[customer.customer_type] || customer.customer_type}
                            </span>
                          </div>
                          <p className="text-base md:text-lg text-muted-foreground mt-1 truncate">{customer.user?.email || "No email"}</p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                        <div className="flex gap-4 md:gap-6">
                          <div className="text-center">
                            <p className="font-mono text-lg md:text-xl font-light text-foreground">
                              {customer.wallet_addresses?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Wallets</p>
                          </div>
                          <div className="text-center min-w-0">
                            <p className="font-mono text-lg md:text-xl font-light text-foreground truncate max-w-[8rem] md:max-w-none">
                              {customer.shipping_city || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">City</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-6 w-6 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (() => {
                      initEditData(customer)
                      const data = editData[customer.id]
                      const orders = customerOrders[customer.id] || []
                      const totalSpent = orders.reduce((sum: number, o: CustomerOrder) => sum + (o.total_amount || 0), 0)
                      
                      return (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/10 p-8 md:p-10 space-y-8">
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: DollarSign },
                                { label: 'Orders', value: orders.length.toString(), icon: Package },
                                { label: 'Wallets', value: (customer.wallet_addresses?.length || 0).toString(), icon: Wallet },
                                { label: 'Member Since', value: new Date(customer.created_at).toLocaleDateString(), icon: User },
                              ].map((stat) => (
                                <div key={stat.label} className="rounded-2xl p-4 text-center bg-white/[0.03] border border-white/[0.08]">
                                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                                  <p className="font-mono text-lg font-light text-foreground">{stat.value}</p>
                                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                              ))}
                            </div>

                            {data && (
                              <div className="space-y-6">
                                {/* Contact Row */}
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div>
                                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Email</label>
                                    <input
                                      value={customer.user?.email || ''}
                                      readOnly
                                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-muted-foreground"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Phone</label>
                                    <input
                                      value={data.phone}
                                      onChange={(e) => updateEditField(customer.id, 'phone', e.target.value)}
                                      placeholder="(555) 555-5555"
                                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Type</label>
                                    <div className="flex gap-2">
                                      {(['retail', 'b2b', 'b2bvip'] as const).map(type => (
                                        <button
                                          key={type}
                                          onClick={() => updateEditField(customer.id, 'customer_type', type)}
                                          className={cn(
                                            "flex-1 h-12 rounded-xl border text-sm font-medium transition-all",
                                            data.customer_type === type
                                              ? "bg-white text-black border-white"
                                              : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                          )}
                                        >
                                          {typeLabels[type]}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Company */}
                                <div>
                                  <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Company</label>
                                  <input
                                    value={data.company_name}
                                    onChange={(e) => updateEditField(customer.id, 'company_name', e.target.value)}
                                    placeholder="Company name"
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                  />
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-3">
                                  <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Shipping Address</label>
                                  <input
                                    value={data.shipping_address_line1}
                                    onChange={(e) => updateEditField(customer.id, 'shipping_address_line1', e.target.value)}
                                    placeholder="Street address"
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                  />
                                  <div className="grid grid-cols-6 gap-2">
                                    <input
                                      value={data.shipping_city}
                                      onChange={(e) => updateEditField(customer.id, 'shipping_city', e.target.value)}
                                      placeholder="City"
                                      className="col-span-3 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                    />
                                    <input
                                      value={data.shipping_state}
                                      onChange={(e) => updateEditField(customer.id, 'shipping_state', e.target.value)}
                                      placeholder="State"
                                      className="col-span-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                    />
                                    <input
                                      value={data.shipping_zip}
                                      onChange={(e) => updateEditField(customer.id, 'shipping_zip', e.target.value)}
                                      placeholder="ZIP"
                                      className="col-span-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                    />
                                  </div>
                                </div>

                                {/* Rep & Wallet - Glass Dropdowns */}
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                                      Assigned Rep
                                    </label>
                                    <GlassDropdown
                                      value={data.rep_id}
                                      options={repOptions}
                                      onChange={(value) => updateEditField(customer.id, 'rep_id', value)}
                                      placeholder="Unassigned"
                                      loading={loadingHelpers}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                                      Default Wallet
                                    </label>
                                    <GlassDropdown
                                      value={data.default_wallet_id}
                                      options={walletOptions}
                                      onChange={(value) => updateEditField(customer.id, 'default_wallet_id', value)}
                                      placeholder="No wallet assigned"
                                      loading={loadingHelpers}
                                    />
                                  </div>
                                </div>

                                {/* Notes */}
                                <div>
                                  <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Notes</label>
                                  <textarea
                                    value={data.notes}
                                    onChange={(e) => updateEditField(customer.id, 'notes', e.target.value)}
                                    placeholder="Internal notes about this customer..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 resize-none"
                                  />
                                </div>

                                {/* Referral Code Section */}
                                <div className="pt-6 border-t border-white/10">
                                  <h4 className="font-serif text-xl font-light text-foreground flex items-center gap-2 mb-4">
                                    <Gift className="w-5 h-5 text-muted-foreground" />
                                    Referral Code
                                  </h4>

                                  {(customer as any).referred_by_code || referredByCodes[customer.id] ? (
                                    <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4">
                                      <p className="text-xs text-green-400/80 uppercase tracking-wider mb-1">Referred By</p>
                                      <code className="text-lg font-semibold text-green-400">
                                        {referredByCodes[customer.id] || (customer as any).referred_by_code}
                                      </code>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <p className="text-sm text-muted-foreground">
                                        Apply a referral code to this customer (one-time only)
                                      </p>
                                      {referralError[customer.id] && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                          {referralError[customer.id]}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3">
                                        <input
                                          value={referralInputs[customer.id] || ""}
                                          onChange={(e) => {
                                            setReferralInputs(prev => ({ ...prev, [customer.id]: e.target.value.toUpperCase() }))
                                            setReferralError(prev => ({ ...prev, [customer.id]: "" }))
                                          }}
                                          placeholder="Enter code (e.g. JOHN1234)"
                                          maxLength={10}
                                          className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-mono tracking-wider placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                                        />
                                        <button
                                          onClick={() => handleApplyReferralCode(customer.id)}
                                          disabled={applyingReferral === customer.id || !referralInputs[customer.id]?.trim()}
                                          className="h-12 px-6 rounded-xl bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 flex items-center gap-2 transition-all"
                                        >
                                          {applyingReferral === customer.id ? (
                                            <>
                                              <RefreshCw className="h-4 w-4 animate-spin" />
                                              Applying...
                                            </>
                                          ) : (
                                            <>
                                              <Gift className="h-4 w-4" />
                                              Apply
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Recent Orders */}
                                <div className="pt-6 border-t border-white/10">
                                  <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-serif text-xl font-light text-foreground flex items-center gap-2">
                                      <Package className="w-5 h-5 text-muted-foreground" />
                                      Recent Orders
                                    </h4>
                                    <Link
                                      href={`/admin/customers/${customer.id}`}
                                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    >
                                      View All <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                  
                                  {loadingOrdersFor === customer.id ? (
                                    <div className="flex items-center justify-center py-8">
                                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                  ) : orders.length === 0 ? (
                                    <div className="text-center py-8">
                                      <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                                      <p className="text-sm text-muted-foreground">No orders yet</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {orders.slice(0, 3).map((order) => (
                                        <Link
                                          key={order.id}
                                          href={`/admin/orders/${order.id}`}
                                          className="flex items-center justify-between p-4 rounded-xl glass-button transition-all"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="glass-button rounded-xl p-2">
                                              <Package className="h-4 w-4 text-foreground" />
                                            </div>
                                            <div>
                                              <p className="font-medium text-foreground">#{order.order_number}</p>
                                              <p className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-mono text-foreground">${order.total_amount?.toFixed(2) || '0.00'}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                                  <button
                                    onClick={() => handleSaveCustomer(customer.id)}
                                    disabled={savingId === customer.id}
                                    className={cn(
                                      "h-14 px-8 rounded-2xl font-medium flex items-center justify-center gap-2 flex-1 sm:flex-none transition-all",
                                      savedId === customer.id
                                        ? "bg-white/20 text-foreground"
                                        : "bg-white text-black hover:bg-white/90"
                                    )}
                                  >
                                    {savingId === customer.id ? (
                                      <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Saving...
                                      </>
                                    ) : savedId === customer.id ? (
                                      <>
                                        <Check className="h-4 w-4" />
                                        Saved
                                      </>
                                    ) : (
                                      <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                      </>
                                    )}
                                  </button>

                                  <Link
                                    href={`/admin/customers/${customer.id}`}
                                    className="h-14 px-6 rounded-2xl glass-button text-foreground font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Full Profile
                                  </Link>

                                  <div className="flex-1" />
                                  
                                  {deleteConfirmId === customer.id ? (
                                    <div className="flex items-center gap-2">
                                      <input
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                        placeholder="Type DELETE"
                                        className="h-14 w-32 px-4 rounded-xl bg-white/5 border border-white/20 text-foreground font-mono text-sm focus:outline-none focus:border-white/40"
                                      />
                                      <button
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                        disabled={deleteConfirmText !== 'DELETE' || deletingId === customer.id}
                                        className="h-14 px-4 rounded-xl bg-white/10 text-foreground hover:bg-white/20 disabled:opacity-50 transition-all"
                                      >
                                        {deletingId === customer.id ? (
                                          <RefreshCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Check className="h-4 w-4" />
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setDeleteConfirmId(null)
                                          setDeleteConfirmText('')
                                        }}
                                        className="h-14 px-4 rounded-xl glass-button text-muted-foreground"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirmId(customer.id)}
                                      className="h-14 px-6 rounded-xl glass-button text-muted-foreground hover:text-foreground flex items-center gap-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })()}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {filteredCustomers.length === 0 && (
              <div className="glass-card rounded-3xl p-16 text-center">
                <User className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                <p className="font-serif text-2xl md:text-3xl font-light text-muted-foreground">No customers found</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create Customer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && resetCreateModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-8 md:p-10"
            >
              <button
                onClick={resetCreateModal}
                className="absolute right-4 top-4 p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {createdCustomer ? (
                <div className="text-center py-4">
                  <div className="glass-button rounded-2xl p-6 inline-block mb-6">
                    <Check className="h-10 w-10 text-foreground" />
                  </div>
                  <h2 className="font-serif text-3xl font-light text-foreground mb-2">Customer Created</h2>
                  <p className="text-muted-foreground mb-6">
                    {createdCustomer.first_name} {createdCustomer.last_name}
                    {createdCustomer.email && ` (${createdCustomer.email})`}
                  </p>

                  {createdCustomer.invite_link && (
                    <div className="glass-button rounded-2xl p-6 mb-6 text-left">
                      <div className="flex items-center gap-2 text-foreground mb-2">
                        <LinkIcon className="h-4 w-4" />
                        <span className="font-medium text-sm">Password Setup Link</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Share this link with the customer:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={createdCustomer.invite_link}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-xs font-mono truncate"
                        />
                        <button
                          onClick={copyInviteLink}
                          className={cn(
                            "h-10 px-4 rounded-lg transition-all flex items-center gap-1",
                            linkCopied 
                              ? "bg-white/20 text-foreground" 
                              : "bg-white/10 text-foreground hover:bg-white/20"
                          )}
                        >
                          {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {linkCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={resetCreateModal}
                      className="flex-1 h-14 rounded-2xl bg-white text-black font-medium hover:bg-white/90 transition-all"
                    >
                      Done
                    </button>
                    <Link
                      href={`/admin/customers/${createdCustomer.id}`}
                      className="flex-1 h-14 rounded-2xl glass-button text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-light text-foreground mb-2">Create Customer</h2>
                  <p className="text-muted-foreground mb-8">Add a new customer to your database.</p>

                  {createError && (
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20 text-foreground text-sm">
                      {createError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">First Name</label>
                        <input
                          value={newCustomer.first_name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                          placeholder="John"
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Last Name</label>
                        <input
                          value={newCustomer.last_name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                          placeholder="Doe"
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Email</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        If provided, a login invite link will be generated.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="(555) 555-5555"
                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Company</label>
                      <input
                        value={newCustomer.company_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                        placeholder="Acme Inc."
                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Customer Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewCustomer({ ...newCustomer, customer_type: 'retail' })}
                          className={cn(
                            "flex-1 h-12 rounded-xl border font-medium transition-all",
                            newCustomer.customer_type === 'retail'
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                          )}
                        >
                          Retail
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCustomer({ ...newCustomer, customer_type: 'b2b' })}
                          className={cn(
                            "flex-1 h-12 rounded-xl border font-medium transition-all",
                            newCustomer.customer_type === 'b2b'
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                          )}
                        >
                          B2B
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={resetCreateModal}
                      className="flex-1 h-14 rounded-2xl glass-button text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateCustomer}
                      disabled={isCreating || (!newCustomer.first_name.trim() && !newCustomer.company_name.trim())}
                      className="flex-1 h-14 rounded-2xl bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Create Customer
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
