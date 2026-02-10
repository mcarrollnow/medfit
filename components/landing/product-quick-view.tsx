"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    base_name: string;
    variants: Product[];
    lowestPrice: number;
    category: string;
    color: string;
  } | null;
}

export function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addItem } = useCartStore();

  // Reset state when product changes
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setAddSuccess(false);
    }
  }, [product]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant, quantity);
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const getPrice = (variant: Product) => {
    return variant.display_price || variant.retail_price || 0;
  };

  if (!product || !selectedVariant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-md transition-colors hover:bg-background"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative aspect-square bg-secondary">
                <Image
                  src={selectedVariant.image_url || "/placeholder.svg"}
                  alt={selectedVariant.name}
                  fill
                  className="object-cover"
                />
                {/* Color accent overlay */}
                <div 
                  className="absolute inset-0 opacity-10 mix-blend-multiply"
                  style={{ backgroundColor: product.color }}
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col p-6 md:p-8">
                {/* Category */}
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {product.category}
                </p>

                {/* Product Name */}
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {product.base_name}
                </h2>

                {/* Price */}
                <p className="mt-4 text-3xl font-bold text-foreground">
                  ${getPrice(selectedVariant).toFixed(2)}
                </p>

                {/* Variants */}
                {product.variants.length > 1 && (
                  <div className="mt-6">
                    <p className="mb-3 text-sm font-medium text-foreground">
                      Select Variant
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setAddSuccess(false);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selectedVariant.id === variant.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {variant.variant}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mt-4">
                  <p className={`text-sm font-mono ${
                    selectedVariant.current_stock > 0 
                      ? "text-accent" 
                      : "text-destructive"
                  }`}>
                    {selectedVariant.current_stock > 0 
                      ? `${selectedVariant.current_stock} in stock` 
                      : "Out of stock"}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mt-6 flex items-center gap-4">
                  <p className="text-sm font-medium text-foreground">Quantity</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-full bg-secondary p-2 transition-colors hover:bg-secondary/80"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.current_stock, quantity + 1))}
                      className="rounded-full bg-secondary p-2 transition-colors hover:bg-secondary/80"
                      disabled={quantity >= selectedVariant.current_stock}
                    >
                      <Plus className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto pt-6">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || selectedVariant.current_stock === 0}
                    className="w-full gap-2 rounded-full bg-primary py-6 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90"
                    style={{
                      backgroundColor: addSuccess ? "var(--accent)" : undefined,
                    }}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding...
                      </>
                    ) : addSuccess ? (
                      <>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart - ${(getPrice(selectedVariant) * quantity).toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>

                {/* Description */}
                {selectedVariant.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {selectedVariant.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
