'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * This component detects Supabase auth tokens in the URL hash
 * (from invite links, magic links, etc.) and redirects to /set-password
 * 
 * Add this to your root layout to handle invite redirects globally
 */
export function AuthRedirectHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Don't redirect if already on set-password page
    if (pathname === '/set-password') return;

    // Check for auth tokens in URL hash
    const hash = window.location.hash;
    if (!hash) return;

    const hashParams = new URLSearchParams(hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    console.log('[AuthRedirectHandler] Hash detected:', { 
      hasAccessToken: !!accessToken, 
      type,
      pathname 
    });

    // If we have an access token from an invite, redirect to set-password
    if (accessToken && (type === 'invite' || type === 'recovery' || type === 'signup')) {
      console.log('[AuthRedirectHandler] Redirecting to /set-password with tokens');
      // Use window.location for more reliable redirect with hash preservation
      window.location.href = `/set-password${hash}`;
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}

