'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const pages = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Discounts', href: '/admin/discounts' },
  { name: 'Wallets', href: '/admin/wallets' },
  { name: 'Settings', href: '/admin/settings' },
  { name: 'Theme', href: '/admin/theme' },
]

export function PageNavigation() {
  const pathname = usePathname()
  const currentIndex = pages.findIndex(page => page.href === pathname)
  
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4 z-30">
      {prevPage && (
        <Link
          href={prevPage.href}
          className={cn(
            "group flex items-center gap-2 px-6 py-3 rounded-xl",
            "bg-background/80 backdrop-blur-xl border border-border",
            "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
            "transition-all duration-300"
          )}
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-cyan-400 transition-colors">
            {prevPage.name}
          </span>
        </Link>
      )}
      
      {nextPage && (
        <Link
          href={nextPage.href}
          className={cn(
            "group flex items-center gap-2 px-6 py-3 rounded-xl",
            "bg-background/80 backdrop-blur-xl border border-border",
            "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
            "transition-all duration-300"
          )}
        >
          <span className="text-sm font-medium text-muted-foreground group-hover:text-cyan-400 transition-colors">
            {nextPage.name}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
        </Link>
      )}
    </div>
  )
}
