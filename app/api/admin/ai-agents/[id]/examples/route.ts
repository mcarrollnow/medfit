import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - List examples for an agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data: examples, error } = await supabase
      .from('ai_agent_examples')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch examples' }, { status: 500 })
    }

    return NextResponse.json(examples)

  } catch (error: any) {
    console.error('[AI Agent Examples] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add example to agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { user_message, ideal_response, context, category, tags, is_active } = body

    if (!user_message || !ideal_response) {
      return NextResponse.json({ error: 'User message and ideal response are required' }, { status: 400 })
    }

    const { data: example, error } = await supabase
      .from('ai_agent_examples')
      .insert({
        agent_id: agentId,
        user_message,
        ideal_response,
        context,
        category,
        tags: tags || [],
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('[AI Agent Examples] Error creating:', error)
      return NextResponse.json({ error: 'Failed to create example' }, { status: 500 })
    }

    return NextResponse.json(example, { status: 201 })

  } catch (error: any) {
    console.error('[AI Agent Examples] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete an example
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const exampleId = searchParams.get('exampleId')

    if (!exampleId) {
      return NextResponse.json({ error: 'Example ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ai_agent_examples')
      .delete()
      .eq('id', exampleId)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete example' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[AI Agent Examples] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

