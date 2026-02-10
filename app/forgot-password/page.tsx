'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteConfig.appUrl}/set-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-8 md:p-10">
          {/* Noise texture overlay */}
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          {/* Glow effect */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />

          <div className="relative z-10">
            {sent ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Check Your Email</h1>
                <p className="text-foreground/70 mb-4">
                  We've sent a password reset link to <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </p>
                <Link
                  href="/login"
                  prefetch={false}
                  className="block text-muted-foreground hover:text-foreground/70 text-sm transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>

                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">Forgot Password?</h1>
                  <p className="text-muted-foreground">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground/70">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none focus:ring-0 transition-colors"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-card/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    Remember your password?{' '}
                    <Link
                      href="/login"
                      prefetch={false}
                      className="text-foreground hover:text-foreground/80 font-semibold transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
