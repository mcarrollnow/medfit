"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, X, Check, AlertCircle, Wand2 } from "lucide-react"
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

interface Product {
  base_name: string
  category_id: string | null
  description: string | null
  cart_product_detail: string | null
  ratings?: Rating[]
  variants: { variant: string }[]
}

interface GeneratedProfile {
  categoryId: string | null
  categoryName: string | null
  ratings: Rating[]
  description: string
  cartDescription: string
}

interface BulkProfileGeneratorProps {
  products: Product[]
  categories: Category[]
  onProfileGenerated: (baseName: string, profile: GeneratedProfile) => Promise<void>
  onClose: () => void
  selectedProductNames?: Set<string>  // If provided, only generate for these products
  mode?: 'missing' | 'full'  // 'missing' = only generate missing fields, 'full' = regenerate everything
}

interface ProductStatus {
  baseName: string
  status: 'pending' | 'generating' | 'success' | 'error'
  error?: string
  profile?: GeneratedProfile
}

export function BulkProfileGenerator({
  products,
  categories,
  onProfileGenerated,
  onClose,
  selectedProductNames,
  mode = 'missing'
}: BulkProfileGeneratorProps) {
  // If specific products are selected, use those; otherwise filter by missing content
  const productsToProcess = selectedProductNames && selectedProductNames.size > 0
    ? products.filter(p => selectedProductNames.has(p.base_name))
    : products.filter(p => {
        const needsCategory = !p.category_id
        const needsRatings = !p.ratings || p.ratings.length === 0 || 
          (p.ratings.length === 1 && p.ratings[0].label === 'Quality')
        const needsDescription = !p.description || p.description.trim() === ''
        const needsCartDescription = !p.cart_product_detail || p.cart_product_detail.trim() === ''
        return needsCategory || needsRatings || needsDescription || needsCartDescription
      })

  const [isGenerating, setIsGenerating] = useState(false)
  const [productStatuses, setProductStatuses] = useState<ProductStatus[]>(
    productsToProcess.map(p => ({
      baseName: p.base_name,
      status: 'pending'
    }))
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  const successCount = productStatuses.filter(p => p.status === 'success').length
  const errorCount = productStatuses.filter(p => p.status === 'error').length
  
  const isFullMode = mode === 'full'
  const hasSelection = selectedProductNames && selectedProductNames.size > 0

  const generateAllProfiles = async () => {
    setIsGenerating(true)
    setCurrentIndex(0)
    
    for (let i = 0; i < productsToProcess.length; i++) {
      const product = productsToProcess[i]
      setCurrentIndex(i)
      
      // Update status to generating
      setProductStatuses(prev => prev.map((p, idx) => 
        idx === i ? { ...p, status: 'generating' } : p
      ))

      try {
        const response = await fetch("/api/ai/generate-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: product.base_name,
            variants: product.variants,
            categories,
            currentDescription: product.description || undefined,
            currentCartDescription: product.cart_product_detail || undefined,
            currentRatings: product.ratings,
            currentCategoryId: product.category_id,
            generateMode: mode // Use the mode passed in
          }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate profile")
        }

        // Save the profile
        await onProfileGenerated(product.base_name, data.profile)

        // Update status to success
        setProductStatuses(prev => prev.map((p, idx) => 
          idx === i ? { ...p, status: 'success', profile: data.profile } : p
        ))

      } catch (err: any) {
        // Update status to error
        setProductStatuses(prev => prev.map((p, idx) => 
          idx === i ? { ...p, status: 'error', error: err.message } : p
        ))
      }

      // Small delay between requests to avoid rate limiting
      if (i < productsToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    setIsGenerating(false)
    setCompleted(true)
  }

  if (productsToProcess.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg mx-4 rounded-2xl bg-[#0a0a0a] border border-white/10 p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Products Complete</h2>
            <p className="text-white/50 mb-6">All products already have complete profiles.</p>
            <Button
              onClick={onClose}
              className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-8"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-4 rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isFullMode ? 'Generate Full Profiles' : 'Bulk Profile Generator'}
              </h2>
              <p className="text-sm text-white/50">
                {hasSelection 
                  ? `${productsToProcess.length} selected product${productsToProcess.length !== 1 ? 's' : ''}`
                  : `${productsToProcess.length} product${productsToProcess.length !== 1 ? 's' : ''} need updates`
                }
                {isFullMode && ' — will regenerate all fields'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!isGenerating && !completed && (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                {isFullMode 
                  ? 'This will generate NEW profiles for all selected products, replacing existing content:'
                  : 'This will generate missing profile content (category, ratings, description, cart text) for the following products:'
                }
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {productsToProcess.map((product) => {
                  const missing = []
                  if (!product.category_id) missing.push('Category')
                  if (!product.ratings || product.ratings.length === 0 || 
                      (product.ratings.length === 1 && product.ratings[0].label === 'Quality')) missing.push('Ratings')
                  if (!product.description || product.description.trim() === '') missing.push('Description')
                  if (!product.cart_product_detail || product.cart_product_detail.trim() === '') missing.push('Cart Text')
                  
                  return (
                    <div
                      key={product.base_name}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="text-sm text-white font-medium">{product.base_name}</span>
                      <span className="text-xs text-white/40">
                        {isFullMode ? 'Full regeneration' : (missing.length > 0 ? missing.join(', ') : 'Complete')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(isGenerating || completed) && (
            <div className="space-y-3">
              {/* Progress bar */}
              {isGenerating && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white/60">{currentIndex + 1} / {productsToProcess.length}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / productsToProcess.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {productStatuses.map((status, idx) => (
                  <div
                    key={status.baseName}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      status.status === 'generating' && "bg-purple-500/10 border-purple-500/30",
                      status.status === 'success' && "bg-green-500/10 border-green-500/30",
                      status.status === 'error' && "bg-red-500/10 border-red-500/30",
                      status.status === 'pending' && "bg-white/5 border-white/10"
                    )}
                  >
                    <span className="text-sm text-white font-medium">{status.baseName}</span>
                    <div className="flex items-center gap-2">
                      {status.status === 'pending' && (
                        <span className="text-xs text-white/40">Waiting...</span>
                      )}
                      {status.status === 'generating' && (
                        <>
                          <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                          <span className="text-xs text-purple-400">Generating...</span>
                        </>
                      )}
                      {status.status === 'success' && (
                        <>
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-xs text-green-400">Complete</span>
                        </>
                      )}
                      {status.status === 'error' && (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <span className="text-xs text-red-400">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {completed && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Completed:</span>
                    <span className="text-green-400 font-medium">{successCount} successful</span>
                  </div>
                  {errorCount > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/60">Failed:</span>
                      <span className="text-red-400 font-medium">{errorCount} errors</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          {!isGenerating && !completed && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-white/20 text-white hover:bg-white/10 h-12 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={generateAllProfiles}
                className="rounded-xl bg-purple-500 text-white hover:bg-purple-600 h-12 px-6"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isFullMode ? 'Regenerate' : 'Generate'} {productsToProcess.length} Profile{productsToProcess.length !== 1 ? 's' : ''}
              </Button>
            </>
          )}
          {isGenerating && (
            <Button
              disabled
              className="rounded-xl bg-white/10 text-white h-12 px-6"
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </Button>
          )}
          {completed && (
            <Button
              onClick={onClose}
              className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6"
            >
              Done
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
