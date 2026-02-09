"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Globe, Users, ArrowRight, Package, Percent, UserCog, Trophy, Wallet, 
  Construction, ShoppingCart, BarChart3, CreditCard, Settings, DollarSign, 
  Truck, Home, Bot, Mail, Database, ScrollText, Shield, Calculator, Receipt,
  TrendingUp, Boxes, Megaphone, Wrench, Share2, Eye
} from "lucide-react"

// Category definitions with items
const categories = [
  {
    id: "daily",
    title: "Daily Operations",
    subtitle: "Orders, payments, and invoices",
    items: [
      {
        title: "Orders",
        description: "View and manage customer orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Invoices",
        description: "Create and send invoices",
        href: "/admin/invoices",
        icon: Receipt,
      },
      {
        title: "Payments",
        description: "Payment history and settings",
        href: "/admin/payments",
        icon: DollarSign,
      },
    ],
  },
  {
    id: "people",
    title: "People",
    subtitle: "Customers and sales reps",
    items: [
      {
        title: "Customers",
        description: "Customer profiles and orders",
        href: "/admin/customers",
        icon: Users,
      },
      {
        title: "Reps",
        description: "Manage reps and commissions",
        href: "/admin/reps",
        icon: UserCog,
      },
      {
        title: "Payouts",
        description: "Process rep payouts",
        href: "/admin/payouts",
        icon: Wallet,
      },
    ],
  },
  {
    id: "catalog",
    title: "Catalog & Inventory",
    subtitle: "Products, stock, and pricing",
    items: [
      {
        title: "Inventory",
        description: "Products and stock levels",
        href: "/admin/inventory",
        icon: Package,
      },
      {
        title: "Shipments",
        description: "Track incoming inventory",
        href: "/admin/shipments",
        icon: Truck,
      },
      {
        title: "Pricing",
        description: "Cost and commission rules",
        href: "/admin/pricing-formula",
        icon: Calculator,
      },
      {
        title: "Discounts",
        description: "Promotional codes",
        href: "/admin/discounts",
        icon: Percent,
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Growth",
    subtitle: "Analytics, rewards, and engagement",
    items: [
      {
        title: "Analytics",
        description: "Sales reports and trends",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Rewards",
        description: "Loyalty program and points",
        href: "/admin/rewards",
        icon: Trophy,
      },
      {
        title: "Referrals",
        description: "Manage referral codes and discounts",
        href: "/admin/referrals",
        icon: Share2,
      },
      {
        title: "Email Templates",
        description: "Edit transactional emails with AI",
        href: "/admin/email-templates",
        icon: Mail,
      },
      {
        title: "Email Tracking",
        description: "USPS tracking automation",
        href: "/admin/tracking",
        icon: Mail,
      },
    ],
  },
  {
    id: "website",
    title: "Website",
    subtitle: "Content and appearance",
    items: [
      {
        title: "Landing Page",
        description: "Hero and login screen",
        href: "/admin/landing",
        icon: Home,
      },
      {
        title: "Site Settings",
        description: "Metadata and favicon",
        href: "/admin/website",
        icon: Globe,
      },
      {
        title: "Maintenance",
        description: "Maintenance mode",
        href: "/admin/maintenance",
        icon: Construction,
      },
      {
        title: "Policies",
        description: "Legal documents",
        href: "/admin/policy",
        icon: ScrollText,
      },
    ],
  },
  {
    id: "system",
    title: "System",
    subtitle: "Configuration and security",
    items: [
      {
        title: "Settings",
        description: "System preferences",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Supabase",
        description: "Users, customers, and auth",
        href: "/admin/supabase",
        icon: Database,
      },
      {
        title: "Wallets",
        description: "Crypto addresses",
        href: "/admin/wallets",
        icon: CreditCard,
      },
      {
        title: "PCI Scan",
        description: "Security scans",
        href: "/admin/pci-scan",
        icon: Shield,
      },
      {
        title: "AI Agents",
        description: "SMS and order bots",
        href: "/admin/ai-agents",
        icon: Bot,
      },
    ],
  },
  {
    id: "debug",
    title: "Debug & Testing",
    subtitle: "Troubleshooting tools",
    items: [
      {
        title: "View As",
        description: "Impersonate users for debugging",
        href: "/admin/view-as",
        icon: Eye,
      },
      {
        title: "Supplier Portal",
        description: "View supplier dashboard",
        href: "/supplier",
        icon: Truck,
      },
    ],
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-[oklch(0.65_0_0)] uppercase mb-6">
            Control Center
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-[oklch(0.95_0_0)]">
            Admin
            <br />
            <span className="italic text-[oklch(0.65_0_0)]">Dashboard</span>
          </h1>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24"
        >
          {[
            { label: "Orders Today", value: "--", icon: ShoppingCart },
            { label: "Revenue", value: "--", icon: TrendingUp },
            { label: "Customers", value: "--", icon: Users },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 text-center"
            >
              <div className="rounded-xl md:rounded-2xl p-3 md:p-4 inline-block mb-3 md:mb-4 bg-white/5 border border-white/10">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              </div>
              <p className="font-mono text-2xl md:text-4xl font-light text-[oklch(0.95_0_0)] mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-[oklch(0.65_0_0)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Categories */}
        <div className="space-y-16 md:space-y-24">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Category Header */}
              <div className="mb-8 md:mb-12">
                <p className="text-xs md:text-sm font-mono tracking-[0.3em] text-[oklch(0.65_0_0)] uppercase mb-2">
                  {category.subtitle}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[oklch(0.95_0_0)]">
                  {category.title}
                </h2>
              </div>

              {/* Category Items */}
              <div className={`grid gap-4 md:gap-6 ${
                category.items.length <= 3 
                  ? 'grid-cols-1 md:grid-cols-3' 
                  : category.items.length === 4
                    ? 'grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="group glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 block h-full hover:bg-white/[0.04] transition-all duration-500"
                    >
                      <div className="flex flex-col h-full">
                        <div className="glass-button rounded-xl md:rounded-2xl p-3 md:p-4 inline-flex w-fit mb-4 md:mb-6 group-hover:bg-white/10 transition-colors">
                          <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[oklch(0.95_0_0)]" />
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-light text-[oklch(0.95_0_0)] mb-1 md:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[oklch(0.65_0_0)] flex-1">
                          {item.description}
                        </p>
                        <div className="mt-4 md:mt-6 flex items-center gap-2 text-[oklch(0.65_0_0)] group-hover:text-[oklch(0.95_0_0)] transition-colors">
                          <span className="text-xs font-mono tracking-wider uppercase">Open</span>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
