import Link from "next/link"
import { Plus, Users, DollarSign, ShoppingCart, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react"
import { getAllReps } from "@/app/actions/rep-management"
import { formatDistanceToNow } from "date-fns"

export default async function RepsPage() {
  const reps = await getAllReps()

  return (
    <div className="min-h-screen px-4 py-6 lg:px-0">
      <div className="mx-auto max-w-5xl space-y-10 lg:space-y-12">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-foreground lg:text-5xl">Representatives</h1>
              <p className="mt-2 text-base text-muted-foreground lg:text-xl">Manage your sales team and track performance</p>
            </div>
            <Link
              href="/admin/reps/invite"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 text-base font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] lg:w-auto lg:self-start"
            >
              <Plus className="h-5 w-5" />
              Invite Rep
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-foreground/10">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-foreground/60" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Reps</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{reps.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-emerald-500/20">
                <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  ${reps.reduce((sum, r) => sum + r.total_sales, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-blue-500/20">
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {reps.reduce((sum, r) => sum + r.total_orders, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-foreground/5 p-4 lg:p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-amber-500/20">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                <p className="text-2xl lg:text-3xl font-bold text-amber-400">
                  ${reps.reduce((sum, r) => sum + r.pending_commission, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Link
          href="/admin/payouts"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-foreground/5 px-6 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground lg:w-auto lg:inline-flex"
        >
          <DollarSign className="h-5 w-5" />
          <span className="font-medium">Manage Payouts</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>

        {/* Reps List */}
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">All Representatives</h2>

          {reps.length === 0 ? (
            <div className="rounded-2xl border border-border bg-foreground/5 p-10 lg:p-16 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl lg:rounded-3xl bg-foreground/5">
                <Users className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground/50" />
              </div>
              <h3 className="mt-4 lg:mt-6 text-xl lg:text-2xl font-bold text-foreground">No representatives yet</h3>
              <p className="mt-2 lg:mt-3 text-base lg:text-lg text-muted-foreground">
                Invite your first sales representative to get started
              </p>
              <Link
                href="/admin/reps/invite"
                className="mt-6 lg:mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 text-base font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-5 w-5" />
                Invite Rep
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reps.map((rep) => (
                <Link
                  key={rep.id}
                  href={`/admin/reps/${rep.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-foreground/5 p-4 lg:p-8 backdrop-blur-xl transition-all duration-300 hover:border-border hover:bg-card/[0.07]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/5 text-xl lg:text-2xl font-bold text-white shrink-0">
                        {(rep.first_name?.[0] || rep.email[0]).toUpperCase()}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="text-base lg:text-2xl font-bold tracking-tight text-foreground truncate">
                          {rep.first_name && rep.last_name ? `${rep.first_name} ${rep.last_name}` : rep.email}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{rep.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatDistanceToNow(new Date(rep.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-5 lg:gap-4">
                      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-center">
                        <p className="text-lg lg:text-2xl font-bold text-foreground">{rep.total_customers}</p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Customers</p>
                      </div>
                      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-center">
                        <p className="text-lg lg:text-2xl font-bold text-foreground">{rep.total_orders}</p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Orders</p>
                      </div>
                      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-center">
                        <p className="text-lg lg:text-2xl font-bold text-emerald-400">
                          ${rep.total_sales.toLocaleString()}
                        </p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Sales</p>
                      </div>
                      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-center">
                        <p className="text-lg lg:text-2xl font-bold text-amber-400">
                          ${rep.pending_commission.toLocaleString()}
                        </p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                      </div>
                      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-center col-span-3 lg:col-span-1">
                        <p className="text-lg lg:text-xl font-semibold text-foreground/60">{rep.commission_rate}%</p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">Rate</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
