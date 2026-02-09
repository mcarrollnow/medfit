"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Users,
  Send,
  MessageSquare,
  Search,
  Plus,
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
  Filter
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getPaymentContacts,
  getPayments,
  getPaymentStats,
  createPayment,
  getWireTransfers,
  createWireTransfer,
  updateWireTransfer,
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
import { syncPaymentsFromSheet } from "@/app/actions/payments-sync"

type Tab = 'overview' | 'customers' | 'wire-transfers' | 'messages'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  
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
  
  // Dialogs
  const [showNewPayment, setShowNewPayment] = useState(false)
  const [showNewWire, setShowNewWire] = useState(false)
  const [showTotalDetails, setShowTotalDetails] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  
  // Total details filter (separate from main date range)
  const [totalDetailsRange, setTotalDetailsRange] = useState<{ start: string; end: string }>({ start: "", end: "" })

  const loadData = useCallback(async () => {
    setLoading(true)
    
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
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      }),
      getPaymentStats({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      }),
      getWireTransfers(),
      getWireTransferStats(),
      getMessages(),
      getUnreadMessageCount('johnny')
    ])
    
    setContacts(contactsData)
    setPayments(paymentsData)
    setPaymentStats(statsData)
    setWireTransfers(wireData)
    setWireStats(wireStatsData)
    setMessages(messagesData)
    setUnreadCount(unread)
    setLoading(false)
  }, [dateRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const result = await syncPaymentsFromSheet()
      console.log('Synced:', result)
      await loadData()
    } catch (error) {
      console.error('Sync error:', error)
    }
    setSyncing(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    await sendMessage({ sender: 'admin', message: newMessage })
    setNewMessage("")
    const msgs = await getMessages()
    setMessages(msgs)
  }

  const handleMarkRead = async () => {
    await markMessagesAsRead('johnny')
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
      // Use filtered total if date range is set, otherwise use stored total
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

  // Filter payments for total details modal
  const totalDetailsPayments = useMemo(() => {
    return payments.filter(p => {
      if (totalDetailsRange.start) {
        const paymentDate = new Date(p.payment_date)
        const startDate = new Date(totalDetailsRange.start)
        if (paymentDate < startDate) return false
      }
      if (totalDetailsRange.end) {
        const paymentDate = new Date(p.payment_date)
        const endDate = new Date(totalDetailsRange.end)
        endDate.setHours(23, 59, 59, 999) // Include the end date fully
        if (paymentDate > endDate) return false
      }
      return true
    })
  }, [payments, totalDetailsRange])

  // Calculate total for details view
  const totalDetailsAmount = useMemo(() => {
    return totalDetailsPayments.reduce((sum, p) => sum + p.amount, 0)
  }, [totalDetailsPayments])

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
    { id: 'customers' as Tab, label: 'Customers', icon: Users },
    { id: 'wire-transfers' as Tab, label: 'Wire Transfers', icon: Building, badge: wireStats.pendingCount > 0 ? wireStats.pendingCount : undefined },
    { id: 'messages' as Tab, label: 'Messages', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4">Payment Records</h1>
              <p className="text-lg text-white/50">Track payments, transfers, and communications</p>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncing}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 w-full sm:w-auto h-12 px-6"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", syncing && "animate-spin")} />
              {syncing ? 'Syncing...' : 'Sync from Sheet'}
            </Button>
          </div>

          {/* Tabs - Horizontal scroll with fluid sizing */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon
                // Shorter labels for mobile
                const shortLabel = tab.id === 'wire-transfers' ? 'Wires' : tab.label
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
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
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
              {/* Total Received - Clickable */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                onClick={() => {
                  setTotalDetailsRange({ start: "", end: "" })
                  setShowTotalDetails(true)
                }}
                className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-left transition-all hover:bg-white/10 hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-bold text-white truncate">${paymentStats.totalReceived.toLocaleString()}</p>
                    <p className="text-sm text-white/50 flex items-center gap-1">
                      Total Received
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Other Stats - Static */}
              {[
                { icon: CreditCard, color: 'blue', value: paymentStats.totalPayments.toString(), label: 'Payments' },
                { icon: Users, color: 'purple', value: paymentStats.uniqueCustomers.toString(), label: 'Customers' },
                { icon: Send, color: 'orange', value: `$${wireStats.totalSent.toLocaleString()}`, label: 'Wired to Johnny' },
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
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date Range Filter
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(d => ({ ...d, start: e.target.value }))}
                  className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                />
                <span className="text-white/30 hidden sm:block">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(d => ({ ...d, end: e.target.value }))}
                  className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                />
                {(dateRange.start || dateRange.end) && (
                  <Button
                    variant="outline"
                    onClick={() => setDateRange({ start: "", end: "" })}
                    className="rounded-xl border-white/20 text-white hover:bg-white/10 h-12"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Payments
                </h3>
                <Button
                  onClick={() => setShowNewPayment(true)}
                  className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </div>
              {loading ? (
                <div className="text-center py-20 text-white/40">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin opacity-50" />
                  <p>Loading payments...</p>
                </div>
              ) : (
                <ExpandablePaymentsList payments={payments.slice(0, 15)} />
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact List - Hidden on mobile when customer is selected */}
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

            {/* Payment History - Full width on mobile when customer is selected */}
            <div className={cn(
              "lg:col-span-2",
              selectedContact ? "block" : "hidden lg:block"
            )}>
              {selectedContact ? (
                <div className="space-y-6">
                  {/* Back button - prominent on mobile */}
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
                          ${filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-white/50">
                          {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} total
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Date Range Filter */}
                  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Filter by Date
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(d => ({ ...d, start: e.target.value }))}
                        className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                      />
                      <span className="text-white/30 hidden sm:block">to</span>
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(d => ({ ...d, end: e.target.value }))}
                        className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full sm:w-48"
                      />
                      {(dateRange.start || dateRange.end) && (
                        <Button
                          variant="outline"
                          onClick={() => setDateRange({ start: "", end: "" })}
                          className="rounded-xl border-white/20 text-white hover:bg-white/10 h-12"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Payment History
                    </h4>
                    <ExpandablePaymentsList payments={filteredPayments} showContactName={false} />
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
          <WireTransfersTab 
            wireTransfers={wireTransfers}
            wireStats={wireStats}
            onNewTransfer={() => setShowNewWire(true)}
          />
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
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">J</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Johnny</p>
                  <p className="text-sm text-white/50">Payment Coordinator</p>
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
                      msg.sender === 'admin' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] md:max-w-[65%] rounded-2xl px-5 py-3",
                        msg.sender === 'admin' 
                          ? "bg-blue-500 text-white" 
                          : "bg-white/10 text-white"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={cn(
                        "text-xs mt-2",
                        msg.sender === 'admin' ? "text-blue-200" : "text-white/40"
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
                  className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-6 h-auto self-end"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* New Payment Dialog */}
        <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
          <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 text-white max-w-[95vw] sm:max-w-lg mx-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Add New Payment
              </DialogTitle>
            </DialogHeader>
            <NewPaymentForm onSuccess={() => { setShowNewPayment(false); loadData() }} />
          </DialogContent>
        </Dialog>

        {/* New Wire Transfer Dialog */}
        <Dialog open={showNewWire} onOpenChange={setShowNewWire}>
          <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 text-white max-w-[95vw] sm:max-w-lg mx-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Building className="h-5 w-5" />
                New Wire Transfer
              </DialogTitle>
            </DialogHeader>
            <NewWireForm onSuccess={() => { setShowNewWire(false); loadData() }} />
          </DialogContent>
        </Dialog>

        {/* Total Received Details Dialog */}
        <Dialog open={showTotalDetails} onOpenChange={setShowTotalDetails}>
          <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 text-white max-w-[95vw] sm:max-w-4xl mx-auto rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Total Received Details
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Summary Card */}
              <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">
                      {totalDetailsRange.start || totalDetailsRange.end 
                        ? 'Total for Selected Period' 
                        : 'All Time Total'}
                    </p>
                    <p className="text-4xl font-bold text-green-400">
                      ${totalDetailsAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      {totalDetailsPayments.length} transaction{totalDetailsPayments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {(totalDetailsRange.start || totalDetailsRange.end) && (
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-white/40 mb-1">Date Range</p>
                      <p className="text-white font-medium">
                        {totalDetailsRange.start ? new Date(totalDetailsRange.start).toLocaleDateString() : 'Start'} 
                        {' — '}
                        {totalDetailsRange.end ? new Date(totalDetailsRange.end).toLocaleDateString() : 'End'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Filter */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filter by Date
                </h4>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-white/50 mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={totalDetailsRange.start}
                      onChange={(e) => setTotalDetailsRange(d => ({ ...d, start: e.target.value }))}
                      className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full"
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-white/50 mb-2">End Date</label>
                    <Input
                      type="date"
                      value={totalDetailsRange.end}
                      onChange={(e) => setTotalDetailsRange(d => ({ ...d, end: e.target.value }))}
                      className="rounded-xl bg-white/5 border-white/10 text-white h-12 w-full"
                    />
                  </div>
                  {(totalDetailsRange.start || totalDetailsRange.end) && (
                    <Button
                      variant="outline"
                      onClick={() => setTotalDetailsRange({ start: "", end: "" })}
                      className="rounded-xl border-white/20 text-white hover:bg-white/10 h-12 mt-auto"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Transactions List */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transactions ({totalDetailsPayments.length})
                </h4>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                  {totalDetailsPayments.length > 0 ? (
                    totalDetailsPayments.map((payment, index) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {payment.contact_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{payment.contact_name}</p>
                            <p className="text-xs text-white/50">
                              {new Date(payment.payment_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              {payment.payment_method && (
                                <span className="ml-2 text-white/40">• {payment.payment_method}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-green-400">
                            ${payment.amount.toLocaleString()}
                          </p>
                          {payment.confirmed && (
                            <div className="flex items-center gap-1 justify-end">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <span className="text-[10px] text-green-400">Confirmed</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/40">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found for this period</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Expandable Payments List Component
function ExpandablePaymentsList({ 
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

  // Get payment method color
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
        const hasDetails = payment.notes || payment.received_minus_fee

        return (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all hover:bg-white/[0.07]"
          >
            {/* Main Row - Clickable */}
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
                  <p className="text-base md:text-lg font-bold text-green-400">
                    ${payment.amount.toLocaleString()}
                  </p>
                  {payment.confirmed && (
                    <div className="flex items-center gap-1 justify-end">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-[10px] md:text-xs text-green-400 hidden sm:inline">Confirmed</span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                      {/* Amount Details */}
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Amount Sent</p>
                        <p className="text-white font-semibold text-sm md:text-base">${payment.amount.toLocaleString()}</p>
                      </div>
                      
                      {/* Received Minus Fee */}
                      <div className="rounded-lg bg-white/5 p-2 md:p-3">
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Received (minus fee)</p>
                        <p className="text-white font-semibold text-sm md:text-base">
                          {payment.received_minus_fee 
                            ? `$${payment.received_minus_fee.toLocaleString()}` 
                            : '—'}
                        </p>
                      </div>
                      
                      {/* Fee Amount */}
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
                    </div>

                    {/* Payment Info Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                      <div>
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-white text-xs md:text-sm">
                          {new Date(payment.payment_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Method</p>
                        <p className="text-white text-xs md:text-sm">{payment.payment_method || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-1">
                          {payment.confirmed ? (
                            <>
                              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
                              <span className="text-green-400 text-xs md:text-sm">Confirmed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />
                              <span className="text-yellow-400 text-xs md:text-sm">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                      {showContactName && (
                        <div>
                          <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">Customer</p>
                          <p className="text-white text-xs md:text-sm">{payment.contact_name}</p>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
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

// Wire Transfers Tab with Expandable Cards
function WireTransfersTab({ 
  wireTransfers, 
  wireStats, 
  onNewTransfer 
}: { 
  wireTransfers: WireTransfer[]
  wireStats: { totalSent: number; pendingAmount: number; completedCount: number; pendingCount: number }
  onNewTransfer: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building className="h-5 w-5" />
            Wire Transfers to Johnny
          </h3>
          <Button
            onClick={onNewTransfer}
            className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Button>
        </div>
        <div className="space-y-4">
          {wireTransfers.map((transfer, index) => {
            const isExpanded = expandedId === transfer.id
            const hasDetails = (transfer.transaction_numbers && transfer.transaction_numbers.length > 0) || 
                              transfer.tariff_cost || 
                              transfer.tariff_notes ||
                              transfer.notes ||
                              transfer.bank_reference

            return (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all hover:bg-white/[0.07]"
              >
                {/* Main Row - Clickable */}
                <div
                  onClick={() => hasDetails && toggleExpand(transfer.id)}
                  className={cn(
                    "flex items-center justify-between p-3 md:p-4 gap-2",
                    hasDetails && "cursor-pointer hover:bg-white/5"
                  )}
                >
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
                      <div className="flex items-center gap-1 md:gap-2">
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
                        {hasDetails && (
                          <ChevronRight 
                            className={cn(
                              "h-3 w-3 md:h-4 md:w-4 text-white/40 transition-transform",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        )}
                      </div>
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

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && hasDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 md:px-4 pb-3 md:pb-4 pt-2 border-t border-white/10 space-y-3 md:space-y-4">
                        {/* Transaction Numbers */}
                        {transfer.transaction_numbers && transfer.transaction_numbers.length > 0 && (
                          <div>
                            <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-2">
                              Transaction Numbers
                            </p>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {transfer.transaction_numbers.map((num, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className="font-mono text-white/80 border-white/20 text-[10px] md:text-xs"
                                >
                                  {num}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tariff Info */}
                        {(transfer.tariff_cost || transfer.tariff_notes) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {transfer.tariff_cost && (
                              <div>
                                <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">
                                  Tariff Cost
                                </p>
                                <p className="text-white font-semibold text-sm md:text-base">
                                  ${transfer.tariff_cost.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {transfer.tariff_notes && (
                              <div>
                                <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">
                                  Tariff Notes
                                </p>
                                <p className="text-white/80 text-xs md:text-sm">
                                  {transfer.tariff_notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bank Reference */}
                        {transfer.bank_reference && (
                          <div>
                            <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">
                              Bank Reference
                            </p>
                            <p className="text-white/80 font-mono text-xs md:text-sm break-all">
                              {transfer.bank_reference}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {transfer.notes && (
                          <div>
                            <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mb-1">
                              Notes
                            </p>
                            <p className="text-white/80 text-xs md:text-sm">
                              {transfer.notes}
                            </p>
                          </div>
                        )}

                        {/* Balance Info */}
                        {transfer.total_left_to_transfer !== null && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-white/50 text-xs md:text-sm">Remaining Balance</span>
                              <span className="text-white font-semibold text-sm md:text-base">
                                ${transfer.total_left_to_transfer.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
          {wireTransfers.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No wire transfers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// New Payment Form Component
function NewPaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    contact_name: "",
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: "",
    amount: "",
    notes: ""
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const result = await createPayment({
      contact_name: formData.contact_name,
      payment_date: formData.payment_date,
      payment_method: formData.payment_method || undefined,
      amount: parseFloat(formData.amount),
      notes: formData.notes || undefined
    })

    setSaving(false)
    if (result.success) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/50 mb-2">Customer Name</label>
        <Input
          value={formData.contact_name}
          onChange={(e) => setFormData(d => ({ ...d, contact_name: e.target.value }))}
          required
          placeholder="Enter customer name..."
          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-2">Date</label>
          <Input
            type="date"
            value={formData.payment_date}
            onChange={(e) => setFormData(d => ({ ...d, payment_date: e.target.value }))}
            required
            className="rounded-xl bg-white/5 border-white/10 text-white h-12"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Amount</label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(d => ({ ...d, amount: e.target.value }))}
            required
            placeholder="0.00"
            className="rounded-xl bg-white/5 border-white/10 text-white h-12"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-white/50 mb-2">Payment Method</label>
        <Select 
          value={formData.payment_method} 
          onValueChange={(v) => setFormData(d => ({ ...d, payment_method: v }))}
        >
          <SelectTrigger className="rounded-xl bg-white/5 border-white/10 text-white h-12">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Zelle">Zelle</SelectItem>
            <SelectItem value="Venmo">Venmo</SelectItem>
            <SelectItem value="Cashapp">Cash App</SelectItem>
            <SelectItem value="PayPal">PayPal</SelectItem>
            <SelectItem value="Wire">Wire Transfer</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm text-white/50 mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(d => ({ ...d, notes: e.target.value }))}
          placeholder="Optional notes..."
          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none min-h-[80px]"
          rows={3}
        />
      </div>
      <Button 
        type="submit" 
        disabled={saving}
        className="w-full rounded-xl bg-white text-black hover:bg-white/90 h-12 font-medium"
      >
        {saving ? 'Saving...' : 'Add Payment'}
      </Button>
    </form>
  )
}

// New Wire Transfer Form Component
function NewWireForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    amount: "",
    transfer_date: new Date().toISOString().split('T')[0],
    bank_reference: "",
    notes: ""
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const result = await createWireTransfer({
      amount: parseFloat(formData.amount),
      transfer_date: formData.transfer_date,
      bank_reference: formData.bank_reference || undefined,
      notes: formData.notes || undefined
    })

    setSaving(false)
    if (result.success) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-2">Amount</label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(d => ({ ...d, amount: e.target.value }))}
            required
            placeholder="0.00"
            className="rounded-xl bg-white/5 border-white/10 text-white h-12"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-2">Date</label>
          <Input
            type="date"
            value={formData.transfer_date}
            onChange={(e) => setFormData(d => ({ ...d, transfer_date: e.target.value }))}
            required
            className="rounded-xl bg-white/5 border-white/10 text-white h-12"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-white/50 mb-2">Bank Reference</label>
        <Input
          value={formData.bank_reference}
          onChange={(e) => setFormData(d => ({ ...d, bank_reference: e.target.value }))}
          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
          placeholder="Optional reference number..."
        />
      </div>
      <div>
        <label className="block text-sm text-white/50 mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(d => ({ ...d, notes: e.target.value }))}
          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none min-h-[80px]"
          placeholder="Optional notes..."
          rows={3}
        />
      </div>
      <Button 
        type="submit" 
        disabled={saving}
        className="w-full rounded-xl bg-white text-black hover:bg-white/90 h-12 font-medium"
      >
        {saving ? 'Saving...' : 'Record Transfer'}
      </Button>
    </form>
  )
}

