"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X, Users, LayoutDashboard, Globe, ArrowLeft, Package, Percent, UserCheck, ShoppingCart, BarChart3, Wallet, Trophy, Link2, Settings, LogOut, CreditCard, ScrollText, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Sales Reps", href: "/admin/reps", icon: UserCheck },
  { title: "Inventory", href: "/admin/inventory", icon: Package },
  { title: "Discounts", href: "/admin/discounts", icon: Percent },
  { title: "Rewards", href: "/admin/rewards", icon: Trophy },
  { title: "Referrals", href: "/admin/referrals", icon: Link2 },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Wallets", href: "/admin/wallets", icon: Wallet },
  { title: "Website", href: "/admin/website", icon: Globe },
  { title: "Policies", href: "/admin/policy", icon: ScrollText },
  { title: "PCI Scan", href: "/admin/pci-scan", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      // Clear all auth-related localStorage items
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('sb-') ||
        key.includes('token')
      );
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch {}
      });
      
      // Clear session storage
      try {
        sessionStorage.clear();
      } catch {}
      
      const supabase = createClient()
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        console.error("Logout error:", error)
        // Still redirect even on error since we cleared local state
      }
      // Use hard navigation to clear all cached state
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even on error
      window.location.href = "/login"
    }
  }

  return (
    <>
      {/* Fixed Header - matching GlobalNav style */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm z-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <Link href="/admin" className="flex items-center space-x-3 flex-shrink-0">
              <img
                src="/images/eagleonlywhite.svg"
                alt="Admin Logo"
                className="w-8 h-8"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
                  ADMIN PANEL
                </h1>
              </div>
              <h1 className="text-base font-bold text-foreground whitespace-nowrap block sm:hidden">
                ADMIN
              </h1>
            </Link>

            {/* Current Page Indicator (desktop only) */}
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">
                {navItems.find(item => 
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                )?.title || "Dashboard"}
              </span>
            </div>

            {/* Right Side - Menu Button */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Back to Store Link */}
              <Link 
                href="/" 
                className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Store
              </Link>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-foreground hover:text-foreground/80 transition relative flex items-center gap-2"
                aria-label="Menu"
              >
                <span className="text-sm font-medium hidden sm:block">MENU</span>
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Full-Page Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <span className="text-sm font-medium tracking-wide hidden sm:block">CLOSE</span>
              <X className="h-6 w-6" />
            </button>

            {/* Menu Content */}
            <div className="flex h-full flex-col items-center justify-center overflow-y-auto py-16">
              <nav className="flex flex-col items-center gap-3 md:gap-4">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-all duration-300",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Separator */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="w-20 h-px bg-foreground/10 my-2"
                />

                {/* Back to Site */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center gap-3 text-lg md:text-xl font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                    Back to Store
                  </Link>
                </motion.div>

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 text-lg md:text-xl font-medium text-red-400/60 hover:text-red-400 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
