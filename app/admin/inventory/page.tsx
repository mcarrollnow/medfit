"use client"

import { useState, useEffect } from "react"
import {
  Package,
  ChevronRight,
  Box,
  DollarSign,
  Eye,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ShoppingCart,
  FolderOpen,
  RefreshCw,
  BarChart3,
  Pencil,
  X,
  Check,
  Barcode,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { ProductExpandedPreview } from "@/components/product-expanded-preview"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getCategories,
  getProductsWithCategories,
  updateCategory,
  createCategory,
  deleteCategory,
  updateProduct,
  updateProductCategory,
  syncProductColorsFromCategory,
  updateProductRatings,
  updateProductBaseName,
  addVariantToProduct,
  deleteVariant,
  updateVariant,
  type Category,
  type Product,
} from "@/app/actions/inventory"
import { generateVariantBarcode, decryptBarcode } from "@/lib/barcode-generator"
import { AIDescriptionGenerator } from "@/components/ai-description-generator"
import { AIProfileGenerator } from "@/components/ai-profile-generator"
import { BulkProfileGenerator } from "@/components/bulk-profile-generator"
import { CSVPriceUploadModal } from "@/components/csv-price-upload-modal"

type InventoryTab = "products" | "categories"
type ViewTab = "card" | "expanded"

interface ProductRating {
  label: string
  value: number
}

interface GroupedProduct {
  base_name: string
  category_id: string | null
  category?: Category | null
  color: string
  description: string | null
  cart_product_detail: string | null
  is_active: boolean
  variants: Product[]
  ratings?: ProductRating[]
}

function groupProductsByBaseName(products: Product[]): GroupedProduct[] {
  const grouped: Record<string, GroupedProduct> = {}

  for (const product of products) {
    if (!grouped[product.base_name]) {
      // Build ratings array from individual columns (preferred) or JSONB fallback
      const ratings: ProductRating[] = []
      if (product.rating_label_1 && product.rating_value_1 !== undefined && product.rating_value_1 !== null) {
        ratings.push({ label: product.rating_label_1, value: Number(product.rating_value_1) })
      }
      if (product.rating_label_2 && product.rating_value_2 !== undefined && product.rating_value_2 !== null) {
        ratings.push({ label: product.rating_label_2, value: Number(product.rating_value_2) })
      }
      if (product.rating_label_3 && product.rating_value_3 !== undefined && product.rating_value_3 !== null) {
        ratings.push({ label: product.rating_label_3, value: Number(product.rating_value_3) })
      }
      // Fallback to JSONB ratings if individual columns are empty
      const finalRatings = ratings.length > 0 ? ratings : ((product as any).ratings || [])
      
      grouped[product.base_name] = {
        base_name: product.base_name,
        category_id: product.category_id,
        category: product.category,
        color: product.color,
        description: product.description,
        cart_product_detail: product.cart_product_detail,
        is_active: product.is_active,
        variants: [],
        ratings: finalRatings,
      }
    }
    grouped[product.base_name].variants.push(product)
  }

  return Object.values(grouped).sort((a, b) => a.base_name.localeCompare(b.base_name))
}

function getCategoryName(product: GroupedProduct, categories: Category[]): string {
  if (product.category) {
    return product.category.name
  }
  if (product.category_id) {
    const cat = categories.find((c) => c.id === product.category_id)
    if (cat) return cat.name
  }
  return "Uncategorized"
}

