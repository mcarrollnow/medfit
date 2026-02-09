import type { RewardTier } from "@/types"

// Default referral discount percentage (used when no custom discount is set)
export const DEFAULT_REFERRAL_DISCOUNT = 15

// Referral discount percentages based on referrer's reward tier (legacy - now using flat 15% default)
export const REFERRAL_DISCOUNTS: Record<RewardTier, number> = {
  Free: 15,
  Bronze: 15,
  Silver: 15,
  Gold: 15,
  Platinum: 15,
  Diamond: 15,
}

// Future: Reward points given to referrer when their referral makes a purchase
export const REFERRAL_REWARDS: Record<RewardTier, number> = {
  Free: 50,
  Bronze: 75,
  Silver: 100,
  Gold: 150,
  Platinum: 200,
  Diamond: 300,
}

export function getReferralDiscount(tier: RewardTier, customDiscount?: number | null): number {
  // If a custom discount is set, use that instead of the tier-based discount
  if (customDiscount !== undefined && customDiscount !== null) {
    return customDiscount
  }
  return REFERRAL_DISCOUNTS[tier] || DEFAULT_REFERRAL_DISCOUNT
}

export function getReferralRewardPoints(tier: RewardTier): number {
  return REFERRAL_REWARDS[tier] || 50
}

export function generateReferralCodePreview(): string {
  return "XXXXXXXX" // 8 random characters
}

