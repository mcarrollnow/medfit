"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Users,
  MessageSquare,
  Calendar,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Building,
  Package,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  getPaymentContacts,
  getPayments,
  getPaymentStats,
  getWireTransfers,
  getWireTransferStats,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
  type PaymentContact,
  type Payment,
  type WireTransfer,
  type PaymentMessage
} from "@/app/actions/payments"

type Tab = 'overview' | 'customers' | 'wire-transfers' | 'messages'

export default function SupplierPaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  
  // Data
  const [contacts, setContacts] = useState<PaymentContact[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [wireTransfers, setWireTransfers] = useState<WireTransfer[]>([])
  const [messages, setMessages] = useState<PaymentMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Stats
  const [paymentStats, setPaymentStats] = useState({ totalReceived: 0, totalPayments: 0, uniqueCustomers: 0, avgPayment: 0 })
  const [wireStats, setWireStats] = useState({ totalSent: 0, pendingAmount: 0, completedCount: 0, pendingCount: 0 })
  
  // Filters
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const [selectedContact, setSelectedContact] = useState<PaymentContact | null>(null)
  const [selectedContactPayments, setSelectedContactPayments] = useState<Payment[]>([])
  const [loadingContactPayments, setLoadingContactPayments] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const loadData = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true)
    
    console.log('[Payments] loadData called with:', { startDate, endDate })
    
    const [
      contactsData,
      paymentsData,
      statsData,
      wireData,
      wireStatsData,
      messagesData,
      unread
    ] = await Promise.all([
      getPaymentContacts(),
      getPayments({
        startDate,
        endDate
      }),
      getPaymentStats({
        startDate,
        endDate
      }),
      getWireTransfers(),
      getWireTransferStats(),
      getMessages(),
      getUnreadMessageCount('admin')
    ])
    
    console.log('[Payments] Loaded:', paymentsData.length, 'payments')
    
    setContacts(contactsData)
    setPayments(paymentsData)
    setPaymentStats(statsData)
    setWireTransfers(wireData)
    setWireStats(wireStatsData)
    setMessages(messagesData)
    setUnreadCount(unread)
    setLoading(false)
  }, [])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])
  
  // Reload when date range changes
  useEffect(() => {
    console.log('[Payments] Date range changed:', dateRange)
    const startDate = dateRange.start || undefined
    const endDate = dateRange.end || undefined
    loadData(startDate, endDate)
  }, [dateRange.start, dateRange.end, loadData])

  // Load selected customer's full payment history (not filtered by date)
  useEffect(() => {
    if (selectedContact) {
      setLoadingContactPayments(true)
      getPayments({ contactId: selectedContact.id }).then(customerPayments => {
        setSelectedContactPayments(customerPayments)
        setLoadingContactPayments(false)
      })
    } else {
      setSelectedContactPayments([])
    }
  }, [selectedContact])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    await sendMessage({ sender: 'johnny', message: newMessage })
    setNewMessage("")
    const msgs = await getMessages()
    setMessages(msgs)
  }

  const handleMarkRead = async () => {
    await markMessagesAsRead('admin')
    setUnreadCount(0)
  }

  // Calculate contact totals based on date range from payments
  const contactTotalsInRange = useMemo(() => {
    const totals = new Map<string, number>()
    payments.forEach(p => {
      if (p.contact_id) {
        const current = totals.get(p.contact_id) || 0
        totals.set(p.contact_id, current + p.amount)
      }
    })
    return totals
  }, [payments])

  // Filter and sort contacts alphabetically
  const filteredContacts = contacts
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .map(c => ({
      ...c,
      display_total: (dateRange.start || dateRange.end) 
        ? (contactTotalsInRange.get(c.id) || 0)
        : c.total_paid,
      payment_count_in_range: (dateRange.start || dateRange.end)
        ? payments.filter(p => p.contact_id === c.id).length
        : c.payment_count
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Filter payments by search and selected contact
  const filteredPayments = payments.filter(p => {
    if (selectedContact && p.contact_id !== selectedContact.id) return false
    if (search && !p.contact_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
    { id: 'customers' as Tab, label: 'Customers', icon: Users },
    { id: 'wire-transfers' as Tab, label: 'Transfers', icon: Building, badge: wireStats.pendingCount > 0 ? wireStats.pendingCount : undefined },
    { id: 'messages' as Tab, label: 'Messages', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/supplier"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4">
              Payment Records
            </h1>
            <p className="text-lg text-white/50">
              View payments, transfers, and communications
            </p>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0",
                      activeTab === tab.id 
                        ? "bg-white text-black" 
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={cn(
                        "ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full",
                        activeTab === tab.id ? "bg-black/20" : "bg-red-500 text-white"
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/20">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-bold text-white truncate">
                      ${paymentStats.totalReceived.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/50">Total Received</p>
                  </div>
                </div>
              </motion.div>

              {[
                { icon: CreditCard, color: 'blue', value: paymentStats.totalPayments.toString(), label: 'Payments' },
                { icon: Users, color: 'purple', value: paymentStats.uniqueCustomers.toString(), label: 'Customers' },
                { icon: Building, color: 'orange', value: `$${wireStats.totalSent.toLocaleString()}`, label: 'Wire Transfers' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                  className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      stat.color === 'blue' && "bg-blue-500/20",
                      stat.color === 'purple' && "bg-purple-500/20",
                      stat.color === 'orange' && "bg-orange-500/20"
                    )}>
                      <stat.icon className={cn(
                        "h-6 w-6",
                        stat.color === 'blue' && "text-blue-400",
                        stat.color === 'purple' && "text-purple-400",
                        stat.color === 'orange' && "text-orange-400"
                      )} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
                      <p className="text-sm text-white/50">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Date Range Filter */}
            <div className={`rounded-2xl backdrop-blur-xl border p-6 transition-all ${
              (dateRange.start || dateRange.end) 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${(dateRange.start || dateRange.end) ? 'text-blue-400' : ''}`} />
                  Date Range Filter
                </h3>
                {(dateRange.start || dateRange.end) && (
                  <span className="text-sm text-blue-400 font-medium">
                    {payments.length} payment{payments.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider">From</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(d => ({ ...d, start: e.target.value }))}
                    className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                  />
                </div>
                <span className="text-white/30 hidden sm:block mt-6">to</span>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider">To</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(d => ({ ...d, end: e.target.value }))}
                    className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                  />
                </div>
                {(dateRange.start || dateRange.end) && (
                  <Button
                    variant="outline"
                    onClick={() => setDateRange({ start: "", end: "" })}
                    className="rounded-xl border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-12 mt-auto"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              {loading && (dateRange.start || dateRange.end) && (
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Filtering payments...</span>
                </div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {(dateRange.start || dateRange.end) ? 'Filtered Payments' : 'Recent Payments'}
                  {(dateRange.start || dateRange.end) && (
                    <span className="text-sm font-normal text-blue-400 ml-2">
                      ({dateRange.start || 'any'} → {dateRange.end || 'any'})
                    </span>
                  )}
                </h3>
              </div>
              {loading ? (
                <div className="text-center py-20 text-white/40">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin opacity-50" />
                  <p>Loading payments...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-20 text-white/40">
                  <CreditCard className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p>No payments found{(dateRange.start || dateRange.end) ? ' for the selected date range' : ''}</p>
                </div>
              ) : (
                <PaymentsList payments={(dateRange.start || dateRange.end) ? payments : payments.slice(0, 15)} />
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact List */}
            <div className={cn(
              "lg:col-span-1",
              selectedContact ? "hidden lg:block" : "block"
            )}>
              <div className="lg:sticky lg:top-4 space-y-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                />
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden max-h-[70vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
                  {filteredContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedContact(contact)}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-300 border-b border-white/5 last:border-0 group",
                        selectedContact?.id === contact.id 
                          ? "bg-white/10" 
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold">{contact.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{contact.name}</p>
                            <p className="text-sm text-white/50">
                              {contact.payment_count_in_range} payment{contact.payment_count_in_range !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 flex items-center gap-2">
                          <p className="text-green-400 font-semibold">
                            ${contact.display_total.toLocaleString()}
                          </p>
                          <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                      <Users className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p>No customers found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className={cn(
              "lg:col-span-2",
              selectedContact ? "block" : "hidden lg:block"
            )}>
              {selectedContact ? (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="lg:hidden flex items-center gap-3 text-white/70 hover:text-white transition-colors rounded-xl bg-white/5 border border-white/10 px-4 py-3 w-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back to Customers</span>
                  </button>

                  {/* Customer Header Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                          <span className="text-xl sm:text-2xl font-bold text-white">{selectedContact.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedContact.name}</h3>
                          <p className="text-sm sm:text-base text-white/50">
                            Customer since {selectedContact.first_payment_date 
                              ? new Date(selectedContact.first_payment_date).toLocaleDateString() 
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl sm:text-3xl font-bold text-green-400">
                          ${selectedContactPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-white/50">
                          {selectedContactPayments.length} payment{selectedContactPayments.length !== 1 ? 's' : ''} total
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment History */}
                  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Payment History
                    </h4>
                    {loadingContactPayments ? (
                      <div className="text-center py-12 text-white/40">
                        <RefreshCw className="h-6 w-6 mx-auto mb-3 animate-spin opacity-50" />
                        <p>Loading payment history...</p>
                      </div>
                    ) : (
                      <PaymentsList payments={selectedContactPayments} showContactName={false} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-white/20 mb-4" />
                  <p className="text-white/50">Select a customer to view their payment history</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wire Transfers Tab */}
        {activeTab === 'wire-transfers' && (
          <div className="space-y-8">
            {/* Wire Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: `$${wireStats.totalSent.toLocaleString()}`, label: 'Total Sent', color: 'white' },
                { value: `$${wireStats.pendingAmount.toLocaleString()}`, label: 'Pending Amount', color: 'yellow' },
                { value: wireStats.completedCount.toString(), label: 'Completed', color: 'green' },
                { value: wireStats.pendingCount.toString(), label: 'Pending Count', color: 'yellow' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                >
                  <p className={cn(
                    "text-2xl font-bold",
                    stat.color === 'white' && "text-white",
                    stat.color === 'yellow' && "text-yellow-400",
                    stat.color === 'green' && "text-green-400"
                  )}>{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Wire Transfer List */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Building className="h-5 w-5" />
                Wire Transfers
              </h3>
              <div className="space-y-4">
                {wireTransfers.map((transfer, index) => (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          transfer.status === 'completed' ? "bg-green-500/20" :
                          transfer.status === 'pending' ? "bg-yellow-500/20" :
                          "bg-red-500/20"
                        )}>
                          {transfer.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                          ) : transfer.status === 'pending' ? (
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                          ) : (
                            <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm md:text-base truncate">
                            {new Date(transfer.transfer_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] md:text-xs px-1.5 py-0",
                              transfer.status === 'completed' ? "border-green-500/50 text-green-400" :
                              transfer.status === 'pending' ? "border-yellow-500/50 text-yellow-400" :
                              "border-red-500/50 text-red-400"
                            )}
                          >
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base md:text-xl font-bold text-white">
                          ${transfer.amount.toLocaleString()}
                        </p>
                        {transfer.total_left_to_transfer !== null && (
                          <p className="text-[10px] md:text-xs text-white/40">
                            Bal: ${transfer.total_left_to_transfer.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {wireTransfers.length === 0 && (
                  <div className="text-center py-12 text-white/40">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No wire transfers found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
          >
            {/* Message Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Admin</p>
                  <p className="text-sm text-white/50">Store Administrator</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkRead}
                  className="rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  Mark all read
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="h-[50vh] md:h-[450px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "flex",
                      msg.sender === 'johnny' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] md:max-w-[65%] rounded-2xl px-5 py-3",
                        msg.sender === 'johnny' 
                          ? "bg-green-500 text-white" 
                          : "bg-white/10 text-white"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={cn(
                        "text-xs mt-2",
                        msg.sender === 'johnny' ? "text-green-200" : "text-white/40"
                      )}>
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none min-h-[60px]"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-xl bg-green-500 hover:bg-green-600 text-white px-6 h-auto self-end"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Payments List Component
function PaymentsList({ 
  payments, 
  showContactName = true 
}: { 
  payments: Payment[]
  showContactName?: boolean
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getMethodColor = (method: string | null) => {
    const m = method?.toLowerCase() || ''
    if (m.includes('zelle')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    if (m.includes('venmo')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    if (m.includes('cashapp') || m.includes('cash app')) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (m.includes('paypal')) return 'bg-blue-600/20 text-blue-300 border-blue-600/30'
    return 'bg-white/10 text-white/60 border-white/20'
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, index) => {
        const isExpanded = expandedId === payment.id

        return (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all hover:bg-white/[0.07]"
          >
            <div
              onClick={() => toggleExpand(payment.id)}
              className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-white/5 transition-colors gap-2"
            >
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm md:text-base">
                    {payment.contact_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  {showContactName && (
                    <p className="text-white font-medium text-sm md:text-base truncate">{payment.contact_name}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <span className="text-white/50">
                      {new Date(payment.payment_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {payment.payment_method && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-[10px] md:text-xs px-1.5 py-0", getMethodColor(payment.payment_method))}
                      >
                        {payment.payment_method}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className={cn(
                    "text-base md:text-lg font-bold",
                    payment.confirmation_status === 'refunded' && "text-red-400 line-through",
                    payment.confirmation_status === 'zeroed' && "text-orange-400 line-through",
                    payment.confirmation_status === 'disputed' && "text-red-400",
                    payment.confirmation_status === 'pending' && "text-yellow-400",
                    (!payment.confirmation_status || payment.confirmation_status === 'confirmed') && "text-green-400"
                  )}>
                    ${payment.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {payment.confirmation_status === 'refunded' && (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        <span className="text-[10px] md:text-xs text-red-400">Refunded</span>
                      </>
                    )}
                    {payment.confirmation_status === 'zeroed' && (
                      <>
                        <AlertTriangle className="h-3 w-3 text-orange-400" />
                        <span className="text-[10px] md:text-xs text-orange-400">Zeroed</span>
                      </>
                    )}
                    {payment.confirmation_status === 'disputed' && (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        <span className="text-[10px] md:text-xs text-red-400">Disputed</span>
                      </>
                    )}
                    {payment.confirmation_status === 'pending' && (
                      <>
                        <Clock className="h-3 w-3 text-yellow-400" />
                        <span className="text-[10px] md:text-xs text-yellow-400">Pending</span>
                      </>
                    )}
                    {(!payment.confirmation_status || payment.confirmation_status === 'confirmed') && payment.confirmed && (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-[10px] md:text-xs text-green-400 hidden sm:inline">Confirmed</span>
                      </>
                    )}
                  </div>
                  {/* Show indicator if has tracking or notes */}
                  {(payment.tracking_numbers?.length || payment.wire_transfer_notes || payment.tariff_cost) && (
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      {payment.tracking_numbers?.length && (
                        <Package className="h-3 w-3 text-blue-400" />
                      )}
                      {payment.tariff_cost && payment.tariff_cost > 0 && (
                        <DollarSign className="h-3 w-3 text-orange-400" />
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 text-white/40 transition-transform flex-shrink-0",
                    isExpanded && "rotate-90"
                  )} 
                />
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 md:px-4 pb-3 md:pb-4 pt-2 border-t border-white/10">
                    {/* Payment Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Amount Sent</p>
                        <p className="text-white font-semibold text-sm md:text-base">${payment.amount.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Received (minus fee)</p>
                        <p className="text-white font-semibold text-sm md:text-base">
                          {payment.received_minus_fee 
                            ? `$${payment.received_minus_fee.toLocaleString()}` 
                            : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Fee</p>
                        <p className={cn(
                          "font-semibold text-sm md:text-base",
                          payment.received_minus_fee ? "text-red-400" : "text-white/40"
                        )}>
                          {payment.received_minus_fee 
                            ? `-$${(payment.amount - payment.received_minus_fee).toFixed(2)}` 
                            : '—'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Status</p>
                        <p className={cn(
                          "font-semibold text-sm md:text-base",
                          payment.confirmation_status === 'refunded' && "text-red-400",
                          payment.confirmation_status === 'pending' && "text-yellow-400",
                          payment.confirmation_status === 'zeroed' && "text-orange-400",
                          payment.confirmation_status === 'disputed' && "text-red-400",
                          (!payment.confirmation_status || payment.confirmation_status === 'confirmed') && "text-green-400"
                        )}>
                          {payment.confirmation_status 
                            ? payment.confirmation_status.charAt(0).toUpperCase() + payment.confirmation_status.slice(1)
                            : payment.confirmed ? 'Confirmed' : 'Pending'}
                        </p>
                      </div>
                    </div>

                    {/* Tariff Cost */}
                    {payment.tariff_cost && payment.tariff_cost > 0 && (
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2 md:p-3">
                          <p className="text-[10px] md:text-xs text-orange-400/70 uppercase tracking-wider mb-1">Tariff Cost</p>
                          <p className="text-orange-400 font-semibold text-sm md:text-base">${payment.tariff_cost.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {/* Tracking Numbers */}
                    {payment.tracking_numbers && payment.tracking_numbers.length > 0 && (
                      <div className="pt-2 md:pt-3 border-t border-white/5 mb-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-2">Tracking Numbers</p>
                        <div className="flex flex-wrap gap-2">
                          {payment.tracking_numbers.map((num, i) => (
                            <span 
                              key={i} 
                              className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wire Transfer Notes */}
                    {payment.wire_transfer_notes && (
                      <div className="pt-2 md:pt-3 border-t border-white/5 mb-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-2">Wire Transfer Notes</p>
                        <p className="text-white/80 text-xs md:text-sm bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 md:p-3">
                          {payment.wire_transfer_notes}
                        </p>
                      </div>
                    )}

                    {/* General Notes */}
                    {payment.notes && (
                      <div className="pt-2 md:pt-3 border-t border-white/5">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-2">Notes</p>
                        <p className="text-white/80 text-xs md:text-sm bg-white/5 rounded-lg p-2 md:p-3">
                          {payment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
      {payments.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No payments found</p>
        </div>
      )}
    </div>
  )
}

