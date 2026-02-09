import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - List resources for an agent
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

    const { data: resources, error } = await supabase
      .from('ai_agent_resources')
      .select('*')
      .eq('agent_id', agentId)
      .order('priority', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    return NextResponse.json(resources)

  } catch (error: any) {
    console.error('[AI Agent Resources] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add resource to agent
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
    const { title, resource_type, content, priority, is_active } = body

    if (!title || !resource_type || !content) {
      return NextResponse.json({ error: 'Title, type, and content are required' }, { status: 400 })
    }

    const { data: resource, error } = await supabase
      .from('ai_agent_resources')
      .insert({
        agent_id: agentId,
        title,
        resource_type,
        content,
        priority: priority ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('[AI Agent Resources] Error creating:', error)
      return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
    }

    return NextResponse.json(resource, { status: 201 })

  } catch (error: any) {
    console.error('[AI Agent Resources] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a resource
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
    const resourceId = searchParams.get('resourceId')

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ai_agent_resources')
      .delete()
      .eq('id', resourceId)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[AI Agent Resources] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

