"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Product } from "@/types";

interface GroupedProduct {
  base_name: string;
  variants: Product[];
  lowestPrice: number;
  category: string;
  color: string;
}

interface PhilosophySectionProps {
  products: GroupedProduct[];
  onProductClick: (product: GroupedProduct) => void;
}

export function PhilosophySection({ products, onProductClick }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [leftTranslateX, setLeftTranslateX] = useState(-100);
  const [rightTranslateX, setRightTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  // Get two featured products
  const leftProduct = products[0];
  const rightProduct = products[1];

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Calculate progress based on scroll position
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    // Left comes from left (-100% to 0%)
    setLeftTranslateX((1 - progress) * -100);
    
    // Right comes from right (100% to 0%)
    setRightTranslateX((1 - progress) * 100);
    
    // Title fades out as blocks come together
    setTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms]);

  if (!leftProduct || !rightProduct) return null;

  return (
    <section id="products" className="bg-background">
      {/* Scroll-Animated Product Grid */}
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            {/* Title - positioned behind the blocks */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Research Excellence.
              </h2>
            </div>

            {/* Product Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Left Product - comes from left */}
              <div 
                onClick={() => onProductClick(leftProduct)}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                  transform: `translate3d(${leftTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${leftTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={leftProduct.variants[0]?.image_url || "/placeholder.svg"}
                  alt={leftProduct.base_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-background/80 text-foreground">
                    {leftProduct.base_name} ${leftProduct.lowestPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right Product - comes from right */}
              <div 
                onClick={() => onProductClick(rightProduct)}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                  transform: `translate3d(${rightTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${rightTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={rightProduct.variants[0]?.image_url || "/placeholder.svg"}
                  alt={rightProduct.base_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-background/80 text-foreground">
                    {rightProduct.base_name} ${rightProduct.lowestPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Premium Quality
          </p>
          <p className="mt-8 leading-relaxed text-muted-foreground text-3xl text-center">
            Our research compounds are ≥99% pure and third-party tested. 
            Engineered for precision, designed for breakthrough results.
          </p>
        </div>
      </div>
    </section>
  );
}
