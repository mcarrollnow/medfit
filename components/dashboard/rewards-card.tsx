"use client"

import { Trophy, ArrowUpRight, Crown, ChevronDown, Gift, Sparkles } from "lucide-react"
import { useState } from "react"
import { REWARD_TIERS } from "@/lib/rewards-tiers"
import type { RewardTier } from "@/types"

interface RewardItem {
  id: string
  name: string
  description: string
  pointsCost: number
  available: boolean
}

const REWARD_ITEMS: RewardItem[] = [
  {
    id: "discount-10",
    name: "$10 Off Next Order",
    description: "Apply $10 discount to any future purchase",
    pointsCost: 1000,
    available: true,
  },
  {
    id: "discount-25",
    name: "$25 Off Next Order",
    description: "Apply $25 discount to any future purchase",
    pointsCost: 2500,
    available: true,
  },
  {
    id: "discount-50",
    name: "$50 Off Next Order",
    description: "Apply $50 discount to any future purchase",
    pointsCost: 5000,
    available: true,
  },
  {
    id: "free-shipping",
    name: "Free Expedited Shipping",
    description: "Get free expedited shipping on your next order",
    pointsCost: 2000,
    available: true,
  },
  {
    id: "discount-100",
    name: "$100 Off Next Order",
    description: "Apply $100 discount to any future purchase",
    pointsCost: 10000,
    available: true,
  },
  {
    id: "vip-support",
    name: "VIP Support Access (30 days)",
    description: "Priority email and chat support for 30 days",
    pointsCost: 3000,
    available: true,
  },
]

interface RewardsData {
  pointsBalance: number
  currentTier: RewardTier
  nextTier: RewardTier | null
  amountToNextTier: number
  progress: number
  tierInfo: {
    name: string
    color: string
    pointsPerDollar: number
    benefits: string[]
  }
}

interface RewardsCardProps {
  totalSpent?: number
  rewards?: RewardsData
  loading?: boolean
}

export function RewardsCard({ totalSpent = 0, rewards, loading = false }: RewardsCardProps) {
  const [expandedSection, setExpandedSection] = useState<null | "tiers" | "redeem">(null)

  // Use provided rewards data or calculate defaults
  const pointsBalance = rewards?.pointsBalance ?? 0
  const currentTier: RewardTier = rewards?.currentTier ?? "Free"
  const nextTier: RewardTier | null = rewards?.nextTier ?? "Bronze"
  const amountToNextTier = rewards?.amountToNextTier ?? 1000
  const progress = rewards?.progress ?? 0
  
  const currentTierInfo = rewards?.tierInfo ?? REWARD_TIERS[currentTier]
  const tiers = Object.entries(REWARD_TIERS) as [RewardTier, typeof REWARD_TIERS[RewardTier]][]

  const toggleSection = (section: "tiers" | "redeem") => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleRedeem = (rewardId: string, pointsCost: number) => {
    if (pointsBalance >= pointsCost) {
      alert("Reward redeemed successfully! This will be implemented with backend integration.")
    }
  }

  if (loading) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border-0 bg-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="relative z-10 space-y-8 p-8 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="h-5 w-32 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-20 w-48 bg-white/10 rounded" />
            <div className="h-5 w-32 bg-white/10 rounded" />
          </div>
          <div className="h-24 bg-white/10 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border-0 bg-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-white/[0.12]">
      {/* Grainy texture */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />

      <div className="relative z-10 space-y-8 p-8">
        {/* Header with Tier Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-white/60">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Research Rewards</span>
          </div>

          <div
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
            style={{ borderColor: `${currentTierInfo.color}40`, backgroundColor: `${currentTierInfo.color}10` }}
          >
            <Crown className="h-4 w-4" style={{ color: currentTierInfo.color }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: currentTierInfo.color }}>
              {currentTier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Points Balance */}
        <div className="space-y-1">
          <div className="text-7xl font-bold tracking-tighter text-white md:text-8xl">
            {pointsBalance.toLocaleString()}
          </div>
          <p className="text-lg font-medium text-white/60">Points Available</p>
        </div>

        {/* Tier Progress and Actions */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {nextTier ? (
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Progress to {nextTier}</span>
                <span className="font-medium text-white">${amountToNextTier.toLocaleString()} away</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${currentTierInfo.color}, ${REWARD_TIERS[nextTier as RewardTier].color})`,
                  }}
                />
              </div>
              <p className="text-xs text-white/40">
                Lifetime spent: ${totalSpent.toLocaleString()} • Earning {currentTierInfo.pointsPerDollar}x points
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-white/80">Maximum Tier Achieved!</p>
              <p className="text-xs text-white/40">
                Lifetime spent: ${totalSpent.toLocaleString()} • Earning {currentTierInfo.pointsPerDollar}x points
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => toggleSection("tiers")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
            >
              View Tiers
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expandedSection === "tiers" ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => toggleSection("redeem")}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
            >
              Redeem <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Tier Benefits */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">Your {currentTier} Benefits</h4>
          <ul className="grid gap-3 md:grid-cols-2">
            {currentTierInfo.benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/50" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          expandedSection === "tiers" ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative z-10 space-y-6 border-t border-white/10 p-8">
          <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
            <Trophy className="h-6 w-6" />
            All Tiers
          </h3>

          <div className="space-y-4">
            {tiers.map(([tierName, tierInfo]) => {
              const isCurrentTier = tierName === currentTier
              const isHigherTier = tierInfo.minSpend > REWARD_TIERS[currentTier].minSpend

              return (
                <div
                  key={tierName}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                    isCurrentTier
                      ? "border-white/30 bg-white/10 shadow-lg"
                      : isHigherTier
                        ? "border-white/10 bg-white/5 opacity-80"
                        : "border-white/10 bg-white/5 opacity-60"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                  <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md"
                        style={{
                          borderColor: `${tierInfo.color}40`,
                          backgroundColor: `${tierInfo.color}10`,
                        }}
                      >
                        <Crown className="h-8 w-8" style={{ color: tierInfo.color }} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold" style={{ color: tierInfo.color }}>
                            {tierName.toUpperCase()}
                          </h3>
                          {isCurrentTier && (
                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">CURRENT</span>
                          )}
                        </div>
                        <p className="text-sm text-white/60">
                          {tierInfo.minSpend === 0
                            ? "Join for free"
                            : `Spend $${tierInfo.minSpend.toLocaleString()}+ to unlock`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: tierInfo.color }}>
                        {tierInfo.pointsPerDollar}x
                      </div>
                      <p className="text-sm text-white/60">Points Per Dollar</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">Benefits</h4>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {tierInfo.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                          <span
                            className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: tierInfo.color }}
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          expandedSection === "redeem" ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative z-10 space-y-6 border-t border-white/10 p-8">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
              <Gift className="h-6 w-6" />
              Redeem Rewards
            </h3>
            <p className="text-lg text-white/60">
              Available: <span className="font-bold text-white">{pointsBalance.toLocaleString()}</span> Points
            </p>
          </div>

          <div className="grid gap-4">
            {REWARD_ITEMS.map((reward) => {
              const canAfford = pointsBalance >= reward.pointsCost

              return (
                <div
                  key={reward.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                    canAfford ? "border-white/20 bg-white/5 hover:bg-white/10" : "border-white/10 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-white/60" />
                        <h3 className="text-xl font-bold">{reward.name}</h3>
                      </div>
                      <p className="mt-1 text-sm text-white/60">{reward.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{reward.pointsCost.toLocaleString()}</div>
                        <p className="text-xs text-white/60">Points</p>
                      </div>
                      <button
                        onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                        disabled={!canAfford}
                        className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
