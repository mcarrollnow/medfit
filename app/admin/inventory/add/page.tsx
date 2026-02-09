"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  DollarSign,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ShoppingCart,
  FolderOpen,
  BarChart3,
  Eye,
  Box,
  Barcode,
  GripVertical,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  getCategories,
  createProductWithVariants,
  createCategory,
  type Category,
} from "@/app/actions/inventory"
import { generateVariantBarcode, decryptBarcode } from "@/lib/barcode-generator"
import { AIDescriptionGenerator } from "@/components/ai-description-generator"

interface ProductRating {
  label: string
  value: number
}

interface NewVariant {
  id: string
  variant: string
  barcode: string
  cost_price: string
  b2b_price: string
  retail_price: string
  supplier_price: string
  initial_stock: number
  restock_level: number
  image_url: string | null
  cart_image: string | null
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Base product fields
  const [baseName, setBaseName] = useState("")
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [cartProductDetail, setCartProductDetail] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [ratings, setRatings] = useState<ProductRating[]>([
    { label: "Efficacy", value: 8.0 },
    { label: "Safety Profile", value: 8.5 },
    { label: "Research Support", value: 7.5 },
  ])

  // New category form
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#FFFFFF")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  // Variants
  const [variants, setVariants] = useState<NewVariant[]>([
    {
      id: crypto.randomUUID(),
      variant: "",
      barcode: "",
      cost_price: "",
      b2b_price: "",
      retail_price: "",
      supplier_price: "",
      initial_stock: 0,
      restock_level: 10,
      image_url: null,
      cart_image: null,
    },
  ])

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true)
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Get display color from selected category (use neutral gray when no category)
  const displayColor = categoryId
    ? categories.find((c) => c.id === categoryId)?.color || "#6B7280"
    : "#6B7280"

  const getCategoryName = () => {
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId)
      if (cat) return cat.name
    }
    return "Uncategorized"
  }

  // Auto-generate barcode when base name or variant changes
  const updateVariantBarcode = (variantId: string, variantName: string) => {
    if (!baseName || !variantName) return ""
    return generateVariantBarcode(baseName, variantName)
  }

  const handleVariantChange = (variantId: string, field: keyof NewVariant, value: string | number | null) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const updated = { ...v, [field]: value }
          // Auto-update barcode when variant name changes
          if (field === "variant" && baseName) {
            updated.barcode = generateVariantBarcode(baseName, value as string)
          }
          return updated
        }
        return v
      })
    )
  }

  // Update all barcodes when base name changes
  const handleBaseNameChange = (newBaseName: string) => {
    setBaseName(newBaseName)
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        barcode: v.variant ? generateVariantBarcode(newBaseName, v.variant) : "",
      }))
    )
  }

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        variant: "",
        barcode: "",
        cost_price: "",
        b2b_price: "",
        retail_price: "",
        supplier_price: "",
        initial_stock: 0,
        restock_level: 10,
        image_url: null,
        cart_image: null,
      },
    ])
  }

  const removeVariant = (variantId: string) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((v) => v.id !== variantId))
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsCreatingCategory(true)
    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
        description: "",
      })

      if (result.success && result.data) {
        setCategories((prev) => [...prev, result.data!])
        setCategoryId(result.data.id)
        setNewCategoryName("")
        setNewCategoryColor("#FFFFFF")
        setShowNewCategory(false)
      } else {
        alert(`Error creating category: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating category:", error)
      alert("An error occurred while creating the category")
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const handleSave = async () => {
    if (!baseName.trim()) {
      alert("Please enter a product name")
      return
    }

    if (variants.some((v) => !v.variant.trim())) {
      alert("Please fill in all variant names")
      return
    }

    if (variants.some((v) => !v.retail_price)) {
      alert("Please fill in retail prices for all variants")
      return
    }

    setIsSaving(true)

    try {
      const result = await createProductWithVariants(
        {
          base_name: baseName.trim(),
          category_id: categoryId,
          description: description.trim() || null,
          is_active: isActive,
          color: displayColor,
          cart_product_detail: cartProductDetail.trim() || null,
          ratings,
        },
        variants.map((v) => ({
          barcode: v.barcode || generateVariantBarcode(baseName, v.variant),
          variant: v.variant.trim(),
          cost_price: v.cost_price || "0",
          b2b_price: v.b2b_price || "0",
          retail_price: v.retail_price || "0",
          initial_stock: v.initial_stock || 0,
          restock_level: v.restock_level || 10,
          image_url: v.image_url,
          cart_image: v.cart_image,
        }))
      )

      if (result.success) {
        router.push("/admin/inventory")
      } else {
        alert(`Error creating product: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("An error occurred while creating the product")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Inventory</span>
        </Link>

        <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: displayColor }} />
              <span className="text-white/50">{getCategoryName()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {baseName || "New Product"}
            </h1>
            <p className="text-white/50 mt-2">
              {variants.length} variant{variants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-white text-black hover:bg-white/90 px-6 h-12 w-full md:w-auto shrink-0"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Product"}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/50 mb-2">Product Name *</label>
                <Input
                  value={baseName}
                  onChange={(e) => handleBaseNameChange(e.target.value)}
                  placeholder="e.g., Semaglutide"
                  className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                />
                <p className="text-xs text-white/40 mt-2">
                  This is the base name that will be combined with variant names
                </p>
              </div>
            </div>
          </div>

          {/* Category & Display */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Category & Display
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/50 mb-2">Category</label>
                <div className="flex gap-2">
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value || null)}
                    className="rounded-xl flex-1 bg-white/5 border border-white/10 text-white h-12 px-4"
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className={cn(
                      "rounded-xl h-12 px-4 border-white/20 hover:bg-white/10",
                      showNewCategory ? "bg-white/10 text-white" : "text-white/70"
                    )}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                <p className="text-xs text-white/40 mt-2">
                  Category determines the product&apos;s display color
                </p>

                {/* New Category Form */}
                {showNewCategory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <h4 className="text-sm font-semibold text-white mb-4">Create New Category</h4>
                    <div className="flex gap-4 items-end flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-white/40 mb-1">Category Name</label>
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name..."
                          className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10"
                        />
                      </div>
                      <div className="w-40">
                        <label className="block text-xs text-white/40 mb-1">Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="h-10 w-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
                          />
                          <Input
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="rounded-xl bg-white/5 border-white/10 text-white h-10 font-mono text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory || !newCategoryName.trim()}
                        className="rounded-xl h-10 px-4 bg-white text-black hover:bg-white/90"
                      >
                        {isCreatingCategory ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-2">Display Color</label>
                <div className="flex gap-3 items-center">
                  <div
                    className="w-12 h-12 rounded-xl border border-white/20"
                    style={{ backgroundColor: displayColor }}
                  />
                  <span className="font-mono text-white/60">{displayColor}</span>
                  <span className="text-white/40 text-sm">(inherited from category)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded bg-white/5 border-white/20"
                />
                <label htmlFor="is_active" className="text-white">
                  Product is active and visible on store
                </label>
              </div>
            </div>
          </div>

          {/* Variants & Pricing */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Variants & Pricing
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Add variants like different dosages (5mg, 10mg, etc.). Barcodes are auto-generated using the Vigenère cipher.
            </p>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-white/30 cursor-grab" />
                      <Badge
                        className="text-black font-semibold"
                        style={{ backgroundColor: displayColor }}
                      >
                        Variant {index + 1}
                      </Badge>
                    </div>
                    {variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Variant Name *</label>
                      <Input
                        type="text"
                        value={variant.variant}
                        onChange={(e) => handleVariantChange(variant.id, "variant", e.target.value)}
                        placeholder="e.g., 5mg, 10mg, 15mg"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1 flex items-center gap-1">
                        <Barcode className="h-3 w-3" />
                        Barcode (Auto-Generated)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={variant.barcode}
                          readOnly
                          placeholder="Enter variant name to generate"
                          className="rounded-xl bg-white/5 border-white/10 text-white/60 font-mono"
                        />
                      </div>
                      {variant.barcode && (
                        <p className="text-xs text-white/30 mt-1 font-mono">
                          Decrypts to: {decryptBarcode(variant.barcode)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Cost Price</label>
                      <Input
                        type="text"
                        value={variant.cost_price}
                        onChange={(e) => handleVariantChange(variant.id, "cost_price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">B2B Price</label>
                      <Input
                        type="text"
                        value={variant.b2b_price}
                        onChange={(e) => handleVariantChange(variant.id, "b2b_price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Retail Price *</label>
                      <Input
                        type="text"
                        value={variant.retail_price}
                        onChange={(e) => handleVariantChange(variant.id, "retail_price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-amber-400/80 mb-1">Supplier Price</label>
                      <Input
                        type="text"
                        value={variant.supplier_price}
                        onChange={(e) => handleVariantChange(variant.id, "supplier_price", e.target.value)}
                        placeholder="0.00"
                        className="rounded-xl bg-amber-500/10 border-amber-500/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Initial Stock</label>
                      <Input
                        type="number"
                        value={variant.initial_stock}
                        onChange={(e) =>
                          handleVariantChange(variant.id, "initial_stock", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Restock Level</label>
                      <Input
                        type="number"
                        value={variant.restock_level}
                        onChange={(e) =>
                          handleVariantChange(variant.id, "restock_level", Number.parseInt(e.target.value) || 10)
                        }
                        placeholder="10"
                        className="rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button
                variant="outline"
                onClick={addVariant}
                className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 h-12"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </div>

          {/* Efficacy Ratings */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Efficacy Ratings
            </h3>
            <p className="text-sm text-white/50 mb-6">
              These rating bars are displayed on the product card. Values should be between 0-10.
            </p>
            <div className="space-y-4">
              {ratings.map((rating, index) => (
                <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6">
                      <label className="block text-xs text-white/40 mb-1">Label</label>
                      <Input
                        type="text"
                        value={rating.label}
                        onChange={(e) => {
                          const newRatings = [...ratings]
                          newRatings[index] = { ...newRatings[index], label: e.target.value }
                          setRatings(newRatings)
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
                            const newRatings = [...ratings]
                            newRatings[index] = {
                              ...newRatings[index],
                              value: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)),
                            }
                            setRatings(newRatings)
                          }}
                          className="rounded-xl bg-white/5 border-white/10 text-white"
                        />
                        <span className="font-mono font-bold text-lg" style={{ color: displayColor }}>
                          {rating.value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      {ratings.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRatings = [...ratings]
                            newRatings.splice(index, 1)
                            setRatings(newRatings)
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

              {ratings.length < 5 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setRatings([...ratings, { label: "New Rating", value: 7.0 }])
                  }}
                  className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rating
                </Button>
              )}
            </div>
          </div>

          {/* Product Description */}
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
                productName={baseName}
                category={getCategoryName()}
                variants={variants.filter(v => v.variant).map(v => ({ variant: v.variant }))}
                currentDescription={description || undefined}
                onGenerated={(desc) => setDescription(desc)}
                displayColor={displayColor}
              />
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product description for the expanded view..."
                  className="rounded-xl bg-white/5 border-white/10 text-white min-h-[150px]"
                />
                {/* Live Character/Word Counter */}
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={cn(
                      "font-medium",
                      (description?.split(/\s+/).filter(Boolean).length || 0) > 80 
                        ? "text-red-400" 
                        : (description?.split(/\s+/).filter(Boolean).length || 0) > 60 
                          ? "text-yellow-400" 
                          : "text-green-400"
                    )}>
                      {description?.split(/\s+/).filter(Boolean).length || 0}
                      <span className="text-white/40 font-normal"> / 80 words</span>
                    </span>
                    <span className={cn(
                      "font-medium",
                      (description?.length || 0) > 600 
                        ? "text-red-400" 
                        : (description?.length || 0) > 500 
                          ? "text-yellow-400" 
                          : "text-green-400"
                    )}>
                      {description?.length || 0}
                      <span className="text-white/40 font-normal"> / 600 chars</span>
                    </span>
                  </div>
                  {((description?.split(/\s+/).filter(Boolean).length || 0) > 80 || 
                    (description?.length || 0) > 600) && (
                    <span className="text-xs text-red-400">Over suggested limit</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Preview Text */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart Preview Text
            </h3>
            <p className="text-sm text-white/50 mb-4">
              Short description shown in the shopping cart
            </p>
            <Textarea
              value={cartProductDetail}
              onChange={(e) => setCartProductDetail(e.target.value)}
              placeholder="Brief description for cart display..."
              className="rounded-xl bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>

          {/* Live Preview */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Preview of how the product will appear in inventory list
            </p>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${displayColor}20` }}
                  >
                    <Box className="h-6 w-6" style={{ color: displayColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {baseName || "Product Name"}
                      </h3>
                      {!isActive && (
                        <Badge variant="outline" className="border-white/20 text-white/40">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/50">{getCategoryName()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex gap-2">
                    {variants.slice(0, 3).map((v) => (
                      <Badge
                        key={v.id}
                        variant="outline"
                        className="border-white/20 text-white/60"
                      >
                        {v.variant || "Variant"}
                      </Badge>
                    ))}
                    {variants.length > 3 && (
                      <Badge variant="outline" className="border-white/20 text-white/40">
                        +{variants.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {variants.reduce((sum, v) => sum + (v.initial_stock || 0), 0)} units
                    </p>
                    <p className="text-xs text-white/40">
                      From $
                      {Math.min(
                        ...variants.map((v) => Number.parseFloat(v.retail_price) || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-black/90 backdrop-blur-md px-4 py-4 mt-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/admin/inventory">
              <Button variant="outline" className="h-10 w-full sm:w-auto rounded-xl border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 w-full sm:w-auto rounded-xl bg-white text-black hover:bg-white/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

