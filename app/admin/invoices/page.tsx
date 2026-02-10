"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  FileText, 
  ExternalLink, 
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  DollarSign,
  Package,
  Eye,
  Edit3,
  List,
  Archive,
  Ban,
} from 'lucide-react'
import { format } from 'date-fns'
import { Invoice as InvoicePreview } from "@/components/invoice/invoice"
import { InvoiceEditor } from "@/components/invoice/invoice-editor"
import { InvoiceContextMenu } from "@/components/admin/invoice-context-menu"
import type { InvoiceData } from "@/lib/invoice-types"

// Types
interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface Product {
  id: string
  name: string
  cost_price: number
  b2b_price: number
  retail_price: number
  sku?: string
}

interface InvoiceItem {
  id: string
  product_id?: string
  name?: string
  description?: string
  quantity: number
  unit_price: number
  pricing_tier?: 'cost' | 'b2b' | 'retail' | 'custom'
}

interface Invoice {
  id: string
  invoice_number: string
  customer_email: string
  customer_name: string
  items: string | InvoiceItem[]
  subtotal: number
  tax_amount: number
  total: number
  status: string
  due_date?: string
  notes?: string
  payment_url?: string
  created_at: string
  sent_at?: string
  paid_at?: string
  is_hidden?: boolean
}

type Mode = 'view' | 'create'
type EditorMode = 'edit' | 'preview'

// Generate invoice number
function generateInvoiceNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'INV-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const defaultInvoiceData: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  status: "Draft",
  from: {
    name: "Medfit 90",
    address: "",
    city: "",
    email: siteConfig.supportEmail,
  },
  to: {
    name: "",
    attention: "",
    address: "",
    city: "",
    email: "",
  },
  items: [],
  notes: "",
  taxRate: 0,
}

