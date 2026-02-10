'use client'

import { useState, useEffect } from 'react'
import { Package, X } from 'lucide-react'
import ProductCard from '@/components/shop/product-card'
import MiniProductCard from '@/components/mini-product-card'
import GlobalNav from '@/components/global-nav'
import { getBaseName } from '@/lib/profile-cards'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/types'
import { useToast } from '@/hooks/use-toast'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const { addItem, fetchCart } = useCartStore()
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
    fetchCart()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products?inStock=true')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('[v0] Failed to load products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const groupedProducts = (products || []).reduce((acc, product) => {
    const baseName = getBaseName(product.name)
    if (!acc[baseName]) {
      acc[baseName] = []
    }
    acc[baseName].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const filteredGroups = Object.keys(groupedProducts).reduce((acc, baseName) => {
    if (baseName.toLowerCase().includes(search.toLowerCase())) {
      acc[baseName] = groupedProducts[baseName]
    }
    return acc
  }, {} as Record<string, Product[]>)

  const handleAddToCart = async (product: Product, quantity: number) => {
    try {
      await addItem(product, quantity)
      toast({
        title: 'Added to cart',
        description: `${product.name} (${quantity}x) added to cart`,
      })
    } catch (error: any) {
      if (error.message.includes('log in')) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to add items to cart',
          variant: 'destructive',
        })
        // Optionally redirect to login
        // window.location.href = '/login'
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add item to cart',
          variant: 'destructive',
        })
      }
    }
  }

  const productCount = Object.values(filteredGroups).reduce((acc, group) => acc + group.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav showCart={true} />

      {/* Main Content */}
      <main className="container mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-extrabold tracking-tight">SHOP</h1>
          <p className="text-xl text-muted-foreground mt-4 tracking-wide">
            {productCount} {productCount === 1 ? 'Product' : 'Products'} Available
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center py-24">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
            <h3 className="text-4xl font-bold mb-4">
              {search ? 'No Products Found' : 'No Products Available'}
            </h3>
            <p className="text-xl text-muted-foreground">
              {search ? 'Try searching for something else' : 'Check back later for new products'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {Object.entries(filteredGroups).map(([baseName, productGroup]) => (
              <MiniProductCard
                key={baseName}
                product={productGroup[0]}
                onClick={() => setExpandedProductId(baseName)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal for expanded product - only renders when a card is clicked */}
      {expandedProductId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 p-8"
          onClick={() => setExpandedProductId(null)}
        >
          <button
            onClick={() => setExpandedProductId(null)}
            className="absolute top-8 right-8 text-foreground hover:text-foreground/70 transition-colors"
          >
            <X className="h-12 w-12" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <ProductCard
              product={filteredGroups[expandedProductId][0]}
              variants={filteredGroups[expandedProductId]}
              onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
              isExpanded={true}
              onExpand={() => {}}
              onCollapse={() => setExpandedProductId(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
