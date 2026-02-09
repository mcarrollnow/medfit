"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search, Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { SupplyStoreBusinessTypeSwitcher } from "./business-type-switcher"
import { useSupplyStoreCart } from "@/lib/supply-store/cart"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export function SupplyStoreNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const cartStore = useSupplyStoreCart()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setItemCount(cartStore.getItemCount())
  }, [cartStore.items])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinks = [
    { href: "/supply-store", label: "Home" },
    { href: "/supply-store/products", label: "Products" },
    { href: "/supply-store/orders", label: "My Orders" },
    { href: "/supply-store/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="relative rounded-3xl glass-card">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/supply-store" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <span className="text-background font-serif text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-lg tracking-tight font-light">Modern Health Pro</span>
                <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">B2B Supply</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <SupplyStoreBusinessTypeSwitcher />

              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-light transition-colors",
                      pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="glass-button p-3 rounded-xl transition-all duration-300">
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/supply-store/cart"
                className="relative glass-button p-3 rounded-xl transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-xs font-mono flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="hidden lg:flex glass-button p-3 rounded-xl transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden glass-button p-3 rounded-xl transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-[rgba(255,255,255,0.08)] px-6 py-4">
              <div className="flex flex-col gap-4">
                <SupplyStoreBusinessTypeSwitcher />
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-light transition-all duration-300",
                        pathname === link.href
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl text-sm font-light text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)] text-left flex items-center gap-2 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
