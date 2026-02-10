'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, User } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Sales Reps', href: '/admin/reps' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Discounts', href: '/admin/discounts' },
  { name: 'Payments', href: '/admin/payments' },
  { name: 'Wallets', href: '/admin/wallets' },
  { name: 'Policies', href: '/admin/policy' },
  { name: 'PCI Scan', href: '/admin/pci-scan' },
  { name: 'Settings', href: '/admin/settings' },
]

function NavLink({ item, index, isOpen, isActive, onClose }: {
  item: { name: string; href: string }
  index: number
  isOpen: boolean
  isActive: boolean
  onClose: () => void
}) {
  const [gradientPosition, setGradientPosition] = useState(0)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget
    const clientX = e.clientX
    
    if (!target) return
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = (x / rect.width) * 100
      setGradientPosition(Math.max(0, Math.min(100, percentage)))
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    setGradientPosition(0)
  }, [])

  return (
    <Link
      href={item.href}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative text-5xl md:text-7xl font-bold tracking-tight transition-all duration-500 select-none cursor-pointer",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ 
        transitionDelay: isOpen ? `${100 + index * 80}ms` : '0ms',
      }}
    >
      <span 
        className="relative block bg-clip-text text-transparent transition-all"
        style={{
          backgroundImage: isActive 
            ? `linear-gradient(to right, #ec4899 0%, #ec4899 ${gradientPosition}%, #06b6d4 ${gradientPosition}%, #06b6d4 100%)`
            : `linear-gradient(to right, #22d3ee 0%, #22d3ee ${gradientPosition}%, #ffffff ${gradientPosition}%, #ffffff 100%)`,
          filter: gradientPosition > 0 
            ? (isActive 
                ? 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))' 
                : 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.4))')
            : (isActive 
                ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))'
                : 'none'),
          transition: gradientPosition === 0 ? 'all 0.3s ease-out' : 'filter 0.1s ease-out',
          willChange: 'background-image',
        }}
      >
        {item.name}
      </span>
    </Link>
  )
}

export function AdminOverlayNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-40 p-3 rounded-lg bg-background/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.15)] group"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6 text-foreground group-hover:text-cyan-400 transition-colors duration-300" />
      </button>

      {/* Fullscreen Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-500 ease-out",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        {/* Background with 98% opacity */}
        <div 
          className={cn(
            "absolute inset-0 bg-background transition-all duration-500",
            isOpen ? "opacity-98" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute top-6 right-6 z-10 p-3 rounded-lg bg-foreground/10 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}
          aria-label="Close navigation menu"
        >
          <X className="h-8 w-8 text-foreground group-hover:text-cyan-400 transition-colors duration-300" />
        </button>

        {/* Admin Profile */}
        <div 
          className={cn(
            "flex flex-col items-center gap-4 transition-all duration-500",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}
          style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
        >
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <User className="h-12 w-12 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-wide">Admin User</h2>
        </div>

        {/* Navigation Links */}
        <nav className="relative z-10 h-full flex flex-col items-center justify-center gap-4 md:gap-6 px-6">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <NavLink
                key={item.name}
                item={item}
                index={index}
                isOpen={isOpen}
                isActive={isActive}
                onClose={() => setIsOpen(false)}
              />
            )
          })}
        </nav>

        {/* Subtle grid background effect for high-tech feel */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </>
  )
}
