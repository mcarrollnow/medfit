"use client"

import { useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"

/**
 * Payment Redirect Content Component
 * Wrapped in Suspense for Next.js 14+ compatibility
 */
function PaymentRedirectContent() {
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)
  const token = searchParams.get("token")

  // Determine the correct Authorize.net URL based on environment
  const isProduction = process.env.NEXT_PUBLIC_AUTHORIZE_NET_ENVIRONMENT === "production"
  const authorizeNetUrl = isProduction
    ? "https://accept.authorize.net/payment/payment"
    : "https://test.authorize.net/payment/payment"

  useEffect(() => {
    // Auto-submit the form once the page loads
    if (token && formRef.current) {
      formRef.current.submit()
    }
  }, [token])

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-light text-white mb-4">Payment Error</h1>
        <p className="text-gray-400">No payment token provided.</p>
      </div>
    )
  }

  return (
    <>
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400 font-mono text-sm">Redirecting to secure payment...</p>
      </div>

      {/* Hidden form that auto-submits to Authorize.net */}
      <form
        ref={formRef}
        method="POST"
        action={authorizeNetUrl}
        style={{ display: "none" }}
      >
        <input type="hidden" name="token" value={token} />
      </form>
    </>
  )
}

/**
 * Payment Redirect Page
 * 
 * This page handles redirecting to Authorize.net's hosted payment form
 * using a proper POST request (required by Authorize.net).
 * 
 * Usage: /payment/redirect?token=YOUR_TOKEN
 */
export default function PaymentRedirectPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">Loading...</p>
        </div>
      }>
        <PaymentRedirectContent />
      </Suspense>
    </div>
  )
}
