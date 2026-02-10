'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Save, ArrowLeft, CreditCard, AlertTriangle, Loader2, ExternalLink, Palette } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getPaymentFallbackSettings, updatePaymentFallbackSettings, type PaymentFallbackSettings } from '@/app/actions/payment-fallback'

export default function SettingsPage() {
  // Payment Fallback State
  const [paymentFallbackLoading, setPaymentFallbackLoading] = useState(true)
  const [paymentFallbackSaving, setPaymentFallbackSaving] = useState(false)
  const [paymentFallback, setPaymentFallback] = useState<PaymentFallbackSettings>({
    payment_fallback_enabled: false,
    payment_fallback_message: 'Payment processing is temporarily unavailable. An invoice will be sent to your email.',
    shopify_store_domain: '',
    shopify_client_id: '',
    shopify_access_token: '',
    shopify_invoice_prefix: 'INV'
  })
  
  // Load payment fallback settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getPaymentFallbackSettings()
        if (settings) {
          setPaymentFallback(settings)
        }
      } catch (error) {
        console.error('Failed to load payment fallback settings:', error)
      } finally {
        setPaymentFallbackLoading(false)
      }
    }
    loadSettings()
  }, [])
  
  const handleSavePaymentFallback = async () => {
    setPaymentFallbackSaving(true)
    try {
      // Validate Shopify settings if enabling
      if (paymentFallback.payment_fallback_enabled) {
        if (!paymentFallback.shopify_store_domain) {
          toast.error('Shopify store domain is required when enabling fallback mode')
          return
        }
        if (!paymentFallback.shopify_access_token) {
          toast.error('Shopify Access Token is required when enabling fallback mode')
          return
        }
      }
      
      const result = await updatePaymentFallbackSettings(paymentFallback)
      if (result.success) {
        toast.success(
          paymentFallback.payment_fallback_enabled 
            ? 'Payment fallback mode ENABLED - Orders will receive Shopify invoices' 
            : 'Payment fallback settings saved'
        )
      } else {
        toast.error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save payment fallback settings')
    } finally {
      setPaymentFallbackSaving(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Store Settings</h1>
          <p className="text-xl text-muted-foreground">Configure store-wide settings and integrations.</p>
        </div>

        {/* Payment Fallback Mode */}
        <section className="space-y-6">
          <div className={`relative overflow-hidden rounded-2xl border ${paymentFallback.payment_fallback_enabled ? 'border-orange-500/50 bg-orange-500/10' : 'border-border bg-foreground/5'} backdrop-blur-xl transition-colors duration-300`}>
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${paymentFallback.payment_fallback_enabled ? 'bg-orange-500/20' : 'bg-orange-500/20'} flex items-center justify-center`}>
                    <CreditCard className={`h-5 w-5 ${paymentFallback.payment_fallback_enabled ? 'text-orange-400' : 'text-orange-400'}`} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Payment Fallback Mode</h2>
                    <p className="text-sm text-muted-foreground">
                      {paymentFallback.payment_fallback_enabled 
                        ? 'Checkout will send Shopify invoices instead of processing payments'
                        : 'Enable when payment processing is down to send Shopify invoices'
                      }
                    </p>
              </div>
                </div>
                {paymentFallbackLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <Switch 
                    checked={paymentFallback.payment_fallback_enabled} 
                    onCheckedChange={(checked) => setPaymentFallback(prev => ({ ...prev, payment_fallback_enabled: checked }))}
                    className="scale-125"
                  />
                )}
              </div>

              {paymentFallback.payment_fallback_enabled && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-orange-300 font-medium">Payment Fallback Mode is ACTIVE</p>
                    <p className="text-sm text-orange-300/70 mt-1">
                      Customers can checkout without payment. Orders will be created with "pending_invoice" status and invoices will be sent from your Shopify store.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground/70">Customer Message</Label>
                  <Textarea
                    value={paymentFallback.payment_fallback_message}
                    onChange={(e) => setPaymentFallback(prev => ({ ...prev, payment_fallback_message: e.target.value }))}
                    placeholder="Message shown to customers during checkout"
                    className="bg-foreground/5 border-border text-foreground rounded-xl focus:border-border min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">This message will be displayed on the checkout page when fallback mode is enabled</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://cdn.shopify.com/s/files/1/0553/4068/2022/files/shopify-logo.svg?v=1631040896" 
                    alt="Shopify" 
                    className="h-6 w-auto opacity-70"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-lg font-semibold text-foreground">Shopify Invoice Configuration</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground/70">Store Domain</Label>
                    <Input 
                      value={paymentFallback.shopify_store_domain}
                      onChange={(e) => setPaymentFallback(prev => ({ ...prev, shopify_store_domain: e.target.value }))}
                      placeholder="your-store.myshopify.com"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border placeholder:text-muted-foreground" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground/70">Invoice Prefix</Label>
                    <Input 
                      value={paymentFallback.shopify_invoice_prefix}
                      onChange={(e) => setPaymentFallback(prev => ({ ...prev, shopify_invoice_prefix: e.target.value }))}
                      placeholder="INV"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border placeholder:text-muted-foreground" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground/70">Admin API Access Token</Label>
                  <Input
                    type="password"
                    value={paymentFallback.shopify_access_token}
                    onChange={(e) => setPaymentFallback(prev => ({ ...prev, shopify_access_token: e.target.value }))}
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border placeholder:text-muted-foreground font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Starts with shpat_</p>
                </div>

                <div className="p-4 rounded-xl bg-foreground/5 border border-border space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">How to get your Admin API Access Token:</h4>
                  <ol className="space-y-2 text-sm text-foreground/60 list-decimal list-inside">
                    <li>Go to your Shopify Admin → <strong>Settings</strong> (bottom left)</li>
                    <li>Click <strong>Apps and sales channels</strong></li>
                    <li>Click <strong>Develop apps</strong> (top right)</li>
                    <li>Create a new app or select existing one</li>
                    <li>Click <strong>Configure Admin API scopes</strong></li>
                    <li>Enable: <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">write_draft_orders</code> and <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">read_draft_orders</code></li>
                    <li>Click <strong>Save</strong> then <strong>Install app</strong></li>
                    <li>Click <strong>Reveal token once</strong> to copy the token</li>
                  </ol>
                  <a 
                    href={`https://${paymentFallback.shopify_store_domain || 'your-store.myshopify.com'}/admin/settings/apps/development`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Shopify Develop Apps
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={handleSavePaymentFallback}
                  disabled={paymentFallbackSaving || paymentFallbackLoading}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold"
                >
                  {paymentFallbackSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                  <Save className="h-4 w-4 mr-2" />
                      Save Payment Fallback Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Appearance</h2>
                  <p className="text-sm text-muted-foreground">Customize the look of your store</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">Theme customization coming soon...</p>
              <Button 
                variant="outline" 
                disabled 
                className="h-12 px-6 rounded-xl bg-foreground/5 border-border text-muted-foreground"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
