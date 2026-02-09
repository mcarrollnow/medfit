"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft, Smartphone, Monitor, Check, Copy, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import GlobalNav from '@/components/global-nav'
import { Loader2 } from 'lucide-react'
import QRCode from 'react-qr-code'

const CASH_TAG = '$MadamImadam1'

function CashAppPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [orderData, setOrderData] = useState<{
    orderId: string
    orderTotal: number
  } | null>(null)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    }
    setIsMobile(checkMobile())

    const orderId = searchParams.get('orderId')
    const total = parseFloat(searchParams.get('total') || '0')

    if (!orderId || total === 0) {
      router.push('/checkout')
      return
    }

    setOrderData({
      orderId,
      orderTotal: total,
    })
    setLoading(false)
  }, [searchParams, router])

  // Cash App deep link with amount prefilled
  // Format: https://cash.app/$cashtag/amount
  const getCashAppLink = () => {
    if (!orderData) return ''
    return `https://cash.app/${CASH_TAG}/${orderData.orderTotal.toFixed(2)}`
  }

  const handleCopyTag = async () => {
    await navigator.clipboard.writeText(CASH_TAG)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenCashApp = () => {
    window.location.href = getCashAppLink()
  }

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/payment?orderId=${orderData.orderId}&total=${orderData.orderTotal}&wallet=`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payment Options
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <img 
              src="https://bteugdayafihvdzhpnlv.supabase.co/storage/v1/object/public/theme-assets/Cash_App-White-Logo.wine.svg"
              alt="Cash App"
              className="h-10 w-auto"
            />
            <div>
              <p className="text-white/50">
                Total: <span className="font-semibold text-white text-xl">${orderData.orderTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <CardContent className="p-6 sm:p-8">
            {isMobile ? (
              /* Mobile View - Deep Link Button */
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/70">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm">Mobile device detected</span>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-white/70">
                    Tap below to open Cash App with the payment details prefilled
                  </p>

                  <Button
                    onClick={handleOpenCashApp}
                    className="w-full h-14 text-lg font-semibold bg-[#00D632] hover:bg-[#00B82B] text-white border-0"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Pay ${orderData.orderTotal.toFixed(2)} in Cash App
                  </Button>

                  <p className="text-xs text-white/40">
                    Sending to: <span className="font-mono text-white/60">{CASH_TAG}</span>
                  </p>
                </div>

                {/* Manual fallback */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50 mb-3">
                    Or send manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center">
                      <span className="text-white font-mono">{CASH_TAG}</span>
                    </div>
                    <Button
                      onClick={handleCopyTag}
                      variant="outline"
                      className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    Amount: <span className="font-mono text-white/60">${orderData.orderTotal.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Desktop View - QR Code */
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/70">
                  <Monitor className="w-5 h-5" />
                  <span className="text-sm">Scan with your phone</span>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <p className="text-white/70 text-center">
                    Scan this QR code with your phone to open Cash App with payment details prefilled
                  </p>

                  {/* QR Code */}
                  <div className="p-4 bg-white rounded-2xl">
                    <QRCode
                      value={getCashAppLink()}
                      size={200}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-sm text-white/50">
                      Sending to: <span className="font-mono text-white/70">{CASH_TAG}</span>
                    </p>
                    <p className="text-sm text-white/50">
                      Amount: <span className="font-mono text-white/70">${orderData.orderTotal.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Copy cashtag */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50 mb-3">
                    Or copy cashtag to send manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center">
                      <span className="text-white font-mono">{CASH_TAG}</span>
                    </div>
                    <Button
                      onClick={handleCopyTag}
                      variant="outline"
                      className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* Desktop deep link fallback */}
                <div className="text-center">
                  <a
                    href={getCashAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 hover:text-white underline underline-offset-2"
                  >
                    Open Cash App in browser →
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-medium text-white mb-2">After sending payment:</h3>
          <ol className="text-sm text-white/50 space-y-1 list-decimal list-inside">
            <li>Complete the payment in Cash App</li>
            <li>Take a screenshot of the confirmation</li>
            <li>Your order will be processed once we confirm receipt</li>
          </ol>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/30">
            Cash App payments are typically confirmed within minutes
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CashAppPaymentPage() {
  return (
    <>
      <GlobalNav />
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CashAppPaymentContent />
      </Suspense>
    </>
  )
}

