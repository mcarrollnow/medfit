"use client";

import { FadeImage } from "@/components/landing/fade-image";
import type { Product } from "@/types";

interface GroupedProduct {
  base_name: string;
  variants: Product[];
  lowestPrice: number;
  category: string;
  color: string;
}

interface FeaturedProductsSectionProps {
  products: GroupedProduct[];
  onProductClick: (product: GroupedProduct) => void;
}

export function FeaturedProductsSection({ products, onProductClick }: FeaturedProductsSectionProps) {
  // Get 6 products for the grid (skip first 2 used in philosophy section)
  const featuredProducts = products.slice(2, 8);

  return (
    <section id="technology" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Engineered for Results.
          <br />
          Designed for Research.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Featured Compounds
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {featuredProducts.map((product) => (
          <div 
            key={product.base_name} 
            onClick={() => onProductClick(product)}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
              <FadeImage
                src={product.variants[0]?.image_url || "/placeholder.svg"}
                alt={product.base_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/10" />
              {/* Price badge on hover */}
              <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span 
                  className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full text-primary-foreground"
                  style={{ backgroundColor: product.color }}
                >
                  ${product.lowestPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {product.category}
              </p>
              <h3 className="text-foreground text-xl font-semibold group-hover:text-accent transition-colors">
                {product.base_name}
              </h3>
              {product.variants.length > 1 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.variants.length} variants available
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}
