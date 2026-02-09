"use client"

import { useState } from "react"
import { Menu, X, ShoppingCart, User, Home, MessageSquare, Store, LogOut, LogIn, UserPlus } from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  showCart?: boolean
}

export function SiteHeader({ showCart = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mock auth state - replace with real auth
  const [isLoggedIn] = useState(true)
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    avatar: "/diverse-user-avatars.png",
  })

  const [cartCount] = useState(3)

  const handleNavClick = (action: string) => {
    console.log(`[v0] Navigation clicked: ${action}`)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 border-b bg-background z-30">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/abstract-logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Your Brand</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* NotificationCenter (if logged in) */}
              {isLoggedIn && <NotificationCenter />}

              {/* Cart Button (if showCart) */}
              {showCart && (
                <Button variant="ghost" size="icon" className="relative" onClick={() => handleNavClick("cart")}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-yellow text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Hamburger Menu */}
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background z-[9999] overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mt-16">
              {/* User Profile (if logged in) */}
              {isLoggedIn && (
                <div className="flex items-center space-x-4 mb-12 pb-8 border-b">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-accent-yellow"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-accent-yellow text-black text-sm font-semibold uppercase rounded">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-6">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavClick("dashboard")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <Home className="w-8 h-8" />
                      <span className="text-3xl font-bold">Dashboard</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("profile")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <User className="w-8 h-8" />
                      <span className="text-3xl font-bold">Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("support")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <MessageSquare className="w-8 h-8" />
                      <span className="text-3xl font-bold">Support</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("shop")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <Store className="w-8 h-8" />
                      <span className="text-3xl font-bold">Shop</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("logout")}
                      className="flex items-center space-x-4 w-full text-left hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-8 h-8" />
                      <span className="text-3xl font-bold">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick("shop")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <Store className="w-8 h-8" />
                      <span className="text-3xl font-bold">Shop</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("login")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <LogIn className="w-8 h-8" />
                      <span className="text-3xl font-bold">Login</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("register")}
                      className="flex items-center space-x-4 w-full text-left hover:text-accent-yellow transition-colors"
                    >
                      <UserPlus className="w-8 h-8" />
                      <span className="text-3xl font-bold">Register</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
