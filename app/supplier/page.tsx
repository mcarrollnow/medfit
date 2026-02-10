"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, DollarSign, ArrowRight, Box, Truck, AlertTriangle, ShoppingCart, Users, Clock, Send, ChevronRight, User } from "lucide-react"
import { motion } from "framer-motion"
import { getShipmentStats } from "@/app/actions/shipments"
import { getSupplierDashboardStats, type SupplierOrder } from "@/app/actions/supplier-portal"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { cn } from "@/lib/utils"

export default function SupplierDashboard() {
  const [shipmentStats, setShipmentStats] = useState({ inTransit: 0, delivered: 0, issues: 0 })
  const [dashboardStats, setDashboardStats] = useState({
    customerCount: 0, activeOrders: 0, totalOrders: 0, totalRevenue: 0,
    shipmentsInTransit: 0, shipmentsBuilding: 0, recentOrders: [] as SupplierOrder[],
  })
  const [supplierId, setSupplierId] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", session.user.id)
          .single()
        if (dbUser) setSupplierId(dbUser.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getShipmentStats()
        setShipmentStats(stats)
      } catch (error) {
        console.error("Error loading stats:", error)
      }
    }
    loadStats()
  }, [])

  useEffect(() => {
    if (!supplierId) return
    async function loadDashboardStats() {
      try {
        const stats = await getSupplierDashboardStats(supplierId!)
        setDashboardStats(stats)
      } catch (error) {
        console.error("Error loading dashboard stats:", error)
      }
    }
    loadDashboardStats()
  }, [supplierId])

  const quickLinks = [
    {
      title: "Orders",
      description: "View and manage all customer orders",
      href: "/supplier/orders",
      icon: ShoppingCart,
      badge: dashboardStats.activeOrders > 0 ? dashboardStats.activeOrders : undefined,
    },
    {
      title: "Customers",
      description: "Manage your customer base and profiles",
      href: "/supplier/customers",
      icon: Users,
      badge: dashboardStats.customerCount > 0 ? dashboardStats.customerCount : undefined,
    },
    {
      title: "Ship Product",
      description: "Build shipment manifests and document packages",
      href: "/supplier/ship-product",
      icon: Send,
      badge: dashboardStats.shipmentsBuilding > 0 ? dashboardStats.shipmentsBuilding : undefined,
    },
    {
      title: "Inventory",
      description: "View products with your codes mapped to our system",
      href: "/supplier/inventory",
      icon: Package,
    },
    {
      title: "Items in Transit",
      description: "Track shipments and monitor delivery status",
      href: "/supplier/shipments",
      icon: Truck,
      badge: shipmentStats.inTransit > 0 ? shipmentStats.inTransit : undefined,
    },
    {
      title: "Payments",
      description: "View payment records, transfers, and communications",
      href: "/supplier/payments",
      icon: DollarSign,
    },
  ]

  const getCustomerName = (order: SupplierOrder) => {
    const c = order.customers
    if (!c) return "Unknown"
    const first = c.users?.first_name || c.first_name || ""
    const last = c.users?.last_name || c.last_name || ""
    return `${first} ${last}`.trim() || "Unknown"
  }

  return (
    <div className="min-h-screen overflow-x-hidden py-24 md:py-32 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Partner Portal
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9]">
            Supplier
            <br />
            <span className="italic text-muted-foreground">Dashboard</span>
          </h1>
        </motion.div>

        {/* Key Metrics */}
        <section className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
              Overview
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: dashboardStats.activeOrders, label: "Active Orders" },
              { value: dashboardStats.customerCount, label: "Customers" },
              { value: `$${dashboardStats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Total Revenue" },
              { value: dashboardStats.shipmentsInTransit, label: "In Transit" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                  <Package className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
                <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ship Product CTA */}
        <section className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              href="/supplier/ship-product"
              className="block glass-card rounded-3xl p-8 md:p-12 hover:bg-foreground/[0.05] transition-all duration-500 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="glass-button rounded-2xl p-5">
                    <Send className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-light mb-2">Ship Product</h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Build a shipment manifest, document box contents with photos, and track delivery
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-foreground transition-all duration-300 hidden md:block" />
              </div>
            </Link>
          </motion.div>
        </section>

        {/* Quick Links Grid */}
        <section className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
              Quick Actions
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={link.href}
                  className="glass-card rounded-3xl p-8 md:p-10 block h-full hover:bg-foreground/[0.05] transition-all duration-500 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="glass-button rounded-2xl p-4 inline-block">
                          <link.icon className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        {link.badge && (
                          <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-mono px-2 py-0.5 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl md:text-3xl font-light">
                          {link.title}
                        </h3>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-2 group-hover:text-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        {dashboardStats.recentOrders.length > 0 && (
          <section className="mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8 flex items-center justify-between"
            >
              <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
                Recent Orders
              </p>
              <Link href="/supplier/orders" className="text-sm text-muted-foreground hover:text-foreground font-mono transition-colors flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="space-y-4">
              {dashboardStats.recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="/supplier/orders"
                    className="glass-card rounded-2xl p-6 block hover:bg-foreground/[0.05] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="glass-button rounded-xl p-2.5">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{order.order_number}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-foreground/[0.07] border border-border">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getCustomerName(order)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">${Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Inbound Shipments Stats */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase">
              Inbound Shipment Overview
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { value: shipmentStats.inTransit, label: "In Transit" },
              { value: shipmentStats.delivered, label: "Delivered" },
              { value: shipmentStats.issues, label: "Issues" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn("text-center", index === 2 && "col-span-2 lg:col-span-1")}
              >
                <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                  <Truck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
                <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
