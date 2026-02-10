"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface SupplierAuthGuardProps {
  children: React.ReactNode
}

// Roles that can access supplier pages
const ALLOWED_ROLES = ["supplier", "superadmin"]

export function SupplierAuthGuard({ children }: SupplierAuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push("/login")
        return
      }

      // Check if user has supplier or superadmin role
      const { data: dbUser } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", session.user.id)
        .single()

      const role = dbUser?.role
      if (!role || !ALLOWED_ROLES.includes(role)) {
        // Redirect unauthorized users to home
        router.push("/")
        return
      }

      setUserRole(role)
      setIsAuthorized(true)
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

// Export for use in components that need to check the role
export { ALLOWED_ROLES }