function getCategoryColor(product: GroupedProduct, categories: Category[]): string {
  if (product.category?.color) {
    return product.category.color
  }
  if (product.category_id) {
    const cat = categories.find((c) => c.id === product.category_id)
    if (cat?.color) return cat.color
  }
  return product.color || "#FFFFFF"
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inventoryTab, setInventoryTab] = useState<InventoryTab>("products")

  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const [editingProduct, setEditingProduct] = useState<GroupedProduct | null>(null)
  const [activeTab, setActiveTab] = useState<ViewTab>("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [previewSlidePosition, setPreviewSlidePosition] = useState<[number, number]>([0, -100])
  const [isPreviewAnimating, setIsPreviewAnimating] = useState(false)
  const [previewSelectedVariant, setPreviewSelectedVariant] = useState(0)

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#FFFFFF")

  // Save state
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  // Variant management state
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)
  const [isAddingVariant, setIsAddingVariant] = useState(false)
  const [isDeletingVariant, setIsDeletingVariant] = useState<string | null>(null)
  const [newVariant, setNewVariant] = useState({
    variant: "",
    barcode: "",
    cost_price: "",
    b2b_price: "",
    retail_price: "",
    supplier_price: "",
    initial_stock: 0,
    restock_level: 10,
  })

  // CSV Upload Modal
  const [showCSVUpload, setShowCSVUpload] = useState(false)

  // Bulk Profile Generator Modal
  const [showBulkProfileGenerator, setShowBulkProfileGenerator] = useState(false)
  const [bulkGenerateMode, setBulkGenerateMode] = useState<'missing' | 'full'>('missing')

  // Multi-select for bulk operations
  const [selectedProductNames, setSelectedProductNames] = useState<Set<string>>(new Set())
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)

  const toggleProductSelection = (baseName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProductNames(prev => {
      const newSet = new Set(prev)
      if (newSet.has(baseName)) {
        newSet.delete(baseName)
      } else {
        newSet.add(baseName)
      }
      return newSet
    })
  }

  const selectAllProducts = () => {
    setSelectedProductNames(new Set(filteredProducts.map(p => p.base_name)))
  }

  const clearSelection = () => {
    setSelectedProductNames(new Set())
    setIsMultiSelectMode(false)
  }

  const handleBulkGenerateSelected = (mode: 'missing' | 'full') => {
    setBulkGenerateMode(mode)
    setShowBulkProfileGenerator(true)
  }

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [categoriesData, productsData] = await Promise.all([getCategories(), getProductsWithCategories()])

        setCategories(categoriesData)
        setProducts(productsData)
        setGroupedProducts(groupProductsByBaseName(productsData))
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = groupedProducts.filter(
    (p) =>
      p.base_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(p, categories).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectProduct = (product: GroupedProduct) => {
    setSelectedProduct(product)
    // Deep copy and ensure ratings are initialized with defaults if empty
    const productCopy = JSON.parse(JSON.stringify(product))
    if (!productCopy.ratings || productCopy.ratings.length === 0) {
      productCopy.ratings = [
        { label: "Efficacy", value: 8.0 },
        { label: "Safety Profile", value: 8.5 },
        { label: "Research Support", value: 7.5 },
      ]
    }
    setEditingProduct(productCopy)
    setPreviewSlidePosition([0, -100])
    setPreviewSelectedVariant(0)
  }

  const handleBackToList = () => {
    setSelectedProduct(null)
    setEditingProduct(null)
    setActiveTab("card")
  }

  const handleSave = async () => {
    if (!editingProduct || !selectedProduct) return

    setIsSavingProduct(true)
    try {
      const originalBaseName = selectedProduct.base_name
      const newBaseName = editingProduct.base_name

      // If base_name changed, update it first
      if (originalBaseName !== newBaseName) {
        const result = await updateProductBaseName(originalBaseName, newBaseName)
        if (!result.success) {
          console.error("Failed to update product name:", result.error)
          return
        }
      }

      for (const variant of editingProduct.variants) {
        await updateProduct(variant.id, {
          description: editingProduct.description,
          cart_product_detail: editingProduct.cart_product_detail,
          is_active: editingProduct.is_active,
          color: editingProduct.color,
          category_id: editingProduct.category_id,
          // Include variant-specific fields (prices and stock)
          cost_price: variant.cost_price,
          b2b_price: variant.b2b_price,
          retail_price: variant.retail_price,
          current_stock: variant.current_stock,
        })
      }

      // Save ratings if they exist (use new base_name)
      if (editingProduct.ratings && editingProduct.ratings.length > 0) {
        await updateProductRatings(newBaseName, editingProduct.ratings)
      }

      // Update local state with new base_name
      setProducts((prev) =>
        prev.map((p) => {
          if (p.base_name === originalBaseName) {
            return {
              ...p,
              base_name: newBaseName,
              name: `${newBaseName} ${p.variant}`,
              description: editingProduct.description,
              cart_product_detail: editingProduct.cart_product_detail,
              is_active: editingProduct.is_active,
              color: editingProduct.color,
              category_id: editingProduct.category_id,
              category: editingProduct.category,
              ratings: editingProduct.ratings,
            } as Product
          }
          return p
        }),
      )
      setGroupedProducts((prev) => prev.map((p) => (p.base_name === originalBaseName ? editingProduct : p)))
      setSelectedProduct(editingProduct)
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleProductCategoryChange = async (categoryId: string) => {
    if (!editingProduct) return

    const category = categories.find((c) => c.id === categoryId)
    const newColor = category?.color || editingProduct.color

    setEditingProduct({
      ...editingProduct,
      category_id: categoryId,
      category: category || null,
      color: newColor,
    })

    for (const variant of editingProduct.variants) {
      await updateProductCategory(variant.id, categoryId)
      await updateProduct(variant.id, { color: newColor })
    }
  }

  const handleBulkProfileGenerated = async (baseName: string, profile: {
    categoryId: string | null
    categoryName: string | null
    ratings: { label: string; value: number }[]
    description: string
    cartDescription: string
  }) => {
    // Find the product
    const product = groupedProducts.find(p => p.base_name === baseName)
    if (!product) return

    // Get category details
    const category = profile.categoryId 
      ? categories.find(c => c.id === profile.categoryId) 
      : null
    const newColor = category?.color || product.color

    // Update all variants with the new profile data
    for (const variant of product.variants) {
      await updateProduct(variant.id, {
        description: profile.description || product.description,
        cart_product_detail: profile.cartDescription || product.cart_product_detail,
        color: newColor,
        category_id: profile.categoryId || product.category_id,
      })

      if (profile.categoryId) {
        await updateProductCategory(variant.id, profile.categoryId)
      }
    }

    // Save ratings
    if (profile.ratings && profile.ratings.length > 0) {
      await updateProductRatings(baseName, profile.ratings)
    }

    // Update local state
    setProducts(prev => 
      prev.map(p => {
        if (p.base_name === baseName) {
          return {
            ...p,
            description: profile.description || p.description,
            cart_product_detail: profile.cartDescription || p.cart_product_detail,
            color: newColor,
            category_id: profile.categoryId || p.category_id,
            category: category || p.category,
          } as Product
        }
        return p
      })
    )

    setGroupedProducts(prev =>
      prev.map(p => {
        if (p.base_name === baseName) {
          return {
            ...p,
            description: profile.description || p.description,
            cart_product_detail: profile.cartDescription || p.cart_product_detail,
            color: newColor,
            category_id: profile.categoryId || p.category_id,
            category: category || p.category,
            ratings: profile.ratings.length > 0 ? profile.ratings : p.ratings,
          }
        }
        return p
      })
    )
  }

  const handleVariantPriceChange = async (variantId: string, field: string, value: string) => {
    if (!editingProduct) return

    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)),
    })
  }

  const handleVariantStockChange = async (variantId: string, field: string, value: number) => {
    if (!editingProduct) return

    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)),
    })
  }

  const handlePreviewSlide = () => {
    if (isPreviewAnimating) return
    setIsPreviewAnimating(true)

    const activeIndex = previewSlidePosition.findIndex((pos) => pos === 0)
    const nextIndex = activeIndex === 0 ? 1 : 0

    setPreviewSlidePosition((prev) => {
      const newPos = [...prev] as [number, number]
      newPos[activeIndex] = 100
      newPos[nextIndex] = 0
      return newPos
    })

    setTimeout(() => {
      setPreviewSlidePosition((prev) => {
        const newPos = [...prev] as [number, number]
        newPos[activeIndex] = -100
        return newPos
      })
      setIsPreviewAnimating(false)
    }, 700)
  }

  const handleSaveCategory = async (category: Category) => {
    const result = await updateCategory(category.id, {
      name: category.name,
      color: category.color,
      description: category.description,
    })

    if (result.success) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))

      if (category.color) {
        await syncProductColorsFromCategory(category.id, category.color)

        setProducts((prev) =>
          prev.map((p) => {
            if (p.category_id === category.id) {
              return { ...p, category, color: category.color! }
            }
            return p
          }),
        )
        setGroupedProducts((prev) =>
          prev.map((p) => {
            if (p.category_id === category.id) {
              return {
                ...p,
                category,
                color: category.color!,
                variants: p.variants.map((v) => ({ ...v, color: category.color! })),
              }
            }
            return p
          }),
        )
      }
    }
    setEditingCategory(null)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    const result = await createCategory({
      name: newCategoryName,
      color: newCategoryColor,
      description: "",
    })

    if (result.success && result.data) {
      setCategories((prev) => [...prev, result.data!])
    }

    setNewCategoryName("")
    setNewCategoryColor("#FFFFFF")
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const result = await deleteCategory(categoryId)
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      setProducts((prev) =>
        prev.map((p) => {
          if (p.category_id === categoryId) {
            return { ...p, category_id: null, category: null }
          }
          return p
        }),
      )
      setGroupedProducts((prev) =>
        prev.map((p) => {
          if (p.category_id === categoryId) {
            return { ...p, category_id: null, category: null }
          }
          return p
        }),
      )
    }
  }

  // Update barcode when new variant name changes
  const handleNewVariantNameChange = (variantName: string) => {
    if (!editingProduct) return
    setNewVariant({
      ...newVariant,
      variant: variantName,
      barcode: variantName ? generateVariantBarcode(editingProduct.base_name, variantName) : "",
    })
  }

  const handleAddVariant = async () => {
    if (!editingProduct || !newVariant.variant.trim()) return
    
    setIsAddingVariant(true)
    try {
      const result = await addVariantToProduct(editingProduct.base_name, {
        barcode: newVariant.barcode || generateVariantBarcode(editingProduct.base_name, newVariant.variant),
        variant: newVariant.variant.trim(),
        cost_price: newVariant.cost_price || "0",
        b2b_price: newVariant.b2b_price || "0",
        retail_price: newVariant.retail_price || "0",
        supplier_price: newVariant.supplier_price || "",
        initial_stock: newVariant.initial_stock,
        restock_level: newVariant.restock_level,
        image_url: null,
        cart_image: null,
      })

      if (result.success && result.data) {
        // Add to local state
        const newVariantData = result.data
        setEditingProduct({
          ...editingProduct,
          variants: [...editingProduct.variants, newVariantData],
        })
        setProducts((prev) => [...prev, newVariantData])
        setGroupedProducts((prev) =>
          prev.map((p) =>
            p.base_name === editingProduct.base_name
              ? { ...p, variants: [...p.variants, newVariantData] }
              : p
          )
        )
        
        // Reset form
        setNewVariant({
          variant: "",
          barcode: "",
          cost_price: "",
          b2b_price: "",
          retail_price: "",
          supplier_price: "",
          initial_stock: 0,
          restock_level: 10,
        })
        setShowAddVariant(false)
      } else {
        alert(`Error adding variant: ${result.error}`)
      }
    } catch (error) {
      console.error("Error adding variant:", error)
      alert("An error occurred while adding the variant")
    } finally {
      setIsAddingVariant(false)
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!editingProduct) return
    
    if (!confirm("Are you sure you want to delete this variant?")) return
    
    setIsDeletingVariant(variantId)
    try {
      const result = await deleteVariant(variantId)
      
      if (result.success) {
        // Remove from local state
        setEditingProduct({
          ...editingProduct,
          variants: editingProduct.variants.filter((v) => v.id !== variantId),
        })
        setProducts((prev) => prev.filter((p) => p.id !== variantId))
        setGroupedProducts((prev) =>
          prev.map((p) =>
            p.base_name === editingProduct.base_name
              ? { ...p, variants: p.variants.filter((v) => v.id !== variantId) }
              : p
          )
        )
      } else {
        alert(`Error deleting variant: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting variant:", error)
      alert("An error occurred while deleting the variant")
    } finally {
      setIsDeletingVariant(null)
    }
  }

  const handleEditVariantField = async (variantId: string, field: string, value: string | number) => {
    if (!editingProduct) return

    // Update local state immediately
    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.map((v) => {
        if (v.id === variantId) {
          const updated = { ...v, [field]: value }
          // Also update barcode if variant name changes
          if (field === "variant") {
            updated.barcode = generateVariantBarcode(editingProduct.base_name, value as string)
          }
          return updated
        }
        return v
      }),
    })
  }

  const handleSaveVariantEdit = async (variantId: string) => {
    if (!editingProduct) return
    
    const variant = editingProduct.variants.find((v) => v.id === variantId)
    if (!variant) return

    try {
      const result = await updateVariant(variantId, {
        variant: variant.variant,
        barcode: variant.barcode,
        cost_price: variant.cost_price,
        b2b_price: variant.b2b_price,
        retail_price: variant.retail_price,
        current_stock: variant.current_stock,
        restock_level: variant.restock_level,
      })

      if (!result.success) {
        alert(`Error saving variant: ${result.error}`)
      }
    } catch (error) {
      console.error("Error saving variant:", error)
      alert("An error occurred while saving the variant")
    }
    
    setEditingVariantId(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading inventory...</div>
      </div>
    )
  }

  // Categories View
  if (inventoryTab === "categories") {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          {/* Back Navigation */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-base font-medium">Back to Admin</span>
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Categories</h1>
            <p className="text-lg text-white/50">Manage product categories and their display colors</p>
          </div>

          <div className="flex gap-3 mb-10">
            <button
              onClick={() => setInventoryTab("products")}
              className={cn(
                "rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
                "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10",
              )}
            >
              <Package className="h-4 w-4" />
              Products
            </button>
            <button
              onClick={() => setInventoryTab("categories")}
              className={cn(
                "rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
                "bg-white text-black",
              )}
            >
              <FolderOpen className="h-4 w-4" />
              Categories
            </button>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">Add New Category</h3>
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-white/50 mb-2">Category Name</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                />
              </div>
              <div className="w-48">
                <label className="block text-sm text-white/50 mb-2">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-12 w-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                  />
                  <Input
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="rounded-xl bg-white/5 border-white/10 text-white h-12 font-mono"
                  />
                </div>
              </div>
              <Button onClick={handleCreateCategory} className="rounded-xl h-12 px-6 bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                {editingCategory?.id === category.id ? (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-end flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm text-white/50 mb-2">Name</label>
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="rounded-xl bg-white/5 border-white/10 text-white h-12"
                        />
                      </div>
                      <div className="w-48">
                        <label className="block text-sm text-white/50 mb-2">Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingCategory.color || "#FFFFFF"}
                            onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                            className="h-12 w-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                          />
                          <Input
                            value={editingCategory.color || ""}
                            onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                            className="rounded-xl bg-white/5 border-white/10 text-white h-12 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-2">Description</label>
                      <Textarea
                        value={editingCategory.description || ""}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        className="rounded-xl bg-white/5 border-white/10 text-white min-h-[80px]"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => handleSaveCategory(editingCategory)} className="rounded-xl bg-white text-black hover:bg-white/90">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => setEditingCategory(null)} variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-white/40 flex items-center gap-2">
                      <RefreshCw className="h-3 w-3" />
                      Saving will update the color of all products in this category
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: category.color || "#666" }} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-white/50">
                          {groupedProducts.filter((p) => p.category_id === category.id).length} products
                          {category.description && ` • ${category.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-white/40 mr-4">{category.color || "No color"}</span>
                      <Button onClick={() => setEditingCategory(category)} variant="outline" size="sm" className="rounded-xl border-white/20 text-white hover:bg-white/10">
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteCategory(category.id)} variant="outline" size="sm" className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories found. Add one above to get started.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Product Detail View
  if (selectedProduct && editingProduct) {
    const displayColor = editingProduct.color || getCategoryColor(editingProduct, categories)

    return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <button onClick={handleBackToList} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Inventory</span>
          </button>

          <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: displayColor }} />
                <span className="text-white/50">{getCategoryName(editingProduct, categories)}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{editingProduct.base_name}</h1>
              <p className="text-white/50 mt-2">
                {editingProduct.variants.length} variant{editingProduct.variants.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSavingProduct}
              className="rounded-xl bg-white text-black hover:bg-white/90 px-6 h-12 w-full md:w-auto shrink-0 disabled:opacity-70"
            >
              {isSavingProduct ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="card">
            <TabsList className="grid grid-cols-2 gap-2 bg-transparent">
              <TabsTrigger value="card" onClick={() => setActiveTab("card")} className="data-[state=active]:bg-white data-[state=active]:text-black px-6 py-3 rounded-xl text-base">
                Card View
              </TabsTrigger>
              <TabsTrigger value="expanded" onClick={() => setActiveTab("expanded")} className="data-[state=active]:bg-white data-[state=active]:text-black px-6 py-3 rounded-xl text-base">
                Expanded View
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              {activeTab === "card" ? (
                <div className="space-y-8">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Card Preview
                    </h3>
                    <p className="text-sm text-white/50 mb-6">This is how the product card appears on the store</p>
                    <div className="flex justify-center">
                      <div className="w-full max-w-[320px]">
                        <ProductCard
                          groupedProduct={{
                            base_name: editingProduct.base_name,
                            variants: editingProduct.variants.map((v) => ({
                              id: v.id,
                              barcode: v.barcode,
                              name: `${editingProduct.base_name} ${v.variant}`,
                              base_name: editingProduct.base_name,
                              variant: v.variant,
                              category_id: editingProduct.category_id || "",
                              color: displayColor,
                              description: editingProduct.description || "",
                              cart_product_detail: editingProduct.cart_product_detail || "",
                              cart_image: v.cart_image || "",
                              image_url: v.image_url || "",
                              cost_price: Number.parseFloat(v.cost_price) || 0,
                              b2b_price: Number.parseFloat(v.b2b_price) || 0,
                              retail_price: Number.parseFloat(v.retail_price) || 0,
                              current_stock: v.current_stock,
                              initial_stock: v.initial_stock,
                              restock_level: v.restock_level,
                              manual_adjustment: v.manual_adjustment,
                              is_active: editingProduct.is_active,
                              created_at: v.created_at || new Date().toISOString(),
                              updated_at: v.updated_at || new Date().toISOString(),
                              last_stock_update: v.last_stock_update || new Date().toISOString(),
                            })),
                            lowestPrice: Math.min(...editingProduct.variants.map((v) => Number.parseFloat(v.retail_price) || 0)),
                            category: getCategoryName(editingProduct, categories),
                            color: displayColor,
                            ratings: editingProduct.ratings,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Profile Generator */}
                  <AIProfileGenerator
                    productName={editingProduct.base_name}
                    variants={editingProduct.variants}
                    categories={categories.map(c => ({ id: c.id, name: c.name }))}
                    currentCategoryId={editingProduct.category_id}
                    currentDescription={editingProduct.description || undefined}
                    currentCartDescription={editingProduct.cart_product_detail || undefined}
                    currentRatings={editingProduct.ratings}
                    displayColor={displayColor}
                    hasExistingContent={!!(editingProduct.description || editingProduct.cart_product_detail || (editingProduct.ratings && editingProduct.ratings.length > 0 && editingProduct.ratings[0].label !== 'Quality'))}
                    onGenerated={(profile) => {
                      const category = profile.categoryId 
                        ? categories.find(c => c.id === profile.categoryId) 
                        : null
                      const newColor = category?.color || editingProduct.color
                      
                      setEditingProduct({
                        ...editingProduct,
                        category_id: profile.categoryId || editingProduct.category_id,
                        category: category || editingProduct.category,
                        color: newColor,
                        ratings: profile.ratings.length > 0 ? profile.ratings : editingProduct.ratings,
                        description: profile.description || editingProduct.description,
                        cart_product_detail: profile.cartDescription || editingProduct.cart_product_detail,
                      })
                    }}
                  />

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Product Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-white/50 mb-2">Product Name</label>
                        <Input
                          type="text"
                          value={editingProduct.base_name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, base_name: e.target.value })}
                          placeholder="Enter product name..."
                          className="rounded-xl bg-white/5 border-white/10 text-white h-12"
                        />
                        <p className="text-xs text-white/40 mt-2">This is the main product name displayed on the store</p>
                      </div>
                      <div>
                        <label className="block text-sm text-white/50 mb-2">Category</label>
                        <select
                          value={editingProduct.category_id || ""}
                          onChange={(e) => handleProductCategoryChange(e.target.value)}
                          className="rounded-xl w-full bg-white/5 border border-white/10 text-white h-12 px-4"
                        >
                          <option value="">No Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-white/40 mt-2">Changing category will update the product&apos;s display color</p>
                      </div>
                      <div>
                        <label className="block text-sm text-white/50 mb-2">Display Color</label>
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-xl border border-white/20" style={{ backgroundColor: displayColor }} />
                          <span className="font-mono text-white/60">{displayColor}</span>
                          <span className="text-white/40 text-sm">(inherited from category)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={editingProduct.is_active}
                          onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                          className="w-5 h-5 rounded bg-white/5 border-white/20"
                        />
                        <label htmlFor="is_active" className="text-white">
                          Product is active and visible on store
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Variants & Pricing
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddVariant(!showAddVariant)}
                        className={cn(
                          "rounded-xl border-white/20 hover:bg-white/10",
                          showAddVariant ? "bg-white/10 text-white" : "text-white/70"
                        )}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>

                    {/* Add New Variant Form */}
                    {showAddVariant && (
                      <div
                        className="mb-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30"
                      >
                        <h4 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Variant
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Variant Name *</label>
                            <Input
                              type="text"
                              value={newVariant.variant}
                              onChange={(e) => handleNewVariantNameChange(e.target.value)}
                              placeholder="e.g., 15mg, 20mg"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1 flex items-center gap-1">
                              <Barcode className="h-3 w-3" />
                              Barcode (Auto-Generated)
                            </label>
                            <Input
                              type="text"
                              value={newVariant.barcode}
                              readOnly
                              placeholder="Enter variant name to generate"
                              className="rounded-xl bg-white/5 border-white/10 text-white/60 font-mono"
                            />
                            {newVariant.barcode && (
                              <p className="text-xs text-white/30 mt-1 font-mono">
                                Decrypts to: {decryptBarcode(newVariant.barcode)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Cost Price</label>
                            <Input
                              type="text"
                              value={newVariant.cost_price}
                              onChange={(e) => setNewVariant({ ...newVariant, cost_price: e.target.value })}
                              placeholder="0.00"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1">B2B Price</label>
                            <Input
                              type="text"
                              value={newVariant.b2b_price}
                              onChange={(e) => setNewVariant({ ...newVariant, b2b_price: e.target.value })}
                              placeholder="0.00"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Retail Price *</label>
                            <Input
                              type="text"
                              value={newVariant.retail_price}
                              onChange={(e) => setNewVariant({ ...newVariant, retail_price: e.target.value })}
                              placeholder="0.00"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-amber-400/80 mb-1">Supplier Price</label>
                            <Input
                              type="text"
                              value={newVariant.supplier_price}
                              onChange={(e) => setNewVariant({ ...newVariant, supplier_price: e.target.value })}
                              placeholder="0.00"
                              className="rounded-xl bg-amber-500/10 border-amber-500/30 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Initial Stock</label>
                            <Input
                              type="number"
                              value={newVariant.initial_stock}
                              onChange={(e) => setNewVariant({ ...newVariant, initial_stock: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Restock Level</label>
                            <Input
                              type="number"
                              value={newVariant.restock_level}
                              onChange={(e) => setNewVariant({ ...newVariant, restock_level: parseInt(e.target.value) || 10 })}
                              placeholder="10"
                              className="rounded-xl bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleAddVariant}
                            disabled={isAddingVariant || !newVariant.variant.trim()}
                            className="rounded-xl bg-green-500 text-white hover:bg-green-600"
                          >
                            {isAddingVariant ? "Adding..." : "Add Variant"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddVariant(false)
                              setNewVariant({
                                variant: "",
                                barcode: "",
                                cost_price: "",
                                b2b_price: "",
                                retail_price: "",
                                supplier_price: "",
                                initial_stock: 0,
                                restock_level: 10,
                              })
                            }}
                            className="rounded-xl border-white/20 text-white hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {editingProduct.variants.map((variant) => (
                        <div key={variant.id} className="rounded-xl bg-white/5 border border-white/10 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {editingVariantId === variant.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    value={variant.variant}
                                    onChange={(e) => handleEditVariantField(variant.id, "variant", e.target.value)}
                                    className="rounded-lg bg-white/5 border-white/10 text-white w-24 h-8 text-sm"
                                  />
                                </div>
                              ) : (
                                <span 
                                  className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold text-black"
                                  style={{ backgroundColor: displayColor }}
                                >
                                  {variant.variant}
                                </span>
                              )}
                              <div className="flex flex-col">
                                <span className="text-white/40 font-mono text-xs">{variant.barcode}</span>
                                {editingVariantId === variant.id && (
                                  <span className="text-white/30 font-mono text-xs">
                                    → {decryptBarcode(variant.barcode)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "border",
                                  variant.current_stock <= variant.restock_level ? "border-red-500/50 text-red-400" : "border-green-500/50 text-green-400",
                                )}
                              >
                                {variant.current_stock} in stock
                              </Badge>
                              {editingVariantId === variant.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSaveVariantEdit(variant.id)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingVariantId(null)}
                                    className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingVariantId(variant.id)}
                                    className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8 p-0"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  {editingProduct.variants.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteVariant(variant.id)}
                                      disabled={isDeletingVariant === variant.id}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg h-8 w-8 p-0"
                                    >
                                      {isDeletingVariant === variant.id ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div>
                              <label className="block text-xs text-white/40 mb-1">Cost Price</label>
                              <Input
                                type="text"
                                value={variant.cost_price}
                                onChange={(e) => {
                                  handleVariantPriceChange(variant.id, "cost_price", e.target.value)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "cost_price", e.target.value)
                                  }
                                }}
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 mb-1">B2B Price</label>
                              <Input
                                type="text"
                                value={variant.b2b_price}
                                onChange={(e) => {
                                  handleVariantPriceChange(variant.id, "b2b_price", e.target.value)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "b2b_price", e.target.value)
                                  }
                                }}
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 mb-1">Retail Price</label>
                              <Input
                                type="text"
                                value={variant.retail_price}
                                onChange={(e) => {
                                  handleVariantPriceChange(variant.id, "retail_price", e.target.value)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "retail_price", e.target.value)
                                  }
                                }}
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-amber-400/80 mb-1">Supplier Price</label>
                              <Input
                                type="text"
                                value={variant.supplier_price || ""}
                                onChange={(e) => {
                                  handleVariantPriceChange(variant.id, "supplier_price", e.target.value)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "supplier_price", e.target.value)
                                  }
                                }}
                                className="rounded-xl bg-amber-500/10 border-amber-500/30 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 mb-1">Stock</label>
                              <Input
                                type="number"
                                value={variant.current_stock}
                                onChange={(e) => {
                                  const val = Number.parseInt(e.target.value) || 0
                                  handleVariantStockChange(variant.id, "current_stock", val)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "current_stock", val)
                                  }
                                }}
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/40 mb-1">Restock Level</label>
                              <Input
                                type="number"
                                value={variant.restock_level}
                                onChange={(e) => {
                                  const val = Number.parseInt(e.target.value) || 10
                                  handleVariantStockChange(variant.id, "restock_level", val)
                                  if (editingVariantId === variant.id) {
                                    handleEditVariantField(variant.id, "restock_level", val)
                                  }
                                }}
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Efficacy Ratings Editor */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Efficacy Ratings
                    </h3>
                    <p className="text-sm text-white/50 mb-6">
                      Edit the rating bars displayed on the product card. Values should be between 0-10.
                    </p>
                    <div className="space-y-4">
                      {editingProduct.ratings?.map((rating, index) => (
                        <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-6">
                              <label className="block text-xs text-white/40 mb-1">Label</label>
                              <Input
                                type="text"
                                value={rating.label}
                                onChange={(e) => {
                                  const newRatings = [...(editingProduct.ratings || [])]
                                  newRatings[index] = { ...newRatings[index], label: e.target.value }
                                  setEditingProduct({ ...editingProduct, ratings: newRatings })
                                }}
                                placeholder="e.g., Weight Loss Efficacy"
                                className="rounded-xl bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-xs text-white/40 mb-1">Value (0-10)</label>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={rating.value}
                                  onChange={(e) => {
                                    const newRatings = [...(editingProduct.ratings || [])]
                                    newRatings[index] = { ...newRatings[index], value: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)) }
                                    setEditingProduct({ ...editingProduct, ratings: newRatings })
                                  }}
                                  className="rounded-xl bg-white/5 border-white/10 text-white"
                                />
                                <span className="font-mono font-bold text-lg" style={{ color: displayColor }}>
                                  {rating.value.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                              {(editingProduct.ratings?.length || 0) > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newRatings = [...(editingProduct.ratings || [])]
                                    newRatings.splice(index, 1)
                                    setEditingProduct({ ...editingProduct, ratings: newRatings })
                                  }}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* Preview bar */}
                          <div className="mt-3">
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${(rating.value / 10) * 100}%`,
                                  backgroundColor: displayColor,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(editingProduct.ratings?.length || 0) < 5 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newRatings = [...(editingProduct.ratings || [])]
                            newRatings.push({ label: "New Rating", value: 7.0 })
                            setEditingProduct({ ...editingProduct, ratings: newRatings })
                          }}
                          className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 h-12"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Rating
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Product Description with AI Generator */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Product Description
                    </h3>
                    <p className="text-sm text-white/50 mb-4">
                      This description appears in the expanded product view when customers click on a product
                    </p>
                    <div className="space-y-4">
                      <AIDescriptionGenerator
                        productName={editingProduct.base_name}
                        category={getCategoryName(editingProduct, categories)}
                        variants={editingProduct.variants}
                        currentDescription={editingProduct.description || undefined}
                        onGenerated={(desc) => setEditingProduct({ ...editingProduct, description: desc })}
                        displayColor={displayColor}
                      />
                      <div className="relative">
                        <Textarea
                          value={editingProduct.description || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          placeholder="Detailed product description for the expanded view..."
                          className="rounded-xl bg-white/5 border-white/10 text-white min-h-[150px]"
                        />
                        {/* Live Character/Word Counter */}
                        <div className="flex items-center justify-between mt-2 px-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span className={cn(
                              "font-medium",
                              (editingProduct.description?.split(/\s+/).filter(Boolean).length || 0) > 80 
                                ? "text-red-400" 
                                : (editingProduct.description?.split(/\s+/).filter(Boolean).length || 0) > 60 
                                  ? "text-yellow-400" 
                                  : "text-green-400"
                            )}>
                              {editingProduct.description?.split(/\s+/).filter(Boolean).length || 0}
                              <span className="text-white/40 font-normal"> / 80 words</span>
                            </span>
                            <span className={cn(
                              "font-medium",
                              (editingProduct.description?.length || 0) > 600 
                                ? "text-red-400" 
                                : (editingProduct.description?.length || 0) > 500 
                                  ? "text-yellow-400" 
                                  : "text-green-400"
                            )}>
                              {editingProduct.description?.length || 0}
                              <span className="text-white/40 font-normal"> / 600 chars</span>
                            </span>
                          </div>
                          {((editingProduct.description?.split(/\s+/).filter(Boolean).length || 0) > 80 || 
                            (editingProduct.description?.length || 0) > 600) && (
                            <span className="text-xs text-red-400">Over suggested limit</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart Preview Text
                    </h3>
                    <Textarea
                      value={editingProduct.cart_product_detail || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cart_product_detail: e.target.value })}
                      placeholder="Short description shown in cart..."
                      className="rounded-xl bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>
                </div>
              ) : (
                <ProductExpandedPreview
                  productData={{
                    base_name: editingProduct.base_name,
                    category_id: editingProduct.category_id,
                    category: editingProduct.category
                      ? {
                          id: editingProduct.category.id,
                          name: editingProduct.category.name,
                          color: editingProduct.category.color || null,
                          description: editingProduct.category.description || null,
                        }
                      : null,
                    color: displayColor,
                    description: editingProduct.description,
                    cart_product_detail: editingProduct.cart_product_detail,
                    is_active: editingProduct.is_active,
                    variants: editingProduct.variants,
                    ratings: editingProduct.ratings,
                  }}
                  displayColor={displayColor}
                  previewSlidePosition={previewSlidePosition}
                  handlePreviewSlide={handlePreviewSlide}
                  isPreviewAnimating={isPreviewAnimating}
                  setPreviewSlidePosition={setPreviewSlidePosition}
                  setIsPreviewAnimating={setIsPreviewAnimating}
                  previewSelectedVariant={previewSelectedVariant}
                  setPreviewSelectedVariant={setPreviewSelectedVariant}
                  categories={categories.map(c => ({ ...c, color: c.color ?? null }))}
                  onDescriptionChange={(desc) => setEditingProduct({ ...editingProduct, description: desc })}
                  previewMode={true}
                />
              )}
            </div>
          </Tabs>
        </div>
      </div>
    )
  }

  // Products List View
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Inventory</h1>
          <p className="text-lg text-white/50">Manage your products, variants, and categories</p>
        </div>

        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setInventoryTab("products")}
            className={cn(
              "rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
              "bg-white text-black",
            )}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setInventoryTab("categories")}
            className={cn(
              "rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
              "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10",
            )}
          >
            <FolderOpen className="h-4 w-4" />
            Categories
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or categories..."
            className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 max-w-md"
          />
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setShowBulkProfileGenerator(true)}
              className="rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30 h-12 px-6"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Profiles
            </Button>
            <Button
              onClick={() => setShowCSVUpload(true)}
              className="rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 h-12 px-6"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Import Prices
            </Button>
            <Link href="/admin/inventory/add">
              <Button className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Selection Mode Bar */}
        {(isMultiSelectMode || selectedProductNames.size > 0) && (
          <div className="mb-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-purple-300 font-medium">
                {selectedProductNames.size} product{selectedProductNames.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllProducts}
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20"
              >
                Select All ({filteredProducts.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkGenerateSelected('full')}
                disabled={selectedProductNames.size === 0}
                className="rounded-xl bg-purple-500 text-white hover:bg-purple-600 h-10 px-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Full Profiles
              </Button>
            </div>
          </div>
        )}

        {/* Enable multi-select hint */}
        {!isMultiSelectMode && selectedProductNames.size === 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMultiSelectMode(true)}
              className="text-white/40 hover:text-white/60 hover:bg-white/5 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Enable multi-select
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {filteredProducts.map((product, index) => {
            const productColor = product.color || getCategoryColor(product, categories)
            const totalStock = product.variants.reduce((sum, v) => sum + v.current_stock, 0)
            const lowStock = product.variants.some((v) => v.current_stock <= v.restock_level)
            const lowestPrice = Math.min(...product.variants.map((v) => Number.parseFloat(v.retail_price) || 0))
            const isSelected = selectedProductNames.has(product.base_name)

            return (
              <div
                key={product.base_name}
                onClick={() => {
                  if (isMultiSelectMode || selectedProductNames.size > 0) {
                    toggleProductSelection(product.base_name, { stopPropagation: () => {} } as React.MouseEvent)
                  } else {
                    handleSelectProduct(product)
                  }
                }}
                className={cn(
                  "rounded-2xl border p-6 cursor-pointer transition-all duration-300 group",
                  isSelected 
                    ? "bg-purple-500/10 border-purple-500/40 hover:bg-purple-500/15" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    {(isMultiSelectMode || selectedProductNames.size > 0) && (
                      <button
                        onClick={(e) => toggleProductSelection(product.base_name, e)}
                        className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-purple-500 border-purple-500"
                            : "border-white/30 hover:border-white/50"
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </button>
                    )}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${productColor}20` }}>
                      <Box className="h-6 w-6" style={{ color: productColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{product.base_name}</h3>
                        {!product.is_active && (
                          <Badge variant="outline" className="border-white/20 text-white/40">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{getCategoryName(product, categories)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-2">
                      {product.variants.slice(0, 3).map((v) => (
                        <Badge
                          key={v.id}
                          variant="outline"
                          className={cn("border", v.current_stock <= v.restock_level ? "border-red-500/50 text-red-400" : "border-white/20 text-white/60")}
                        >
                          {v.variant}
                        </Badge>
                      ))}
                      {product.variants.length > 3 && (
                        <Badge variant="outline" className="border-white/20 text-white/40">
                          +{product.variants.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-right">
                      <p className={cn("font-semibold", lowStock ? "text-red-400" : "text-white")}>{totalStock} units</p>
                      <p className="text-xs text-white/40">From ${lowestPrice.toFixed(2)}</p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-white/40">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No products found.</p>
          </div>
        )}

        {/* CSV Price Upload Modal */}
        <CSVPriceUploadModal
          isOpen={showCSVUpload}
          onClose={() => setShowCSVUpload(false)}
          onSuccess={async () => {
            // Reload products after successful price update
            const productsData = await getProductsWithCategories()
            setProducts(productsData)
            setGroupedProducts(groupProductsByBaseName(productsData))
          }}
        />

        {/* Bulk Profile Generator Modal */}
        {showBulkProfileGenerator && (
          <BulkProfileGenerator
            products={groupedProducts.map(p => ({
              base_name: p.base_name,
              category_id: p.category_id,
              description: p.description,
              cart_product_detail: p.cart_product_detail,
              ratings: p.ratings,
              variants: p.variants.map(v => ({ variant: v.variant }))
            }))}
            categories={categories.map(c => ({ id: c.id, name: c.name }))}
            onProfileGenerated={handleBulkProfileGenerated}
            onClose={() => {
              setShowBulkProfileGenerator(false)
              clearSelection()
            }}
            selectedProductNames={selectedProductNames.size > 0 ? selectedProductNames : undefined}
            mode={bulkGenerateMode}
          />
        )}
      </div>
    </div>
  )
}

