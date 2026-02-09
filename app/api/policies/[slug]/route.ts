import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
      }
      console.error('Error fetching policy:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in policy API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
