"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnalyticsDashboard } from "@/components/rep-dashboard/analytics-dashboard"
import { getRepOrders, getRepStats, getCurrentRep, type RepOrder, type RepStats } from "@/app/actions/rep"
import { getRepWallet, createRepWallet, getRepMnemonic, setupRepWalletSecurity, type RepWallet } from "@/app/actions/rep-wallet"
import { 
  DollarSign, TrendingUp, Users, Wallet, Loader2, ShoppingBag, Tag, UserCheck, Shield, Lock, 
  Eye, EyeOff, Copy, Check, AlertCircle, Key, RefreshCw, X, FileText, ShoppingCart, Percent,
  HeadphonesIcon, Store, ChevronRight, LayoutDashboard, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const dashboardSections = [
  {
    title: "Customers",
    description: "Manage your customer relationships and accounts",
    icon: Users,
    href: "/rep/customers",
  },
  {
    title: "Orders",
    description: "Track and manage customer orders",
    icon: ShoppingCart,
    href: "/rep/orders",
  },
  {
    title: "Pricing",
    description: "View and manage product pricing",
    icon: DollarSign,
    href: "/rep/pricing",
  },
  {
    title: "Pricing Tiers",
    description: "Create customer pricing tiers with automatic discounts",
    icon: Tag,
    href: "/rep/pricing-tiers",
  },
  {
    title: "Discount Codes",
    description: "Create and manage promotional codes",
    icon: Percent,
    href: "/rep/discounts",
  },
  {
    title: "Reports",
    description: "View detailed sales and performance reports",
    icon: FileText,
    href: "/rep/reports",
  },
  {
    title: "Support",
    description: "Get help and submit support tickets",
    icon: HeadphonesIcon,
    href: "/rep/support",
  },
  {
    title: "Settings",
    description: "Manage your account preferences",
    icon: Settings,
    href: "/rep/settings",
  },
  {
    title: "Shop",
    description: "Browse and manage product catalog",
    icon: Store,
    href: "/",
  },
]

export default function RepDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [repId, setRepId] = useState<string | null>(null)
  const [repName, setRepName] = useState("Representative")
  const [orders, setOrders] = useState<RepOrder[]>([])
  const [stats, setStats] = useState<RepStats>({
    totalEarnings: 0,
    pendingCommission: 0,
    activeOrders: 0,
    totalCustomers: 0,
    earningsHistory: [],
    customerInsights: [],
  })
  
  // Wallet state
  const [wallet, setWallet] = useState<RepWallet | null>(null)
  const [showWalletSetup, setShowWalletSetup] = useState(false)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletPin, setWalletPin] = useState("")
  const [walletPinConfirm, setWalletPinConfirm] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [createdMnemonic, setCreatedMnemonic] = useState<string | null>(null)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonicPin, setMnemonicPin] = useState("")
  const [walletError, setWalletError] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const rep = await getCurrentRep()
        if (rep) {
          setRepId(rep.id)
          setRepName(rep.name)
          const [repOrders, repStats, repWallet] = await Promise.all([
            getRepOrders(rep.id), 
            getRepStats(rep.id),
            getRepWallet(rep.id)
          ])
          setOrders(repOrders)
          setStats(repStats)
          setWallet(repWallet)
        }
      } catch (error) {
        console.error("[Rep Dashboard] Error loading rep data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleCreateWallet = async () => {
    if (!repId) return
    
    if (walletPin && walletPin !== walletPinConfirm) {
      setWalletError("PINs do not match")
      return
    }

    if (walletPin && (walletPin.length < 4 || walletPin.length > 12)) {
      setWalletError("PIN must be 4-12 digits")
      return
    }

    setWalletLoading(true)
    setWalletError(null)

    try {
      const result = await createRepWallet(repId, { 
        pin: walletPin || undefined 
      })

      if (result.success && result.wallet) {
        setWallet(result.wallet)
        if (result.wallet.mnemonic) {
          setCreatedMnemonic(result.wallet.mnemonic)
        }
        setShowWalletSetup(false)
        setWalletPin("")
        setWalletPinConfirm("")
      } else {
        setWalletError(result.error || "Failed to create wallet")
      }
    } catch (error) {
      setWalletError("Failed to create wallet")
    } finally {
      setWalletLoading(false)
    }
  }

  const handleViewMnemonic = async () => {
    if (!repId || !mnemonicPin) {
      setWalletError("Enter your PIN to view recovery phrase")
      return
    }

    setWalletLoading(true)
    setWalletError(null)

    try {
      const result = await getRepMnemonic(repId, mnemonicPin)
      if (result.success && result.mnemonic) {
        setCreatedMnemonic(result.mnemonic)
        setShowMnemonic(true)
        setMnemonicPin("")
      } else {
        setWalletError(result.error || "Invalid PIN")
      }
    } catch (error) {
      setWalletError("Failed to retrieve recovery phrase")
    } finally {
      setWalletLoading(false)
    }
  }

  const handleSetupSecurity = async () => {
    if (!repId) return
    
    if (walletPin !== walletPinConfirm) {
      setWalletError("PINs do not match")
      return
    }

    if (walletPin.length < 4 || walletPin.length > 12) {
      setWalletError("PIN must be 4-12 digits")
      return
    }

    setWalletLoading(true)
    setWalletError(null)

    try {
      const result = await setupRepWalletSecurity(repId, { pin: walletPin })
      if (result.success) {
        const updatedWallet = await getRepWallet(repId)
        setWallet(updatedWallet)
        setWalletPin("")
        setWalletPinConfirm("")
        setShowWalletSetup(false)
      } else {
        setWalletError(result.error || "Failed to set up security")
      }
    } catch (error) {
      setWalletError("Failed to set up security")
    } finally {
      setWalletLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Wallet/PIN Setup Notification Banner */}
        {!wallet && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Wallet className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-400">Set Up Your Commission Wallet</h3>
                <p className="text-amber-200/70 text-sm">Create a wallet to receive commission payments. Scroll down to the Wallet section to get started.</p>
              </div>
              <Button
                onClick={() => {
                  setShowWalletSetup(true)
                  document.getElementById('wallet-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="h-11 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-semibold shrink-0"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Create Wallet
              </Button>
            </div>
          </div>
        )}

        {wallet && !wallet.has_pin && (
          <div className="rounded-2xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400">⚠️ Secure Your Wallet with a PIN</h3>
                <p className="text-red-200/70 text-sm">Your wallet is not secured. Set up a PIN to protect your funds and access your recovery phrase.</p>
              </div>
              <Button
                onClick={() => {
                  setShowWalletSetup(true)
                  document.getElementById('wallet-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="h-11 bg-red-500 text-white hover:bg-red-400 rounded-xl font-semibold shrink-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                Set Up PIN
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Rep Dashboard</h1>
            <p className="text-xl text-muted-foreground">Welcome back, {repName}.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/">
              <Button className="h-11 px-5 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">${stats.totalEarnings.toFixed(2)}</p>
                {stats.totalEarnings > 0 && (
                  <p className="text-sm text-emerald-400">+12.5% from last month</p>
                )}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payout</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">${stats.pendingCommission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Processing orders</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">{stats.activeOrders}</p>
                <p className="text-sm text-muted-foreground">Orders in progress</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">{stats.totalCustomers}</p>
                {stats.totalCustomers > 0 && (
                  <p className="text-sm text-emerald-400">+{Math.min(stats.totalCustomers, 4)} this month</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Wallet Section */}
        <section id="wallet-section" className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Wallet</h2>
          <div 
            className="relative overflow-hidden rounded-3xl border border-border p-8 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(58,66,51,0.15)' }}
          >
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              {createdMnemonic && (
                <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400">Save Your Recovery Phrase</h3>
                  </div>
                  <p className="text-amber-200/80 text-sm mb-4">
                    This is the only way to recover your wallet. Write it down and store it safely.
                  </p>
                  <div className="p-4 rounded-xl bg-foreground/30 font-mono text-amber-200 leading-relaxed break-all mb-4">
                    {createdMnemonic}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => copyToClipboard(createdMnemonic, "mnemonic")}
                      className="h-10 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl"
                    >
                      {copiedText === "mnemonic" ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                    </Button>
                    <Button onClick={() => setCreatedMnemonic(null)} className="h-10 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl">
                      I've Saved It
                    </Button>
                  </div>
                </div>
              )}

              {walletError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400">{walletError}</p>
                  <button onClick={() => setWalletError(null)} className="ml-auto">
                    <X className="h-4 w-4 text-red-400/60 hover:text-red-400" />
                  </button>
                </div>
              )}

              {wallet ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-border flex items-center justify-center">
                        <Wallet className="h-7 w-7 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-foreground">Commission Wallet</p>
                        <p className="font-mono text-muted-foreground text-sm">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</p>
                      </div>
                    </div>
                    {wallet.has_pin && (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">Secured</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">ETH Balance</p>
                      <p className="text-2xl font-bold text-foreground">{parseFloat(wallet.balance_eth || "0").toFixed(6)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">USDC Balance</p>
                      <p className="text-2xl font-bold text-foreground">${parseFloat(wallet.balance_usdc || "0").toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => copyToClipboard(wallet.address, "address")} className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl">
                      {copiedText === "address" ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Address</>}
                    </Button>
                    
                    {wallet.has_pin ? (
                      <div className="flex items-center gap-2">
                        <Input type="password" value={mnemonicPin} onChange={(e) => setMnemonicPin(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Enter PIN" className="h-11 w-32 bg-foreground/5 border-border rounded-xl text-foreground text-center" />
                        <Button onClick={handleViewMnemonic} disabled={walletLoading || !mnemonicPin} className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl disabled:opacity-50">
                          {walletLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Key className="w-4 h-4 mr-2" /> View Recovery</>}
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setShowWalletSetup(true)} className="h-11 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl">
                        <Lock className="w-4 h-4 mr-2" /> Set Up PIN
                      </Button>
                    )}
                  </div>

                  {showWalletSetup && !wallet.has_pin && (
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                      <h4 className="font-semibold text-foreground">Set Up Wallet Security</h4>
                      <p className="text-sm text-muted-foreground">Create a PIN to secure your wallet and access your recovery phrase.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Create PIN</label>
                          <div className="relative">
                            <Input type={showPin ? "text" : "password"} value={walletPin} onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="4-12 digits" className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em] pr-10" />
                            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2">
                              {showPin ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Confirm PIN</label>
                          <Input type="password" value={walletPinConfirm} onChange={(e) => setWalletPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Confirm PIN" className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em]" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSetupSecurity} disabled={walletLoading || !walletPin || walletPin !== walletPinConfirm} className="h-11 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50">
                          {walletLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />} Save PIN
                        </Button>
                        <Button onClick={() => { setShowWalletSetup(false); setWalletPin(""); setWalletPinConfirm("") }} className="h-11 bg-foreground/5 hover:bg-foreground/10 rounded-xl">Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mb-4">
                      <Wallet className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No Wallet Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">Create a wallet to receive commission payments in cryptocurrency.</p>
                  </div>

                  {showWalletSetup ? (
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                      <h4 className="font-semibold text-foreground">Create Your Wallet</h4>
                      <p className="text-sm text-muted-foreground">Set up a PIN to secure your wallet. You can skip this and add it later.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Create PIN (optional)</label>
                          <div className="relative">
                            <Input type={showPin ? "text" : "password"} value={walletPin} onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="4-12 digits" className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em] pr-10" />
                            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2">
                              {showPin ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Confirm PIN</label>
                          <Input type="password" value={walletPinConfirm} onChange={(e) => setWalletPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Confirm PIN" className={cn("h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em]", walletPinConfirm && walletPin !== walletPinConfirm && "border-red-500/50")} />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleCreateWallet} disabled={walletLoading || (walletPin !== "" && walletPin !== walletPinConfirm)} className="h-11 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50">
                          {walletLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Wallet className="w-4 h-4 mr-2" />} Create Wallet
                        </Button>
                        <Button onClick={() => { setShowWalletSetup(false); setWalletPin(""); setWalletPinConfirm("") }} className="h-11 bg-foreground/5 hover:bg-foreground/10 rounded-xl">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setShowWalletSetup(true)} className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold text-lg">
                      <Wallet className="w-5 h-5 mr-2" /> Create Wallet
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Analytics Dashboard */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Analytics</h2>
          <div 
            className="relative overflow-hidden rounded-2xl border border-border backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(58,66,51,0.15)' }}
          >
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-6">
              <AnalyticsDashboard 
                earningsHistory={stats.earningsHistory}
                orders={orders}
                customers={stats.customerInsights}
              />
            </div>
          </div>
        </section>

        {/* Quick Access Navigation Cards */}
        <section className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Access</h2>
            <p className="text-sm text-muted-foreground mt-1">Navigate to your most used sections</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardSections.map((section) => (
              <Link key={section.title} href={section.href} className="group">
                <div className="h-full rounded-xl border border-border bg-background p-5 transition-all duration-200 hover:border-[#22c55e]/30 hover:bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-card border border-border group-hover:bg-[#22c55e]/10 group-hover:border-[#22c55e]/20 transition-colors">
                      <section.icon className="h-5 w-5 text-[#737373] group-hover:text-[#22c55e] transition-colors" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#525252] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <h3 className="mt-4 font-medium text-foreground group-hover:text-[#22c55e] transition-colors">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#737373] line-clamp-2">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
