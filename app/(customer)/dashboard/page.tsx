'use client'

import Link from 'next/link'
import { Package, ArrowRight, ShoppingBag, Trophy, Gift, MessageSquare, User, FileText } from 'lucide-react'

export default function DashboardPage() {
  const quickLinks = [
    {
      title: "Orders",
      description: "View your order history, stats, and track shipments",
      href: "/orders",
      icon: Package,
    },
    {
      title: "Rewards",
      description: "Check your points balance and tier status",
      href: "/rewards",
      icon: Trophy,
    },
    {
      title: "Referral Code",
      description: "Share your code and earn rewards",
      href: "/profile#referral",
      icon: Gift,
    },
    {
      title: "Support",
      description: "Get help with your orders and account",
      href: "/support",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      description: "Manage your account and shipping address",
      href: "/profile",
      icon: User,
    },
    {
      title: "Tax Documents",
      description: "Download your purchase records for tax purposes",
      href: "/orders#downloads",
      icon: FileText,
    },
    {
      title: "Shop",
      description: "Browse our catalog of research compounds",
      href: "/",
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 md:px-20 py-12 md:py-24 max-w-[1400px]">
        {/* Header */}
        <div className="mb-16 md:mb-24 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">Dashboard</h1>
          <p className="text-xl text-white/50">Manage your account and orders.</p>
        </div>

        {/* Quick Links Grid */}
        <section className="space-y-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/20"
              >
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/10">
                      <link.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight text-white">{link.title}</h3>
                      <p className="text-base text-white/50">{link.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
