'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    // Check initial auth state
    checkAuth()

    // Set up auth state listener
    const supabase = getSupabaseBrowserClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[AuthProvider] Auth state changed:', _event)
        
        // Only update session if it's different
        if (_event !== 'TOKEN_REFRESHED') {
          setSession(session)
        }
        
        // If signed out AND not already on auth pages, redirect to login
        if (_event === 'SIGNED_OUT' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/clear-auth')) {
          window.location.href = '/login'
        }
      }
    )

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [checkAuth, setSession])

  return <>{children}</>
}
