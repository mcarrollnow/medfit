"use client"

import { useState, useRef, useEffect } from "react"
import type { Product } from "@/types"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, X, Moon, Sun, Tag, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getAuthHeaders } from "@/lib/auth-client"

interface PurchaseOrderFormProps {
  products: Product[]
}

export function PurchaseOrderForm({ products }: PurchaseOrderFormProps) {
  const { items, addItem, removeItem, updateQuantity, getTotal } = useCartStore()
  const subtotal = getTotal()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [isKeypadOpen, setIsKeypadOpen] = useState(false)
  const [keypadValue, setKeypadValue] = useState("1")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [promoInput, setPromoInput] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState<number>(0)
  const [promoDiscountType, setPromoDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [freeShipping, setFreeShipping] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Calculate discount amount
  const discountAmount = promoDiscountType === "percentage" 
    ? (subtotal * promoDiscount / 100) 
    : Math.min(promoDiscount, subtotal)
  const finalTotal = subtotal - discountAmount

  // Load saved promo code from localStorage on mount
  useEffect(() => {
    const savedPromo = localStorage.getItem('pendingPromoCode')
    if (savedPromo) {
      try {
        const { code, discount, discountType, freeShipping: savedFreeShipping } = JSON.parse(savedPromo)
        setPromoCode(code)
        setPromoInput(code)
        setPromoDiscount(discount)
        setPromoDiscountType(discountType)
        setFreeShipping(savedFreeShipping || false)
      } catch (e) {
        localStorage.removeItem('pendingPromoCode')
      }
    }
  }, [])

  // Validate promo code
  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return
    
    setIsValidatingPromo(true)
    setPromoError(null)
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/validate-discount', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: promoInput.trim(),
          orderAmount: subtotal
        })
      })
      
      const data = await response.json()
      
      if (data.valid) {
        setPromoCode(promoInput.trim().toUpperCase())
        setPromoDiscount(data.discount?.discount_type === 'percentage' 
          ? data.discount.discount_value 
          : data.discount_amount)
        setPromoDiscountType(data.discount?.discount_type === 'percentage' ? 'percentage' : 'fixed')
        setFreeShipping(data.discount?.free_shipping || false)
        setPromoError(null)
        
        // Save to localStorage so checkout page can use it
        localStorage.setItem('pendingPromoCode', JSON.stringify({
          code: promoInput.trim().toUpperCase(),
          discount: data.discount?.discount_type === 'percentage' 
            ? data.discount.discount_value 
            : data.discount_amount,
          discountType: data.discount?.discount_type === 'percentage' ? 'percentage' : 'fixed',
          freeShipping: data.discount?.free_shipping || false,
          discountCodeId: data.discount_code_id
        }))
      } else {
        setPromoError(data.error || 'Invalid promo code')
      }
    } catch (error) {
      console.error('Error validating promo:', error)
      setPromoError('Failed to validate promo code')
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoCode("")
    setPromoInput("")
    setPromoDiscount(0)
    setPromoError(null)
    setFreeShipping(false)
    localStorage.removeItem('pendingPromoCode')
  }

  const filteredProducts = searchTerm.trim() 
    ? products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.base_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ).slice(0, 8)
    : []

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowSuggestions(false)
    setQuantity(1)
    setKeypadValue("1")
    // Automatically open keypad or focus quantity?
    // Let's focus quantity button or just let user tap it
  }

  const handleQuantityClick = () => {
    setKeypadValue(quantity.toString())
    setIsKeypadOpen(true)
  }

  const handleKeypadSubmit = () => {
    const val = Number.parseInt(keypadValue)
    if (val > 0) {
      if (editingItemId) {
        // Editing an existing item's quantity
        updateQuantity(editingItemId, val)
        setEditingItemId(null)
      } else {
        // Setting quantity for new item
        setQuantity(val)
      }
    }
    setIsKeypadOpen(false)
  }

  const handleEditItemQuantity = (itemId: string, currentQuantity: number) => {
    setEditingItemId(itemId)
    setKeypadValue(currentQuantity.toString())
    setIsKeypadOpen(true)
  }

  const handleKeypadPress = (num: string) => {
    if (keypadValue === "0") {
      setKeypadValue(num)
    } else {
      setKeypadValue((prev) => prev + num)
    }
  }

  const handleKeypadBackspace = () => {
    setKeypadValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
  }

  const handleAddItem = () => {
    if (selectedProduct && quantity > 0) {
      addItem(selectedProduct, quantity)
      setSelectedProduct(null)
      setSearchTerm("")
      setQuantity(1)
      setKeypadValue("1")
      // Focus back on search for rapid entry
      searchInputRef.current?.focus()
    }
  }

  // Line height in em units - scales with font size
  const lineHeight = 2.5 // 2.5em ≈ 40px at base 16px

  return (
    <div className="w-full max-w-4xl mx-auto text-base sm:text-lg">
      <div
        className={`rounded-sm shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col transition-colors duration-300 ${
          isDarkMode ? "bg-card text-foreground" : "bg-[#fdfbf7] text-foreground"
        }`}
      >
        {/* Notepad Header */}
        <div
          className={`p-4 sm:p-6 border-b-2 flex justify-between items-center transition-colors duration-300 ${
            isDarkMode ? "bg-[#2a2a2a] border-[#444]" : "bg-[#e8e4da] border-[#d4d0c5]"
          }`}
        >
          <div>
            <h2
              className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${
                isDarkMode ? "text-gray-100" : "text-[#2c2c2c]"
              }`}
            >
              Purchase Request
            </h2>
            <p className={`text-xs sm:text-sm font-mono mt-1 ${isDarkMode ? "text-muted-foreground" : "text-[#666]"}`}>
              FORM-2025-REQ • MODERN HEALTH PRO
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="text-right hidden sm:block">
              <p
                className={`text-xs font-bold uppercase tracking-widest ${
                  isDarkMode ? "text-gray-500" : "text-[#888]"
                }`}
              >
                Date
              </p>
              <p className={`font-mono text-sm ${isDarkMode ? "text-foreground/70" : "text-[#444]"}`}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? "bg-foreground/10 hover:bg-foreground/20 text-yellow-400" : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Lines are now part of each row via border-bottom for perfect alignment */}

        <div className="p-4 sm:p-8 flex-1 relative z-10 flex flex-col gap-4 sm:gap-8">
          {/* Input Section */}
          <div
            className={`flex flex-col md:flex-row gap-4 items-end p-4 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
              isDarkMode ? "bg-foreground/5 border-border" : "bg-foreground/50 border-black/5"
            }`}
          >
            <div className="flex-1 w-full relative">
              <label
                className={`block text-xs font-bold uppercase tracking-widest mb-2 ${
                  isDarkMode ? "text-muted-foreground" : "text-[#666]"
                }`}
              >
                Item Description
              </label>
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(true)
                    setSelectedProduct(null)
                  }}
                  onFocus={() => {
                    if (searchTerm && !selectedProduct) {
                      setShowSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click events on suggestions to fire
                    setTimeout(() => setShowSuggestions(false), 200)
                  }}
                  placeholder="Type peptide name..."
                  autoComplete="off"
                  className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-2 text-xl font-serif focus-visible:ring-0 h-auto ${
                    isDarkMode
                      ? "border-border focus-visible:border-primary placeholder:text-muted-foreground text-foreground"
                      : "border-black/20 focus-visible:border-black placeholder:text-foreground/40 text-foreground"
                  }`}
                />
                {showSuggestions && searchTerm.trim() && (
                  <div
                    className={`absolute top-full left-0 w-full shadow-xl border mt-1 z-50 rounded-md overflow-hidden max-h-80 overflow-y-auto ${
                      isDarkMode ? "bg-[#2a2a2a] border-border" : "bg-white border-border"
                    }`}
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className={`w-full text-left px-4 py-3 border-b last:border-0 transition-colors flex justify-between items-center ${
                            isDarkMode
                              ? "hover:bg-foreground/5 border-border text-gray-200"
                              : "hover:bg-[#f5f5f5] border-black/5 text-foreground"
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault() // Prevent blur from firing before click
                            handleProductSelect(product)
                          }}
                        >
                          <span className="font-serif text-lg">{product.name}</span>
                          <span className={`text-sm font-mono ${isDarkMode ? "text-muted-foreground" : "text-gray-500"}`}>
                            ${Number.parseFloat(String(product.retail_price || 0)).toFixed(2)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className={`px-4 py-3 italic ${isDarkMode ? "text-gray-500" : "text-muted-foreground"}`}>
                        No products found for "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-32">
              <label
                className={`block text-xs font-bold uppercase tracking-widest mb-2 ${
                  isDarkMode ? "text-muted-foreground" : "text-[#666]"
                }`}
              >
                Quantity
              </label>
              <button
                onClick={handleQuantityClick}
                className={`w-full text-left border-b-2 py-2 text-xl font-mono transition-colors ${
                  isDarkMode ? "border-border hover:border-primary" : "border-black/20 hover:border-black"
                }`}
              >
                {quantity}
              </button>
            </div>

            <div className="w-full md:w-auto">
              <Button
                onClick={handleAddItem}
                disabled={!selectedProduct}
                className={`w-full md:w-auto rounded-none h-12 px-8 font-bold tracking-widest ${
                  isDarkMode
                    ? "bg-white text-foreground hover:bg-card/90 disabled:bg-foreground/20 disabled:text-muted-foreground"
                    : "bg-background text-foreground hover:bg-background/80"
                }`}
              >
                <Plus className="w-4 h-4 mr-2" /> ADD ITEM
              </Button>
            </div>
          </div>

          {/* Order List */}
          <div className="flex-1">
            <div
              className={`flex items-center justify-between mb-4 border-b-2 pb-2 ${
                isDarkMode ? "border-primary" : "border-black"
              }`}
            >
              <h3 className="font-bold uppercase tracking-widest text-sm">Order Items</h3>
              <span className="font-mono text-sm">{items.length} Items</span>
            </div>

            <div className="space-y-0">
              <AnimatePresence>
                {items.map((item) => {
                  // Handle both item structures (with nested product or direct properties)
                  const productName = item.product?.name || item.name || 'Unknown Product'
                  const productPrice = item.product?.retail_price || item.product?.display_price || 
                                     item.retail_price || item.display_price || '0'
                  const productId = item.product?.barcode || item.product_id || item.id
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{ height: `${lineHeight}em` }}
                      className={`flex items-center justify-between px-1 sm:px-2 transition-colors group border-b ${
                        isDarkMode ? "hover:bg-foreground/5 border-border" : "hover:bg-foreground/5 border-border"
                      }`}
                    >
                      <div className="flex-1 font-serif truncate pr-2 sm:pr-4 text-sm sm:text-base">
                        {productName}
                        <span className={`ml-1 sm:ml-2 text-[10px] sm:text-xs font-mono ${isDarkMode ? "text-gray-500" : "text-muted-foreground"}`}>
                          @${Number.parseFloat(productPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <button
                          onClick={() => handleEditItemQuantity(productId, item.quantity)}
                          className={`w-8 sm:w-12 text-center font-mono text-sm sm:text-base transition-colors ${
                            isDarkMode 
                              ? "hover:text-foreground/80" 
                              : "hover:text-foreground/80"
                          }`}
                          title="Click to edit quantity"
                        >
                          ×{item.quantity}
                        </button>
                        <div className="w-16 sm:w-20 text-right font-mono font-bold text-sm sm:text-base">
                          ${(Number.parseFloat(productPrice) * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(productId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {items.length === 0 && (
                <>
                  <div style={{ height: `${lineHeight}em` }} className={`border-b ${isDarkMode ? "border-border" : "border-border"}`} />
                  <div style={{ height: `${lineHeight}em` }} className={`flex items-center justify-center italic font-serif text-sm sm:text-base border-b ${isDarkMode ? "text-gray-600 border-border" : "text-muted-foreground border-border"}`}>
                    No items added to request form yet.
                  </div>
                  <div style={{ height: `${lineHeight}em` }} className={`border-b ${isDarkMode ? "border-border" : "border-border"}`} />
                </>
              )}
            </div>
          </div>

          {/* Promo Code Row - fits on one line */}
          <div style={{ height: `${lineHeight}em` }} className={`flex items-center gap-2 sm:gap-4 border-b ${isDarkMode ? "border-border" : "border-border"}`}>
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest shrink-0 ${isDarkMode ? "text-muted-foreground" : "text-[#666]"}`}>
              <Tag className="w-3 h-3 inline mr-1" />
              Promo
            </span>
            
            {promoCode ? (
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle2 className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                  <span className={`font-mono font-bold text-xs sm:text-sm ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                    {promoCode}
                  </span>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? "text-green-400/70" : "text-green-600"}`}>
                    {promoDiscountType === 'percentage' 
                      ? `(${promoDiscount}%)`
                      : `(-$${promoDiscount.toFixed(2)})`}
                  </span>
                  {freeShipping && (
                    <span className={`hidden sm:inline text-xs ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                      +Free Ship
                    </span>
                  )}
                </div>
                <button
                  onClick={handleRemovePromo}
                  className={`p-1 transition-colors ${isDarkMode ? "hover:text-foreground text-muted-foreground" : "hover:text-foreground text-gray-500"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase())
                    setPromoError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleValidatePromo()
                    }
                  }}
                  placeholder="Enter code"
                  className={`flex-1 bg-transparent border-0 border-b rounded-none px-0 py-1 font-mono uppercase focus-visible:ring-0 h-6 sm:h-8 text-xs sm:text-sm ${
                    isDarkMode
                      ? "border-border focus-visible:border-primary placeholder:text-muted-foreground text-foreground"
                      : "border-black/20 focus-visible:border-black placeholder:text-foreground/30 text-foreground"
                  }`}
                />
                <Button
                  onClick={handleValidatePromo}
                  disabled={!promoInput.trim() || isValidatingPromo}
                  size="sm"
                  className={`rounded-none h-6 sm:h-8 px-2 sm:px-4 text-[10px] sm:text-xs font-bold tracking-widest ${
                    isDarkMode
                      ? "bg-white text-foreground hover:bg-card/90 disabled:bg-foreground/20 disabled:text-muted-foreground"
                      : "bg-background text-foreground hover:bg-background/80"
                  }`}
                >
                  {isValidatingPromo ? <Loader2 className="w-3 h-3 animate-spin" /> : "APPLY"}
                </Button>
              </div>
            )}
          </div>
          
          {promoError && (
            <p style={{ height: `${lineHeight}em` }} className={`flex items-center text-xs sm:text-sm border-b ${isDarkMode ? "text-red-400 border-border" : "text-red-600 border-border"}`}>
              {promoError}
            </p>
          )}

          {/* Footer / Total - each row scales with line height */}
          <div className={`mt-auto border-t-2 ${isDarkMode ? "border-primary" : "border-black"}`}>
            {/* Subtotal row */}
            <div style={{ height: `${lineHeight}em` }} className={`flex justify-between items-center border-b ${isDarkMode ? "border-border" : "border-border"}`}>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-muted-foreground" : "text-[#666]"}`}>
                Subtotal
              </span>
              <span className="font-mono text-sm sm:text-base">${subtotal.toFixed(2)}</span>
            </div>
            
            {/* Discount row (only if discount applied) */}
            {discountAmount > 0 && (
              <div style={{ height: `${lineHeight}em` }} className={`flex justify-between items-center border-b ${isDarkMode ? "border-border" : "border-border"}`}>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Discount
                </span>
                <span className={`font-mono text-sm sm:text-base ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Total row - 2 lines tall */}
            <div style={{ height: `${lineHeight}em` }} className={`border-b ${isDarkMode ? "border-border" : "border-border"}`} />
            <div style={{ height: `${lineHeight}em` }} className={`flex justify-between items-center border-b ${isDarkMode ? "border-border" : "border-border"}`}>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-muted-foreground" : "text-[#666]"}`}>
                Total
              </span>
              <span className="text-2xl sm:text-4xl font-mono font-bold tracking-tighter">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keypad Dialog */}
      <Dialog open={isKeypadOpen} onOpenChange={(open) => {
        setIsKeypadOpen(open)
        if (!open) setEditingItemId(null)
      }}>
        <DialogContent
          className={`sm:max-w-[300px] p-0 overflow-hidden border-0 rounded-xl ${
            isDarkMode ? "bg-card text-foreground" : "bg-white text-foreground"
          }`}
        >
          <DialogHeader className={`p-4 border-b ${isDarkMode ? "bg-[#2a2a2a] border-border" : "bg-gray-50"}`}>
            <DialogTitle className="text-center font-mono text-2xl">{keypadValue}</DialogTitle>
            <DialogDescription className="sr-only">Enter quantity using the keypad</DialogDescription>
          </DialogHeader>
          <div className={`grid grid-cols-3 gap-px ${isDarkMode ? "bg-foreground/10" : "bg-gray-200"}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypadPress(num.toString())}
                className={`p-6 text-xl font-bold transition-colors ${
                  isDarkMode
                    ? "bg-card hover:bg-secondary active:bg-secondary"
                    : "bg-white hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setKeypadValue("0")}
              className={`p-6 text-xl font-bold transition-colors text-red-500 ${
                isDarkMode
                  ? "bg-card hover:bg-secondary active:bg-secondary"
                  : "bg-white hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              C
            </button>
            <button
              onClick={() => handleKeypadPress("0")}
              className={`p-6 text-xl font-bold transition-colors ${
                isDarkMode
                  ? "bg-card hover:bg-secondary active:bg-secondary"
                  : "bg-white hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              0
            </button>
            <button
              onClick={handleKeypadBackspace}
              className={`p-6 flex items-center justify-center transition-colors ${
                isDarkMode
                  ? "bg-card hover:bg-secondary active:bg-secondary"
                  : "bg-white hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className={`p-4 border-t ${isDarkMode ? "bg-card border-border" : "bg-white"}`}>
            <Button
              onClick={handleKeypadSubmit}
              className={`w-full h-12 text-lg ${
                isDarkMode ? "bg-white text-foreground hover:bg-card/90" : "bg-background text-foreground hover:bg-background/90"
              }`}
            >
              ENTER
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
