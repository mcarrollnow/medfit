import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - Get single AI agent with resources and examples
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .select(`
        *,
        resources:ai_agent_resources(*),
        examples:ai_agent_examples(*)
      `)
      .eq('id', id)
      .single()

    if (error || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json(agent)

  } catch (error: any) {
    console.error('[AI Agent] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update AI agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body = await request.json()

    // Fields that are not columns on ai_agents (they're related tables)
    const excludeFields = ['resources', 'examples', 'id', 'created_at', 'updated_at']

    // Remove undefined values and exclude related table fields
    const updates = Object.fromEntries(
      Object.entries(body).filter(([k, v]) => v !== undefined && !excludeFields.includes(k))
    )

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[AI Agent] Error updating:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An agent with this slug already exists' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
    }

    return NextResponse.json(agent)

  } catch (error: any) {
    console.error('[AI Agent] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete AI agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[AI Agent] Error deleting:', error)
      return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[AI Agent] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

