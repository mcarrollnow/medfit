import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { generateText, tool, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { siteConfig } from '@/lib/site-config'

// CORS headers for preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// GET handler for confirmation requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const correlationId = searchParams.get('correlationId')
  console.log('[SMS Incoming] Confirmation request:', correlationId)
  return new NextResponse('OK', { status: 200 })
}

export async function POST(request: NextRequest) {
  console.log('[SMS Incoming] === INCOMING REQUEST ===')
  
  try {
    // Get raw text first for debugging
    const rawText = await request.text()
    console.log('[SMS Incoming] Raw body:', rawText)
    
    // Parse JSON
    let body: any
    try {
      body = JSON.parse(rawText)
    } catch (parseError) {
      console.error('[SMS Incoming] JSON parse error:', parseError)
      return NextResponse.json({ 
        error: 'Invalid JSON body',
        rawBody: rawText.substring(0, 100)
      }, { status: 400 })
    }
    
    // Don't log full SMS body - contains PII (phone numbers, message content)
    console.log('[SMS Incoming] Received payload with keys:', Object.keys(body))
    
    // Handle the nested payload structure from Android app
    // Format: { event: "sms:received", payload: { phoneNumber, message, receivedAt } }
    const event = body.event
    const payload = body.payload || body
    
    console.log('[SMS Incoming] Event:', event)
    
    // Support multiple field name formats
    const phoneNumber = payload.phoneNumber || payload.phone_number || payload.from || payload.sender || payload.mobile
    const message = payload.message || payload.message_text || payload.text || payload.body || payload.smsBody
    const timestamp = payload.receivedAt || payload.received_at || payload.timestamp || payload.time

    // Don't log phone numbers or message content in production
    console.log('[SMS Incoming] Message received, length:', message?.length || 0)

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Handle SMS send status report from gateway FIRST (doesn't require message)
    if (event === 'sms:sent') {
      const success = payload.success
      console.log('[SMS Incoming] Send status report - success:', success)
      
      if (phoneNumber) {
        // Note: Status tracking removed - sms_conversations table may not have status column
        console.log('[SMS Incoming] SMS delivery confirmed:', success ? 'delivered' : 'failed')
      }
      
      return NextResponse.json({ success: true, message: 'Status updated' })
    }

    // For sms:received, require phoneNumber and message
    if (!phoneNumber || !message) {
      // Don't log PII - only log structural info for debugging
      console.log('[SMS Incoming] Missing required fields - hasPhone:', !!phoneNumber, 'hasMessage:', !!message)
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { event, payloadKeys: Object.keys(payload) },
        expected: ['phoneNumber', 'message']
      }, { status: 400 })
    }

    // DEDUPLICATION: Check if we've already processed this exact message recently
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
    const { data: recentDuplicate } = await supabase
      .from('sms_conversations')
      .select('id, received_at')
      .eq('phone_number', phoneNumber)
      .eq('message_text', message)
      .eq('direction', 'incoming')
      .gte('received_at', thirtySecondsAgo)
      .limit(1)
      .single()

    if (recentDuplicate) {
      console.log('[SMS Incoming] ⚠️  DUPLICATE MESSAGE DETECTED - Skipping processing')
      console.log(`  Original message ID: ${recentDuplicate.id}`)
      return NextResponse.json({ 
        success: true,
        message: 'Duplicate message ignored',
        duplicateOf: recentDuplicate.id
      })
    }

    // Store incoming message
    const { data, error } = await supabase
      .from('sms_conversations')
      .insert({
        phone_number: phoneNumber,
        message_text: message,
        direction: 'incoming',
        received_at: timestamp || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[SMS Incoming] Error storing message:', error)
      return NextResponse.json({ error: 'Failed to store message', details: error.message }, { status: 500 })
    }

    console.log('[SMS Incoming] ✅ Message stored:', data?.id)

    // Check for trigger keywords or active session
    const triggerKeywords = ['help', 'support', 'issue', 'problem', 'question']
    const normalizedMessage = message.toLowerCase().trim()
    const isKeywordTriggered = triggerKeywords.some(keyword => 
      normalizedMessage.includes(keyword)
    )

    // Check for existing session
    const { data: existingSession } = await supabase
      .from('sms_sessions')
      .select('*')
      .eq('phone_number', phoneNumber)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const hasActiveSession = !!existingSession

    // Check for recent conversation (last 30 minutes) to keep conversations going
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const { data: recentMessages } = await supabase
      .from('sms_conversations')
      .select('id')
      .eq('phone_number', phoneNumber)
      .gte('received_at', thirtyMinutesAgo)
      .limit(2) // Need at least 2 messages (this one + previous) for a conversation

    const hasRecentConversation = recentMessages && recentMessages.length >= 2

    // Process with AI if triggered, has active session, OR has recent conversation
    const shouldProcessWithAI = isKeywordTriggered || hasActiveSession || hasRecentConversation
    
    console.log('[SMS Incoming] AI Processing Decision:', {
      isKeywordTriggered,
      hasActiveSession,
      hasRecentConversation,
      shouldProcessWithAI
    })

    if (shouldProcessWithAI) {
      console.log('[SMS Incoming] Processing with AI handler')

      try {
        // Process with Claude AI directly
        const sessionState = existingSession?.state || 'idle'
        const sessionContext = existingSession?.context || {}

        // Get conversation history (last 10 messages)
        const { data: conversationHistory } = await supabase
          .from('sms_conversations')
          .select('message_text, direction, received_at')
          .eq('phone_number', phoneNumber)
          .order('received_at', { ascending: false })
          .limit(10)

        // Build conversation context
        const historyText = conversationHistory
          ? conversationHistory
              .reverse()
              .map(msg => `${msg.direction === 'incoming' ? 'Customer' : 'You'}: ${msg.message_text}`)
              .join('\n')
          : ''

        // Define tools for Claude
        const tools = {
          get_customer_by_phone: tool({
            description: 'Look up customer information by phone number',
            inputSchema: z.object({
              phone: z.string().describe('Phone number to search for'),
            }),
            execute: async ({ phone }: { phone: string }) => {
              const { data, error } = await supabase
                .from('customers')
                .select('id, name, email, company, customer_class')
                .eq('phone', phone)
                .single()
              if (error || !data) return { found: false }
              return { found: true, customer: data }
            },
          }),
          get_recent_orders: tool({
            description: 'Get recent orders for a customer',
            inputSchema: z.object({
              customerId: z.string().describe('Customer UUID'),
              limit: z.number().optional().describe('Number of orders to get'),
            }),
            execute: async ({ customerId, limit = 3 }: { customerId: string; limit?: number }) => {
              const { data } = await supabase
                .from('orders')
                .select(`id, order_number, total_amount, status, payment_status, tracking_number, created_at`)
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false })
                .limit(limit)
              return { found: !!data, orders: data || [] }
            },
          }),
          get_order_by_number: tool({
            description: 'Look up a specific order by its order number (e.g. ORD-MGQE405M-G28N)',
            inputSchema: z.object({
              orderNumber: z.string().describe('Order number to look up'),
            }),
            execute: async ({ orderNumber }: { orderNumber: string }) => {
              console.log('[Tool] get_order_by_number called with:', orderNumber)
              
              const { data, error } = await supabase
                .from('orders')
                .select(`
                  id, 
                  order_number, 
                  total_amount, 
                  status, 
                  payment_status, 
                  tracking_number, 
                  shipping_carrier,
                  created_at,
                  order_items (
                    id,
                    product_id,
                    quantity,
                    unit_price,
                    total_price,
                    product_name,
                    products (
                      name,
                      description
                    )
                  )
                `)
                .eq('order_number', orderNumber)
                .single()
              
              if (error || !data) {
                return { found: false, message: 'Order not found' }
              }
              
              return { 
                found: true, 
                order: data,
                items: data.order_items || []
              }
            },
          }),
          create_support_ticket: tool({
            description: 'Create a support ticket',
            inputSchema: z.object({
              customerId: z.string().describe('Customer UUID'),
              subject: z.string().describe('Ticket subject'),
              message: z.string().describe('Ticket message'),
              orderId: z.string().optional().describe('Related order ID'),
            }),
            execute: async ({ customerId, subject, message: ticketMessage, orderId }: { customerId: string; subject: string; message: string; orderId?: string }) => {
              const { data } = await supabase
                .from('support_tickets')
                .insert({
                  customer_id: customerId,
                  subject,
                  message: ticketMessage,
                  order_id: orderId || null,
                  priority: 'medium',
                  status: 'open',
                })
                .select()
                .single()
              return { success: !!data, ticket: data }
            },
          }),
          get_customer_profile: tool({
            description: 'Get SMS customer profile with AI notes and conversation history',
            inputSchema: z.object({
              phone: z.string().describe('Phone number'),
            }),
            execute: async ({ phone }: { phone: string }) => {
              const { data } = await supabase
                .from('sms_customer_profiles')
                .select('*')
                .eq('phone_number', phone)
                .single()
              
              if (!data) {
                // Create new profile
                const { data: newProfile } = await supabase
                  .from('sms_customer_profiles')
                  .insert({ phone_number: phone })
                  .select()
                  .single()
                return { found: true, profile: newProfile }
              }
              
              return { found: true, profile: data }
            },
          }),
          update_customer_profile: tool({
            description: 'Add notes or update customer profile based on conversation',
            inputSchema: z.object({
              phone: z.string().describe('Phone number'),
              note: z.string().optional().describe('New note to add about customer'),
              firstName: z.string().optional().describe('Customer first name'),
              preferredName: z.string().optional().describe('Name they prefer to be called'),
            }),
            execute: async ({ phone, note, firstName, preferredName }: { phone: string; note?: string; firstName?: string; preferredName?: string }) => {
              // Get existing profile
              const { data: profile } = await supabase
                .from('sms_customer_profiles')
                .select('*')
                .eq('phone_number', phone)
                .single()
              
              const updates: Record<string, any> = {}
              
              // Add note to notes array
              if (note) {
                const existingNotes = profile?.notes || []
                updates.notes = [
                  ...existingNotes,
                  {
                    date: new Date().toISOString(),
                    note,
                    learned_from: 'sms_conversation'
                  }
                ]
              }
              
              if (firstName) updates.first_name = firstName
              if (preferredName) updates.preferred_name = preferredName
              
              const { data } = await supabase
                .from('sms_customer_profiles')
                .update(updates)
                .eq('phone_number', phone)
                .select()
                .single()
              
              return { success: !!data, profile: data }
            },
          }),
          search_conversation_history: tool({
            description: 'Search previous SMS conversations with this customer',
            inputSchema: z.object({
              phone: z.string().describe('Phone number'),
              limit: z.number().optional().describe('Number of messages to retrieve'),
            }),
            execute: async ({ phone, limit = 20 }: { phone: string; limit?: number }) => {
              const { data } = await supabase
                .from('sms_conversations')
                .select('message_text, direction, received_at')
                .eq('phone_number', phone)
                .order('received_at', { ascending: false })
                .limit(limit)
              
              return { 
                found: !!data,
                messages: data || [],
                count: data?.length || 0
              }
            },
          }),
        }

        // Load AI agent configuration from database
        interface AgentConfig {
          system_prompt: string
          personality: string | null
          greeting_message: string | null
          temperature: number
          model: string
          resources: Array<{ title: string; content: string; resource_type: string }>
          examples: Array<{ user_message: string; ideal_response: string; category: string | null }>
        }
        
        let agentConfig: AgentConfig | null = null

        try {
          const { data: agent } = await supabase
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
            .eq('slug', 'sms-support')
            .eq('is_active', true)
            .single()

          if (agent) {
            agentConfig = agent as unknown as AgentConfig
            console.log('[SMS Incoming] Loaded SMS Support agent config from database')
          }
        } catch (e) {
          console.log('[SMS Incoming] Could not load agent config, using defaults')
        }

        // Build system prompt from agent config or use default
        let aiInstructions = agentConfig?.system_prompt || `You are a helpful customer support AI assistant for a health/wellness ecommerce business. 
You help customers with order inquiries, shipping questions, and general support.
Be friendly, professional, and concise. Keep SMS messages short.
Always use tools to look up customer and order information before responding.`

        // Add personality if configured
        if (agentConfig?.personality) {
          aiInstructions += `\n\nPERSONALITY: ${agentConfig.personality}`
        }

        // Add training resources
        if (agentConfig?.resources && agentConfig.resources.length > 0) {
          aiInstructions += '\n\n--- TRAINING RESOURCES ---\n'
          for (const resource of agentConfig.resources) {
            aiInstructions += `\n[${resource.resource_type.toUpperCase()}] ${resource.title}:\n${resource.content}\n`
          }
        }

        // Add training examples
        if (agentConfig?.examples && agentConfig.examples.length > 0) {
          aiInstructions += '\n\n--- EXAMPLE CONVERSATIONS ---\n'
          for (const example of agentConfig.examples) {
            aiInstructions += `\nCustomer: ${example.user_message}\nIdeal Response: ${example.ideal_response}\n`
          }
        }
        
        // Build system prompt with instructions + context
        const systemPrompt = `${aiInstructions}

---

CURRENT CONTEXT:
- Customer phone number: ${phoneNumber}
- Session state: ${sessionState}
- Session context: ${JSON.stringify(sessionContext, null, 2)}`

        // Use agent's configured model and temperature
        const modelName = agentConfig?.model || 'claude-sonnet-4-20250514'
        const temperature = agentConfig?.temperature || 0.7

        // Generate AI response with multi-step tool execution
        console.log('[SMS Incoming] Using model:', modelName, 'temperature:', temperature)
        const result = await generateText({
          model: anthropic(modelName as any),
          system: systemPrompt,
          prompt: `CONVERSATION HISTORY:
${historyText}

Customer's latest message: "${message}"

CRITICAL RULES:

1. DO NOT REPEAT PREVIOUS MESSAGES
   - The conversation history above shows what was ALREADY sent
   - NEVER resend payment confirmations, order links, or other previous messages
   - Only respond to the CURRENT question: "${message}"

2. WORKFLOW:
   Step 1: Call all necessary tools WITHOUT generating any text
   Step 2: Wait for tool results  
   Step 3: Generate ONLY ONE NEW response that answers their CURRENT question

3. YOU MUST ALWAYS END WITH A TEXT RESPONSE TO THE CUSTOMER.

4. DO NOT TELL CUSTOMER ABOUT:
   - Internal processes ("calling tools", "checking database")
   - Technical implementation details

5. JUST RESPOND WITH THE ANSWER - be concise for SMS.

Customer is asking: "${message}"`,
          tools,
          stopWhen: stepCountIs(5),
        })

        // Extract text from the result
        let finalText = result.text
        
        // If result.text is empty, look through steps for text content
        if (!finalText || finalText.trim().length === 0) {
          console.log('[SMS Incoming] result.text is empty, searching steps for text...')
          
          if (result.steps) {
            for (let i = result.steps.length - 1; i >= 0; i--) {
              const step = result.steps[i]
              if (step.text && step.text.trim().length > 0) {
                finalText = step.text
                break
              }
            }
          }
        }
        
        console.log('[SMS Incoming] Final AI response:', finalText?.substring(0, 100))

        if (!finalText || finalText.trim().length === 0) {
          finalText = "I'm having trouble accessing your information right now. Can you provide your order number so I can look it up for you?"
        }

        // Add conversation timer disclaimer
        finalText = `${finalText}\n\n---\nℹ️ This conversation will remain active for 30 minutes.`

        // Update or create session
        if (sessionState !== 'idle') {
          const sessionData = {
            phone_number: phoneNumber,
            customer_id: sessionContext?.customerId || existingSession?.customer_id || null,
            state: sessionState,
            context: sessionContext,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }

          if (existingSession) {
            await supabase
              .from('sms_sessions')
              .update(sessionData)
              .eq('id', existingSession.id)
          } else {
            await supabase.from('sms_sessions').insert(sessionData)
          }
        }

        // Send AI response back via FCM
        console.log('[SMS Incoming] Sending AI response via SMS...')
        
        try {
          const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : siteConfig.appUrl
          
          const serviceKey = process.env.INTERNAL_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
          
          const smsResponse = await fetch(`${baseUrl}/api/internal/send-sms`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-service-key': serviceKey || ''
            },
            body: JSON.stringify({
              to: phoneNumber,
              body: finalText,
              metadata: { type: 'support' }
            })
          })
          
          if (smsResponse.ok) {
            console.log('[SMS Incoming] AI response sent successfully')
            
            // Store outgoing message in conversation history
            await supabase
              .from('sms_conversations')
              .insert({
                phone_number: phoneNumber,
                message_text: finalText,
                direction: 'outgoing',
                received_at: new Date().toISOString()
              })
          } else {
            console.error('[SMS Incoming] Failed to send SMS:', await smsResponse.text())
          }
        } catch (smsError: any) {
          console.error('[SMS Incoming] SMS send error:', smsError.message)
        }

      } catch (aiError: any) {
        console.error('[SMS Incoming] AI processing error:', aiError)
        // Don't fail the webhook, just log the error
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      message: 'SMS received and stored' 
    })

  } catch (error: any) {
    console.error('[SMS Incoming] Error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
