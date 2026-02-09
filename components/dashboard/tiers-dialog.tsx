"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Crown, Trophy } from "lucide-react"
import { REWARD_TIERS, type RewardTier } from "@/lib/rewards-tiers"

interface TiersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTier: RewardTier
}

export function TiersDialog({ open, onOpenChange, currentTier }: TiersDialogProps) {
  const tiers = Object.entries(REWARD_TIERS) as [RewardTier, (typeof REWARD_TIERS)[RewardTier]][]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto border-white/10 bg-black/95 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl font-bold">
            <Trophy className="h-8 w-8" />
            Rewards Tier System
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
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
                {/* Grainy texture */}
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                <div className="relative z-10 mt-6 space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">Benefits</h4>
                  <ul className="grid gap-2 md:grid-cols-2">
                    {tierInfo.benefits.map((benefit, index) => (
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
      </DialogContent>
    </Dialog>
  )
}
