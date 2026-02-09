'use client'

import { useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useCartStore } from '@/lib/cart-store'
import { useSupplyStoreCart } from '@/lib/supply-store/cart'

export default function ClearAuthPage() {
  useEffect(() => {
    async function clearEverything() {
      try {
        // Clear all zustand stores
        useCartStore.setState({ items: [] });
        useSupplyStoreCart.setState({ items: [] });
        
        // Clear ALL localStorage (nuclear option)
        try {
          localStorage.clear();
        } catch {}
        
        // Clear session storage
        try {
          sessionStorage.clear();
        } catch {}
        
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Force sign out from Supabase
        try {
          const supabase = getSupabaseBrowserClient()
          await supabase.auth.signOut()
        } catch {}
        
        console.log('[ClearAuth] All auth and store data cleared');
        
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      } catch (error) {
        console.error('[ClearAuth] Error clearing auth:', error)
        window.location.href = '/login'
      }
    }
    
    clearEverything()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Clearing authentication...</h1>
        <p>You will be redirected to login shortly.</p>
      </div>
    </div>
  )
}
