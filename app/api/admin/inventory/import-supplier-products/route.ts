import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth-server"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { generateVariantBarcode } from "@/lib/barcode-generator"

export const dynamic = "force-dynamic"

// Supplier product list parsed from CSV
const SUPPLIER_PRODUCTS = [
  { name: "5-amino-1mq", variant: "50mg oral pills", code: "1911", barcode: "" },
  { name: "ACE-031", variant: "1mg", code: "237892", barcode: "" },
  { name: "Adipotide", variant: "2mg", code: "546283", barcode: "FUMTRHUIV54PU" },
  { name: "AICAR", variant: "50mg", code: "982735", barcode: "" },
  { name: "AOD-9604", variant: "2mg", code: "674529", barcode: "FFH39467DK" },
  { name: "AOD-9604", variant: "5mg", code: "523899", barcode: "" },
  { name: "BPC-157", variant: "10mg", code: "429386", barcode: "GGG58135DK" },
  { name: "BPC-157", variant: "2mg", code: "392847", barcode: "" },
  { name: "BPC-157", variant: "5mg", code: "758294", barcode: "" },
  { name: "Bronchogen", variant: "20mg", code: "", barcode: "" },
  { name: "Cagrilintide", variant: "10mg", code: "797228-7", barcode: "HRKVLZUSKMHH52RX" },
  { name: "Cagrilintide", variant: "5mg", code: "592783-9", barcode: "HRKVLZUSKMHH9YL" },
  { name: "Cardiogen", variant: "20mg", code: "380688", barcode: "" },
  { name: "Cartalax", variant: "20mg", code: "385359", barcode: "" },
  { name: "Chonluten", variant: "20mg", code: "", barcode: "" },
  { name: "CJC-1295 with DAC", variant: "10mg", code: "872935", barcode: "" },
  { name: "CJC-1295 with DAC", variant: "2mg", code: "583472", barcode: "HAG5537BZXLGOO7DK" },
  { name: "CJC-1295 with DAC", variant: "5mg", code: "294678", barcode: "HAG5537BZXLGOO0DK" },
  { name: "CJC-1295 without DAC", variant: "10mg", code: "293846", barcode: "HAG5537BZXLRIFIRG53AS" },
  { name: "CJC-1295 without DAC", variant: "2mg", code: "395726", barcode: "HAG5537BZXLRIFIRG6PU" },
  { name: "CJC-1295 without DAC", variant: "5mg", code: "482937", barcode: "HAG5537BZXLRIFIRG9PU" },
  { name: "Cortagen", variant: "20mg", code: "", barcode: "" },
  { name: "DSIP", variant: "5mg", code: "758392", barcode: "IJMT8AS" },
  { name: "Epithalon", variant: "10mg", code: "482739", barcode: "JGMXKOXTE54PU" },
  { name: "Epithalon", variant: "50mg", code: "828923", barcode: "" },
  { name: "EPO", variant: "3000iu", code: "293888", barcode: "" },
  { name: "Follistatin", variant: "1mg", code: "293378", barcode: "" },
  { name: "GDF-8", variant: "1mg", code: "758293", barcode: "" },
  { name: "GHK-Cu", variant: "100mg", code: "293857", barcode: "LYOGX525DK" },
  { name: "GHK-Cu", variant: "50mg", code: "482973", barcode: "LYOGX92RX" },
  { name: "GHRH", variant: "2mg", code: "482810", barcode: "" },
  { name: "GHRP-2", variant: "10mg", code: "482795", barcode: "" },
  { name: "GHRP-2", variant: "5mg", code: "758492", barcode: "LYVT59YL" },
  { name: "GHRP-2", variant: "2mg", code: "628893", barcode: "" },
  { name: "GHRP-6", variant: "10mg", code: "795883", barcode: "" },
  { name: "GHRP-6", variant: "5mg", code: "293865", barcode: "" },
  { name: "Gonadorelin Acetate", variant: "2mg", code: "482795", barcode: "" },
  { name: "HCG", variant: "10000iu", code: "789018", barcode: "" },
  { name: "HCG", variant: "2000iu", code: "339877", barcode: "" },
  { name: "HCG", variant: "5000iu", code: "293874", barcode: "MTK9342NL" },
  { name: "Hexarelin", variant: "2mg", code: "758295", barcode: "MVBEUSXNE6QJ" },
  { name: "Hexarelin", variant: "5mg", code: "482796", barcode: "MVBEUSXNE9QJ" },
  { name: "HGH", variant: "10iu", code: "293875", barcode: "" },
  { name: "HGH", variant: "12iu", code: "289122", barcode: "" },
  { name: "HGH", variant: "36iu Cartridge", code: "D798599", barcode: "" },
  { name: "HGH", variant: "50iu Cartridge", code: "787200", barcode: "" },
  { name: "HMG", variant: "75iu", code: "758296", barcode: "MDK18WG" },
  { name: "Humanin", variant: "10mg", code: "758309", barcode: "" },
  { name: "IGF-1 LR3", variant: "0.1mg", code: "293876", barcode: "NXJ5OF5.6DK" },
  { name: "IGF-1 LR3", variant: "1mg", code: "482797", barcode: "NXJ5OF56DK" },
  { name: "Ipamorelin", variant: "10mg", code: "683877", barcode: "NGEQRFQQZR53AS" },
  { name: "Ipamorelin", variant: "2mg", code: "758297", barcode: "NGEQRFQQZR6PU" },
  { name: "Ipamorelin", variant: "5mg", code: "482798", barcode: "NGEQRFQQZR9PU" },
  { name: "Kisspeptin-10", variant: "5mg", code: "758298", barcode: "PZWWSSBYZR53-9YL" },
  { name: "KPV", variant: "10mg", code: "392782", barcode: "" },
  { name: "Livagen", variant: "20mg", code: "", barcode: "" },
  { name: "Melanotan 2", variant: "10mg", code: "482800", barcode: "RVPEQCFFE6-53AS" },
  { name: "Melanotan 2", variant: "5mg", code: "758299", barcode: "" },
  { name: "MGF", variant: "2mg", code: "482799", barcode: "" },
  { name: "MK-677", variant: "10mg oral pills", code: "3388", barcode: "" },
  { name: "MOTS-C", variant: "10mg", code: "293878", barcode: "RFXWF52RX" },
  { name: "NAD+", variant: "100mg", code: "378922", barcode: "" },
  { name: "NAD+", variant: "1000mg", code: "798869", barcode: "" },
  { name: "NAD+", variant: "500mg", code: "598809", barcode: "SRH934YL" },
  { name: "NMN", variant: "50mg oral pills", code: "2937-1", barcode: "" },
  { name: "Ovagen", variant: "20mg", code: "763389", barcode: "" },
  { name: "Oxytocin Acetate", variant: "2mg", code: "293879", barcode: "TOCXRQUSRGIWOFJ9QK" },
  { name: "Oxytocin Acetate", variant: "10mg", code: "879232", barcode: "" },
  { name: "Pancragen", variant: "20mg", code: "", barcode: "" },
  { name: "PE-22-28", variant: "10mg", code: "235728", barcode: "" },
  { name: "PEG-MGF", variant: "2mg", code: "758300", barcode: "UVKQJT" },
  { name: "PEG-MGF", variant: "6mg", code: "877892", barcode: "UVKQJT" },
  { name: "Pinealon", variant: "20mg", code: "782809", barcode: "" },
  { name: "PNC-27", variant: "10mg", code: "656779", barcode: "" },
  { name: "PNC-27", variant: "5mg", code: "390229", barcode: "" },
  { name: "Prostamax", variant: "20mg", code: "382789", barcode: "" },
  { name: "PT-141", variant: "10mg", code: "482801", barcode: "UK58452RX" },
  { name: "PT-141", variant: "5mg", code: "332889", barcode: "UK5849YL" },
  { name: "Retatrutide", variant: "10mg", code: "482809", barcode: "WVXEWFGYZHI44YL" },
  { name: "Retatrutide", variant: "20mg", code: "368782J", barcode: "" },
  { name: "Retatrutide", variant: "30mg", code: "318769", barcode: "" },
  { name: "Selank", variant: "5mg", code: "293880", barcode: "XVPEQY7RX" },
  { name: "Semaglutide", variant: "10mg", code: "293881", barcode: "XVQEJZGYZHI44YL" },
  { name: "Semaglutide", variant: "2mg", code: "758301", barcode: "XVQEJZGYZHI5AS" },
  { name: "Semaglutide", variant: "5mg", code: "482802", barcode: "XVQEJZGYZHI8AS" },
  { name: "Semax", variant: "10mg", code: "758302", barcode: "XVQEA52RX" },
  { name: "Sermorelin", variant: "2mg", code: "482803", barcode: "XVVQRFQQZR6PU" },
  { name: "Sermorelin", variant: "5mg", code: "293882", barcode: "XVVQRFQQZR9PU" },
  { name: "Sermorelin", variant: "10mg", code: "378926", barcode: "" },
  { name: "SLU-PP-332", variant: "250mcg oral pills", code: "7777", barcode: "" },
  { name: "SNAP-8", variant: "10mg", code: "398728-7", barcode: "XEET152RX" },
  { name: "SS-31", variant: "10mg", code: "758303", barcode: "XJ75-44YL" },
  { name: "SS-31", variant: "50mg", code: "482804", barcode: "XJ75-84YL" },
  { name: "TB-500", variant: "10mg", code: "360508", barcode: "YS943-52RX" },
  { name: "TB-500", variant: "2mg", code: "898605", barcode: "" },
  { name: "TB-500", variant: "5mg", code: "787903", barcode: "YS943-9YL" },
  { name: "Tesamorelin", variant: "10mg", code: "293884", barcode: "YVWEPCDJCMR44YL" },
  { name: "Tesamorelin", variant: "2mg", code: "758304", barcode: "YVWEPCDJCMR5AS" },
  { name: "Tesamorelin", variant: "5mg", code: "482805", barcode: "YVWEPCDJCMR8AS" },
  { name: "Testagen", variant: "20mg", code: "383705", barcode: "" },
  { name: "Thymagen", variant: "20mg", code: "382738", barcode: "" },
  { name: "Thymosin Alpha-1", variant: "10mg", code: "482806", barcode: "YYCQRGUSRPTKO3-67QK" },
  { name: "Thymosin Alpha-1", variant: "5mg", code: "758305", barcode: "YYCQRGUSRPTKO3-0DK" },
  { name: "Thymosin Beta-4", variant: "10mg", code: "482807", barcode: "" },
  { name: "Thymosin Beta-4", variant: "2mg", code: "293885", barcode: "" },
  { name: "Thymosin Beta-4", variant: "5mg", code: "758306", barcode: "" },
  { name: "Thymulin", variant: "10mg", code: "293883", barcode: "YYCQXZUNE" },
  { name: "Tirzepatide", variant: "2mg", code: "798202", barcode: "" },
  { name: "Tirzepatide", variant: "10mg", code: "482808", barcode: "YZVDHDMYZHI44YL" },
  { name: "Tirzepatide", variant: "15mg Cartridge", code: "D293887", barcode: "" },
  { name: "Tirzepatide", variant: "15mg", code: "293887", barcode: "YZVDHDMYZHI49YL" },
  { name: "Tirzepatide", variant: "30mg", code: "758308", barcode: "YZVDHDMYZHI64YL" },
  { name: "Tirzepatide", variant: "5mg", code: "758307", barcode: "YZVDHDMYZHI8AS" },
  { name: "Tirzepatide", variant: "60mg", code: "782560", barcode: "YZVDHDMYZHI94YL" },
  { name: "Triptorelin", variant: "100mcg", code: "293886", barcode: "" },
  { name: "Vesilute", variant: "20mg", code: "", barcode: "" },
  { name: "Vesugen", variant: "20mg", code: "", barcode: "" },
  { name: "Vilon", variant: "20mg", code: "", barcode: "" },
  // Blends
  { name: "Semax/Selank Blend", variant: "12mg/12mg", code: "797890", barcode: "" },
  { name: "BPC-157/TB-500/Cartalax Blend", variant: "12mg/12mg/12mg", code: "378090", barcode: "" },
  { name: "Thymosin Alpha-1/Thymulin Blend", variant: "12mg/12mg", code: "229700", barcode: "" },
  { name: "ARA-290", variant: "12mg", code: "258900", barcode: "" },
  { name: "Klow Blend", variant: "12/12/12/60mg", code: "972780", barcode: "" },
  { name: "BPC-157", variant: "24mg", code: "796782", barcode: "" },
  { name: "CJC-1295/Ipamorelin Blend", variant: "5mg/5mg", code: "271920", barcode: "" },
  { name: "5-amino-1mq", variant: "60mg", code: "289182", barcode: "" },
  { name: "BPC-157/TB-500 Blend", variant: "10mg/10mg", code: "390B2512", barcode: "" },
  { name: "TB-500/BPC-157/GHK-Cu Blend", variant: "11mg/11mg/75mg", code: "899783", barcode: "" },
]

