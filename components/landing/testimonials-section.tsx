"use client";

import Image from "next/image";
import type { Product } from "@/types";

interface GroupedProduct {
  base_name: string;
  variants: Product[];
  lowestPrice: number;
  category: string;
  color: string;
}

interface TestimonialsSectionProps {
  products: GroupedProduct[];
}

export function TestimonialsSection({ products }: TestimonialsSectionProps) {
  // Use a random product image for the background
  const featuredProduct = products[Math.floor(Math.random() * Math.min(products.length, 5))];

  return (
    <section id="about" className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Research-grade compounds with ≥99% purity, third-party tested for authenticity — 
          designed for researchers who refuse to compromise on quality or precision in their work.
        </p>
      </div>

      {/* About Image */}
      {featuredProduct && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={featuredProduct.variants[0]?.image_url || "/placeholder.svg"}
            alt={featuredProduct.base_name}
            fill
            className="object-cover"
          />
          {/* Fade gradient overlay - matches background at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}
    </section>
  );
}
