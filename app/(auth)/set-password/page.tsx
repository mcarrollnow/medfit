'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Lock, Eye, EyeOff, Check, AlertCircle, ArrowLeft } from 'lucide-react';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double execution in React strict mode
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const hash = window.location.hash;
      
      // Check for error in hash
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const urlError = params.get('error');
        const errorDesc = params.get('error_description');
        
        if (urlError) {
          setError(errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, ' ')) : 'Link expired or invalid');
          setPageLoading(false);
          return;
        }

        // Extract tokens
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          // Decode email from JWT
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            setUserEmail(payload.email || null);
          } catch {}

          // Clear hash immediately
          window.history.replaceState(null, '', '/set-password');

          // Set session if we have both tokens
          if (refreshToken) {
            try {
              await supabase.auth.setSession({ 
                access_token: accessToken, 
                refresh_token: refreshToken 
              });
            } catch (e) {
              console.error('Session error:', e);
            }
          }
          
          setPageLoading(false);
          return;
        }
      }

      // No hash - check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
        setPageLoading(false);
      } else {
        setError('No valid link found. Please request a new password reset.');
        setPageLoading(false);
      }
    };

    init();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      
      // Redirect after success
      setTimeout(() => router.push('/'), 2000);
    } catch {
      setError('Failed to update password. Please try again.');
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error && !userEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-white/50 mb-6">{error}</p>
          <Link href="/forgot-password" prefetch={false} className="block w-full py-3 rounded-xl bg-white text-black font-semibold">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
          <Check className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Password Updated!</h1>
          <p className="text-white/50">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Set Password</h1>
          {userEmail && <p className="text-white/50 text-center mb-6">{userEmail}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full py-3 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
