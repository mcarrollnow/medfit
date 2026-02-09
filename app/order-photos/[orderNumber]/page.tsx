'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { OrderPhotos } from '@/components/admin/order-photos'
import { OrderPhotoGallery } from '@/components/customer/order-photo-gallery'
import { Loader2, Camera, ShieldAlert } from 'lucide-react'

type UserRole = 'admin' | 'superadmin' | 'rep' | 'customer' | string

export default function OrderPhotosPage() {
  const params = useParams<{ orderNumber: string }>()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const orderNumber = params.orderNumber

  useEffect(() => {
    async function checkAuthAndRole() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push(`/login?redirect=/order-photos/${orderNumber}`)
        return
      }

      // Get role from users table
      const { data: dbUser } = await supabase
        .from('users')
        .select('id, role')
        .eq('auth_id', session.user.id)
        .single()

      const role = dbUser?.role || session.user.user_metadata?.role || 'customer'
      const isStaff = role === 'admin' || role === 'superadmin' || role === 'rep'

      // Look up the order via the API (uses service role, bypasses RLS)
      const res = await fetch(`/api/order-photos/${orderNumber}/photos`)
      
      if (res.status === 403) {
        setAccessDenied(true)
        setLoading(false)
        return
      }

      if (res.status === 401) {
        router.push(`/login?redirect=/order-photos/${orderNumber}`)
        return
      }

      if (!res.ok) {
        setAccessDenied(true)
        setLoading(false)
        return
      }

      const data = await res.json()
      
      setOrderId(data.orderId)
      setUserRole(role)
      setLoading(false)
    }

    checkAuthAndRole()
  }, [supabase, router, orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-foreground/30 animate-spin" />
          <p className="text-foreground/50 text-sm">Loading order photos...</p>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-foreground/50">
            You don&apos;t have permission to view photos for this order.
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-3 bg-foreground text-background rounded-2xl font-light tracking-wide hover:bg-foreground/90 transition-all"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    )
  }

  const isStaff = userRole === 'admin' || userRole === 'superadmin' || userRole === 'rep'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Section header - Chronicles style, plenty of space */}
        <div className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Order #{orderNumber}
          </p>
          <div className="flex items-start gap-4 md:gap-6">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl glass-button flex items-center justify-center">
              <Camera className="w-7 h-7 md:w-8 md:h-8 text-foreground/60" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
                {isStaff ? 'Order photos' : 'Your order photos'}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-xl">
                {isStaff ? 'Take or upload photos for this order before shipping.' : 'Photos of your order will appear here.'}
              </p>
            </div>
          </div>
        </div>

        {/* Render appropriate component based on role */}
        {isStaff ? (
          <OrderPhotos
            orderId={orderId!}
            autoOpenCamera={true}
          />
        ) : (
          <OrderPhotoGallery orderNumber={orderNumber} />
        )}
      </div>
    </div>
  )
}
