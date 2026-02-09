'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function adjustProductStock(
  productId: string,
  adjustment: number,
  notes: string,
  previousStock: number
) {
  try {
    const supabase = await getSupabaseServerClient()
    const newStock = previousStock + adjustment

    const { error: productError } = await supabase
      .from('products')
      .update({
        current_stock: newStock,
        manual_adjustment: adjustment,
        last_stock_update: new Date().toISOString()
      })
      .eq('id', productId)

    if (productError) throw productError

    const { error: historyError } = await supabase
      .from('stock_history')
      .insert([{
        product_id: productId,
        change_type: 'manual_adjustment',
        quantity_change: adjustment,
        previous_stock: previousStock,
        new_stock: newStock,
        notes: notes || 'Manual adjustment'
      }])

    if (historyError) throw historyError

    return { success: true }
  } catch (error) {
    console.error('[v0] Stock adjustment failed:', error)
    return { success: false, error: String(error) }
  }
}
