"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Users,
  Star,
  X,
  Layers,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getCurrentRep } from "@/app/actions/rep"
import {
  getRepTiers,
  createTier,
  updateTier,
  deleteTier,
  type PricingTier,
} from "@/app/actions/rep-tiers"

export default function RepPricingTiersPage() {
  const [repId, setRepId] = useState<string | null>(null)
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    discount_percentage: "",
    description: "",
    is_default: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const rep = await getCurrentRep()
      if (rep) {
        setRepId(rep.id)
        const data = await getRepTiers(rep.id)
        setTiers(data)
      }
    } catch (error) {
      console.error("[Pricing Tiers] Error loading:", error)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingTier(null)
    setForm({ name: "", discount_percentage: "", description: "", is_default: false })
    setShowModal(true)
  }

  function openEdit(tier: PricingTier) {
    setEditingTier(tier)
    setForm({
      name: tier.name,
      discount_percentage: tier.discount_percentage.toString(),
      description: tier.description || "",
      is_default: tier.is_default,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!repId) return
    setSaving(true)
    try {
      const discountPct = parseFloat(form.discount_percentage) || 0

      if (editingTier) {
        const result = await updateTier(repId, editingTier.id, {
          name: form.name,
          discount_percentage: discountPct,
          description: form.description,
          is_default: form.is_default,
        })
        if (!result.success) {
          alert(result.error || "Failed to update tier")
          return
        }
      } else {
        const result = await createTier(repId, {
          name: form.name,
          discount_percentage: discountPct,
          description: form.description,
          is_default: form.is_default,
        })
        if (!result.success) {
          alert(result.error || "Failed to create tier")
          return
        }
      }

      setShowModal(false)
      await loadData()
    } catch (error) {
      console.error("[Pricing Tiers] Error saving:", error)
      alert("Failed to save tier")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tier: PricingTier) {
    if (!repId) return
    if (!confirm(`Delete "${tier.name}" tier? ${tier.customer_count ? `${tier.customer_count} customer(s) will be unassigned.` : ""}`)) return

    try {
      const result = await deleteTier(repId, tier.id)
      if (!result.success) {
        alert(result.error || "Failed to delete tier")
        return
      }
      await loadData()
    } catch (error) {
      console.error("[Pricing Tiers] Error deleting:", error)
      alert("Failed to delete tier")
    }
  }

  async function handleSetDefault(tier: PricingTier) {
    if (!repId) return
    try {
      await updateTier(repId, tier.id, { is_default: true })
      await loadData()
    } catch (error) {
      console.error("[Pricing Tiers] Error setting default:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono text-sm uppercase tracking-widest">Back to Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight">
            Pricing Tiers
          </h1>
          <p className="text-lg text-white/50 max-w-xl">
            Create pricing tiers with base discounts. Assign customers to tiers for automatic discount application at checkout.
          </p>
        </div>

        {/* Create Tier Button */}
        <div>
          <Button
            onClick={openCreate}
            className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 gap-3 text-base font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Tier
          </Button>
        </div>

        {/* Tiers Grid */}
        {tiers.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-16 text-center space-y-6">
            <Layers className="h-16 w-16 text-white/20 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-light text-white">No Pricing Tiers Yet</h3>
              <p className="text-white/40 max-w-md mx-auto">
                Create tiers like Gold, Silver, and Bronze to group customers by discount level.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.15]"
              >
                {/* Noise */}
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Tier header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-2xl font-light text-white">{tier.name}</h3>
                        {tier.is_default && (
                          <Badge className="bg-white/10 text-white/70 border-0 text-xs font-mono uppercase tracking-wider">
                            Default
                          </Badge>
                        )}
                      </div>
                      {tier.description && (
                        <p className="text-sm text-white/40">{tier.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Discount display */}
                  <div className="space-y-1">
                    <p className="font-mono text-xs uppercase tracking-widest text-white/30">Discount</p>
                    <p className="font-serif text-4xl font-light text-white">
                      {tier.discount_percentage}
                      <span className="text-xl text-white/50">%</span>
                    </p>
                  </div>

                  {/* Customer count */}
                  <div className="flex items-center gap-2 text-white/40">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {tier.customer_count || 0} customer{tier.customer_count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => openEdit(tier)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    {!tier.is_default && (
                      <button
                        onClick={() => handleSetDefault(tier)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(tier)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-white/10 p-8 space-y-8"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-light text-white">
                    {editingTier ? "Edit Tier" : "Create Tier"}
                  </h3>
                  <p className="text-sm text-white/40 mt-1">
                    {editingTier ? "Update this pricing tier" : "Add a new pricing tier for your customers"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Tier Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Gold, Silver, Bronze"
                    className="h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white text-lg placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Discount Percentage
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={form.discount_percentage}
                      onChange={(e) => setForm((prev) => ({ ...prev, discount_percentage: e.target.value }))}
                      placeholder="e.g. 15"
                      className="h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white text-lg pr-12 placeholder:text-white/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase tracking-widest text-white/50">
                    Description <span className="text-white/20">(optional)</span>
                  </Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. Top-tier customers with volume orders"
                    className="h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_default: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-white accent-white"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">Set as Default Tier</p>
                    <p className="text-white/30 text-xs">New customers will automatically be assigned to this tier</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="h-12 px-6 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim() || !form.discount_percentage}
                  className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 gap-2 font-medium"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingTier ? (
                    "Save Changes"
                  ) : (
                    "Create Tier"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
