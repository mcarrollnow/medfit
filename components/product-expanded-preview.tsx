"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Plus, Minus, FileText } from "lucide-react"

interface ProductVariant {
  id: string
  barcode: string
  name?: string
  base_name: string
  variant: string
  category_id: string | null
  color: string
  description?: string | null
  cart_product_detail?: string | null
  cart_image?: string | null
  cost_price: string
  b2b_price: string
  retail_price: string
  current_stock: number
  initial_stock: number
  restock_level: number
  manual_adjustment: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

interface Category {
  id: string
  name: string
  color: string | null
  description: string | null
}

interface ProductRating {
  label: string
  value: number
}

interface ProductData {
  base_name: string
  category_id: string | null
  category: Category | null
  color: string
  description: string | null
  cart_product_detail: string | null
  is_active: boolean
  variants: ProductVariant[]
  ratings?: ProductRating[]
}

interface ProductExpandedPreviewProps {
  productData: ProductData
  displayColor: string
  previewSlidePosition: [number, number]
  handlePreviewSlide: () => void
  isPreviewAnimating: boolean
  setPreviewSlidePosition: (pos: [number, number]) => void
  setIsPreviewAnimating: (val: boolean) => void
  previewSelectedVariant: number
  setPreviewSelectedVariant: (val: number) => void
  categories: Category[]
  onDescriptionChange?: (description: string) => void
  previewMode?: boolean
}

function getProductRatings(productName: string): { label: string; value: number }[] {
  const ratingMappings: Record<string, { label: string; value: number }[]> = {
    "AOD-9604": [
      { label: "Fat Reduction", value: 6.4 },
      { label: "Metabolic Health", value: 5.5 },
      { label: "Recovery Support", value: 4.8 },
    ],
    "BPC-157": [
      { label: "Inflammation Reduction", value: 8.2 },
      { label: "Recovery Speed", value: 8.5 },
      { label: "Gut Health", value: 7.8 },
    ],
    Cagrilintide: [
      { label: "Appetite Control", value: 10.0 },
      { label: "Metabolic Health", value: 10.0 },
      { label: "Weight Management", value: 10.0 },
    ],
    "CJC-1295": [
      { label: "Muscle Growth", value: 7.8 },
      { label: "Recovery Enhancement", value: 7.5 },
      { label: "Performance Improvement", value: 7.2 },
    ],
    DSIP: [
      { label: "Sleep Quality Enhancement", value: 9.0 },
      { label: "Stress Reduction", value: 8.5 },
      { label: "Pain Tolerance", value: 7.0 },
    ],
    Semaglutide: [
      { label: "Weight Loss Efficacy", value: 9.5 },
      { label: "Appetite Suppression", value: 9.2 },
      { label: "Metabolic Improvement", value: 8.8 },
    ],
    Tirzepatide: [
      { label: "Weight Loss Efficacy", value: 10.0 },
      { label: "Glycemic Control", value: 9.8 },
      { label: "Metabolic Health", value: 9.5 },
    ],
    "TB-500": [
      { label: "Tissue Repair", value: 8.7 },
      { label: "Inflammation Response", value: 8.2 },
      { label: "Recovery Speed", value: 8.5 },
    ],
  }

  const key = Object.keys(ratingMappings).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
  return key
    ? ratingMappings[key]
    : [
        { label: "Research Quality", value: 8.0 },
        { label: "Purity Level", value: 9.0 },
        { label: "Stability", value: 8.5 },
      ]
}

// Mobile Flip Card Component - matches the store behavior
function MobileFlipPreview({
  productData,
  displayColor,
  selectedVariant,
  previewSelectedVariant,
  setPreviewSelectedVariant,
  ratings,
  categoryName,
  quantity,
  setQuantity,
  previewMode,
}: {
  productData: ProductData
  displayColor: string
  selectedVariant: ProductVariant
  previewSelectedVariant: number
  setPreviewSelectedVariant: (val: number) => void
  ratings: { label: string; value: number }[]
  categoryName: string
  quantity: number
  setQuantity: (val: number) => void
  previewMode: boolean
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Calculate dynamic height based on content
  const hasMultipleVariants = productData.variants.length > 1
  const cardHeight = hasMultipleVariants ? "min-h-[420px]" : "min-h-[360px]"

  return (
    <div className="md:hidden relative w-full" style={{ perspective: "1000px" }}>
      <div
        className={`w-full relative transition-transform duration-700 ${cardHeight}`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face - Ratings + Product Info */}
        <div
          className="absolute inset-0 w-full rounded-xl overflow-y-auto bg-black/90 border border-white/10"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Ratings Section - Tappable */}
          <div
            className="relative p-3 cursor-pointer bg-gradient-to-br from-white/5 to-white/10"
            onClick={(e) => {
              e.stopPropagation()
              setIsFlipped(true)
            }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${displayColor}, transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <div className="text-center mb-2">
                <h3 className="text-base font-bold tracking-tight text-white">{categoryName}</h3>
                <p className="text-white/60 text-[9px] uppercase tracking-widest">Tap for description</p>
              </div>
              <div className="space-y-2">
                {ratings.map((rating, index) => (
                  <div key={index} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wide text-white/80">{rating.label}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: displayColor }}>
                        {rating.value.toFixed(1)}
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(rating.value / 10) * 100}%`,
                          backgroundColor: displayColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-3 space-y-2.5 bg-black/90">
            <div className="flex flex-wrap items-center gap-1">
              <Badge variant="outline" className="border-primary/50 text-primary px-1.5 py-0 text-[8px] rounded-full">
                RESEARCH USE ONLY
              </Badge>
              {selectedVariant.current_stock > 0 ? (
                selectedVariant.current_stock < 10 ? (
                  <Badge className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0 text-[8px] rounded-full">
                    LOW STOCK
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-green-400 px-1.5 py-0 text-[8px] rounded-full">
                    IN STOCK
                  </Badge>
                )
              ) : (
                <Badge className="bg-red-500/20 text-red-400 px-1.5 py-0 text-[8px] rounded-full">
                  OUT OF STOCK
                </Badge>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                {productData.base_name}
              </h2>
              <p className="text-xs font-medium text-white/70">{selectedVariant.variant}</p>
            </div>

            {/* Variant Selector */}
            {productData.variants.length > 1 && (
              <div>
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-semibold mb-1">Select Variant</p>
                <div className="flex flex-wrap gap-1">
                  {productData.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewSelectedVariant(index)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all border flex-1 text-center min-w-[60px] ${
                        previewSelectedVariant === index
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white/70 border-white/10"
                      }`}
                    >
                      {variant.variant}
                      <span className="block font-bold text-[9px]">
                        ${Number.parseFloat(variant.retail_price).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-2 flex items-center justify-between">
              <span className="text-[10px] text-white/60">Price</span>
              <span className="font-mono text-lg font-bold text-white">
                ${Number.parseFloat(selectedVariant.retail_price).toFixed(2)}
              </span>
            </div>

            {/* Quantity and Cart */}
            <div className="space-y-2 border-t border-white/10 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1">
                  <button
                    onClick={() => !previewMode && setQuantity(Math.max(1, quantity - 1))}
                    className="text-white/60 hover:text-white"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => !previewMode && setQuantity(quantity + 1)}
                    className="text-white/60 hover:text-white"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[8px] text-white/40 uppercase tracking-wider">Total</p>
                  <p className="text-base font-bold text-white">
                    ${(Number.parseFloat(selectedVariant.retail_price) * quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                className="h-8 w-full bg-white text-black hover:bg-white/90 text-[10px] font-bold tracking-widest rounded-md"
                disabled={previewMode || selectedVariant.current_stock === 0}
              >
                <ShoppingCart className="mr-1.5 h-3 w-3" />
                {previewMode ? "Preview Mode" : selectedVariant.current_stock === 0 ? "Out of Stock" : "ADD TO CART"}
              </Button>
            </div>
          </div>
        </div>

        {/* Back Face - Description */}
        <div
          className="absolute inset-0 w-full rounded-xl overflow-hidden"
          style={{ 
            transform: "rotateY(180deg)", 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden" 
          }}
          onClick={() => setIsFlipped(false)}
        >
          <div className="absolute inset-0 bg-black/95 rounded-xl border border-white/10" />
          <div
            className="absolute inset-0 opacity-20 rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${displayColor}, transparent 70%)`,
            }}
          />
          <div className="relative z-10 h-full w-full overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold tracking-tight text-white mb-2">
                {productData.base_name}
              </h3>
              <div className="h-0.5 w-12 bg-gradient-to-r from-white/60 to-transparent" />
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              {productData.description || "No description available. Add a description in the Card View tab."}
            </p>
            <p className="mt-4 text-[10px] text-white/40 text-center">Tap to go back</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductExpandedPreview({
  productData,
  displayColor,
  previewSlidePosition,
  handlePreviewSlide,
  previewSelectedVariant,
  setPreviewSelectedVariant,
  onDescriptionChange,
  previewMode = false,
}: ProductExpandedPreviewProps) {
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = productData.variants[previewSelectedVariant] || productData.variants[0]
  // Always use ratings from productData (initialized with defaults in inventory page if empty)
  // Fall back to defaults only if ratings array is completely missing
  const ratings = (productData.ratings && productData.ratings.length > 0) 
    ? productData.ratings 
    : [
        { label: "Efficacy", value: 8.0 },
        { label: "Safety Profile", value: 8.5 },
        { label: "Research Support", value: 7.5 },
      ]
  const categoryName = productData.category?.name || "Uncategorized"

  return (
    <div className="space-y-6 md:space-y-8 overflow-x-hidden">
      {/* Live Preview */}
      <div className="admin-container bg-white/5 border border-white/10 p-3 md:p-8 rounded-2xl overflow-hidden">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
          <FileText className="h-4 w-4 md:h-5 md:w-5" />
          Live Expanded View Preview
        </h3>
        <p className="text-xs md:text-sm text-white/50 mb-4 md:mb-6">
          <span className="md:hidden">Tap the ratings section to flip and see the description</span>
          <span className="hidden md:inline">Click the left panel to slide between ratings and description</span>
        </p>

        {/* Mobile Flip Card */}
        <MobileFlipPreview
          productData={productData}
          displayColor={displayColor}
          selectedVariant={selectedVariant}
          previewSelectedVariant={previewSelectedVariant}
          setPreviewSelectedVariant={setPreviewSelectedVariant}
          ratings={ratings}
          categoryName={categoryName}
          quantity={quantity}
          setQuantity={setQuantity}
          previewMode={previewMode}
        />

        {/* Desktop Slide Preview */}
        <div className="hidden md:block md:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/90">
          <div className="grid h-full grid-cols-2">
            {/* Left Panel - Sliding Carousel */}
            <div
              className="relative w-full h-full overflow-hidden cursor-pointer bg-black"
              onClick={handlePreviewSlide}
            >
              {/* Ratings Panel */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl transition-transform ease-in-out"
                style={{
                  transform: `translateX(${previewSlidePosition[0]}%)`,
                  transitionDuration: previewSlidePosition[0] === -100 ? "0ms" : "700ms",
                  zIndex: previewSlidePosition[0] === 0 ? 10 : 0,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${displayColor}, transparent 70%)`,
                  }}
                />

                <div className="w-full max-w-md space-y-6 relative z-10 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 tracking-tight text-white">{categoryName}</h3>
                    <p className="text-white/60 text-sm uppercase tracking-widest">Research Grade Analysis</p>
                  </div>

                  <div className="space-y-6">
                    {ratings.map((rating, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold tracking-wide text-white/80">{rating.label}</span>
                          <span className="font-mono text-lg font-bold" style={{ color: displayColor }}>
                            {rating.value.toFixed(1)}
                          </span>
                        </div>
                        <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_currentColor]"
                            style={{
                              width: `${(rating.value / 10) * 100}%`,
                              backgroundColor: displayColor,
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Description Panel */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl transition-transform ease-in-out"
                style={{
                  transform: `translateX(${previewSlidePosition[1]}%)`,
                  transitionDuration: previewSlidePosition[1] === -100 ? "0ms" : "700ms",
                  zIndex: previewSlidePosition[1] === 0 ? 10 : 0,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${displayColor}, transparent 70%)`,
                  }}
                />

                <div className="w-full max-w-md space-y-6 text-center relative z-10">
                  <h3 className="text-3xl font-bold tracking-tight text-white">{productData.base_name}</h3>
                  <div className="h-1 w-20 bg-white/20 mx-auto rounded-full" />
                  <p className="text-lg leading-relaxed text-white/90">
                    {productData.description || "No description available"}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Panel - Product Info */}
            <div className="flex flex-col p-8 h-full overflow-hidden bg-black/90 relative">
              <div className="mb-6 space-y-4 text-left flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/50 text-primary px-3 py-0.5 text-xs rounded-full">
                    RESEARCH USE ONLY
                  </Badge>
                  {selectedVariant.current_stock > 0 ? (
                    selectedVariant.current_stock < 10 ? (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 px-3 py-0.5 text-xs rounded-full"
                      >
                        LOW STOCK
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-0.5 text-xs rounded-full"
                      >
                        IN STOCK
                      </Badge>
                    )
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-0.5 text-xs rounded-full"
                    >
                      OUT OF STOCK
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight leading-tight text-white">
                    {productData.base_name}
                  </h2>
                  <p className="text-xl font-medium text-white/70">{selectedVariant.variant}</p>
                </div>
              </div>

              {/* Variant Selector */}
              {productData.variants.length > 1 && (
                <div className="mb-4 flex-shrink-0">
                  <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Select Variant</p>
                  <div className="flex flex-wrap gap-3">
                    {productData.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setPreviewSelectedVariant(index)}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border min-w-[100px] ${
                          previewSelectedVariant === index
                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/30"
                        }`}
                      >
                        {variant.variant}
                        <span className="inline ml-2 text-sm">
                          ${Number.parseFloat(variant.retail_price).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Card */}
              <div className="space-y-4 flex-shrink-0">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-center justify-between">
                  <span className="text-sm text-white/60">Price</span>
                  <span className="font-mono text-3xl font-bold text-white">
                    ${Number.parseFloat(selectedVariant.retail_price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-auto space-y-4 border-t border-white/10 pt-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2">
                    <button
                      onClick={() => !previewMode && setQuantity(Math.max(1, quantity - 1))}
                      className="text-white/60 hover:text-white transition-colors p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-mono text-lg font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => !previewMode && setQuantity(quantity + 1)}
                      className="text-white/60 hover:text-white transition-colors p-1"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Total Price</p>
                    <p className="text-3xl font-bold text-white tracking-tight">
                      ${(Number.parseFloat(selectedVariant.retail_price) * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="h-14 w-full bg-white text-black hover:bg-white/90 text-lg font-bold tracking-widest disabled:opacity-50 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={previewMode || selectedVariant.current_stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {previewMode ? "Preview Mode" : selectedVariant.current_stock === 0 ? "Out of Stock" : "ADD TO CART"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Editor */}
      {onDescriptionChange && (
        <div className="admin-container bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl">
          <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-6 flex items-center gap-2">
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
            Product Description
          </h3>
          <p className="text-xs md:text-sm text-white/50 mb-3 md:mb-4">
            This description appears when customers tap/click to flip/slide the card
          </p>
          <Textarea
            value={productData.description || ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter product description..."
            className="admin-input bg-white/5 border-white/10 text-white min-h-[280px] md:min-h-[200px] text-sm md:text-lg leading-relaxed rounded-xl"
          />
        </div>
      )}
    </div>
  )
}
