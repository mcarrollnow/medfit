"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Lock, 
  FileText,
  ArrowRight,
  ArrowDown,
  Loader2
} from "lucide-react"
import Link from "next/link"
import GlobalNav from "@/components/global-nav"
import { GlobalFooter } from "@/components/global-footer"

interface PolicySummary {
  id: string
  slug: string
  title: string
  subtitle: string | null
  last_updated: string
  is_published: boolean
}

const iconMap: Record<string, any> = {
  'privacy': Shield,
  'pci_dss_policy': Lock,
}

const descriptionMap: Record<string, string> = {
  'privacy': "Learn how we collect, use, and protect your personal information. We never sell your data to third parties.",
  'pci_dss_policy': "Our commitment to protecting payment card data through secure processing and PCI DSS compliance.",
}

export default function PolicyPage() {
  const [policies, setPolicies] = useState<PolicySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch('/api/policies')
        if (res.ok) {
          const data = await res.json()
          setPolicies(data.filter((p: PolicySummary) => p.is_published))
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  // Fallback static data if API fails
  const displayPolicies = policies.length > 0 ? policies : [
    {
      id: "privacy-policy",
      slug: "privacy",
      title: "Privacy Policy",
      subtitle: "Your Data, Protected",
      last_updated: new Date().toISOString(),
      is_published: true
    },
    {
      id: "pci-dss-policy",
      slug: "pci_dss_policy",
      title: "PCI DSS Policy",
      subtitle: "Payment Security",
      last_updated: new Date().toISOString(),
      is_published: true
    }
  ]

  return (
    <>
      <GlobalNav showCart={false} />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6"
            >
              Legal &amp; Compliance
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[0.9] mb-8"
            >
              Our
              <br />
              <span className="italic text-muted-foreground">Policies</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
            >
              Transparency and trust are fundamental to how we operate. 
              Review our policies to understand how we protect you.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </section>

        {/* Policies Grid */}
        <section className="py-16 md:py-24 px-6 md:px-12 flex-1">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {displayPolicies.map((policy, index) => {
                  const Icon = iconMap[policy.slug] || FileText
                  const description = descriptionMap[policy.slug] || policy.subtitle
                  
                  return (
                    <motion.div
                      key={policy.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/${policy.slug}`} className="block group">
                        <div className="glass-card rounded-2xl p-6 md:p-8 hover:bg-foreground/[0.05] transition-all duration-500">
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Icon */}
                            <div className="glass-button rounded-2xl p-4 w-fit">
                              <Icon className="w-6 h-6" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                <h2 className="font-serif text-xl md:text-2xl font-light group-hover:text-foreground transition-colors">
                                  {policy.title}
                                </h2>
                                <span className="text-xs font-mono text-muted-foreground">
                                  Updated {new Date(policy.last_updated).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <p className="text-sm italic text-muted-foreground mb-3">
                                {policy.subtitle}
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {description}
                              </p>
                            </div>
                            
                            {/* Arrow */}
                            <div className="hidden md:block">
                              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
            
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="glass-card rounded-2xl p-8 md:p-12">
                <div className="glass-button rounded-2xl p-4 inline-block mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-light mb-4">
                  Have Questions?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  If you have questions about any of our policies, please don&apos;t hesitate to reach out.
                </p>
                <a 
                  href="mailto:legal@modernhealthpro.com" 
                  className="glass-button px-6 py-3 rounded-full inline-block hover:bg-foreground/10 transition-all duration-300"
                >
                  <span className="font-mono tracking-wider text-sm">legal@modernhealthpro.com</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <GlobalFooter />
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(58,66,51,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(58, 66, 51, 0.08);
        }
        
        .glass-button {
          background: rgba(58,66,51,0.06);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(58,66,51,0.08);
          transition: all 0.3s ease;
        }
        
        .glass-button:hover {
          background: rgba(58,66,51,0.08);
          border-color: rgba(58,66,51,0.12);
        }
        
        .font-serif {
          font-family: var(--font-serif), 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </>
  )
}
