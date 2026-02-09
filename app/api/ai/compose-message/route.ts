import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

interface AgentConfig {
  system_prompt: string
  personality: string | null
  greeting_message: string | null
  temperature: number
  model: string
  resources: Array<{ title: string; content: string; resource_type: string }>
  examples: Array<{ user_message: string; ideal_response: string; category: string | null }>
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentSlug, context, task } = body

    if (!agentSlug || !context || !task) {
      return NextResponse.json({ error: 'agentSlug, context, and task are required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Load the agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select(`
        system_prompt,
        personality,
        greeting_message,
        temperature,
        model,
        resources:ai_agent_resources(title, content, resource_type),
        examples:ai_agent_examples(user_message, ideal_response, category)
      `)
      .eq('slug', agentSlug)
      .eq('is_active', true)
      .single()

    if (agentError || !agent) {
      console.error('[AI Compose] Agent not found:', agentSlug, agentError)
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const agentConfig = agent as unknown as AgentConfig
    console.log('[AI Compose] Using agent:', agentSlug, 'task:', task)

    // Build the system prompt from agent config
    let systemPrompt = agentConfig.system_prompt

    if (agentConfig.personality) {
      systemPrompt += `\n\nPERSONALITY: ${agentConfig.personality}`
    }

    // Add training resources
    if (agentConfig.resources && agentConfig.resources.length > 0) {
      systemPrompt += '\n\n--- TRAINING RESOURCES ---\n'
      for (const resource of agentConfig.resources) {
        systemPrompt += `\n[${resource.resource_type.toUpperCase()}] ${resource.title}:\n${resource.content}\n`
      }
    }

    // Add training examples
    if (agentConfig.examples && agentConfig.examples.length > 0) {
      systemPrompt += '\n\n--- EXAMPLE MESSAGES ---\n'
      for (const example of agentConfig.examples) {
        systemPrompt += `\nContext: ${example.category || 'General'}\nExample: ${example.ideal_response}\n`
      }
    }

    // Build the task-specific prompt
    let taskPrompt = ''
    
    if (task === 'compose_payment_request') {
      taskPrompt = `You need to compose an SMS message to request payment from a customer.

PAYMENT DETAILS:
- Amount: $${context.amount}
- Payment Link: ${context.paymentLink}
- Description: ${context.description || 'Payment due'}

REQUIREMENTS:
1. Keep the message concise (SMS should be under 160 characters if possible, max 320)
2. Be professional and friendly per your personality
3. Include the amount clearly
4. Include the payment link
5. Create urgency without being pushy
6. Do NOT include any internal notes or explanations - ONLY output the exact SMS message

Generate the SMS message now:`
    } else if (task === 'compose_invoice_reminder') {
      taskPrompt = `Compose an SMS reminder for an unpaid invoice.

INVOICE DETAILS:
- Amount: $${context.amount}
- Due Date: ${context.dueDate || 'Due now'}
- Invoice Link: ${context.invoiceLink || context.paymentLink}

Keep it brief and professional. Output ONLY the SMS message:`
    } else if (task === 'compose_order_confirmation') {
      taskPrompt = `Compose an order confirmation SMS.

ORDER DETAILS:
- Order Number: ${context.orderNumber}
- Total: $${context.total}
- Items: ${context.itemCount || 'your order'}

Keep it brief and reassuring. Output ONLY the SMS message:`
    } else {
      taskPrompt = `Compose an SMS message based on this context:
${JSON.stringify(context, null, 2)}

Output ONLY the SMS message, nothing else:`
    }

    // Generate the message using Claude
    const result = await generateText({
      model: anthropic(agentConfig.model as any || 'claude-sonnet-4-20250514'),
      system: systemPrompt,
      prompt: taskPrompt,
      temperature: agentConfig.temperature || 0.7,
      maxTokens: 256,
    })

    // Clean up the response - remove any quotes or extra whitespace
    let message = result.text.trim()
    
    // Remove surrounding quotes if present
    if ((message.startsWith('"') && message.endsWith('"')) || 
        (message.startsWith("'") && message.endsWith("'"))) {
      message = message.slice(1, -1)
    }

    console.log('[AI Compose] Generated message:', message.substring(0, 100))

    return NextResponse.json({
      success: true,
      message,
      agent: agentSlug,
      task,
    })

  } catch (error: any) {
    console.error('[AI Compose] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to compose message',
      details: error.message 
    }, { status: 500 })
  }
}

