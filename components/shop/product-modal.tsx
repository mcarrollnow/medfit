'use client'

import { useState } from "react"
import { Product } from "@/types/shop"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shop/ui/dialog"
import { Button } from "@/components/shop/ui/button"
import { Badge } from "@/components/shop/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/shop/ui/radio-group"
import { Label } from "@/components/shop/ui/label"
import { Check, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface GroupedProduct {
  base_name: string
  variants: Product[]
  lowestPrice: number
  category: string
  color: string
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  groupedProduct: GroupedProduct
}

export function ProductModal({ isOpen, onClose, groupedProduct }: ProductModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(groupedProduct.variants[0].barcode)
  const { addItem } = useCartStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const selectedVariant = groupedProduct.variants.find(v => v.barcode === selectedVariantId)

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    setIsLoading(true)
    try {
      await addItem(selectedVariant, 1)
      toast.success(`Added ${selectedVariant.name} to cart`)
      onClose()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) return
    
    setIsLoading(true)
    try {
      await addItem(selectedVariant, 1)
      onClose()
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const getProductRatings = (productName: string) => {
    const ratingsMap: Record<string, { label: string; value: number; description: string }[]> = {
      Adipotide: [
        { label: "Weight Loss Efficacy", value: 8.5, description: "Highly effective for targeted fat reduction" },
        { label: "Fat Reduction", value: 8.8, description: "Superior adipocyte apoptosis induction" },
        { label: "Metabolic Health", value: 6.2, description: "Moderate metabolic improvements" },
      ],
      "AOD-9604": [
        { label: "Weight Loss Efficacy", value: 5.8, description: "Moderate weight management support" },
        { label: "Fat Reduction", value: 6.4, description: "Targeted lipolytic activity" },
        { label: "Metabolic Health", value: 5.5, description: "Some metabolic benefits observed" },
      ],
      "BPC-157": [
        { label: "Tissue Repair", value: 8.7, description: "Exceptional healing acceleration" },
        { label: "Inflammation Reduction", value: 8.2, description: "Strong anti-inflammatory effects" },
        { label: "Recovery Speed", value: 8.5, description: "Rapid recovery enhancement" },
      ],
    }
    return ratingsMap[productName] || []
  }

  // Use database ratings if available, otherwise fall back to hardcoded
  const ratings = (groupedProduct.ratings && groupedProduct.ratings.length > 0)
    ? groupedProduct.ratings
    : getProductRatings(groupedProduct.base_name)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-background border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {groupedProduct.base_name}
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            Premium research compound • ≥99% pure • Third-party tested
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Product Hero */}
          <div className="relative h-48 rounded-lg bg-gradient-to-br from-zinc-900 to-background p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 rounded-lg" />
            <div className="relative flex h-full items-center justify-center">
              <div 
                className={`h-32 w-32 rounded-full bg-gradient-to-br ${groupedProduct.color || 'from-purple-600 to-blue-600'} p-[2px]`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                  <span className="text-3xl font-bold text-foreground">
                    {groupedProduct.base_name.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          {ratings.length > 0 && (
            <div className="space-y-3 rounded-lg bg-card/50 p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-4">Research Metrics</h4>
              {ratings.map((rating) => (
                <div key={rating.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground/80">{rating.label}</span>
                    <span className="text-sm font-bold text-foreground">{rating.value}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-400"
                      style={{ width: `${(rating.value / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-foreground/60">{rating.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Variant Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Select Variant</h4>
            <RadioGroup value={selectedVariantId} onValueChange={setSelectedVariantId}>
              <div className="grid gap-3">
                {groupedProduct.variants.map((variant) => (
                  <div
                    key={variant.barcode}
                    className="relative flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-border transition-colors"
                  >
                    <RadioGroupItem value={variant.barcode} id={variant.barcode} />
                    <Label
                      htmlFor={variant.barcode}
                      className="flex flex-1 cursor-pointer items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{variant.variant}</p>
                        <p className="text-sm text-foreground/60">SKU: {variant.barcode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${parseFloat(variant.retail_price).toFixed(2)}</p>
                        {variant.in_stock ? (
                          <Badge variant="outline" className="border-green-500/50 text-green-400">
                            <Check className="mr-1 h-3 w-3" />
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-500/50 text-red-400">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          {selectedVariant?.description && (
            <div className="rounded-lg bg-card/50 p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Description</h4>
              <p className="text-sm text-foreground/80">{selectedVariant.description}</p>
            </div>
          )}

          {/* Action Buttons - with safe area padding for iPhone home indicator */}
          <div className="flex gap-4 pt-4 pb-[env(safe-area-inset-bottom,0px)]">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.in_stock || isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-card/90 disabled:bg-foreground/50"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={!selectedVariant?.in_stock || isLoading}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-foreground/10"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
