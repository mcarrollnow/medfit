"use server"

import { getSheetData, getSheetDataRaw, type SheetRow } from '@/lib/google-sheets'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface SyncResult {
  success: boolean
  synced: number
  errors: number
  errorMessages: string[]
}

// Parse status from sheet to database enum
function parseShipmentStatus(status: string): string {
  const statusLower = status?.toLowerCase() || ''
  if (statusLower.includes('delivered')) return 'delivered'
  if (statusLower.includes('lost')) return 'lost'
  if (statusLower.includes('seized')) return 'seized'
  if (statusLower.includes('stopped')) return 'stopped'
  if (statusLower.includes('returned')) return 'returned'
  return 'in_transit'
}

// Parse items from the Details column (e.g., "500 vials 482802\n300 vials 758308")
function parseShipmentItems(details: string): { product_code: string; quantity: number; description: string }[] {
  if (!details) return []
  
  const items: { product_code: string; quantity: number; description: string }[] = []
  const lines = details.split(/[\n,]/).filter(Boolean)
  
  for (const line of lines) {
    // Match patterns like "500 vials 482802" or "482802 500vials" or "500 482802"
    const match = line.match(/(\d+)\s*(?:vials?|pcs?|bottles?|kits?)?\s*(\d{5,7}[A-Z]?)/i) ||
                  line.match(/(\d{5,7}[A-Z]?)\s*[\/\s]*(\d+)\s*(?:vials?|pcs?|bottles?|kits?)?/i)
    
    if (match) {
      // Determine which group is quantity and which is code
      const num1 = parseInt(match[1])
      const num2 = match[2]
      
      // If first number is 5-7 digits, it's likely a code
      if (match[1].length >= 5 && match[1].length <= 7) {
        items.push({
          product_code: match[1],
          quantity: parseInt(num2) || 1,
          description: line.trim()
        })
      } else {
        items.push({
          product_code: num2,
          quantity: num1 || 1,
          description: line.trim()
        })
      }
    }
  }
  
  return items
}

/**
 * Sync data from Google Sheet to a Supabase table
 * Performs upsert based on the ID column
 */
export async function syncSheetToSupabase(
  tableName: string,
  sheetName: string = 'Sheet1',
  idColumn: string = 'id'
): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['GOOGLE_SHEET_ID environment variable not set'],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    // Fetch data from Google Sheet
    const rows = await getSheetData(sheetId, sheetName)
    
    if (rows.length === 0) {
      return {
        success: true,
        synced: 0,
        errors: 0,
        errorMessages: [],
      }
    }

    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    // Process in batches of 50
    const batchSize = 50
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      
      // Filter out rows without an ID
      const validRows = batch.filter((row) => row[idColumn])
      
      if (validRows.length === 0) continue

      const { error } = await supabase
        .from(tableName)
        .upsert(validRows, { 
          onConflict: idColumn,
          ignoreDuplicates: false 
        })

      if (error) {
        errors += validRows.length
        errorMessages.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
      } else {
        synced += validRows.length
      }
    }

    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath('/')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Sync products from Google Sheet
 */
export async function syncProductsFromSheet(): Promise<SyncResult> {
  return syncSheetToSupabase('products', 'Products', 'id')
}

/**
 * Sync inventory/stock updates from Google Sheet
 */
export async function syncInventoryFromSheet(): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['GOOGLE_SHEET_ID environment variable not set'],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    const rows = await getSheetData(sheetId, 'Inventory')
    
    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    for (const row of rows) {
      if (!row.id && !row.barcode) continue

      // Build update object with only stock-related fields
      const update: Record<string, any> = {}
      if (row.current_stock !== undefined) update.current_stock = row.current_stock
      if (row.restock_level !== undefined) update.restock_level = row.restock_level
      if (row.cost_price !== undefined) update.cost_price = row.cost_price
      if (row.retail_price !== undefined) update.retail_price = row.retail_price
      if (row.b2b_price !== undefined) update.b2b_price = row.b2b_price
      if (row.is_active !== undefined) update.is_active = row.is_active

      if (Object.keys(update).length === 0) continue

      // Update by ID or barcode
      let query = supabase.from('products').update(update)
      
      if (row.id) {
        query = query.eq('id', row.id)
      } else if (row.barcode) {
        query = query.eq('barcode', row.barcode)
      }

      const { error } = await query

      if (error) {
        errors++
        errorMessages.push(`Row ${row.id || row.barcode}: ${error.message}`)
      } else {
        synced++
      }
    }

    revalidatePath('/admin/inventory')
    revalidatePath('/')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Preview what would be synced (dry run)
 */
