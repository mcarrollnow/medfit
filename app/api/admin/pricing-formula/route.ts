import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - Fetch active pricing formula
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('pricing_formula_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      // Return default if no formula exists
      return NextResponse.json({
        id: 'default',
        name: 'Default Formula',
        min_markup_multiplier: 2.0,
        max_markup_multiplier: 4.0,
        is_active: true,
      })
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      min_markup_multiplier: Number(data.min_markup_multiplier),
      max_markup_multiplier: Number(data.max_markup_multiplier),
      is_active: data.is_active,
      description: data.description,
    })
  } catch (error) {
    console.error('[pricing-formula] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Update or create active pricing formula
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    const body = await request.json()
    
    const { min_markup_multiplier, max_markup_multiplier } = body

    // Validate
    if (min_markup_multiplier < 1) {
      return NextResponse.json({ error: 'Min markup must be at least 1' }, { status: 400 })
    }
    if (max_markup_multiplier <= min_markup_multiplier) {
      return NextResponse.json({ error: 'Max markup must be greater than min' }, { status: 400 })
    }

    // Check if active formula exists
    const { data: existing } = await supabase
      .from('pricing_formula_settings')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('pricing_formula_settings')
        .update({
          min_markup_multiplier,
          max_markup_multiplier,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) {
        console.error('[pricing-formula] Update error:', error)
        return NextResponse.json({ error: 'Failed to update formula' }, { status: 500 })
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('pricing_formula_settings')
        .insert({
          name: 'Default Pricing Formula',
          min_markup_multiplier,
          max_markup_multiplier,
          is_active: true,
          description: 'Cost is protected, min markup defines profit floor, commission pool is between min and max markup.',
        })

      if (error) {
        console.error('[pricing-formula] Insert error:', error)
        return NextResponse.json({ error: 'Failed to create formula' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[pricing-formula] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
