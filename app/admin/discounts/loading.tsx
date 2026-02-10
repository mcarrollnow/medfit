export default function Loading() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-48 bg-foreground/10 rounded-lg animate-pulse" />
            <div className="h-5 w-64 bg-foreground/5 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="h-12 w-36 bg-foreground/10 rounded-2xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-foreground/5 rounded-3xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-foreground/10 animate-pulse" />
                <div>
                  <div className="h-4 w-20 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-foreground/5 rounded animate-pulse mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-foreground/5 rounded-3xl p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-foreground/10 animate-pulse" />
                  <div>
                    <div className="h-6 w-32 bg-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-foreground/5 rounded animate-pulse mt-2" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-8 w-16 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-12 w-12 rounded-2xl bg-foreground/10 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

