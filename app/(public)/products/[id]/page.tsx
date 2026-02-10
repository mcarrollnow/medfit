"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

interface GroupedProduct {
  base_name: string
  variants: Product[]
  lowestPrice: number
  category: string
  color: string
  ratings?: { label: string; value: number }[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const supabase = getSupabaseBrowserClient()
  const { addItem } = useCartStore()

  const [groupedProduct, setGroupedProduct] = useState<GroupedProduct | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [customerType, setCustomerType] = useState<string>('retail')
  const [tierDiscountPct, setTierDiscountPct] = useState<number>(0)
  const [customerProductOverrides, setCustomerProductOverrides] = useState<Record<string, number>>({})
  
  // Desktop slide state
  const [slidePositions, setSlidePositions] = useState<[number, number]>([0, -100])
  const [isAnimating, setIsAnimating] = useState(false)

  // Helper to get the right price based on customer type
  // Priority: per-product override > tier discount > customer_type pricing > retail
  const getPrice = (variant: any): number => {
    // 1. Per-product override
    if (variant.id && customerProductOverrides[variant.id] !== undefined) {
      return customerProductOverrides[variant.id]
    }

    // 2. Base price by customer type
    let basePrice: number
    switch (customerType) {
      case 'supplier_customer':
        basePrice = parseFloat(String(variant.supplier_price)) || parseFloat(String(variant.retail_price)) || 0
        break
      case 'b2b':
      case 'b2bvip':
      case 'rep':
        basePrice = parseFloat(String(variant.b2b_price)) || parseFloat(String(variant.retail_price)) || 0
        break
      default:
        basePrice = parseFloat(String(variant.retail_price)) || 0
    }

    // 3. Apply tier discount
    if (tierDiscountPct > 0) {
      return Math.round(basePrice * (1 - tierDiscountPct / 100) * 100) / 100
    }

    return basePrice
  }

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Detect customer type, tier discount, and per-product overrides
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: publicUser } = await supabase
            .from('users')
            .select('id')
            .eq('auth_id', user.id)
            .single()
          if (publicUser) {
            const { data: customer } = await supabase
              .from('customers')
              .select('id, customer_type, pricing_tier_id')
              .eq('user_id', publicUser.id)
              .single()
            if (customer) {
              setCustomerType(customer.customer_type)

              // Fetch tier discount
              if (customer.pricing_tier_id) {
                const { data: tier } = await supabase
                  .from('rep_pricing_tiers')
                  .select('discount_percentage')
                  .eq('id', customer.pricing_tier_id)
                  .single()
                if (tier) setTierDiscountPct(Number(tier.discount_percentage))
              }

              // Fetch per-product overrides
              const { data: overrides } = await supabase
                .from('customer_product_pricing')
                .select('product_id, custom_price')
                .eq('customer_id', customer.id)
              if (overrides) {
                const map: Record<string, number> = {}
                overrides.forEach((o: any) => { map[o.product_id] = Number(o.custom_price) })
                setCustomerProductOverrides(map)
              }
            }
          }
        }
      } catch (e) {
        // Non-critical
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`*, category_data:categories(id, name, color)`)
        .eq('id', params.id)
        .single()

      if (productError || !product) {
        setError('Product not found')
        return
      }

      const { data: variants, error: variantsError } = await supabase
        .from('products')
        .select(`*, category_data:categories(id, name, color)`)
        .eq('base_name', product.base_name)
        .eq('is_active', true)
        .order('retail_price', { ascending: true })

      if (variantsError || !variants || variants.length === 0) {
        setError('Product not found')
        return
      }

      const firstVariant = variants[0] as any
      const prices = variants.map((v: any) => {
        switch (customerType) {
          case 'supplier_customer':
            return parseFloat(String(v.supplier_price)) || parseFloat(String(v.retail_price)) || 0
          case 'b2b':
          case 'b2bvip':
          case 'rep':
            return parseFloat(String(v.b2b_price)) || parseFloat(String(v.retail_price)) || 0
          default:
            return typeof v.retail_price === 'string' ? parseFloat(v.retail_price) : v.retail_price
        }
      })

      const ratings: { label: string; value: number }[] = []
      if (firstVariant.rating_label_1 && firstVariant.rating_value_1 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_1, value: Number(firstVariant.rating_value_1) })
      }
      if (firstVariant.rating_label_2 && firstVariant.rating_value_2 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_2, value: Number(firstVariant.rating_value_2) })
      }
      if (firstVariant.rating_label_3 && firstVariant.rating_value_3 !== undefined) {
        ratings.push({ label: firstVariant.rating_label_3, value: Number(firstVariant.rating_value_3) })
      }

      setGroupedProduct({
        base_name: product.base_name,
        variants: variants as Product[],
        lowestPrice: Math.min(...prices),
        category: firstVariant.category_data?.name || 'Research Peptide',
        color: firstVariant.category_data?.color || firstVariant.color || '#8B5CF6',
        ratings: ratings.length > 0 ? ratings : undefined,
      })

      const clickedVariant = variants.find((v: any) => v.id === params.id) || variants[0]
      setSelectedVariant(clickedVariant as Product)
    } catch (err) {
      console.error('Error loading product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const activeIndex = slidePositions.findIndex((pos) => pos === 0)
    const nextIndex = activeIndex === 0 ? 1 : 0
    setSlidePositions((prev) => {
      const newPos = [...prev] as [number, number]
      newPos[activeIndex] = 100
      newPos[nextIndex] = 0
      return newPos
    })
    setTimeout(() => {
      setSlidePositions((prev) => {
        const newPos = [...prev] as [number, number]
        newPos[activeIndex] = -100
        return newPos
      })
      setIsAnimating(false)
    }, 700)
  }

  const getDefaultRatings = (productName: string) => {
    const ratingsMap: Record<string, { label: string; value: number }[]> = {
      "BPC-157": [
        { label: "Tissue Repair", value: 8.7 },
        { label: "Inflammation Reduction", value: 8.2 },
        { label: "Recovery Speed", value: 8.5 },
      ],
      Semaglutide: [
        { label: "Weight Loss", value: 9.0 },
        { label: "Glucose Control", value: 9.2 },
        { label: "Cardiovascular Protection", value: 8.8 },
      ],
      Tirzepatide: [
        { label: "Weight Loss", value: 9.5 },
        { label: "Glucose Control", value: 9.2 },
        { label: "Cardiovascular Protection", value: 10.0 },
      ],
    }
    const key = Object.keys(ratingsMap).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
    return key ? ratingsMap[key] : [
      { label: "Efficacy", value: 8.0 },
      { label: "Safety Profile", value: 8.5 },
      { label: "Research Support", value: 7.5 },
    ]
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    try {
      await addItem(selectedVariant, quantity)
      toast("Item added to cart!", {
        description: `${quantity} x ${selectedVariant.base_name} (${selectedVariant.variant})`,
        action: { label: "View Cart", onClick: () => { window.location.href = '/cart' } },
      })
    } catch (error) {
      toast("Failed to add item to cart", {
        description: error instanceof Error ? error.message : "Please try again"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error || !groupedProduct || !selectedVariant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-2xl text-foreground text-center">{error || 'Product not found'}</h1>
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>
    )
  }

  const retailPrice = getPrice(selectedVariant)
  const ratings = groupedProduct.ratings?.length ? groupedProduct.ratings : getDefaultRatings(selectedVariant.base_name)
  const description = selectedVariant.description || "Research-grade peptide with documented efficacy in clinical studies."

  return (
    <div className="min-h-screen bg-background text-foreground">
        {/* Back Button */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="px-5 py-3 xl:px-6 xl:py-4 max-w-6xl mx-auto">
            <Link href="/" className="inline-flex items-center text-foreground/60 hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </div>
        </div>

        {/* MOBILE/TABLET VIEW - Primary (up to xl breakpoint) */}
        <div className="xl:hidden">
          <div className="relative min-h-[calc(100vh-56px)]">
            {/* Front - Ratings & Purchase */}
            <div
              className={`min-h-[calc(100vh-56px)] overflow-y-auto transition-opacity duration-500 ${
                isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 30%, ${selectedVariant.color}40, transparent 60%)`
              }} />
              
              {/* Top fade to black */}
              <div className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10" style={{
                background: 'linear-gradient(to bottom, black 0%, transparent 100%)'
              }} />
              
              {/* Bottom fade to black */}
              <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10" style={{
                background: 'linear-gradient(to top, black 0%, transparent 100%)'
              }} />

              <div className="relative z-10 px-5 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-10 space-y-5 sm:space-y-6 md:space-y-8 max-w-md sm:max-w-lg mx-auto">
                  {/* Product Name - At Top */}
                  <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold">{selectedVariant.base_name}</h1>
                    <p className="text-foreground/60 text-lg sm:text-xl mt-1">{selectedVariant.variant}</p>
                  </div>

                  {/* Stock Badge */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <Badge variant="outline" className="border-border text-foreground/70 text-xs sm:text-sm">
                      RESEARCH USE ONLY
                    </Badge>
                    {selectedVariant.current_stock > 0 ? (
                      selectedVariant.current_stock < 10 ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs sm:text-sm">LOW STOCK</Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-400 text-xs sm:text-sm">IN STOCK</Badge>
                      )
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 text-xs sm:text-sm">OUT OF STOCK</Badge>
                    )}
                  </div>

                  {/* Category & Ratings */}
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground/70">{groupedProduct.category}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mt-1">Research Grade</p>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    {ratings.map((rating, i) => (
                      <div key={i} className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-foreground/80">{rating.label}</span>
                          <span className="font-mono font-bold text-base sm:text-lg" style={{ color: selectedVariant.color }}>
                            {rating.value.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 sm:h-3 rounded-full bg-foreground/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(rating.value / 10) * 100}%`, backgroundColor: selectedVariant.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tap for Info */}
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-3 sm:py-4 rounded-xl border border-border bg-foreground/5 text-sm sm:text-base text-foreground/60 hover:bg-foreground/10 transition"
                  >
                    Tap for info →
                  </button>

                  {/* Variant Selection */}
                  {groupedProduct.variants.length > 1 && (
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2 sm:mb-3 text-center">Select Variant</p>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {groupedProduct.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => { setSelectedVariant(variant); setQuantity(1) }}
                            className={`p-3 sm:p-4 rounded-xl text-sm sm:text-base font-medium border transition-all ${
                              selectedVariant.id === variant.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-foreground/5 text-foreground/70 border-border hover:border-border"
                            }`}
                          >
                            <div className="text-xs sm:text-sm opacity-60">Variant</div>
                            <div>{variant.variant}</div>
                            <div className="font-bold text-base sm:text-lg">${getPrice(variant).toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Price */}
                  <div className="space-y-4 sm:space-y-5 pt-2">
                    <div className="flex items-center justify-between rounded-xl border border-border bg-foreground/5 px-4 sm:px-6 py-3 sm:py-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl sm:text-2xl text-foreground/60 hover:text-foreground p-1 sm:p-2">−</button>
                      <span className="font-mono text-xl sm:text-2xl font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(selectedVariant.current_stock || 99, quantity + 1))} className="text-xl sm:text-2xl text-foreground/60 hover:text-foreground p-1 sm:p-2">+</button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Total</p>
                      <p className="text-3xl sm:text-4xl font-bold">${(retailPrice * quantity).toFixed(2)}</p>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={!selectedVariant.current_stock}
                      className="w-full h-14 sm:h-16 bg-primary text-primary-foreground hover:bg-card/90 text-lg sm:text-xl font-bold rounded-2xl disabled:opacity-50"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                      {selectedVariant.current_stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                    </Button>
                  </div>
                </div>

              {/* Safe area padding */}
              <div className="h-[env(safe-area-inset-bottom,0px)]" />
            </div>

            {/* Back - Description (Info) */}
            <div
              className={`absolute inset-0 min-h-[calc(100vh-56px)] overflow-y-auto bg-background transition-opacity duration-500 ${
                isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsFlipped(false)}
            >
              {/* Subtle color glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 30%, ${selectedVariant.color}25, transparent 50%)`
              }} />
              
              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10" style={{
                background: 'linear-gradient(to bottom, black 0%, transparent 100%)'
              }} />
              
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10" style={{
                background: 'linear-gradient(to top, black 0%, transparent 100%)'
              }} />

              <div className="relative z-10 px-5 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 min-h-[calc(100vh-56px)] flex flex-col max-w-md sm:max-w-lg mx-auto">
                <div className="mb-6 sm:mb-8 text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold">{selectedVariant.base_name}</h2>
                  <p className="text-foreground/60 text-lg sm:text-xl mt-1">{selectedVariant.variant}</p>
                  <div className="h-0.5 w-16 sm:w-20 bg-foreground/30 mt-4 mx-auto" />
                </div>

                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 flex-1 text-center">{description}</p>

                <button className="mt-8 sm:mt-10 py-3 sm:py-4 rounded-xl border border-border bg-foreground/5 text-sm sm:text-base text-foreground/60 hover:bg-foreground/10 transition">
                  ← Back
                </button>
              </div>

              <div className="h-[env(safe-area-inset-bottom,0px)]" />
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW - Only on large screens (xl+) */}
        <div className="hidden xl:block py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border h-[80vh]">
              {/* Left Panel - Sliding */}
              <div className="relative overflow-hidden cursor-pointer bg-background" onClick={handleSlide}>
                {/* Ratings */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-8 transition-transform ease-in-out"
                  style={{
                    transform: `translateX(${slidePositions[0]}%)`,
                    transitionDuration: slidePositions[0] === -100 ? "0ms" : "700ms",
                    zIndex: slidePositions[0] === 0 ? 10 : 0,
                  }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`
                  }} />
                  <div className="w-full max-w-md space-y-6 relative z-10">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold">{groupedProduct.category}</h3>
                      <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">Research Grade Analysis</p>
                    </div>
                    {ratings.map((rating, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/80">{rating.label}</span>
                          <span className="font-mono font-bold" style={{ color: selectedVariant.color }}>{rating.value.toFixed(1)}</span>
                        </div>
                        <div className="h-3 rounded-full bg-foreground/10 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(rating.value / 10) * 100}%`, backgroundColor: selectedVariant.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-8 transition-transform ease-in-out"
                  style={{
                    transform: `translateX(${slidePositions[1]}%)`,
                    transitionDuration: slidePositions[1] === -100 ? "0ms" : "700ms",
                    zIndex: slidePositions[1] === 0 ? 10 : 0,
                  }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`
                  }} />
                  <div className="w-full max-w-md text-center relative z-10">
                    <h3 className="text-3xl font-bold mb-4">{selectedVariant.base_name}</h3>
                    <div className="h-1 w-16 bg-foreground/20 mx-auto rounded-full mb-6" />
                    <p className="text-lg leading-relaxed text-white/90">{description}</p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Purchase */}
              <div className="flex flex-col p-8 bg-background/90 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="border-border text-xs">RESEARCH USE ONLY</Badge>
                  {selectedVariant.current_stock > 0 ? (
                    selectedVariant.current_stock < 10 ? (
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">LOW STOCK</Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">IN STOCK</Badge>
                    )
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 text-xs">OUT OF STOCK</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-1">{selectedVariant.base_name}</h1>
                <p className="text-xl text-foreground/60 mb-6">{selectedVariant.variant}</p>

                {groupedProduct.variants.length > 1 && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Select Variant</p>
                    <div className="flex flex-wrap gap-2">
                      {groupedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => { setSelectedVariant(variant); setQuantity(1) }}
                          className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                            selectedVariant.id === variant.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-foreground/5 text-foreground/70 border-border hover:border-border"
                          }`}
                        >
                          {variant.variant} <span className="ml-1 font-bold">${getPrice(variant).toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-foreground/5 p-5 flex justify-between items-center mb-6">
                  <span className="text-foreground/60">Price</span>
                  <span className="font-mono text-3xl font-bold">${retailPrice.toFixed(2)}</span>
                </div>

                <div className="mt-auto space-y-4 border-t border-border pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 px-4 py-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-lg text-foreground/60 hover:text-foreground">−</button>
                      <span className="w-8 text-center font-mono font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(selectedVariant.current_stock || 99, quantity + 1))} className="text-lg text-foreground/60 hover:text-foreground">+</button>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-muted-foreground uppercase">Total</p>
                      <p className="text-2xl font-bold">${(retailPrice * quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant.current_stock}
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 text-lg font-bold rounded-xl disabled:opacity-50"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {selectedVariant.current_stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  )
}
