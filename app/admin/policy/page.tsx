'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Lock, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  ExternalLink,
  Calendar,
  Mail,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { 
  getPolicies, 
  updatePolicy, 
  Policy, 
  PolicySection 
} from '@/app/actions/policies'

const iconMap: Record<string, any> = {
  Shield,
  Lock,
  FileText,
}

export default function AdminPolicyPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    setLoading(true)
    try {
      const result = await getPolicies()
      if (result.error) throw new Error(result.error)
      setPolicies(result.data || [])
      if (result.data && result.data.length > 0 && !selectedPolicy) {
        setSelectedPolicy(result.data[0])
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load policies')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedPolicy) return
    
    setSaving(true)
    try {
      const result = await updatePolicy(selectedPolicy.id, {
        title: selectedPolicy.title,
        subtitle: selectedPolicy.subtitle,
        hero_tagline: selectedPolicy.hero_tagline,
        effective_date: selectedPolicy.effective_date,
        contact_email: selectedPolicy.contact_email,
        content: selectedPolicy.content,
        is_published: selectedPolicy.is_published,
      })
      
      if (!result.success) throw new Error(result.error || 'Failed to save')
      
      toast.success('Policy saved successfully!')
      setHasChanges(false)
      fetchPolicies()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save policy')
    } finally {
      setSaving(false)
    }
  }

  const updateSelectedPolicy = (updates: Partial<Policy>) => {
    if (!selectedPolicy) return
    setSelectedPolicy({ ...selectedPolicy, ...updates })
    setHasChanges(true)
  }

  const updateSection = (sectionId: string, updates: Partial<PolicySection>) => {
    if (!selectedPolicy) return
    const newContent = selectedPolicy.content.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    )
    updateSelectedPolicy({ content: newContent })
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const togglePublished = () => {
    if (!selectedPolicy) return
    updateSelectedPolicy({ is_published: !selectedPolicy.is_published })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="h-10 w-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition"
            >
              <ArrowLeft className="h-5 w-5 text-foreground/70" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Policy Editor</h1>
              <p className="text-lg text-muted-foreground">Manage your legal and compliance documents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedPolicy && (
              <a
                href={`/${selectedPolicy.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-xl border border-border bg-foreground/5 text-foreground hover:bg-foreground/10 transition flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Preview
              </a>
            )}
            <Button
              onClick={fetchPolicies}
              variant="outline"
              className="h-10 px-4 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Policy Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Policies</h2>
                <div className="space-y-2">
                  {policies.map((policy) => {
                    const Icon = policy.slug === 'privacy' ? Shield : Lock
                    return (
                      <button
                        key={policy.id}
                        onClick={() => {
                          if (hasChanges) {
                            if (confirm('You have unsaved changes. Switch anyway?')) {
                              setSelectedPolicy(policy)
                              setHasChanges(false)
                            }
                          } else {
                            setSelectedPolicy(policy)
                          }
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all duration-200",
                          selectedPolicy?.id === policy.id
                            ? "bg-foreground/10 border-border"
                            : "bg-foreground/5 border-border hover:bg-foreground/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            selectedPolicy?.id === policy.id ? "bg-foreground/20" : "bg-foreground/10"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{policy.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{policy.subtitle}</p>
                          </div>
                          {policy.is_published ? (
                            <Eye className="h-4 w-4 text-green-400 shrink-0" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {selectedPolicy ? (
              <>
                {/* Basic Info */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
                          <p className="text-sm text-muted-foreground">Page title, subtitle, and metadata</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Published</span>
                        <Switch 
                          checked={selectedPolicy.is_published} 
                          onCheckedChange={togglePublished}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Title</Label>
                        <Input
                          value={selectedPolicy.title}
                          onChange={(e) => updateSelectedPolicy({ title: e.target.value })}
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Subtitle</Label>
                        <Input
                          value={selectedPolicy.subtitle || ''}
                          onChange={(e) => updateSelectedPolicy({ subtitle: e.target.value })}
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Hero Tagline</Label>
                        <Input
                          value={selectedPolicy.hero_tagline || ''}
                          onChange={(e) => updateSelectedPolicy({ hero_tagline: e.target.value })}
                          placeholder="Displayed above the title"
                          className="h-12 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Contact Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            value={selectedPolicy.contact_email || ''}
                            onChange={(e) => updateSelectedPolicy({ contact_email: e.target.value })}
                            className="h-12 pl-11 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Effective Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            value={selectedPolicy.effective_date?.split('T')[0] || ''}
                            onChange={(e) => updateSelectedPolicy({ effective_date: e.target.value })}
                            className="h-12 pl-11 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/70">Last Updated</Label>
                        <div className="h-12 px-4 bg-foreground/5 border border-border rounded-xl flex items-center text-muted-foreground">
                          {new Date(selectedPolicy.last_updated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Content Sections</h2>
                        <p className="text-sm text-muted-foreground">{selectedPolicy.content.length} sections</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedPolicy.content.map((section, index) => (
                        <div
                          key={section.id}
                          className="border border-border rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center gap-3 p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors text-left"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{section.title || `Section ${index + 1}`}</p>
                              <p className="text-xs text-muted-foreground">Type: {section.type}</p>
                            </div>
                            {expandedSections.has(section.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          
                          {expandedSections.has(section.id) && (
                            <div className="p-4 space-y-4 border-t border-border">
                              <div className="space-y-3">
                                <Label className="text-sm font-medium text-foreground/70">Section Title</Label>
                                <Input
                                  value={section.title || ''}
                                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  className="h-10 bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                                />
                              </div>
                              
                              {section.intro && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Introduction</Label>
                                  <Textarea
                                    value={section.intro || ''}
                                    onChange={(e) => updateSection(section.id, { intro: e.target.value })}
                                    className="min-h-[80px] bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                                  />
                                </div>
                              )}
                              
                              {section.content && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Content</Label>
                                  <Textarea
                                    value={section.content || ''}
                                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                    className="min-h-[120px] bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                                  />
                                </div>
                              )}
                              
                              {section.extra && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Additional Text</Label>
                                  <Textarea
                                    value={section.extra || ''}
                                    onChange={(e) => updateSection(section.id, { extra: e.target.value })}
                                    className="min-h-[80px] bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                                  />
                                </div>
                              )}

                              {section.footer && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Footer Note</Label>
                                  <Textarea
                                    value={section.footer || ''}
                                    onChange={(e) => updateSection(section.id, { footer: e.target.value })}
                                    className="min-h-[60px] bg-foreground/5 border-border text-foreground rounded-xl focus:border-border"
                                  />
                                </div>
                              )}

                              {/* Items editor for list-based sections */}
                              {section.items && Array.isArray(section.items) && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Items ({section.items.length})</Label>
                                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {section.items.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="p-3 bg-foreground/5 rounded-lg border border-border space-y-2">
                                        {item.label && (
                                          <Input
                                            value={item.label}
                                            onChange={(e) => {
                                              const newItems = [...section.items!]
                                              newItems[itemIndex] = { ...item, label: e.target.value }
                                              updateSection(section.id, { items: newItems })
                                            }}
                                            placeholder="Label"
                                            className="h-9 bg-foreground/5 border-border text-foreground rounded-lg text-sm"
                                          />
                                        )}
                                        {item.title && !item.label && (
                                          <Input
                                            value={item.title}
                                            onChange={(e) => {
                                              const newItems = [...section.items!]
                                              newItems[itemIndex] = { ...item, title: e.target.value }
                                              updateSection(section.id, { items: newItems })
                                            }}
                                            placeholder="Title"
                                            className="h-9 bg-foreground/5 border-border text-foreground rounded-lg text-sm"
                                          />
                                        )}
                                        {item.text && (
                                          <Textarea
                                            value={item.text}
                                            onChange={(e) => {
                                              const newItems = [...section.items!]
                                              newItems[itemIndex] = { ...item, text: e.target.value }
                                              updateSection(section.id, { items: newItems })
                                            }}
                                            placeholder="Description"
                                            className="min-h-[60px] bg-foreground/5 border-border text-foreground rounded-lg text-sm"
                                          />
                                        )}
                                        {typeof item === 'string' && (
                                          <Input
                                            value={item}
                                            onChange={(e) => {
                                              const newItems = [...section.items!]
                                              newItems[itemIndex] = e.target.value
                                              updateSection(section.id, { items: newItems })
                                            }}
                                            className="h-9 bg-foreground/5 border-border text-foreground rounded-lg text-sm"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Columns editor for two-column sections */}
                              {section.columns && Array.isArray(section.columns) && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground/70">Columns</Label>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {section.columns.map((column: any, colIndex: number) => (
                                      <div key={colIndex} className="p-3 bg-foreground/5 rounded-lg border border-border space-y-2">
                                        <Input
                                          value={column.title || ''}
                                          onChange={(e) => {
                                            const newColumns = [...section.columns!]
                                            newColumns[colIndex] = { ...column, title: e.target.value }
                                            updateSection(section.id, { columns: newColumns })
                                          }}
                                          placeholder="Column Title"
                                          className="h-9 bg-foreground/5 border-border text-foreground rounded-lg text-sm font-medium"
                                        />
                                        {column.items && column.items.map((item: string, itemIndex: number) => (
                                          <Input
                                            key={itemIndex}
                                            value={item}
                                            onChange={(e) => {
                                              const newColumns = [...section.columns!]
                                              const newItems = [...column.items]
                                              newItems[itemIndex] = e.target.value
                                              newColumns[colIndex] = { ...column, items: newItems }
                                              updateSection(section.id, { columns: newColumns })
                                            }}
                                            className="h-8 bg-foreground/5 border-border text-foreground rounded-lg text-xs"
                                          />
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Tip: Expand sections to edit their content. Changes are saved when you click "Save Changes".
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-12 text-center">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a policy to edit</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
