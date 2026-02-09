import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: orderId } = await params
    const supabase = getSupabaseAdminClient()

    // Get pricing breakdown for this order
    const { data, error } = await supabase
      .from('order_pricing_breakdown')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (error) {
      // If no breakdown exists, calculate it on the fly
      if (error.code === 'PGRST116') {
        // Get order with items
        const { data: order } = await supabase
          .from('orders')
          .select('id, customer_id, total_amount, discount_amount')
          .eq('id', orderId)
          .single()
        
        if (!order) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }
        
        // Get order items with product info
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('product_id, unit_price, quantity')
          .eq('order_id', orderId)
        
        // Get product costs
        const productIds = (orderItems || []).map(i => i.product_id).filter(Boolean)
        const { data: products } = await supabase
          .from('products')
          .select('id, cost_price')
          .in('id', productIds)
        
        const costMap = new Map((products || []).map(p => [p.id, Number(p.cost_price) || 0]))
        
        // Get pricing formula
        const { data: formula } = await supabase
          .from('pricing_formula_settings')
          .select('*')
          .eq('is_active', true)
          .single()
        
        const minMarkup = Number(formula?.min_markup_multiplier) || 2.0
        const maxMarkup = Number(formula?.max_markup_multiplier) || 4.0
        
        // Calculate totals
        let totalCost = 0
        let totalCommissionPool = 0
        
        ;(orderItems || []).forEach(item => {
          if (!item.product_id) return
          
          const unitCost = costMap.get(item.product_id) || 0
          const itemCost = unitCost * item.quantity
          const itemTotal = item.unit_price * item.quantity
          
          totalCost += itemCost
          
          const minPrice = itemCost * minMarkup
          const maxPrice = itemCost * maxMarkup
          const maxPool = maxPrice - minPrice
          const rawPool = Math.max(0, itemTotal - minPrice)
          
          totalCommissionPool += Math.min(rawPool, maxPool)
        })
        
        // Get rep commission rate
        let repCommissionRate = 0
        if (order.customer_id) {
          const { data: assignment } = await supabase
            .from('customer_rep_assignments')
            .select('rep_id')
            .eq('customer_id', order.customer_id)
            .eq('is_current', true)
            .single()
          
          if (assignment?.rep_id) {
            const { data: rep } = await supabase
              .from('users')
              .select('commission_rate')
              .eq('id', assignment.rep_id)
              .single()
            
            repCommissionRate = Number(rep?.commission_rate) || 10
          }
        }
        
        const discountApplied = Number(order.discount_amount) || 0
        const commissionAfterDiscount = Math.max(0, totalCommissionPool - discountApplied)
        const repCommissionAmount = commissionAfterDiscount * (repCommissionRate / 100)
        
        // Return calculated breakdown
        return NextResponse.json({
          total_cost: totalCost,
          minimum_price: totalCost * minMarkup,
          maximum_price: totalCost * maxMarkup,
          actual_sale_price: Number(order.total_amount) || 0,
          commission_pool: totalCommissionPool,
          discount_applied: discountApplied,
          commission_after_discount: commissionAfterDiscount,
          rep_commission_rate: repCommissionRate,
          rep_commission_amount: repCommissionAmount,
          min_markup_used: minMarkup,
          max_markup_used: maxMarkup,
        })
      }
      
      console.error('[pricing-breakdown] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch pricing breakdown' }, { status: 500 })
    }

    return NextResponse.json({
      total_cost: Number(data.total_cost),
      minimum_price: Number(data.minimum_price),
      maximum_price: Number(data.maximum_price),
      actual_sale_price: Number(data.actual_sale_price),
      commission_pool: Number(data.commission_pool),
      discount_applied: Number(data.discount_applied),
      commission_after_discount: Number(data.commission_after_discount),
      rep_commission_rate: Number(data.rep_commission_rate),
      rep_commission_amount: Number(data.rep_commission_amount),
      min_markup_used: Number(data.min_markup_used),
      max_markup_used: Number(data.max_markup_used),
    })
  } catch (error) {
    console.error('[pricing-breakdown] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
