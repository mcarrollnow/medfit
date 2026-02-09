"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Gift, Users, TrendingUp, Share2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { REFERRAL_DISCOUNTS } from "@/lib/referral-tiers"
import { REWARD_TIERS } from "@/lib/rewards-tiers"
import {
  generateReferralCode,
  getReferralStats,
  getReferredCustomers,
  type ReferralStats,
  type ReferredCustomer,
} from "@/app/actions/referrals"
import type { RewardTier } from "@/types"

interface ReferralCardProps {
  customerId: string
  currentTier: RewardTier
}

export function ReferralCard({ customerId, currentTier }: ReferralCardProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referredCustomers, setReferredCustomers] = useState<ReferredCustomer[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showReferrals, setShowReferrals] = useState(false)

  const discountPercentage = REFERRAL_DISCOUNTS[currentTier] || 5
  const tierInfo = REWARD_TIERS[currentTier]

  useEffect(() => {
    loadReferralData()
  }, [customerId])

  async function loadReferralData() {
    setLoading(true)
    const { stats: fetchedStats, referralCode: code } = await getReferralStats(customerId)
    setStats(fetchedStats)
    setReferralCode(code)

    if (code) {
      const { customers } = await getReferredCustomers(customerId)
      setReferredCustomers(customers)
    }
    setLoading(false)
  }

  async function handleGenerateCode() {
    setGenerating(true)
    const { success, code } = await generateReferralCode(customerId)
    if (success && code) {
      setReferralCode(code)
    }
    setGenerating(false)
  }

  function handleCopy() {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleShare() {
    if (referralCode && navigator.share) {
      navigator.share({
        title: "Join with my referral code!",
        text: `Use my code ${referralCode} for ${discountPercentage}% off your first order!`,
        url: window.location.origin,
      })
    }
  }

  if (loading) {
    return (
      <div className="admin-container bg-white/5 border border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3" />
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-container bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${tierInfo.color}20` }}
            >
              <Gift className="w-6 h-6" style={{ color: tierInfo.color }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Referral Program</h3>
              <p className="text-sm text-white/60">Share & earn rewards</p>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${tierInfo.color}20`, color: tierInfo.color }}
          >
            {discountPercentage}% discount
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="p-6 space-y-6">
        {referralCode ? (
          <>
            {/* Code Display */}
            <div className="space-y-3">
              <p className="text-sm text-white/60 uppercase tracking-wider">Your Referral Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-mono text-2xl text-white tracking-widest text-center">
                  {referralCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="h-14 w-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white/60" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-14 w-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <Share2 className="w-5 h-5 text-white/60" />
                </Button>
              </div>
              <p className="text-sm text-white/40 text-center">
                Friends get <span className="text-emerald-400 font-medium">{discountPercentage}% off</span> their first
                order
              </p>
            </div>

            {/* Tier Discount Info */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">Your tier discount power</span>
                <span className="text-sm font-medium" style={{ color: tierInfo.color }}>
                  {currentTier}
                </span>
              </div>
              <div className="flex gap-1">
                {(["Free", "Bronze", "Silver", "Gold", "Platinum", "Diamond"] as RewardTier[]).map((tier) => {
                  const isActive = tier === currentTier
                  const tierColor = REWARD_TIERS[tier].color
                  const discount = REFERRAL_DISCOUNTS[tier]
                  return (
                    <div
                      key={tier}
                      className={`flex-1 h-2 rounded-full transition-all ${isActive ? "ring-2 ring-offset-2 ring-offset-black" : "opacity-40"}`}
                      style={{
                        backgroundColor: tierColor,
                        ringColor: isActive ? tierColor : "transparent",
                      }}
                      title={`${tier}: ${discount}% discount`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-white/40 mt-2 text-center">
                Upgrade your tier to give friends bigger discounts
              </p>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Referrals</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">{stats.totalReferrals}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Sales Generated</span>
                  </div>
                  <p className="text-2xl font-semibold text-emerald-400">${stats.totalReferredSales.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Referred Customers List */}
            {referredCustomers.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowReferrals(!showReferrals)}
                  className="w-full flex items-center justify-between text-sm text-white/60 hover:text-white/80 transition-colors"
                >
                  <span>Your referred friends ({referredCustomers.length})</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showReferrals ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {showReferrals && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {referredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{customer.name}</p>
                            <p className="text-xs text-white/40">
                              {customer.totalOrders} orders · ${customer.totalSpent.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/40">Joined</p>
                            <p className="text-xs text-white/60">
                              {new Date(customer.signupDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          /* Generate Code CTA */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-white/40" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Start Referring Friends</h4>
              <p className="text-sm text-white/60 mt-1">
                As a {currentTier} member, your friends get {discountPercentage}% off
              </p>
            </div>
            <Button
              onClick={handleGenerateCode}
              disabled={generating}
              className="h-14 px-8 rounded-2xl text-base font-medium"
              style={{ backgroundColor: tierInfo.color }}
            >
              {generating ? "Generating..." : "Get My Referral Code"}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