export default function InvoicesPage() {
  // Mode state
  const [mode, setMode] = useState<Mode>('view')
  const [editorMode, setEditorMode] = useState<EditorMode>('edit')
  
  // List view state
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null)
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    invoice: Invoice
  } | null>(null)
  
  // Create/Edit view state
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isSending, setIsSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [lastInvoiceUrl, setLastInvoiceUrl] = useState<string | null>(null)
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null)
  
  // Hidden invoice state (Mike only)
  const [isHiddenInvoice, setIsHiddenInvoice] = useState(false)
  const [isMike, setIsMike] = useState(false)
  
  // Mike's account identifiers
  const MIKE_USER_ID = 'a125dd87-d9d1-4c9e-9165-c8ef376e5f80'
  const MIKE_EMAIL = 'dreamkidmedia@gmail.com'

  // Fetch invoices (include hidden for Mike)
  const fetchInvoices = useCallback(async (includeHidden: boolean = false) => {
    setLoading(true)
    try {
      const url = includeHidden 
        ? '/api/authorize-net/invoices?include_hidden=true'
        : '/api/authorize-net/invoices'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/customers')
      if (response.ok) {
        const data = await response.json()
        const rawCustomers = data.customers || data || []
        const transformedCustomers = rawCustomers.map((c: any) => ({
          id: c.id,
          name: [c.first_name, c.last_name].filter(Boolean).join(' ') || c.company_name || 'Unknown',
          email: c.email || '',
          phone: c.phone || '',
          company: c.company_name || '',
          address: c.shipping_address_line1 || '',
          city: c.shipping_city || '',
          state: c.shipping_state || '',
          zip: c.shipping_zip || '',
        }))
        setCustomers(transformedCustomers)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || data || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }, [])

  // Check if user is Mike and fetch invoices accordingly
  const initializeData = useCallback(async () => {
    try {
      // First check if user is Mike
      const authResponse = await fetch('/api/auth/me')
      let userIsMike = false
      if (authResponse.ok) {
        const data = await authResponse.json()
        const userId = data.user?.id
        const email = data.user?.email
        userIsMike = userId === MIKE_USER_ID || email === MIKE_EMAIL
        setIsMike(userIsMike)
      }
      
      // Then fetch invoices with hidden flag if Mike
      fetchInvoices(userIsMike)
    } catch (error) {
      console.error('Failed to initialize:', error)
      fetchInvoices(false)
    }
  }, [fetchInvoices])

  useEffect(() => {
    initializeData()
    fetchCustomers()
    fetchProducts()
  }, [initializeData, fetchCustomers, fetchProducts])

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent, invoice: Invoice) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      invoice,
    })
  }

  // Update invoice status
  const handleUpdateStatus = async (invoiceId: string, status: string) => {
    try {
      const response = await fetch(`/api/authorize-net/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchInvoices()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update invoice status')
      }
    } catch (error) {
      console.error('Failed to update invoice status:', error)
    }
  }

  // Void invoice
  const handleVoidInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to void this invoice? This action cannot be undone.')) return
    try {
      const response = await fetch(`/api/authorize-net/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'void' }),
      })
      if (response.ok) {
        fetchInvoices()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to void invoice')
      }
    } catch (error) {
      console.error('Failed to void invoice:', error)
    }
  }

  // Cancel invoice
  const handleCancelInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to cancel this invoice?')) return
    try {
      const response = await fetch(`/api/authorize-net/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      if (response.ok) {
        fetchInvoices()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to cancel invoice')
      }
    } catch (error) {
      console.error('Failed to cancel invoice:', error)
    }
  }

  // Archive invoice
  const handleArchiveInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/authorize-net/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      })
      if (response.ok) {
        fetchInvoices()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to archive invoice')
      }
    } catch (error) {
      console.error('Failed to archive invoice:', error)
    }
  }

  // Delete invoice
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to permanently delete this invoice? This action cannot be undone.')) return
    try {
      const response = await fetch(`/api/authorize-net/invoices/${invoiceId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchInvoices()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    }
  }

  // Duplicate invoice
  const handleDuplicateInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId)
    if (!invoice) return
    
    // Parse items
    const items = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items || []
    
    // Set up invoice data for creating a new one
    setEditingInvoiceId(null) // Not editing, creating new
    setInvoiceData({
      ...defaultInvoiceData,
      invoiceNumber: generateInvoiceNumber(),
      to: {
        name: invoice.customer_name,
        email: invoice.customer_email,
        attention: '',
        address: '',
        city: '',
      },
      items: items.map((item: any, idx: number) => ({
        id: Date.now() + idx,
        description: item.name || item.description || '',
        details: item.name ? (item.description || '') : '',
        quantity: item.quantity,
        rate: item.unit_price,
      })),
      notes: invoice.notes || '',
    })
    setMode('create')
    setEditorMode('edit')
  }

  // Edit invoice
  const handleEditInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId)
    if (!invoice) return
    
    // Parse items
    const items = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items || []
    
    // Set editing state
    setEditingInvoiceId(invoiceId)
    setIsHiddenInvoice(invoice.is_hidden || false) // Preserve hidden status
    setInvoiceData({
      invoiceNumber: invoice.invoice_number,
      issueDate: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : defaultInvoiceData.issueDate,
      dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : defaultInvoiceData.dueDate,
      status: invoice.status === 'draft' ? 'Draft' : invoice.status === 'sent' ? 'Due' : invoice.status === 'paid' ? 'Paid' : invoice.status === 'overdue' ? 'Overdue' : 'Draft',
      from: defaultInvoiceData.from,
      to: {
        name: invoice.customer_name,
        email: invoice.customer_email,
        attention: '',
        address: '',
        city: '',
      },
      items: items.map((item: any, idx: number) => ({
        id: Date.now() + idx,
        description: item.name || item.description || '',
        details: item.name ? (item.description || '') : '',
        quantity: item.quantity,
        rate: item.unit_price,
      })),
      notes: invoice.notes || '',
      taxRate: 0,
    })
    setMode('create')
    setEditorMode('edit')
  }

  // Send reminder
  const handleSendReminder = async (invoiceId: string, method: 'email' | 'text') => {
    const invoice = invoices.find(i => i.id === invoiceId)
    if (!invoice) return
    
    // TODO: Implement reminder sending
    alert(`Sending ${method} reminder for invoice ${invoice.invoice_number}...`)
  }

  // Send/Save invoice (handles both create and update)
  const handleSendInvoice = async (sendEmail: boolean = true) => {
    if (!invoiceData.to.email || invoiceData.items.length === 0) {
      alert('Please add a customer email and at least one item before sending.')
      return
    }

    setIsSending(true)
    setSentSuccess(false)

    try {
      const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
      const tax = subtotal * invoiceData.taxRate
      const calculatedTotal = subtotal + tax
      const total = invoiceData.manualTotal != null ? invoiceData.manualTotal : calculatedTotal
      const manual_adjustment = invoiceData.manualTotal != null ? invoiceData.manualTotal - calculatedTotal : 0

      const invoicePayload = {
        invoice_number: invoiceData.invoiceNumber,
        customer_name: invoiceData.to.name,
        customer_email: invoiceData.to.email,
        items: invoiceData.items.map(item => ({
          name: item.description,
          description: item.details,
          quantity: item.quantity,
          unit_price: item.rate,
          pricing_tier: 'custom',
        })),
        notes: invoiceData.notes,
        due_date: invoiceData.dueDate,
        subtotal,
        tax,
        total,
        manual_adjustment,
        send_email: isHiddenInvoice ? false : sendEmail, // Hidden invoices don't send email
        is_hidden: isHiddenInvoice,
      }

      let response
      if (editingInvoiceId) {
        // Update existing invoice
        response = await fetch(`/api/authorize-net/invoices/${editingInvoiceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoicePayload),
        })
      } else {
        // Create new invoice
        response = await fetch('/api/authorize-net/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoicePayload),
        })
      }

      if (response.ok) {
        const result = await response.json()
        const invoiceUrl = result.invoice_url || result.payment_url
        setLastInvoiceUrl(invoiceUrl)
        setSentSuccess(true)

        if (invoiceUrl) {
          try {
            await navigator.clipboard.writeText(invoiceUrl)
          } catch (clipboardError) {
            console.log('Could not copy to clipboard:', clipboardError)
          }
        }

        // Refresh invoices list and reset form after delay
        setTimeout(() => {
          fetchInvoices(isMike)
          setEditingInvoiceId(null)
          setIsHiddenInvoice(false)
          setInvoiceData({
            ...defaultInvoiceData,
            invoiceNumber: generateInvoiceNumber(),
            issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          })
          setSentSuccess(false)
          setMode('view')
        }, 3000)
      } else {
        const error = await response.text()
        console.error('Failed to send invoice:', error)
        alert('Failed to send invoice. Please try again.')
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Failed to send invoice. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null
    try {
      return format(new Date(dateStr), 'MMM d, yyyy')
    } catch {
      return null
    }
  }

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'sent':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'void':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'overdue':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'archived':
        return 'bg-zinc-500/10 text-muted-foreground border-zinc-500/20'
      case 'draft':
        return 'bg-foreground/5 text-[oklch(0.65_0_0)] border-border'
      default:
        return 'bg-foreground/5 text-[oklch(0.5_0_0)] border-border'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'sent':
        return <Clock className="w-4 h-4" />
      case 'void':
        return <Ban className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'archived':
        return <Archive className="w-4 h-4" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = false
    if (statusFilter === 'all') {
      matchesStatus = true
    } else if (statusFilter === 'active') {
      // Active = sent, viewed, or overdue (awaiting payment)
      matchesStatus = invoice.status === 'sent' || invoice.status === 'viewed' || invoice.status === 'overdue'
    } else {
      matchesStatus = invoice.status === statusFilter
    }
    
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: invoices.length,
    active: invoices.filter(i => i.status === 'sent' || i.status === 'viewed' || i.status === 'overdue').length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    viewed: invoices.filter(i => i.status === 'viewed').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    void: invoices.filter(i => i.status === 'void').length,
    cancelled: invoices.filter(i => i.status === 'cancelled').length,
    archived: invoices.filter(i => i.status === 'archived').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
    outstanding: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + (i.total || 0), 0),
  }

  const statusTabs = [
    { value: 'active', label: 'Active', count: stats.active },
    { value: 'sent', label: 'Sent', count: stats.sent },
    { value: 'viewed', label: 'Viewed', count: stats.viewed },
    { value: 'overdue', label: 'Overdue', count: stats.overdue },
    { value: 'paid', label: 'Paid', count: stats.paid },
    { value: 'draft', label: 'Draft', count: stats.draft },
    { value: 'void', label: 'Void', count: stats.void },
    { value: 'cancelled', label: 'Cancelled', count: stats.cancelled },
    { value: 'archived', label: 'Archived', count: stats.archived },
    { value: 'all', label: 'All', count: stats.total },
  ]

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors mb-16"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-mono tracking-[0.3em] uppercase">Back to Admin</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-[oklch(0.65_0_0)] uppercase mb-6">
            Payment Processing
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-[oklch(0.95_0_0)]">
              Invoices
            </h1>
            
            {/* Mode Toggle */}
            <div className="glass-tabs rounded-2xl p-1.5">
              <div className="flex">
                <button
                  onClick={() => setMode('view')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    mode === 'view' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                  }`}
                >
                  <List className="w-4 h-4" />
                  View All
                </button>
                <button
                  onClick={() => setMode('create')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    mode === 'create' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Mode */}
        <AnimatePresence mode="wait">
          {mode === 'view' && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24"
              >
                {[
                  { label: 'Collected', value: formatCurrency(stats.totalRevenue), icon: DollarSign },
                  { label: 'Outstanding', value: formatCurrency(stats.outstanding), icon: Clock },
                  { label: 'Total Invoices', value: stats.total.toString(), icon: FileText },
                  { label: 'Paid', value: stats.paid.toString(), icon: CheckCircle },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-[oklch(0.95_0_0)]" />
                    </div>
                    <p className="font-mono text-2xl md:text-3xl font-light mb-2 text-[oklch(0.95_0_0)]">{stat.value}</p>
                    <p className="text-sm md:text-base text-[oklch(0.65_0_0)]">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-8 md:p-12 mb-12 md:mb-16"
              >
                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[oklch(0.65_0_0)]" />
                    <input
                      type="text"
                      placeholder="Search by email, name, or invoice number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 h-14 text-lg bg-foreground/5 border border-border text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.65_0_0)] focus:outline-none focus:border-border rounded-xl transition-colors"
                    />
                  </div>
                  
                  <button
                    onClick={() => fetchInvoices(isMike)}
                    disabled={loading}
                    className="glass-button rounded-xl px-6 h-14 flex items-center gap-3 text-[oklch(0.95_0_0)] font-medium transition-all"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-3">
                  {statusTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setStatusFilter(tab.value)}
                      className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        statusFilter === tab.value
                          ? 'bg-primary text-primary-foreground'
                          : 'glass-button text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                      }`}
                    >
                      {tab.label}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        statusFilter === tab.value
                          ? 'bg-foreground/10 text-foreground'
                          : 'bg-foreground/10 text-[oklch(0.65_0_0)]'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Invoices List */}
              <section className="space-y-12">
                <p className="text-sm md:text-base font-mono tracking-[0.3em] text-[oklch(0.65_0_0)] uppercase">
                  Invoices
                </p>
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 animate-pulse rounded-3xl bg-foreground/5" />
                    ))}
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="glass-card rounded-3xl p-16 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-6 text-[oklch(0.65_0_0)]" />
                    <p className="font-serif text-2xl md:text-3xl font-light text-[oklch(0.65_0_0)]">No invoices found</p>
                    <p className="text-[oklch(0.65_0_0)] mt-4 mb-8">Create your first invoice to get started</p>
                    <button
                      onClick={() => setMode('create')}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-card/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create Invoice
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {filteredInvoices.map((invoice, index) => {
                        const isExpanded = expandedInvoiceId === invoice.id
                        const items: InvoiceItem[] = typeof invoice.items === 'string' 
                          ? JSON.parse(invoice.items) 
                          : invoice.items || []
                        
                        return (
                          <motion.div
                            key={invoice.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            onContextMenu={(e) => handleContextMenu(e, invoice)}
                            className={`glass-card rounded-3xl overflow-hidden transition-all duration-500 ${
                              isExpanded ? 'bg-foreground/[0.05]' : 'hover:bg-foreground/[0.05]'
                            }`}
                          >
                            {/* Main Card Content */}
                            <div 
                              className="p-8 md:p-10 cursor-pointer"
                              onClick={() => setExpandedInvoiceId(isExpanded ? null : invoice.id)}
                            >
                              <div className="flex flex-col gap-4">
                                {/* Top Row */}
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[oklch(0.95_0_0)]">
                                      {invoice.invoice_number}
                                    </h3>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border ${getStatusStyles(invoice.status)}`}>
                                      {getStatusIcon(invoice.status)}
                                      {invoice.status}
                                    </span>
                                    {invoice.is_hidden && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-foreground/5 text-[oklch(0.5_0_0)] border border-border">
                                        No Order
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <p className="font-mono text-2xl md:text-3xl font-light text-[oklch(0.95_0_0)]">
                                      {formatCurrency(invoice.total)}
                                    </p>
                                    {isExpanded ? (
                                      <ChevronUp className="h-6 w-6 text-[oklch(0.65_0_0)]" />
                                    ) : (
                                      <ChevronDown className="h-6 w-6 text-[oklch(0.65_0_0)]" />
                                    )}
                                  </div>
                                </div>
                                
                                {/* Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                  <div>
                                    <p className="text-xs font-mono tracking-widest text-[oklch(0.65_0_0)] uppercase mb-1">Customer</p>
                                    <p className="font-medium text-[oklch(0.95_0_0)] truncate">{invoice.customer_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-mono tracking-widest text-[oklch(0.65_0_0)] uppercase mb-1">Email</p>
                                    <p className="font-medium text-[oklch(0.65_0_0)] truncate">{invoice.customer_email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-mono tracking-widest text-[oklch(0.65_0_0)] uppercase mb-1">Created</p>
                                    <p className="font-medium text-[oklch(0.95_0_0)]">{formatDate(invoice.created_at) || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-mono tracking-widest text-[oklch(0.65_0_0)] uppercase mb-1">Due Date</p>
                                    <p className="font-medium text-[oklch(0.95_0_0)]">{formatDate(invoice.due_date) || '—'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-border overflow-hidden"
                                >
                                  <div className="p-8 md:p-10 space-y-8">
                                    {/* Line Items */}
                                    <div className="glass-button rounded-2xl p-6">
                                      <h4 className="text-lg font-serif font-light text-[oklch(0.95_0_0)] mb-6 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-[oklch(0.65_0_0)]" />
                                        Line Items
                                      </h4>
                                      <div className="space-y-4">
                                        {items.map((item, idx) => (
                                          <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                                            <div>
                                              <p className="text-[oklch(0.95_0_0)]">{item.name || item.description || 'Item'}</p>
                                              <p className="text-sm text-[oklch(0.65_0_0)]">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                                            </div>
                                            <p className="font-mono text-[oklch(0.95_0_0)]">{formatCurrency(item.quantity * item.unit_price)}</p>
                                          </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-4 border-t border-border">
                                          <p className="font-medium text-[oklch(0.95_0_0)]">Total</p>
                                          <p className="font-mono text-xl text-[oklch(0.95_0_0)]">{formatCurrency(invoice.total)}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-4">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const url = `${window.location.origin}/invoice/${invoice.id}`
                                          navigator.clipboard.writeText(url)
                                          alert('Invoice link copied!')
                                        }}
                                        className="bg-primary text-primary-foreground rounded-xl px-6 py-4 flex items-center gap-3 font-medium hover:bg-card/90 transition-all"
                                      >
                                        <Copy className="w-5 h-5" />
                                        Copy Link
                                      </button>
                                      <a
                                        href={`/invoice/${invoice.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="glass-button rounded-xl px-6 py-4 flex items-center gap-3 text-[oklch(0.95_0_0)] font-medium transition-all"
                                      >
                                        <Eye className="w-5 h-5" />
                                        View Invoice
                                      </a>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* Create Mode */}
          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Success Banner */}
              <AnimatePresence>
                {sentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card rounded-3xl p-8 mb-12 border-border"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="glass-button rounded-2xl p-4">
                          <CheckCircle className="w-8 h-8 text-[oklch(0.95_0_0)]" />
                        </div>
                        <div>
                          <p className="font-serif text-2xl font-light text-[oklch(0.95_0_0)]">Invoice Saved</p>
                          <p className="text-[oklch(0.65_0_0)]">Invoice link copied to clipboard</p>
                          {lastInvoiceUrl && (
                            <a 
                              href={lastInvoiceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-[oklch(0.95_0_0)] hover:underline mt-2 inline-block"
                            >
                              View Invoice →
                            </a>
                          )}
                        </div>
                      </div>
                      {lastInvoiceUrl && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(lastInvoiceUrl)
                            alert('Link copied!')
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-card/90 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Create Without Order Toggle - Mike Only */}
              {isMike && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mb-8"
                >
                  <button
                    onClick={() => setIsHiddenInvoice(!isHiddenInvoice)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium transition-all border ${
                      isHiddenInvoice
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'glass-button border-border text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                    }`}
                  >
                    {isHiddenInvoice ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                    <span>Create Without Order</span>
                  </button>
                </motion.div>
              )}

              {/* Editor/Preview Toggle */}
              <div className="flex justify-center mb-12">
                <div className="glass-tabs rounded-2xl p-1.5">
                  <div className="flex">
                    <button
                      onClick={() => setEditorMode('edit')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        editorMode === 'edit' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      Editor
                    </button>
                    <button
                      onClick={() => setEditorMode('preview')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        editorMode === 'preview' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor or Preview */}
              <AnimatePresence mode="wait">
                {editorMode === 'edit' ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InvoiceEditor 
                      data={invoiceData} 
                      onChange={setInvoiceData} 
                      onPreview={() => setEditorMode('preview')}
                      onSend={() => handleSendInvoice(true)}
                      onSave={() => handleSendInvoice(false)}
                      isSending={isSending}
                      isEditing={!!editingInvoiceId}
                      customers={customers}
                      products={products}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InvoicePreview data={invoiceData} onEdit={() => setEditorMode('edit')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context Menu */}
        {contextMenu && (
          <InvoiceContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            invoice={contextMenu.invoice}
            onClose={() => setContextMenu(null)}
            onUpdateStatus={handleUpdateStatus}
            onCopyLink={(url) => {
              navigator.clipboard.writeText(url)
              alert('Payment link copied!')
            }}
            onOpenPaymentPage={(url) => window.open(url, '_blank')}
            onViewInvoice={(id) => window.open(`/invoice/${id}`, '_blank')}
            onSendReminder={handleSendReminder}
            onVoid={handleVoidInvoice}
            onCancel={handleCancelInvoice}
            onArchive={handleArchiveInvoice}
            onDelete={handleDeleteInvoice}
            onDuplicate={handleDuplicateInvoice}
            onEdit={handleEditInvoice}
          />
        )}
      </div>
    </div>
  )
}
