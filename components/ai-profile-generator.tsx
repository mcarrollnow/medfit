"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, ChevronDown, ChevronUp, Wand2, Check, RefreshCw, Settings2, Zap, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
}

interface Rating {
  label: string
  value: number
}

interface GeneratedProfile {
  categoryId: string | null
  categoryName: string | null
  ratings: Rating[]
  description: string
  cartDescription: string
}

interface AIProfileGeneratorProps {
  productName: string
  variants?: { variant: string }[] | string[]
  categories: Category[]
  currentCategoryId?: string | null
  currentDescription?: string
  currentCartDescription?: string
  currentRatings?: Rating[]
  displayColor?: string
  onGenerated: (profile: GeneratedProfile) => void
  hasExistingContent?: boolean
}

type GenerateMode = 'selective' | 'missing' | 'full'
type FieldKey = 'category' | 'ratings' | 'description' | 'cartDescription'

export function AIProfileGenerator({
  productName,
  variants,
  categories,
  currentCategoryId,
  currentDescription,
  currentCartDescription,
  currentRatings,
  displayColor = "#6366f1",
  onGenerated,
  hasExistingContent = false
}: AIProfileGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPreview, setGeneratedPreview] = useState<GeneratedProfile | null>(null)
  const [selectedMode, setSelectedMode] = useState<GenerateMode>(hasExistingContent ? 'missing' : 'full')
  const [selectedFields, setSelectedFields] = useState<FieldKey[]>(['category', 'ratings', 'description', 'cartDescription'])

  // Check what's missing
  const hasMissingFields = {
    category: !currentCategoryId,
    ratings: !currentRatings || currentRatings.length === 0 || 
      (currentRatings.length === 1 && currentRatings[0].label === 'Quality' && currentRatings[0].value === 8.5),
    description: !currentDescription || currentDescription.trim() === '',
    cartDescription: !currentCartDescription || currentCartDescription.trim() === ''
  }
  
  const missingFieldCount = Object.values(hasMissingFields).filter(Boolean).length

  const toggleField = (field: FieldKey) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError("Product name is required")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedPreview(null)

    try {
      const response = await fetch("/api/ai/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          variants,
          categories,
          currentDescription,
          currentCartDescription,
          currentRatings,
          currentCategoryId,
          fieldsToGenerate: selectedMode === 'selective' ? selectedFields : undefined,
          generateMode: selectedMode
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate profile")
      }

      setGeneratedPreview(data.profile)
    } catch (err: any) {
      setError(err.message || "Failed to generate profile")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApply = () => {
    if (generatedPreview) {
      onGenerated(generatedPreview)
      setGeneratedPreview(null)
      setIsOpen(false)
    }
  }

  const handleRegenerate = () => {
    setGeneratedPreview(null)
    handleGenerate()
  }

  const modeOptions = [
    {
      value: 'full' as GenerateMode,
      icon: RefreshCw,
      label: 'Generate Full Profile',
      description: 'Generate everything fresh',
      color: 'text-purple-400'
    },
    {
      value: 'missing' as GenerateMode,
      icon: Zap,
      label: "Generate What's Missing",
      description: missingFieldCount > 0 ? `${missingFieldCount} field${missingFieldCount !== 1 ? 's' : ''} missing` : 'All fields complete',
      color: 'text-yellow-400',
      disabled: missingFieldCount === 0
    },
    {
      value: 'selective' as GenerateMode,
      icon: Settings2,
      label: 'Select Fields to Generate',
      description: 'Choose specific fields',
      color: 'text-blue-400'
    }
  ]

  const fieldOptions: { key: FieldKey; label: string }[] = [
    { key: 'category', label: 'Category' },
    { key: 'ratings', label: 'Efficacy Ratings' },
    { key: 'description', label: 'Product Description' },
    { key: 'cartDescription', label: 'Cart Preview Text' }
  ]

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-6 py-4 transition-colors",
          isOpen ? "bg-foreground/10" : "hover:bg-foreground/5"
        )}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${displayColor}20` }}
          >
            <Sparkles className="h-5 w-5" style={{ color: displayColor }} />
          </div>
          <div className="text-left">
            <span className="text-base font-semibold text-foreground block">AI Profile Generator</span>
            <span className="text-xs text-muted-foreground">
              {missingFieldCount > 0 
                ? `${missingFieldCount} field${missingFieldCount !== 1 ? 's' : ''} missing content`
                : 'All fields have content'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-foreground/5 border border-border">
            Claude Opus 4.5
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6 border-t border-border">
              {/* Mode Selection */}
              {!generatedPreview && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground/60">Generation Mode</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {modeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => !option.disabled && setSelectedMode(option.value)}
                          disabled={option.disabled}
                          className={cn(
                            "p-4 rounded-xl border text-left transition-all",
                            selectedMode === option.value
                              ? "border-border bg-foreground/10"
                              : option.disabled
                                ? "border-border bg-foreground/[0.03] opacity-50 cursor-not-allowed"
                                : "border-border bg-foreground/5 hover:border-border hover:bg-card/[0.07]"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <option.icon className={cn("h-4 w-4", option.color)} />
                            <span className="text-sm font-medium text-foreground">{option.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field Selection (only for selective mode) */}
                  <AnimatePresence>
                    {selectedMode === 'selective' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="block text-sm font-medium text-foreground/60">Select Fields to Generate</label>
                        <div className="grid grid-cols-2 gap-2">
                          {fieldOptions.map((field) => (
                            <button
                              key={field.key}
                              type="button"
                              onClick={() => toggleField(field.key)}
                              className={cn(
                                "p-3 rounded-xl border text-left transition-all flex items-center gap-3",
                                selectedFields.includes(field.key)
                                  ? "border-border bg-foreground/10"
                                  : "border-border bg-foreground/5 hover:border-border"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                selectedFields.includes(field.key)
                                  ? "border-border bg-foreground/20"
                                  : "border-border bg-transparent"
                              )}>
                                {selectedFields.includes(field.key) && (
                                  <Check className="h-3 w-3 text-foreground" />
                                )}
                              </div>
                              <div>
                                <span className="text-sm text-foreground">{field.label}</span>
                                {hasMissingFields[field.key] && (
                                  <span className="ml-2 text-[10px] text-yellow-400/80 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                                    missing
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Generated Preview */}
              {generatedPreview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/60">
                    <ListChecks className="h-4 w-4" />
                    Generated Profile Preview
                  </div>
                  
                  <div className="space-y-3">
                    {/* Category */}
                    <div className="rounded-xl bg-foreground/5 border border-border p-4">
                      <label className="text-xs text-muted-foreground block mb-1">Category</label>
                      <p className="text-sm text-foreground">
                        {generatedPreview.categoryName || 'No Category'}
                      </p>
                    </div>

                    {/* Ratings */}
                    <div className="rounded-xl bg-foreground/5 border border-border p-4">
                      <label className="text-xs text-muted-foreground block mb-2">Efficacy Ratings</label>
                      <div className="space-y-2">
                        {generatedPreview.ratings.map((rating, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-foreground/80">{rating.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${(rating.value / 10) * 100}%`,
                                    backgroundColor: displayColor 
                                  }}
                                />
                              </div>
                              <span className="text-xs font-mono" style={{ color: displayColor }}>
                                {rating.value.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-xl bg-foreground/5 border border-border p-4">
                      <label className="text-xs text-muted-foreground block mb-1">Product Description</label>
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{generatedPreview.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{generatedPreview.description.split(/\s+/).filter(Boolean).length} words</span>
                        <span>•</span>
                        <span>{generatedPreview.description.length} chars</span>
                      </div>
                    </div>

                    {/* Cart Description */}
                    <div className="rounded-xl bg-foreground/5 border border-border p-4">
                      <label className="text-xs text-muted-foreground block mb-1">Cart Preview Text</label>
                      <p className="text-sm text-foreground/80">{generatedPreview.cartDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!generatedPreview ? (
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !productName.trim() || (selectedMode === 'selective' && selectedFields.length === 0)}
                    className="flex-1 rounded-xl h-12 text-base font-medium"
                    style={{ 
                      backgroundColor: displayColor,
                      color: "#000"
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Profile...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-2" />
                        {selectedMode === 'full' ? 'Generate Full Profile' : 
                         selectedMode === 'missing' ? "Generate What's Missing" :
                         `Generate ${selectedFields.length} Field${selectedFields.length !== 1 ? 's' : ''}`}
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleApply}
                      className="flex-1 rounded-xl h-12 text-base font-medium"
                      style={{ 
                        backgroundColor: displayColor,
                        color: "#000"
                      }}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Apply Profile
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="rounded-xl h-12 px-6 border-border text-foreground hover:bg-foreground/10"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-5 w-5" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
