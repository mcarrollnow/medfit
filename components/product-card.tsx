"use client"

import type { Product } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

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
  const [isHovering, setIsHovering] = useState(false)
  const router = useRouter()

  const primaryProduct = groupedProduct.variants[0]
  const price = groupedProduct.lowestPrice

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)
  
  const handleClick = () => {
    // Navigate to product page using the first variant's ID
    router.push(`/products/${primaryProduct.id}`)
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
      Thymosin: [
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

    const key = Object.keys(ratingsMap).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
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
        "This modified fragment of human growth hormone has demonstrated remarkable fat-reducing properties in multiple clinical trials, showing the ability to stimulate lipolysis and inhibit lipogenesis without affecting blood sugar or growth. Research has shown it specifically targets stubborn adipose tissue while preserving lean muscle mass, earning recognition as a potential breakthrough in obesity management.",
      "BPC-157":
        "This gastric juice-derived peptide has shown extraordinary healing properties across numerous animal studies, accelerating recovery in tendons, ligaments, muscles, and even nervous system tissue. Research has demonstrated its ability to promote angiogenesis, reduce inflammation, and protect organs from various types of damage including NSAIDs and alcohol.",
      Cagrilintide:
        "This long-acting amylin analog has shown impressive results in clinical trials for weight management, particularly when combined with semaglutide in the CagriSema formulation. Research demonstrates its ability to slow gastric emptying, reduce food intake, and improve glycemic control through complementary mechanisms to GLP-1 agonists.",
      "CJC-1295":
        "This growth hormone releasing hormone analog has demonstrated the ability to significantly increase growth hormone and IGF-1 levels for extended periods through a single weekly injection. Research has shown improvements in body composition, including increased muscle mass and reduced body fat, along with enhanced sleep quality and recovery.",
      DSIP: "Delta sleep-inducing peptide has shown remarkable effects on sleep architecture in research studies, promoting deeper, more restorative sleep phases and normalizing circadian rhythms. Studies have demonstrated its ability to reduce stress, modulate pain perception, and exhibit neuroprotective properties beyond its sleep-inducing effects.",
      Epithalon:
        "This synthetic tetrapeptide has demonstrated extraordinary anti-aging properties in research, including the ability to activate telomerase and extend telomere length in human cells. Studies have shown increased lifespan in animal models by up to 25%, along with improvements in melatonin production and circadian rhythm regulation.",
      "GHK-Cu":
        "This copper peptide complex has shown remarkable regenerative properties in extensive research, demonstrating the ability to stimulate collagen production, improve skin elasticity, and accelerate wound healing. Studies have documented its powerful antioxidant and anti-inflammatory effects, along with the ability to activate over 4,000 genes associated with regeneration and healing.",
      "GHRP-2":
        "This growth hormone releasing peptide has demonstrated potent stimulation of growth hormone release in numerous studies, showing increases of up to 7-15 fold in GH levels. Research has documented improvements in muscle mass, bone density, and cardiac function, along with enhanced recovery from injuries and exercise.",
      HCG: "Human chorionic gonadotropin has shown remarkable efficacy in research for restoring testosterone production and maintaining fertility during hormone replacement therapy. Studies have demonstrated its ability to prevent testicular atrophy, maintain sperm production, and optimize hormone levels in hypogonadal men.",
      Hexarelin:
        "This synthetic hexapeptide has demonstrated powerful growth hormone releasing properties along with unique cardioprotective effects not seen with other GHRPs. Research has shown its ability to improve cardiac output, reduce fibrosis, and protect heart tissue from ischemic damage through GH-independent mechanisms.",
      Kisspeptin:
        "This hypothalamic peptide has shown remarkable ability to stimulate the reproductive hormone cascade in research, effectively triggering GnRH release and subsequent LH/FSH production. Studies have demonstrated its success in treating hypothalamic amenorrhea, improving fertility outcomes, and regulating reproductive function in both males and females.",
      Ipamorelin:
        "This selective growth hormone secretagogue has demonstrated excellent GH-releasing properties with minimal side effects in extensive research studies. Studies have shown consistent increases in GH and IGF-1 levels without significantly affecting cortisol or prolactin, making it one of the cleanest GHRP options available.",
      "IGF-1 LR3":
        "This modified insulin-like growth factor has shown exceptional anabolic properties in research, demonstrating 2-3 times greater potency than regular IGF-1 with a significantly extended half-life. Studies have documented dramatic increases in muscle cell proliferation and differentiation, along with enhanced nutrient shuttling and protein synthesis.",
      HGH: "Human growth hormone has demonstrated profound effects across thousands of research studies, showing improvements in body composition, bone density, skin quality, and metabolic function. Research has documented its ability to increase lean muscle mass by 8-14% while reducing body fat by similar percentages in clinical trials.",
      "Oxytocin Acetate":
        "This neuropeptide has shown remarkable effects on social bonding, trust, and emotional regulation in numerous research studies. Studies have demonstrated its ability to reduce anxiety, improve autism spectrum disorder symptoms, and enhance empathy and social cognition.",
      "NAD+":
        "This crucial coenzyme has demonstrated powerful effects on cellular energy production and longevity pathways in extensive research. Studies have shown its ability to activate sirtuins, improve mitochondrial function, and enhance DNA repair mechanisms, with supplementation reversing age-related decline in multiple organ systems.",
      "MOTS-c":
        "This mitochondrial-derived peptide has shown impressive metabolic benefits in research, demonstrating the ability to prevent diet-induced obesity and improve insulin sensitivity. Studies have documented its exercise-mimetic properties, enhancing glucose utilization and fatty acid metabolism even in sedentary models.",
      "Melanotan-2":
        "This synthetic melanocortin has demonstrated powerful tanning effects in research, stimulating melanin production without UV exposure and providing potential photoprotection. Studies have shown additional benefits including appetite suppression, enhanced libido, and erectile function improvements through melanocortin receptor activation.",
      Retatrutide:
        "This triple agonist peptide targeting GLP-1, GIP, and glucagon receptors has shown unprecedented weight loss results in clinical trials, with participants losing up to 24% of body weight. Research has demonstrated superior efficacy compared to dual agonist approaches, with additional benefits on liver fat reduction and metabolic parameters.",
      "PT-141":
        "This melanocortin receptor agonist has demonstrated unique effects on sexual arousal and desire through central nervous system mechanisms rather than vascular effects. Research has shown significant improvements in sexual dysfunction in both men and women, with FDA approval for hypoactive sexual desire disorder in premenopausal women.",
      "PEG-MGF":
        "This pegylated mechano growth factor has shown impressive muscle regeneration properties in research, demonstrating superior stability and duration compared to regular MGF. Studies have documented its ability to activate satellite cells, promote muscle fiber hypertrophy, and accelerate recovery from muscle damage.",
      "PNC-27":
        "This anticancer peptide has demonstrated selective cytotoxicity against cancer cells in laboratory studies while leaving healthy cells unharmed. Research has shown its ability to bind to HDM-2 proteins in cancer cell membranes, creating pores that lead to rapid tumor cell death.",
      Sermorelin:
        "This growth hormone releasing hormone analog has demonstrated excellent ability to restore natural GH production in clinical studies. Research has shown improvements in body composition, energy levels, and sleep quality comparable to HGH therapy but with better preservation of natural feedback mechanisms.",
      Semax:
        "This synthetic heptapeptide has shown remarkable cognitive enhancement and neuroprotective properties in extensive Russian and European research. Studies have demonstrated improvements in memory, attention, and learning capacity, along with significant neuroprotection in stroke and traumatic brain injury models.",
      Semaglutide:
        "This GLP-1 receptor agonist has demonstrated outstanding results in diabetes and obesity treatment, with studies showing average weight loss of 15-17% in non-diabetic individuals. Research has shown significant improvements in cardiovascular outcomes, reducing major adverse cardiac events by 20% in high-risk patients.",
      Selank:
        "This anxiolytic heptapeptide has shown impressive anti-anxiety effects in research without the sedation or addiction potential of benzodiazepines. Studies have demonstrated its ability to modulate neurotransmitter levels, enhance cognitive function, and exhibit immunomodulatory properties.",
      Tesamorelin:
        "This growth hormone releasing hormone analog has demonstrated specific efficacy in reducing visceral adipose tissue in HIV-associated lipodystrophy. Research has shown average reductions in visceral fat of 15-20% while preserving subcutaneous fat and muscle mass.",
      "SNAP-8":
        "This octapeptide has shown impressive anti-wrinkle effects in cosmetic research, demonstrating the ability to reduce expression lines by up to 35% through neuromuscular modulation. Studies have documented its mechanism of inhibiting SNARE complex formation, providing a topical alternative to botulinum toxin injections.",
      "Thymosin Alpha-1":
        "This immunomodulatory peptide has demonstrated powerful effects on immune system function in extensive clinical research. Studies have shown enhanced T-cell function, improved vaccine responses, and significant benefits in treating hepatitis B and C, with some studies showing viral clearance rates double that of standard therapy.",
      "SLU-PP-332":
        "This enhanced exercise mimetic compound represents an evolution of the original SLU-PP-32, demonstrating even more potent activation of exercise-related metabolic pathways in preclinical research. Studies have shown its ability to increase metabolic rate by up to 40% and enhance mitochondrial oxidative capacity equivalent to weeks of endurance training.",
      "SS-31":
        "This mitochondria-targeting peptide has demonstrated powerful protective effects against oxidative stress and mitochondrial dysfunction in numerous studies. Research has shown its ability to preserve mitochondrial function in heart failure, kidney disease, and neurodegenerative conditions.",
      "TB-500":
        "This synthetic version of thymosin beta-4 has shown exceptional healing and regenerative properties across multiple tissue types in research. Studies have demonstrated accelerated wound healing, reduced inflammation, and improved cardiac function following injury.",
      Thymulin:
        "This thymic hormone has demonstrated crucial roles in T-cell differentiation and immune system maturation in extensive immunological research. Studies have shown its ability to restore immune function in thymectomized animals and aging subjects, with significant improvements in T-cell subset ratios and cytokine production.",
      Tirzepatide:
        "This dual GIP/GLP-1 receptor agonist has demonstrated superior weight loss and glycemic control compared to selective GLP-1 agonists in landmark clinical trials. Research has shown average weight loss of 20-22.5% at the highest doses, exceeding results from any previously approved obesity medication.",
    }

    const key = Object.keys(descriptions).find((k) => productName.toLowerCase().includes(k.toLowerCase()))
    return key
      ? descriptions[key]
      : "Research-grade peptide with documented efficacy in clinical studies. Consult research literature for detailed information on mechanisms of action and potential applications."
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "OUT OF STOCK"
    if (stock < 10) return "LOW STOCK"
    return "IN STOCK"
  }

  const ratings = getProductRatings(primaryProduct.base_name)
  // Use category from groupedProduct (fetched from Supabase) instead of hardcoded lookup
  const category = groupedProduct.category || "Research Peptide"
  const description = getDescription(primaryProduct.base_name)

  const totalStock = groupedProduct.variants.reduce((sum, v) => sum + v.current_stock, 0)

  return (
    <Card
      className="@container group relative overflow-hidden border border-border bg-card backdrop-blur-xl rounded-2xl transition-all duration-500 ease-out cursor-pointer aspect-[6/9]"
      style={{
        transform: isHovering ? "scale(1.03) translateY(-4px)" : "scale(1)",
        boxShadow: isHovering
          ? `0 20px 60px ${primaryProduct.color}35, 0 0 0 1px ${primaryProduct.color}, 0 0 80px ${primaryProduct.color}25, 0 8px 30px rgba(58,66,51,0.10)`
          : `0 4px 30px ${primaryProduct.color}18, 0 8px 20px rgba(58,66,51,0.06)`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        {/* Radial gradient background */}
        <div
          className="absolute inset-0 opacity-15 transition-opacity duration-500 group-hover:opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${primaryProduct.color}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col p-[5%]">
          {/* Top section - Category & Research Grade */}
          <div className="text-center flex-[1.2] flex flex-col justify-center">
            <h4 className="font-bold tracking-tight truncate text-[clamp(0.85rem,4cqmin,1.5rem)] leading-tight text-foreground">
              {category}
            </h4>
            <p className="text-muted-foreground uppercase tracking-[0.15em] text-[clamp(0.55rem,2.2cqmin,0.9rem)] mt-[2%]">
              Research Grade
            </p>
          </div>

          {/* Ratings section - largest portion */}
          <div className="flex-[5] py-[2%]">
            <div
              className="h-full bg-secondary/80 backdrop-blur-md border border-border flex flex-col justify-evenly p-[4%]"
              style={{ borderRadius: "clamp(8px, 3cqmin, 16px)" }}
            >
              {ratings.slice(0, 3).map((rating, index) => (
                <div key={index} className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-[4%]">
                    <span className="font-semibold tracking-wide text-foreground/80 truncate text-[clamp(0.7rem,2.8cqmin,1.15rem)]">
                      {rating.label}
                    </span>
                    <span
                      className="font-mono font-bold flex-shrink-0 text-[clamp(0.75rem,3cqmin,1.25rem)]"
                      style={{ color: primaryProduct.color }}
                    >
                      {rating.value.toFixed(1)}
                    </span>
                  </div>
                  <div
                    className="relative w-full overflow-hidden bg-background/60 backdrop-blur-md border border-border shadow-[inset_0_1px_4px_rgba(58,66,51,0.1)] h-[clamp(4px,1.5cqmin,8px)] mt-[3%]"
                    style={{ borderRadius: "clamp(2px, 1cqmin, 9999px)" }}
                  >
                    <div
                      className="h-full rounded-full shadow-[0_0_12px_currentColor] transition-all duration-1000 ease-out"
                      style={{
                        width: `${(rating.value / 10) * 100}%`,
                        backgroundColor: primaryProduct.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock status */}
          <div className="flex-[0.8] flex items-center border-b border-border">
            <span className="font-mono text-muted-foreground text-[clamp(0.6rem,2.2cqmin,0.9rem)]">
              {getStockStatus(totalStock)}
            </span>
          </div>

          {/* Product name and variants */}
          <div className="flex-[2] flex flex-col justify-center py-[1%]">
            <h3 className="font-bold tracking-tight text-foreground group-hover:text-accent transition-colors truncate text-[clamp(1.2rem,5.5cqmin,2.2rem)]">
              {primaryProduct.base_name}
            </h3>
            <p className="font-medium text-muted-foreground truncate text-[clamp(0.6rem,2.5cqmin,1.05rem)] mt-[2%]">
              {groupedProduct.variants.map((v) => v.variant).join(" • ")}
            </p>
          </div>

          {/* Footer with price and view button */}
          <div className="flex-[1.2] flex w-full items-center justify-between border-t border-border pt-[2%]">
            <div className="flex flex-col justify-center">
              {groupedProduct.variants.length > 1 && (
                <span className="text-muted-foreground block leading-none text-[clamp(0.5rem,1.8cqmin,0.8rem)] mb-[0.5cqmin]">
                  From
                </span>
              )}
              <span className="font-bold text-foreground leading-tight text-[clamp(1.1rem,5cqmin,2.1rem)]">
                ${price.toFixed(2)}
              </span>
            </div>
            <Button
              variant="ghost"
              className="group/btn p-0 text-muted-foreground hover:bg-transparent hover:text-foreground h-auto text-[clamp(0.7rem,2.5cqmin,1.05rem)]"
            >
              VIEW
              <ArrowRight
                style={{ width: "1em", height: "1em", marginLeft: "0.25em" }}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Button>
          </div>
        </div>
      </Card>
  )
}
