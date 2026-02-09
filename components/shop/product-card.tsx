'use client'

import { Product } from '@/types/shop'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/shop/ui/card'
import { Button } from '@/components/shop/ui/button'
import { Badge } from '@/components/shop/ui/badge'
import Image from 'next/image'
import { useState } from 'react'
import { ProductModal } from './product-modal'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'

interface GroupedProduct {
  base_name: string
  variants: Product[]
  lowestPrice: number
  category: string
  color: string
}

interface ProductCardProps {
  groupedProduct: GroupedProduct
}

export function ProductCard({ groupedProduct }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { addItem } = useCartStore()
  
  const primaryProduct = groupedProduct.variants[0]
  const price = groupedProduct.lowestPrice

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)

  // Handle quick add (adds first variant)
  const handleQuickAdd = async () => {
    try {
      await addItem(primaryProduct, 1)
      toast.success(`Added ${primaryProduct.name} to cart`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
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
    return ratingsMap[productName] || []
  }

  const getCategory = (productName: string) => {
    const categoryMap: Record<string, string> = {
      "AOD-9604": "Fat Loss/Metabolism",
      "BPC-157": "Healing/Recovery",
      "Cagrilintide": "Weight Management/Appetite",
      "CJC-1295": "Growth Hormone Releasing",
      "DSIP": "Sleep/Recovery",
      "Epithalon": "Anti-Aging/Longevity",
      "GHK-Cu": "Skin/Hair/Anti-Aging",
      "GHRP-2": "Growth Hormone Releasing",
      "HCG": "Hormone/Fertility",
      "Hexarelin": "Growth Hormone Releasing",
      "Kisspeptin": "Hormone/Fertility",
      "Ipamorelin": "Growth Hormone Releasing",
      "IGF-1 LR3": "Growth Factor/Muscle",
      "HGH": "Growth Hormone",
      "Oxytocin Acetate": "Hormone/Social/Mood",
      "NAD+": "Cellular Energy/Anti-Aging",
      "MOTS-c": "Mitochondrial/Metabolism",
      "Melanotan-2": "Tanning/Libido",
      "Retatrutide": "Weight Management/GLP-1",
      "PT-141": "Sexual Function",
      "PEG-MGF": "Growth Factor/Muscle",
      "PNC-27": "Anti-Cancer Research",
      "Sermorelin": "Growth Hormone Releasing",
      "Semax": "Cognitive/Neuroprotective",
      "Semaglutide": "Weight Management/GLP-1",
      "Selank": "Anxiety/Cognitive",
      "Tesamorelin": "Growth Hormone Releasing",
      "SNAP-8": "Cosmetic/Anti-Wrinkle",
      "Thymosin Alpha-1": "Immune Support",
      "SLU-PP-332": "Exercise Mimetic/Metabolism",
      "SS-31": "Mitochondrial/Anti-Aging",
      "TB-500": "Healing/Recovery",
      "Tirzepatide": "Weight Management/GLP-1/GIP"
    }
    
    const key = Object.keys(categoryMap).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
    return key ? categoryMap[key] : "Research Peptide"
  }

  const getDescription = (productName: string): string => {
    const descriptions: Record<string, string> = {
      "AOD-9604": "This modified fragment of human growth hormone has demonstrated remarkable fat-reducing properties in multiple clinical trials, showing the ability to stimulate lipolysis and inhibit lipogenesis without affecting blood sugar or growth. Research has shown it specifically targets stubborn adipose tissue while preserving lean muscle mass, earning recognition as a potential breakthrough in obesity management.",
      "BPC-157": "This gastric juice-derived peptide has shown extraordinary healing properties across numerous animal studies, accelerating recovery in tendons, ligaments, muscles, and even nervous system tissue. Research has demonstrated its ability to promote angiogenesis, reduce inflammation, and protect organs from various types of damage including NSAIDs and alcohol.",
      "Cagrilintide": "This long-acting amylin analog has shown impressive results in clinical trials for weight management, particularly when combined with semaglutide in the CagriSema formulation. Research demonstrates its ability to slow gastric emptying, reduce food intake, and improve glycemic control through complementary mechanisms to GLP-1 agonists.",
      "CJC-1295": "This growth hormone releasing hormone analog has demonstrated the ability to significantly increase growth hormone and IGF-1 levels for extended periods through a single weekly injection. Research has shown improvements in body composition, including increased muscle mass and reduced body fat, along with enhanced sleep quality and recovery.",
      "DSIP": "Delta sleep-inducing peptide has shown remarkable effects on sleep architecture in research studies, promoting deeper, more restorative sleep phases and normalizing circadian rhythms. Studies have demonstrated its ability to reduce stress, modulate pain perception, and exhibit neuroprotective properties beyond its sleep-inducing effects.",
      "Epithalon": "This synthetic tetrapeptide has demonstrated extraordinary anti-aging properties in research, including the ability to activate telomerase and extend telomere length in human cells. Studies have shown increased lifespan in animal models by up to 25%, along with improvements in melatonin production and circadian rhythm regulation.",
      "GHK-Cu": "This copper peptide complex has shown remarkable regenerative properties in extensive research, demonstrating the ability to stimulate collagen production, improve skin elasticity, and accelerate wound healing. Studies have documented its powerful antioxidant and anti-inflammatory effects, along with the ability to activate over 4,000 genes associated with regeneration and healing.",
      "GHRP-2": "This growth hormone releasing peptide has demonstrated potent stimulation of growth hormone release in numerous studies, showing increases of up to 7-15 fold in GH levels. Research has documented improvements in muscle mass, bone density, and cardiac function, along with enhanced recovery from injuries and exercise.",
      "HCG": "Human chorionic gonadotropin has shown remarkable efficacy in research for restoring testosterone production and maintaining fertility during hormone replacement therapy. Studies have demonstrated its ability to prevent testicular atrophy, maintain sperm production, and optimize hormone levels in hypogonadal men.",
      "Hexarelin": "This synthetic hexapeptide has demonstrated powerful growth hormone releasing properties along with unique cardioprotective effects not seen with other GHRPs. Research has shown its ability to improve cardiac output, reduce fibrosis, and protect heart tissue from ischemic damage through GH-independent mechanisms.",
      "Kisspeptin": "This hypothalamic peptide has shown remarkable ability to stimulate the reproductive hormone cascade in research, effectively triggering GnRH release and subsequent LH/FSH production. Studies have demonstrated its success in treating hypothalamic amenorrhea, improving fertility outcomes, and regulating reproductive function in both males and females.",
      "Ipamorelin": "This selective growth hormone secretagogue has demonstrated excellent GH-releasing properties with minimal side effects in extensive research studies. Studies have shown consistent increases in GH and IGF-1 levels without significantly affecting cortisol or prolactin, making it one of the cleanest GHRP options available.",
      "IGF-1 LR3": "This modified insulin-like growth factor has shown exceptional anabolic properties in research, demonstrating 2-3 times greater potency than regular IGF-1 with a significantly extended half-life. Studies have documented dramatic increases in muscle cell proliferation and differentiation, along with enhanced nutrient shuttling and protein synthesis.",
      "HGH": "Human growth hormone has demonstrated profound effects across thousands of research studies, showing improvements in body composition, bone density, skin quality, and metabolic function. Research has documented its ability to increase lean muscle mass by 8-14% while reducing body fat by similar percentages in clinical trials.",
      "Oxytocin Acetate": "This neuropeptide has shown remarkable effects on social bonding, trust, and emotional regulation in numerous research studies. Studies have demonstrated its ability to reduce anxiety, improve autism spectrum disorder symptoms, and enhance empathy and social cognition.",
      "NAD+": "This crucial coenzyme has demonstrated powerful effects on cellular energy production and longevity pathways in extensive research. Studies have shown its ability to activate sirtuins, improve mitochondrial function, and enhance DNA repair mechanisms, with supplementation reversing age-related decline in multiple organ systems.",
      "MOTS-c": "This mitochondrial-derived peptide has shown impressive metabolic benefits in research, demonstrating the ability to prevent diet-induced obesity and improve insulin sensitivity. Studies have documented its exercise-mimetic properties, enhancing glucose utilization and fatty acid metabolism even in sedentary models.",
      "Melanotan-2": "This synthetic melanocortin has demonstrated powerful tanning effects in research, stimulating melanin production without UV exposure and providing potential photoprotection. Studies have shown additional benefits including appetite suppression, enhanced libido, and erectile function improvements through melanocortin receptor activation.",
      "Retatrutide": "This triple agonist peptide targeting GLP-1, GIP, and glucagon receptors has shown unprecedented weight loss results in clinical trials, with participants losing up to 24% of body weight. Research has demonstrated superior efficacy compared to dual agonist approaches, with additional benefits on liver fat reduction and metabolic parameters.",
      "PT-141": "This melanocortin receptor agonist has demonstrated unique effects on sexual arousal and desire through central nervous system mechanisms rather than vascular effects. Research has shown significant improvements in sexual dysfunction in both men and women, with FDA approval for hypoactive sexual desire disorder in premenopausal women.",
      "PEG-MGF": "This pegylated mechano growth factor has shown impressive muscle regeneration properties in research, demonstrating superior stability and duration compared to regular MGF. Studies have documented its ability to activate satellite cells, promote muscle fiber hypertrophy, and accelerate recovery from muscle damage.",
      "PNC-27": "This anticancer peptide has demonstrated selective cytotoxicity against cancer cells in laboratory studies while leaving healthy cells unharmed. Research has shown its ability to bind to HDM-2 proteins in cancer cell membranes, creating pores that lead to rapid tumor cell death.",
      "Sermorelin": "This growth hormone releasing hormone analog has demonstrated excellent ability to restore natural GH production in clinical studies. Research has shown improvements in body composition, energy levels, and sleep quality comparable to HGH therapy but with better preservation of natural feedback mechanisms.",
      "Semax": "This synthetic heptapeptide has shown remarkable cognitive enhancement and neuroprotective properties in extensive Russian and European research. Studies have demonstrated improvements in memory, attention, and learning capacity, along with significant neuroprotection in stroke and traumatic brain injury models.",
      "Semaglutide": "This GLP-1 receptor agonist has demonstrated outstanding results in diabetes and obesity treatment, with studies showing average weight loss of 15-17% in non-diabetic individuals. Research has shown significant improvements in cardiovascular outcomes, reducing major adverse cardiac events by 20% in high-risk patients.",
      "Selank": "This anxiolytic heptapeptide has shown impressive anti-anxiety effects in research without the sedation or addiction potential of benzodiazepines. Studies have demonstrated its ability to modulate neurotransmitter levels, enhance cognitive function, and exhibit immunomodulatory properties.",
      "Tesamorelin": "This growth hormone releasing hormone analog has demonstrated specific efficacy in reducing visceral adipose tissue in HIV-associated lipodystrophy. Research has shown average reductions in visceral fat of 15-20% while preserving subcutaneous fat and muscle mass.",
      "SNAP-8": "This octapeptide has shown impressive anti-wrinkle effects in cosmetic research, demonstrating the ability to reduce expression lines by up to 35% through neuromuscular modulation. Studies have documented its mechanism of inhibiting SNARE complex formation, providing a topical alternative to botulinum toxin injections.",
      "Thymosin Alpha-1": "This immunomodulatory peptide has demonstrated powerful effects on immune system function in extensive clinical research. Studies have shown enhanced T-cell function, improved vaccine responses, and significant benefits in treating hepatitis B and C, with some studies showing viral clearance rates double that of standard therapy.",
      "SLU-PP-332": "This enhanced exercise mimetic compound represents an evolution of the original SLU-PP-32, demonstrating even more potent activation of exercise-related metabolic pathways in preclinical research. Studies have shown its ability to increase metabolic rate by up to 40% and enhance mitochondrial oxidative capacity equivalent to weeks of endurance training.",
      "SS-31": "This mitochondria-targeting peptide has demonstrated powerful protective effects against oxidative stress and mitochondrial dysfunction in numerous studies. Research has shown its ability to preserve mitochondrial function in heart failure, kidney disease, and neurodegenerative conditions.",
      "TB-500": "This synthetic version of thymosin beta-4 has shown exceptional healing and regenerative properties across multiple tissue types in research. Studies have demonstrated accelerated wound healing, reduced inflammation, and improved cardiac function following injury.",
      "Thymulin": "This thymic hormone has demonstrated crucial roles in T-cell differentiation and immune system maturation in extensive immunological research. Studies have shown its ability to restore immune function in thymectomized animals and aging subjects, with significant improvements in T-cell subset ratios and cytokine production.",
      "Tirzepatide": "This dual GIP/GLP-1 receptor agonist has demonstrated superior weight loss and glycemic control compared to selective GLP-1 agonists in landmark clinical trials. Research has shown average weight loss of 20-22.5% at the highest doses, exceeding results from any previously approved obesity medication.",
    }
    
    const key = Object.keys(descriptions).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
    return key ? descriptions[key] : "Research-grade peptide with documented efficacy in clinical studies. Consult research literature for detailed information on mechanisms of action and potential applications."
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "OUT OF STOCK"
    if (stock < 10) return "LOW STOCK"
    return "IN STOCK"
  }

  // Use database ratings if available, otherwise fall back to hardcoded
  const ratings = (groupedProduct.ratings && groupedProduct.ratings.length > 0)
    ? groupedProduct.ratings
    : getProductRatings(primaryProduct.base_name)
  const category = getCategory(primaryProduct.base_name)
  const description = getDescription(primaryProduct.base_name)

  const totalStock = groupedProduct.variants.reduce((sum, v) => sum + v.current_stock, 0)

  return (
    <>
      <Card 
        className="group relative cursor-pointer overflow-hidden border-white/10 bg-gradient-to-b from-zinc-900 to-black transition-all hover:border-white/20 hover:shadow-2xl"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="relative h-48 md:h-64 p-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="relative flex h-full items-center justify-center p-8">
            <div 
              className={`h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br ${primaryProduct.color || 'from-purple-600 to-blue-600'} p-[2px]`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {primaryProduct.base_name.slice(0, 3).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          {groupedProduct.variants.length > 1 && (
            <Badge className="absolute right-2 top-2 bg-white/10 text-white backdrop-blur">
              {groupedProduct.variants.length} variants
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">{primaryProduct.base_name}</h3>
            <p className="text-sm text-white/60">{primaryProduct.description || "Premium research compound"}</p>
          </div>
          
          {getProductRatings(primaryProduct.base_name).length > 0 && (
            <div className="space-y-2">
              {getProductRatings(primaryProduct.base_name).map((rating) => (
                <div key={rating.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{rating.label}</span>
                  <div className="flex items-center gap-1">
                    <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-400"
                        style={{ width: `${(rating.value / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/80">{rating.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-white/10 p-4 md:p-6">
          <div>
            <p className="text-xs text-white/60">Starting at</p>
            <p className="text-2xl font-bold text-white">${price.toFixed(2)}</p>
          </div>
          <Button 
            size="sm" 
            className="group/button bg-white text-black hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
            }}
          >
            View Options
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groupedProduct={groupedProduct} 
      />
    </>
  )
}
