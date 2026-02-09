'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

interface AuthStore {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session, user: session?.user || null }),

      signOut: async () => {
        const supabase = getSupabaseBrowserClient()
        await supabase.auth.signOut()
        set({ user: null, session: null })
        window.location.href = '/login'
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const supabase = getSupabaseBrowserClient()
          const { data: { session } } = await supabase.auth.getSession()
          set({ session, user: session?.user || null, isLoading: false })
        } catch (error) {
          console.error('[AuthStore] Error checking auth:', error)
          set({ user: null, session: null, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      }),
    }
  )
)
