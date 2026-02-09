"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Plus,
  Package,
  Camera,
  Lock,
  Send,
  Trash2,
  X,
  Image as ImageIcon,
  Truck,
  Box,
  Hash,
  CheckCircle2,
  Delete,
  CornerDownLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getSupplierShipments,
  createSupplierShipment,
  addItemToShipment,
  removeItemFromShipment,
  addShipmentPhoto,
  sealShipment,
  markShipmentShipped,
  getSupplierProducts,
  type SupplierShipment,
  type SupplierProduct,
} from "@/app/actions/supplier-portal"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { toast } from "react-hot-toast"

const STATUS_LABELS: Record<string, string> = {
  building: "Building",
  sealed: "Sealed",
  shipped: "Shipped",
  received: "Received",
}

type SearchResult = SupplierProduct

// ============================================================
// Calculator Keypad Component (mobile-first)
// ============================================================
function CalculatorKeypad({
  value,
  onChange,
  onEnter,
}: {
  value: string
  onChange: (val: string) => void
  onEnter: () => void
}) {
  const handleKey = useCallback((key: string) => {
    if (key === "backspace") {
      onChange(value.slice(0, -1) || "")
    } else if (key === "clear") {
      onChange("")
    } else if (key === "enter") {
      onEnter()
    } else {
      // Prevent leading zeros
      const newVal = value === "0" ? key : value + key
      onChange(newVal)
    }
  }, [value, onChange, onEnter])

  const keys = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["clear", "0", "enter"],
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.flat().map((key) => {
        const isEnter = key === "enter"
        const isClear = key === "clear"

        return (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className={cn(
              "h-14 rounded-xl font-mono text-lg transition-all duration-200 active:scale-95",
              isEnter
                ? "bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center"
                : isClear
                ? "glass-button text-muted-foreground hover:text-foreground flex items-center justify-center"
                : "glass-button hover:bg-white/[0.1] text-foreground"
            )}
          >
            {isEnter ? (
              <CornerDownLeft className="h-5 w-5" />
            ) : isClear ? (
              <Delete className="h-5 w-5" />
            ) : (
              key
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function ShipProductPage() {
  const [shipments, setShipments] = useState<SupplierShipment[]>([])
  const [activeShipment, setActiveShipment] = useState<SupplierShipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supplierId, setSupplierId] = useState<string | null>(null)

  // Search (local filter for instant results)
  const [allProducts, setAllProducts] = useState<SupplierProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(null)
  const [quantityInput, setQuantityInput] = useState("1")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Shipping
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [showShipForm, setShowShipForm] = useState(false)

  // Photos
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", session.user.id)
          .single()
        if (dbUser) setSupplierId(dbUser.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (!supplierId) return
    loadShipments()
  }, [supplierId])

  async function loadShipments() {
    if (!supplierId) return
    setIsLoading(true)
    try {
      const data = await getSupplierShipments(supplierId)
      setShipments(data)
      const building = data.find(s => s.status === "building")
      if (building) setActiveShipment(building)
    } catch (error) {
      console.error("Error loading shipments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshActiveShipment() {
    if (!supplierId || !activeShipment) return
    const data = await getSupplierShipments(supplierId)
    setShipments(data)
    const updated = data.find(s => s.id === activeShipment.id)
    if (updated) setActiveShipment(updated)
  }

  // Load all active products upfront for instant local search
  useEffect(() => {
    if (!supplierId) return
    async function loadProducts() {
      try {
        const products = await getSupplierProducts(supplierId!, { activeOnly: true })
        setAllProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }
    loadProducts()
  }, [supplierId])

  // Local filtered results — instant as you type
  const searchResults = (() => {
    if (!isSearchFocused && !searchQuery.trim()) return []
    if (selectedProduct) return []
    const q = searchQuery.trim().toLowerCase()
    const filtered = q
      ? allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.supplier_code.toLowerCase().includes(q) ||
            (p.category || "").toLowerCase().includes(q)
        )
      : allProducts
    return filtered.slice(0, 20)
  })()

  const handleCreateShipment = async () => {
    if (!supplierId) return
    const result = await createSupplierShipment(supplierId)
    if (result.success && result.shipment) {
      setActiveShipment(result.shipment)
      setShipments(prev => [result.shipment!, ...prev])
      toast.success("New shipment created")
    } else {
      toast.error(result.error || "Failed to create shipment")
    }
  }

  const handleAddItem = async () => {
    if (!supplierId || !activeShipment || !selectedProduct) return
    const qty = parseInt(quantityInput) || 1
    if (qty < 1) {
      toast.error("Quantity must be at least 1")
      return
    }

    const result = await addItemToShipment(supplierId, activeShipment.id, {
      productId: selectedProduct.product_id || undefined,
      supplierProductId: selectedProduct.id,
      supplierCode: selectedProduct.supplier_code || undefined,
      productName: selectedProduct.name,
      quantity: qty,
    })

    if (result.success) {
      toast.success(`Added ${qty}x ${selectedProduct.name}`)
      setSelectedProduct(null)
      setQuantityInput("1")
      setSearchQuery("")
      setIsSearchFocused(false)
      await refreshActiveShipment()
      // Re-focus search for quick successive adds
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      toast.error(result.error || "Failed to add item")
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!supplierId) return
    const result = await removeItemFromShipment(supplierId, itemId)
    if (result.success) {
      toast.success("Item removed")
      await refreshActiveShipment()
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supplierId || !activeShipment || !e.target.files?.length) return
    setIsUploading(true)
    const file = e.target.files[0]

    try {
      const supabase = getSupabaseBrowserClient()
      const fileName = `${supplierId}/${activeShipment.id}/${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("supplier-shipment-photos")
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from("supplier-shipment-photos")
        .getPublicUrl(data.path)

      const result = await addShipmentPhoto(supplierId, activeShipment.id, publicUrl, file.name)
      if (result.success) {
        toast.success("Photo uploaded")
        await refreshActiveShipment()
      }
    } catch (error: any) {
      toast.error("Failed to upload photo")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSealBox = async () => {
    if (!supplierId || !activeShipment) return
    if (!activeShipment.items?.length) {
      toast.error("Add items before sealing the box")
      return
    }
    const result = await sealShipment(supplierId, activeShipment.id)
    if (result.success) {
      toast.success("Box sealed")
      setShowShipForm(true)
      await refreshActiveShipment()
    }
  }

  const handleMarkShipped = async () => {
    if (!supplierId || !activeShipment) return
    const result = await markShipmentShipped(supplierId, activeShipment.id, trackingNumber, carrier)
    if (result.success) {
      toast.success("Shipment marked as shipped")
      setShowShipForm(false)
      setTrackingNumber("")
      setCarrier("")
      setActiveShipment(null)
      await loadShipments()
    }
  }

  const totalItems = activeShipment?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <Package className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/supplier" className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Shipment Builder</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Ship Product
            <br />
            <span className="italic text-muted-foreground">Build, document, and ship your boxes</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Active Box Builder */}
          <div className="lg:col-span-2 space-y-8">
            {/* Start New or Active Shipment */}
            {!activeShipment ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8 md:p-12 text-center">
                <div className="glass-button rounded-2xl p-6 inline-block mb-6">
                  <Package className="h-10 w-10" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Start a New Shipment</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
                  Create a new shipment to begin adding products. Document everything before you seal and ship.
                </p>
                <button onClick={handleCreateShipment} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors">
                  <Plus className="h-5 w-5" />
                  New Shipment
                </button>
              </motion.div>
            ) : (
              <>
                {/* Active Shipment Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="glass-button rounded-xl p-3">
                        <Box className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-mono text-lg font-light">{activeShipment.shipment_number}</h3>
                        <span className="text-sm font-mono text-muted-foreground">
                          {STATUS_LABELS[activeShipment.status]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-2xl font-light">{totalItems}</p>
                      <p className="text-xs text-muted-foreground font-mono">items</p>
                    </div>
                  </div>
                </motion.div>

                {/* Product Search + Keypad (only for building status) */}
                {activeShipment.status === "building" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6 md:p-8">
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">Add Products</p>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                          // Delay so click on result registers before dropdown hides
                          setTimeout(() => setIsSearchFocused(false), 200)
                        }}
                        placeholder="Type to search products..."
                        className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
                        autoComplete="off"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                      {searchResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 max-h-60 overflow-y-auto rounded-xl border border-white/[0.08]">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                setSelectedProduct(product)
                                setSearchQuery(product.name)
                                setIsSearchFocused(false)
                                setQuantityInput("1")
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-foreground">{product.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                                      <Hash className="h-3 w-3" />{product.supplier_code}
                                    </span>
                                    {product.category && (
                                      <span className="text-xs text-muted-foreground">· {product.category}</span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground font-mono">{product.current_stock} in stock</span>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Selected Product + Calculator Keypad */}
                    {selectedProduct && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="glass-card rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <p className="text-foreground font-light">{selectedProduct.name}</p>
                              {selectedProduct.supplier_code && (
                                <p className="text-sm text-muted-foreground font-mono mt-1">Code: {selectedProduct.supplier_code}</p>
                              )}
                            </div>
                            <button onClick={() => { setSelectedProduct(null); setSearchQuery(""); setQuantityInput("1"); setTimeout(() => searchInputRef.current?.focus(), 50) }} className="text-muted-foreground hover:text-foreground">
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Quantity Display */}
                          <div className="text-center mb-6">
                            <div className="glass-button rounded-2xl p-6 inline-block min-w-[160px]">
                              <p className="font-mono text-4xl md:text-5xl font-light">
                                {quantityInput || "0"}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono mt-2 tracking-widest uppercase">Quantity</p>
                            </div>
                          </div>

                          {/* Calculator Keypad */}
                          <div className="max-w-[280px] mx-auto mb-6">
                            <CalculatorKeypad
                              value={quantityInput}
                              onChange={setQuantityInput}
                              onEnter={handleAddItem}
                            />
                          </div>

                          <button
                            onClick={handleAddItem}
                            className="w-full py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="h-5 w-5" />
                            Add {parseInt(quantityInput) || 1}x {selectedProduct.name}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Items in Box */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6 md:p-8">
                  <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">
                    Box Contents ({activeShipment.items?.length || 0} products, {totalItems} units)
                  </p>

                  {activeShipment.items?.length ? (
                    <div className="space-y-3">
                      {activeShipment.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="glass-button rounded-lg p-2"><Box className="h-4 w-4" /></div>
                            <div>
                              <p className="text-foreground">{item.product_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.supplier_code && <span className="text-xs text-muted-foreground font-mono">#{item.supplier_code}</span>}
                                <span className="text-xs text-muted-foreground font-mono">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          {activeShipment.status === "building" && (
                            <button onClick={() => handleRemoveItem(item.id)} className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground font-mono">No items added yet</p>
                    </div>
                  )}
                </motion.div>

                {/* Photos */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Photos ({activeShipment.photos?.length || 0})</p>
                    {(activeShipment.status === "building" || activeShipment.status === "sealed") && (
                      <>
                        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-sm font-mono disabled:opacity-50">
                          <Camera className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Add Photo"}
                        </button>
                      </>
                    )}
                  </div>

                  {activeShipment.photos?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activeShipment.photos.map((photo) => (
                        <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/[0.08]">
                          <img src={photo.photo_url} alt={photo.caption || "Shipment photo"} className="w-full h-full object-cover" />
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                              <p className="text-xs text-white font-mono truncate">{photo.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-white/[0.1] rounded-xl">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-mono">Take photos of the box contents before sealing</p>
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-4">
                  {activeShipment.status === "building" && (
                    <button onClick={handleSealBox} className="w-full py-4 rounded-2xl glass-button border-white/[0.15] font-mono hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2">
                      <Lock className="h-5 w-5" />
                      Seal Box
                    </button>
                  )}

                  {(activeShipment.status === "sealed" || showShipForm) && (
                    <div className="glass-card rounded-3xl p-6 md:p-8">
                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">Shipping Details</p>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Tracking Number</label>
                          <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number..." className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">Carrier</label>
                          <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="DHL, FedEx, UPS..." className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors" />
                        </div>
                      </div>
                      <button onClick={handleMarkShipped} className="w-full py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        Mark as Shipped
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>

          {/* Right Column: Shipment History */}
          <div className="space-y-6">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Shipment History</p>

            {shipments.length > 0 ? (
              <div className="space-y-3">
                {shipments.map((shipment) => {
                  const itemCount = shipment.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
                  const isActive = activeShipment?.id === shipment.id

                  return (
                    <button
                      key={shipment.id}
                      onClick={() => setActiveShipment(shipment)}
                      className={cn(
                        "w-full text-left glass-card rounded-2xl p-5 transition-all hover:bg-white/[0.04]",
                        isActive && "border-white/20 bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="glass-button rounded-lg p-2"><Box className="h-4 w-4" /></div>
                          <div>
                            <p className="font-mono text-sm">{shipment.shipment_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {itemCount} items{shipment.photos?.length ? ` | ${shipment.photos.length} photos` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-muted-foreground">{STATUS_LABELS[shipment.status]}</span>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(shipment.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-mono">No shipments yet</p>
              </div>
            )}

            {!activeShipment && (
              <button onClick={handleCreateShipment} className="w-full py-4 rounded-2xl glass-button text-muted-foreground hover:text-foreground font-mono text-sm flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                New Shipment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
