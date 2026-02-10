"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  DollarSign,
  Wallet,
  Clock,
  CheckCircle2,
  Send,
  Upload,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  FileText,
  CreditCard,
  Bitcoin,
  Building2,
  Banknote,
} from "lucide-react"
import Link from "next/link"
import {
  getRepPayoutSummaries,
  getRepCommissions,
  getRepPayouts,
  createPayout,
  updatePayoutStatus,
  approveCommissions,
  markPayoutEmailSent,
  type RepPayoutSummary,
  type RepCommission,
  type RepPayout,
} from "@/app/actions/payouts"

export default function PayoutsPage() {
  const [summaries, setSummaries] = useState<RepPayoutSummary[]>([])
  const [selectedRep, setSelectedRep] = useState<RepPayoutSummary | null>(null)
  const [commissions, setCommissions] = useState<RepCommission[]>([])
  const [payouts, setPayouts] = useState<RepPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"commissions" | "payouts" | "new">("commissions")
  const [selectedCommissions, setSelectedCommissions] = useState<Set<string>>(new Set())
  const [expandedPayouts, setExpandedPayouts] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [payoutForm, setPayoutForm] = useState({
    amount: 0,
    payment_type: "crypto" as string,
    crypto_currency: "USDT",
    wallet_address: "",
    transaction_hash: "",
    transaction_number: "",
    notes: "",
  })

  useEffect(() => {
    loadSummaries()
  }, [])

  async function loadSummaries() {
    setLoading(true)
    const data = await getRepPayoutSummaries()
    setSummaries(data)
    setLoading(false)
  }

  async function loadRepDetails(rep: RepPayoutSummary) {
    setSelectedRep(rep)
    setLoading(true)
    const [commissionsData, payoutsData] = await Promise.all([getRepCommissions(rep.rep_id), getRepPayouts(rep.rep_id)])
    setCommissions(commissionsData)
    setPayouts(payoutsData)
    setPayoutForm((prev) => ({
      ...prev,
      wallet_address: rep.crypto_wallet_address || "",
      amount: rep.approved_amount,
    }))
    setLoading(false)
  }

  function toggleCommissionSelection(id: string) {
    const newSet = new Set(selectedCommissions)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedCommissions(newSet)

    const selectedTotal = commissions
      .filter((c) => newSet.has(c.id) && c.status === "approved")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
    setPayoutForm((prev) => ({ ...prev, amount: selectedTotal }))
  }

  function selectAllApproved() {
    const approvedIds = commissions.filter((c) => c.status === "approved").map((c) => c.id)
    setSelectedCommissions(new Set(approvedIds))

    const total = commissions
      .filter((c) => c.status === "approved")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
    setPayoutForm((prev) => ({ ...prev, amount: total }))
  }

  async function handleApproveSelected() {
    const pendingSelected = commissions
      .filter((c) => selectedCommissions.has(c.id) && c.status === "pending")
      .map((c) => c.id)

    if (pendingSelected.length === 0) return

    setSaving(true)
    await approveCommissions(pendingSelected)
    if (selectedRep) await loadRepDetails(selectedRep)
    setSelectedCommissions(new Set())
    setSaving(false)
  }

  async function handleCreatePayout() {
    if (!selectedRep || payoutForm.amount <= 0) return

    setSaving(true)
    const selectedApproved = commissions
      .filter((c) => selectedCommissions.has(c.id) && c.status === "approved")
      .map((c) => c.id)

    const result = await createPayout({
      rep_id: selectedRep.rep_id,
      amount: payoutForm.amount,
      payment_type: payoutForm.payment_type,
      crypto_currency: payoutForm.payment_type === "crypto" ? payoutForm.crypto_currency : undefined,
      wallet_address: payoutForm.payment_type === "crypto" ? payoutForm.wallet_address : undefined,
      transaction_hash: payoutForm.transaction_hash || undefined,
      transaction_number: payoutForm.transaction_number || undefined,
      notes: payoutForm.notes || undefined,
      commission_ids: selectedApproved,
    })

    if (result.success) {
      await loadRepDetails(selectedRep)
      setActiveTab("payouts")
      setSelectedCommissions(new Set())
      setPayoutForm({
        amount: 0,
        payment_type: "crypto",
        crypto_currency: "USDT",
        wallet_address: selectedRep.crypto_wallet_address || "",
        transaction_hash: "",
        transaction_number: "",
        notes: "",
      })
    }
    setSaving(false)
  }

  async function handleCompletePayout(payoutId: string) {
    setSaving(true)
    await updatePayoutStatus(payoutId, "completed")
    if (selectedRep) await loadRepDetails(selectedRep)
    setSaving(false)
  }

  async function handleSendEmail(payoutId: string) {
    setSaving(true)
    await markPayoutEmailSent(payoutId)
    if (selectedRep) await loadRepDetails(selectedRep)
    setSaving(false)
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "approved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "paid":
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "used":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "cancelled":
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "processing":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      default:
        return "bg-foreground/10 text-foreground/60 border-border"
    }
  }

  function getPaymentIcon(type: string) {
    switch (type) {
      case "crypto":
        return <Bitcoin className="w-5 h-5" />
      case "bank_transfer":
        return <Building2 className="w-5 h-5" />
      case "check":
        return <FileText className="w-5 h-5" />
      case "cash":
        return <Banknote className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  // Rep list view
  if (!selectedRep) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="mx-auto max-w-6xl space-y-12">
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
            <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Rep Payouts</h1>
            <p className="text-xl text-muted-foreground">Manage commissions and process payouts for your sales reps.</p>
          </div>

          {/* Stats */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    ${summaries.reduce((sum, s) => sum + s.total_earned, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    ${summaries.reduce((sum, s) => sum + s.total_paid, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    ${summaries.reduce((sum, s) => sum + s.pending_amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Ready to Pay</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    ${summaries.reduce((sum, s) => sum + s.approved_amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rep List */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Sales Representatives</h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-foreground/5" />
                ))}
              </div>
            ) : summaries.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 relative z-10" />
                <p className="text-muted-foreground relative z-10">No sales representatives found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {summaries.map((rep) => (
                  <div
                    key={rep.rep_id}
                    onClick={() => loadRepDetails(rep)}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:bg-foreground/[0.08] hover:border-primary/15"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center text-xl font-bold text-white">
                          {rep.rep_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{rep.rep_name}</h3>
                          <p className="text-sm text-muted-foreground">{rep.rep_email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <div className="text-center md:text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Earned</p>
                          <p className="text-lg font-semibold text-emerald-400">${rep.total_earned.toFixed(2)}</p>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p>
                          <p className="text-lg font-semibold text-foreground">${rep.total_paid.toFixed(2)}</p>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                          <p className="text-lg font-semibold text-amber-400">${rep.pending_amount.toFixed(2)}</p>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Ready</p>
                          <p className="text-lg font-semibold text-blue-400">${rep.approved_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    )
  }

  // Rep detail view
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedRep(null)
                setCommissions([])
                setPayouts([])
                setSelectedCommissions(new Set())
              }}
              className="h-12 w-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{selectedRep.rep_name}</h1>
              <p className="text-muted-foreground">{selectedRep.rep_email}</p>
            </div>
          </div>

          <Badge className={`px-4 py-2 text-sm border ${getStatusColor("approved")}`}>
            ${selectedRep.approved_amount.toFixed(2)} Ready
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Earned", value: selectedRep.total_earned, color: "text-emerald-400" },
            { label: "Total Paid", value: selectedRep.total_paid, color: "text-foreground" },
            { label: "Pending Approval", value: selectedRep.pending_amount, color: "text-amber-400" },
            { label: "Ready to Pay", value: selectedRep.approved_amount, color: "text-blue-400" },
          ].map((stat) => (
            <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl text-center">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <p className="text-sm text-muted-foreground relative z-10">{stat.label}</p>
              <p className={`text-2xl font-bold relative z-10 ${stat.color}`}>${stat.value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-2 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {(["commissions", "payouts", "new"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 rounded-xl text-center font-medium transition-all ${
                  activeTab === tab ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {tab === "commissions" ? "Commissions" : tab === "payouts" ? "Payout History" : "New Payout"}
              </button>
            ))}
          </div>
        </div>

        {/* Commissions Tab */}
        {activeTab === "commissions" && (
          <section className="space-y-6">
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={selectAllApproved}
                variant="outline"
                className="h-12 px-6 rounded-xl bg-foreground/5 border-border hover:bg-foreground/10 text-foreground"
              >
                Select All Approved
              </Button>
              {selectedCommissions.size > 0 && (
                <>
                  <Button
                    onClick={handleApproveSelected}
                    disabled={saving}
                    className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Approve Selected ({selectedCommissions.size})
                  </Button>
                  <Button
                    onClick={() => setActiveTab("new")}
                    className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Create Payout for Selected
                  </Button>
                </>
              )}
            </div>

            {/* Commission List */}
            <div className="space-y-3">
              {commissions.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <DollarSign className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 relative z-10" />
                  <p className="text-muted-foreground relative z-10">No commissions yet</p>
                </div>
              ) : (
                commissions.map((commission) => (
                  <div
                    key={commission.id}
                    onClick={() =>
                      commission.status !== "paid" &&
                      commission.status !== "cancelled" &&
                      toggleCommissionSelection(commission.id)
                    }
                    className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedCommissions.has(commission.id)
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-border bg-foreground/5 hover:bg-foreground/[0.08]"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                            selectedCommissions.has(commission.id)
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-border"
                          }`}
                        >
                          {selectedCommissions.has(commission.id) && <Check className="w-4 h-4 text-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Order from {commission.order?.customer?.user?.first_name || "Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(commission.created_at).toLocaleDateString()} • Order Total: $
                            {Number(commission.order_total).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge className={`px-3 py-1 border ${getStatusColor(commission.status)}`}>
                          {commission.status}
                        </Badge>
                        <p className="text-xl font-bold text-emerald-400">
                          +${Number(commission.commission_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <section className="space-y-4">
            {payouts.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <Send className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 relative z-10" />
                <p className="text-muted-foreground relative z-10">No payouts yet</p>
              </div>
            ) : (
              payouts.map((payout) => (
                <div key={payout.id} className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  
                  {/* Header */}
                  <div
                    className="relative z-10 p-6 cursor-pointer hover:bg-foreground/5 transition-colors"
                    onClick={() => {
                      const newSet = new Set(expandedPayouts)
                      if (newSet.has(payout.id)) {
                        newSet.delete(payout.id)
                      } else {
                        newSet.add(payout.id)
                      }
                      setExpandedPayouts(newSet)
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-foreground/10">{getPaymentIcon(payout.payment_type)}</div>
                        <div>
                          <p className="font-medium text-foreground capitalize">
                            {payout.payment_type.replace("_", " ")} Payment
                            {payout.crypto_currency && ` (${payout.crypto_currency})`}
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(payout.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge className={`px-3 py-1 border ${getStatusColor(payout.status)}`}>{payout.status}</Badge>
                        <p className="text-2xl font-bold text-foreground">${Number(payout.amount).toFixed(2)}</p>
                        {expandedPayouts.has(payout.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedPayouts.has(payout.id) && (
                    <div className="relative z-10 px-6 pb-6 border-t border-border pt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {payout.wallet_address && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Wallet Address</Label>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-3 bg-foreground/5 rounded-xl text-sm text-foreground truncate border border-border">
                                {payout.wallet_address}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(payout.wallet_address!, `wallet-${payout.id}`)}
                                className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10"
                              >
                                {copiedId === `wallet-${payout.id}` ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {payout.transaction_hash && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Transaction Hash</Label>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-3 bg-foreground/5 rounded-xl text-sm text-foreground truncate border border-border">
                                {payout.transaction_hash}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(payout.transaction_hash!, `hash-${payout.id}`)}
                                className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10"
                              >
                                {copiedId === `hash-${payout.id}` ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {payout.notes && (
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-muted-foreground">Notes</Label>
                            <p className="p-3 bg-foreground/5 rounded-xl text-foreground border border-border">{payout.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col md:flex-row gap-3">
                        {payout.status === "pending" && (
                          <Button
                            onClick={() => handleCompletePayout(payout.id)}
                            disabled={saving}
                            className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Mark as Completed
                          </Button>
                        )}

                        {payout.status === "completed" && !payout.email_sent && (
                          <Button
                            onClick={() => handleSendEmail(payout.id)}
                            disabled={saving}
                            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Mail className="w-5 h-5 mr-2" />
                            Send Confirmation Email
                          </Button>
                        )}

                        {payout.email_sent && (
                          <Badge className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Mail className="w-4 h-4 mr-2" />
                            Email sent {payout.email_sent_at && new Date(payout.email_sent_at).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        {/* New Payout Tab */}
        {activeTab === "new" && (
          <section className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8 space-y-8">
              <h2 className="text-2xl font-bold text-foreground">Create New Payout</h2>

              {/* Payment Type */}
              <div className="space-y-4">
                <Label className="text-lg text-foreground">Payment Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { value: "crypto", label: "Crypto", icon: Bitcoin },
                    { value: "bank_transfer", label: "Bank", icon: Building2 },
                    { value: "check", label: "Check", icon: FileText },
                    { value: "cash", label: "Cash", icon: Banknote },
                    { value: "store_credit", label: "Credit", icon: CreditCard },
                    { value: "other", label: "Other", icon: Wallet },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPayoutForm((prev) => ({ ...prev, payment_type: value }))}
                      className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        payoutForm.payment_type === value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border hover:border-border bg-foreground/5"
                      }`}
                    >
                      <Icon className="w-8 h-8 text-foreground" />
                      <span className="font-medium text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-4">
                <Label className="text-lg text-foreground">Payout Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  <Input
                    type="number"
                    value={payoutForm.amount}
                    onChange={(e) => setPayoutForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                    className="h-16 pl-12 text-2xl bg-foreground/5 border-border rounded-xl text-foreground"
                    placeholder="0.00"
                  />
                </div>
                {selectedRep.approved_amount > 0 && (
                  <p className="text-sm text-muted-foreground">Available balance: ${selectedRep.approved_amount.toFixed(2)}</p>
                )}
              </div>

              {/* Crypto Fields */}
              {payoutForm.payment_type === "crypto" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg text-foreground">Cryptocurrency</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {["USDT", "BTC", "ETH"].map((crypto) => (
                        <button
                          key={crypto}
                          onClick={() => setPayoutForm((prev) => ({ ...prev, crypto_currency: crypto }))}
                          className={`p-4 rounded-xl border-2 font-medium transition-all ${
                            payoutForm.crypto_currency === crypto
                              ? "border-emerald-500 bg-emerald-500/10 text-white"
                              : "border-border hover:border-border bg-foreground/5 text-foreground"
                          }`}
                        >
                          {crypto}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg text-foreground">Wallet Address</Label>
                    <Input
                      value={payoutForm.wallet_address}
                      onChange={(e) => setPayoutForm((prev) => ({ ...prev, wallet_address: e.target.value }))}
                      className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                      placeholder="Enter wallet address"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg text-foreground">Transaction Hash (optional)</Label>
                    <Input
                      value={payoutForm.transaction_hash}
                      onChange={(e) => setPayoutForm((prev) => ({ ...prev, transaction_hash: e.target.value }))}
                      className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                      placeholder="Enter after sending payment"
                    />
                  </div>
                </div>
              )}

              {/* Non-crypto transaction number */}
              {payoutForm.payment_type !== "crypto" && (
                <div className="space-y-4">
                  <Label className="text-lg text-foreground">Transaction/Reference Number</Label>
                  <Input
                    value={payoutForm.transaction_number}
                    onChange={(e) => setPayoutForm((prev) => ({ ...prev, transaction_number: e.target.value }))}
                    className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                    placeholder="Check number, transfer ID, etc."
                  />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-4">
                <Label className="text-lg text-foreground">Notes (optional)</Label>
                <Textarea
                  value={payoutForm.notes}
                  onChange={(e) => setPayoutForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[120px] bg-foreground/5 border-border rounded-xl resize-none text-foreground"
                  placeholder="Add any notes about this payout..."
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-4">
                <Label className="text-lg text-foreground">Receipt (optional)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-border transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Click to upload receipt</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleCreatePayout}
                disabled={saving || payoutForm.amount <= 0}
                className="w-full h-14 text-lg rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-5 h-5 mr-2" />
                {saving ? "Creating Payout..." : `Create Payout for $${payoutForm.amount.toFixed(2)}`}
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
