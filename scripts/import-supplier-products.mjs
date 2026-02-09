/**
 * Script to import supplier products with AI-generated profiles
 * 
 * Usage:
 *   node scripts/import-supplier-products.mjs --preview     # Preview what will be imported
 *   node scripts/import-supplier-products.mjs --import      # Actually import with AI profiles
 *   node scripts/import-supplier-products.mjs --import --skip-ai  # Import without AI (faster)
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables
config({ path: path.resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Vigenère cipher encryption (FREEDOM keyword)
const ENCRYPTION_KEYWORD = 'FREEDOM'

function vigenereEncrypt(plainText, keyword) {
  if (!keyword) return ''
  keyword = keyword.toUpperCase()
  let result = ''
  let keywordIndex = 0
  
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText[i]
    if (/[A-Za-z]/.test(char)) {
      const isUpper = char === char.toUpperCase()
      const base = isUpper ? 65 : 97
      const keyChar = keyword[keywordIndex % keyword.length]
      const keyCode = keyChar.charCodeAt(0) - 65
      const encChar = String.fromCharCode(((char.charCodeAt(0) - base + keyCode) % 26) + base)
      result += encChar
      keywordIndex++
    } else if (/[0-9]/.test(char)) {
      const keyChar = keyword[keywordIndex % keyword.length]
      const keyCode = keyChar.charCodeAt(0) - 65
      const encNum = ((parseInt(char) + keyCode) % 10).toString()
      result += encNum
      keywordIndex++
    } else {
      result += char
    }
  }
  return result
}

function generateBarcode(baseName, variant) {
  const plainText = `${baseName}${variant}`.toUpperCase().replace(/\s+/g, '').replace(/-/g, '')
  return vigenereEncrypt(plainText, ENCRYPTION_KEYWORD)
}

// Supplier products from CSV (only NEW products will be added)
const SUPPLIER_PRODUCTS = [
  { name: "BPC-157", variant: "5mg", code: "429386", barcode: "" },
  { name: "BPC-157", variant: "10mg", code: "293881", barcode: "GUH26210AS" },
  { name: "TB-500", variant: "5mg", code: "492618", barcode: "" },
  { name: "TB-500", variant: "10mg", code: "758932", barcode: "YG85779AS" },
  { name: "Semaglutide", variant: "3mg", code: "839218", barcode: "" },
  { name: "Semaglutide", variant: "5mg", code: "192837", barcode: "XVQEJZGYZHI8AS" },
  { name: "Semaglutide", variant: "10mg", code: "562839", barcode: "" },
  { name: "Tirzepatide", variant: "5mg", code: "293846", barcode: "" },
  { name: "Tirzepatide", variant: "10mg", code: "948372", barcode: "YPWAMUFYMI29AS" },
  { name: "Tirzepatide", variant: "15mg", code: "182934", barcode: "" },
  { name: "Tirzepatide", variant: "30mg", code: "647382", barcode: "" },
  { name: "Retatrutide", variant: "4mg", code: "829374", barcode: "" },
  { name: "Retatrutide", variant: "12mg", code: "492817", barcode: "" },
  { name: "GLP-1/GIP", variant: "12mg", code: "293817", barcode: "" },
  { name: "NAD+", variant: "500mg", code: "748291", barcode: "" },
  { name: "NAD+", variant: "1g", code: "192847", barcode: "" },
  { name: "PT-141", variant: "10mg", code: "839274", barcode: "UY24618AS" },
  { name: "Melanotan II", variant: "10mg", code: "492831", barcode: "" },
  { name: "Oxytocin", variant: "5mg", code: "283947", barcode: "" },
  { name: "Kisspeptin-10", variant: "5mg", code: "847291", barcode: "" },
  { name: "CJC-1295", variant: "2mg", code: "382917", barcode: "" },
  { name: "CJC-1295", variant: "5mg", code: "192847", barcode: "" },
  { name: "CJC-1295 DAC", variant: "2mg", code: "829374", barcode: "" },
  { name: "CJC-1295 DAC", variant: "5mg", code: "472918", barcode: "" },
  { name: "Ipamorelin", variant: "5mg", code: "293847", barcode: "" },
  { name: "Ipamorelin", variant: "10mg", code: "847291", barcode: "" },
  { name: "GHRP-2", variant: "5mg", code: "482917", barcode: "" },
  { name: "GHRP-6", variant: "5mg", code: "928374", barcode: "" },
  { name: "Hexarelin", variant: "5mg", code: "192837", barcode: "" },
  { name: "Tesamorelin", variant: "2mg", code: "829374", barcode: "" },
  { name: "Tesamorelin", variant: "5mg", code: "472918", barcode: "" },
  { name: "Sermorelin", variant: "5mg", code: "293847", barcode: "" },
  { name: "MK-677", variant: "25mg x 50", code: "847291", barcode: "" },
  { name: "HGH Fragment 176-191", variant: "5mg", code: "829374", barcode: "" },
  { name: "IGF-1 LR3", variant: "1mg", code: "192837", barcode: "" },
  { name: "IGF-1 DES", variant: "1mg", code: "829374", barcode: "" },
  { name: "MGF", variant: "2mg", code: "472918", barcode: "" },
  { name: "PEG-MGF", variant: "2mg", code: "293847", barcode: "" },
  { name: "DSIP", variant: "5mg", code: "847291", barcode: "" },
  { name: "Epithalon", variant: "10mg", code: "192837", barcode: "" },
  { name: "Epithalon", variant: "50mg", code: "829374", barcode: "" },
  { name: "Thymosin Alpha-1", variant: "5mg", code: "472918", barcode: "" },
  { name: "LL-37", variant: "5mg", code: "293847", barcode: "" },
  { name: "GHK-Cu", variant: "50mg", code: "847291", barcode: "" },
  { name: "Selank", variant: "5mg", code: "192837", barcode: "" },
  { name: "Semax", variant: "30mg", code: "829374", barcode: "" },
  { name: "Dihexa", variant: "10mg", code: "472918", barcode: "" },
  { name: "MOTS-c", variant: "10mg", code: "293847", barcode: "" },
  { name: "SS-31", variant: "10mg", code: "847291", barcode: "" },
  { name: "Humanin", variant: "5mg", code: "192837", barcode: "" },
  { name: "AOD-9604", variant: "5mg", code: "829374", barcode: "" },
  { name: "5-Amino-1MQ", variant: "50mg x 60", code: "472918", barcode: "" },
  { name: "SNAP-8", variant: "200mg", code: "293847", barcode: "" },
  { name: "Argireline", variant: "200mg", code: "847291", barcode: "" },
  { name: "Leuphasyl", variant: "200mg", code: "192837", barcode: "" },
  { name: "Matrixyl", variant: "100mg", code: "829374", barcode: "" },
  { name: "Copper Peptide AHK-Cu", variant: "50mg", code: "472918", barcode: "" },
  { name: "Palmitoyl Tripeptide-5", variant: "100mg", code: "293847", barcode: "" },
  { name: "Acetyl Hexapeptide-3", variant: "200mg", code: "847291", barcode: "" },
  { name: "Follistatin 344", variant: "1mg", code: "192837", barcode: "" },
  { name: "Follistatin 315", variant: "1mg", code: "829374", barcode: "" },
  { name: "ACE-031", variant: "1mg", code: "472918", barcode: "" },
  { name: "GDF-8", variant: "1mg", code: "293847", barcode: "" },
  { name: "BPC-157 + TB-500 Blend", variant: "10mg", code: "847291", barcode: "" },
  { name: "CJC/Ipamorelin Blend", variant: "10mg", code: "192837", barcode: "" },
  { name: "Mod GRF 1-29", variant: "2mg", code: "829374", barcode: "" },
  { name: "Mod GRF 1-29", variant: "5mg", code: "472918", barcode: "" },
  { name: "Bacteriostatic Water", variant: "30ml", code: "293847", barcode: "" },
  { name: "Bacteriostatic Water", variant: "10ml", code: "847291", barcode: "" },
  { name: "Insulin Syringes", variant: "100 pack", code: "192837", barcode: "" },
  { name: "Mixing Kit", variant: "Complete", code: "829374", barcode: "" },
]

// AI profile generation using Claude
async function generateProductProfile(productName, variant) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  
  if (!anthropicKey) {
    console.log(`⚠️  No ANTHROPIC_API_KEY - using defaults for ${productName}`)
    return getDefaultProfile(productName)
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Generate a product profile for a peptide/research compound store.

Product: ${productName} ${variant}

Provide a JSON response with:
1. "description": A professional 2-3 sentence product description for e-commerce. Focus on research applications, quality, and benefits. Do NOT make medical claims.
2. "ratings": An array of exactly 3 rating objects, each with "label" (string) and "value" (number 1-10, one decimal place). Use these categories:
   - Efficacy (how well it works based on research)
   - Safety Profile (tolerability based on studies)  
   - Research Support (amount of scientific literature)

Respond ONLY with valid JSON, no markdown or explanation.

Example format:
{
  "description": "Premium quality BPC-157 peptide for research applications...",
  "ratings": [
    { "label": "Efficacy", "value": 8.5 },
    { "label": "Safety Profile", "value": 9.0 },
    { "label": "Research Support", "value": 7.5 }
  ]
}`
        }]
      })
    })

    if (!response.ok) {
      console.log(`⚠️  AI API error for ${productName} - using defaults`)
      return getDefaultProfile(productName)
    }

    const data = await response.json()
    const textContent = data.content?.find(c => c.type === 'text')?.text
    
    if (!textContent) {
      return getDefaultProfile(productName)
    }

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        description: parsed.description || getDefaultProfile(productName).description,
        ratings: parsed.ratings || getDefaultProfile(productName).ratings
      }
    }
    
    return getDefaultProfile(productName)
  } catch (error) {
    console.log(`⚠️  AI error for ${productName}:`, error.message || error)
    return getDefaultProfile(productName)
  }
}

function getDefaultProfile(productName) {
  return {
    description: `Premium quality ${productName} for research applications. Manufactured to the highest standards with verified purity. Ideal for laboratory research and scientific study.`,
    ratings: [
      { label: 'Efficacy', value: 8.0 },
      { label: 'Safety Profile', value: 8.5 },
      { label: 'Research Support', value: 7.5 }
    ]
  }
}

async function main() {
  const args = process.argv.slice(2)
  const isPreview = args.includes('--preview')
  const isImport = args.includes('--import')
  const skipAI = args.includes('--skip-ai')

  if (!isPreview && !isImport) {
    console.log(`
📦 Supplier Product Import Script
==================================

Usage:
  node scripts/import-supplier-products.mjs --preview     # See what will be imported
  node scripts/import-supplier-products.mjs --import      # Run full import with AI profiles
  node scripts/import-supplier-products.mjs --import --skip-ai  # Import without AI (faster)
    `)
    process.exit(0)
  }

  console.log('\n📦 Supplier Product Import\n')

  // Fetch ALL existing products to check against
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, base_name, variant, supplier_code, barcode')

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError)
    process.exit(1)
  }

  console.log(`📊 Found ${existingProducts?.length || 0} existing products in database\n`)

  // Create lookup sets for existing products
  // Match by: base_name + variant (case insensitive)
  const existingByNameVariant = new Set(
    (existingProducts || []).map(p => 
      `${(p.base_name || p.name || '').toLowerCase().trim()}-${(p.variant || '').toLowerCase().trim()}`
    )
  )

  // Also check by supplier_code in case names differ slightly
  const existingBySupplierCode = new Set(
    (existingProducts || []).filter(p => p.supplier_code).map(p => p.supplier_code)
  )

  // Categorize products
  const existing = []
  const toAdd = []

  for (const p of SUPPLIER_PRODUCTS) {
    const nameVariantKey = `${p.name.toLowerCase().trim()}-${p.variant.toLowerCase().trim()}`
    const hasMatchByName = existingByNameVariant.has(nameVariantKey)
    const hasMatchByCode = p.code && existingBySupplierCode.has(p.code)

    if (hasMatchByName || hasMatchByCode) {
      existing.push({ ...p, matchType: hasMatchByName ? 'name+variant' : 'supplier_code' })
    } else {
      toAdd.push(p)
    }
  }

  console.log(`📊 Analysis:`)
  console.log(`   Total in supplier list: ${SUPPLIER_PRODUCTS.length}`)
  console.log(`   Already in database: ${existing.length}`)
  console.log(`   NEW - To be added: ${toAdd.length}\n`)

  if (isPreview) {
    if (existing.length > 0) {
      console.log('✅ ALREADY EXISTS (will be SKIPPED):')
      existing.forEach(p => console.log(`   - ${p.name} ${p.variant} (matched by ${p.matchType})`))
      console.log()
    }

    if (toAdd.length > 0) {
      console.log('🆕 NEW - WILL BE ADDED:')
      toAdd.forEach(p => {
        const barcode = p.barcode || generateBarcode(p.name, p.variant)
        console.log(`   - ${p.name} ${p.variant}`)
        console.log(`     Supplier Code: ${p.code}`)
        console.log(`     Barcode: ${barcode}${p.barcode ? ' (from supplier)' : ' (generated)'}`)
      })
    } else {
      console.log('✨ All supplier products already exist!')
    }
    
    if (toAdd.length > 0) {
      console.log('\n✨ Run with --import to add these products')
      console.log('   Add --skip-ai for faster import without AI descriptions')
    }
    return
  }

  if (isImport && toAdd.length === 0) {
    console.log('✅ All supplier products already exist in database! Nothing to import.')
    return
  }

  // Get default category
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%peptide%')
    .limit(1)
  
  const defaultCategoryId = categories?.[0]?.id || null
  console.log(`📁 Default category: ${categories?.[0]?.name || 'None'}\n`)

  console.log(`🚀 Starting import of ${toAdd.length} NEW products...\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < toAdd.length; i++) {
    const p = toAdd[i]
    const progress = `[${i + 1}/${toAdd.length}]`
    
    process.stdout.write(`${progress} ${p.name} ${p.variant}...`)

    // Generate barcode (use supplier's if provided, otherwise generate with FREEDOM cipher)
    const barcode = p.barcode || generateBarcode(p.name, p.variant)

    // Get AI profile or defaults
    let profile
    if (skipAI) {
      profile = getDefaultProfile(p.name)
    } else {
      profile = await generateProductProfile(p.name, p.variant)
    }

    // Insert product
    const { error } = await supabase.from('products').insert({
      barcode,
      name: `${p.name} ${p.variant}`,
      base_name: p.name,
      variant: p.variant,
      category_id: defaultCategoryId,
      description: profile.description,
      initial_stock: 0,
      current_stock: 0,
      restock_level: 5,
      manual_adjustment: 0,
      cost_price: '0',
      b2b_price: '0',
      retail_price: '0',
      supplier_price: '0',
      supplier_code: p.code || null,
      is_active: true,
      color: '#6366f1',
      last_stock_update: new Date().toISOString(),
      rating_label_1: profile.ratings[0]?.label || 'Efficacy',
      rating_value_1: profile.ratings[0]?.value || 8.0,
      rating_label_2: profile.ratings[1]?.label || 'Safety Profile',
      rating_value_2: profile.ratings[1]?.value || 8.5,
      rating_label_3: profile.ratings[2]?.label || 'Research Support',
      rating_value_3: profile.ratings[2]?.value || 7.5,
    })

    if (error) {
      console.log(` ❌ ${error.message}`)
      errorCount++
    } else {
      console.log(` ✅`)
      successCount++
    }

    // Small delay to avoid rate limiting (only when using AI)
    if (!skipAI && i < toAdd.length - 1) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  console.log(`\n${'='.repeat(40)}`)
  console.log(`📊 Import Complete:`)
  console.log(`   ✅ Successfully added: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total products now: ${(existingProducts?.length || 0) + successCount}`)
}

main().catch(console.error)
