"use client"

import type React from "react"
import { useState } from "react"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { SUPPLY_STORE_BUSINESS_TYPES } from "@/lib/supply-store/types"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Building2, Users, Package } from "lucide-react"

export default function SupplyStoreContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    businessType: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen px-6 py-24 flex items-center justify-center">
        <GlassCard padding="lg" className="max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Message Sent!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for reaching out. Our team will review your request and get back to you within 24 hours.
          </p>
          <GlassButton onClick={() => setIsSubmitted(false)} variant="outline" size="lg">
            Send Another Message
          </GlassButton>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or need a custom quote? Our team of wellness equipment experts is here to
            help you outfit your facility.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <GlassCard padding="lg">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <a
                      href="mailto:sales@modernhealthpro.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      sales@modernhealthpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Phone</p>
                    <a href="tel:1800647787" className="text-muted-foreground hover:text-foreground transition-colors">
                      1-800-MHP-SUPPLY
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Address</p>
                    <p className="text-muted-foreground">
                      123 Wellness Blvd
                      <br />
                      Los Angeles, CA 90210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Business Hours</p>
                    <p className="text-muted-foreground">
                      Mon - Fri: 8am - 6pm PST
                      <br />
                      Sat: 9am - 3pm PST
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Why Contact Us */}
            <GlassCard padding="lg">
              <h3 className="text-xl font-semibold mb-4">Why Work With Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Volume pricing for businesses</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Dedicated account managers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Custom equipment packages</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <GlassCard padding="lg">
              <h2 className="text-2xl font-semibold mb-8">Request a Quote</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Your Gym LLC"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    value={formState.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="">Select your business type</option>
                    {Object.values(SUPPLY_STORE_BUSINESS_TYPES).map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.description}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    placeholder="Tell us about your facility and equipment needs. Include any specific products you're interested in, quantities, and any questions you have."
                  />
                </div>

                <GlassButton type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full gap-2">
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </GlassButton>

                <p className="text-sm text-muted-foreground text-center">
                  We typically respond within 24 hours during business days.
                </p>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

