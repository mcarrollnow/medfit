"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/types"
import { Package } from "lucide-react"

interface OrderSummaryProps {
  items: (CartItem & { cart_image?: string })[]
  discount?: number
  promoCode?: string
  freeShipping?: boolean
  shippingAmount?: number
  // For fixed amount discounts (not percentage) - takes precedence over discount percentage
  fixedDiscountAmount?: number
  // For set_price discounts - custom prices per product
  customProductPrices?: Record<string, number> | null
}

// Map product color to vial icon SVG path
function getVialIcon(color?: string) {
  if (!color) return null
  
  // Map hex codes to color names
  const hexToColorMap: Record<string, string> = {
    '#0099ff': 'blue',      // Blue
    '#00ff00': 'green',     // Green
    '#808080': 'grey',      // Grey
    '#ff6600': 'orange',    // Orange
    '#ff66cc': 'pink',      // Pink
    '#6609ff': 'purple',    // Purple
    '#ff0000': 'red',       // Red
    '#ffff00': 'yellow',    // Yellow
  }
  
  const colorMap: Record<string, string> = {
    blue: '/images/vial_blue_outline.svg',
    green: '/images/vial_green_outline.svg',
    grey: '/images/vial_grey_outline.svg',
    gray: '/images/vial_grey_outline.svg',
    orange: '/images/vial_orange_outline.svg',
    pink: '/images/vial_pink_outline.svg',
    purple: '/images/vial_purple_outline.svg',
    red: '/images/vial_red_outline.svg',
    yellow: '/images/vial_yellow_outline.svg',
  }
  
  // Check if it's a hex code first
  const normalizedColor = color.toLowerCase()
  const colorName = hexToColorMap[normalizedColor] || normalizedColor
  
  return colorMap[colorName] || null
}

export function OrderSummary({ items, discount = 0, promoCode, freeShipping, shippingAmount = 0, fixedDiscountAmount, customProductPrices }: OrderSummaryProps) {
  // Calculate subtotal - use custom prices if available
  const subtotal = items.reduce((sum, item) => {
    const regularPrice = parseFloat(item.retail_price)
    return sum + (regularPrice * item.quantity)
  }, 0)
  
  // Calculate total with custom prices applied
  const totalWithCustomPrices = items.reduce((sum, item) => {
    const regularPrice = parseFloat(item.retail_price)
    const productId = (item as any).product?.id || item.id
    const customPrice = customProductPrices?.[productId]
    const priceToUse = customPrice !== undefined ? customPrice : regularPrice
    return sum + (priceToUse * item.quantity)
  }, 0)
  
  // For set_price discounts, the discount is the difference between regular and custom prices
  const isSetPriceDiscount = customProductPrices && Object.keys(customProductPrices).length > 0
  
  // Use fixed discount amount if provided, otherwise calculate from percentage, or use set_price savings
  const discountAmount = isSetPriceDiscount
    ? subtotal - totalWithCustomPrices
    : fixedDiscountAmount !== undefined 
      ? Math.min(fixedDiscountAmount, subtotal) // Cap fixed discount at subtotal
      : (discount ? subtotal * (discount / 100) : 0)
  const shipping = freeShipping ? 0 : shippingAmount
  const total = subtotal - discountAmount + shipping
  // Determine if this is a fixed or percentage discount for display
  const isFixedDiscount = fixedDiscountAmount !== undefined && fixedDiscountAmount > 0

  return (
    <Card className="border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3">
          {items.map((item) => {
              const vialIcon = getVialIcon(item.color)
              const price = parseFloat(item.retail_price)
            
            return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="relative w-14 h-20 bg-background rounded overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#010202' }}>
                    {item.cart_image ? (
                      // Render SVG directly from cart_image preserving aspect ratio
                      <div 
                        className="w-full h-full flex items-center justify-center p-0.5 [&>svg]:w-auto [&>svg]:h-full [&>svg]:max-w-full [&>svg]:object-contain"
                        dangerouslySetInnerHTML={{ __html: item.cart_image }}
                      />
                    ) : vialIcon ? (
                      <img 
                        src={vialIcon}
                        alt={item.name}
                        className="w-auto h-16 object-contain"
                      />
                    ) : item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    ) : null}
                    {(!item.cart_image && !vialIcon && !item.image) || (
                      <Package className={`h-6 w-6 text-muted-foreground ${item.cart_image || vialIcon || item.image ? 'hidden' : ''}`} />
                  )}
                </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">${(price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
          </div>

          {(discount > 0 || isFixedDiscount || isSetPriceDiscount) && discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({promoCode || (isSetPriceDiscount ? 'Special pricing' : isFixedDiscount ? `$${fixedDiscountAmount} off` : `${discount}%`)})</span>
                <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{freeShipping ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

          <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-xl">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}