// POST /api/admin/inventory/import-supplier-products
export async function POST(request: NextRequest) {
  const authResult = await verifyAdmin(request)
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  const supabase = getSupabaseAdminClient()
  
  // Get existing products
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('base_name, variant, supplier_code, barcode')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  // Create lookup sets
  const existingSet = new Set<string>()
  const existingCodes = new Set<string>()
  
  for (const p of existingProducts || []) {
    existingSet.add(`${p.base_name.toLowerCase()}|${p.variant.toLowerCase()}`)
    if (p.supplier_code) existingCodes.add(p.supplier_code.toLowerCase())
    if (p.barcode) existingCodes.add(p.barcode.toLowerCase())
  }

  // Get a default category for peptides
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%peptide%')
    .limit(1)
  
  const defaultCategoryId = categories?.[0]?.id || null

  // Filter to only missing products
  const toAdd = SUPPLIER_PRODUCTS.filter(p => {
    const key = `${p.name.toLowerCase()}|${p.variant.toLowerCase()}`
    // Skip if name+variant exists
    if (existingSet.has(key)) return false
    // Skip if supplier code already exists
    if (p.code && existingCodes.has(p.code.toLowerCase())) return false
    return true
  })

  if (toAdd.length === 0) {
    return NextResponse.json({
      success: true,
      added: 0,
      message: 'All products already exist in inventory'
    })
  }

  // Prepare products for insertion
  // Generate barcodes using Vigenère cipher for items without existing barcodes
  const productsToInsert = toAdd.map(p => {
    // Use existing barcode if provided, otherwise generate using FREEDOM cipher
    const barcode = p.barcode || generateVariantBarcode(p.name, p.variant)
    
    return {
      barcode,
      name: `${p.name} ${p.variant}`,
      base_name: p.name,
      variant: p.variant,
      category_id: defaultCategoryId,
      image_url: null,
      description: null,
      initial_stock: 0,
      current_stock: 0,
      restock_level: 5,
      manual_adjustment: 0,
      cost_price: "0",
      b2b_price: "0",
      retail_price: "0",
      supplier_price: "0",
      supplier_code: p.code || null,
      is_active: true,
      color: "#6366f1", // Default purple
      cart_image: null,
      cart_product_detail: null,
      last_stock_update: new Date().toISOString(),
    }
  })

  const { data: insertedProducts, error: insertError } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select('id, name')

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/supplier/inventory')

  return NextResponse.json({
    success: true,
    added: insertedProducts?.length || 0,
    products: insertedProducts?.map(p => p.name) || [],
    message: `Successfully added ${insertedProducts?.length || 0} new products`
  })
}

