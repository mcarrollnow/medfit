import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import { 
  calculateTier, 
  getNextTier, 
  calculateAmountToNextTier, 
  getTierProgress,
  REWARD_TIERS 
} from '@/lib/rewards-tiers'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error } }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id

    if (!userId) {
      return NextResponse.json({ error: { message: 'User ID not found' } }, { status: 401 })
    }

    console.log('[customer/stats] Fetching stats for user:', userId)

    // First, get the customer ID for this user
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      console.log('[customer/stats] No customer record found for user:', userId)
      return NextResponse.json({
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        pendingOrders: 0,
        rewards: {
          pointsBalance: 0,
          currentTier: 'bronze',
          nextTier: 'silver',
          amountToNextTier: 500,
          progress: 0,
          tierInfo: REWARD_TIERS['bronze']
        }
      })
    }

    // Get all orders for this customer directly by customer_id
    // This catches all orders including those originally created as guest orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        payment_date,
        payment_verified_at,
        payment_status,
        created_at
      `)
      .eq('customer_id', customer.id)

    if (ordersError) {
      console.error('[customer/stats] Orders query error:', ordersError)
      return NextResponse.json({ error: { message: 'Failed to fetch orders' } }, { status: 500 })
    }

    const orders = ordersData || []
    
    // Calculate stats
    const totalOrders = orders.length
    
    // Only count paid orders for totalSpent and rewards
    const paidStatuses = ['paid', 'shipped', 'delivered', 'confirmed']
    const paidOrders = orders.filter(o => 
      paidStatuses.includes(o.status) || 
      paidStatuses.includes(o.payment_status || '') ||
      o.payment_date || 
      o.payment_verified_at
    )
    
    const totalSpent = paidOrders.reduce((sum, order) => {
      const amount = typeof order.total_amount === 'string' 
        ? parseFloat(order.total_amount) 
        : (order.total_amount || 0)
      return sum + amount
    }, 0)
    
    const averageOrder = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0
    
    // Count pending orders (not yet paid)
    const pendingOrders = orders.filter(o => 
      !paidStatuses.includes(o.status) && 
      !paidStatuses.includes(o.payment_status || '') &&
      !o.payment_date && 
      !o.payment_verified_at &&
      o.status !== 'cancelled'
    ).length

    // Calculate rewards data
    const currentTier = calculateTier(totalSpent)
    const nextTier = getNextTier(currentTier)
    const amountToNextTier = calculateAmountToNextTier(totalSpent, currentTier)
    const progress = getTierProgress(totalSpent, currentTier)
    const tierInfo = REWARD_TIERS[currentTier]
    
    // Calculate total points earned
    // For simplicity, we calculate points retroactively based on progressive tiers
    const pointsBalance = calculateTotalPoints(paidOrders)

    console.log('[customer/stats] Stats calculated:', {
      totalOrders,
      totalSpent,
      paidOrders: paidOrders.length,
      currentTier,
      pointsBalance
    })

    return NextResponse.json({
      // Basic stats
      totalOrders,
      totalSpent: Math.round(totalSpent * 100) / 100,
      averageOrder: Math.round(averageOrder * 100) / 100,
      pendingOrders,
      
      // Rewards data
      rewards: {
        pointsBalance,
        currentTier,
        nextTier,
        amountToNextTier,
        progress,
        tierInfo: {
          name: tierInfo.name,
          color: tierInfo.color,
          pointsPerDollar: tierInfo.pointsPerDollar,
          benefits: tierInfo.benefits
        }
      }
    })
  } catch (error: any) {
    console.error('[customer/stats] Error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch stats' } },
      { status: 500 }
    )
  }
}

// Calculate total points earned based on order history
// Points are calculated progressively as the user moves through tiers
function calculateTotalPoints(orders: any[]): number {
  // Sort orders by date to calculate points progressively
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  
  let runningTotal = 0
  let totalPoints = 0
  
  for (const order of sortedOrders) {
    const orderAmount = typeof order.total_amount === 'string' 
      ? parseFloat(order.total_amount) 
      : (order.total_amount || 0)
    
    // Calculate tier at the time of this order
    const tierAtPurchase = calculateTier(runningTotal)
    const tierInfo = REWARD_TIERS[tierAtPurchase]
    
    // Calculate points for this order based on tier at time of purchase
    const pointsEarned = Math.floor(orderAmount * tierInfo.pointsPerDollar)
    totalPoints += pointsEarned
    
    // Update running total for next iteration
    runningTotal += orderAmount
  }
  
  return totalPoints
}
