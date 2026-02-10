'use client'

import { useState, useEffect } from 'react'
import { Phone, X, ArrowRight, CheckCircle } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

interface AddPhonePromptProps {
  userId: string
  onDismiss: () => void
  onComplete: () => void
}

export function AddPhonePrompt({ userId, onDismiss, onComplete }: AddPhonePromptProps) {
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [step, setStep] = useState<'phone' | 'verify' | 'success'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)

  const supabase = getSupabaseBrowserClient()

  // Countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  // Format phone number
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

  // Format for E.164
  const formatPhoneE164 = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    return `+${cleaned}`
  }

  // Send OTP
  const sendOtp = async () => {
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)
      
      // Use Supabase to send OTP for phone update
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (otpError) {
        setError(otpError.message)
        return
      }

      setStep('verify')
      setResendCountdown(60)
    } catch (err: any) {
      setError('Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP and update user
  const verifyOtp = async () => {
    setLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneE164(phone)
      
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'sms',
      })

      if (verifyError) {
        setError(verifyError.message)
        return
      }

      // Update user profile with verified phone
      const response = await fetch('/api/user/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          phone: formattedPhone,
          phoneVerified: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error?.message || 'Failed to update profile')
        return
      }

      setStep('success')
      setTimeout(onComplete, 2000)
    } catch (err: any) {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-md w-full relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-5" />
        
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {step === 'phone' && (
            <>
              <div className="text-center mb-8">
                <div className="glass-button rounded-2xl p-4 inline-block mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-2">
                  Add Your Phone
                </h2>
                <p className="text-muted-foreground text-sm">
                  We now support mobile authentication for faster, more secure login.
                </p>
              </div>

              {error && (
                <div className="glass-button mb-6 p-4 rounded-2xl border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
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
                  onClick={sendOtp}
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

                <button
                  type="button"
                  onClick={onDismiss}
                  className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-2">
                  Verify Your Phone
                </h2>
                <p className="text-muted-foreground text-sm">
                  Enter the code sent to {phone}
                </p>
              </div>

              {error && (
                <div className="glass-button mb-6 p-4 rounded-2xl border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Verification Code
                  </label>
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
                </div>

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-light text-lg tracking-wide hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : (
                    <>
                      Verify
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={resendCountdown > 0 || loading}
                  className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="glass-button rounded-2xl p-4 inline-block mb-4 border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-2">
                Phone Added
              </h2>
              <p className="text-muted-foreground text-sm">
                You can now sign in with your phone number.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
