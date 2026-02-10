'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Bot,
  Save,
  Trash2,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Check,
  Settings,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Package,
  CreditCard,
  ShieldCheck,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  RefreshCw,
  Webhook,
  Link2,
  Copy,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AIAgent {
  id: string
  name: string
  slug: string
  description: string | null
  avatar_url: string | null
  agent_type: string
  is_active: boolean
  model: string
  temperature: number
  max_tokens: number
  system_prompt: string
  personality: string | null
  greeting_message: string | null
  can_send_sms: boolean
  can_send_email: boolean
  can_create_orders: boolean
  can_modify_orders: boolean
  can_issue_refunds: boolean
  can_access_customer_data: boolean
  can_access_order_data: boolean
  can_escalate_to_human: boolean
  resources?: Resource[]
  examples?: Example[]
}

interface Resource {
  id: string
  title: string
  resource_type: string
  content: string
  priority: number
  is_active: boolean
}

interface Example {
  id: string
  user_message: string
  ideal_response: string
  context: string | null
  category: string | null
  is_active: boolean
}

interface AgentWebhook {
  id: string
  name: string
  description: string | null
  webhook_type: string
  endpoint_path: string | null
  secret_key: string | null
  target_url: string | null
  trigger_event: string | null
  is_active: boolean
  trigger_count: number
  last_triggered_at: string | null
}

const agentTypes = [
  { value: 'sms_support', label: 'SMS Support' },
  { value: 'order_confirmation', label: 'Order Confirmation' },
  { value: 'payment_collection', label: 'Payment Collection' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'sales', label: 'Sales' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'general', label: 'General' },
]

const resourceTypes = [
  { value: 'document', label: 'Document' },
  { value: 'faq', label: 'FAQ' },
  { value: 'policy', label: 'Policy' },
  { value: 'script', label: 'Script' },
  { value: 'product_info', label: 'Product Info' },
  { value: 'procedure', label: 'Procedure' },
]

