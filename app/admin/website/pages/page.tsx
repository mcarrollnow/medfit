'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search, FileText, Sparkles, Save, Loader2, Plus, Trash2, X,
  Globe, Eye, EyeOff, Wand2, RefreshCw, ChevronRight, AlertCircle,
  CheckCircle2, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  getAllPageSeo,
  updatePageSeo,
  createPageSeo,
  deletePageSeo,
  generateAISeo,
  bulkGenerateAISeo,
  scanForNewPages,
  type PageSeo
} from '@/app/actions/page-seo'

export default function PageSeoManager() {
  const [pages, setPages] = useState<PageSeo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPage, setSelectedPage] = useState<PageSeo | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [newPagePath, setNewPagePath] = useState('')

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    const data = await getAllPageSeo()
    setPages(data)
    setLoading(false)
  }

  const filteredPages = pages.filter(page =>
    page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async () => {
    if (!selectedPage) return
    setSaving(true)

    const result = await updatePageSeo(selectedPage.id, {
      title: selectedPage.title,
      description: selectedPage.description,
      og_title: selectedPage.og_title,
      og_description: selectedPage.og_description,
      keywords: selectedPage.keywords,
      no_index: selectedPage.no_index,
      no_follow: selectedPage.no_follow,
      canonical_url: selectedPage.canonical_url,
    })

    if (result.success) {
      toast.success('Page saved successfully')
      loadPages()
    } else {
      toast.error(result.error || 'Failed to save')
    }
    setSaving(false)
  }

  const handleGenerateAI = async () => {
    if (!selectedPage) return
    setGenerating(true)

    const result = await generateAISeo(selectedPage.path)

    if (result.success) {
      setSelectedPage({
        ...selectedPage,
        title: result.title || selectedPage.title,
        description: result.description || selectedPage.description,
        keywords: result.keywords || selectedPage.keywords,
        ai_generated: true,
      })
      toast.success('AI generated SEO content!')
    } else {
      toast.error(result.error || 'AI generation failed')
    }
    setGenerating(false)
  }

  const handleBulkGenerate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Select pages first')
      return
    }
    setBulkGenerating(true)

    const result = await bulkGenerateAISeo(selectedIds)

    if (result.success) {
      toast.success(`Generated SEO for ${result.updated} pages`)
    } else {
      toast.error(`Updated ${result.updated} pages with ${result.errors.length} errors`)
    }

    setSelectedIds([])
    loadPages()
    setBulkGenerating(false)
  }

  const handleScan = async () => {
    setScanning(true)
    const result = await scanForNewPages()

    if (result.success) {
      if (result.added > 0) {
        toast.success(`Found ${result.added} new pages`)
      } else {
        toast.info('No new pages found')
      }
      loadPages()
    } else {
      toast.error(result.error || 'Scan failed')
    }
    setScanning(false)
  }

  const handleCreatePage = async () => {
    if (!newPagePath.trim()) {
      toast.error('Enter a page path')
      return
    }

    const path = newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`
    const result = await createPageSeo(path, {})

    if (result.success) {
      toast.success('Page added')
      setNewPagePath('')
      setShowNewPageForm(false)
      loadPages()
    } else {
      toast.error(result.error || 'Failed to add page')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page SEO entry?')) return

    const result = await deletePageSeo(id)
    if (result.success) {
      toast.success('Page deleted')
      if (selectedPage?.id === id) setSelectedPage(null)
      loadPages()
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPages.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
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
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/website"
                className="h-10 w-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition"
              >
                <ArrowLeft className="h-5 w-5 text-foreground/70" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Page SEO Manager</h1>
                <p className="text-lg text-muted-foreground">Manage titles and descriptions for all pages</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleScan}
              disabled={scanning}
              variant="outline"
              className="h-10 px-4 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Scan Pages
            </Button>
            <Button
              onClick={() => setShowNewPageForm(true)}
              className="h-10 px-4 rounded-xl bg-foreground/10 text-foreground hover:bg-foreground/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl bg-purple-500/20 border border-purple-500/30 p-4 flex items-center justify-between"
            >
              <span className="text-foreground font-medium">
                {selectedIds.length} page{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBulkGenerate}
                  disabled={bulkGenerating}
                  className="h-10 px-4 rounded-xl bg-purple-500 text-white hover:bg-purple-600"
                >
                  {bulkGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate AI SEO for Selected
                </Button>
                <Button
                  onClick={() => setSelectedIds([])}
                  variant="ghost"
                  className="h-10 px-4 text-foreground/70 hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="h-12 pl-12 bg-foreground/5 border-border text-foreground rounded-xl"
              />
            </div>

            {/* Select All */}
            <div className="flex items-center gap-3 px-2">
              <Checkbox
                checked={selectedIds.length === filteredPages.length && filteredPages.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select all ({filteredPages.length} pages)</span>
            </div>

            {/* Page List */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 p-4 border-b border-border hover:bg-foreground/5 cursor-pointer transition ${
                      selectedPage?.id === page.id ? 'bg-foreground/10' : ''
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.includes(page.id)}
                      onCheckedChange={() => toggleSelect(page.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => setSelectedPage(page)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground font-medium truncate">{page.path}</span>
                        {page.ai_generated && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">AI</span>
                        )}
                        {page.no_index && (
                          <EyeOff className="h-3 w-3 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {page.title || 'No title set'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}

                {filteredPages.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No pages found
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Edit Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {selectedPage ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{selectedPage.path}</h2>
                        <p className="text-sm text-muted-foreground">Edit SEO settings</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(selectedPage.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* AI Generate Button */}
                  <Button
                    onClick={handleGenerateAI}
                    disabled={generating}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Generate with AI
                  </Button>

                  {/* Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-foreground/70">Page Title</Label>
                      <span className="text-xs text-muted-foreground">{selectedPage.title?.length || 0}/60</span>
                    </div>
                    <Input
                      value={selectedPage.title || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      placeholder="Enter page title"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-foreground/70">Meta Description</Label>
                      <span className="text-xs text-muted-foreground">{selectedPage.description?.length || 0}/160</span>
                    </div>
                    <Textarea
                      value={selectedPage.description || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, description: e.target.value })}
                      placeholder="Enter meta description"
                      rows={3}
                      className="bg-foreground/5 border-border text-foreground rounded-xl resize-none"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/70">Keywords</Label>
                    <Input
                      value={selectedPage.keywords || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                    />
                  </div>

                  {/* OG Title */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/70">OG Title (Social)</Label>
                    <Input
                      value={selectedPage.og_title || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_title: e.target.value })}
                      placeholder="Leave blank to use page title"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                    />
                  </div>

                  {/* OG Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/70">OG Description (Social)</Label>
                    <Textarea
                      value={selectedPage.og_description || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, og_description: e.target.value })}
                      placeholder="Leave blank to use meta description"
                      rows={2}
                      className="bg-foreground/5 border-border text-foreground rounded-xl resize-none"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/70">Canonical URL</Label>
                    <Input
                      value={selectedPage.canonical_url || ''}
                      onChange={(e) => setSelectedPage({ ...selectedPage, canonical_url: e.target.value })}
                      placeholder="https://..."
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                    />
                  </div>

                  {/* Robots */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                      <div>
                        <Label className="text-foreground font-medium">No Index</Label>
                        <p className="text-xs text-muted-foreground">Hide from search</p>
                      </div>
                      <Switch
                        checked={selectedPage.no_index}
                        onCheckedChange={(checked) => setSelectedPage({ ...selectedPage, no_index: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                      <div>
                        <Label className="text-foreground font-medium">No Follow</Label>
                        <p className="text-xs text-muted-foreground">Don't follow links</p>
                      </div>
                      <Switch
                        checked={selectedPage.no_follow}
                        onCheckedChange={(checked) => setSelectedPage({ ...selectedPage, no_follow: checked })}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>

                  {/* Last AI Update */}
                  {selectedPage.ai_generated && selectedPage.last_ai_update && (
                    <p className="text-xs text-center text-muted-foreground">
                      AI generated: {new Date(selectedPage.last_ai_update).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a page to edit</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* New Page Modal */}
        <AnimatePresence>
          {showNewPageForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
              onClick={() => setShowNewPageForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Add New Page</h3>
                  <button
                    onClick={() => setShowNewPageForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/70">Page Path</Label>
                    <Input
                      value={newPagePath}
                      onChange={(e) => setNewPagePath(e.target.value)}
                      placeholder="/example-page"
                      className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleCreatePage}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

