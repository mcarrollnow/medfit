import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - List webhooks for an agent
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

    const { data: webhooks, error } = await supabase
      .from('ai_agent_webhooks')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[AI Agent Webhooks] Error fetching:', error)
      return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
    }

    return NextResponse.json(webhooks || [])

  } catch (error: any) {
    console.error('[AI Agent Webhooks] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add webhook to agent
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
    const { 
      name, 
      description,
      webhook_type, 
      endpoint_path, 
      target_url,
      trigger_event,
      trigger_conditions,
      is_active 
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Webhook name is required' }, { status: 400 })
    }

    // Generate a secret key for incoming webhooks
    const secret_key = webhook_type === 'incoming' 
      ? `whk_${crypto.randomUUID().replace(/-/g, '')}` 
      : null

    const { data: webhook, error } = await supabase
      .from('ai_agent_webhooks')
      .insert({
        agent_id: agentId,
        name,
        description,
        webhook_type: webhook_type || 'trigger',
        endpoint_path: endpoint_path || null,
        secret_key,
        target_url: target_url || null,
        trigger_event: trigger_event || null,
        trigger_conditions: trigger_conditions || {},
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('[AI Agent Webhooks] Error creating:', error)
      return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
    }

    return NextResponse.json(webhook, { status: 201 })

  } catch (error: any) {
    console.error('[AI Agent Webhooks] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a webhook
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
    const webhookId = searchParams.get('webhookId')

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ai_agent_webhooks')
      .delete()
      .eq('id', webhookId)

    if (error) {
      console.error('[AI Agent Webhooks] Error deleting:', error)
      return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[AI Agent Webhooks] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