export default function AIAgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new'
  
  const [agent, setAgent] = useState<Partial<AIAgent>>({
    name: '',
    slug: '',
    description: '',
    agent_type: 'general',
    is_active: true,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    max_tokens: 1024,
    system_prompt: '',
    personality: '',
    greeting_message: '',
    can_send_sms: false,
    can_send_email: false,
    can_create_orders: false,
    can_modify_orders: false,
    can_issue_refunds: false,
    can_access_customer_data: true,
    can_access_order_data: true,
    can_escalate_to_human: true,
    resources: [],
    examples: [],
  })
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Expandable sections
  const [expandedSections, setExpandedSections] = useState({
    instructions: true,
    capabilities: true,
    webhooks: false,
    resources: false,
    examples: false,
  })
  
  // Webhooks
  const [webhooks, setWebhooks] = useState<AgentWebhook[]>([])
  const [showNewWebhook, setShowNewWebhook] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ 
    name: '', 
    webhook_type: 'trigger', 
    trigger_event: '',
    endpoint_path: '',
    description: ''
  })
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  // New resource/example forms
  const [showNewResource, setShowNewResource] = useState(false)
  const [showNewExample, setShowNewExample] = useState(false)
  const [newResource, setNewResource] = useState({ title: '', resource_type: 'document', content: '' })
  const [newExample, setNewExample] = useState({ user_message: '', ideal_response: '', category: '' })

  useEffect(() => {
    if (!isNew) {
      fetchAgent()
      fetchWebhooks()
    }
  }, [id, isNew])

  const fetchWebhooks = async () => {
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/webhooks`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data)
      }
    } catch (err) {
      console.error('Error fetching webhooks:', err)
    }
  }

  const addWebhook = async () => {
    if (!newWebhook.name) {
      setError('Webhook name is required')
      return
    }

    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newWebhook),
      })

      if (!response.ok) throw new Error('Failed to add webhook')
      
      const webhook = await response.json()
      setWebhooks(prev => [...prev, webhook])
      setNewWebhook({ name: '', webhook_type: 'trigger', trigger_event: '', endpoint_path: '', description: '' })
      setShowNewWebhook(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteWebhook = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/webhooks?webhookId=${webhookId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete webhook')
      
      setWebhooks(prev => prev.filter(w => w.id !== webhookId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}`, { credentials: 'include' })
      if (!response.ok) throw new Error('Agent not found')
      const data = await response.json()
      setAgent(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!agent.name || !agent.system_prompt) {
      setError('Name and system prompt are required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const url = isNew ? '/api/admin/ai-agents' : `/api/admin/ai-agents/${id}`
      const method = isNew ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(agent),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save agent')
      }

      const savedAgent = await response.json()
      setSuccess(true)
      
      if (isNew) {
        router.push(`/admin/ai-agents/${savedAgent.id}`)
      } else {
        setAgent(savedAgent)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete agent')
      
      router.push('/admin/ai-agents')
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  const addResource = async () => {
    if (!newResource.title || !newResource.content) {
      setError('Title and content are required for resources')
      return
    }

    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newResource),
      })

      if (!response.ok) throw new Error('Failed to add resource')
      
      const resource = await response.json()
      setAgent(prev => ({
        ...prev,
        resources: [...(prev.resources || []), resource]
      }))
      setNewResource({ title: '', resource_type: 'document', content: '' })
      setShowNewResource(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/resources?resourceId=${resourceId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete resource')
      
      setAgent(prev => ({
        ...prev,
        resources: prev.resources?.filter(r => r.id !== resourceId)
      }))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const addExample = async () => {
    if (!newExample.user_message || !newExample.ideal_response) {
      setError('User message and ideal response are required')
      return
    }

    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newExample),
      })

      if (!response.ok) throw new Error('Failed to add example')
      
      const example = await response.json()
      setAgent(prev => ({
        ...prev,
        examples: [...(prev.examples || []), example]
      }))
      setNewExample({ user_message: '', ideal_response: '', category: '' })
      setShowNewExample(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteExample = async (exampleId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-agents/${id}/examples?exampleId=${exampleId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to delete example')
      
      setAgent(prev => ({
        ...prev,
        examples: prev.examples?.filter(e => e.id !== exampleId)
      }))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateField = (field: keyof AIAgent, value: any) => {
    setAgent(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading agent...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 lg:px-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/ai-agents"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Agents</span>
          </Link>
          
          {!isNew && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span className="ml-2 hidden sm:inline">Delete</span>
            </Button>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30 flex items-center justify-center">
            <Bot className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isNew ? 'Create New Agent' : agent.name || 'AI Agent'}
            </h1>
            <p className="text-muted-foreground">{isNew ? 'Configure your new AI assistant' : 'Edit agent settings and training'}</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-500/20 rounded">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            Agent saved successfully!
          </motion.div>
        )}

        {/* Basic Info */}
        <div className="rounded-2xl border border-border bg-foreground/5 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Basic Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Agent Name *</label>
              <Input
                value={agent.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., SMS Support Bot"
                className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Slug</label>
              <Input
                value={agent.slug || ''}
                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="sms-support-bot"
                className="h-12 rounded-xl bg-foreground/5 border-border text-foreground font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Description</label>
            <Input
              value={agent.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="What does this agent do?"
              className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Agent Type</label>
              <select
                value={agent.agent_type || 'general'}
                onChange={(e) => updateField('agent_type', e.target.value)}
                className="w-full h-12 rounded-xl bg-foreground/5 border border-border text-foreground px-4"
              >
                {agentTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-card">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Model</label>
              <select
                value={agent.model || 'claude-sonnet-4-20250514'}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full h-12 rounded-xl bg-foreground/5 border border-border text-foreground px-4"
              >
                <option value="claude-sonnet-4-20250514" className="bg-card">Claude Sonnet 4</option>
                <option value="claude-3-5-sonnet-20241022" className="bg-card">Claude 3.5 Sonnet</option>
                <option value="claude-3-haiku-20240307" className="bg-card">Claude 3 Haiku (Fast)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="rounded-2xl border border-border bg-foreground/5 overflow-hidden">
          <button
            onClick={() => toggleSection('instructions')}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Instructions & Training
            </h2>
            {expandedSections.instructions ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          {expandedSections.instructions && (
            <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">System Prompt *</label>
                <Textarea
                  value={agent.system_prompt || ''}
                  onChange={(e) => updateField('system_prompt', e.target.value)}
                  placeholder="You are a helpful customer support agent..."
                  rows={6}
                  className="rounded-xl bg-foreground/5 border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">This is the main instruction that defines how the agent behaves.</p>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Personality</label>
                <Input
                  value={agent.personality || ''}
                  onChange={(e) => updateField('personality', e.target.value)}
                  placeholder="e.g., Friendly, professional, concise"
                  className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Greeting Message</label>
                <Textarea
                  value={agent.greeting_message || ''}
                  onChange={(e) => updateField('greeting_message', e.target.value)}
                  placeholder="Hi! How can I help you today?"
                  rows={2}
                  className="rounded-xl bg-foreground/5 border-border text-foreground"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Temperature ({agent.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.temperature || 0.7}
                    onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower = more focused, Higher = more creative</p>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Max Tokens</label>
                  <Input
                    type="number"
                    value={agent.max_tokens || 1024}
                    onChange={(e) => updateField('max_tokens', parseInt(e.target.value))}
                    className="h-12 rounded-xl bg-foreground/5 border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Capabilities Section */}
        <div className="rounded-2xl border border-border bg-foreground/5 overflow-hidden">
          <button
            onClick={() => toggleSection('capabilities')}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Capabilities
            </h2>
            {expandedSections.capabilities ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          {expandedSections.capabilities && (
            <div className="px-6 pb-6 border-t border-border pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: 'can_send_sms', label: 'Send SMS', icon: Phone, color: 'green' },
                  { key: 'can_send_email', label: 'Send Email', icon: Mail, color: 'blue' },
                  { key: 'can_access_customer_data', label: 'Access Customer Data', icon: ShieldCheck, color: 'purple' },
                  { key: 'can_access_order_data', label: 'Access Order Data', icon: Package, color: 'cyan' },
                  { key: 'can_create_orders', label: 'Create Orders', icon: Package, color: 'emerald' },
                  { key: 'can_modify_orders', label: 'Modify Orders', icon: Settings, color: 'amber' },
                  { key: 'can_issue_refunds', label: 'Issue Refunds', icon: CreditCard, color: 'red' },
                  { key: 'can_escalate_to_human', label: 'Escalate to Human', icon: ShieldCheck, color: 'indigo' },
                ].map(cap => {
                  const Icon = cap.icon
                  const isEnabled = agent[cap.key as keyof AIAgent] as boolean
                  return (
                    <button
                      key={cap.key}
                      onClick={() => updateField(cap.key as keyof AIAgent, !isEnabled)}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-left flex items-center gap-3",
                        isEnabled
                          ? `bg-${cap.color}-500/10 border-${cap.color}-500/30`
                          : "bg-foreground/5 border-border opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isEnabled ? `bg-${cap.color}-500/20` : "bg-foreground/10"
                      )}>
                        <Icon className={cn("w-5 h-5", isEnabled ? `text-${cap.color}-400` : "text-muted-foreground")} />
                      </div>
                      <span className={cn("font-medium", isEnabled ? "text-foreground" : "text-muted-foreground")}>
                        {cap.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Webhooks Section - Only for existing agents */}
        {!isNew && (
          <div className="rounded-2xl border border-border bg-foreground/5 overflow-hidden">
            <button
              onClick={() => toggleSection('webhooks')}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Webhooks & Triggers ({webhooks.length})
              </h2>
              {expandedSections.webhooks ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            
            {expandedSections.webhooks && (
              <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">Configure which events trigger this agent and what endpoints it listens to.</p>
                
                {/* Existing webhooks */}
                {webhooks.map(webhook => (
                  <div key={webhook.id} className="p-4 rounded-xl bg-foreground/5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          webhook.webhook_type === 'incoming' ? 'bg-green-500/20' :
                          webhook.webhook_type === 'outgoing' ? 'bg-blue-500/20' :
                          'bg-orange-500/20'
                        )}>
                          {webhook.webhook_type === 'incoming' ? (
                            <Link2 className="w-5 h-5 text-green-400" />
                          ) : webhook.webhook_type === 'outgoing' ? (
                            <Link2 className="w-5 h-5 text-blue-400" />
                          ) : (
                            <Zap className="w-5 h-5 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{webhook.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {webhook.webhook_type}
                            </Badge>
                            {webhook.trigger_event && (
                              <Badge variant="outline" className="text-xs bg-orange-500/10 border-orange-500/30 text-orange-400">
                                {webhook.trigger_event}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteWebhook(webhook.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {webhook.description && (
                      <p className="text-sm text-muted-foreground mb-3">{webhook.description}</p>
                    )}
                    
                    {/* Endpoint Path */}
                    {webhook.endpoint_path && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-foreground/5 border border-border">
                        <span className="text-xs text-muted-foreground">Endpoint:</span>
                        <code className="text-sm text-green-400 font-mono flex-1">{webhook.endpoint_path}</code>
                        <button
                          onClick={() => copyToClipboard(webhook.endpoint_path!, webhook.id)}
                          className="p-1.5 rounded hover:bg-foreground/10"
                        >
                          {copiedField === webhook.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Triggered: {webhook.trigger_count} times</span>
                      {webhook.last_triggered_at && (
                        <span>Last: {new Date(webhook.last_triggered_at).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {webhooks.length === 0 && !showNewWebhook && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No webhooks configured</p>
                  </div>
                )}

                {/* Add new webhook */}
                {showNewWebhook ? (
                  <div className="p-4 rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Webhook name"
                        className="h-10 rounded-lg bg-foreground/5 border-border text-foreground"
                      />
                      <select
                        value={newWebhook.webhook_type}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, webhook_type: e.target.value }))}
                        className="h-10 rounded-lg bg-foreground/5 border border-border text-foreground px-3"
                      >
                        <option value="trigger" className="bg-card">Event Trigger</option>
                        <option value="incoming" className="bg-card">Incoming Webhook</option>
                        <option value="outgoing" className="bg-card">Outgoing Webhook</option>
                      </select>
                    </div>
                    <Input
                      value={newWebhook.trigger_event}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, trigger_event: e.target.value }))}
                      placeholder="Trigger event (e.g., sms.incoming, order.created)"
                      className="h-10 rounded-lg bg-foreground/5 border-border text-foreground font-mono"
                    />
                    {newWebhook.webhook_type === 'incoming' && (
                      <Input
                        value={newWebhook.endpoint_path}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, endpoint_path: e.target.value }))}
                        placeholder="Endpoint path (e.g., /api/sms/incoming)"
                        className="h-10 rounded-lg bg-foreground/5 border-border text-foreground font-mono"
                      />
                    )}
                    <Input
                      value={newWebhook.description}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description (optional)"
                      className="h-10 rounded-lg bg-foreground/5 border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button onClick={addWebhook} className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="w-4 h-4 mr-1" /> Add Webhook
                      </Button>
                      <Button onClick={() => setShowNewWebhook(false)} variant="outline" className="rounded-lg border-border">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewWebhook(true)}
                    className="w-full p-4 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Webhook / Trigger
                  </button>
                )}
                
                {/* Available Events Reference */}
                <div className="mt-4 p-4 rounded-xl bg-foreground/[0.03] border border-border">
                  <h4 className="text-sm font-medium text-foreground/60 mb-2">Available Trigger Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {['sms.incoming', 'sms.outgoing', 'order.created', 'order.shipped', 'payment.pending', 'payment.received', 'customer.created'].map(event => (
                      <button
                        key={event}
                        onClick={() => setNewWebhook(prev => ({ ...prev, trigger_event: event }))}
                        className="px-2 py-1 text-xs rounded bg-foreground/5 text-muted-foreground hover:text-foreground hover:bg-foreground/10 font-mono"
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Section - Only for existing agents */}
        {!isNew && (
          <div className="rounded-2xl border border-border bg-foreground/5 overflow-hidden">
            <button
              onClick={() => toggleSection('resources')}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Resources ({agent.resources?.length || 0})
              </h2>
              {expandedSections.resources ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            
            {expandedSections.resources && (
              <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">Add documents, FAQs, policies, and other reference materials the agent can use.</p>
                
                {/* Existing resources */}
                {agent.resources?.map(resource => (
                  <div key={resource.id} className="p-4 rounded-xl bg-foreground/5 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{resource.title}</h4>
                        <Badge variant="outline" className="mt-1 text-xs">{resource.resource_type}</Badge>
                      </div>
                      <button
                        onClick={() => deleteResource(resource.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{resource.content}</p>
                  </div>
                ))}

                {/* Add new resource */}
                {showNewResource ? (
                  <div className="p-4 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        value={newResource.title}
                        onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Resource title"
                        className="h-10 rounded-lg bg-foreground/5 border-border text-foreground"
                      />
                      <select
                        value={newResource.resource_type}
                        onChange={(e) => setNewResource(prev => ({ ...prev, resource_type: e.target.value }))}
                        className="h-10 rounded-lg bg-foreground/5 border border-border text-foreground px-3"
                      >
                        {resourceTypes.map(type => (
                          <option key={type.value} value={type.value} className="bg-card">{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <Textarea
                      value={newResource.content}
                      onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Resource content..."
                      rows={4}
                      className="rounded-lg bg-foreground/5 border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button onClick={addResource} className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="w-4 h-4 mr-1" /> Add Resource
                      </Button>
                      <Button onClick={() => setShowNewResource(false)} variant="outline" className="rounded-lg border-border">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewResource(true)}
                    className="w-full p-4 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Resource
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Examples Section - Only for existing agents */}
        {!isNew && (
          <div className="rounded-2xl border border-border bg-foreground/5 overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Training Examples ({agent.examples?.length || 0})
              </h2>
              {expandedSections.examples ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            
            {expandedSections.examples && (
              <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">Add example conversations to help the agent learn ideal responses.</p>
                
                {/* Existing examples */}
                {agent.examples?.map(example => (
                  <div key={example.id} className="p-4 rounded-xl bg-foreground/5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">{example.category || 'General'}</Badge>
                      <button
                        onClick={() => deleteExample(example.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-foreground/5">
                        <p className="text-xs text-muted-foreground mb-1">Customer:</p>
                        <p className="text-sm text-foreground">{example.user_message}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-xs text-purple-400 mb-1">Ideal Response:</p>
                        <p className="text-sm text-foreground">{example.ideal_response}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new example */}
                {showNewExample ? (
                  <div className="p-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 space-y-3">
                    <Input
                      value={newExample.category}
                      onChange={(e) => setNewExample(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Category (e.g., Order Inquiry, Complaint)"
                      className="h-10 rounded-lg bg-foreground/5 border-border text-foreground"
                    />
                    <Textarea
                      value={newExample.user_message}
                      onChange={(e) => setNewExample(prev => ({ ...prev, user_message: e.target.value }))}
                      placeholder="Customer message..."
                      rows={2}
                      className="rounded-lg bg-foreground/5 border-border text-foreground"
                    />
                    <Textarea
                      value={newExample.ideal_response}
                      onChange={(e) => setNewExample(prev => ({ ...prev, ideal_response: e.target.value }))}
                      placeholder="Ideal agent response..."
                      rows={3}
                      className="rounded-lg bg-foreground/5 border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button onClick={addExample} className="rounded-lg bg-amber-500 hover:bg-amber-600 text-black">
                        <Plus className="w-4 h-4 mr-1" /> Add Example
                      </Button>
                      <Button onClick={() => setShowNewExample(false)} variant="outline" className="rounded-lg border-border">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewExample(true)}
                    className="w-full p-4 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Training Example
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Save Button - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                agent.is_active ? "bg-green-500" : "bg-foreground/30"
              )} />
              <span className="text-muted-foreground text-sm">
                {agent.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => updateField('is_active', !agent.is_active)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Toggle
              </button>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isNew ? 'Create Agent' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

