import { Trophy, ArrowUpRight } from 'lucide-react'

export function RewardsCard() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white/10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />
      
      <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white/60">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Research Rewards</span>
          </div>
          <div className="space-y-1">
            <div className="text-7xl font-bold tracking-tighter text-white md:text-8xl">
              2,450
            </div>
            <p className="text-lg font-medium text-white/60">Points Available</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="rounded-2xl bg-white/5 px-6 py-4 backdrop-blur-md">
            <p className="text-sm text-white/60">Next Tier Status</p>
            <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[70%] bg-white" />
            </div>
            <p className="mt-2 text-xs text-white/40">550 points to Platinum</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
            Redeem Points <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
