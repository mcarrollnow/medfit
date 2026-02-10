'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useAuthStore } from '@/lib/auth-store'
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, ArrowRight, Phone, Gift, ArrowLeft } from 'lucide-react'
import { getLandingSettings, LandingSettings } from '@/app/actions/landing-settings'
import dynamic from 'next/dynamic'

// Dynamically import the background component to avoid SSR issues
const PulsingHexagonBackground = dynamic(
  () => import('@/components/pulsing-hexagon-background'),
  { ssr: false }
)

const defaultSettings: LandingSettings = {
  hero_slogan: 'Welcome to Medfit 90',
  hero_subtitle: 'Premium research compounds for scientific discovery',
  background_style: 'aurora',
  background_color_1: '#F1E6DE',
  background_color_2: '#E8D9CF', 
  background_color_3: '#DED0C5',
  show_subtitle: true,
}

type AuthMode = 'login' | 'register'
// Simplified mobile flow: phone → otp → (optional: link-account) → done
type MobileFlow = 'choice' | 'new' | 'phone-entry' | 'otp-verify' | 'link-account'

export default function LandingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LandingPage />
    </Suspense>
  )
}

function LandingPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showMobileFlow, setShowMobileFlow] = useState(false)
  const [mobileFlow, setMobileFlow] = useState<MobileFlow>('choice')
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [referralCode, setReferralCode] = useState('')
  
  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [settings, setSettings] = useState<LandingSettings>(defaultSettings)
  const [resendCountdown, setResendCountdown] = useState(0)
  
  // For new customer phone registration
  const [registerStep, setRegisterStep] = useState<'phone' | 'verify' | 'profile'>('phone')
  const [verifiedAuthId, setVerifiedAuthId] = useState<string | null>(null)
  
  // For existing customer linking
  const [existingUserId, setExistingUserId] = useState<string | null>(null)
  
  // For unified mobile flow
  const [isPhoneVerified, setIsPhoneVerified] = useState(false) // true = direct login, false = need to link
  
  // Prevent double submission
  const isSubmittingRef = useRef(false)

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const previousCleaned = phone.replace(/\D/g, '')
    const newCleaned = input.replace(/\D/g, '')
    
    let cleaned = newCleaned
    if (input.length < phone.length && newCleaned.length === previousCleaned.length && newCleaned.length > 0) {
      cleaned = newCleaned.slice(0, -1)
    }

    let formatted = cleaned
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    }

    setPhone(formatted)
  }

  // Format phone for Supabase (E.164 format)
  const formatPhoneE164 = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    return `+${cleaned}`
  }
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseBrowserClient()
  const setSession = useAuthStore((state) => state.setSession)

  // Get redirect URL from query params (only allow relative paths to prevent open redirect)
  const getRedirectUrl = () => {
    const redirect = searchParams.get('redirect')
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect
    }
    return '/'
  }

  useEffect(() => {
    // Load settings
    getLandingSettings().then(setSettings)
    
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push(getRedirectUrl())
      }
    }
    checkAuth()
  }, [supabase, router])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  // Standard email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data?.session) {
        setSession(data.session)
        router.push(getRedirectUrl())
      }
    } catch (err: any) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Standard email/password registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      isSubmittingRef.current = false
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      isSubmittingRef.current = false
      return
    }

    try {
      const cleanedPhone = phone.replace(/\D/g, '')

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone: cleanedPhone || undefined,
          referralCode: referralCode.trim() || undefined,
          customerType: 'retail',
          phoneVerified: false,
          skipPhoneCheck: true, // Allow registration without phone verification
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.details && Array.isArray(data.error.details)) {
          setError(data.error.details.join(', '))
        } else {
          setError(data.error?.message || 'Registration failed')
        }
        return
      }

      setSuccess('Account created! Please check your email to verify your account.')
      setMode('login')
      resetForm()
    } catch (err: any) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // --- NEW CUSTOMER MOBILE FLOW ---
  
  // Send OTP for new customer registration
  const sendNewCustomerOtp = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (otpError) {
        setError(otpError.message)
        return
      }

      setRegisterStep('verify')
      setResendCountdown(60)
      setSuccess('Verification code sent to your phone')
    } catch (err: any) {
      setError('Failed to send verification code')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Verify OTP for new customer
  const verifyNewCustomerOtp = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'sms',
      })

      if (verifyError) {
        setError(verifyError.message)
        return
      }

      if (data?.user?.id) {
        setVerifiedAuthId(data.user.id)
      }
      
      setRegisterStep('profile')
      setSuccess('Phone verified! Complete your profile.')
    } catch (err: any) {
      setError('Invalid verification code')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Complete new customer profile
  const completeNewCustomerProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      isSubmittingRef.current = false
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      isSubmittingRef.current = false
      return
    }

    try {
      const cleanedPhone = phone.replace(/\D/g, '')

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone: cleanedPhone,
          referralCode: referralCode.trim() || undefined,
          customerType: 'retail',
          phoneVerified: true,
          authId: verifiedAuthId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || 'Registration failed')
        return
      }

      // Update auth user with email/password
      await supabase.auth.updateUser({
        email,
        password,
        data: { first_name: firstName, last_name: lastName }
      })

      setSuccess('Account created successfully!')
      setTimeout(() => router.push(getRedirectUrl()), 1500)
    } catch (err: any) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // --- UNIFIED MOBILE LOGIN FLOW ---
  // 1. Check phone → 2. Send OTP → 3. Verify OTP → 4. (If needed) Link account → 5. Done

  // Step 1: Check phone and send OTP
  const checkPhoneAndSendOtp = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)

      // Check if phone exists and is verified
      const checkResponse = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      })
      
      const checkData = await checkResponse.json()
      
      if (checkData.exists && checkData.verified) {
        // Phone is verified - direct login flow
        setIsPhoneVerified(true)
        
        // Send OTP for login
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        })

        if (otpError) {
          setError(otpError.message)
          return
        }
      } else {
        // Phone not in system or not verified - will need to link after OTP
        setIsPhoneVerified(false)
        
        // Send OTP to verify this phone number first
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        })

        if (otpError) {
          setError(otpError.message)
          return
        }
      }

      setMobileFlow('otp-verify')
      setResendCountdown(60)
    } catch (err: any) {
      setError('Failed to send verification code')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Step 2: Verify OTP
  const verifyMobileOtp = async () => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'sms',
      })

      if (verifyError) {
        setError('Invalid code. Please try again.')
        return
      }

      if (isPhoneVerified) {
        // Phone was already verified - user is now logged in, go to store
        if (data?.session) {
          setSession(data.session)
        }
        router.push(getRedirectUrl())
      } else {
        // Phone verified now, but need to link to existing account
        // Store the auth ID from this phone verification
        if (data?.user?.id) {
          setVerifiedAuthId(data.user.id)
        }
        setMobileFlow('link-account')
      }
    } catch (err: any) {
      setError('Verification failed')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Step 3: Link phone to existing account (only if phone wasn't already verified)
  const linkPhoneToAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      // First, sign out of the phone-based session
      await supabase.auth.signOut()

      // Sign in with email/password to verify identity
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Invalid email or password')
        return
      }

      if (!signInData?.user) {
        setError('Login failed')
        return
      }

      const formattedPhone = formatPhoneE164(phone)

      // Get the user ID from our users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', signInData.user.id)
        .single()

      // Update the auth user's phone
      const { error: updateError } = await supabase.auth.updateUser({
        phone: formattedPhone,
      })

      if (updateError) {
        console.error('Failed to update auth phone:', updateError)
        // Continue anyway - we'll still link in our users table
      }

      // Update our users table with the verified phone
      if (userData) {
        await fetch('/api/user/update-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            phone: formattedPhone,
            phoneVerified: true,
          }),
        })
      }

      // User is now logged in with phone linked
      if (signInData.session) {
        setSession(signInData.session)
      }
      router.push(getRedirectUrl())
    } catch (err: any) {
      setError('Failed to link phone. Please try again.')
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  // Reset form
  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFirstName('')
    setLastName('')
    setPhone('')
    setOtpCode('')
    setReferralCode('')
  }

  // Switch modes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
    setSuccess(null)
    resetForm()
  }

  // Open mobile flow
  const openMobileFlow = () => {
    setShowMobileFlow(true)
    setMobileFlow('choice')
    setError(null)
    setSuccess(null)
    resetForm()
    setRegisterStep('phone')
  }

  // Close mobile flow
  const closeMobileFlow = () => {
    setShowMobileFlow(false)
    setMobileFlow('choice')
    setError(null)
    setSuccess(null)
    resetForm()
    setRegisterStep('phone')
    setIsPhoneVerified(false)
    setOtpCode('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Pulsing Hexagon Background */}
      <PulsingHexagonBackground showControls={false} />

      {/* Content - positioned above the background */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section - Chronicles Style */}
        <div className="text-center mb-12 max-w-4xl">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Welcome
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight mb-6">
            {settings.hero_slogan.split(' ').slice(0, Math.ceil(settings.hero_slogan.split(' ').length / 2)).join(' ')}
            <br />
            <span className="italic text-muted-foreground">
              {settings.hero_slogan.split(' ').slice(Math.ceil(settings.hero_slogan.split(' ').length / 2)).join(' ')}
            </span>
          </h1>
          {settings.show_subtitle && settings.hero_subtitle && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {settings.hero_subtitle}
            </p>
          )}
        </div>

        {/* Auth Card - Chronicles Glass Style */}
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-5" />

            <div className="relative z-10">
              {/* Mobile Flow Modal */}
              {showMobileFlow ? (
                <>
                  {/* Back button */}
                  <button
                    onClick={closeMobileFlow}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to email sign in
                  </button>

                  {/* Success Message */}
                  {success && (
                    <div className="glass-button mb-6 p-4 rounded-2xl flex items-start gap-3 border-green-500/30">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="glass-button mb-6 p-4 rounded-2xl border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Choice: New or Existing */}
                  {mobileFlow === 'choice' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="font-serif text-2xl font-light mb-2">Mobile Sign In</h2>
                        <p className="text-sm text-muted-foreground">
                          Are you a new or existing customer?
                        </p>
                      </div>

                      <button
                        onClick={() => setMobileFlow('new')}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        I'm a New Customer
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setMobileFlow('phone-entry')}
                        className="w-full py-4 glass-button rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center gap-2 text-foreground"
                      >
                        I Have an Existing Account
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* NEW CUSTOMER FLOW */}
                  {mobileFlow === 'new' && registerStep === 'phone' && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Create Account</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your phone number to get started
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="(555) 123-4567"
                            maxLength={14}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={sendNewCustomerOtp}
                        disabled={loading || phone.replace(/\D/g, '').length < 10}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending...' : (
                          <>
                            Continue
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {mobileFlow === 'new' && registerStep === 'verify' && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Verify Phone</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter the code sent to {phone}
                        </p>
                      </div>

                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                        className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors text-center text-2xl font-mono tracking-[0.5em]"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={verifyNewCustomerOtp}
                        disabled={loading || otpCode.length !== 6}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>

                      <button
                        type="button"
                        onClick={sendNewCustomerOtp}
                        disabled={resendCountdown > 0 || loading}
                        className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                      </button>
                    </div>
                  )}

                  {mobileFlow === 'new' && registerStep === 'profile' && (
                    <form onSubmit={completeNewCustomerProfile} className="space-y-5">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Complete Profile</h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">First Name</label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Confirm Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                          className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </form>
                  )}

                  {/* EXISTING CUSTOMER FLOW - Phone First */}
                  {mobileFlow === 'phone-entry' && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Mobile Sign In</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your phone number to continue
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="(555) 123-4567"
                            maxLength={14}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={checkPhoneAndSendOtp}
                        disabled={loading || phone.replace(/\D/g, '').length < 10}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending...' : (
                          <>
                            Continue
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {mobileFlow === 'otp-verify' && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Enter Code</h2>
                        <p className="text-sm text-muted-foreground">
                          We sent a code to {phone}
                        </p>
                      </div>

                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                        className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors text-center text-2xl font-mono tracking-[0.5em]"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={verifyMobileOtp}
                        disabled={loading || otpCode.length !== 6}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Verifying...' : 'Continue'}
                      </button>

                      <button
                        type="button"
                        onClick={checkPhoneAndSendOtp}
                        disabled={resendCountdown > 0 || loading}
                        className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                      </button>
                    </div>
                  )}

                  {mobileFlow === 'link-account' && (
                    <form onSubmit={linkPhoneToAccount} className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="font-serif text-2xl font-light mb-2">Link Your Account</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your email and password to connect this phone
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Linking...' : (
                          <>
                            Link & Sign In
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  {/* Mode Toggle - Glass Tabs */}
                  <div className="glass-tabs flex mb-8 rounded-xl p-1">
                    <button
                      onClick={() => switchMode('login')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-light tracking-wide transition-all ${
                        mode === 'login' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => switchMode('register')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-light tracking-wide transition-all ${
                        mode === 'register' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Success Message */}
                  {success && (
                    <div className="glass-button mb-6 p-4 rounded-2xl flex items-start gap-3 border-green-500/30">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="glass-button mb-6 p-4 rounded-2xl border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* LOGIN MODE */}
                  {mode === 'login' && (
                    <form onSubmit={handleEmailLogin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href="/forgot-password"
                          prefetch={false}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Signing in...' : (
                          <>
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <div className="pt-4 border-t border-border">
                        <button
                          type="button"
                          onClick={openMobileFlow}
                          className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Use mobile number instead
                        </button>
                      </div>
                    </form>
                  )}

                  {/* REGISTER MODE */}
                  {mode === 'register' && (
                    <form onSubmit={handleEmailRegister} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">First Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                              style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                              className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                              placeholder="John"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full px-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                          Phone <span className="text-muted-foreground/50">(optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="(555) 123-4567"
                            maxLength={14}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                          Referral Code <span className="text-muted-foreground/50">(optional)</span>
                        </label>
                        <div className="relative">
                          <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            placeholder="XXXX1234"
                            maxLength={10}
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors font-mono tracking-wider"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ backgroundColor: 'rgba(58,66,51,0.3)' }}
                            className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Creating Account...' : (
                          <>
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <div className="pt-4 border-t border-border">
                        <button
                          type="button"
                          onClick={openMobileFlow}
                          className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Use mobile number instead
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm font-mono tracking-widest text-muted-foreground/50 uppercase">
          © 2025 Medfit 90
        </p>
      </div>
    </div>
  )
}
