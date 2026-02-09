import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

export const maxDuration = 30

export type AIResponseIntent = 
  | 'get_more_info'
  | 'ask_for_evidence'
  | 'offer_replacement'
  | 'offer_refund'
  | 'offer_promo_code'
  | 'decline_support'
  | 'general_help'

interface AIResponseRequest {
  ticketId: string
  intent: AIResponseIntent
  customContext?: string
}

const INTENT_PROMPTS: Record<AIResponseIntent, string> = {
  get_more_info: `Your goal is to gather more information from the customer to better understand their issue.
Ask specific, relevant questions based on the issue type. Be empathetic but focused on getting the details needed to resolve the issue.
Common questions to consider:
- Clarify exactly what happened
- Ask about timeline/dates
- Request specific product details if not clear
- Ask about any steps they've already taken`,

  ask_for_evidence: `Your goal is to politely request supporting evidence (photos, screenshots, receipts, etc.) from the customer.
Explain why the evidence will help resolve their case faster. Be specific about what kind of evidence would be most helpful.
Suggestions:
- Photos of damaged items/packaging
- Screenshots of any error messages
- Order confirmation emails
- Tracking information screenshots`,

  offer_replacement: `Your goal is to offer a replacement for the customer's product.
Express understanding of their frustration and provide clear next steps for receiving a replacement.
Include:
- Confirmation that a replacement will be sent
- Expected timeline for the replacement
- Any steps the customer needs to take (return original item, etc.)
- Reassurance about quality control`,

  offer_refund: `Your goal is to offer a refund to the customer.
Be clear about the refund process and timeline. Express understanding of their situation.
Include:
- Confirmation of the refund offer
- Expected processing time (typically 5-10 business days)
- Which payment method will be refunded
- Any conditions or next steps needed`,

  offer_promo_code: `Your goal is to offer a promotional code/discount to the customer as a gesture of goodwill.
This could be to compensate for a minor issue, delay, or inconvenience.
Include:
- Expression of appreciation for their patience
- Details of the promo code offer (e.g., percentage off, specific amount)
- How to use the code
- Any expiration or restrictions`,

  decline_support: `Your goal is to politely decline the support request or explain why the requested resolution isn't possible.
Be empathetic but clear. Provide reasoning and suggest alternatives if possible.
Guidelines:
- Acknowledge their concern
- Explain the policy or reason clearly
- Offer alternative solutions if available
- Maintain a professional and respectful tone`,

  general_help: `Your goal is to provide helpful, professional customer support.
Address the customer's concerns based on the ticket context and conversation history.
Be empathetic, clear, and solution-oriented.`
}

export async function POST(req: NextRequest) {
  try {
    const body: AIResponseRequest = await req.json()
    const { ticketId, intent, customContext } = body

    if (!ticketId || !intent) {
      return NextResponse.json(
        { error: 'Missing required fields: ticketId and intent' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()

    // Get ticket details with customer and order info
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select(`
        id,
        subject,
        status,
        priority,
        created_at,
        order_id,
        customer:customers(
          id,
          company_name,
          user:users!customers_user_id_fkey(email, first_name, last_name),
          shipping_address_line1,
          shipping_city,
          shipping_state,
          shipping_zip
        )
      `)
      .eq('id', ticketId)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Get order details if exists
    let orderDetails = null
    if (ticket.order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          payment_status,
          created_at,
          order_items(product_name, quantity, unit_price)
        `)
        .eq('id', ticket.order_id)
        .single()
      
      if (order) {
        orderDetails = order
      }
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('ticket_messages')
      .select('message, sender_type, sender_name, metadata, created_at')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    // Parse customer info
    const customer = ticket.customer as any
    const user = customer?.user
    const customerName = user 
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email 
      : 'Customer'
    const customerEmail = user?.email || 'Not available'
    const shippingAddress = customer?.shipping_address_line1
      ? `${customer.shipping_address_line1}, ${customer.shipping_city}, ${customer.shipping_state} ${customer.shipping_zip}`
      : 'Not provided'

    // Build order summary
    let orderSummary = 'No order associated with this ticket'
    if (orderDetails) {
      const items = (orderDetails.order_items as any[])?.map((item: any) => 
        `- ${item.product_name} (x${item.quantity}) - $${item.unit_price}`
      ).join('\n') || 'No items'
      
      orderSummary = `Order #${orderDetails.order_number}
Status: ${orderDetails.status}
Payment: ${orderDetails.payment_status}
Total: $${orderDetails.total_amount}
Items:
${items}`
    }

    // Parse wizard answers if present in first customer message
    let wizardSummary = ''
    const firstCustomerMessage = messages?.find(m => 
      m.sender_type === 'customer' && m.metadata?.source === 'support_wizard'
    )
    
    if (firstCustomerMessage) {
      try {
        const answers = JSON.parse(firstCustomerMessage.message)
        wizardSummary = Object.entries(answers)
          .map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value}`)
          .join('\n')
      } catch {
        wizardSummary = firstCustomerMessage.message
      }
    }

    // Build conversation history
    const conversationHistory = messages && messages.length > 0
      ? messages.map(m => {
          let sender = 'Unknown'
          if (m.sender_type === 'customer') sender = customerName
          else if (m.sender_type === 'admin') sender = m.sender_name || 'Support Team'
          else if (m.sender_type === 'ai') sender = 'AI Assistant'
          else if (m.sender_type === 'system') sender = 'System'
          
          // Try to parse wizard answers for display
          let messageContent = m.message
          if (m.metadata?.source === 'support_wizard') {
            try {
              const answers = JSON.parse(m.message)
              messageContent = Object.entries(answers)
                .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
                .join(', ')
            } catch {
              // Keep original message
            }
          }
          
          return `${sender}: ${messageContent}`
        }).join('\n\n')
      : 'No previous messages'

    // Build system prompt
    const intentPrompt = INTENT_PROMPTS[intent] || INTENT_PROMPTS.general_help

    const systemPrompt = `You are a professional customer support representative for Modern Health, a premium health and wellness company.

CUSTOMER INFORMATION:
- Name: ${customerName}
- Email: ${customerEmail}
- Shipping Address: ${shippingAddress}

TICKET INFORMATION:
- Subject: ${ticket.subject}
- Priority: ${ticket.priority}
- Status: ${ticket.status}
- Created: ${new Date(ticket.created_at).toLocaleDateString()}

${wizardSummary ? `CUSTOMER'S REPORTED ISSUE (from intake form):
${wizardSummary}

` : ''}ASSOCIATED ORDER:
${orderSummary}

CONVERSATION HISTORY:
${conversationHistory}

${customContext ? `ADDITIONAL ADMIN CONTEXT: ${customContext}\n\n` : ''}

YOUR SPECIFIC INTENT FOR THIS RESPONSE:
${intentPrompt}

RESPONSE GUIDELINES:
- Be professional, warm, and empathetic
- Use the customer's name appropriately
- Reference specific details from their order/ticket
- Keep responses concise but thorough
- Don't make promises the company can't keep
- If offering compensation, mention it will be processed after admin review
- Always end with a clear next step or invitation for follow-up

Generate a response that the admin can use to respond to this customer. The admin may edit before sending.`

    // Generate AI response with streaming
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages: [
        {
          role: 'user',
          content: 'Generate a customer support response based on the context and intent provided.'
        }
      ],
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Return streaming response for useCompletion hook
    return result.toTextStreamResponse()

  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    )
  }
}

