"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import Link from "next/link"
import {
  FileText,
  Download,
  Filter,
  Calendar,
  User,
  DollarSign,
  Package,
  ChevronDown,
  Search,
  Printer,
  Mail,
  Eye,
  X,
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  FileSpreadsheet,
  Receipt,
  Check,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCurrentRep, getRepOrders, getRepStats, type RepOrder } from "@/app/actions/rep"

type ReportType = "invoice" | "sales" | "customer" | "commission"
type DateRange = "today" | "week" | "month" | "quarter" | "year" | "custom"

interface ReportFilters {
  dateRange: DateRange
  customStartDate?: string
  customEndDate?: string
  customerSearch: string
  status: string
  minAmount: string
  maxAmount: string
}

const REPORT_TYPES = [
  { id: "invoice", label: "Order Invoices", icon: Receipt, description: "Generate invoices for individual orders" },
  { id: "sales", label: "Sales Report", icon: BarChart3, description: "Overview of all sales and revenue" },
  { id: "customer", label: "Customer Report", icon: Users, description: "Customer purchase history and insights" },
  { id: "commission", label: "Commission Report", icon: DollarSign, description: "Your commission earnings breakdown" },
]

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 Days" },
  { id: "month", label: "This Month" },
  { id: "quarter", label: "Last 3 Months" },
  { id: "year", label: "This Year" },
  { id: "custom", label: "Custom Range" },
]

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
]

