import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select('id, slug, title, subtitle, last_updated, is_published')
      .order('title', { ascending: true })
    
    if (error) {
      console.error('Error fetching policies:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in policies API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
