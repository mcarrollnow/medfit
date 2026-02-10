"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Wallet,
  DollarSign,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Key,
  RefreshCw,
  X,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCurrentRep, getRepStats, type RepStats } from "@/app/actions/rep"
import { getRepWallet, createRepWallet, getRepMnemonic, setupRepWalletSecurity, type RepWallet } from "@/app/actions/rep-wallet"
import { cn } from "@/lib/utils"

export default function RepWalletPage() {
  const [loading, setLoading] = useState(true)
  const [repId, setRepId] = useState<string | null>(null)
  const [repName, setRepName] = useState("Representative")
  const [stats, setStats] = useState<RepStats | null>(null)

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
          const [repWallet, repStats] = await Promise.all([
            getRepWallet(rep.id),
            getRepStats(rep.id)
          ])
          setWallet(repWallet)
          setStats(repStats)
        }
      } catch (error) {
        console.error("[Rep Wallet] Error loading data:", error)
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
        // Reload wallet
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
        <div className="w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Wallet</h1>
          <p className="text-xl text-muted-foreground">Manage your commission payments and withdrawals.</p>
        </div>

        {/* Wallet/PIN Setup Notification Banner */}
        {!wallet && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Wallet className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-400">Set Up Your Commission Wallet</h3>
                <p className="text-amber-200/70 text-sm">Create a wallet to receive commission payments in cryptocurrency.</p>
              </div>
              <Button
                onClick={() => setShowWalletSetup(true)}
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
                onClick={() => setShowWalletSetup(true)}
                className="h-11 bg-red-500 text-white hover:bg-red-400 rounded-xl font-semibold shrink-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                Set Up PIN
              </Button>
            </div>
          </div>
        )}

        {/* Earnings Overview */}
        {stats && (
          <section className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">${stats.totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">All time earnings</p>
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
                  <p className="text-3xl font-bold tracking-tight text-amber-400">${stats.pendingCommission.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Processing orders</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{stats.activeOrders}</p>
                  <p className="text-sm text-muted-foreground">In progress</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Wallet Section */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Wallet</h2>
          <div
            className="relative overflow-hidden rounded-3xl border border-border p-8 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(58,66,51,0.15)' }}
          >
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              {/* Created Mnemonic Display */}
              {createdMnemonic && (
                <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400">Save Your Recovery Phrase</h3>
                  </div>
                  <p className="text-amber-200/80 text-sm mb-4">
                    This is the only way to recover your wallet. Write it down and store it safely. Never share it with anyone.
                  </p>
                  <div className="p-4 rounded-xl bg-foreground/30 font-mono text-amber-200 leading-relaxed break-all mb-4">
                    {createdMnemonic}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => copyToClipboard(createdMnemonic, "mnemonic")}
                      className="h-10 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl"
                    >
                      {copiedText === "mnemonic" ? (
                        <><Check className="w-4 h-4 mr-2" /> Copied!</>
                      ) : (
                        <><Copy className="w-4 h-4 mr-2" /> Copy</>
                      )}
                    </Button>
                    <Button
                      onClick={() => setCreatedMnemonic(null)}
                      className="h-10 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl"
                    >
                      I've Saved It
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Display */}
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
                // Wallet Exists
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-border flex items-center justify-center">
                        <Wallet className="h-8 w-8 text-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">Commission Wallet</p>
                        <p className="font-mono text-muted-foreground">
                          {wallet.address.slice(0, 12)}...{wallet.address.slice(-10)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wallet.has_pin && (
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Secured</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Balances */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">ETH Balance</p>
                      <p className="text-3xl font-bold text-foreground">
                        {parseFloat(wallet.balance_eth || "0").toFixed(6)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Ethereum</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">USDC Balance</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        ${parseFloat(wallet.balance_usdc || "0").toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">USD Coin</p>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Wallet Address</p>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-foreground/30 px-4 py-3 rounded-lg text-foreground font-mono text-sm break-all">
                        {wallet.address}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(wallet.address, "address")}
                        className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl shrink-0"
                      >
                        {copiedText === "address" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                    {wallet.has_pin ? (
                      // View Recovery Phrase
                      <div className="flex items-center gap-2">
                        <Input
                          type="password"
                          value={mnemonicPin}
                          onChange={(e) => setMnemonicPin(e.target.value.replace(/\D/g, "").slice(0, 12))}
                          placeholder="Enter PIN"
                          className="h-11 w-36 bg-foreground/5 border-border rounded-xl text-foreground text-center"
                        />
                        <Button
                          onClick={handleViewMnemonic}
                          disabled={walletLoading || !mnemonicPin}
                          className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl disabled:opacity-50"
                        >
                          {walletLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <><Key className="w-4 h-4 mr-2" /> View Recovery Phrase</>
                          )}
                        </Button>
                      </div>
                    ) : (
                      // Set Up Security
                      <Button
                        onClick={() => setShowWalletSetup(true)}
                        className="h-11 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Set Up PIN
                      </Button>
                    )}
                  </div>

                  {/* Security Setup Form */}
                  {showWalletSetup && !wallet.has_pin && (
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                      <h4 className="font-semibold text-foreground text-lg">Set Up Wallet Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Create a PIN to secure your wallet and access your recovery phrase.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Create PIN</label>
                          <div className="relative">
                            <Input
                              type={showPin ? "text" : "password"}
                              value={walletPin}
                              onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 12))}
                              placeholder="4-12 digits"
                              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPin(!showPin)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPin ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Confirm PIN</label>
                          <Input
                            type="password"
                            value={walletPinConfirm}
                            onChange={(e) => setWalletPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 12))}
                            placeholder="Confirm PIN"
                            className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSetupSecurity}
                          disabled={walletLoading || !walletPin || walletPin !== walletPinConfirm}
                          className="h-11 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                        >
                          {walletLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Lock className="w-4 h-4 mr-2" />
                          )}
                          Save PIN
                        </Button>
                        <Button
                          onClick={() => {
                            setShowWalletSetup(false)
                            setWalletPin("")
                            setWalletPinConfirm("")
                          }}
                          className="h-11 bg-foreground/5 hover:bg-foreground/10 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // No Wallet - Create One
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="mx-auto h-20 w-20 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mb-4">
                      <Wallet className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">No Wallet Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Create a wallet to receive commission payments in cryptocurrency. Your wallet will be secured with a PIN.
                    </p>
                  </div>

                  {showWalletSetup ? (
                    <div className="p-6 rounded-2xl bg-foreground/5 border border-border space-y-4">
                      <h4 className="font-semibold text-foreground text-lg">Create Your Wallet</h4>
                      <p className="text-sm text-muted-foreground">
                        Set up a PIN to secure your wallet. You can skip this and add it later, but we recommend securing it now.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Create PIN (optional)</label>
                          <div className="relative">
                            <Input
                              type={showPin ? "text" : "password"}
                              value={walletPin}
                              onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 12))}
                              placeholder="4-12 digits"
                              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPin(!showPin)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPin ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-foreground/60">Confirm PIN</label>
                          <Input
                            type="password"
                            value={walletPinConfirm}
                            onChange={(e) => setWalletPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 12))}
                            placeholder="Confirm PIN"
                            className={cn(
                              "h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center tracking-[0.3em]",
                              walletPinConfirm && walletPin !== walletPinConfirm && "border-red-500/50"
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleCreateWallet}
                          disabled={walletLoading || (walletPin !== "" && walletPin !== walletPinConfirm)}
                          className="h-11 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                        >
                          {walletLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Wallet className="w-4 h-4 mr-2" />
                          )}
                          Create Wallet
                        </Button>
                        <Button
                          onClick={() => {
                            setShowWalletSetup(false)
                            setWalletPin("")
                            setWalletPinConfirm("")
                          }}
                          className="h-11 bg-foreground/5 hover:bg-foreground/10 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowWalletSetup(true)}
                      className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold text-lg"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Create Wallet
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Transaction History Placeholder */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Transaction History</h2>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 text-center py-8">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Your commission payouts will appear here</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

