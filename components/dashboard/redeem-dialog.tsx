// Keeping it for backwards compatibility but it won't be used
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, Sparkles } from "lucide-react"
import { useState } from "react"

interface RedeemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pointsBalance: number
}

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

export function RedeemDialog({ open, onOpenChange, pointsBalance }: RedeemDialogProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const handleRedeem = (rewardId: string, pointsCost: number) => {
    if (pointsBalance >= pointsCost) {
      setSelectedReward(rewardId)
      alert("Reward redeemed successfully! This will be implemented with backend integration.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/10 bg-black/95 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl font-bold">
            <Gift className="h-8 w-8" />
            Redeem Rewards
          </DialogTitle>
          <p className="text-lg text-white/60">
            Available Points: <span className="font-bold text-white">{pointsBalance.toLocaleString()}</span>
          </p>
        </DialogHeader>

        <div className="mt-6 grid gap-4">
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
      </DialogContent>
    </Dialog>
  )
}
