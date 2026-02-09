"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Link2,
  DollarSign,
  TrendingUp,
  Search,
  Copy,
  Check,
  RefreshCw,
  Gift,
  ShoppingBag,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllReferralData, getReferredCustomers, updateCustomReferralDiscount, generateReferralCode, backSyncReferralOrders, type ReferredCustomer } from "@/app/actions/referrals"
import { DEFAULT_REFERRAL_DISCOUNT, REFERRAL_DISCOUNTS } from "@/lib/referral-tiers"
import type { RewardTier } from "@/types"

interface ReferrerData {
  customerId: string
  customerName: string
  referralCode: string | null
  tier: RewardTier
  customDiscount: number | null
  effectiveDiscount: number
  totalReferrals: number
  totalSales: number
}

export default function AdminReferralsPage() {
  const [loading, setLoading] = useState(true)
  const [referrers, setReferrers] = useState<ReferrerData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedReferrer, setExpandedReferrer] = useState<string | null>(null)
  const [referredCustomers, setReferredCustomers] = useState<Record<string, ReferredCustomer[]>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null)
  const [discountInput, setDiscountInput] = useState("")
  const [savingDiscount, setSavingDiscount] = useState(false)
  const [generatingCode, setGeneratingCode] = useState<string | null>(null)
  const [showAllCustomers, setShowAllCustomers] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ processed: number; created: number; skipped: number } | null>(null)
  const [stats, setStats] = useState({
    totalReferrers: 0,
    totalReferrals: 0,
    totalSales: 0,
    avgReferralsPerUser: 0,
  })

  useEffect(() => {
    loadData()
  }, [showAllCustomers])

  async function loadData() {
    setLoading(true)
    const { referrers: data, error } = await getAllReferralData(showAllCustomers)

    if (!error && data) {
      setReferrers(data)

      const withCodes = data.filter(r => r.referralCode)
      const totalReferrals = data.reduce((sum, r) => sum + r.totalReferrals, 0)
      const totalSales = data.reduce((sum, r) => sum + r.totalSales, 0)
      setStats({
        totalReferrers: withCodes.length,
        totalReferrals,
        totalSales,
        avgReferralsPerUser: withCodes.length > 0 ? totalReferrals / withCodes.length : 0,
      })
    }
    setLoading(false)
  }

  async function loadReferredCustomers(referrerId: string) {
    if (referredCustomers[referrerId]) return

    const { customers, error } = await getReferredCustomers(referrerId)
    if (!error) {
      setReferredCustomers((prev) => ({ ...prev, [referrerId]: customers }))
    }
  }

  function handleExpand(referrerId: string) {
    if (expandedReferrer === referrerId) {
      setExpandedReferrer(null)
    } else {
      setExpandedReferrer(referrerId)
      loadReferredCustomers(referrerId)
    }
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  function startEditDiscount(referrer: ReferrerData) {
    setEditingDiscount(referrer.customerId)
    setDiscountInput(referrer.customDiscount?.toString() || "")
  }

  async function saveDiscount(customerId: string) {
    setSavingDiscount(true)

    // If input is empty, reset to default (null)
    const newDiscount = discountInput.trim() === "" ? null : parseInt(discountInput)

    // Validate
    if (newDiscount !== null && (isNaN(newDiscount) || newDiscount < 1 || newDiscount > 100)) {
      alert("Please enter a valid discount between 1 and 100, or leave empty for default (15%)")
      setSavingDiscount(false)
      return
    }

    const { success, error } = await updateCustomReferralDiscount(customerId, newDiscount)

    if (success) {
      // Update local state
      setReferrers(prev => prev.map(r =>
        r.customerId === customerId
          ? { ...r, customDiscount: newDiscount, effectiveDiscount: newDiscount ?? DEFAULT_REFERRAL_DISCOUNT }
          : r
      ))
      setEditingDiscount(null)
    } else {
      alert(error || "Failed to update discount")
    }

    setSavingDiscount(false)
  }

  function cancelEditDiscount() {
    setEditingDiscount(null)
    setDiscountInput("")
  }

  async function handleBackSync() {
    setSyncing(true)
    setSyncResult(null)

    const result = await backSyncReferralOrders()

    if (result.success) {
      setSyncResult({
        processed: result.processed,
        created: result.created,
        skipped: result.skipped,
      })
      // Reload data to show updated stats
      loadData()
    } else {
      alert(result.errors.join("\n") || "Failed to sync")
    }

    setSyncing(false)
  }

  async function handleGenerateCode(customerId: string) {
    setGeneratingCode(customerId)
    const { success, code, error } = await generateReferralCode(customerId)

    if (success && code) {
      // Update local state
      setReferrers(prev => prev.map(r =>
        r.customerId === customerId
          ? { ...r, referralCode: code }
          : r
      ))
    } else {
      alert(error || "Failed to generate code")
    }

    setGeneratingCode(null)
  }

  const filteredReferrers = referrers.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.referralCode && r.referralCode.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const tierColors: Record<RewardTier, string> = {
    Free: "text-zinc-400",
    Bronze: "text-amber-600",
    Silver: "text-zinc-300",
    Gold: "text-yellow-400",
    Platinum: "text-cyan-300",
    Diamond: "text-purple-400",
  }

  const tierBgColors: Record<RewardTier, string> = {
    Free: "bg-zinc-500/20",
    Bronze: "bg-amber-600/20",
    Silver: "bg-zinc-400/20",
    Gold: "bg-yellow-400/20",
    Platinum: "bg-cyan-400/20",
    Diamond: "bg-purple-400/20",
  }

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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Referral Management</h1>
          <p className="text-lg text-white/50">Track and manage customer referral codes and their performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Total Referrers</p>
            <p className="text-3xl font-bold text-white">{stats.totalReferrers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Total Referrals</p>
            <p className="text-3xl font-bold text-white">{stats.totalReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Referred Sales</p>
            <p className="text-3xl font-bold text-green-400">${stats.totalSales.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Avg Referrals</p>
            <p className="text-3xl font-bold text-white">{stats.avgReferralsPerUser.toFixed(1)}</p>
          </motion.div>
        </div>

        {/* Default Discount Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Referral Discount System</h2>
              <p className="text-sm text-white/50">Default discount is {DEFAULT_REFERRAL_DISCOUNT}%. Click on any referrer's discount to customize it.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/20 border border-green-500/30 px-4 py-3 text-center">
                <p className="text-xs text-green-400/80 uppercase tracking-wider mb-1">Default</p>
                <p className="text-2xl font-bold text-green-400">{DEFAULT_REFERRAL_DISCOUNT}%</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-white/40 mb-4">
            Tip: Set a custom discount percentage for individual customers to offer them special rates (e.g., influencers, top referrers).
          </p>

          {/* Back Sync Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Back-Sync Orders</p>
                <p className="text-xs text-white/40">Create referral tracking records for all past orders from referred customers</p>
              </div>
              <Button
                onClick={handleBackSync}
                disabled={syncing}
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
            {syncResult && (
              <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm">
                <p className="text-green-400">
                  Sync complete: {syncResult.created} records created, {syncResult.skipped} skipped (already exist), {syncResult.processed} orders processed
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search by name or referral code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowAllCustomers(!showAllCustomers)
              // Reload will happen via useEffect
            }}
            className={`h-12 rounded-xl border-white/20 ${showAllCustomers ? 'bg-white/10 text-white' : 'bg-transparent text-white/60'}`}
          >
            {showAllCustomers ? 'Showing All Customers' : 'Showing With Codes Only'}
          </Button>
        </div>

        {/* Referrers List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">All Referrers</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredReferrers.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Link2 className="w-10 h-10 text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No referral codes found</h3>
              <p className="text-white/50">Customers will get referral codes when they access the referral section</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReferrers.map((referrer, index) => (
                <motion.div
                  key={referrer.customerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/[0.07] transition-all duration-300"
                >
                  {/* Referrer Header */}
                  <div className="w-full p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between text-left gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${tierBgColors[referrer.tier]} flex items-center justify-center cursor-pointer`}
                        onClick={() => handleExpand(referrer.customerId)}
                      >
                        <span className={`text-lg font-bold ${tierColors[referrer.tier]}`}>
                          {referrer.customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div
                          className="flex items-center gap-3 flex-wrap cursor-pointer"
                          onClick={() => handleExpand(referrer.customerId)}
                        >
                          <h3 className="text-lg font-semibold text-white">{referrer.customerName}</h3>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-lg ${tierBgColors[referrer.tier]} ${tierColors[referrer.tier]}`}>
                            {referrer.tier}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {referrer.referralCode ? (
                            <>
                              <code className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono text-white/80">
                                {referrer.referralCode}
                              </code>
                              <button
                                onClick={() => copyCode(referrer.referralCode!)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                {copiedCode === referrer.referralCode ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-white/40" />
                                )}
                              </button>
                              {/* Editable Discount */}
                              {editingDiscount === referrer.customerId ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={discountInput}
                                    onChange={(e) => setDiscountInput(e.target.value)}
                                    placeholder={DEFAULT_REFERRAL_DISCOUNT.toString()}
                                    className="w-20 h-8 text-sm bg-white/10 border-white/20 text-white rounded-lg px-2"
                                    autoFocus
                                  />
                                  <span className="text-white/40">%</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => saveDiscount(referrer.customerId)}
                                    disabled={savingDiscount}
                                    className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={cancelEditDiscount}
                                    className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/10"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditDiscount(referrer)}
                                  className={`text-sm px-2 py-1 rounded-lg transition-colors hover:bg-white/10 ${
                                    referrer.customDiscount !== null
                                      ? "text-purple-400 bg-purple-500/20"
                                      : "text-green-400"
                                  }`}
                                  title="Click to edit discount"
                                >
                                  {referrer.effectiveDiscount}% discount
                                  {referrer.customDiscount !== null && (
                                    <span className="ml-1 text-xs text-purple-300">(custom)</span>
                                  )}
                                </button>
                              )}
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateCode(referrer.customerId)}
                              disabled={generatingCode === referrer.customerId}
                              className="h-8 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-lg"
                            >
                              {generatingCode === referrer.customerId ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Link2 className="w-4 h-4 mr-2" />
                              )}
                              Generate Code
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-6 cursor-pointer"
                      onClick={() => handleExpand(referrer.customerId)}
                    >
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{referrer.totalReferrals}</p>
                        <p className="text-xs text-white/50 uppercase">Referrals</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">${referrer.totalSales.toFixed(2)}</p>
                        <p className="text-xs text-white/50 uppercase">Sales</p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-white/40 transition-transform duration-300 ${
                          expandedReferrer === referrer.customerId ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Content - Referred Customers */}
                  <AnimatePresence>
                    {expandedReferrer === referrer.customerId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 space-y-4">
                          <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                            Referred Customers
                          </h4>

                          {!referredCustomers[referrer.customerId] ? (
                            <div className="flex items-center justify-center py-8">
                              <RefreshCw className="w-5 h-5 animate-spin text-white/40" />
                            </div>
                          ) : referredCustomers[referrer.customerId].length === 0 ? (
                            <p className="text-white/40 text-center py-4">No referred customers yet</p>
                          ) : (
                            <div className="space-y-3">
                              {referredCustomers[referrer.customerId].map((customer) => (
                                <div key={customer.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                  <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                      <p className="font-medium text-white">{customer.name}</p>
                                      <p className="text-sm text-white/50">{customer.email}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-white/50">Signed up</p>
                                      <p className="text-sm text-white">
                                        {customer.signupDate
                                          ? new Date(customer.signupDate).toLocaleDateString()
                                          : "Unknown"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                      <ShoppingBag className="w-4 h-4 text-white/40" />
                                      <span className="text-sm text-white">
                                        <span className="font-semibold">{customer.totalOrders}</span>
                                        <span className="text-white/50"> orders</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-green-400" />
                                      <span className="text-sm">
                                        <span className="font-semibold text-green-400">
                                          ${customer.totalSpent.toFixed(2)}
                                        </span>
                                        <span className="text-white/50"> spent</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
