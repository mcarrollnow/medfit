"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Settings, CheckCircle, AlertCircle, RefreshCw, Copy, ExternalLink, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface TrackingLog {
  id: string
  order_number: string
  tracking_number: string
  status: string
  created_at: string
  source: string
}

interface TrackingSettings {
  webhook_url: string
  api_key: string
  enabled: boolean
}

export default function TrackingSettingsPage() {
  const [settings, setSettings] = useState<TrackingSettings>({
    webhook_url: '',
    api_key: '',
    enabled: true
  })
  const [logs, setLogs] = useState<TrackingLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // The webhook URL for Cloudflare to call
  const webhookEndpoint = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/tracking/inbound-email`
    : '/api/tracking/inbound-email'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load settings from API
      const settingsRes = await fetch('/api/admin/tracking/settings')
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data)
      }

      // Load recent processing logs
      const logsRes = await fetch('/api/admin/tracking/logs')
      if (logsRes.ok) {
        const data = await logsRes.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error loading tracking data:', error)
    }
    setLoading(false)
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/admin/tracking/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
    setSaving(false)
  }

  const handleTestWebhook = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/tracking/inbound-email')
      if (res.ok) {
        setTestResult({ success: true, message: 'Webhook endpoint is active and responding!' })
      } else {
        setTestResult({ success: false, message: 'Webhook endpoint returned an error' })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to reach webhook endpoint' })
    }
    setTesting(false)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const generateApiKey = () => {
    const key = 'trk_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    setSettings({ ...settings, api_key: key })
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
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Mail className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-5xl">Email Tracking</h1>
              <p className="text-lg text-muted-foreground">Automatic USPS tracking from email receipts</p>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-2xl border p-6 ${settings.enabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${settings.enabled ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}>
                <Zap className={`h-6 w-6 ${settings.enabled ? 'text-emerald-400' : 'text-yellow-400'}`} />
              </div>
              <div>
                <p className={`text-lg font-semibold ${settings.enabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {settings.enabled ? 'Automation Active' : 'Automation Paused'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {settings.enabled ? 'Emails are being processed automatically' : 'Email processing is disabled'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              variant="outline"
              className={`rounded-xl ${settings.enabled ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'}`}
            >
              {settings.enabled ? 'Pause' : 'Enable'}
            </Button>
          </div>
        </div>

        {/* Cloudflare Setup Instructions */}
        <div className="rounded-2xl border border-border bg-foreground/5 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Cloudflare Email Worker Setup</h2>
          </div>

          <div className="space-y-4">
            <p className="text-foreground/60">
              Configure your Cloudflare Email Worker with these values:
            </p>

            {/* Webhook URL */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Webhook URL (for Cloudflare Worker)</label>
              <div className="flex gap-2">
                <Input
                  value={webhookEndpoint}
                  readOnly
                  className="flex-1 bg-foreground/5 border-border text-foreground font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(webhookEndpoint, 'webhook')}
                  variant="outline"
                  className="border-border text-foreground hover:bg-foreground/10"
                >
                  {copiedField === 'webhook' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">API Key (for authentication)</label>
              <div className="flex gap-2">
                <Input
                  value={settings.api_key || ''}
                  onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                  placeholder="Generate or enter an API key"
                  className="flex-1 bg-foreground/5 border-border text-foreground font-mono text-sm"
                />
                <Button
                  onClick={generateApiKey}
                  variant="outline"
                  className="border-border text-foreground hover:bg-foreground/10"
                >
                  Generate
                </Button>
                {settings.api_key && (
                  <Button
                    onClick={() => copyToClipboard(settings.api_key, 'apikey')}
                    variant="outline"
                    className="border-border text-foreground hover:bg-foreground/10"
                  >
                    {copiedField === 'apikey' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                onClick={handleTestWebhook}
                disabled={testing}
                variant="outline"
                className="border-border text-foreground hover:bg-foreground/10"
              >
                {testing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Test Webhook
              </Button>
              {testResult && (
                <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {testResult.message}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Settings saved
                </span>
              )}
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-card/90"
            >
              {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Settings
            </Button>
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div className="rounded-2xl border border-border bg-foreground/5 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Quick Setup in Cloudflare</h2>
          
          <ol className="space-y-4 text-foreground/70">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">1</span>
              <span>Go to <strong className="text-foreground">Cloudflare Dashboard → Email Routing → Email Workers</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">2</span>
              <span>Create a new Worker and paste the code from <code className="text-orange-400 bg-foreground/5 px-2 py-0.5 rounded">cloudflare-email-worker.js</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">3</span>
              <span>Set environment variables: <code className="text-orange-400 bg-foreground/5 px-2 py-0.5 rounded">USPS_WEBHOOK_URL</code> and <code className="text-orange-400 bg-foreground/5 px-2 py-0.5 rounded">USPS_WEBHOOK_API_KEY</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">4</span>
              <span>Create a routing rule: <strong className="text-foreground">tracking@yourdomain.com → This Worker</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground">5</span>
              <span>Forward your USPS receipt emails to that address</span>
            </li>
          </ol>

          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            Open Cloudflare Dashboard
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-foreground/5 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            </div>
            <Button
              onClick={loadData}
              disabled={loading}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tracking emails processed yet</p>
              <p className="text-sm mt-1">Emails will appear here once the automation is set up</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      log.status === 'updated' ? 'bg-emerald-500/20' :
                      log.status === 'already_has_tracking' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {log.status === 'updated' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : log.status === 'already_has_tracking' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{log.order_number}</p>
                      <p className="text-sm text-muted-foreground font-mono">{log.tracking_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${
                      log.status === 'updated' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      log.status === 'already_has_tracking' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {log.status.replace(/_/g, ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