export async function previewSheetData(
  sheetName: string = 'Sheet1'
): Promise<{ success: boolean; data: SheetRow[]; error?: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      data: [],
      error: 'GOOGLE_SHEET_ID environment variable not set',
    }
  }

  try {
    const rows = await getSheetData(sheetId, sheetName)
    return {
      success: true,
      data: rows.slice(0, 10), // Preview first 10 rows
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Sync shipments from "Items in transit" Google Sheet
 */
export async function syncShipmentsFromSheet(): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['GOOGLE_SHEET_ID environment variable not set'],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    // Fetch data from "Items in transit" sheet
    const rows = await getSheetData(sheetId, 'Items in transit')
    
    if (rows.length === 0) {
      return {
        success: true,
        synced: 0,
        errors: 0,
        errorMessages: [],
      }
    }

    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    for (const row of rows) {
      // Skip rows without tracking number
      const tracking = String(row['Tracking'] || '').trim()
      if (!tracking) continue

      // Check if shipment already exists
      const { data: existing } = await supabase
        .from('incoming_shipments')
        .select('id')
        .eq('tracking_number', tracking)
        .maybeSingle()

      if (existing) {
        // Update existing shipment status
        const status = parseShipmentStatus(String(row['Status'] || ''))
        const counted = String(row['Counted in Michaels Inventory'] || '').toLowerCase() === 'x'
        
        await supabase
          .from('incoming_shipments')
          .update({ 
            status,
            counted_in_inventory: counted,
            notes: String(row['Marks'] || row['Notes'] || '') || null,
          })
          .eq('id', existing.id)
        
        synced++
        continue
      }

      // Parse shipped date
      let shippedDate: string | null = null
      const dateStr = String(row['Shipped Date'] || '')
      if (dateStr) {
        // Handle various date formats (6.5, 6/5, 2025.6.5, etc.)
        const parts = dateStr.split(/[.\/\-]/)
        if (parts.length >= 2) {
          const month = parts[0].length <= 2 ? parts[0] : parts[1]
          const day = parts[0].length <= 2 ? parts[1] : parts[0]
          const year = parts[2] || new Date().getFullYear().toString()
          shippedDate = `${year.length === 2 ? '20' + year : year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      }

      // Determine carrier from tracking number or notes
      let carrier = 'Other'
      const trackingLower = tracking.toLowerCase()
      const details = String(row['Details'] || '')
      if (trackingLower.startsWith('1z')) carrier = 'UPS'
      else if (trackingLower.includes('am') || trackingLower.includes('at')) carrier = 'USPS'
      else if (details.toLowerCase().includes('dhl') || details.toLowerCase().includes('hkdhl')) carrier = 'DHL'
      else if (trackingLower.length >= 12 && /^\d+$/.test(tracking)) carrier = 'USPS'

      // Insert shipment
      const { data: shipment, error: shipmentError } = await supabase
        .from('incoming_shipments')
        .insert({
          shipped_date: shippedDate,
          tracking_number: tracking,
          carrier,
          status: parseShipmentStatus(String(row['Status'] || '')),
          notes: String(row['Marks'] || row['Notes'] || '') || null,
          counted_in_inventory: String(row['Counted in Michaels Inventory'] || '').toLowerCase() === 'x',
        })
        .select()
        .single()

      if (shipmentError) {
        errors++
        errorMessages.push(`Tracking ${tracking}: ${shipmentError.message}`)
        continue
      }

      // Parse and insert items, linking to products by barcode or name
      const items = parseShipmentItems(details)
      if (items.length > 0 && shipment) {
        for (const item of items) {
          // Try to find product by barcode first, then by name pattern
          let productId: string | null = null
          
          if (item.product_code) {
            // Clean the code first
            const cleanCode = item.product_code.replace(/[A-Z]+$/i, '').trim()
            
            // Try exact supplier_code match
            const { data: product } = await supabase
              .from('products')
              .select('id')
              .eq('supplier_code', cleanCode)
              .maybeSingle()
            
            if (product) {
              productId = product.id
            } else {
              // Try to match by name from description
              // Descriptions often look like "Semaglutide 5mg" or "500 vials sema 5mg"
              const desc = item.description?.toLowerCase() || ''
              
              // Common product name patterns
              const namePatterns = [
                { pattern: /sema.*?(\d+)\s*mg/i, base: 'Semaglutide' },
                { pattern: /tirz.*?(\d+)\s*mg/i, base: 'Tirzepatide' },
                { pattern: /reta.*?(\d+)\s*mg/i, base: 'Retatrutide' },
                { pattern: /bpc.*?(\d+)\s*mg/i, base: 'BPC-157' },
                { pattern: /tb.?500.*?(\d+)\s*mg/i, base: 'TB-500' },
                { pattern: /nad\+?\s*(\d+)\s*mg/i, base: 'NAD+' },
                { pattern: /hgh.*?(\d+)\s*iu/i, base: 'HGH' },
                { pattern: /ipamorelin.*?(\d+)\s*mg/i, base: 'Ipamorelin' },
                { pattern: /sermorelin.*?(\d+)\s*mg/i, base: 'Sermorelin' },
                { pattern: /tesamorelin.*?(\d+)\s*mg/i, base: 'Tesamorelin' },
                { pattern: /cjc.*?(\d+)\s*mg/i, base: 'CJC-1295' },
                { pattern: /ghk.*?cu.*?(\d+)\s*mg/i, base: 'GHK-Cu' },
                { pattern: /mots.*?c.*?(\d+)\s*mg/i, base: 'MOTS-C' },
                { pattern: /mt2.*?(\d+)\s*mg/i, base: 'Melanotan-2' },
                { pattern: /pt.?141.*?(\d+)\s*mg/i, base: 'PT-141' },
                { pattern: /aod.*?(\d+)\s*mg/i, base: 'AOD-9604' },
                { pattern: /hmg.*?(\d+)\s*iu/i, base: 'HMG' },
                { pattern: /kpv.*?(\d+)\s*mg/i, base: 'KPV' },
              ]
              
              for (const { pattern, base } of namePatterns) {
                const match = desc.match(pattern)
                if (match) {
                  const variant = match[1] + (desc.includes('iu') ? 'iu' : 'mg')
                  const { data: matchedProduct } = await supabase
                    .from('products')
                    .select('id')
                    .ilike('base_name', `%${base}%`)
                    .ilike('variant', `%${variant}%`)
                    .limit(1)
                    .maybeSingle()
                  
                  if (matchedProduct) {
                    productId = matchedProduct.id
                    break
                  }
                }
              }
            }
          }

          await supabase.from('shipment_items').insert({
            shipment_id: shipment.id,
            product_code: item.product_code,
            product_id: productId,
            quantity: item.quantity,
            description: item.description,
          })
        }
      }

      synced++
    }

    revalidatePath('/admin/shipments')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Sync product codes from "USA current inventory" sheet to products
 * This links the shipment codes (like 482802) to product records
 */
export async function syncProductCodesFromSheet(): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['GOOGLE_SHEET_ID environment variable not set'],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    // Read from "USA current inventory" sheet as raw arrays
    // Column structure: [0]=product, [1]=inventory, [2]=code
    const rows = await getSheetDataRaw(sheetId, 'USA current inventory')
    
    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    for (const row of rows) {
      // Column structure: [0]=product, [1]=inventory, [2]=code
      const productName = String(row[0] || '').trim()
      const code = String(row[2] || '').trim() // Third column is the code
      
      if (!productName || !code || code === '') continue
      // Skip non-product rows
      if (productName.toLowerCase().includes('as of') || productName.toLowerCase() === 'product') continue
      
      // Clean up the code (remove batch suffixes like "293884F" and handle multiple codes like "258013/482809")
      const cleanCode = code.split(/[,\/]/)[0].replace(/[A-Z]+$/i, '').replace(/-\d+$/, '').trim()
      if (!cleanCode || !/^\d+/.test(cleanCode)) continue
      
      console.log(`Processing: ${productName} -> code: ${cleanCode}`)

      // Parse product name to extract base name and variant
      // Examples: "AOD-9604 2mg", "Semaglutide 10mg", "BPC 157 10mg"
      const nameMatch = productName.match(/^(.+?)\s*[-]?\s*(\d+\.?\d*)\s*(mg|iu|MG|IU)/i)
      
      if (!nameMatch) continue
      
      let baseName = nameMatch[1].trim()
      const amount = nameMatch[2]
      const unit = nameMatch[3].toLowerCase()
      const variant = `${amount}${unit}`

      // Normalize common name variations
      const nameNormalizations: Record<string, string> = {
        'AOD-9604': 'AOD-9604',
        'AOD 9604': 'AOD-9604',
        'BPC 157': 'BPC-157',
        'BPC-157': 'BPC-157',
        'TB-500': 'TB-500',
        'TB 500': 'TB-500',
        'CJC-1295 WITH DAC': 'CJC-1295 with DAC',
        'CJC-1295 without DAC': 'CJC-1295 without DAC',
        'GHK-Cu': 'GHK-Cu',
        'GHRP-2': 'GHRP-2',
        'IGF-1 LR3': 'IGF-1 LR3',
        'MOTS-C': 'MOTS-C',
        'NAD+': 'NAD+',
        'PT-141': 'PT-141',
        'SS-31': 'SS-31',
        'Snap-8': 'SNAP-8',
      }

      // Try to normalize the base name
      for (const [key, value] of Object.entries(nameNormalizations)) {
        if (baseName.toLowerCase().includes(key.toLowerCase())) {
          baseName = value
          break
        }
      }

      // Search for product by base_name and variant
      const { data: products } = await supabase
        .from('products')
        .select('id, base_name, variant, supplier_code')
        .ilike('base_name', `%${baseName}%`)
        .ilike('variant', `%${variant}%`)

      if (products && products.length > 0) {
        const product = products[0]
        
        // Update supplier_code with the code if different
        if (cleanCode !== product.supplier_code) {
          const { error } = await supabase
            .from('products')
            .update({ supplier_code: cleanCode })
            .eq('id', product.id)

          if (error) {
            errors++
            errorMessages.push(`${productName}: ${error.message}`)
          } else {
            synced++
          }
        }
      } else {
        // Try a looser search
        const { data: looseProducts } = await supabase
          .from('products')
          .select('id, base_name, variant, supplier_code')
          .ilike('base_name', `%${baseName.split(' ')[0]}%`)
          .ilike('variant', `%${amount}%`)

        if (looseProducts && looseProducts.length > 0) {
          const product = looseProducts[0]
          if (cleanCode !== product.supplier_code) {
            const { error } = await supabase
              .from('products')
              .update({ supplier_code: cleanCode })
              .eq('id', product.id)

            if (!error) synced++
          }
        }
      }
    }

    revalidatePath('/admin/inventory')
    revalidatePath('/admin/shipments')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Re-link existing shipment items to products by matching product_code to barcode
 */
export async function relinkShipmentItemsToProducts(): Promise<SyncResult> {
  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    // Get all shipment items that don't have a product_id linked
    const { data: unlinkedItems, error: fetchError } = await supabase
      .from('shipment_items')
      .select('id, product_code')
      .is('product_id', null)
      .not('product_code', 'is', null)

    if (fetchError) {
      return {
        success: false,
        synced: 0,
        errors: 1,
        errorMessages: [fetchError.message],
      }
    }

    if (!unlinkedItems || unlinkedItems.length === 0) {
      return {
        success: true,
        synced: 0,
        errors: 0,
        errorMessages: [],
      }
    }

    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    for (const item of unlinkedItems) {
      if (!item.product_code) continue

      // Clean the code (remove letters at end like "293884F")
      let cleanCode = item.product_code.replace(/[A-Z]+$/i, '').trim()
      
      // Try to find product by exact supplier_code match first
      let { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('supplier_code', cleanCode)
        .maybeSingle()

      // If not found, try matching the last 6 digits (handles cases like "7583088" -> "758308")
      if (!product && cleanCode.length >= 6) {
        const last6 = cleanCode.slice(-6)
        const { data: partialMatch } = await supabase
          .from('products')
          .select('id, supplier_code')
          .like('supplier_code', `%${last6}%`)
          .limit(1)
          .maybeSingle()
        
        if (partialMatch) product = partialMatch
      }

      // Try matching first 6 digits (handles cases like "4828088" -> "482808")
      if (!product && cleanCode.length >= 6) {
        const first6 = cleanCode.slice(0, 6)
        const { data: partialMatch } = await supabase
          .from('products')
          .select('id, supplier_code')
          .eq('supplier_code', first6)
          .maybeSingle()
        
        if (partialMatch) product = partialMatch
      }

      // Try without leading digits that might be wrong (handles "05088" -> "360508")
      if (!product && cleanCode.length >= 5) {
        // Common pattern: description has full code like "360508" but parsed as "05088"
        const { data: descMatch } = await supabase
          .from('products')
          .select('id, supplier_code')
          .like('supplier_code', `%${cleanCode}%`)
          .limit(1)
          .maybeSingle()
        
        if (descMatch) product = descMatch
      }

      if (product) {
        const { error: updateError } = await supabase
          .from('shipment_items')
          .update({ product_id: product.id })
          .eq('id', item.id)

        if (updateError) {
          errors++
          errorMessages.push(`Item ${item.product_code}: ${updateError.message}`)
        } else {
          synced++
        }
      }
    }

    revalidatePath('/admin/shipments')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Sync inventory counts from "USA current inventory" sheet
 */
export async function syncInventoryCountsFromSheet(): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  
  if (!sheetId) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['GOOGLE_SHEET_ID environment variable not set'],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: ['Could not connect to Supabase'],
    }
  }

  try {
    const rows = await getSheetData(sheetId, 'USA current inventory')
    
    let synced = 0
    let errors = 0
    const errorMessages: string[] = []

    for (const row of rows) {
      const productName = String(row['product'] || '').trim()
      const inventoryStr = String(row['inventory'] || '').replace(/,/g, '').trim()
      const inventory = parseInt(inventoryStr)
      
      if (!productName || isNaN(inventory) || inventory < 0) continue
      if (productName.toLowerCase().includes('as of')) continue

      // Parse product name
      const nameMatch = productName.match(/^(.+?)\s*[-]?\s*(\d+\.?\d*)\s*(mg|iu|MG|IU)/i)
      if (!nameMatch) continue
      
      const baseName = nameMatch[1].trim()
      const amount = nameMatch[2]
      const unit = nameMatch[3].toLowerCase()
      const variant = `${amount}${unit}`

      // Find and update product
      const { data: products } = await supabase
        .from('products')
        .select('id, current_stock')
        .ilike('base_name', `%${baseName.split(' ')[0]}%`)
        .ilike('variant', `%${amount}%`)
        .limit(1)

      if (products && products.length > 0) {
        const product = products[0]
        
        if (inventory !== product.current_stock) {
          const { error } = await supabase
            .from('products')
            .update({ current_stock: inventory })
            .eq('id', product.id)

          if (error) {
            errors++
            errorMessages.push(`${productName}: ${error.message}`)
          } else {
            synced++
          }
        }
      }
    }

    revalidatePath('/admin/inventory')
    revalidatePath('/')

    return {
      success: errors === 0,
      synced,
      errors,
      errorMessages,
    }
  } catch (error) {
    return {
      success: false,
      synced: 0,
      errors: 1,
      errorMessages: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

