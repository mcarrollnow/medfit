"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Mail,
  ArrowDown,
  Loader2
} from "lucide-react"
import GlobalNav from "@/components/global-nav"
import { GlobalFooter } from "@/components/global-footer"
import { PolicyContentRenderer } from "@/components/policy-content-renderer"

interface Policy {
  id: string
  slug: string
  title: string
  subtitle: string | null
  hero_tagline: string | null
  effective_date: string
  last_updated: string
  contact_email: string | null
  content: any[]
  is_published: boolean
}

export default function PCIDSSPolicyPage() {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await fetch('/api/policies/pci_dss_policy')
        if (res.ok) {
          const data = await res.json()
          setPolicy(data)
        } else {
          setError('Policy not found')
        }
      } catch (err) {
        console.error('Failed to fetch policy:', err)
        setError('Failed to load policy')
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [])

  if (loading) {
    return (
      <>
        <GlobalNav showCart={false} />
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  // Fallback content if database isn't available
  const title = policy?.title || "PCI DSS Compliance Policy"
  const subtitle = policy?.subtitle || "Payment Security"
  const heroTagline = policy?.hero_tagline || "Information Security Policy"
  const effectiveDate = policy?.effective_date ? new Date(policy.effective_date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) : "January 1, 2026"
  const lastUpdated = policy?.last_updated ? new Date(policy.last_updated).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) : "January 9, 2026"
  const contactEmail = policy?.contact_email || "security@modernhealthpro.com"

  return (
    <>
      <GlobalNav showCart={false} />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6"
            >
              {heroTagline}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.9] mb-8"
            >
              PCI DSS
              <br />
              <span className="italic text-muted-foreground">Compliance Policy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Our commitment to protecting payment card data through secure payment processing 
              and adherence to the Payment Card Industry Data Security Standard.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
            >
              <span>Effective Date: {effectiveDate}</span>
              <span className="hidden md:inline">•</span>
              <span>Last Reviewed: {lastUpdated}</span>
            </motion.div>
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

        {/* Policy Content */}
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {policy?.content ? (
              <PolicyContentRenderer content={policy.content} />
            ) : (
              <FallbackPCIDSSContent />
            )}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="pt-8 mt-12"
            >
              <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                <h3 className="font-serif text-xl md:text-2xl font-light mb-4">
                  Questions About <span className="italic text-muted-foreground">This Policy?</span>
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  For questions about our PCI DSS compliance or to report a security concern, please contact us.
                </p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="glass-button px-6 py-3 rounded-full inline-block hover:bg-white/10 transition-all duration-300"
                >
                  <span className="font-mono tracking-wider text-sm">{contactEmail}</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <GlobalFooter />
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .glass-button {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .font-serif {
          font-family: var(--font-serif), 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </>
  )
}

// Fallback content if database is not available
function FallbackPCIDSSContent() {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">
        Policy content is loading or unavailable. Please try again later.
      </p>
    </div>
  )
}
