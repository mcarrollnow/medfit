"use client"

import type { Product } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"

interface GroupedProduct {
  base_name: string
  variants: Product[]
  lowestPrice: number
  category: string
  color: string
}

interface ProductModalProps {
  groupedProduct: GroupedProduct
  isOpen: boolean
  onClose: () => void
}

function MobileFlipCard({
  groupedProduct,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  retailPrice,
  ratings,
  description,
  addItem,
  onClose,
}: any) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="md:hidden relative w-full h-full" style={{ perspective: "1000px" }}>
      <div
        className="w-full h-full relative transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Mobile Front Face */}
        <div
          className="absolute inset-0 backface-hidden flex flex-col bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl cursor-pointer rounded-[2.5rem] overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

          <div className="flex-shrink-0 p-8 relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{groupedProduct.category}</h3>
              <p className="text-foreground/60 text-xs uppercase tracking-widest">Research Grade Analysis</p>
            </div>
            <div className="space-y-5">
              {ratings.map((rating: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wide text-white/90">{rating.label}</span>
                    <span className="font-mono text-lg font-bold" style={{ color: selectedVariant.color }}>
                      {rating.value.toFixed(1)}
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/5 backdrop-blur-md border border-border">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_currentColor]"
                      style={{
                        width: `${(rating.value / 10) * 100}%`,
                        backgroundColor: selectedVariant.color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
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

            <div className="space-y-1 mb-4">
              <h2 className="text-2xl font-bold tracking-tight break-words leading-tight">
                {selectedVariant.base_name}
              </h2>
              <p className="text-base font-medium text-foreground/70">{selectedVariant.variant}</p>
            </div>

            {groupedProduct.variants.length > 1 && (
              <div className="mb-auto">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Select Variant</p>
                <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                  {groupedProduct.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant)
                        setQuantity(1)
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border flex-1 justify-center text-center min-w-[100px] ${
                        selectedVariant.id === variant.id
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(58,66,51,0.2)]"
                          : "bg-foreground/5 text-foreground/70 border-border hover:bg-foreground/10 hover:border-border"
                      }`}
                    >
                      <span className="block text-xs opacity-70 mb-0.5">Variant</span>
                      {variant.variant}
                      <span className="block font-bold text-xs opacity-90">
                        ${Number.parseFloat(variant.retail_price).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 mt-2">
              <div
                className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 backdrop-blur-md px-4 py-3 justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-foreground/60 hover:text-foreground transition-colors p-1 text-xl"
                >
                  −
                </button>
                <span className="w-12 text-center font-mono text-xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.current_stock, quantity + 1))}
                  className="text-foreground/60 hover:text-foreground transition-colors p-1 text-xl"
                  disabled={quantity >= selectedVariant.current_stock}
                >
                  +
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">${(retailPrice * quantity).toFixed(2)}</p>
              </div>

              <Button
                size="lg"
                className="h-14 w-full bg-primary text-primary-foreground hover:bg-card/90 text-lg font-bold tracking-widest disabled:opacity-50 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={selectedVariant.current_stock === 0}
                onClick={async (e) => {
                  e.stopPropagation()
                  try {
                    await addItem(selectedVariant, quantity)
                    onClose()
                    toast("Item added to cart!", {
                      description: `${quantity} x ${selectedVariant.base_name} (${selectedVariant.variant})`,
                      action: {
                        label: "View Cart",
                        onClick: () => {
                          window.location.href = '/cart'
                        },
                      },
                    })
                  } catch (error) {
                    toast("Failed to add item to cart", {
                      description: error instanceof Error ? error.message : "Please try again"
                    })
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {selectedVariant.current_stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Back Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="absolute inset-0 bg-background/90 rounded-[2.5rem]" />
          <div
            className="absolute inset-0 opacity-20 rounded-[2.5rem]"
            style={{
              background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-[2.5rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent rounded-[2.5rem]" />

          {/* Content layer - scrollable */}
          <div className="relative z-10 h-full w-full overflow-y-auto">
            <div className="min-h-full flex flex-col p-8">
              <div className="mb-8">
                <h3 className="text-3xl font-bold tracking-tight leading-none text-foreground mb-4">
                  {selectedVariant.base_name}
                </h3>
                <div className="h-0.5 w-20 bg-gradient-to-r from-white/60 to-transparent" />
              </div>

              <div className="flex-1 flex items-center">
                <p className="text-lg leading-relaxed text-white/90 font-light tracking-wide">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductModal({ groupedProduct, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCartStore()
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(groupedProduct.variants[0])
  const [quantity, setQuantity] = useState(1)

  // Desktop Slide State
  const [slidePositions, setSlidePositions] = useState<[number, number]>([0, -100])
  const [isAnimating, setIsAnimating] = useState(false)

  const retailPrice = Number.parseFloat(selectedVariant.retail_price)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const getProductRatings = (productName: string) => {
    const ratingsMap: Record<string, { label: string; value: number }[]> = {
      Adipotide: [
        { label: "Weight Loss Efficacy", value: 8.5 },
        { label: "Fat Reduction", value: 8.8 },
        { label: "Metabolic Health", value: 6.2 },
      ],
      "AOD-9604": [
        { label: "Weight Loss Efficacy", value: 5.8 },
        { label: "Fat Reduction", value: 6.4 },
        { label: "Metabolic Health", value: 5.5 },
      ],
      "BPC-157": [
        { label: "Tissue Repair", value: 8.7 },
        { label: "Inflammation Reduction", value: 8.2 },
        { label: "Recovery Speed", value: 8.5 },
      ],
      Cagrilintide: [
        { label: "Weight Loss", value: 10.0 },
        { label: "Appetite Control", value: 10.0 },
        { label: "Metabolic Health", value: 10.0 },
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
      Epithalon: [
        { label: "Cellular Health", value: 6.5 },
        { label: "Longevity Enhancement", value: 5.8 },
        { label: "Tumor Reduction", value: 4.2 },
      ],
      "GHK-Cu": [
        { label: "Skin Rejuvenation", value: 9.0 },
        { label: "Collagen Enhancement", value: 9.0 },
        { label: "Hair Growth", value: 9.0 },
      ],
      "GHRP-2": [
        { label: "Growth Hormone Release", value: 8.2 },
        { label: "Muscle Growth", value: 7.4 },
        { label: "Fat Reduction", value: 6.8 },
      ],
      HCG: [
        { label: "Testosterone Production", value: 8.8 },
        { label: "Ovulation Induction", value: 9.2 },
        { label: "Fertility Preservation", value: 8.5 },
      ],
      Hexarelin: [
        { label: "Growth Hormone", value: 8.5 },
        { label: "IGF-1 Elevation", value: 8.2 },
        { label: "Cardiovascular Protection", value: 7.2 },
      ],
      HGH: [
        { label: "Muscle Growth", value: 9.2 },
        { label: "Fat Reduction", value: 8.8 },
        { label: "Bone Density", value: 8.5 },
      ],
      HMG: [
        { label: "Improves hormones", value: 8.2 },
        { label: "Increases fertility", value: 9.0 },
        { label: "Stimulates egg production", value: 9.2 },
      ],
      "IGF-1 LR3": [
        { label: "Muscle Hypertrophy", value: 8.8 },
        { label: "Recovery Enhancement", value: 8.2 },
        { label: "Protein Synthesis", value: 8.5 },
      ],
      Ipamorelin: [
        { label: "Growth Hormone", value: 7.8 },
        { label: "Muscle Development", value: 7.2 },
        { label: "Recovery", value: 7.5 },
      ],
      Kisspeptin: [
        { label: "Fertility Enhancement", value: 7.8 },
        { label: "Ovulation Induction", value: 8.2 },
        { label: "Hormone Regulation", value: 7.5 },
      ],
      "Melanotan-2": [
        { label: "Skin Pigmentation", value: 9.0 },
        { label: "Sexual Function", value: 7.8 },
        { label: "Appetite Suppression", value: 6.5 },
      ],
      "MOTS-c": [
        { label: "Diabetes Prevention", value: 7.2 },
        { label: "Metabolic Enhancement", value: 9.0 },
        { label: "Physical Performance", value: 7.0 },
      ],
      "NAD+": [
        { label: "Cognitive Enhancement", value: 6.8 },
        { label: "Energy & Performance", value: 7.2 },
        { label: "Cellular Health", value: 7.5 },
      ],
      "Oxytocin Acetate": [
        { label: "Labor Induction", value: 9.5 },
        { label: "Hemorrhage Prevention", value: 9.0 },
        { label: "Social Cognition", value: 8.0 },
      ],
      "PEG-MGF": [
        { label: "Muscle Fiber Growth", value: 8.2 },
        { label: "Satellite Cell Activation", value: 8.5 },
        { label: "Recovery Enhancement", value: 8.0 },
      ],
      "PNC-27": [
        { label: "Cancer Cell Targeting", value: 10.0 },
        { label: "Cellular Selectivity", value: 10.0 },
        { label: "Membrane Disruption", value: 10.0 },
      ],
      "PT-141": [
        { label: "Sexual Desire", value: 8.5 },
        { label: "Sexual Satisfaction", value: 8.2 },
        { label: "Distress Reduction", value: 7.5 },
      ],
      Retatrutide: [
        { label: "Weight Loss", value: 9.2 },
        { label: "Glucose Control", value: 8.5 },
        { label: "Cardiovascular Protection", value: 8.2 },
      ],
      Selank: [
        { label: "Anxiety Reduction", value: 7.2 },
        { label: "Memory Enhancement", value: 6.8 },
        { label: "Focus Improvement", value: 7.0 },
      ],
      Semaglutide: [
        { label: "Weight Loss", value: 9.0 },
        { label: "Glucose Control", value: 9.2 },
        { label: "Cardiovascular Protection", value: 8.8 },
      ],
      Semax: [
        { label: "Memory Enhancement", value: 7.5 },
        { label: "Focus Improvement", value: 7.8 },
        { label: "Neuroprotection", value: 7.2 },
      ],
      Sermorelin: [
        { label: "Growth Velocity", value: 7.5 },
        { label: "Lean Mass Increase", value: 7.2 },
        { label: "Fat Reduction", value: 6.8 },
      ],
      "SLU-PP-332": [
        { label: "Appetite Suppression", value: 6.0 },
        { label: "Energy Expenditure", value: 10.0 },
        { label: "Fat Oxidation", value: 10.0 },
      ],
      "SNAP-8": [
        { label: "Wrinkle Reduction", value: 6.8 },
        { label: "Muscle Contraction Reduction", value: 7.2 },
        { label: "Skin Elasticity", value: 6.5 },
      ],
      "SS-31": [
        { label: "Mitochondrial Function", value: 8.5 },
        { label: "ATP Production", value: 8.2 },
        { label: "Cardiac Protection", value: 7.8 },
      ],
      "TB-500": [
        { label: "Tissue Repair", value: 8.5 },
        { label: "Recovery Speed", value: 8.2 },
        { label: "Cardiac Protection", value: 7.5 },
      ],
      Tesamorelin: [
        { label: "Visceral Fat Reduction", value: 8.8 },
        { label: "IGF-1 Enhancement", value: 8.2 },
        { label: "Physique", value: 7.8 },
      ],
      "Thymosin Alpha-1": [
        { label: "T-Cell Enhancement", value: 8.2 },
        { label: "Infection Reduction", value: 7.8 },
        { label: "NK Cell Activity", value: 9.0 },
      ],
      Thymulin: [
        { label: "Strengthens immunity", value: 7.2 },
        { label: "Reduces inflammation", value: 6.8 },
        { label: "Restores thymus function", value: 7.5 },
      ],
      Tirzepatide: [
        { label: "Weight Loss", value: 9.5 },
        { label: "Glucose Control", value: 9.2 },
        { label: "Cardiovascular Protection", value: 10.0 },
      ],
    }

    const key = Object.keys(ratingsMap).find((k) => selectedVariant.base_name.toLowerCase().includes(k.toLowerCase()))
    return key
      ? ratingsMap[key]
      : [
          { label: "Efficacy", value: 8.0 },
          { label: "Safety Profile", value: 8.5 },
          { label: "Research Support", value: 7.5 },
        ]
  }

  const getDescription = (productName: string): string => {
    const descriptions: Record<string, string> = {
      "AOD-9604":
        "This modified fragment of human growth hormone has demonstrated remarkable fat-reducing properties in multiple clinical trials, showing the ability to stimulate lipolysis and inhibit lipogenesis without affecting blood sugar or growth. Research has shown it specifically targets stubborn adipose tissue while preserving lean muscle mass, earning recognition as a potential breakthrough in obesity management. Studies have documented significant reductions in body weight and improvements in metabolic markers across diverse patient populations. The peptide has gained attention for its excellent safety profile and lack of adverse effects typically associated with full HGH treatment.",
      "BPC-157":
        "This gastric juice-derived peptide has shown extraordinary healing properties across numerous animal studies, accelerating recovery in tendons, ligaments, muscles, and even nervous system tissue. Research has demonstrated its ability to promote angiogenesis, reduce inflammation, and protect organs from various types of damage including NSAIDs and alcohol. Scientists have documented its success in healing otherwise treatment-resistant injuries and its unique ability to work both locally and systemically when administered. The peptide has gained significant recognition in the research community for potentially revolutionizing tissue repair and regeneration medicine.",
      Cagrilintide:
        "This long-acting amylin analog has shown impressive results in clinical trials for weight management, particularly when combined with semaglutide in the CagriSema formulation. Research demonstrates its ability to slow gastric emptying, reduce food intake, and improve glycemic control through complementary mechanisms to GLP-1 agonists. Studies have shown weight loss exceeding 15-20% of body weight when used in combination therapy, surpassing results from either component alone. The peptide has gained recognition as a key component in next-generation obesity treatments, with Phase 3 trials showing unprecedented efficacy.",
      "CJC-1295":
        "This growth hormone releasing hormone analog has demonstrated the ability to significantly increase growth hormone and IGF-1 levels for extended periods through a single weekly injection. Research has shown improvements in body composition, including increased muscle mass and reduced body fat, along with enhanced sleep quality and recovery. Studies have documented its superior pharmacokinetics compared to traditional GHRH peptides, maintaining elevated GH levels for several days. The peptide has gained recognition for its potential in age-related decline management and performance optimization research.",
      DSIP: "Delta sleep-inducing peptide has shown remarkable effects on sleep architecture in research studies, promoting deeper, more restorative sleep phases and normalizing circadian rhythms. Studies have demonstrated its ability to reduce stress, modulate pain perception, and exhibit neuroprotective properties beyond its sleep-inducing effects. Research has documented improvements in sleep quality without the grogginess or dependency issues associated with traditional sleep medications. The peptide has gained attention for its potential in treating various sleep disorders and stress-related conditions through natural sleep pattern restoration.",
      Epithalon:
        "This synthetic tetrapeptide has demonstrated extraordinary anti-aging properties in research, including the ability to activate telomerase and extend telomere length in human cells. Studies have shown increased lifespan in animal models by up to 25%, along with improvements in melatonin production and circadian rhythm regulation. Research has documented its ability to normalize various age-related biomarkers and reduce the incidence of spontaneous tumors in aging organisms. The peptide has gained international recognition as one of the most promising longevity compounds, with human studies showing improvements in cardiovascular, immune, and endocrine function.",
      "GHK-Cu":
        "This copper peptide complex has shown remarkable regenerative properties in extensive research, demonstrating the ability to stimulate collagen production, improve skin elasticity, and accelerate wound healing. Studies have documented its powerful antioxidant and anti-inflammatory effects, along with the ability to activate over 4,000 genes associated with regeneration and healing. Research has shown significant improvements in skin thickness, reduction of fine lines and wrinkles, and enhanced hair growth in clinical trials. The peptide has gained widespread recognition in dermatology and cosmetic medicine for its multi-faceted approach to tissue regeneration and anti-aging.",
      "GHRP-2":
        "This growth hormone releasing peptide has demonstrated potent stimulation of growth hormone release in numerous studies, showing increases of up to 7-15 fold in GH levels. Research has documented improvements in muscle mass, bone density, and cardiac function, along with enhanced recovery from injuries and exercise. Studies have shown its ability to increase appetite and improve body composition in various clinical conditions including aging and muscle wasting. The peptide has gained recognition for its reliability and consistency in stimulating the natural GH axis without suppression.",
      HCG: "Human chorionic gonadotropin has shown remarkable efficacy in research for restoring testosterone production and maintaining fertility during hormone replacement therapy. Studies have demonstrated its ability to prevent testicular atrophy, maintain sperm production, and optimize hormone levels in hypogonadal men. Research has documented its success in weight loss protocols when combined with caloric restriction, showing preferential fat loss while preserving lean muscle. The peptide has gained widespread recognition in reproductive medicine and hormone optimization, with decades of clinical use supporting its safety and efficacy.",
      Hexarelin:
        "This synthetic hexapeptide has demonstrated powerful growth hormone releasing properties along with unique cardioprotective effects not seen with other GHRPs. Research has shown its ability to improve cardiac output, reduce fibrosis, and protect heart tissue from ischemic damage through GH-independent mechanisms. Studies have documented improvements in body composition, bone density, and muscle strength comparable to other growth hormone therapies. The peptide has gained particular recognition for its dual benefits in both performance enhancement research and cardiovascular medicine applications.",
      Kisspeptin:
        "This hypothalamic peptide has shown remarkable ability to stimulate the reproductive hormone cascade in research, effectively triggering GnRH release and subsequent LH/FSH production. Studies have demonstrated its success in treating hypothalamic amenorrhea, improving fertility outcomes, and regulating reproductive function in both males and females. Research has documented its role in puberty initiation and its potential for treating various reproductive disorders without the side effects of direct hormone administration. The peptide has gained significant recognition as a master regulator of reproduction and a promising fertility treatment option.",
      Ipamorelin:
        "This selective growth hormone secretagogue has demonstrated excellent GH-releasing properties with minimal side effects in extensive research studies. Studies have shown consistent increases in GH and IGF-1 levels without significantly affecting cortisol or prolactin, making it one of the cleanest GHRP options available. Research has documented improvements in body composition, bone density, and sleep quality, with particularly good tolerability in elderly populations. The peptide has gained recognition as the gold standard for selective GH stimulation due to its specificity and favorable safety profile.",
      "IGF-1 LR3":
        "This modified insulin-like growth factor has shown exceptional anabolic properties in research, demonstrating 2-3 times greater potency than regular IGF-1 with a significantly extended half-life. Studies have documented dramatic increases in muscle cell proliferation and differentiation, along with enhanced nutrient shuttling and protein synthesis. Research has shown its ability to promote muscle growth even under caloric restriction and accelerate recovery from muscle damage. The peptide has gained recognition in muscle physiology research for its potential in treating muscle wasting conditions and understanding growth mechanisms.",
      HGH: "Human growth hormone has demonstrated profound effects across thousands of research studies, showing improvements in body composition, bone density, skin quality, and metabolic function. Research has documented its ability to increase lean muscle mass by 8-14% while reducing body fat by similar percentages in clinical trials. Studies have shown significant improvements in exercise capacity, cognitive function, and quality of life measures in GH-deficient adults. The hormone has gained recognition as one of the most powerful anti-aging and performance-enhancing substances studied, with decades of research supporting its diverse benefits.",
      "Oxytocin Acetate":
        "This neuropeptide has shown remarkable effects on social bonding, trust, and emotional regulation in numerous research studies. Studies have demonstrated its ability to reduce anxiety, improve autism spectrum disorder symptoms, and enhance empathy and social cognition. Research has documented its role in pair bonding, maternal behavior, and its potential for treating social dysfunction and PTSD. The peptide has gained recognition beyond its traditional role in childbirth, emerging as a key molecule in understanding and treating social and emotional disorders.",
      "NAD+":
        "This crucial coenzyme has demonstrated powerful effects on cellular energy production and longevity pathways in extensive research. Studies have shown its ability to activate sirtuins, improve mitochondrial function, and enhance DNA repair mechanisms, with supplementation reversing age-related decline in multiple organ systems. Research has documented improvements in cognitive function, cardiovascular health, and metabolic efficiency with NAD+ restoration. The molecule has gained tremendous recognition in anti-aging research, with Nobel Prize-winning scientists highlighting its central role in cellular health and longevity.",
      "MOTS-c":
        "This mitochondrial-derived peptide has shown impressive metabolic benefits in research, demonstrating the ability to prevent diet-induced obesity and improve insulin sensitivity. Studies have documented its exercise-mimetic properties, enhancing glucose utilization and fatty acid metabolism even in sedentary models. Research has shown its potential in preventing age-related metabolic decline and improving physical performance in both young and aged subjects. The peptide has gained recognition as a key player in mitochondrial-nuclear communication and a promising target for metabolic disease treatment.",
      "Melanotan-2":
        "This synthetic melanocortin has demonstrated powerful tanning effects in research, stimulating melanin production without UV exposure and providing potential photoprotection. Studies have shown additional benefits including appetite suppression, enhanced libido, and erectile function improvements through melanocortin receptor activation. Research has documented its ability to produce lasting tan with minimal dosing and its potential in preventing skin cancer in high-risk populations. The peptide has gained recognition for its dual cosmetic and functional benefits, though research continues on optimizing its selectivity.",
      Retatrutide:
        "This triple agonist peptide targeting GLP-1, GIP, and glucagon receptors has shown unprecedented weight loss results in clinical trials, with participants losing up to 24% of body weight. Research has demonstrated superior efficacy compared to dual agonist approaches, with additional benefits on liver fat reduction and metabolic parameters. Studies have documented improvements in cardiovascular risk factors, including significant reductions in blood pressure and inflammatory markers. The peptide has gained recognition as potentially the most effective pharmaceutical intervention for obesity ever developed, with Phase 3 trials generating enormous anticipation.",
      "PT-141":
        "This melanocortin receptor agonist has demonstrated unique effects on sexual arousal and desire through central nervous system mechanisms rather than vascular effects. Research has shown significant improvements in sexual dysfunction in both men and women, with FDA approval for hypoactive sexual desire disorder in premenopausal women. Studies have documented its ability to enhance libido and sexual satisfaction without affecting blood pressure or heart rate like traditional erectile dysfunction medications. The peptide has gained recognition as the first and only FDA-approved treatment for sexual desire disorders, working through novel brain-based pathways.",
      "PEG-MGF":
        "This pegylated mechano growth factor has shown impressive muscle regeneration properties in research, demonstrating superior stability and duration compared to regular MGF. Studies have documented its ability to activate satellite cells, promote muscle fiber hypertrophy, and accelerate recovery from muscle damage. Research has shown particular efficacy in age-related muscle loss and injury recovery, with localized effects allowing targeted muscle development. The peptide has gained recognition in sports medicine research for its potential in treating muscle injuries and age-related sarcopenia.",
      "PNC-27":
        "This anticancer peptide has demonstrated selective cytotoxicity against cancer cells in laboratory studies while leaving healthy cells unharmed. Research has shown its ability to bind to HDM-2 proteins in cancer cell membranes, creating pores that lead to rapid tumor cell death. Studies have documented efficacy against various cancer types including pancreatic, breast, and leukemia cells in preclinical models. The peptide has gained attention in oncology research for its novel mechanism of action and potential as a targeted cancer therapy with minimal side effects.",
      Sermorelin:
        "This growth hormone releasing hormone analog has demonstrated excellent ability to restore natural GH production in clinical studies. Research has shown improvements in body composition, energy levels, and sleep quality comparable to HGH therapy but with better preservation of natural feedback mechanisms. Studies have documented its safety and efficacy in treating adult growth hormone deficiency and age-related decline in GH production. The peptide has gained FDA approval and widespread recognition as a physiological approach to GH restoration that maintains normal pituitary function.",
      Semax:
        "This synthetic heptapeptide has shown remarkable cognitive enhancement and neuroprotective properties in extensive Russian and European research. Studies have demonstrated improvements in memory, attention, and learning capacity, along with significant neuroprotection in stroke and traumatic brain injury models. Research has documented its ability to increase BDNF levels, modulate the immune system, and exhibit antidepressant effects without typical side effects. The peptide has gained recognition as one of the most promising nootropic compounds, with decades of clinical use in Russia supporting its safety and efficacy.",
      Semaglutide:
        "This GLP-1 receptor agonist has demonstrated outstanding results in diabetes and obesity treatment, with studies showing average weight loss of 15-17% in non-diabetic individuals. Research has shown significant improvements in cardiovascular outcomes, reducing major adverse cardiac events by 20% in high-risk patients. Studies have documented its ability to improve glycemic control, reduce appetite, and potentially protect against neurodegenerative diseases. The peptide has gained FDA approval for both diabetes and weight management, becoming one of the most prescribed and studied medications in metabolic medicine.",
      Selank:
        "This anxiolytic heptapeptide has shown impressive anti-anxiety effects in research without the sedation or addiction potential of benzodiazepines. Studies have demonstrated its ability to modulate neurotransmitter levels, enhance cognitive function, and exhibit immunomodulatory properties. Research has documented improvements in generalized anxiety disorder, depression, and cognitive performance under stress. The peptide has gained recognition particularly in Russian medical practice, where it has been used clinically for decades with an excellent safety profile.",
      Tesamorelin:
        "This growth hormone releasing hormone analog has demonstrated specific efficacy in reducing visceral adipose tissue in HIV-associated lipodystrophy. Research has shown average reductions in visceral fat of 15-20% while preserving subcutaneous fat and muscle mass. Studies have documented improvements in cardiovascular risk markers, liver fat content, and cognitive function in treated patients. The peptide has gained FDA approval for lipodystrophy and recognition for its potential in treating metabolic dysfunction and age-related cognitive decline.",
      "SNAP-8":
        "This octapeptide has shown impressive anti-wrinkle effects in cosmetic research, demonstrating the ability to reduce expression lines by up to 35% through neuromuscular modulation. Studies have documented its mechanism of inhibiting SNARE complex formation, providing a topical alternative to botulinum toxin injections. Research has shown cumulative improvements in skin smoothness and wrinkle depth with continued use over 28-60 days. The peptide has gained widespread recognition in cosmetic formulations as a safer, non-invasive approach to expression line reduction.",
      "SS-31":
        "This mitochondria-targeting peptide has demonstrated powerful protective effects against oxidative stress and mitochondrial dysfunction in numerous studies. Research has shown its ability to preserve mitochondrial function in heart failure, kidney disease, and neurodegenerative conditions, with some studies showing 50% reduction in infarct size after cardiac events. Studies have documented improvements in ATP production, reduced reactive oxygen species, and protection of mitochondrial DNA. The peptide has gained recognition as one of the most promising mitochondrial therapeutics, with multiple clinical trials showing benefits in age-related diseases.",
      "TB-500":
        "This synthetic version of thymosin beta-4 has shown exceptional healing and regenerative properties across multiple tissue types in research. Studies have demonstrated accelerated wound healing, reduced inflammation, and improved cardiac function following injury, with some research showing 2-3 fold faster recovery times. Research has documented its ability to promote angiogenesis, cell migration, and stem cell differentiation in damaged tissues. The peptide has gained significant recognition in regenerative medicine and sports medicine research for its broad-spectrum healing effects and excellent safety profile.",
      "Thymosin Alpha-1":
        "This immunomodulatory peptide has demonstrated powerful effects on immune system function in extensive clinical research. Studies have shown enhanced T-cell function, improved vaccine responses, and significant benefits in treating hepatitis B and C, with some studies showing viral clearance rates double that of standard therapy. Research has documented its ability to restore immune function in immunocompromised patients and reduce mortality in severe sepsis. The peptide has gained approval in over 30 countries and recognition as a key therapeutic for immune dysfunction and viral infections.",
      Thymulin:
        "This thymic hormone has demonstrated crucial roles in T-cell differentiation and immune system maturation in extensive immunological research. Studies have shown its ability to restore immune function in thymectomized animals and aging subjects, with significant improvements in T-cell subset ratios and cytokine production. Research has documented its zinc-dependent activity and its potential in treating autoimmune conditions, with some studies showing normalization of immune responses in conditions like rheumatoid arthritis and multiple sclerosis. The peptide has gained recognition for its role as a master regulator of T-cell development and its therapeutic potential in age-related immune decline and immunodeficiency disorders.",
      Tirzepatide:
        "This dual GIP/GLP-1 receptor agonist has demonstrated superior weight loss and glycemic control compared to selective GLP-1 agonists in landmark clinical trials. Research has shown average weight loss of 20-22.5% at the highest doses, exceeding results from any previously approved obesity medication. Studies have documented unprecedented improvements in HbA1c levels, with over 90% of participants achieving glycemic targets, along with benefits on liver fat and cardiovascular risk factors. The peptide has gained FDA approval for both diabetes and obesity treatment, with many experts considering it a game-changer in metabolic medicine.",
    }

    const key = Object.keys(descriptions).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
    return key
      ? descriptions[key]
      : selectedVariant.description ||
          "Research-grade peptide with documented efficacy in clinical studies. Consult research literature for detailed information on mechanisms of action and potential applications."
  }

  // Use database ratings if available, otherwise fall back to hardcoded
  const ratings = (groupedProduct.ratings && groupedProduct.ratings.length > 0)
    ? groupedProduct.ratings
    : getProductRatings(selectedVariant.base_name)
  const description = getDescription(selectedVariant.base_name)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl h-[80vh] md:h-[85vh] overflow-hidden border-border bg-background/90 p-0 text-foreground backdrop-blur-2xl sm:rounded-[2.5rem] duration-500 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-10">
        <DialogDescription className="sr-only">
          Product details and purchase options for {selectedVariant.base_name}
        </DialogDescription>

        <div className="h-full">
          {/* Mobile: Full Card Flip */}
          <MobileFlipCard
            groupedProduct={groupedProduct}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            retailPrice={retailPrice}
            ratings={ratings}
            description={description}
            addItem={addItem}
            onClose={onClose}
          />

          {/* Desktop: Carousel Slide */}
          <div className="hidden md:grid h-full gap-0 grid-cols-2">
            <div className="relative w-full h-full overflow-hidden cursor-pointer bg-background" onClick={handleSlide}>
              {/* Ratings Panel */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl transition-transform ease-in-out"
                style={{
                  transform: `translateX(${slidePositions[0]}%)`,
                  transitionDuration: slidePositions[0] === -100 ? "0ms" : "700ms",
                  zIndex: slidePositions[0] === 0 ? 10 : 0,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`,
                  }}
                />

                <div className="w-full max-w-md space-y-6 relative z-10 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2 tracking-tight">{groupedProduct.category}</h3>
                    <p className="text-foreground/60 text-sm uppercase tracking-widest">Research Grade Analysis</p>
                  </div>

                  <div className="space-y-6">
                    {ratings.map((rating, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold tracking-wide text-foreground/80">{rating.label}</span>
                          <span className="font-mono text-lg font-bold" style={{ color: selectedVariant.color }}>
                            {rating.value.toFixed(1)}
                          </span>
                        </div>
                        <div className="relative h-4 w-full overflow-hidden rounded-full bg-foreground/5 backdrop-blur-md border border-border">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_currentColor]"
                            style={{
                              width: `${(rating.value / 10) * 100}%`,
                              backgroundColor: selectedVariant.color,
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Description Panel */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl transition-transform ease-in-out"
                style={{
                  transform: `translateX(${slidePositions[1]}%)`,
                  transitionDuration: slidePositions[1] === -100 ? "0ms" : "700ms",
                  zIndex: slidePositions[1] === 0 ? 10 : 0,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${selectedVariant.color}, transparent 70%)`,
                  }}
                />

                <div className="w-full max-w-md space-y-6 text-center relative z-10">
                  <h3 className="text-3xl font-bold tracking-tight">{selectedVariant.base_name}</h3>
                  <div className="h-1 w-20 bg-foreground/20 mx-auto rounded-full" />
                  <p className="text-lg leading-relaxed text-white/90">{description}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Desktop Right Panel */}
            <div className="flex flex-col p-8 h-full overflow-hidden bg-background/90 relative">
              <DialogHeader className="mb-6 space-y-4 text-left flex-shrink-0">
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
                  <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    {selectedVariant.base_name}
                  </DialogTitle>
                  <p className="text-lg md:text-xl font-medium text-foreground/70">{selectedVariant.variant}</p>
                </div>
              </DialogHeader>

              {groupedProduct.variants.length > 1 && (
                <div className="mb-4 flex-shrink-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Select Variant</p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {groupedProduct.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant)
                          setQuantity(1)
                        }}
                        className={`px-4 py-3 md:px-5 md:py-2 rounded-xl text-sm font-medium transition-all border flex-1 md:flex-none justify-center text-center min-w-[100px] ${
                          selectedVariant.id === variant.id
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(58,66,51,0.2)]"
                            : "bg-foreground/5 text-foreground/70 border-border hover:bg-foreground/10 hover:border-border"
                        }`}
                      >
                        <span className="block text-xs opacity-70 mb-0.5 md:hidden">Variant</span>
                        {variant.variant}
                        <span className="block md:inline md:ml-2 font-bold md:font-normal text-xs md:text-sm opacity-90 md:opacity-100">
                          ${Number.parseFloat(variant.retail_price).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 flex-shrink-0">
                <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-md p-4 md:p-6 flex items-center justify-between">
                  <span className="text-sm text-foreground/60">Price</span>
                  <span className="font-mono text-3xl font-bold text-foreground">${retailPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-auto space-y-4 border-t border-border pt-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/5 backdrop-blur-md px-4 py-2 w-full sm:w-auto justify-between">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-foreground/60 hover:text-foreground transition-colors p-1 text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono text-lg font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.current_stock, quantity + 1))}
                      className="text-foreground/60 hover:text-foreground transition-colors p-1 text-lg"
                      disabled={quantity >= selectedVariant.current_stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-right w-full sm:w-auto">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Total Price</p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      ${(retailPrice * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="h-12 md:h-14 w-full bg-primary text-primary-foreground hover:bg-card/90 text-base md:text-lg font-bold tracking-widest disabled:opacity-50 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={selectedVariant.current_stock === 0}
                  onClick={async () => {
                    try {
                      await addItem(selectedVariant, quantity)
                      onClose()
                      toast("Item added to cart!", {
                        description: `${quantity} x ${selectedVariant.base_name} (${selectedVariant.variant})`,
                        action: {
                          label: "View Cart",
                          onClick: () => {
                            window.location.href = '/cart'
                          },
                        },
                      })
                    } catch (error) {
                      toast("Failed to add item to cart", {
                        description: error instanceof Error ? error.message : "Please try again"
                      })
                    }
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {selectedVariant.current_stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
