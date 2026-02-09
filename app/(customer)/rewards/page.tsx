'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RewardsCard } from '@/components/dashboard/rewards-card'

interface RewardsData {
  pointsBalance: number
  currentTier: 'Free' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  nextTier: 'Free' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | null
  amountToNextTier: number
  progress: number
  tierInfo: {
    name: string
    color: string
    pointsPerDollar: number
    benefits: string[]
  }
}

interface Stats {
  totalOrders: number
  totalSpent: number
  averageOrder: number
  pendingOrders: number
  rewards?: RewardsData
}

export default function RewardsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/customer/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 md:px-20 py-12 md:py-24 max-w-[1400px]">
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-16 md:mb-24 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">Rewards</h1>
          <p className="text-xl text-white/50">View your points balance, tier status, and redeem rewards.</p>
        </div>

        {/* Rewards Card */}
        <RewardsCard 
          totalSpent={stats?.totalSpent ?? 0}
          rewards={stats?.rewards}
          loading={loading}
        />
      </main>
    </div>
  )
}

