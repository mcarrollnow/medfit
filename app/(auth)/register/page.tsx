'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Phone, Mail, Lock, User, Gift, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    referralCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  
  const isSubmittingRef = useRef(false);
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const previousCleaned = formData.phone.replace(/\D/g, '');
    const newCleaned = input.replace(/\D/g, '');
    
    let cleaned = newCleaned;
    if (input.length < formData.phone.length && newCleaned.length === previousCleaned.length && newCleaned.length > 0) {
      cleaned = newCleaned.slice(0, -1);
    }

    let formatted = cleaned;
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }

    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    
    setError(null);
    setValidationErrors([]);

    const trimmedPw = formData.password.trim();
    const trimmedConfirm = formData.confirmPassword.trim();

    if (trimmedPw !== trimmedConfirm) {
      setError('Passwords do not match');
      isSubmittingRef.current = false;
      return;
    }

    if (trimmedPw.length < 8) {
      setError('Password must be at least 8 characters');
      isSubmittingRef.current = false;
      return;
    }

    setLoading(true);

    try {
      const cleanedPhone = formData.phone.replace(/\D/g, '');

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: trimmedPw,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: cleanedPhone || undefined,
          referralCode: formData.referralCode.trim() || undefined,
          customerType: 'retail',
          skipPhoneCheck: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.details && Array.isArray(data.error.details)) {
          setValidationErrors(data.error.details);
        } else {
          setError(data.error?.message || 'Registration failed');
        }
        return;
      }

      setRegistrationComplete(true);
    } catch (error: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <div className="max-w-md w-full">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10">
            {registrationComplete ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">Check Your Email</h1>
                <p className="text-white/70 mb-4">
                  We've sent a verification link to <strong className="text-white">{formData.email}</strong>
                </p>
                <p className="text-sm text-white/50 mb-6">
                  Please check your inbox and click the verification link to complete your registration.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    prefetch={false}
                    className="block w-full py-3.5 bg-white text-black rounded-xl font-semibold text-lg hover:bg-white/90 transition-all text-center"
                  >
                    Go to Login
                  </Link>
                  <Link
                    href="/"
                    prefetch={false}
                    className="block text-white/50 hover:text-white/70 text-sm transition-colors text-center"
                  >
                    Back to Shop
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-2">Create Account</h1>
                  <p className="text-white/50">Join us today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {validationErrors.length > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                      {validationErrors.map((err, idx) => (
                        <div key={idx} className="text-red-400 text-sm">
                          {err}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/70">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                          autoComplete="given-name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/70">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Phone Number <span className="text-white/40 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(555) 123-4567"
                        maxLength={14}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                        autoComplete="tel"
                      />
                    </div>
                    <p className="text-xs text-white/40">You can enable mobile sign-in later in your profile settings</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Referral Code <span className="text-white/40 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.referralCode}
                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                        placeholder="XXXX1234"
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors font-mono tracking-wider"
                        autoComplete="off"
                      />
                    </div>
                    <p className="text-xs text-white/40">Have a friend's code? Enter it to get a discount!</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={8}
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-white/40">Minimum 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-white text-black rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating Account...' : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-white/50">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      prefetch={false}
                      className="text-white hover:text-white/80 font-semibold transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                  <Link href="/" prefetch={false} className="text-sm text-white/40 hover:text-white/60 transition-colors inline-block">
                    Back to Shop
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