// GET - Preview what would be added
export async function GET(request: NextRequest) {
  const authResult = await verifyAdmin(request)
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  const supabase = getSupabaseAdminClient()
  
  // Get existing products
  const { data: existingProducts } = await supabase
    .from('products')
    .select('base_name, variant, supplier_code, barcode')

  // Create lookup sets
  const existingSet = new Set<string>()
  const existingCodes = new Set<string>()
  
  for (const p of existingProducts || []) {
    existingSet.add(`${p.base_name.toLowerCase()}|${p.variant.toLowerCase()}`)
    if (p.supplier_code) existingCodes.add(p.supplier_code.toLowerCase())
    if (p.barcode) existingCodes.add(p.barcode.toLowerCase())
  }

  // Categorize products
  const existing = SUPPLIER_PRODUCTS.filter(p => {
    const key = `${p.name.toLowerCase()}|${p.variant.toLowerCase()}`
    return existingSet.has(key) || (p.code && existingCodes.has(p.code.toLowerCase()))
  })

  const toAdd = SUPPLIER_PRODUCTS.filter(p => {
    const key = `${p.name.toLowerCase()}|${p.variant.toLowerCase()}`
    if (existingSet.has(key)) return false
    if (p.code && existingCodes.has(p.code.toLowerCase())) return false
    return true
  })

  return NextResponse.json({
    total_supplier_products: SUPPLIER_PRODUCTS.length,
    already_exists: existing.length,
    to_add: toAdd.length,
    existing_products: existing.map(p => `${p.name} ${p.variant}`),
    new_products: toAdd.map(p => ({
      name: `${p.name} ${p.variant}`,
      supplier_code: p.code || null,
      barcode: p.barcode || generateVariantBarcode(p.name, p.variant),
      has_existing_barcode: !!p.barcode
    }))
  })
}
