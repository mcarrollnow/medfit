'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, DollarSign, Package, Clock, ArrowLeft, RefreshCw, Plus, CreditCard, X, Check, Loader2, Store, Archive, Trash2, ChevronDown, ChevronUp, CheckCircle, MousePointer2, AlertTriangle, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { OrderContextMenu } from '@/components/admin/order-context-menu'

interface AdminOrder {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  shipping_amount: number
  total_amount: number
  discount_amount: number
  discount_code_id: string | null
  created_at: string
  invoice_sent_at: string | null
  payment_date: string | null
  payment_failed_at: string | null
  payment_failure_reason: string | null
  shipped_at: string | null
  payment_url: string | null
  approved_amount: number | null
  tracking_number: string | null
  shipping_carrier: string | null
  customer_id: string
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  stripe_receipt_url: string | null
  payment_method: string | null
  payment_provider: string | null
  card_brand: string | null
  card_last_four: string | null
  authorize_net_transaction_id: string | null
  source: string | null
  item_count: number
  customer_name: string
  customer_email: string
}

interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  paidOrders: number
  shippedOrders: number
}

const getStatusColor = (order: AdminOrder) => {
  // Check for archived states first
  if (order.status === 'archived') {
    return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
  if (order.status === 'cancelled') {
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  if (order.status === 'delivered') {
    return 'bg-zinc-500/20 text-muted-foreground border-zinc-500/30'
  }
  if (order.payment_status === 'refunded') {
    return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
  // Determine status based on workflow state
  if (order.shipped_at) {
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
  if (order.payment_date) {
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }
  if (order.payment_failed_at || order.payment_status === 'failed') {
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  if (order.invoice_sent_at) {
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }
  return 'bg-foreground/10 text-foreground border-border'
}

const getStatusLabel = (order: AdminOrder) => {
  // Check for archived states first
  if (order.status === 'archived') return 'Archived'
  if (order.status === 'cancelled') return 'Cancelled'
  if (order.status === 'delivered') return 'Delivered'
  if (order.payment_status === 'refunded') return 'Refunded'
  // Workflow states
  if (order.shipped_at) return 'Shipped'
  if (order.payment_date) return 'Paid'
  if (order.payment_failed_at || order.payment_status === 'failed') return 'Payment Failed'
  if (order.invoice_sent_at) return 'Pending Payment'
  return 'New'
}

// Format payment method display (e.g., "Visa ****4242")
const getPaymentMethodDisplay = (order: AdminOrder) => {
  if (!order.payment_date) return null
  
  // If we have card info, show brand and last 4
  if (order.card_brand && order.card_last_four) {
    const brandDisplay = order.card_brand.charAt(0).toUpperCase() + order.card_brand.slice(1).toLowerCase()
    return `${brandDisplay} ****${order.card_last_four}`
  }
  
  // Fallback to payment method/provider
  if (order.payment_method) {
    return order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)
  }
  
  return 'Paid'
}

function OrdersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Shopify backcheck state
  const [syncingShopify, setSyncingShopify] = useState(false)
  const [shopifySyncResult, setShopifySyncResult] = useState<{ message: string; synced: number } | null>(null)
  
  // Delete order state
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  // Completed orders section state
  const [showCompletedOrders, setShowCompletedOrders] = useState(false)
  
  // Incomplete/Archived orders section state
  const [showIncompleteOrders, setShowIncompleteOrders] = useState(false)
  
  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    order: AdminOrder
  } | null>(null)
  
  // Bulk action loading state
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  
  // Phone number modal state for SMS reminders
  const [phoneModal, setPhoneModal] = useState<{
    open: boolean
    orderId: string | null
    phone: string
    sending: boolean
  }>({ open: false, orderId: null, phone: '', sending: false })

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/orders', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to fetch orders')
      }
      
      const data: AdminOrder[] = await response.json()
      setOrders(data)
      
      // Calculate stats from real data
      const calculatedStats: OrderStats = {
        totalOrders: data.length,
        totalRevenue: data.reduce((sum, order) => sum + (order.total_amount || 0), 0),
        averageOrderValue: data.length > 0 
          ? data.reduce((sum, order) => sum + (order.total_amount || 0), 0) / data.length 
          : 0,
        pendingOrders: data.filter(o => !o.payment_date && o.invoice_sent_at).length,
        paidOrders: data.filter(o => o.payment_date && !o.shipped_at).length,
        shippedOrders: data.filter(o => o.shipped_at).length
      }
      setStats(calculatedStats)
      
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Sync Shopify payment data for existing orders
  const handleSyncShopify = async () => {
    try {
      setSyncingShopify(true)
      setShopifySyncResult(null)
      
      const response = await fetch('/api/admin/orders/sync-shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Shopify sync failed')
      }
      
      setShopifySyncResult({
        message: data.message,
        synced: data.synced || 0
      })
      
      // Refresh orders list
      await fetchOrders()
      
      // Clear result after 5 seconds
      setTimeout(() => setShopifySyncResult(null), 5000)
      
    } catch (err) {
      console.error('Shopify sync error:', err)
      setShopifySyncResult({
        message: err instanceof Error ? err.message : 'Shopify sync failed',
        synced: 0
      })
    } finally {
      setSyncingShopify(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    setDeletingOrderId(orderId)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete order')
      }

      // Refresh the orders list
      await fetchOrders()
      setDeleteConfirmId(null)
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    } catch (err) {
      console.error('Error deleting order:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete order')
    } finally {
      setDeletingOrderId(null)
    }
  }

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, order: AdminOrder) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      order
    })
  }

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update status')
      }

      await fetchOrders()
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  // Archive order (marks as archived for incomplete orders)
  const handleArchiveOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'archived' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to archive order')
      }

      await fetchOrders()
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    } catch (err) {
      console.error('Error archiving order:', err)
      setError(err instanceof Error ? err.message : 'Failed to archive order')
    }
  }

  // Print order
  const handlePrint = async (orderId: string, type: 'label' | 'packing_slip' | 'both') => {
    try {
      if (type === 'label' || type === 'both') {
        await fetch('/api/print-jobs/create-shipping-label', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ order_id: orderId })
        })
      }
      if (type === 'packing_slip' || type === 'both') {
        await fetch('/api/print-jobs/create-packing-slip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ order_id: orderId })
        })
      }
      // Show success message or notification
    } catch (err) {
      console.error('Error printing:', err)
      setError(err instanceof Error ? err.message : 'Failed to queue print job')
    }
  }

  // Save order as PDF
  const handleSaveAsPdf = async (orderId: string) => {
    try {
      window.open(`/api/admin/orders/${orderId}/pdf`, '_blank')
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError('Failed to generate PDF')
    }
  }

  // Send payment reminder
  const handleSendReminder = async (orderId: string, method: 'email' | 'text', customPhone?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ method, phone: customPhone })
      })

      // Try to parse response as JSON
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // Not JSON - likely a 404 page or server error
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        // Check if the error is about missing phone number
        if (data.error === 'Customer has no phone number' && method === 'text') {
          // Open modal to enter phone number manually
          setPhoneModal({ open: true, orderId, phone: '', sending: false })
          return
        }
        throw new Error(data.error || 'Failed to send reminder')
      }

      // Close phone modal if open
      setPhoneModal({ open: false, orderId: null, phone: '', sending: false })

      // Show success notification
      alert(data.message || `Payment reminder sent via ${method}!`)
    } catch (err) {
      console.error('Error sending reminder:', err)
      setError(err instanceof Error ? err.message : 'Failed to send reminder')
      alert(err instanceof Error ? err.message : 'Failed to send reminder')
    }
  }

  // Send SMS with manually entered phone number
  const handleSendSmsWithPhone = async () => {
    if (!phoneModal.orderId || !phoneModal.phone) return
    
    setPhoneModal(prev => ({ ...prev, sending: true }))
    await handleSendReminder(phoneModal.orderId, 'text', phoneModal.phone)
    setPhoneModal(prev => ({ ...prev, sending: false }))
  }

  // View customer profile
  const handleViewCustomer = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`)
  }

  // Handle refund (opens refund modal on detail page)
  const handleRefund = (orderId: string) => {
    router.push(`/admin/orders/${orderId}?action=refund`)
  }

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  // Select all orders in current view
  const selectAllOrders = (orderList: AdminOrder[]) => {
    setSelectedOrderIds(new Set(orderList.map(o => o.id)))
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedOrderIds(new Set())
  }

  // Bulk delete selected orders
  const handleBulkDelete = async () => {
    if (selectedOrderIds.size === 0) return
    
    setBulkActionLoading(true)
    try {
      await Promise.all(
        Array.from(selectedOrderIds).map(orderId =>
          fetch(`/api/admin/orders/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
          })
        )
      )
      await fetchOrders()
      clearSelection()
    } catch (err) {
      console.error('Error bulk deleting:', err)
      setError('Failed to delete some orders')
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Bulk archive selected orders
  const handleBulkArchive = async () => {
    if (selectedOrderIds.size === 0) return
    
    setBulkActionLoading(true)
    try {
      await Promise.all(
        Array.from(selectedOrderIds).map(orderId =>
          fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'archived' })
          })
        )
      )
      await fetchOrders()
      clearSelection()
    } catch (err) {
      console.error('Error bulk archiving:', err)
      setError('Failed to archive some orders')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Helper to check if order is archived (incomplete orders preserved for records)
  const isArchivedIncomplete = (order: AdminOrder) => {
    return order.status === 'archived'
  }

  // Helper to check if order is completed (shipped, delivered, cancelled, or refunded)
  // These orders are moved to the "Completed Orders" section
  // Note: Paid orders that haven't shipped yet remain in "Active" until shipped
  const isCompletedOrder = (order: AdminOrder) => {
    return (order.status === 'shipped' ||
           order.status === 'delivered' || 
           order.status === 'cancelled' || 
           order.payment_status === 'refunded') &&
           !isArchivedIncomplete(order)
  }

  // Active orders are orders that haven't been paid yet and aren't archived
  const activeOrders = orders.filter(o => !isCompletedOrder(o) && !isArchivedIncomplete(o))
  const completedOrders = orders.filter(o => isCompletedOrder(o))
  const incompleteArchivedOrders = orders.filter(o => isArchivedIncomplete(o))

  // Filter active orders based on search and status
  const filteredActiveOrders = activeOrders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter !== 'all' && statusFilter !== 'completed') {
      switch (statusFilter) {
        case 'new':
          matchesStatus = !order.invoice_sent_at
          break
        case 'pending_payment':
          matchesStatus = !!order.invoice_sent_at && !order.payment_date && !order.payment_failed_at
          break
        case 'paid':
          matchesStatus = !!order.payment_date && order.status !== 'shipped'
          break
        case 'payment_failed':
          matchesStatus = !!order.payment_failed_at || order.payment_status === 'failed'
          break
      }
    }
    
    return matchesSearch && matchesStatus
  })

  // Filter completed orders based on search
  const filteredCompletedOrders = completedOrders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })
  
  const statusTabs = [
    { value: 'all', label: 'All Active', count: activeOrders.length },
    { value: 'new', label: 'New', count: activeOrders.filter(o => !o.invoice_sent_at).length },
    { value: 'pending_payment', label: 'Pending Payment', count: activeOrders.filter(o => o.invoice_sent_at && !o.payment_date && !o.payment_failed_at).length },
    { value: 'paid', label: 'Paid', count: activeOrders.filter(o => !!o.payment_date && o.status !== 'shipped').length },
    { value: 'payment_failed', label: 'Payment Failed', count: activeOrders.filter(o => o.payment_failed_at || o.payment_status === 'failed').length },
    { value: 'completed', label: 'Completed', count: completedOrders.length },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Back - Chronicles eyebrow */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm md:text-base font-mono tracking-[0.2em] uppercase">Back to Admin</span>
        </Link>

        {/* Section header - Chronicles style */}
        <div className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Orders</p>
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">Orders</h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2">Track and manage customer orders. Right-click for options.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { setSelectionMode(!selectionMode); if (selectionMode) clearSelection() }}
                className={`glass-button rounded-2xl px-4 md:px-6 py-3 flex items-center gap-2 text-sm md:text-base font-light transition-all ${selectionMode ? 'bg-foreground/10 border-border text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <MousePointer2 className="h-4 w-4 flex-shrink-0" />
                {selectionMode ? 'Exit Select' : 'Select'}
              </button>
              <button
                onClick={handleSyncShopify}
                disabled={syncingShopify}
                className="glass-button rounded-2xl px-4 md:px-6 py-3 flex items-center gap-2 text-sm md:text-base font-light text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Store className={`h-4 w-4 flex-shrink-0 ${syncingShopify ? 'animate-spin' : ''}`} />
                {syncingShopify ? 'Syncing...' : 'Sync Shopify'}
              </button>
              <Link href="/admin/orders/create" className="glass-button rounded-2xl px-4 md:px-6 py-3 flex items-center gap-2 text-sm md:text-base font-light text-foreground hover:border-border bg-foreground/10">
                <Plus className="h-4 w-4 flex-shrink-0" />
                Create Order
              </Link>
              <button
                onClick={() => fetchOrders()}
                disabled={loading}
                className="glass-button rounded-2xl px-4 md:px-6 py-3 flex items-center gap-2 text-sm md:text-base font-light text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 flex-shrink-0 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Sync Results - Chronicles neutral */}
        {shopifySyncResult && (
          <div className="glass-card rounded-2xl p-4 md:p-6 text-foreground">
            <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Shopify:</span> {shopifySyncResult.message}
            {shopifySyncResult.synced > 0 && ` — ${shopifySyncResult.synced} order(s) synced`}
          </div>
        )}

        {/* Error State - keep minimal color for errors */}
        {error && (
          <div className="glass-card rounded-2xl p-4 md:p-6 border-border text-foreground">
            <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Error:</span> {error}
          </div>
        )}

        {/* Selection Mode Toolbar - Chronicles glass */}
        {selectionMode && (
          <div className="sticky top-4 z-50 glass-card rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <span className="font-mono text-sm md:text-base text-foreground">
                {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} selected
              </span>
              <button onClick={() => selectAllOrders(filteredActiveOrders)} className="text-sm font-mono text-muted-foreground hover:text-foreground underline transition-colors">
                Select All Active
              </button>
              <button onClick={clearSelection} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                Clear Selection
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleBulkArchive}
                disabled={selectedOrderIds.size === 0 || bulkActionLoading}
                className="glass-button rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Archive className="h-4 w-4" />
                Archive Selected
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedOrderIds.size === 0 || bulkActionLoading}
                className="glass-button rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground disabled:opacity-50 border-border"
              >
                {bulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards - Chronicles style */}
        {!loading && stats && (
          <section className="space-y-6 md:space-y-8">
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">Overview</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign },
                { label: 'Total Orders', value: String(stats.totalOrders), icon: Package },
                { label: 'Avg Order Value', value: `$${stats.averageOrderValue.toFixed(2)}`, icon: DollarSign },
                { label: 'Ready to Ship', value: String(stats.paidOrders), icon: Clock },
              ].map((stat) => (
                <div key={stat.label} className="glass-button rounded-2xl p-4 md:p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl glass-card mb-3">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/70" />
                  </div>
                  <p className="font-mono text-xl md:text-2xl lg:text-3xl font-light text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters - Chronicles glass-card */}
        <section className="space-y-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 md:h-14 text-base md:text-lg glass-button border-border text-foreground placeholder:text-muted-foreground focus:border-border rounded-xl"
              />
            </div>

            {/* Status Tabs - Chronicles glass-button */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {statusTabs.map((tab) => {
                const TabIcon = 'icon' in tab ? tab.icon : null
                return (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-4 md:px-5 py-2.5 rounded-xl text-sm font-light transition-all flex items-center gap-2 glass-button ${
                      statusFilter === tab.value
                        ? 'bg-foreground/10 border-border text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:border-border border border-border'
                      }`}
                    >
                      {TabIcon && <TabIcon className="w-4 h-4" />}
                      {tab.label}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        statusFilter === tab.value
                          ? tab.value === 'archived' ? 'bg-foreground/20 text-foreground' : 'bg-foreground/10 text-foreground'
                          : 'bg-foreground/10 text-foreground/60'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>
          </div>
        </section>

        {/* Orders List - Chronicles style */}
        <section className="space-y-6 md:space-y-8">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
            {statusFilter === 'completed' ? 'Completed Orders' : 'Active Orders'}
          </p>
          
          {loading && !error ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 animate-pulse rounded-2xl glass-card" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
              <div className="glass-button rounded-2xl p-6 inline-block mb-6">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-serif text-xl md:text-2xl font-light text-foreground mb-2">
                {error.includes('Unauthorized') ? 'Access Denied' : 'Failed to Load Orders'}
              </p>
              <p className="text-base text-muted-foreground mb-6">{error}</p>
              <button onClick={() => fetchOrders()} className="px-6 py-3 rounded-xl glass-button font-mono text-sm">
                Try Again
              </button>
            </div>
          ) : (statusFilter === 'completed' ? filteredCompletedOrders : filteredActiveOrders).length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {(statusFilter === 'completed' ? filteredCompletedOrders : filteredActiveOrders).map(order => {
                const isDeleting = deletingOrderId === order.id
                const showDeleteConfirm = deleteConfirmId === order.id
                const isSelected = selectedOrderIds.has(order.id)
                
                return (
                  <div 
                    key={order.id} 
                    className={`glass-card rounded-2xl md:rounded-3xl transition-all duration-500 hover:bg-foreground/[0.05] ${
                      isSelected ? 'ring-2 ring-foreground/20' : ''
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, order)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                      {/* Selection Checkbox (shown in selection mode) */}
                      {selectionMode && (
                        <button
                          onClick={() => toggleOrderSelection(order.id)}
                          className="pl-4 pr-2 py-5 flex items-center"
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-foreground/20 border-border' 
                              : 'border-border hover:border-border'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-foreground" />}
                          </div>
                        </button>
                      )}
                      
                      {/* Main clickable area - links to order detail (or toggles selection in selection mode) */}
                      {selectionMode ? (
                        <button
                          onClick={() => toggleOrderSelection(order.id)}
                          className="flex-1 p-5 flex items-center gap-6 text-left"
                        >
                          {/* Customer & Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <h3 className="font-serif text-lg md:text-xl font-light text-foreground truncate">
                                {order.customer_name || 'Unknown Customer'}
                              </h3>
                              <span className="glass-button rounded-xl px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground border border-border flex-shrink-0">
                                {getStatusLabel(order)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                              <span className="font-mono">{order.order_number}</span>
                              {order.source === 'supplier' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">SUPPLIER</span>
                              )}
                              <span>{formatDate(order.created_at)}</span>
                              <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                              {getPaymentMethodDisplay(order) && (
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <CreditCard className="w-3.5 h-3.5" />
                                  {getPaymentMethodDisplay(order)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Amount */}
                          <div className="text-right flex-shrink-0 mt-2 sm:mt-0">
                            <p className="font-mono text-lg md:text-xl font-light text-foreground">${order.total_amount.toFixed(2)}</p>
                          </div>
                        </button>
                      ) : (
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="flex-1 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0"
                        >
                          {/* Customer & Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <h3 className="font-serif text-lg md:text-xl font-light text-foreground truncate">
                                {order.customer_name || 'Unknown Customer'}
                              </h3>
                              <span className="glass-button rounded-xl px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground border border-border flex-shrink-0">
                                {getStatusLabel(order)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                              <span className="font-mono">{order.order_number}</span>
                              {order.source === 'supplier' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">SUPPLIER</span>
                              )}
                              <span>{formatDate(order.created_at)}</span>
                              <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                              {getPaymentMethodDisplay(order) && (
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <CreditCard className="w-3.5 h-3.5" />
                                  {getPaymentMethodDisplay(order)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Amount */}
                          <div className="text-right flex-shrink-0">
                            <p className="font-mono text-lg md:text-xl font-light text-foreground">${order.total_amount.toFixed(2)}</p>
                          </div>
                        </Link>
                      )}
                      
                      {/* Action buttons area */}
                      <div className="flex items-center gap-2 pr-4 flex-shrink-0">
                        {!['shipped', 'delivered', 'cancelled'].includes(order.status) && (
                          <Link
                            href={`/fulfill/${order.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-xl transition-all"
                            title="Fulfill order"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Link>
                        )}
                        {showDeleteConfirm ? (
                          <div className="flex items-center gap-2 p-2 glass-card rounded-xl border border-border">
                            <span className="text-muted-foreground text-xs font-mono uppercase px-2">Delete?</span>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 glass-button text-foreground text-xs font-light rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1.5 glass-button text-muted-foreground hover:text-foreground text-xs font-light rounded-lg flex items-center gap-1.5"
                            >
                              <X className="w-3 h-3" />
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(order.id)}
                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-xl transition-all"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
              <p className="font-serif text-xl md:text-2xl font-light text-foreground">
                {statusFilter === 'completed' ? 'No completed orders' : 'No active orders'}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                {statusFilter === 'completed' ? 'Completed orders will appear here' : 'All orders have been completed'}
              </p>
            </div>
          )}
        </section>

        {/* Completed Orders Section - hidden when Completed tab is active */}
        {completedOrders.length > 0 && statusFilter !== 'completed' && (
          <section className="space-y-4">
            {/* Collapsible Header */}
            <button
              onClick={() => setShowCompletedOrders(!showCompletedOrders)}
              className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 rounded-2xl glass-button hover:border-border transition-all"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl glass-button flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-lg md:text-xl font-light text-foreground">Completed Orders</h2>
                  <p className="text-sm text-muted-foreground">{completedOrders.length} order{completedOrders.length !== 1 ? 's' : ''} paid, shipped, or archived</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="glass-button rounded-xl px-3 py-1.5 text-sm font-mono text-muted-foreground border border-border">
                  {filteredCompletedOrders.length}
                </span>
                {showCompletedOrders ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Completed Orders List */}
            {showCompletedOrders && (
              <div className="space-y-3">
                {filteredCompletedOrders.map(order => {
                  const isDeleting = deletingOrderId === order.id
                  const showDeleteConfirm = deleteConfirmId === order.id
                  
                  return (
                    <div 
                      key={order.id} 
                      className="glass-card rounded-2xl md:rounded-3xl transition-all duration-500 hover:bg-foreground/[0.05]"
                      onContextMenu={(e) => handleContextMenu(e, order)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="flex-1 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <h3 className="font-serif text-base md:text-lg font-light text-foreground truncate">
                                {order.customer_name || 'Unknown Customer'}
                              </h3>
                              <span className="glass-button rounded-xl px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground border border-border flex-shrink-0">
                                {getStatusLabel(order)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-mono">{order.order_number}</span>
                              {order.source === 'supplier' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">SUPPLIER</span>
                              )}
                              <span>{formatDate(order.created_at)}</span>
                              <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                              {getPaymentMethodDisplay(order) && (
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <CreditCard className="w-3 h-3" />
                                  {getPaymentMethodDisplay(order)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-mono text-base md:text-lg font-light text-foreground">${order.total_amount.toFixed(2)}</p>
                          </div>
                        </Link>
                        <div className="flex items-center gap-2 pr-4 flex-shrink-0">
                          {showDeleteConfirm ? (
                            <div className="flex items-center gap-2 p-2 glass-card rounded-xl border border-border">
                              <span className="text-muted-foreground text-xs font-mono uppercase px-2">Delete?</span>
                              <button onClick={() => handleDeleteOrder(order.id)} disabled={isDeleting} className="px-3 py-1.5 glass-button text-foreground text-xs font-light rounded-lg flex items-center gap-1.5 disabled:opacity-50">
                                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                Yes
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 glass-button text-muted-foreground hover:text-foreground text-xs font-light rounded-lg flex items-center gap-1.5">
                                <X className="w-3 h-3" />
                                No
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(order.id)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-xl transition-all" title="Delete order">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Incomplete/Archived Orders Section */}
        {incompleteArchivedOrders.length > 0 && (
          <section className="space-y-4">
            {/* Collapsible Header */}
            <button
              onClick={() => setShowIncompleteOrders(!showIncompleteOrders)}
              className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 rounded-2xl glass-button hover:border-border transition-all"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl glass-button flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-lg md:text-xl font-light text-foreground">Incomplete Orders (Archived)</h2>
                  <p className="text-sm text-muted-foreground">{incompleteArchivedOrders.length} order{incompleteArchivedOrders.length !== 1 ? 's' : ''} preserved for records</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="glass-button rounded-xl px-3 py-1.5 text-sm font-mono text-muted-foreground border border-border">
                  {incompleteArchivedOrders.length}
                </span>
                {showIncompleteOrders ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Incomplete Orders List */}
            {showIncompleteOrders && (
              <div className="space-y-3">
                {incompleteArchivedOrders.map(order => {
                  const isDeleting = deletingOrderId === order.id
                  const showDeleteConfirm = deleteConfirmId === order.id
                  
                  return (
                    <div 
                      key={order.id} 
                      className="glass-card rounded-2xl md:rounded-3xl transition-all duration-500 hover:bg-foreground/[0.05]"
                      onContextMenu={(e) => handleContextMenu(e, order)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="flex-1 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <h3 className="font-serif text-base md:text-lg font-light text-foreground truncate">
                                {order.customer_name || 'Unknown Customer'}
                              </h3>
                              <span className="glass-button rounded-xl px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground border border-border flex-shrink-0">
                                Archived
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-mono">{order.order_number}</span>
                              {order.source === 'supplier' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">SUPPLIER</span>
                              )}
                              <span>{formatDate(order.created_at)}</span>
                              <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-mono text-base md:text-lg font-light text-foreground">${order.total_amount.toFixed(2)}</p>
                          </div>
                        </Link>
                        <div className="flex items-center gap-2 pr-4 flex-shrink-0">
                          {showDeleteConfirm ? (
                            <div className="flex items-center gap-2 p-2 glass-card rounded-xl border border-border">
                              <span className="text-muted-foreground text-xs font-mono uppercase px-2">Delete?</span>
                              <button onClick={() => handleDeleteOrder(order.id)} disabled={isDeleting} className="px-3 py-1.5 glass-button text-foreground text-xs font-light rounded-lg flex items-center gap-1.5 disabled:opacity-50">
                                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                Yes
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 glass-button text-muted-foreground hover:text-foreground text-xs font-light rounded-lg flex items-center gap-1.5">
                                <X className="w-3 h-3" />
                                No
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(order.id)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-xl transition-all" title="Delete order">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <OrderContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          order={contextMenu.order}
          onClose={() => setContextMenu(null)}
          onUpdateStatus={handleUpdateStatus}
          onPrint={handlePrint}
          onSaveAsPdf={handleSaveAsPdf}
          onSendReminder={handleSendReminder}
          onViewCustomer={handleViewCustomer}
          onRefund={handleRefund}
          onDelete={handleDeleteOrder}
          onArchive={handleArchiveOrder}
        />
      )}

      {/* Phone Number Modal for SMS */}
      {phoneModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl md:text-2xl font-light text-foreground">Enter Phone Number</h3>
              <button
                onClick={() => setPhoneModal({ open: false, orderId: null, phone: '', sending: false })}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-foreground/60 mb-4">
              This customer doesn&apos;t have a phone number on file. Enter a number to send the SMS reminder.
            </p>
            
            <Input
              type="tel"
              placeholder="(555) 123-4567"
              value={phoneModal.phone}
              onChange={(e) => setPhoneModal(prev => ({ ...prev, phone: e.target.value }))}
              className="mb-4 bg-foreground/5 border-border text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPhoneModal({ open: false, orderId: null, phone: '', sending: false })}
                className="flex-1 border-border text-foreground/70 hover:bg-foreground/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendSmsWithPhone}
                disabled={!phoneModal.phone || phoneModal.sending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-card/90"
              >
                {phoneModal.sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send SMS'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading fallback
function OrdersPageLoading() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="h-8 w-32 animate-pulse rounded bg-foreground/10" />
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-2xl bg-foreground/[0.03]" />
          <div className="h-16 animate-pulse rounded-2xl bg-foreground/[0.03]" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-foreground/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Dynamic import to avoid SSR issues with useSearchParams
const OrdersPageDynamic = dynamic(
  () => Promise.resolve(OrdersPageContent),
  { 
    ssr: false,
    loading: () => <OrdersPageLoading />
  }
)

export default function OrdersPage() {
  return <OrdersPageDynamic />
}
