"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, ChevronDown, ChevronUp, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AIDescriptionGeneratorProps {
  productName: string
  category?: string
  variants?: { variant: string }[] | string[]
  currentDescription?: string
  onGenerated: (description: string) => void
  displayColor?: string
}

export function AIDescriptionGenerator({
  productName,
  category,
  variants,
  currentDescription,
  onGenerated,
  displayColor = "#FFFFFF"
}: AIDescriptionGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [wordCount, setWordCount] = useState("")
  const [charCount, setCharCount] = useState("")
  const [keyHighlights, setKeyHighlights] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError("Product name is required")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedPreview(null)

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          variants,
          wordCount: wordCount ? parseInt(wordCount) : undefined,
          charCount: charCount ? parseInt(charCount) : undefined,
          keyHighlights: keyHighlights.trim() || undefined,
          existingDescription: currentDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate description")
      }

      setGeneratedPreview(data.description)
    } catch (err: any) {
      setError(err.message || "Failed to generate description")
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

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 transition-colors",
          isOpen ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: displayColor }} />
          <span className="text-sm font-medium text-white">AI Description Generator</span>
          <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/10">Claude Opus 4.5</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
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
            <div className="p-4 space-y-4 border-t border-white/10">
              {/* Optional Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Word Count <span className="text-white/30">(suggested: 80)</span>
                  </label>
                  <Input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="80"
                    className="rounded-lg bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Character Count <span className="text-white/30">(suggested: 600)</span>
                  </label>
                  <Input
                    type="number"
                    value={charCount}
                    onChange={(e) => setCharCount(e.target.value)}
                    placeholder="600"
                    className="rounded-lg bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-white/30">
                💡 Recommended: Keep descriptions under 80 words / 600 characters for optimal display
              </p>

              <div>
                <label className="block text-xs text-white/40 mb-1">
                  Key Points to Highlight <span className="text-white/30">(optional)</span>
                </label>
                <Textarea
                  value={keyHighlights}
                  onChange={(e) => setKeyHighlights(e.target.value)}
                  placeholder="e.g., High purity, lab-tested, fast shipping, research applications..."
                  className="rounded-lg bg-white/5 border-white/10 text-white min-h-[80px] text-sm"
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* Generated Preview */}
              {generatedPreview && (
                <div className="space-y-3">
                  <label className="block text-xs text-white/40">Generated Description</label>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{generatedPreview}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>{generatedPreview.split(/\s+/).length} words</span>
                    <span>•</span>
                    <span>{generatedPreview.length} characters</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!generatedPreview ? (
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !productName.trim()}
                    className="flex-1 rounded-lg h-10"
                    style={{ 
                      backgroundColor: displayColor,
                      color: "#000"
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Description
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleApply}
                      className="flex-1 rounded-lg h-10"
                      style={{ 
                        backgroundColor: displayColor,
                        color: "#000"
                      }}
                    >
                      Apply Description
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="rounded-lg h-10 border-white/20 text-white hover:bg-white/10"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Regenerate"
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

