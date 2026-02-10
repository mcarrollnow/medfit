export default function ReferralsLoading() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="h-12 bg-foreground/10 rounded-lg w-96 animate-pulse mb-4" />
          <div className="h-6 bg-foreground/10 rounded-lg w-80 animate-pulse" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-foreground/5 border border-border p-6 animate-pulse">
              <div className="w-12 h-12 bg-foreground/10 rounded-xl mb-4" />
              <div className="h-4 bg-foreground/10 rounded w-24 mb-2" />
              <div className="h-8 bg-foreground/10 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Tier Discount Reference */}
        <div className="rounded-2xl bg-foreground/5 border border-border p-8 mb-10 animate-pulse">
          <div className="h-6 bg-foreground/10 rounded w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl bg-foreground/5 border border-border p-4">
                <div className="h-4 bg-foreground/10 rounded w-16 mb-2" />
                <div className="h-8 bg-foreground/10 rounded w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="h-12 bg-foreground/10 rounded-xl w-full max-w-md animate-pulse" />
        </div>

        {/* List */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-foreground/5 border border-border p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground/10 rounded-xl" />
                  <div>
                    <div className="h-5 bg-foreground/10 rounded w-32 mb-2" />
                    <div className="h-4 bg-foreground/10 rounded w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="h-6 bg-foreground/10 rounded w-12 mb-1" />
                    <div className="h-3 bg-foreground/10 rounded w-16" />
                  </div>
                  <div className="text-center">
                    <div className="h-6 bg-foreground/10 rounded w-16 mb-1" />
                    <div className="h-3 bg-foreground/10 rounded w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
