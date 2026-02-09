"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { motion } from 'framer-motion'
import { FileText, AlertCircle, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { InvoiceHeader } from '@/components/invoice/invoice-header'
import { InvoiceAddresses } from '@/components/invoice/invoice-addresses'
import { InvoiceLineItems } from '@/components/invoice/invoice-line-items'
import { InvoiceSummary } from '@/components/invoice/invoice-summary'
import { InvoiceFooter } from '@/components/invoice/invoice-footer'
import { InvoiceActions } from '@/components/invoice/invoice-actions'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useAuthStore } from '@/lib/auth-store'

interface InvoiceItemDB {
  name?: string
  description?: string
  quantity: number
  unit_price: number
}

interface Invoice {
  id: string
  invoice_number: string
  customer_email: string
  customer_name: string
  items: string | InvoiceItemDB[]
  subtotal: number
  manual_adjustment: number
  total: number
  status: string
  due_date?: string
  notes?: string
  payment_url?: string
  created_at: string
  paid_at?: string
  is_hidden?: boolean
}

type PageState = 'loading' | 'invoice' | 'setup' | 'login' | 'error'

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoiceId = params.id as string
  const setupParam = searchParams.get('setup')
  const supabase = getSupabaseBrowserClient()
  const setSession = useAuthStore((state) => state.setSession)
  
  const [pageState, setPageState] = useState<PageState>('loading')
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Setup form state
  const [setupToken, setSetupToken] = useState<string | null>(null)
  const [setupInfo, setSetupInfo] = useState<any>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [setupSuccess, setSetupSuccess] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (invoiceId) {
      // If setup token is in URL, go straight to setup
      if (setupParam) {
        setSetupToken(setupParam)
        loadSetupInfo(setupParam)
        setPageState('setup')
      } else {
        fetchInvoice()
      }
    }
  }, [invoiceId, setupParam])

  async function fetchInvoice() {
    try {
      const response = await fetch(`/api/invoice/${invoiceId}`)
      
      if (response.ok) {
        const data = await response.json()
        setInvoice(data.invoice)
        setPageState('invoice')
      } else {
        const err = await response.json()
        
        if (err.requires_setup && err.setup_token) {
          // New customer needs to set up account
          setSetupToken(err.setup_token)
          await loadSetupInfo(err.setup_token)
          setPageState('setup')
        } else if (err.requires_auth) {
          // Existing customer needs to sign in
          setPageState('login')
        } else {
          setError(err.error || 'Invoice not found')
          setPageState('error')
        }
      }
    } catch (err) {
      setError('Failed to load invoice')
      setPageState('error')
    }
  }

  async function loadSetupInfo(token: string) {
    try {
      const response = await fetch('/api/invoice/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      
      const data = await response.json()
      
      if (data.already_completed) {
        // Account was already set up, they just need to sign in
        setPageState('login')
        return
      }
      
      if (response.ok) {
        setSetupInfo(data)
        if (data.has_existing_account) {
          // User already has account, redirect to login
          setPageState('login')
        }
      } else {
        setError(data.error || 'Invalid setup link')
        setPageState('error')
      }
    } catch {
      setError('Failed to load setup information')
      setPageState('error')
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    setSetupError(null)

    const trimmedPassword = password.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (trimmedPassword.length < 8) {
      setSetupError('Password must be at least 8 characters')
      return
    }

    if (trimmedPassword !== trimmedConfirm) {
      setSetupError('Passwords do not match')
      return
    }

    setSetupLoading(true)

    try {
      const response = await fetch('/api/invoice/setup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: setupToken,
          password: trimmedPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSetupError(data.error || 'Account setup failed')
        return
      }

      // Set session from the returned data
      if (data.session) {
        setSession(data.session)
        // Set the session in supabase client
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }

      setSetupSuccess(true)

      // After a brief delay, reload the invoice (now authenticated)
      setTimeout(() => {
        fetchInvoice()
      }, 2000)

    } catch (err: any) {
      setSetupError('Setup failed. Please try again.')
    } finally {
      setSetupLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (signInError) {
        setLoginError(signInError.message)
        return
      }

      if (data?.session) {
        setSession(data.session)
        // Reload the invoice (now authenticated)
        fetchInvoice()
      }
    } catch (err: any) {
      setLoginError('Sign in failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-pulse text-[#999999]">Loading invoice...</div>
      </div>
    )
  }

  // Error state
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-light text-[#f0f0f0] mb-2">Invoice Not Found</h1>
          <p className="text-[#999999]">{error || 'This invoice does not exist or has expired.'}</p>
        </div>
      </div>
    )
  }

  // Account Setup state (new customer)
  if (pageState === 'setup' && setupInfo) {
    return (
      <div className="min-h-screen bg-[#121212] dark text-white">
        <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-md mx-auto px-6 py-16 md:py-24 flex items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="glass-card rounded-3xl p-8 md:p-12">
              {setupSuccess ? (
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/30 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="font-serif text-2xl font-light mb-3">Account Created!</h2>
                  <p className="text-[#999] text-sm mb-2">Welcome, {setupInfo.customer_name}.</p>
                  <p className="text-[#999] text-sm">Loading your invoice...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-5">
                      <FileText className="h-7 w-7 text-[#999]" />
                    </div>
                    <p className="text-xs font-mono tracking-[0.3em] text-[#999] uppercase mb-3">
                      Invoice {setupInfo.invoice_number}
                    </p>
                    <h2 className="font-serif text-2xl font-light mb-3">Set Up Your Account</h2>
                    <p className="text-[#999] text-sm">
                      Hi {setupInfo.customer_name}, create a password to view your invoice and manage your account.
                    </p>
                  </div>

                  {/* Invoice preview */}
                  <div className="glass-button rounded-2xl p-4 mb-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-mono tracking-widest text-[#666] uppercase">Amount Due</p>
                        <p className="font-serif text-2xl font-light mt-1">${setupInfo.total?.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono tracking-widest text-[#666] uppercase">Email</p>
                        <p className="text-sm text-[#999] mt-1">{setupInfo.customer_email}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSetup} className="space-y-5">
                    {setupError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {setupError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-widest text-[#999] uppercase">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-[#666] focus:border-white/20 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-[#666]">Minimum 8 characters</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono tracking-widest text-[#999] uppercase">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-[#666] focus:border-white/20 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={setupLoading}
                      className="w-full py-4 bg-white text-black rounded-xl font-light text-lg tracking-wide hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {setupLoading ? 'Setting up...' : (
                        <>
                          Create Account & View Invoice
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <style jsx global>{`
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          }
          .glass-button {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </div>
    )
  }

  // Login state (existing customer or setup-completed customer)
  if (pageState === 'login') {
    return (
      <div className="min-h-screen bg-[#121212] dark text-white">
        <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-md mx-auto px-6 py-16 md:py-24 flex items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-5">
                  <Lock className="h-7 w-7 text-[#999]" />
                </div>
                <h2 className="font-serif text-2xl font-light mb-3">Sign In to View Invoice</h2>
                <p className="text-[#999] text-sm">
                  Please sign in with your account to access this invoice.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {loginError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {loginError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-mono tracking-widest text-[#999] uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-[#666] focus:border-white/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono tracking-widest text-[#999] uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-[#666] focus:border-white/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 bg-white text-black rounded-xl font-light text-lg tracking-wide hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loginLoading ? 'Signing in...' : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        <style jsx global>{`
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </div>
    )
  }

  // Invoice view (authenticated)
  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-light text-[#f0f0f0] mb-2">Invoice Not Found</h1>
          <p className="text-[#999999]">This invoice does not exist or has expired.</p>
        </div>
      </div>
    )
  }

  // Parse items from database format
  const rawItems: InvoiceItemDB[] = typeof invoice.items === 'string' 
    ? JSON.parse(invoice.items) 
    : invoice.items || []

  // Transform to component format
  const items = rawItems.map((item, idx) => ({
    id: idx + 1,
    description: item.name || item.description || '',
    details: item.name ? (item.description || '') : '',
    quantity: Number(item.quantity) || 0,
    rate: Number(item.unit_price) || 0,
  }))

  const isPaid = invoice.status === 'paid'
  const status = isPaid ? 'Paid' : invoice.status === 'overdue' ? 'Overdue' : 'Due'

  const companyInfo = {
    name: 'Modern Health Pro',
    address: '',
    city: '',
    email: siteConfig.supportEmail,
  }

  return (
    <div className="min-h-screen bg-[#121212] dark text-white">
      <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16">
            <InvoiceHeader
              invoiceNumber={invoice.invoice_number}
              issueDate={formatDate(invoice.created_at)}
              dueDate={invoice.due_date ? formatDate(invoice.due_date) : 'Upon Receipt'}
              status={status as "Draft" | "Due" | "Paid" | "Overdue"}
            />

            <InvoiceAddresses
              from={companyInfo}
              to={{
                name: invoice.customer_name,
                address: '',
                city: '',
                email: invoice.customer_email,
              }}
            />

            <InvoiceLineItems items={items} />

            <InvoiceSummary
              subtotal={Number(invoice.subtotal) || 0}
              discount={Number(invoice.manual_adjustment) || 0}
              total={Number(invoice.total) || 0}
            />

            <InvoiceFooter notes={invoice.notes} />
          </div>

          <InvoiceActions
            invoiceId={invoice.id}
            paymentUrl={invoice.payment_url}
            total={invoice.total}
            isPaid={isPaid}
            isHidden={invoice.is_hidden}
          />
        </motion.div>
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        .glass-button {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
