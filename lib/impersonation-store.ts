'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Impersonation modes
export type ImpersonationMode = 'customer' | 'rep' | 'supplier' | null

// User info when impersonating a specific user
export interface ImpersonatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  customerId?: string
  profilePictureUrl?: string
}

interface ImpersonationStore {
  // Current impersonation state
  isImpersonating: boolean
  mode: ImpersonationMode
  impersonatedUser: ImpersonatedUser | null
  
  // The admin's original user info (to restore later)
  adminUserId: string | null
  
  // Actions
  startImpersonation: (mode: ImpersonationMode, user?: ImpersonatedUser, adminId?: string) => void
  stopImpersonation: () => void
  
  // Getters
  getDisplayRole: () => string
  getDisplayName: () => string
}

export const useImpersonationStore = create<ImpersonationStore>()(
  persist(
    (set, get) => ({
      isImpersonating: false,
      mode: null,
      impersonatedUser: null,
      adminUserId: null,

      startImpersonation: (mode, user, adminId) => {
        set({
          isImpersonating: true,
          mode,
          impersonatedUser: user || null,
          adminUserId: adminId || get().adminUserId,
        })
      },

      stopImpersonation: () => {
        set({
          isImpersonating: false,
          mode: null,
          impersonatedUser: null,
          // Keep adminUserId for reference
        })
      },

      getDisplayRole: () => {
        const state = get()
        if (!state.isImpersonating) return ''
        if (state.impersonatedUser) {
          return state.impersonatedUser.role
        }
        return state.mode || ''
      },

      getDisplayName: () => {
        const state = get()
        if (!state.isImpersonating) return ''
        if (state.impersonatedUser) {
          return `${state.impersonatedUser.firstName} ${state.impersonatedUser.lastName}`.trim() || state.impersonatedUser.email
        }
        // Generic mode impersonation
        switch (state.mode) {
          case 'customer': return 'Customer View'
          case 'rep': return 'Rep View'
          case 'supplier': return 'Supplier View'
          default: return ''
        }
      },
    }),
    {
      name: 'impersonation-storage',
    }
  )
)

// Helper hook to check if we should show impersonated content
export function useEffectiveRole(actualRole: string): string {
  const { isImpersonating, mode, impersonatedUser } = useImpersonationStore()
  
  if (!isImpersonating) return actualRole
  
  // If impersonating a specific user, use their role
  if (impersonatedUser) {
    return impersonatedUser.role
  }
  
  // If just viewing as a role type
  if (mode) {
    return mode
  }
  
  return actualRole
}
