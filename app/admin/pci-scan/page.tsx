'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Server,
  Copy,
  CheckCircle,
  Play,
  Square,
  RefreshCw,
  Cloud,
  CloudOff,
  Zap,
  Power
} from 'lucide-react'
import { 
  getScanSchedules, 
  getScannerIPs, 
  createScanSchedule, 
  updateScanStatus,
  deleteScanSchedule,
  addScannerIP,
  deleteScannerIP,
  toggleScannerIP,
  type PCIScanSchedule,
  type PCIScannerIP
} from '@/app/actions/pci-scan'
import {
  checkCloudflareConfig,
  testCloudflareConnection,
  enableScanWhitelist,
  disableScanWhitelist,
  listCloudflareWhitelistRules
} from '@/app/actions/cloudflare'

export default function PCIScanAdminPage() {
  const [schedules, setSchedules] = useState<PCIScanSchedule[]>([])
  const [scannerIPs, setScannerIPs] = useState<PCIScannerIP[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showNewSchedule, setShowNewSchedule] = useState(false)
  const [showNewIP, setShowNewIP] = useState(false)
  const [copiedIP, setCopiedIP] = useState<string | null>(null)

  // Cloudflare state
  const [cloudflareConfigured, setCloudflareConfigured] = useState(false)
  const [cloudflareStatus, setCloudflareStatus] = useState<string | null>(null)
  const [activeWhitelistRules, setActiveWhitelistRules] = useState<{ ip: string; notes: string; id: string }[]>([])
  const [whitelistLoading, setWhitelistLoading] = useState<string | null>(null)

  // New schedule form
  const [newSchedule, setNewSchedule] = useState({
    scan_name: '',
    scanner_provider: 'SecurityMetrics',
    scheduled_start: '',
    scheduled_end: '',
    notes: ''
  })

  // New IP form
  const [newIP, setNewIP] = useState({
    ip_range: '',
    description: '',
    provider: 'SecurityMetrics'
  })

  // Bulk paste mode
  const [showBulkPaste, setShowBulkPaste] = useState(false)
  const [bulkIPs, setBulkIPs] = useState('')
  const [bulkProvider, setBulkProvider] = useState('SecurityMetrics')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [schedulesRes, ipsRes, cfConfig] = await Promise.all([
      getScanSchedules(),
      getScannerIPs(),
      checkCloudflareConfig()
    ])
    
    if (schedulesRes.data) setSchedules(schedulesRes.data)
    if (ipsRes.data) setScannerIPs(ipsRes.data)
    setCloudflareConfigured(cfConfig.configured)
    
    // If Cloudflare is configured, get active whitelist rules
    if (cfConfig.configured) {
      const rulesRes = await listCloudflareWhitelistRules()
      if (rulesRes.success) {
        setActiveWhitelistRules(rulesRes.rules)
      }
    }
    
    setLoading(false)
  }

  async function handleTestCloudflare() {
    setCloudflareStatus('Testing...')
    const result = await testCloudflareConnection()
    setCloudflareStatus(result.message)
    
    if (result.success) {
      setSuccess('Cloudflare connection successful')
      setTimeout(() => setSuccess(null), 3000)
      // Refresh whitelist rules
      const rulesRes = await listCloudflareWhitelistRules()
      if (rulesRes.success) {
        setActiveWhitelistRules(rulesRes.rules)
      }
    } else {
      setError(result.message)
    }
  }

  async function handleEnableWhitelist(scanId: string) {
    setWhitelistLoading(scanId)
    setError(null)
    
    const result = await enableScanWhitelist(scanId)
    
    if (result.success || result.added > 0) {
      setSchedules(schedules.map(s => s.id === scanId ? { ...s, status: 'active' as const } : s))
      setSuccess(`Whitelist enabled: ${result.added} IPs added to Cloudflare`)
      setTimeout(() => setSuccess(null), 5000)
      
      // Refresh whitelist rules
      const rulesRes = await listCloudflareWhitelistRules()
      if (rulesRes.success) {
        setActiveWhitelistRules(rulesRes.rules)
      }
    }
    
    if (result.errors.length > 0) {
      setError(result.errors.join(', '))
    }
    
    setWhitelistLoading(null)
  }

  async function handleDisableWhitelist(scanId: string) {
    setWhitelistLoading(scanId)
    setError(null)
    
    const result = await disableScanWhitelist(scanId)
    
    if (result.success || result.removed > 0) {
      setSchedules(schedules.map(s => s.id === scanId ? { ...s, status: 'completed' as const } : s))
      setSuccess(`Whitelist disabled: ${result.removed} IPs removed from Cloudflare`)
      setTimeout(() => setSuccess(null), 5000)
      
      // Refresh whitelist rules
      const rulesRes = await listCloudflareWhitelistRules()
      if (rulesRes.success) {
        setActiveWhitelistRules(rulesRes.rules)
      }
    }
    
    if (result.errors.length > 0) {
      setError(result.errors.join(', '))
    }
    
    setWhitelistLoading(null)
  }

  async function handleCreateSchedule() {
    if (!newSchedule.scan_name || !newSchedule.scheduled_start || !newSchedule.scheduled_end) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError(null)

    const result = await createScanSchedule(newSchedule)
    
    if (result.success && result.data) {
      setSchedules([result.data, ...schedules])
      setShowNewSchedule(false)
      setNewSchedule({
        scan_name: '',
        scanner_provider: 'SecurityMetrics',
        scheduled_start: '',
        scheduled_end: '',
        notes: ''
      })
      setSuccess('Scan scheduled successfully')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to create schedule')
    }

    setSaving(false)
  }

  async function handleUpdateStatus(id: string, status: PCIScanSchedule['status']) {
    const result = await updateScanStatus(id, status)
    if (result.success) {
      setSchedules(schedules.map(s => s.id === id ? { ...s, status } : s))
      setSuccess('Status updated')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to update status')
    }
  }

  async function handleDeleteSchedule(id: string) {
    if (!confirm('Are you sure you want to delete this scan schedule?')) return
    
    const result = await deleteScanSchedule(id)
    if (result.success) {
      setSchedules(schedules.filter(s => s.id !== id))
      setSuccess('Schedule deleted')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete schedule')
    }
  }

  async function handleAddIP() {
    if (!newIP.ip_range) {
      setError('Please enter an IP range')
      return
    }

    setSaving(true)
    const result = await addScannerIP(newIP)
    
    if (result.success && result.data) {
      setScannerIPs([...scannerIPs, result.data])
      setShowNewIP(false)
      setNewIP({ ip_range: '', description: '', provider: 'SecurityMetrics' })
      setSuccess('IP added successfully')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to add IP')
    }

    setSaving(false)
  }

  // Parse bulk IPs from text - handles various formats
  function parseBulkIPs(text: string): string[] {
    if (!text || !text.trim()) return []
    
    const ips: string[] = []
    
    // Global regex to find ALL IP addresses anywhere in the text
    // Matches IPv4 with optional CIDR notation (e.g., 192.168.1.1 or 192.168.1.0/24)
    const ipRegex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\/\d{1,2})?)\b/g
    
    let match
    while ((match = ipRegex.exec(text)) !== null) {
      const ip = match[1]
      
      // Basic validation - each octet should be 0-255
      const parts = ip.split('/')[0].split('.')
      const isValid = parts.every(part => {
        const num = parseInt(part, 10)
        return num >= 0 && num <= 255
      })
      
      if (isValid) {
        ips.push(ip)
      }
    }
    
    // Remove duplicates
    return [...new Set(ips)]
  }

  async function handleBulkAddIPs() {
    const ips = parseBulkIPs(bulkIPs)
    
    if (ips.length === 0) {
      setError('No valid IP addresses found. Please check the format.')
      return
    }

    setSaving(true)
    setError(null)
    
    let successCount = 0
    let failCount = 0
    const newIPs: typeof scannerIPs = []
    
    for (const ip of ips) {
      const result = await addScannerIP({
        ip_range: ip,
        description: `Bulk import`,
        provider: bulkProvider
      })
      
      if (result.success && result.data) {
        newIPs.push(result.data)
        successCount++
      } else {
        failCount++
      }
    }
    
    if (newIPs.length > 0) {
      setScannerIPs([...scannerIPs, ...newIPs])
    }
    
    if (successCount > 0) {
      setSuccess(`Added ${successCount} IP${successCount > 1 ? 's' : ''} successfully${failCount > 0 ? ` (${failCount} failed)` : ''}`)
      setTimeout(() => setSuccess(null), 5000)
    }
    
    if (failCount > 0 && successCount === 0) {
      setError(`Failed to add IPs. They may already exist.`)
    }
    
    setBulkIPs('')
    setShowBulkPaste(false)
    setSaving(false)
  }

  async function handleDeleteIP(id: string) {
    if (!confirm('Are you sure you want to delete this IP?')) return
    
    const result = await deleteScannerIP(id)
    if (result.success) {
      setScannerIPs(scannerIPs.filter(ip => ip.id !== id))
      setSuccess('IP deleted')
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete IP')
    }
  }

  async function handleToggleIP(id: string, is_active: boolean) {
    const result = await toggleScannerIP(id, is_active)
    if (result.success) {
      setScannerIPs(scannerIPs.map(ip => ip.id === id ? { ...ip, is_active } : ip))
    } else {
      setError(result.error || 'Failed to toggle IP')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedIP(text)
    setTimeout(() => setCopiedIP(null), 2000)
  }

  function copyAllIPs() {
    const activeIPs = scannerIPs.filter(ip => ip.is_active).map(ip => ip.ip_range).join('\n')
    navigator.clipboard.writeText(activeIPs)
    setSuccess('All active IPs copied to clipboard')
    setTimeout(() => setSuccess(null), 3000)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-gray-500/20 text-muted-foreground border-border'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-muted-foreground border-border'
    }
  }

  function isWithinWindow(start: string, end: string) {
    const now = new Date()
    return now >= new Date(start) && now <= new Date(end)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(58,66,51,0.08),transparent_50%)]" />
        
        <motion.div 
          className="relative max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-foreground/5 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm tracking-widest uppercase">PCI Compliance</span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-6">
            Vulnerability Scan
            <span className="block text-foreground/60">Management</span>
          </h1>

          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Schedule PCI vulnerability scans and manage scanner IP whitelisting
          </p>
        </motion.div>
      </section>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm max-w-md"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        
        {/* Cloudflare Integration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border border-border rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {cloudflareConfigured ? (
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-orange-400" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                    <CloudOff className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-2xl font-light">Cloudflare Automation</h2>
                  <p className="text-muted-foreground text-sm">
                    {cloudflareConfigured 
                      ? 'Connected - Auto whitelist IPs when scans start' 
                      : 'Not configured - Add environment variables to enable'}
                  </p>
                </div>
              </div>
              
              {cloudflareConfigured && (
                <button
                  onClick={handleTestCloudflare}
                  className="flex items-center gap-2 px-4 py-2 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Test Connection
                </button>
              )}
            </div>

            {!cloudflareConfigured && (
              <div className="p-4 bg-foreground/30 rounded-lg border border-border">
                <p className="text-sm text-foreground/60 mb-3">Add these to your environment variables:</p>
                <code className="block text-sm font-mono text-orange-400">
                  CLOUDFLARE_API_TOKEN=your_api_token<br />
                  CLOUDFLARE_ZONE_ID=your_zone_id
                </code>
                <p className="text-xs text-muted-foreground mt-3">
                  Get these from Cloudflare Dashboard → Your domain → Overview (Zone ID) and API Tokens
                </p>
              </div>
            )}

            {cloudflareConfigured && cloudflareStatus && (
              <div className="p-4 bg-foreground/30 rounded-lg border border-border mb-4">
                <p className="text-sm text-foreground/70">{cloudflareStatus}</p>
              </div>
            )}

            {cloudflareConfigured && activeWhitelistRules.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Active PCI Whitelist Rules in Cloudflare:</p>
                <div className="flex flex-wrap gap-2">
                  {activeWhitelistRules.map(rule => (
                    <span 
                      key={rule.id}
                      className="px-3 py-1 text-xs font-mono bg-green-500/10 text-green-400 border border-green-500/20 rounded-full"
                    >
                      {rule.ip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Scanner IPs Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-light mb-2">Scanner IP Whitelist</h2>
              <p className="text-muted-foreground">
                {cloudflareConfigured 
                  ? 'These IPs will be automatically whitelisted when scans start'
                  : 'These IPs need to be whitelisted in Cloudflare during scan windows'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyAllIPs}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              <button
                onClick={() => { setShowBulkPaste(true); setShowNewIP(false); }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <Server className="w-4 h-4" />
                Bulk Paste
              </button>
              <button
                onClick={() => { setShowNewIP(true); setShowBulkPaste(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-card/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add IP
              </button>
            </div>
          </div>

          {/* New IP Form */}
          <AnimatePresence>
            {showNewIP && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-6 border border-border rounded-xl bg-foreground/5 backdrop-blur-sm">
                  <h3 className="text-lg font-medium mb-4">Add Scanner IP</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">IP Range (CIDR)</label>
                      <input
                        type="text"
                        value={newIP.ip_range}
                        onChange={(e) => setNewIP({ ...newIP, ip_range: e.target.value })}
                        placeholder="e.g., 192.168.1.0/24"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Provider</label>
                      <input
                        type="text"
                        value={newIP.provider}
                        onChange={(e) => setNewIP({ ...newIP, provider: e.target.value })}
                        placeholder="e.g., SecurityMetrics"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Description</label>
                      <input
                        type="text"
                        value={newIP.description}
                        onChange={(e) => setNewIP({ ...newIP, description: e.target.value })}
                        placeholder="e.g., Primary Scanner"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAddIP}
                      disabled={saving}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-card/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add IP'}
                    </button>
                    <button
                      onClick={() => setShowNewIP(false)}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Paste Form */}
          <AnimatePresence>
            {showBulkPaste && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-6 border border-border rounded-xl bg-foreground/5 backdrop-blur-sm">
                  <h3 className="text-lg font-medium mb-2">Bulk Paste Scanner IPs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste a list of IPs - supports bullets, dashes, numbered lists, or one IP per line
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm text-foreground/60 mb-2">IP Addresses</label>
                      <textarea
                        value={bulkIPs}
                        onChange={(e) => setBulkIPs(e.target.value)}
                        placeholder={`Paste IPs here, e.g.:
• 192.168.1.1
- 10.0.0.0/24
1. 172.16.0.1
52.203.96.0/24, 52.203.97.0/24`}
                        rows={6}
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none resize-none font-mono text-sm"
                      />
                      {bulkIPs && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {parseBulkIPs(bulkIPs).length} valid IP{parseBulkIPs(bulkIPs).length !== 1 ? 's' : ''} detected
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Provider</label>
                      <input
                        type="text"
                        value={bulkProvider}
                        onChange={(e) => setBulkProvider(e.target.value)}
                        placeholder="e.g., SecurityMetrics"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleBulkAddIPs}
                      disabled={saving || !bulkIPs.trim()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-card/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : `Add ${parseBulkIPs(bulkIPs).length || ''} IPs`}
                    </button>
                    <button
                      onClick={() => { setShowBulkPaste(false); setBulkIPs(''); }}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* IP List */}
          <div className="grid gap-3">
            {scannerIPs.map((ip, index) => (
              <motion.div
                key={ip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  ip.is_active 
                    ? 'border-border bg-foreground/5' 
                    : 'border-border bg-foreground/[0.03] opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Server className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <code className="text-lg font-mono">{ip.ip_range}</code>
                    {ip.description && (
                      <p className="text-sm text-muted-foreground">{ip.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground px-3 py-1 border border-border rounded-full">
                    {ip.provider}
                  </span>
                  <button
                    onClick={() => copyToClipboard(ip.ip_range)}
                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                    title="Copy IP"
                  >
                    {copiedIP === ip.ip_range ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleIP(ip.id, !ip.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      ip.is_active ? 'bg-green-500/20 text-green-400' : 'bg-foreground/10 text-muted-foreground'
                    }`}
                    title={ip.is_active ? 'Disable' : 'Enable'}
                  >
                    {ip.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteIP(ip.id)}
                    className="p-2 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scheduled Scans Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-light mb-2">Scheduled Scans</h2>
              <p className="text-muted-foreground">
                Track when PCI vulnerability scans are scheduled to run
              </p>
            </div>
            <button
              onClick={() => setShowNewSchedule(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-card/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule Scan
            </button>
          </div>

          {/* New Schedule Form */}
          <AnimatePresence>
            {showNewSchedule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-6 border border-border rounded-xl bg-foreground/5 backdrop-blur-sm">
                  <h3 className="text-lg font-medium mb-4">Schedule New Scan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Scan Name *</label>
                      <input
                        type="text"
                        value={newSchedule.scan_name}
                        onChange={(e) => setNewSchedule({ ...newSchedule, scan_name: e.target.value })}
                        placeholder="e.g., Q1 2026 PCI Scan"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Scanner Provider</label>
                      <input
                        type="text"
                        value={newSchedule.scanner_provider}
                        onChange={(e) => setNewSchedule({ ...newSchedule, scanner_provider: e.target.value })}
                        placeholder="e.g., SecurityMetrics"
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">Start Time *</label>
                      <input
                        type="datetime-local"
                        value={newSchedule.scheduled_start}
                        onChange={(e) => setNewSchedule({ ...newSchedule, scheduled_start: e.target.value })}
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/60 mb-2">End Time *</label>
                      <input
                        type="datetime-local"
                        value={newSchedule.scheduled_end}
                        onChange={(e) => setNewSchedule({ ...newSchedule, scheduled_end: e.target.value })}
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-foreground/60 mb-2">Notes</label>
                      <textarea
                        value={newSchedule.notes}
                        onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                        placeholder="Any additional notes about this scan..."
                        rows={3}
                        className="w-full px-4 py-3 bg-foreground/50 border border-border rounded-lg focus:border-border focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleCreateSchedule}
                      disabled={saving}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-card/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Scheduling...' : 'Schedule Scan'}
                    </button>
                    <button
                      onClick={() => setShowNewSchedule(false)}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Schedules List */}
          {schedules.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-xl bg-foreground/[0.03]">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No scans scheduled yet</p>
              <button
                onClick={() => setShowNewSchedule(true)}
                className="mt-4 text-foreground/70 hover:text-foreground underline underline-offset-4"
              >
                Schedule your first scan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule, index) => {
                const isActive = isWithinWindow(schedule.scheduled_start, schedule.scheduled_end)
                const isLoading = whitelistLoading === schedule.id
                
                return (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 border rounded-xl transition-colors ${
                      isActive && schedule.status !== 'completed' && schedule.status !== 'cancelled'
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-border bg-foreground/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-medium">{schedule.scan_name}</h3>
                          <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full border ${getStatusColor(schedule.status)}`}>
                            {schedule.status}
                          </span>
                          {isActive && schedule.status !== 'completed' && schedule.status !== 'cancelled' && (
                            <span className="flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wider rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(schedule.scheduled_start)}
                          </div>
                          <span>→</span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatDate(schedule.scheduled_end)}
                          </div>
                        </div>
                        {schedule.notes && (
                          <p className="text-sm text-muted-foreground">{schedule.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Provider: {schedule.scanner_provider}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Cloudflare whitelist controls */}
                        {cloudflareConfigured && schedule.status === 'scheduled' && (
                          <button
                            onClick={() => handleEnableWhitelist(schedule.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                            title="Enable Cloudflare Whitelist"
                          >
                            {isLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                            <span className="text-sm">Enable</span>
                          </button>
                        )}
                        {cloudflareConfigured && schedule.status === 'active' && (
                          <button
                            onClick={() => handleDisableWhitelist(schedule.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors disabled:opacity-50"
                            title="Disable Cloudflare Whitelist"
                          >
                            {isLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                            <span className="text-sm">Disable</span>
                          </button>
                        )}

                        {/* Manual status controls (when Cloudflare not configured) */}
                        {!cloudflareConfigured && schedule.status === 'scheduled' && (
                          <button
                            onClick={() => handleUpdateStatus(schedule.id, 'active')}
                            className="p-2 hover:bg-green-500/20 text-muted-foreground hover:text-green-400 rounded-lg transition-colors"
                            title="Mark as Active"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {!cloudflareConfigured && schedule.status === 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(schedule.id, 'completed')}
                            className="p-2 hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(schedule.status === 'scheduled' || schedule.status === 'active') && (
                          <button
                            onClick={() => handleUpdateStatus(schedule.id, 'cancelled')}
                            className="p-2 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-2 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>

        {/* Instructions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 border border-border rounded-xl bg-gradient-to-br from-white/5 to-transparent"
        >
          <h2 className="font-serif text-2xl font-light mb-6">
            {cloudflareConfigured ? 'How Automation Works' : 'Manual Setup Instructions'}
          </h2>
          
          {cloudflareConfigured ? (
            <div className="space-y-4 text-foreground/70">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-400 text-sm">✓</span>
                <div>
                  <p className="font-medium text-foreground">Automatic Whitelisting</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click &quot;Enable&quot; on a scheduled scan to automatically whitelist all scanner IPs in Cloudflare
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-400 text-sm">✓</span>
                <div>
                  <p className="font-medium text-foreground">Automatic Cleanup</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click &quot;Disable&quot; when the scan is complete to remove all whitelist rules from Cloudflare
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-sm">⏰</span>
                <div>
                  <p className="font-medium text-foreground">Scheduled Automation (Optional)</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set up a cron job to call <code className="text-orange-400">/api/cron/pci-scan</code> every 5 minutes for fully automatic whitelist management based on scan windows
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-foreground/70">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 text-sm">1</span>
                <div>
                  <p className="font-medium text-foreground">Whitelist Scanner IPs in Cloudflare</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to Cloudflare → Security → WAF → Tools → IP Access Rules and add each scanner IP as &quot;Allow&quot;
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 text-sm">2</span>
                <div>
                  <p className="font-medium text-foreground">Or Pause Cloudflare Temporarily</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alternatively, pause Cloudflare during the scan window (Overview → Advanced Actions → Pause Cloudflare)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 text-sm">3</span>
                <div>
                  <p className="font-medium text-foreground">Re-enable Protection After Scan</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once the scan is complete, remove the IP whitelist rules or resume Cloudflare protection
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
