"use client"

import { useState } from "react"
import { Search, Bell, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

export function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()

  const menuItems = [
    { label: "Dashboard", href: "/" },
    { label: "Agent", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: "Products", href: "/products" },
    { label: "Customers", href: "/customers" },
    { label: "Wallets", href: "/wallets" },
    { label: "Messages", href: "/messages" },
    { label: "Support Tickets", href: "/tickets" },
    { label: "Analytics", href: "/analytics" },
    { label: "Discounts", href: "/discounts" },
    { label: "Logout", href: "/logout" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src={theme === "dark" ? "/eagle-logo.png" : "/eagle-logo-black.png"}
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-semibold text-foreground whitespace-nowrap">Modern Health Pro</span>
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-9 h-9" />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Hamburger Menu */}
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-background">
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="h-12 w-12">
              <X className="h-8 w-8" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col items-center justify-center h-full gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-extrabold text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
