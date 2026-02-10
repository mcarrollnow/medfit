'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Plus,
  Settings,
  MessageSquare,
  Mail,
  Phone,
  Package,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  BookOpen,
  Brain,
  Zap,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  system_prompt: string
  personality: string | null
  can_send_sms: boolean
  can_send_email: boolean
  can_create_orders: boolean
  can_modify_orders: boolean
  can_issue_refunds: boolean
  can_escalate_to_human: boolean
  created_at: string
  resources: { count: number }[]
  examples: { count: number }[]
}

const agentTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  sms_support: { label: 'SMS Support', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <Phone className="w-4 h-4" /> },
  order_confirmation: { label: 'Order Confirmation', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Package className="w-4 h-4" /> },
  payment_collection: { label: 'Payment Collection', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <CreditCard className="w-4 h-4" /> },
  customer_support: { label: 'Customer Support', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <MessageSquare className="w-4 h-4" /> },
  sales: { label: 'Sales', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: <Sparkles className="w-4 h-4" /> },
  shipping: { label: 'Shipping', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: <Package className="w-4 h-4" /> },
  general: { label: 'General', color: 'bg-foreground/10 text-foreground/70 border-border', icon: <Bot className="w-4 h-4" /> },
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/ai-agents', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = async (agent: AIAgent) => {
    setTogglingId(agent.id)
    try {
      const response = await fetch(`/api/admin/ai-agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !agent.is_active }),
      })

      if (!response.ok) throw new Error('Failed to update agent')
      
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, is_active: !a.is_active } : a
      ))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading AI agents...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">AI Agents</h1>
                <p className="text-muted-foreground">Configure and train your AI assistants</p>
              </div>
            </div>
          </div>
          <Link href="/admin/ai-agents/new">
            <Button className="rounded-xl h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
              <Plus className="w-5 h-5 mr-2" />
              Create Agent
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-foreground/5 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{agents.length}</span>
            </div>
            <p className="text-muted-foreground text-sm">Total Agents</p>
          </div>
          <div className="p-4 rounded-2xl bg-foreground/5 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{agents.filter(a => a.is_active).length}</span>
            </div>
            <p className="text-muted-foreground text-sm">Active</p>
          </div>
          <div className="p-4 rounded-2xl bg-foreground/5 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {agents.reduce((sum, a) => sum + (a.resources?.[0]?.count || 0), 0)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Resources</p>
          </div>
          <div className="p-4 rounded-2xl bg-foreground/5 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">
                {agents.reduce((sum, a) => sum + (a.examples?.[0]?.count || 0), 0)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Examples</p>
          </div>
        </div>

        {/* Agents Grid */}
        {agents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-foreground/5 flex items-center justify-center">
              <Bot className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No AI agents yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first AI agent to automate customer communications, order confirmations, and payment collection.
            </p>
            <Link href="/admin/ai-agents/new">
              <Button className="rounded-xl h-12 px-8 bg-primary text-primary-foreground hover:bg-card/90">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Agent
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <AnimatePresence>
              {agents.map((agent, index) => {
                const typeConfig = agentTypeConfig[agent.agent_type] || agentTypeConfig.general
                const resourceCount = agent.resources?.[0]?.count || 0
                const exampleCount = agent.examples?.[0]?.count || 0

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/admin/ai-agents/${agent.id}`}>
                      <div className={cn(
                        "group p-6 rounded-2xl border transition-all duration-300",
                        "bg-foreground/5 border-border hover:border-border hover:bg-foreground/[0.08]",
                        !agent.is_active && "opacity-60"
                      )}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
                              agent.is_active 
                                ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30"
                                : "bg-foreground/10 border border-border"
                            )}>
                              {agent.avatar_url ? (
                                <img src={agent.avatar_url} alt="" className="w-10 h-10 rounded-lg" />
                              ) : (
                                <Bot className={cn("w-7 h-7", agent.is_active ? "text-purple-400" : "text-muted-foreground")} />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                                {agent.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn("border", typeConfig.color)}>
                                  {typeConfig.icon}
                                  <span className="ml-1">{typeConfig.label}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleAgent(agent)
                            }}
                            disabled={togglingId === agent.id}
                            className="p-2 rounded-xl hover:bg-foreground/10 transition-colors"
                          >
                            {togglingId === agent.id ? (
                              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : agent.is_active ? (
                              <ToggleRight className="w-8 h-8 text-green-400" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        {agent.description && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {agent.description}
                          </p>
                        )}

                        {/* Capabilities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {agent.can_send_sms && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                              <Phone className="w-3 h-3 inline mr-1" />SMS
                            </span>
                          )}
                          {agent.can_send_email && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Mail className="w-3 h-3 inline mr-1" />Email
                            </span>
                          )}
                          {agent.can_modify_orders && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Package className="w-3 h-3 inline mr-1" />Orders
                            </span>
                          )}
                          {agent.can_issue_refunds && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                              <CreditCard className="w-3 h-3 inline mr-1" />Refunds
                            </span>
                          )}
                          {agent.can_escalate_to_human && (
                            <span className="px-2 py-1 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              <ShieldCheck className="w-3 h-3 inline mr-1" />Escalate
                            </span>
                          )}
                        </div>

                        {/* Footer Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {resourceCount} resources
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {exampleCount} examples
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground/60 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

