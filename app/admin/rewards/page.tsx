"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Zap, Users, Plus, Trash2, Check, X, Crown, ChevronDown, Calendar, Search, Edit2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  getTierConfig,
  updateTierConfig,
  getRedeemableRewards,
  createRedeemableReward,
  updateRedeemableReward,
  deleteRedeemableReward,
  getPointsPromos,
  createPointsPromo,
  updatePointsPromo,
  deletePointsPromo,
  adjustCustomerPoints,
  getPointsAdjustments,
  getCustomersWithPoints,
  getProductsForPromo,
  getRewardsStats,
  type TierConfig,
  type RedeemableReward,
  type PointsPromo,
  type PointsAdjustment,
} from "@/app/actions/rewards-admin"

type ActiveSection = "tiers" | "rewards" | "promos" | "customers" | "history"

export default function AdminRewardsPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("tiers")
  const [loading, setLoading] = useState(true)

  // Data states
  const [tiers, setTiers] = useState<Record<string, TierConfig>>({})
  const [rewards, setRewards] = useState<RedeemableReward[]>([])
  const [promos, setPromos] = useState<PointsPromo[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [adjustments, setAdjustments] = useState<PointsAdjustment[]>([])
  const [stats, setStats] = useState<any>(null)

  // UI states
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [editingReward, setEditingReward] = useState<string | null>(null)
  const [showNewReward, setShowNewReward] = useState(false)
  const [showNewPromo, setShowNewPromo] = useState(false)
  const [editingPromo, setEditingPromo] = useState<string | null>(null)
  const [adjustingCustomer, setAdjustingCustomer] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [tiersData, rewardsData, promosData, customersData, productsData, adjustmentsData, statsData] =
      await Promise.all([
        getTierConfig(),
        getRedeemableRewards(),
        getPointsPromos(),
        getCustomersWithPoints(),
        getProductsForPromo(),
        getPointsAdjustments(),
        getRewardsStats(),
      ])

    setTiers(tiersData)
    setRewards(rewardsData)
    setPromos(promosData)
    setCustomers(customersData)
    setProducts(productsData)
    setAdjustments(adjustmentsData)
    setStats(statsData)
    setLoading(false)
  }

  const sections = [
    { id: "tiers" as const, label: "Tiers", icon: Crown },
    { id: "rewards" as const, label: "Rewards", icon: Gift },
    { id: "promos" as const, label: "Promos", icon: Zap },
    { id: "customers" as const, label: "Customers", icon: Users },
    { id: "history" as const, label: "History", icon: Calendar },
  ]

  const filteredCustomers = customers.filter(
    (c) =>
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Rewards Management</h1>
          <p className="text-lg text-white/50">Configure tiers, rewards, promos, and manage customer points</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Total Issued</p>
              <p className="text-3xl font-bold text-white">{stats.totalPointsIssued?.toLocaleString() || 0}</p>
              <p className="text-sm text-white/40">points</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Total Redeemed</p>
              <p className="text-3xl font-bold text-emerald-400">{stats.totalPointsRedeemed?.toLocaleString() || 0}</p>
              <p className="text-sm text-white/40">points</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Active Promos</p>
              <p className="text-3xl font-bold text-amber-400">{stats.activePromos || 0}</p>
              <p className="text-sm text-white/40">running now</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Available Rewards</p>
              <p className="text-3xl font-bold text-white">{stats.activeRewards || 0}</p>
              <p className="text-sm text-white/40">to redeem</p>
            </motion.div>
          </div>
        )}

        {/* Section Tabs - Mobile Dropdown */}
        <div className="lg:hidden mb-8">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as ActiveSection)}
            className="h-14 w-full rounded-xl bg-white/5 border border-white/10 text-white px-4"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id} className="bg-black">
                {section.label}
              </option>
            ))}
          </select>
        </div>

        {/* Section Tabs - Desktop */}
        <div className="hidden lg:flex gap-3 mb-10">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`h-12 px-5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            )
          })}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "tiers" && (
              <TiersSection
                tiers={tiers}
                setTiers={setTiers}
                editingTier={editingTier}
                setEditingTier={setEditingTier}
                onReload={loadData}
              />
            )}
            {activeSection === "rewards" && (
              <RewardsSection
                rewards={rewards}
                setRewards={setRewards}
                editingReward={editingReward}
                setEditingReward={setEditingReward}
                showNewReward={showNewReward}
                setShowNewReward={setShowNewReward}
                onReload={loadData}
              />
            )}
            {activeSection === "promos" && (
              <PromosSection
                promos={promos}
                setPromos={setPromos}
                products={products}
                tiers={tiers}
                editingPromo={editingPromo}
                setEditingPromo={setEditingPromo}
                showNewPromo={showNewPromo}
                setShowNewPromo={setShowNewPromo}
                onReload={loadData}
              />
            )}
            {activeSection === "customers" && (
              <CustomersSection
                customers={filteredCustomers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                adjustingCustomer={adjustingCustomer}
                setAdjustingCustomer={setAdjustingCustomer}
                onReload={loadData}
              />
            )}
            {activeSection === "history" && <HistorySection adjustments={adjustments} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Tiers Section Component
function TiersSection({
  tiers,
  setTiers,
  editingTier,
  setEditingTier,
  onReload,
}: {
  tiers: Record<string, TierConfig>
  setTiers: (tiers: Record<string, TierConfig>) => void
  editingTier: string | null
  setEditingTier: (tier: string | null) => void
  onReload: () => void
}) {
  const [localTiers, setLocalTiers] = useState(tiers)
  const [saving, setSaving] = useState(false)
  const [tierRenames, setTierRenames] = useState<Record<string, string>>({})

  useEffect(() => {
    setLocalTiers(tiers)
    setTierRenames({})
  }, [tiers])

  const handleSave = async () => {
    setSaving(true)
    
    // Apply renames: create new object with renamed keys
    const renamedTiers: Record<string, TierConfig> = {}
    for (const [oldName, config] of Object.entries(localTiers)) {
      const newName = tierRenames[oldName] || oldName
      renamedTiers[newName] = config
    }
    
    const result = await updateTierConfig(renamedTiers)
    if (result.success) {
      setTiers(renamedTiers)
      setEditingTier(null)
      setTierRenames({})
      onReload()
    }
    setSaving(false)
  }

  // Sort tiers by minSpend instead of hardcoded order
  const tierOrder = Object.entries(localTiers)
    .sort((a, b) => a[1].minSpend - b[1].minSpend)
    .map(([name]) => name)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Tier Configuration</h2>
        {editingTier && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setLocalTiers(tiers)
                setTierRenames({})
                setEditingTier(null)
              }}
              className="h-12 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="h-12 rounded-xl bg-white text-black hover:bg-white/90">
              <Check className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {tierOrder.map((tierName, index) => {
          const tier = localTiers[tierName]
          if (!tier) return null
          const isEditing = editingTier === tierName

          return (
            <motion.div
              key={tierName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-6 hover:bg-white/[0.03] transition-colors"
                onClick={() => setEditingTier(isEditing ? null : tierName)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${tier.color}20` }}
                  >
                    <Crown className="h-7 w-7" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: tier.color }}>
                      {tierRenames[tierName] || tierName}
                      {tierRenames[tierName] && tierRenames[tierName] !== tierName && (
                        <span className="ml-2 text-xs text-amber-400 font-normal">(renamed)</span>
                      )}
                    </h3>
                    <p className="text-sm text-white/50">
                      ${tier.minSpend.toLocaleString()} - {tier.maxSpend ? `$${tier.maxSpend.toLocaleString()}` : "∞"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: tier.color }}>
                      {tier.pointsPerDollar}x
                    </p>
                    <p className="text-xs text-white/50">points/dollar</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-white/40 transition-transform duration-300 ${isEditing ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="space-y-6 p-6">
                      {/* Tier Name */}
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                          Tier Name
                        </label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="text"
                            value={tierRenames[tierName] ?? tierName}
                            onChange={(e) => {
                              const newName = e.target.value.trim()
                              if (newName) {
                                setTierRenames({ ...tierRenames, [tierName]: newName })
                              }
                            }}
                            placeholder="Enter tier name"
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white flex-1"
                          />
                          <Edit2 className="h-5 w-5 text-white/40" />
                        </div>
                        {tierRenames[tierName] && tierRenames[tierName] !== tierName && (
                          <p className="mt-2 text-xs text-amber-400">
                            Will rename from "{tierName}" to "{tierRenames[tierName]}"
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                            Min Spend ($)
                          </label>
                          <Input
                            type="number"
                            value={tier.minSpend}
                            onChange={(e) =>
                              setLocalTiers({
                                ...localTiers,
                                [tierName]: { ...tier, minSpend: Number.parseInt(e.target.value) || 0 },
                              })
                            }
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                            Max Spend ($)
                          </label>
                          <Input
                            type="number"
                            value={tier.maxSpend || ""}
                            placeholder="Unlimited"
                            onChange={(e) =>
                              setLocalTiers({
                                ...localTiers,
                                [tierName]: {
                                  ...tier,
                                  maxSpend: e.target.value ? Number.parseInt(e.target.value) : null,
                                },
                              })
                            }
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                            Points Multiplier
                          </label>
                          <Input
                            type="number"
                            step="0.25"
                            value={tier.pointsPerDollar}
                            onChange={(e) =>
                              setLocalTiers({
                                ...localTiers,
                                [tierName]: { ...tier, pointsPerDollar: Number.parseFloat(e.target.value) || 1 },
                              })
                            }
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                          Tier Color
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={tier.color}
                            onChange={(e) =>
                              setLocalTiers({
                                ...localTiers,
                                [tierName]: { ...tier, color: e.target.value },
                              })
                            }
                            className="h-12 w-12 cursor-pointer rounded-xl border border-white/10 bg-transparent"
                          />
                          <Input
                            value={tier.color}
                            onChange={(e) =>
                              setLocalTiers({
                                ...localTiers,
                                [tierName]: { ...tier, color: e.target.value },
                              })
                            }
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white flex-1 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                          Benefits (one per line)
                        </label>
                        <Textarea
                          value={tier.benefits.join("\n")}
                          onChange={(e) =>
                            setLocalTiers({
                              ...localTiers,
                              [tierName]: { ...tier, benefits: e.target.value.split("\n").filter((b) => b.trim()) },
                            })
                          }
                          rows={5}
                          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Rewards Section Component
function RewardsSection({
  rewards,
  setRewards,
  showNewReward,
  setShowNewReward,
  editingReward,
  setEditingReward,
  onReload,
}: {
  rewards: RedeemableReward[]
  setRewards: (rewards: RedeemableReward[]) => void
  showNewReward: boolean
  setShowNewReward: (show: boolean) => void
  editingReward: string | null
  setEditingReward: (id: string | null) => void
  onReload: () => void
}) {
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    points_cost: 100,
    reward_type: "discount",
    reward_value: {},
    is_active: true,
    tier_required: null as string | null,
    sort_order: 0,
  })
  const [saving, setSaving] = useState(false)

  const handleDeleteReward = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return
    await deleteRedeemableReward(id)
    onReload()
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateRedeemableReward(id, { is_active: !isActive })
    onReload()
  }

  const handleCreateReward = async () => {
    if (!newReward.name || newReward.points_cost <= 0) return
    setSaving(true)
    const result = await createRedeemableReward({
      name: newReward.name,
      description: newReward.description || null,
      points_cost: newReward.points_cost,
      reward_type: newReward.reward_type,
      reward_value: newReward.reward_value,
      image_url: null,
      is_active: newReward.is_active,
      stock_limit: null,
      tier_required: newReward.tier_required,
      sort_order: newReward.sort_order,
    })
    if (result.success) {
      setShowNewReward(false)
      setNewReward({
        name: "",
        description: "",
        points_cost: 100,
        reward_type: "discount",
        reward_value: {},
        is_active: true,
        tier_required: null,
        sort_order: 0,
      })
      onReload()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Redeemable Rewards</h2>
        <Button onClick={() => setShowNewReward(true)} className="h-12 rounded-xl bg-white text-black hover:bg-white/90">
          <Plus className="mr-2 h-4 w-4" /> Add Reward
        </Button>
      </div>

      {/* Create New Reward Form */}
      <AnimatePresence>
        {showNewReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create New Reward</h3>
              <button
                onClick={() => setShowNewReward(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Reward Name *
                  </label>
                  <Input
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="e.g. $10 Off Coupon"
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Points Cost *
                  </label>
                  <Input
                    type="number"
                    value={newReward.points_cost}
                    onChange={(e) => setNewReward({ ...newReward, points_cost: Number.parseInt(e.target.value) || 0 })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Description
                </label>
                <Textarea
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  placeholder="Describe what this reward offers..."
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Reward Type
                  </label>
                  <select
                    value={newReward.reward_type}
                    onChange={(e) => setNewReward({ ...newReward, reward_type: e.target.value })}
                    className="h-12 w-full rounded-xl bg-white/5 border border-white/10 text-white px-4"
                  >
                    <option value="discount" className="bg-black">Discount</option>
                    <option value="free_shipping" className="bg-black">Free Shipping</option>
                    <option value="free_product" className="bg-black">Free Product</option>
                    <option value="store_credit" className="bg-black">Store Credit</option>
                    <option value="exclusive_access" className="bg-black">Exclusive Access</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Tier Required
                  </label>
                  <select
                    value={newReward.tier_required || ""}
                    onChange={(e) => setNewReward({ ...newReward, tier_required: e.target.value || null })}
                    className="h-12 w-full rounded-xl bg-white/5 border border-white/10 text-white px-4"
                  >
                    <option value="" className="bg-black">All Tiers</option>
                    <option value="Bronze" className="bg-black">Bronze+</option>
                    <option value="Silver" className="bg-black">Silver+</option>
                    <option value="Gold" className="bg-black">Gold+</option>
                    <option value="Platinum" className="bg-black">Platinum+</option>
                    <option value="Diamond" className="bg-black">Diamond</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateReward}
                  disabled={saving || !newReward.name || newReward.points_cost <= 0}
                  className="h-12 rounded-xl bg-white text-black hover:bg-white/90"
                >
                  {saving ? "Creating..." : "Create Reward"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewReward(false)}
                  className="h-12 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards List */}
      <div className="space-y-4">
        {rewards.length === 0 && !showNewReward ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Gift className="h-10 w-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No rewards created yet</h3>
            <p className="text-white/50">Create your first redeemable reward to get started</p>
          </div>
        ) : (
          rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${reward.is_active ? "bg-emerald-500/20" : "bg-white/10"}`}
                  >
                    <Gift className={`h-7 w-7 ${reward.is_active ? "text-emerald-400" : "text-white/40"}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{reward.name}</h3>
                    <p className="text-sm text-white/50">{reward.description || "No description"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/60">
                        {reward.reward_type}
                      </span>
                      {reward.tier_required && (
                        <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs text-amber-400">
                          {reward.tier_required}+
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{reward.points_cost.toLocaleString()}</p>
                    <p className="text-xs text-white/50">points</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(reward.id, reward.is_active)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${reward.is_active ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-white/10 text-white/40 hover:bg-white/20"}`}
                  >
                    {reward.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="rounded-xl p-3 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// Promos Section Component
function PromosSection({
  promos,
  setPromos,
  products,
  tiers,
  showNewPromo,
  setShowNewPromo,
  editingPromo,
  setEditingPromo,
  onReload,
}: {
  promos: PointsPromo[]
  setPromos: (promos: PointsPromo[]) => void
  products: any[]
  tiers: Record<string, TierConfig>
  showNewPromo: boolean
  setShowNewPromo: (show: boolean) => void
  editingPromo: string | null
  setEditingPromo: (id: string | null) => void
  onReload: () => void
}) {
  const [newPromo, setNewPromo] = useState({
    name: "",
    description: "",
    promo_type: "multiplier",
    multiplier: 2,
    bonus_points: 50,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    is_active: true,
    applies_to: "all",
    target_ids: [] as string[],
    target_tiers: [] as string[],
    min_order_amount: 0,
    max_uses: null as number | null,
  })
  const [saving, setSaving] = useState(false)

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo?")) return
    await deletePointsPromo(id)
    onReload()
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updatePointsPromo(id, { is_active: !isActive })
    onReload()
  }

  const handleCreatePromo = async () => {
    if (!newPromo.name) return
    setSaving(true)
    const result = await createPointsPromo({
      name: newPromo.name,
      description: newPromo.description || null,
      promo_type: newPromo.promo_type,
      multiplier: newPromo.promo_type === "multiplier" ? newPromo.multiplier : 1,
      bonus_points: newPromo.promo_type === "bonus" ? newPromo.bonus_points : 0,
      start_date: newPromo.start_date,
      end_date: newPromo.end_date,
      is_active: newPromo.is_active,
      applies_to: newPromo.applies_to,
      target_ids: newPromo.target_ids,
      target_tiers: newPromo.target_tiers,
      min_order_amount: newPromo.min_order_amount,
      max_uses: newPromo.max_uses,
    })
    if (result.success) {
      setShowNewPromo(false)
      setNewPromo({
        name: "",
        description: "",
        promo_type: "multiplier",
        multiplier: 2,
        bonus_points: 50,
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        is_active: true,
        applies_to: "all",
        target_ids: [],
        target_tiers: [],
        min_order_amount: 0,
        max_uses: null,
      })
      onReload()
    }
    setSaving(false)
  }

  const isPromoActive = (promo: PointsPromo) => {
    const now = new Date()
    return promo.is_active && new Date(promo.start_date) <= now && new Date(promo.end_date) >= now
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Points Promos</h2>
        <Button onClick={() => setShowNewPromo(true)} className="h-12 rounded-xl bg-white text-black hover:bg-white/90">
          <Plus className="mr-2 h-4 w-4" /> Create Promo
        </Button>
      </div>

      {/* Create New Promo Form */}
      <AnimatePresence>
        {showNewPromo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create New Promo</h3>
              <button
                onClick={() => setShowNewPromo(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Promo Name *
                </label>
                <Input
                  value={newPromo.name}
                  onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                  placeholder="e.g. Double Points Weekend"
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Description
                </label>
                <Textarea
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                  placeholder="Describe the promo..."
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Promo Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewPromo({ ...newPromo, promo_type: "multiplier" })}
                    className={`p-4 rounded-xl border transition-all ${
                      newPromo.promo_type === "multiplier"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Zap className="h-6 w-6 mx-auto mb-2" />
                    <span className="font-medium">Multiplier</span>
                    <p className="text-xs text-white/50 mt-1">e.g. 2x, 3x points</p>
                  </button>
                  <button
                    onClick={() => setNewPromo({ ...newPromo, promo_type: "bonus" })}
                    className={`p-4 rounded-xl border transition-all ${
                      newPromo.promo_type === "bonus"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Gift className="h-6 w-6 mx-auto mb-2" />
                    <span className="font-medium">Bonus Points</span>
                    <p className="text-xs text-white/50 mt-1">e.g. +50 points</p>
                  </button>
                </div>
              </div>

              {newPromo.promo_type === "multiplier" ? (
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Points Multiplier
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      value={newPromo.multiplier}
                      onChange={(e) => setNewPromo({ ...newPromo, multiplier: Number.parseFloat(e.target.value) || 1 })}
                      className="h-12 w-24 rounded-xl bg-white/5 border-white/10 text-white text-center"
                    />
                    <span className="text-white/50">x points per dollar</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Bonus Points
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      value={newPromo.bonus_points}
                      onChange={(e) => setNewPromo({ ...newPromo, bonus_points: Number.parseInt(e.target.value) || 0 })}
                      className="h-12 w-32 rounded-xl bg-white/5 border-white/10 text-white text-center"
                    />
                    <span className="text-white/50">extra points per order</span>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newPromo.start_date}
                    onChange={(e) => setNewPromo({ ...newPromo, start_date: e.target.value })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={newPromo.end_date}
                    onChange={(e) => setNewPromo({ ...newPromo, end_date: e.target.value })}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Minimum Order Amount ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={newPromo.min_order_amount}
                  onChange={(e) => setNewPromo({ ...newPromo, min_order_amount: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0 for no minimum"
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreatePromo}
                  disabled={saving || !newPromo.name}
                  className="h-12 rounded-xl bg-white text-black hover:bg-white/90"
                >
                  {saving ? "Creating..." : "Create Promo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewPromo(false)}
                  className="h-12 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promos List */}
      <div className="space-y-4">
        {promos.length === 0 && !showNewPromo ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No promos created yet</h3>
            <p className="text-white/50">Create your first points promo to boost engagement</p>
          </div>
        ) : (
          promos.map((promo, index) => {
            const active = isPromoActive(promo)
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${active ? "bg-amber-500/20" : "bg-white/10"}`}
                    >
                      <Zap className={`h-7 w-7 ${active ? "text-amber-400" : "text-white/40"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{promo.name}</h3>
                      <p className="text-sm text-white/50">
                        {promo.promo_type === "multiplier" ? `${promo.multiplier}x points` : `+${promo.bonus_points} bonus`}
                        {" • "}
                        {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-xl px-4 py-2 text-sm font-medium ${active ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white/40"}`}
                    >
                      {active ? "Active" : promo.is_active ? "Scheduled" : "Inactive"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(promo.id, promo.is_active)}
                      className="rounded-xl p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {promo.is_active ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="rounded-xl p-2 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

// Customers Section Component
function CustomersSection({
  customers,
  searchQuery,
  setSearchQuery,
  adjustingCustomer,
  setAdjustingCustomer,
  onReload,
}: {
  customers: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  adjustingCustomer: string | null
  setAdjustingCustomer: (id: string | null) => void
  onReload: () => void
}) {
  const [adjustment, setAdjustment] = useState({ points: 0, reason: "", notes: "" })
  const [saving, setSaving] = useState(false)

  const handleAdjust = async (customerId: string) => {
    if (!adjustment.points || !adjustment.reason) return
    setSaving(true)
    const result = await adjustCustomerPoints(customerId, adjustment.points, adjustment.reason, adjustment.notes)
    if (result.success) {
      setAdjustingCustomer(null)
      setAdjustment({ points: 0, reason: "", notes: "" })
      onReload()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Customer Points</h2>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers..."
          className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {customers.slice(0, 20).map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <span className="text-lg font-bold text-white">{customer.name?.[0] || customer.email?.[0] || "?"}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{customer.name || customer.email}</h3>
                  <p className="text-sm text-white/50">
                    {customer.rewards_tier} • ${customer.lifetime_spending?.toLocaleString() || 0} lifetime
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{customer.available_points?.toLocaleString() || 0}</p>
                  <p className="text-xs text-white/50">available points</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setAdjustingCustomer(adjustingCustomer === customer.id ? null : customer.id)}
                  className="h-10 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Adjust
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {adjustingCustomer === customer.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="space-y-4 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                          Points (+/-)
                        </label>
                        <Input
                          type="number"
                          value={adjustment.points}
                          onChange={(e) =>
                            setAdjustment({ ...adjustment, points: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="Enter points (negative to subtract)"
                          className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                          Reason
                        </label>
                        <select
                          value={adjustment.reason}
                          onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                          className="h-12 w-full rounded-xl bg-white/5 border border-white/10 text-white px-4"
                        >
                          <option value="" className="bg-black">Select reason...</option>
                          <option value="Bonus reward" className="bg-black">Bonus reward</option>
                          <option value="Customer service credit" className="bg-black">Customer service credit</option>
                          <option value="Promotion" className="bg-black">Promotion</option>
                          <option value="Correction" className="bg-black">Correction</option>
                          <option value="Referral bonus" className="bg-black">Referral bonus</option>
                          <option value="Other" className="bg-black">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                        Notes (optional)
                      </label>
                      <Textarea
                        value={adjustment.notes}
                        onChange={(e) => setAdjustment({ ...adjustment, notes: e.target.value })}
                        placeholder="Additional notes..."
                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setAdjustingCustomer(null)}
                        className="h-12 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleAdjust(customer.id)}
                        disabled={saving || !adjustment.points || !adjustment.reason}
                        className="h-12 rounded-xl bg-white text-black hover:bg-white/90"
                      >
                        {saving ? "Saving..." : `${adjustment.points >= 0 ? "Add" : "Subtract"} Points`}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// History Section Component
function HistorySection({ adjustments }: { adjustments: PointsAdjustment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Points Adjustment History</h2>

      <div className="space-y-4">
        {adjustments.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No adjustments yet</h3>
            <p className="text-white/50">Point adjustments will appear here</p>
          </div>
        ) : (
          adjustments.map((adj, index) => (
            <motion.div
              key={adj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${adj.points_amount >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}
                  >
                    {adj.points_amount >= 0 ? (
                      <Plus className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <span className="text-xl font-bold text-red-400">−</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{(adj.customer as any)?.email || "Unknown"}</h3>
                    <p className="text-sm text-white/50">{adj.reason}</p>
                    {adj.notes && <p className="text-xs text-white/30 mt-1">{adj.notes}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${adj.points_amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {adj.points_amount >= 0 ? "+" : ""}
                    {adj.points_amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/50">{new Date(adj.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
