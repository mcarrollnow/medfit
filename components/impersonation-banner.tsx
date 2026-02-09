'use client'

import { useRouter } from 'next/navigation'
import { Eye, X, User, ArrowLeft } from 'lucide-react'
import { useImpersonationStore } from '@/lib/impersonation-store'
import { toast } from 'sonner'

export default function ImpersonationBanner() {
  const router = useRouter()
  const { isImpersonating, impersonatedUser, mode, stopImpersonation, getDisplayName } = useImpersonationStore()

  if (!isImpersonating) return null

  const displayName = getDisplayName()
  const isSpecificUser = !!impersonatedUser

  const handleExit = () => {
    stopImpersonation()
    toast.success('Exited view mode')
    router.push('/admin')
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Info */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-black/10">
              <Eye className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Viewing as:</span>
              {isSpecificUser && impersonatedUser?.profilePictureUrl ? (
                <img
                  src={impersonatedUser.profilePictureUrl}
                  alt={displayName}
                  className="w-6 h-6 rounded-full object-cover border border-black/20"
                />
              ) : isSpecificUser ? (
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
              ) : null}
              <span className="font-semibold">{displayName}</span>
              {isSpecificUser && impersonatedUser?.role && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/10 font-medium">
                  {impersonatedUser.role}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Exit to Admin</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
