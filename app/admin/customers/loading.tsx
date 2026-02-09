export default function Loading() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-14 w-64 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-6 w-96 animate-pulse rounded-xl bg-white/5" />
        </div>

        {/* Search skeleton */}
        <div className="h-16 max-w-xl animate-pulse rounded-2xl bg-white/5" />

        {/* Cards skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

