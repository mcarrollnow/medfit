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

interface CollectionSectionProps {
  products: GroupedProduct[];
  onProductClick: (product: GroupedProduct) => void;
}

export function CollectionSection({ products, onProductClick }: CollectionSectionProps) {
  // Get remaining products (after gallery section)
  const collectionProducts = products.slice(16, 22);

  if (collectionProducts.length === 0) return null;

  return (
    <section id="accessories" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          More Compounds
        </h2>
        <p className="mt-2 text-muted-foreground">
          Explore our extended collection
        </p>
      </div>

      {/* Products Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {collectionProducts.map((product) => (
            <div 
              key={product.base_name} 
              onClick={() => onProductClick(product)}
              className="group flex-shrink-0 w-[75vw] snap-center cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={product.variants[0]?.image_url || "/placeholder.svg"}
                  alt={product.base_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Color accent on hover */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 mix-blend-multiply"
                  style={{ backgroundColor: product.color }}
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground group-hover:text-accent transition-colors">
                      {product.base_name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    ${product.lowestPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {collectionProducts.map((product) => (
            <div 
              key={product.base_name} 
              onClick={() => onProductClick(product)}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={product.variants[0]?.image_url || "/placeholder.svg"}
                  alt={product.base_name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Color accent on hover */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 mix-blend-multiply"
                  style={{ backgroundColor: product.color }}
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground group-hover:text-accent transition-colors">
                      {product.base_name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <span className="font-medium text-foreground text-2xl">
                    ${product.lowestPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
