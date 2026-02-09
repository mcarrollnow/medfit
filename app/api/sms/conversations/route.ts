import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get('phone_number')

    const supabase = await createServerClient()

    let query = supabase
      .from('sms_conversations')
      .select('*')
      .order('created_at', { ascending: true })

    if (phoneNumber) {
      query = query.eq('phone_number', phoneNumber)
    }

    const { data: conversations, error } = await query.limit(100)

    if (error) {
      console.error('[SMS Conversations] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    // Group by phone number
    const grouped = (conversations || []).reduce((acc: Record<string, any[]>, msg) => {
      if (!acc[msg.phone_number]) {
        acc[msg.phone_number] = []
      }
      acc[msg.phone_number].push(msg)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      conversations: grouped,
      total: conversations?.length || 0
    })

  } catch (error) {
    console.error('[SMS Conversations] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
