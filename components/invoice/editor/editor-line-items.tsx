"use client"

import { useState } from "react"
import { Plus, Trash2, Package } from "lucide-react"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  id: string
  name: string
  cost_price: number
  b2b_price: number
  retail_price: number
  sku?: string
}

interface EditorLineItemsProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
  products?: Product[]
}

export function EditorLineItems({ data, onChange, products = [] }: EditorLineItemsProps) {
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: "",
      details: "",
      quantity: 1,
      rate: 0,
    }
    onChange({ ...data, items: [...data.items, newItem] })
    setActiveItemId(newItem.id)
    setSearchQuery("")
  }

  const updateItem = (id: number, updates: Partial<InvoiceItem>) => {
    onChange({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const removeItem = (id: number) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    })
    if (activeItemId === id) {
      setActiveItemId(null)
      setSearchQuery("")
    }
  }

  const handleDescriptionChange = (itemId: number, value: string) => {
    updateItem(itemId, { description: value })
    setSearchQuery(value)
    setActiveItemId(itemId)
  }

  const selectProduct = (itemId: number, product: Product, tier: 'cost' | 'b2b' | 'retail') => {
    const price = tier === 'cost' ? product.cost_price : tier === 'b2b' ? product.b2b_price : product.retail_price
    updateItem(itemId, { 
      description: product.name, 
      rate: price 
    })
    setActiveItemId(null)
    setSearchQuery("")
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground">Products</h2>
        <button
          onClick={addItem}
          className="bg-foreground/10 border border-border hover:bg-foreground/20 px-3 md:px-4 py-2 rounded-full flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {data.items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="group bg-foreground/50 border border-border rounded-xl p-4 space-y-3 relative">
                {/* Product Name Row */}
                <div className="relative">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                    onFocus={() => {
                      setActiveItemId(item.id)
                      setSearchQuery(item.description)
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (activeItemId === item.id) {
                          setActiveItemId(null)
                        }
                      }, 200)
                    }}
                    placeholder="Type to search products..."
                    className="w-full bg-transparent text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none text-base"
                  />

                  {/* Product Autocomplete Dropdown */}
                  {activeItemId === item.id && searchQuery.length > 0 && filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl max-h-96 overflow-y-auto z-[200] shadow-2xl">
                      <div className="px-3 py-2 text-[10px] font-mono text-emerald-400 uppercase tracking-wider border-b border-border flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        Select Product & Price
                      </div>
                      {filteredProducts.slice(0, 15).map((product) => (
                        <div
                          key={product.id}
                          className="p-3 border-b border-border last:border-0"
                        >
                          <p className="font-medium text-foreground text-sm mb-2">{product.name}</p>
                          <div className="flex gap-1.5">
                            <button
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectProduct(item.id, product, 'cost')}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors"
                            >
                              Cost ${product.cost_price}
                            </button>
                            <button
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectProduct(item.id, product, 'b2b')}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono hover:bg-blue-500/20 transition-colors"
                            >
                              B2B ${product.b2b_price}
                            </button>
                            <button
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectProduct(item.id, product, 'retail')}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
                            >
                              Retail ${product.retail_price}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Qty and Price Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Qty</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                        className="w-16 bg-foreground/40 border border-border rounded-lg px-2 py-1.5 text-foreground text-center font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 focus:border-border"
                        min="1"
                      />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Price</span>
                      <div className="flex items-center bg-foreground/40 border border-border rounded-lg px-2 py-1.5">
                        <span className="text-muted-foreground text-sm">$</span>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                          className="w-20 bg-transparent text-foreground text-right font-mono text-sm focus:outline-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amount and Delete */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-foreground">
                      ${(item.quantity * item.rate).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data.items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-light text-sm">No products yet. Click "Add" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
