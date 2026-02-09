import type { TierInfo, RewardTier } from "@/types"

// Re-export types for convenience
export type { RewardTier, TierInfo }

export type DynamicTier = string

export const DEFAULT_REWARD_TIERS: Record<string, TierInfo> = {
  Free: {
    name: "Free",
    minSpend: 0,
    maxSpend: 999,
    pointsPerDollar: 1,
    color: "#666666",
    benefits: ["1 point per dollar spent", "Access to exclusive research products", "Order tracking"],
  },
  Bronze: {
    name: "Bronze",
    minSpend: 1000,
    maxSpend: 4999,
    pointsPerDollar: 1.25,
    color: "#CD7F32",
    benefits: [
      "1.25 points per dollar spent",
      "Priority email support",
      "Early access to new products",
      "Exclusive member pricing",
    ],
  },
  Silver: {
    name: "Silver",
    minSpend: 5000,
    maxSpend: 14999,
    pointsPerDollar: 1.5,
    color: "#C0C0C0",
    benefits: [
      "1.5 points per dollar spent",
      "Dedicated account manager",
      "Free express shipping",
      "Quarterly research insights",
    ],
  },
  Gold: {
    name: "Gold",
    minSpend: 15000,
    maxSpend: 39999,
    pointsPerDollar: 2,
    color: "#FFD700",
    benefits: [
      "2 points per dollar spent",
      "Monthly giveaway entries",
      "VIP phone support",
      "Custom order fulfillment",
      "Exclusive event invitations",
    ],
  },
  Platinum: {
    name: "Platinum",
    minSpend: 40000,
    maxSpend: 99999,
    pointsPerDollar: 2.5,
    color: "#E5E4E2",
    benefits: [
      "2.5 points per dollar spent",
      "Monthly giveaway entries",
      "24/7 concierge service",
      "Personalized research consultations",
      "Bulk order discounts",
      "Priority production queue",
    ],
  },
  Diamond: {
    name: "Diamond",
    minSpend: 100000,
    maxSpend: null,
    pointsPerDollar: 3,
    color: "#B9F2FF",
    benefits: [
      "3 points per dollar spent",
      "Monthly giveaway entries",
      "White-glove service",
      "Custom formulation requests",
      "Annual research summit access",
      "Maximum bulk discounts",
      "Dedicated research team",
    ],
  },
}

// Export as both typed and generic versions for compatibility
export const REWARD_TIERS = DEFAULT_REWARD_TIERS as Record<RewardTier, TierInfo>

export function calculateTier(totalSpent: number, tiers: Record<string, TierInfo> = DEFAULT_REWARD_TIERS): string {
  // Sort tiers by minSpend descending to find the highest qualifying tier
  const sortedTiers = Object.entries(tiers).sort((a, b) => b[1].minSpend - a[1].minSpend)

  for (const [tierName, tierInfo] of sortedTiers) {
    if (totalSpent >= tierInfo.minSpend) {
      return tierName
    }
  }

  // Return the tier with the lowest minSpend as default
  const lowestTier = Object.entries(tiers).sort((a, b) => a[1].minSpend - b[1].minSpend)[0]
  return lowestTier ? lowestTier[0] : "Free"
}

export function getNextTier(
  currentTier: string,
  tiers: Record<string, TierInfo> = DEFAULT_REWARD_TIERS,
): string | null {
  const sortedTiers = Object.entries(tiers).sort((a, b) => a[1].minSpend - b[1].minSpend)
  const currentIndex = sortedTiers.findIndex(([name]) => name === currentTier)

  if (currentIndex === -1 || currentIndex === sortedTiers.length - 1) return null
  return sortedTiers[currentIndex + 1][0]
}

export function calculateAmountToNextTier(
  totalSpent: number,
  currentTier: string,
  tiers: Record<string, TierInfo> = DEFAULT_REWARD_TIERS,
): number {
  const nextTier = getNextTier(currentTier, tiers)
  if (!nextTier || !tiers[nextTier]) return 0

  return tiers[nextTier].minSpend - totalSpent
}

export function getTierProgress(
  totalSpent: number,
  currentTier: string,
  tiers: Record<string, TierInfo> = DEFAULT_REWARD_TIERS,
): number {
  const nextTier = getNextTier(currentTier, tiers)
  if (!nextTier) return 100

  const currentTierInfo = tiers[currentTier]
  const nextTierInfo = tiers[nextTier]

  if (!currentTierInfo || !nextTierInfo) return 0

  const tierRange = nextTierInfo.minSpend - currentTierInfo.minSpend
  const progress = totalSpent - currentTierInfo.minSpend

  return Math.min(100, (progress / tierRange) * 100)
}

export function getTierInfo(tierName: string, tiers: Record<string, TierInfo> = DEFAULT_REWARD_TIERS): TierInfo {
  return tiers[tierName] || tiers["Free"] || DEFAULT_REWARD_TIERS["Free"]
}
