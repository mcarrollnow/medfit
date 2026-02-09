import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const adminClient = getSupabaseAdminClient()
    
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    // List all users from auth.users
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })

    if (error) {
      console.error('Failed to list auth users:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ users: data.users })
  } catch (error: any) {
    console.error('Auth users API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

