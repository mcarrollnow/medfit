"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Package,
  ArrowLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  Box,
  AlertTriangle,
  Link2,
  Check,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import {
  getSupplierProducts,
  createSupplierProduct,
  updateSupplierProduct,
  deleteSupplierProduct,
  getSupplierProductCategories,
  type SupplierProduct,
} from "@/app/actions/supplier-portal"
import { toast } from "react-hot-toast"

// ============================================================
// Product Form Modal
// ============================================================
function ProductFormModal({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: SupplierProduct | null
  categories: string[]
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(product?.name || "")
  const [supplierCode, setSupplierCode] = useState(product?.supplier_code || "")
  const [description, setDescription] = useState(product?.description || "")
  const [category, setCategory] = useState(product?.category || "")
  const [newCategory, setNewCategory] = useState("")
  const [unitPrice, setUnitPrice] = useState(product?.unit_price?.toString() || "0")
  const [currentStock, setCurrentStock] = useState(product?.current_stock?.toString() || "0")
  const [restockLevel, setRestockLevel] = useState(product?.restock_level?.toString() || "0")
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [isSaving, setIsSaving] = useState(false)
  const [supplierId, setSupplierId] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId) return

    if (!name.trim() || !supplierCode.trim()) {
      toast.error("Name and supplier code are required")
      return
    }

    setIsSaving(true)
    const finalCategory = newCategory.trim() || category

    try {
      if (product) {
        // Update
        const result = await updateSupplierProduct(supplierId, product.id, {
          name: name.trim(),
          supplierCode: supplierCode.trim(),
          description: description.trim() || undefined,
          category: finalCategory || undefined,
          unitPrice: parseFloat(unitPrice) || 0,
          currentStock: parseInt(currentStock) || 0,
          restockLevel: parseInt(restockLevel) || 0,
          isActive,
        })
        if (result.success) {
          toast.success("Product updated")
          onSave()
        } else {
          toast.error(result.error || "Failed to update product")
        }
      } else {
        // Create
        const result = await createSupplierProduct(supplierId, {
          name: name.trim(),
          supplierCode: supplierCode.trim(),
          description: description.trim() || undefined,
          category: finalCategory || undefined,
          unitPrice: parseFloat(unitPrice) || 0,
          currentStock: parseInt(currentStock) || 0,
          restockLevel: parseInt(restockLevel) || 0,
          isActive,
        })
        if (result.success) {
          toast.success("Product created")
          onSave()
        } else {
          toast.error(result.error || "Failed to create product")
        }
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-6 md:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-light">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
              Product Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BPC-157 5mg"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* Supplier Code */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
              Your Product Code *
            </label>
            <input
              value={supplierCode}
              onChange={(e) => setSupplierCode(e.target.value)}
              placeholder="e.g. BPC5"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
              Category
            </label>
            <div className="flex gap-3">
              {categories.length > 0 ? (
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setNewCategory("") }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="">Select or type new...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : null}
              <input
                value={newCategory}
                onChange={(e) => { setNewCategory(e.target.value); setCategory("") }}
                placeholder={categories.length > 0 ? "Or new category..." : "Category name..."}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          {/* Price + Stock Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                Unit Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                Restock At
              </label>
              <input
                type="number"
                min="0"
                value={restockLevel}
                onChange={(e) => setRestockLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <span className="text-sm font-mono text-muted-foreground">Active in catalog</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                isActive ? "bg-foreground" : "bg-white/10"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full absolute top-1 transition-all",
                isActive ? "right-1 bg-background" : "left-1 bg-muted-foreground"
              )} />
            </button>
          </div>

          {/* Linked Product Info */}
          {product?.linked_product && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                  Linked to our catalog
                </span>
              </div>
              <p className="text-sm text-foreground">
                {product.linked_product.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Our stock: {product.linked_product.current_stock}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              "Saving..."
            ) : product ? (
              <>
                <Check className="h-5 w-5" />
                Update Product
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Delete Confirmation Modal
// ============================================================
function DeleteConfirmModal({
  product,
  onClose,
  onConfirm,
}: {
  product: SupplierProduct
  onClose: () => void
  onConfirm: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-8 md:p-10 w-full max-w-md text-center">
        <div className="glass-button rounded-2xl p-4 inline-block mb-6">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-light mb-4">
          Delete Product
        </h3>
        <p className="text-muted-foreground mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-foreground font-mono mb-8">
          {product.name} ({product.supplier_code})
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl glass-button font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive-foreground font-mono text-sm hover:bg-destructive/30 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Product Detail View
// ============================================================
function ProductDetail({
  product,
  onBack,
  onEdit,
  onDelete,
}: {
  product: SupplierProduct
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const isLowStock = product.current_stock <= product.restock_level

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Inventory</span>
        </button>

        {/* Header */}
        <div className="mb-16 md:mb-24">
          {product.category && (
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
              {product.category}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            {product.name}
            <br />
            <span className="italic text-muted-foreground">
              Code: {product.supplier_code}
            </span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button font-mono text-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button font-mono text-sm text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          <div className="text-center">
            <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
              <Package className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className={cn(
              "font-mono text-2xl md:text-3xl font-light mb-2",
              isLowStock && "text-destructive-foreground"
            )}>
              {product.current_stock}
            </p>
            <p className="text-sm md:text-base text-muted-foreground">In Stock</p>
          </div>
          <div className="text-center">
            <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="font-mono text-2xl md:text-3xl font-light mb-2">{product.restock_level}</p>
            <p className="text-sm md:text-base text-muted-foreground">Restock At</p>
          </div>
          <div className="text-center">
            <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
              <Box className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="font-mono text-2xl md:text-3xl font-light mb-2">
              ${product.unit_price.toFixed(2)}
            </p>
            <p className="text-sm md:text-base text-muted-foreground">Unit Price</p>
          </div>
          <div className="text-center">
            <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
              <Package className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="font-mono text-2xl md:text-3xl font-light mb-2">
              ${(product.current_stock * product.unit_price).toFixed(0)}
            </p>
            <p className="text-sm md:text-base text-muted-foreground">Stock Value</p>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <h3 className="font-serif text-xl md:text-2xl font-light mb-6">Description</h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Linked Product */}
        {product.linked_product && (
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-serif text-xl md:text-2xl font-light">Mapped to Our Catalog</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <p className="text-foreground font-light text-lg">{product.linked_product.name}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-muted-foreground font-mono">
                  Our stock: {product.linked_product.current_stock}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <h3 className="font-serif text-xl md:text-2xl font-light mb-6">Status</h3>
          <div className="flex flex-wrap gap-4">
            <span className={cn(
              "px-4 py-2 rounded-full text-sm font-mono",
              product.is_active
                ? "bg-white/[0.06] text-foreground"
                : "bg-white/[0.03] text-muted-foreground"
            )}>
              {product.is_active ? "Active" : "Inactive"}
            </span>
            {isLowStock && (
              <span className="px-4 py-2 rounded-full text-sm font-mono bg-destructive/10 text-destructive-foreground">
                Low Stock
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-6">
            Last updated: {new Date(product.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function SupplierInventoryPage() {
  const [supplierId, setSupplierId] = useState<string | null>(null)
  const [products, setProducts] = useState<SupplierProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null)

  // Modals
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<SupplierProduct | null>(null)

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

  const loadData = useCallback(async () => {
    if (!supplierId) return
    setIsLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        getSupplierProducts(supplierId),
        getSupplierProductCategories(supplierId),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supplierId])

  useEffect(() => {
    if (supplierId) loadData()
  }, [supplierId, loadData])

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Stats
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.is_active).length
  const lowStockProducts = products.filter(
    (p) => p.current_stock <= p.restock_level
  ).length
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.current_stock * p.unit_price,
    0
  )

  const handleDelete = async (product: SupplierProduct) => {
    if (!supplierId) return
    const result = await deleteSupplierProduct(supplierId, product.id)
    if (result.success) {
      toast.success("Product deleted")
      setDeletingProduct(null)
      setSelectedProduct(null)
      loadData()
    } else {
      toast.error(result.error || "Failed to delete product")
    }
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingProduct(null)
    loadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <Package className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading inventory...</p>
        </div>
      </div>
    )
  }

  // Product Detail View
  if (selectedProduct) {
    return (
      <>
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onEdit={() => {
            setEditingProduct(selectedProduct)
            setShowForm(true)
          }}
          onDelete={() => setDeletingProduct(selectedProduct)}
        />
        {showForm && (
          <ProductFormModal
            product={editingProduct}
            categories={categories}
            onClose={() => { setShowForm(false); setEditingProduct(null) }}
            onSave={() => {
              handleFormSave()
              // Refresh the selected product
              if (supplierId && selectedProduct) {
                getSupplierProducts(supplierId).then((data) => {
                  const updated = data.find((p) => p.id === selectedProduct.id)
                  if (updated) setSelectedProduct(updated)
                })
              }
            }}
          />
        )}
        {deletingProduct && (
          <DeleteConfirmModal
            product={deletingProduct}
            onClose={() => setDeletingProduct(null)}
            onConfirm={() => handleDelete(deletingProduct)}
          />
        )}
      </>
    )
  }

  // Products List View
  return (
    <>
      <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/supplier"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono tracking-wide">Back to Dashboard</span>
          </Link>

          {/* Header */}
          <div className="mb-16 md:mb-24">
            <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
              Your Catalog
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-balance">
              Inventory
              <br />
              <span className="italic text-muted-foreground">Manage your product catalog</span>
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {[
              { value: totalProducts, label: "Products" },
              { value: activeProducts, label: "Active" },
              { value: lowStockProducts, label: "Low Stock" },
              { value: `$${totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Stock Value" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                  <Package className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
                <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter + Add */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, or category..."
                className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-foreground font-mono focus:outline-none focus:border-white/20 transition-colors min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => { setEditingProduct(null); setShowForm(true) }}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const isLowStock = product.current_stock <= product.restock_level

              return (
                <div
                  key={product.id}
                  className="glass-card rounded-2xl p-6 md:p-8 cursor-pointer hover:bg-white/[0.04] transition-all duration-500 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div
                      className="flex items-center gap-4 flex-1 min-w-0"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="glass-button rounded-xl p-3">
                        <Box className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-serif text-lg md:text-xl font-light">
                            {product.name}
                          </h3>
                          {!product.is_active && (
                            <span className="text-xs font-mono text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                          {product.linked_product && (
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className="text-sm text-muted-foreground font-mono">
                            {product.supplier_code}
                          </span>
                          {product.category && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="text-sm text-muted-foreground">
                                {product.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="text-right" onClick={() => setSelectedProduct(product)}>
                        <p className={cn(
                          "font-mono text-lg font-light",
                          isLowStock && "text-destructive-foreground"
                        )}>
                          {product.current_stock} units
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ${product.unit_price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowForm(true) }}
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeletingProduct(product) }}
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-destructive-foreground transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <ChevronRight
                        className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors hidden md:block cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <div className="glass-button rounded-2xl p-6 inline-block mb-6">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-mono mb-6">
                {products.length === 0 ? "No products yet" : "No products match your search"}
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => { setEditingProduct(null); setShowForm(true) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingProduct(null) }}
          onSave={handleFormSave}
        />
      )}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={() => handleDelete(deletingProduct)}
        />
      )}
    </>
  )
}
