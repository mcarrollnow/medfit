"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Wallet, LogIn, LogOut, ChevronDown, ChevronUp } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface Rep {
  id: string
  email: string
  name: string
  first_name: string
  last_name: string
}

interface RepCommissionWidgetProps {
  cartTotal: number
  onApplyCommission?: (useCommission: boolean, commissionAmount: number) => void
  className?: string
}

export function RepCommissionWidget({ cartTotal, onApplyCommission, className = "" }: RepCommissionWidgetProps) {
  const [rep, setRep] = useState<Rep | null>(null)
  const [commissionBalance, setCommissionBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing rep session on mount
  useEffect(() => {
    checkRepSession()
  }, [])

  const checkRepSession = async () => {
    setIsLoading(true)
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        // Check if user is a rep - use auth_id to match Supabase Auth user
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, role")
          .eq("auth_id", session.user.id)
          .single()

        if (userError) {
          console.error("[RepWidget] Error fetching user:", userError)
        }

        if (userData?.role === "rep") {
          await loadRepData(userData.id, userData.email, userData.first_name, userData.last_name)
        }
      }
    } catch (error) {
      console.error("[RepWidget] Error checking session:", error)
    }

    setIsLoading(false)
  }

  const loadRepData = async (id: string, email: string, firstName: string, lastName: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    // Get commission balances
    const { data: commissions } = await supabase
      .from("rep_commissions")
      .select("commission_amount, status")
      .eq("rep_id", id)

    const approved_balance = (commissions || [])
      .filter((c) => c.status === "approved")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

    const name = `${firstName || ""} ${lastName || ""}`.trim() || "Representative"

    setRep({
      id,
      email,
      name,
      first_name: firstName || "",
      last_name: lastName || "",
    })
    setCommissionBalance(approved_balance)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return false

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return false
    }

    // Check if user is a rep - use auth_id to match Supabase Auth user
    const { data: userData } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, role")
      .eq("auth_id", data.user.id)
      .single()

    if (!userData || userData.role !== "rep") {
      await supabase.auth.signOut()
      return false
    }

    await loadRepData(userData.id, userData.email, userData.first_name, userData.last_name)
    return true
  }

  const logout = async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setRep(null)
    setCommissionBalance(0)
  }
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [useCommission, setUseCommission] = useState(false)

  const commissionToApply = Math.min(commissionBalance, cartTotal)
  const remainingBalance = cartTotal - (useCommission ? commissionToApply : 0)

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError("")
    const success = await login(email, password)
    if (!success) {
      setLoginError("Invalid email or password")
    } else {
      setShowLogin(false)
      setEmail("")
      setPassword("")
    }
    setLoginLoading(false)
  }

  const handleToggleCommission = (checked: boolean) => {
    setUseCommission(checked)
    onApplyCommission?.(checked, checked ? commissionToApply : 0)
  }

  if (isLoading) {
    return (
      <div className={`bg-foreground/5 rounded-2xl p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-foreground/10 rounded w-1/2"></div>
      </div>
    )
  }

  // Not logged in - show login prompt
  if (!rep) {
    return (
      <div className={`bg-foreground/5 border border-border rounded-2xl p-6 ${className}`}>
        <button
          onClick={() => setShowLogin(!showLogin)}
          className="w-full flex items-center justify-between text-foreground/70 hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5" />
            <span className="text-base">Are you a rep? Login to use commission</span>
          </div>
          {showLogin ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showLogin && (
          <div className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <Button
              onClick={handleLogin}
              disabled={loginLoading || !email || !password}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-medium"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loginLoading ? "Logging in..." : "Login as Rep"}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Logged in - show commission balance and toggle
  return (
    <div
      className={`bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-foreground font-medium">{rep.name}</p>
            <p className="text-foreground/60 text-sm">Rep Account</p>
          </div>
        </div>
        <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-foreground/20 rounded-xl p-4 mb-4">
        <p className="text-foreground/60 text-sm mb-1">Available Commission</p>
        <p className="text-2xl font-bold text-amber-400">${commissionBalance.toFixed(2)}</p>
      </div>

      {commissionBalance > 0 && (
        <>
          <div className="flex items-center justify-between py-4 border-t border-border">
            <span className="text-foreground">Apply commission to order</span>
            <Switch
              checked={useCommission}
              onCheckedChange={handleToggleCommission}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          {useCommission && (
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-foreground/70">
                <span>Cart Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Commission Applied</span>
                <span>-${commissionToApply.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground text-lg font-bold pt-2 border-t border-border">
                <span>You Pay</span>
                <span>${remainingBalance.toFixed(2)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Hook for programmatic access - standalone version that doesn't require context
export function useRepCommission() {
  const [rep, setRep] = useState<Rep | null>(null)
  const [commissionBalance, setCommissionBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setIsLoading(false)
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Use auth_id to match Supabase Auth user
          const { data: userData } = await supabase
            .from("users")
            .select("id, email, first_name, last_name, role")
            .eq("auth_id", session.user.id)
            .single()

          if (userData?.role === "rep") {
            const { data: commissions } = await supabase
              .from("rep_commissions")
              .select("commission_amount, status")
              .eq("rep_id", userData.id)

            const approved = (commissions || [])
              .filter((c) => c.status === "approved")
              .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

            const name = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Representative"
            setRep({
              id: userData.id,
              email: userData.email,
              name,
              first_name: userData.first_name || "",
              last_name: userData.last_name || "",
            })
            setCommissionBalance(approved)
          }
        }
      } catch (error) {
        console.error("[useRepCommission] Error:", error)
      }
      setIsLoading(false)
    }

    checkSession()
  }, [])

  return {
    isRep: !!rep,
    repId: rep?.id,
    repName: rep?.name,
    commissionBalance,
    isLoading,
    calculateDiscount: (cartTotal: number) => Math.min(commissionBalance, cartTotal),
    calculateFinalTotal: (cartTotal: number, applyCommission: boolean) => {
      if (!applyCommission) return cartTotal
      return Math.max(0, cartTotal - commissionBalance)
    },
  }
}

