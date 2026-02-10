"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types";

interface GroupedProduct {
  base_name: string;
  variants: Product[];
  lowestPrice: number;
  category: string;
  color: string;
}

interface HeroSectionProps {
  products: GroupedProduct[];
  onProductClick: (product: GroupedProduct) => void;
}

const word = "MEDFIT90";

export function HeroSection({ products, onProductClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Get first 4 products for the side images, or use placeholders
  const sideProducts = products.slice(0, 4);
  const leftProducts = sideProducts.slice(0, 2);
  const rightProducts = sideProducts.slice(2, 4);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Text fades out first (0 to 0.2)
  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  
  // Image transforms start after text fades (0.2 to 1)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 58); // 100% to 42%
  const centerHeight = 100 - (imageProgress * 30); // 100% to 70%
  const sideWidth = imageProgress * 22; // 0% to 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const borderRadius = imageProgress * 24; // 0px to 24px
  const gap = imageProgress * 16; // 0px to 16px
  
  // Vertical offset for side columns to move them up on mobile
  const sideTranslateY = -(imageProgress * 15); // Move up by 15% when fully expanded

  return (
    <section ref={sectionRef} className="relative bg-background">
      {/* Sticky container for scroll animation */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          {/* Bento Grid Container */}
          <div 
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px`, paddingBottom: `${60 + (imageProgress * 40)}px` }}
          >
            
            {/* Left Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {leftProducts.map((product, idx) => (
                <div 
                  key={product.base_name}
                  onClick={() => onProductClick(product)}
                  className="relative overflow-hidden will-change-transform cursor-pointer group"
                  style={{
                    flex: 1,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={product.variants[0]?.image_url || "/placeholder.svg"}
                    alt={product.base_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20" />
                  {/* Price badge */}
                  <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-background/80 text-foreground">
                      ${product.lowestPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Hero Image - Center */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: `${centerHeight}%`,
                flex: "0 0 auto",
                borderRadius: `${borderRadius}px`,
              }}
            >
              {/* Use a gradient background or first product image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary" />
              {products[0] && (
                <Image
                  src={products[0].variants[0]?.image_url || "/placeholder.svg"}
                  alt="Featured Product"
                  fill
                  className="object-cover opacity-50"
                  priority
                />
              )}
              
              {/* Overlay Text - Fades out first */}
              <div 
                className="absolute inset-0 flex items-end overflow-hidden"
                style={{ opacity: textOpacity }}
              >
                <h1 className="w-full text-[18vw] md:text-[16vw] font-medium leading-[0.8] tracking-tighter text-foreground">
                  {word.split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-[slideUp_0.8s_ease-out_forwards] opacity-0"
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        transition: 'all 1.5s',
                        transitionTimingFunction: 'cubic-bezier(0.86, 0, 0.07, 1)',
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {rightProducts.map((product, idx) => (
                <div 
                  key={product.base_name}
                  onClick={() => onProductClick(product)}
                  className="relative overflow-hidden will-change-transform cursor-pointer group"
                  style={{
                    flex: 1,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image
                    src={product.variants[0]?.image_url || "/placeholder.svg"}
                    alt={product.base_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20" />
                  {/* Price badge */}
                  <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-background/80 text-foreground">
                      ${product.lowestPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll space to enable animation */}
      <div className="h-[200vh]" />

      {/* Tagline Section */}
      <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Premium research compounds.
          <br />
          Precision engineered for results.
        </p>
      </div>
    </section>
  );
}
