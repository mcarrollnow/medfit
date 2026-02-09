import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[Wallets API] Supabase admin client not available')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Select all columns and filter what we need
    const { data: wallets, error } = await supabase
      .from('business_wallets')
      .select('*')
      .order('label')

    if (error) {
      console.error('[Wallets API] Error fetching wallets:', error)
      // If table doesn't exist or other error, return empty array instead of 500
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.log('[Wallets API] Table does not exist, returning empty array')
        return NextResponse.json([])
      }
      return NextResponse.json({ error: 'Failed to fetch wallets', details: error.message }, { status: 500 })
    }

    console.log('[Wallets API] Found wallets:', wallets?.length || 0)
    if (wallets?.length > 0) {
      console.log('[Wallets API] Sample wallet keys:', Object.keys(wallets[0]))
    }

    // Filter for active wallets if the column exists, then transform
    const activeWallets = (wallets || []).filter((w: any) => 
      w.is_active === undefined || w.is_active === true
    )

    // Transform to match expected format - handle various column names
    const transformedWallets = activeWallets.map((w: any) => ({
      id: w.id,
      label: w.label || w.name || 'Unnamed Wallet',
      address: w.wallet_address || w.address || '',
      currency: w.currency || w.network || w.chain || 'CRYPTO'
    }))

    return NextResponse.json(transformedWallets)
  } catch (error) {
    console.error('[Wallets API] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

