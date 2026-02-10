"use client"

import type { CartItem as CartItemType } from "@/lib/cart-store"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // Access product details from the nested product object
  const product = item.product
  // Handle both 'image' and 'image_url' field names
  const productImage = product?.image_url || product?.image || ''
  const imageUrl = productImage && productImage.trim() !== '' ? productImage : 'https://placehold.co/200x200/1a1a1a/gray?text=No+Image'
  
  // Temporary product name mapping for known products
  const getProductName = (productId: string) => {
    // Check if this might be Cagrilintide or BPC-157 based on ID patterns
    const idLower = productId.toLowerCase()
    if (idLower.includes('cagri') || idLower === '10' || idLower === '11') {
      return 'Cagrilintide 10mg'
    }
    if (idLower.includes('bpc') || idLower === '12' || idLower === '13') {
      return 'BPC-157 10mg'
    }
    return `Product ${productId}`
  }

  // If product is missing, show a basic cart item with remove option
  if (!product) {
    const fallbackName = getProductName(item.product_id)
    return (
      <div className="flex gap-4 py-6 border-b border-border">
        <div className="relative w-28 h-40 bg-background rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#010202' }}>
          <div className="text-xs text-muted-foreground">No Image</div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-foreground">{fallbackName}</h3>
            <p className="text-sm text-muted-foreground mt-1">Product ID: {item.product_id}</p>
            <p className="text-xs text-orange-500">Product data not found - please contact support</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-foreground/[0.06] hover:bg-card/[0.1] border-border hover:border-border"
                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-foreground/[0.06] hover:bg-card/[0.1] border-border hover:border-border"
                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Price unavailable</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-foreground/[0.06]"
                onClick={() => onRemove(item.product_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <div className="relative w-28 h-40 bg-background rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
        {product.cart_image ? (
          // Render SVG directly preserving aspect ratio (0.7:1 for vials)
          <div 
            className="w-full h-full flex items-center justify-center p-2 [&>svg]:w-auto [&>svg]:h-full [&>svg]:max-w-full [&>svg]:object-contain"
            style={{ backgroundColor: '#010202' }}
            dangerouslySetInnerHTML={{ __html: product.cart_image }}
          />
        ) : (
          // Fall back to regular image
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized={true}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/200x200/1a1a1a/gray?text=No+Image'
            }}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-foreground">{product.name}</h3>
          {product.cart_product_detail && <p className="text-sm text-muted-foreground mt-1">{product.cart_product_detail}</p>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-foreground/[0.06] hover:bg-card/[0.1] border-border hover:border-border"
              onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center font-medium">{item.quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-foreground/[0.06] hover:bg-card/[0.1] border-border hover:border-border"
              onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg">${((product.display_price || product.retail_price) * item.quantity).toFixed(2)}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-foreground/[0.06]"
              onClick={() => onRemove(item.product_id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
