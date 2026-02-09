"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export interface Category {
  id: string
  name: string
  description: string | null
  color?: string | null
  created_at: string
}

export interface ProductRating {
  label: string
  value: number
}

export interface Product {
  id: string
  barcode: string
  name: string
  base_name: string
  variant: string
  category_id: string | null
  image_url: string | null
  description: string | null
  initial_stock: number
  current_stock: number
  restock_level: number
  manual_adjustment: number
  cost_price: string
  b2b_price: string
  retail_price: string
  supplier_price: string
  supplier_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  last_stock_update: string
  color: string
  cart_image: string | null
  cart_product_detail: string | null
  category?: Category | null
  ratings?: ProductRating[]
  // Individual rating columns (easier to edit in Supabase)
  rating_label_1?: string
  rating_value_1?: number
  rating_label_2?: string
  rating_value_2?: number
  rating_label_3?: string
  rating_value_3?: number
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getProductsWithCategories(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .order("base_name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("categories").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  return { success: true }
}

export async function createCategory(category: { name: string; description?: string; color?: string }): Promise<{
  success: boolean
  data?: Category
  error?: string
}> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) {
    console.error("Error creating category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  return { success: true, data }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  return { success: true }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Remove nested objects that shouldn't be sent to the products table
  const { category, ...productUpdates } = updates

  const { error } = await supabase.from("products").update(productUpdates).eq("id", id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export async function updateProductCategory(
  productId: string,
  categoryId: string | null,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("products").update({ category_id: categoryId }).eq("id", productId)

  if (error) {
    console.error("Error updating product category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  return { success: true }
}

export async function syncProductColorsFromCategory(
  categoryId: string,
  color: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("products").update({ color }).eq("category_id", categoryId)

  if (error) {
    console.error("Error syncing product colors:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export async function updateProductBaseName(
  oldBaseName: string,
  newBaseName: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  // First get all variants with the old base_name
  const { data: variants, error: fetchError } = await supabase
    .from("products")
    .select("id, variant")
    .eq("base_name", oldBaseName)
  
  if (fetchError) {
    console.error("Error fetching variants:", fetchError)
    return { success: false, error: fetchError.message }
  }
  
  // Update each variant with new base_name and updated name
  for (const variant of variants || []) {
    const newName = `${newBaseName} ${variant.variant}`
    const { error } = await supabase
      .from("products")
      .update({ base_name: newBaseName, name: newName })
      .eq("id", variant.id)
    
    if (error) {
      console.error("Error updating product base_name:", error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export async function updateProductRatings(
  baseName: string,
  ratings: ProductRating[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  // Update both JSONB column and individual columns for all variants with the same base_name
  const updateData: Record<string, unknown> = {
    ratings,
    rating_label_1: ratings[0]?.label || 'Efficacy',
    rating_value_1: ratings[0]?.value || 8.0,
    rating_label_2: ratings[1]?.label || 'Safety Profile',
    rating_value_2: ratings[1]?.value || 8.5,
    rating_label_3: ratings[2]?.label || 'Research Support',
    rating_value_3: ratings[2]?.value || 7.5,
  }
  
  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("base_name", baseName)

  if (error) {
    console.error("Error updating product ratings:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export interface CreateProductInput {
  barcode: string
  name: string
  base_name: string
  variant: string
  category_id: string | null
  image_url: string | null
  description: string | null
  initial_stock: number
  current_stock: number
  restock_level: number
  cost_price: string
  b2b_price: string
  retail_price: string
  supplier_price: string
  is_active: boolean
  color: string
  cart_image: string | null
  cart_product_detail: string | null
  ratings?: ProductRating[]
}

export async function createProduct(
  productData: CreateProductInput
): Promise<{ success: boolean; data?: Product; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...productData,
      manual_adjustment: 0,
      last_stock_update: new Date().toISOString(),
    })
    .select(`
      *,
      category:categories(*)
    `)
    .single()

  if (error) {
    console.error("Error creating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true, data }
}

export async function createProductWithVariants(
  baseProduct: {
    base_name: string
    category_id: string | null
    description: string | null
    is_active: boolean
    color: string
    cart_product_detail: string | null
    ratings?: ProductRating[]
  },
  variants: Array<{
    barcode: string
    variant: string
    cost_price: string
    b2b_price: string
    retail_price: string
    supplier_price: string
    initial_stock: number
    restock_level: number
    image_url: string | null
    cart_image: string | null
  }>
): Promise<{ success: boolean; data?: Product[]; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  const productsToInsert = variants.map((variant) => ({
    barcode: variant.barcode,
    name: `${baseProduct.base_name} ${variant.variant}`,
    base_name: baseProduct.base_name,
    variant: variant.variant,
    category_id: baseProduct.category_id,
    image_url: variant.image_url,
    description: baseProduct.description,
    initial_stock: variant.initial_stock,
    current_stock: variant.initial_stock,
    restock_level: variant.restock_level,
    manual_adjustment: 0,
    cost_price: variant.cost_price,
    b2b_price: variant.b2b_price,
    retail_price: variant.retail_price,
    supplier_price: variant.supplier_price || "",
    is_active: baseProduct.is_active,
    color: baseProduct.color,
    cart_image: variant.cart_image,
    cart_product_detail: baseProduct.cart_product_detail,
    ratings: baseProduct.ratings || [],
    last_stock_update: new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from("products")
    .insert(productsToInsert)
    .select(`
      *,
      category:categories(*)
    `)

  if (error) {
    console.error("Error creating products:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true, data }
}

export interface CreateVariantInput {
  barcode: string
  variant: string
  cost_price: string
  b2b_price: string
  retail_price: string
  supplier_price: string
  initial_stock: number
  restock_level: number
  image_url: string | null
  cart_image: string | null
}

export async function addVariantToProduct(
  baseName: string,
  variantData: CreateVariantInput
): Promise<{ success: boolean; data?: Product; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  // First, get an existing product with this base_name to copy shared fields
  const { data: existingProduct, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("base_name", baseName)
    .limit(1)
    .single()

  if (fetchError || !existingProduct) {
    console.error("Error fetching existing product:", fetchError)
    return { success: false, error: "Could not find existing product to copy shared fields" }
  }

  const newVariant = {
    barcode: variantData.barcode,
    name: `${baseName} ${variantData.variant}`,
    base_name: baseName,
    variant: variantData.variant,
    category_id: existingProduct.category_id,
    image_url: variantData.image_url,
    description: existingProduct.description,
    initial_stock: variantData.initial_stock,
    current_stock: variantData.initial_stock,
    restock_level: variantData.restock_level,
    manual_adjustment: 0,
    cost_price: variantData.cost_price,
    b2b_price: variantData.b2b_price,
    retail_price: variantData.retail_price,
    supplier_price: variantData.supplier_price || "",
    is_active: existingProduct.is_active,
    color: existingProduct.color,
    cart_image: variantData.cart_image,
    cart_product_detail: existingProduct.cart_product_detail,
    ratings: existingProduct.ratings || [],
    last_stock_update: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("products")
    .insert(newVariant)
    .select(`
      *,
      category:categories(*)
    `)
    .single()

  if (error) {
    console.error("Error creating variant:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteVariant(
  variantId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  // First check how many variants exist for this product
  const { data: variant, error: fetchError } = await supabase
    .from("products")
    .select("base_name")
    .eq("id", variantId)
    .single()

  if (fetchError || !variant) {
    console.error("Error fetching variant:", fetchError)
    return { success: false, error: "Could not find variant" }
  }

  // Count variants for this base_name
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("base_name", variant.base_name)

  if (countError) {
    console.error("Error counting variants:", countError)
    return { success: false, error: "Could not count variants" }
  }

  if (count && count <= 1) {
    return { success: false, error: "Cannot delete the last variant. Delete the entire product instead." }
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", variantId)

  if (error) {
    console.error("Error deleting variant:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export async function updateVariant(
  variantId: string,
  updates: {
    variant?: string
    barcode?: string
    cost_price?: string
    b2b_price?: string
    retail_price?: string
    supplier_price?: string
    current_stock?: number
    restock_level?: number
    image_url?: string | null
    cart_image?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  // If variant name is changing, also update the full name
  let updateData: Record<string, any> = { ...updates }
  
  if (updates.variant) {
    // Get the base_name to construct the full name
    const { data: existingVariant } = await supabase
      .from("products")
      .select("base_name")
      .eq("id", variantId)
      .single()
    
    if (existingVariant) {
      updateData.name = `${existingVariant.base_name} ${updates.variant}`
    }
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", variantId)

  if (error) {
    console.error("Error updating variant:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")
  return { success: true }
}

export type PriceType = "cost_price" | "b2b_price" | "retail_price" | "supplier_price"

export interface BulkPriceUpdate {
  product_id: string
  price: number
}

export async function bulkUpdatePrices(
  updates: BulkPriceUpdate[],
  priceType: PriceType
): Promise<{ success: boolean; updated: number; error?: string }> {
  const supabase = getSupabaseAdminClient()
  
  let updatedCount = 0
  const errors: string[] = []

  for (const update of updates) {
    const { error } = await supabase
      .from("products")
      .update({ [priceType]: update.price.toString() })
      .eq("id", update.product_id)

    if (error) {
      console.error(`Error updating product ${update.product_id}:`, error)
      errors.push(`Product ${update.product_id}: ${error.message}`)
    } else {
      updatedCount++
    }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/")

  if (errors.length > 0) {
    return { 
      success: updatedCount > 0, 
      updated: updatedCount, 
      error: `${errors.length} errors: ${errors.slice(0, 3).join(", ")}${errors.length > 3 ? "..." : ""}` 
    }
  }

  return { success: true, updated: updatedCount }
}
