"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"
import { EditorLineItems } from "./editor/editor-line-items"
import { AIImportPanel } from "./editor/ai-import-panel"
import { Eye, Send, Loader2, User, ChevronDown, Save } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface Product {
  id: string
  name: string
  cost_price: number
  b2b_price: number
  retail_price: number
  sku?: string
}

interface InvoiceEditorProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
  onPreview: () => void
  onSend?: () => void
  onSave?: () => void
  isSending?: boolean
  isEditing?: boolean
  customers?: Customer[]
  products?: Product[]
}

export function InvoiceEditor({ data, onChange, onPreview, onSend, onSave, isSending, isEditing, customers = [], products = [] }: InvoiceEditorProps) {
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const tax = subtotal * (data.taxRate || 0)
  const calculatedTotal = subtotal + tax
  const manualTotal = data.manualTotal ?? null
  const total = manualTotal !== null ? manualTotal : calculatedTotal
  const discountAmount = manualTotal !== null && manualTotal < calculatedTotal ? calculatedTotal - manualTotal : 0
  const discountPercent = calculatedTotal > 0 && discountAmount > 0 ? Math.round((discountAmount / calculatedTotal) * 100) : 0
  
  const setManualTotal = (val: number | null) => {
    onChange({ ...data, manualTotal: val })
  }

  const handleAIImport = (importedData: Partial<InvoiceData>) => {
    onChange({
      ...data,
      ...importedData,
      to: importedData.to ? { ...data.to, ...importedData.to } : data.to,
      items: importedData.items ? [...data.items, ...importedData.items] : data.items,
    })
  }

  const handleCustomerSelect = (customer: Customer) => {
    onChange({
      ...data,
      to: {
        name: customer.company || customer.name,
        attention: customer.company ? customer.name : undefined,
        address: customer.address || '',
        city: [customer.city, customer.state, customer.zip].filter(Boolean).join(', '),
        email: customer.email,
      }
    })
    setShowCustomerDropdown(false)
    setCustomerSearch("")
  }

  // Track the last added item ID for quantity updates (use ref for synchronous access)
  const lastAddedItemIdRef = useRef<number | null>(null)

  const handleProductAdd = (product: Product, tier: 'cost' | 'b2b' | 'retail', quantity: number = 1) => {
    const price = tier === 'cost' ? product.cost_price : tier === 'b2b' ? product.b2b_price : product.retail_price
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: product.name,
      details: '',
      quantity,
      rate: price,
    }
    // Use ref for immediate synchronous update
    lastAddedItemIdRef.current = newItem.id
    onChange({
      ...data,
      items: [...data.items, newItem],
    })
  }

  // Update quantity of the last added item
  const handleQuantityUpdate = (quantity: number) => {
    const itemId = lastAddedItemIdRef.current
    if (itemId && quantity > 0) {
      onChange({
        ...data,
        items: data.items.map(item => 
          item.id === itemId 
            ? { ...item, quantity } 
            : item
        ),
      })
    }
  }

  // Update price of the last added item (for #qty $price shorthand)
  const handlePriceUpdate = (price: number) => {
    const itemId = lastAddedItemIdRef.current
    if (itemId && price > 0) {
      onChange({
        ...data,
        items: data.items.map(item => 
          item.id === itemId 
            ? { ...item, rate: price } 
            : item
        ),
      })
    }
  }

  // Set invoice total directly (for $$amount shorthand)
  const handleSetTotal = (total: number) => {
    if (total > 0) {
      setManualTotal(total)
    }
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(c => {
    if (!c || !c.name) return false // Skip invalid entries
    const searchLower = customerSearch.toLowerCase()
    return c.name.toLowerCase().includes(searchLower) ||
      (c.email && c.email.toLowerCase().includes(searchLower)) ||
      (c.company && c.company.toLowerCase().includes(searchLower))
  })
  
  // Debug logging
  console.log('[Customer Search] Query:', customerSearch, 'Customers:', customers.length, 'Filtered:', filteredCustomers.length, 'Show:', showCustomerDropdown)

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div className="space-y-4 md:space-y-6">
        {/* AI Import Panel */}
        <AIImportPanel 
          onImport={handleAIImport} 
          customers={customers}
          products={products}
          onCustomerSelect={handleCustomerSelect}
          onProductAdd={handleProductAdd}
          onQuantityUpdate={handleQuantityUpdate}
          onPriceUpdate={handlePriceUpdate}
          onSetTotal={handleSetTotal}
        />

        {/* Customer Section */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-visible relative z-30">
          <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-4 md:mb-6">Customer</h2>
          
          <div className="space-y-4">
            {/* Customer Name with Autocomplete */}
            <div className="relative">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                Name / Company
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.to.name}
                  onChange={(e) => {
                    onChange({ ...data, to: { ...data.to, name: e.target.value } })
                    setCustomerSearch(e.target.value)
                    setShowCustomerDropdown(true)
                  }}
                  onFocus={() => {
                    // Don't auto-open on focus
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowCustomerDropdown(false), 200)
                  }}
                  placeholder="Type to search customers..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/20"
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                {/* Customer Dropdown */}
                {showCustomerDropdown && customerSearch.length > 0 && filteredCustomers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-white/10 rounded-xl max-h-64 overflow-y-auto z-[200] shadow-2xl">
                    <div className="px-3 py-2 text-[10px] font-mono text-emerald-400 uppercase tracking-wider border-b border-white/10 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Select Customer
                    </div>
                    {filteredCustomers.slice(0, 10).map((customer) => (
                      <button
                        key={customer.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleCustomerSelect(customer)}
                        className="w-full p-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <p className="font-medium text-foreground text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                        {customer.company && (
                          <p className="text-xs text-muted-foreground/70">{customer.company}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={data.to.email}
                onChange={(e) => onChange({ ...data, to: { ...data.to, email: e.target.value } })}
                placeholder="customer@email.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-visible relative z-20">
          <EditorLineItems data={data} onChange={onChange} products={products} />
        </div>

        {/* Notes Section */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8">
          <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-4 md:mb-6">Notes</h2>
          <textarea
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            placeholder="Payment terms, special instructions, or messages..."
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/20 resize-none"
          />
        </div>

        {/* Total & Actions */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8">
          <div className="flex flex-col gap-6">
            {/* Pricing Summary */}
            <div className="space-y-4">
              {/* Subtotal Row */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-mono text-lg text-foreground">
                  ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              {/* Discount Row */}
              <div className="flex items-center justify-between gap-4 py-3 px-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                    Discount
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">-$</span>
                  <input
                    type="number"
                    value={discountAmount > 0 ? discountAmount : ''}
                    onChange={(e) => {
                      const discountVal = Number(e.target.value) || 0
                      if (discountVal > 0) {
                        setManualTotal(calculatedTotal - discountVal)
                      } else {
                        setManualTotal(null)
                      }
                    }}
                    placeholder="0.00"
                    className="w-24 bg-black/40 border border-emerald-500/30 rounded-lg px-2 py-1.5 text-emerald-400 text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    min="0"
                    step="0.01"
                  />
                  {discountPercent > 0 && (
                    <span className="font-mono text-xs text-emerald-400/70">
                      ({discountPercent}% off)
                    </span>
                  )}
                </div>
              </div>
              
              {/* Total Row */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Total Due
                </span>
                <div className="text-right">
                  {discountAmount > 0 && (
                    <span className="font-mono text-lg text-muted-foreground/50 line-through block mb-1">
                      ${calculatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="font-serif text-3xl md:text-4xl text-foreground">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 pt-4 border-t border-white/10">
              <button
                onClick={onPreview}
                className="bg-white/10 border border-white/20 hover:bg-white/20 px-4 md:px-5 py-3 rounded-full flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              {/* Save button (no email) - always show */}
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSending || !data.to.email || data.items.length === 0}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 px-4 md:px-5 py-3 rounded-full flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors disabled:opacity-40"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              )}
              
              {/* Send button */}
              {onSend && (
                <button
                  onClick={onSend}
                  disabled={isSending || !data.to.email || data.items.length === 0}
                  className="bg-foreground text-background px-4 md:px-5 py-3 rounded-full flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Save & Send</span>
                      <span className="sm:hidden">Send</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
