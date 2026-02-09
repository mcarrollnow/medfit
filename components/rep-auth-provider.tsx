"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface Rep {
  id: string
  email: string
  name: string
  first_name: string
  last_name: string
  commissionBalance: number
  available_balance: number
  approved_balance: number
  pending_balance: number
}

interface RepAuthContextType {
  rep: Rep | null
  commissionBalance: number
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshBalance: () => Promise<void>
}

const RepAuthContext = createContext<RepAuthContextType | undefined>(undefined)

export function RepAuthProvider({ children }: { children: ReactNode }) {
  const [rep, setRep] = useState<Rep | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    setIsLoading(true)
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      // Check if user is a rep - use auth_id to match Supabase Auth user
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, first_name, last_name, role")
        .eq("auth_id", session.user.id)
        .single()

      if (userData?.role === "rep") {
        await loadRepData(userData.id, userData.email, userData.first_name, userData.last_name)
      }
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

    const pending_balance = (commissions || [])
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

    const name = `${firstName || ""} ${lastName || ""}`.trim() || "Representative"

    setRep({
      id,
      email,
      name,
      first_name: firstName || "",
      last_name: lastName || "",
      commissionBalance: approved_balance,
      available_balance: approved_balance,
      approved_balance,
      pending_balance,
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return false

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[RepAuth] Login error:", error.message)
      return false
    }

    if (!data.user) {
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
  }

  const refreshBalance = async () => {
    if (!rep) return
    await loadRepData(rep.id, rep.email, rep.first_name, rep.last_name)
  }

  return (
    <RepAuthContext.Provider
      value={{
        rep,
        commissionBalance: rep?.commissionBalance || 0,
        isLoading,
        isAuthenticated: !!rep,
        login,
        logout,
        refreshBalance,
      }}
    >
      {children}
    </RepAuthContext.Provider>
  )
}

export function useRepAuth() {
  const context = useContext(RepAuthContext)
  if (context === undefined) {
    throw new Error("useRepAuth must be used within a RepAuthProvider")
  }
  return context
}