export default function RepReportsPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<RepOrder[]>([])
  const [repName, setRepName] = useState("Representative")
  const [selectedReport, setSelectedReport] = useState<ReportType>("invoice")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [previewOrder, setPreviewOrder] = useState<RepOrder | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "month",
    customerSearch: "",
    status: "",
    minAmount: "",
    maxAmount: "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const rep = await getCurrentRep()
        if (rep) {
          setRepName(rep.name)
          const repOrders = await getRepOrders(rep.id)
          setOrders(repOrders)
        }
      } catch (error) {
        console.error("Error loading report data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter orders based on criteria
  const filteredOrders = orders.filter(order => {
    // Date filter
    const orderDate = new Date(order.date)
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (filters.dateRange) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case "week":
        startDate = subDays(now, 7)
        break
      case "month":
        startDate = startOfMonth(now)
        break
      case "quarter":
        startDate = subMonths(now, 3)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "custom":
        startDate = filters.customStartDate ? new Date(filters.customStartDate) : subMonths(now, 1)
        endDate = filters.customEndDate ? new Date(filters.customEndDate) : now
        break
      default:
        startDate = startOfMonth(now)
    }

    if (orderDate < startDate || orderDate > endDate) return false

    // Customer search filter
    if (filters.customerSearch) {
      const search = filters.customerSearch.toLowerCase()
      if (!order.customer.name.toLowerCase().includes(search) && 
          !order.customer.email.toLowerCase().includes(search)) {
        return false
      }
    }

    // Status filter
    if (filters.status && order.status !== filters.status) return false

    // Amount filters
    if (filters.minAmount && order.total < parseFloat(filters.minAmount)) return false
    if (filters.maxAmount && order.total > parseFloat(filters.maxAmount)) return false

    return true
  })

  // Calculate summary stats
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const totalCommission = filteredOrders.reduce((sum, o) => sum + o.commission, 0)
  const uniqueCustomers = new Set(filteredOrders.map(o => o.customer.id)).size

  // Group orders by customer for customer report
  const customerGroups = filteredOrders.reduce((acc, order) => {
    const customerId = order.customer.id
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: order.customer,
        orders: [],
        totalSpent: 0,
        totalCommission: 0,
      }
    }
    acc[customerId].orders.push(order)
    acc[customerId].totalSpent += order.total
    acc[customerId].totalCommission += order.commission
    return acc
  }, {} as Record<string, { customer: RepOrder['customer'], orders: RepOrder[], totalSpent: number, totalCommission: number }>)

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const selectAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)))
    }
  }

  const generateInvoicePDF = (order: RepOrder) => {
    // Create invoice content
    const invoiceContent = `
INVOICE
=====================================
Invoice #: INV-${order.id.slice(0, 8).toUpperCase()}
Date: ${format(new Date(order.date), "MMMM dd, yyyy")}

BILL TO:
${order.customer.name}
${order.customer.email}

ITEMS:
${order.items.map(item => `${item.productName} x${item.quantity} - $${item.price.toFixed(2)}`).join('\n')}

-------------------------------------
SUBTOTAL: $${order.total.toFixed(2)}
TOTAL: $${order.total.toFixed(2)}
=====================================

Thank you for your business!
    `.trim()

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.id.slice(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    let csvContent = ""
    
    if (selectedReport === "invoice" || selectedReport === "sales") {
      csvContent = "Order ID,Customer,Email,Date,Status,Items,Total,Commission\n"
      filteredOrders.forEach(order => {
        const items = order.items.map(i => `${i.productName} x${i.quantity}`).join("; ")
        csvContent += `"${order.id}","${order.customer.name}","${order.customer.email}","${format(new Date(order.date), "yyyy-MM-dd")}","${order.status}","${items}","$${order.total.toFixed(2)}","$${order.commission.toFixed(2)}"\n`
      })
    } else if (selectedReport === "customer") {
      csvContent = "Customer,Email,Total Orders,Total Spent,Total Commission\n"
      Object.values(customerGroups).forEach(group => {
        csvContent += `"${group.customer.name}","${group.customer.email}","${group.orders.length}","$${group.totalSpent.toFixed(2)}","$${group.totalCommission.toFixed(2)}"\n`
      })
    } else if (selectedReport === "commission") {
      csvContent = "Order ID,Customer,Date,Order Total,Commission\n"
      filteredOrders.forEach(order => {
        csvContent += `"${order.id}","${order.customer.name}","${format(new Date(order.date), "yyyy-MM-dd")}","$${order.total.toFixed(2)}","$${order.commission.toFixed(2)}"\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedReport}-report-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl">Reports</h1>
            <p className="text-xl text-white/50">Loading report data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        </div>
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl">Reports</h1>
            <p className="text-xl text-white/50">Generate invoices and custom reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="h-11 px-5 bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.customerSearch || filters.status || filters.minAmount || filters.maxAmount) && (
                <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-0">Active</Badge>
              )}
            </Button>
            <Button
              onClick={exportToCSV}
              className="h-11 px-5 bg-white text-black hover:bg-white/90 rounded-xl font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Report Type Selection */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Report Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPORT_TYPES.map(type => {
              const Icon = type.icon
              const isActive = selectedReport === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id as ReportType)}
                  className={`relative p-5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-white/10 border-white/20 shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isActive ? "bg-emerald-500/20" : "bg-white/10"}`}>
                      <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-white/60"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isActive ? "text-white" : "text-white/80"}`}>{type.label}</h3>
                      <p className="text-sm text-white/40 mt-1">{type.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div 
                className="p-6 rounded-2xl border border-white/10 backdrop-blur-xl space-y-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button
                    onClick={() => setFilters({
                      dateRange: "month",
                      customerSearch: "",
                      status: "",
                      minAmount: "",
                      maxAmount: "",
                    })}
                    className="text-sm text-white/50 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as DateRange })}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none"
                    >
                      {DATE_RANGES.map(range => (
                        <option key={range.id} value={range.id} className="bg-black">{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Search */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Customer</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        value={filters.customerSearch}
                        onChange={(e) => setFilters({ ...filters, customerSearch: e.target.value })}
                        placeholder="Search customer..."
                        className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-black">{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Amount Range</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={filters.minAmount}
                        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                        placeholder="Min"
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                      />
                      <span className="text-white/30">-</span>
                      <Input
                        type="number"
                        value={filters.maxAmount}
                        onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                        placeholder="Max"
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Date Range */}
                {filters.dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Start Date</label>
                      <Input
                        type="date"
                        value={filters.customStartDate || ""}
                        onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">End Date</label>
                      <Input
                        type="date"
                        value={filters.customEndDate || ""}
                        onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                        className="h-11 bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="p-5 rounded-2xl border border-white/10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-white/50">Total Orders</span>
            </div>
            <p className="text-3xl font-bold text-white">{filteredOrders.length}</p>
          </div>

          <div 
            className="p-5 rounded-2xl border border-white/10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-white/50">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
          </div>

          <div 
            className="p-5 rounded-2xl border border-white/10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-white/50">Commission</span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">${totalCommission.toFixed(2)}</p>
          </div>

          <div 
            className="p-5 rounded-2xl border border-white/10 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-white/50">Customers</span>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueCustomers}</p>
          </div>
        </section>

        {/* Report Content */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">
              {REPORT_TYPES.find(t => t.id === selectedReport)?.label}
            </h2>
            {selectedReport === "invoice" && selectedOrders.size > 0 && (
              <span className="text-sm text-white/50">{selectedOrders.size} selected</span>
            )}
          </div>

          <div 
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            {/* Invoice Report */}
            {selectedReport === "invoice" && (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm font-medium text-white/50">
                  <div className="col-span-1">
                    <button
                      onClick={selectAllOrders}
                      className={`w-5 h-5 rounded border ${
                        selectedOrders.size === filteredOrders.length && filteredOrders.length > 0
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-white/20 hover:border-white/40"
                      } flex items-center justify-center transition-colors`}
                    >
                      {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <p className="text-white/40">No orders found matching your filters</p>
                    </div>
                  ) : (
                    filteredOrders.map(order => (
                      <div
                        key={order.id}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors"
                      >
                        <div className="col-span-1">
                          <button
                            onClick={() => toggleOrderSelection(order.id)}
                            className={`w-5 h-5 rounded border ${
                              selectedOrders.has(order.id)
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-white/20 hover:border-white/40"
                            } flex items-center justify-center transition-colors`}
                          >
                            {selectedOrders.has(order.id) && <Check className="w-3 h-3 text-white" />}
                          </button>
                        </div>
                        <div className="col-span-2">
                          <span className="font-mono text-sm text-white/70">{order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="col-span-3">
                          <p className="text-white font-medium">{order.customer.name}</p>
                          <p className="text-sm text-white/40">{order.customer.email}</p>
                        </div>
                        <div className="col-span-2 text-white/60">
                          {format(new Date(order.date), "MMM dd, yyyy")}
                        </div>
                        <div className="col-span-1">
                          <Badge
                            className={`text-xs ${
                              order.status === "completed" || order.status === "delivered"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : order.status === "pending"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            } border-0`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-right text-white font-medium">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewOrder(order)}
                            className="h-8 px-3 text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generateInvoicePDF(order)}
                            className="h-8 px-3 text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sales Report */}
            {selectedReport === "sales" && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/50 mb-2">Average Order Value</p>
                    <p className="text-3xl font-bold text-white">
                      ${filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/50 mb-2">Completed Orders</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {filteredOrders.filter(o => o.status === "completed" || o.status === "delivered").length}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/50 mb-2">Pending Orders</p>
                    <p className="text-3xl font-bold text-amber-400">
                      {filteredOrders.filter(o => o.status === "pending" || o.status === "processing").length}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Breakdown</h3>
                  <div className="space-y-3">
                    {filteredOrders.slice(0, 10).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm text-white/50">{order.id.slice(0, 8)}</span>
                          <span className="text-white">{order.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge className="bg-white/10 text-white/70 border-0">{order.status}</Badge>
                          <span className="text-white font-medium">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    {filteredOrders.length > 10 && (
                      <p className="text-center text-white/40 text-sm pt-2">
                        And {filteredOrders.length - 10} more orders...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Report */}
            {selectedReport === "customer" && (
              <div className="divide-y divide-white/5">
                {Object.keys(customerGroups).length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No customer data available</p>
                  </div>
                ) : (
                  Object.values(customerGroups).map(group => (
                    <div key={group.customer.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{group.customer.name}</h3>
                          <p className="text-sm text-white/40">{group.customer.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-400">${group.totalSpent.toFixed(2)}</p>
                          <p className="text-sm text-white/40">{group.orders.length} orders</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {group.orders.slice(0, 3).map(order => (
                          <div key={order.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5">
                            <span className="text-white/60">{format(new Date(order.date), "MMM dd, yyyy")}</span>
                            <span className="text-white">${order.total.toFixed(2)}</span>
                          </div>
                        ))}
                        {group.orders.length > 3 && (
                          <p className="text-xs text-white/40 text-center pt-1">
                            +{group.orders.length - 3} more orders
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Commission Report */}
            {selectedReport === "commission" && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm text-emerald-400/70 mb-2">Total Commission Earned</p>
                    <p className="text-4xl font-bold text-emerald-400">${totalCommission.toFixed(2)}</p>
                    <p className="text-sm text-emerald-400/50 mt-2">From {filteredOrders.length} orders</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/50 mb-2">Commission Rate</p>
                    <p className="text-4xl font-bold text-white">10%</p>
                    <p className="text-sm text-white/40 mt-2">Of order total</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Commission by Order</h3>
                  <div className="space-y-2">
                    {filteredOrders.slice(0, 15).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm text-white/50">{order.id.slice(0, 8)}</span>
                          <span className="text-white">{order.customer.name}</span>
                          <span className="text-white/40 text-sm">{format(new Date(order.date), "MMM dd")}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-white/60">${order.total.toFixed(2)}</span>
                          <span className="text-emerald-400 font-semibold">+${order.commission.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {previewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900">
                <h2 className="text-xl font-semibold text-white">Invoice Preview</h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => generateInvoicePDF(previewOrder)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <button
                    onClick={() => setPreviewOrder(null)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="p-8 space-y-8">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white">INVOICE</h1>
                    <p className="text-white/40 mt-1">#{previewOrder.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60">Date</p>
                    <p className="text-white font-medium">{format(new Date(previewOrder.date), "MMMM dd, yyyy")}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/40 uppercase tracking-wider mb-2">Bill To</p>
                  <p className="text-lg font-semibold text-white">{previewOrder.customer.name}</p>
                  <p className="text-white/60">{previewOrder.customer.email}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-white/40 uppercase tracking-wider mb-4">Items</p>
                  <div className="space-y-3">
                    {previewOrder.items.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No items recorded</p>
                    ) : (
                      previewOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                          <div>
                            <p className="text-white font-medium">{item.productName}</p>
                            <p className="text-sm text-white/40">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-white font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl text-white/60">Total</span>
                    <span className="text-3xl font-bold text-white">${previewOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 border-t border-white/10">
                  <p className="text-white/40">Thank you for your business!</p>
                  <p className="text-sm text-white/30 mt-2">Generated by {repName}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

