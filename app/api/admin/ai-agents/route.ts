import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - List all AI agents
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select(`
        *,
        resources:ai_agent_resources(count),
        examples:ai_agent_examples(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[AI Agents] Error fetching agents:', error)
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    return NextResponse.json(agents)

  } catch (error: any) {
    console.error('[AI Agents] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new AI agent
export async function POST(request: NextRequest) {
  try {
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
      slug,
      description,
      avatar_url,
      agent_type,
      is_active,
      model,
      temperature,
      max_tokens,
      system_prompt,
      personality,
      greeting_message,
      can_send_sms,
      can_send_email,
      can_create_orders,
      can_modify_orders,
      can_issue_refunds,
      can_access_customer_data,
      can_access_order_data,
      can_escalate_to_human,
    } = body

    if (!name || !slug || !system_prompt) {
      return NextResponse.json({ error: 'Name, slug, and system prompt are required' }, { status: 400 })
    }

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .insert({
        name,
        slug: finalSlug,
        description,
        avatar_url,
        agent_type: agent_type || 'general',
        is_active: is_active ?? true,
        model: model || 'claude-sonnet-4-20250514',
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens || 1024,
        system_prompt,
        personality,
        greeting_message,
        can_send_sms: can_send_sms ?? false,
        can_send_email: can_send_email ?? false,
        can_create_orders: can_create_orders ?? false,
        can_modify_orders: can_modify_orders ?? false,
        can_issue_refunds: can_issue_refunds ?? false,
        can_access_customer_data: can_access_customer_data ?? true,
        can_access_order_data: can_access_order_data ?? true,
        can_escalate_to_human: can_escalate_to_human ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('[AI Agents] Error creating agent:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An agent with this slug already exists' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
    }

    return NextResponse.json(agent, { status: 201 })

  } catch (error: any) {
    console.error('[AI Agents] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

