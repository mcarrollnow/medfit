import { type NextRequest } from "next/server"
import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 60

// Initialize Supabase client with service role key for full database access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Define AI tools for database access
const tools = {
  get_order_details: tool({
    description: 'Get detailed information about a customer order including items, status, tracking, and payment details',
    parameters: z.object({
      order_number: z.string().describe('The order number (e.g., "#12345")'),
    }),
    execute: async ({ order_number }) => {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            product:products (
              id,
              name,
              description
            )
          ),
          customer:customers (
            id,
            customer_name,
            user:users (
              email,
              phone
            )
          )
        `)
        .eq('order_number', order_number)
        .single()

      if (error || !order) {
        return { success: false, message: `Order ${order_number} not found` }
      }

      return {
        success: true,
        order: {
          order_number: order.order_number,
          status: order.status,
          total_amount: order.total_amount,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: order.order_items?.map((item: any) => ({
            product_name: item.product?.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
          customer: {
            name: order.customer?.customer_name,
            email: order.customer?.user?.email,
            phone: order.customer?.user?.phone,
          },
        },
      }
    },
  }),

  search_products: tool({
    description: 'Search for products in the catalog by name or check inventory status',
    parameters: z.object({
      query: z.string().describe('Product name or search term'),
    }),
    execute: async ({ query }) => {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, description, price, stock_quantity')
        .ilike('name', `%${query}%`)
        .limit(10)

      if (error) {
        return { success: false, message: 'Error searching products' }
      }

      return {
        success: true,
        products: products?.map(p => ({
          name: p.name,
          price: p.price,
          in_stock: (p.stock_quantity || 0) > 0,
          stock_quantity: p.stock_quantity,
        })),
      }
    },
  }),

  send_sms: tool({
    description: 'Send an SMS message to a customer using their email to look up phone number',
    parameters: z.object({
      customer_email: z.string().describe('Customer email address'),
      message: z.string().describe('SMS message to send'),
    }),
    execute: async ({ customer_email, message }) => {
      // Get customer phone from database
      const { data: user } = await supabase
        .from('users')
        .select('phone')
        .eq('email', customer_email)
        .single()

      if (!user?.phone) {
        return { success: false, message: 'Customer phone number not found' }
      }

      // Here you would integrate with your SMS provider (Telnyx, Twilio, etc.)
      console.log('[Support UI] SMS would be sent:', { to: user.phone, message })
      
      return {
        success: true,
        message: `SMS queued to send to ${user.phone}`,
      }
    },
  }),
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    console.log('[Support UI] Received chat request with', messages.length, 'messages')

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(messages)

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      messages: modelMessages,
      maxTokens: 2048,
      tools: tools,
      system: `You are a helpful customer support AI assistant with full database access.

You have access to the following tools:
1. get_order_details(order_number) - Get order information, items, status, and tracking
2. search_products(query) - Search product catalog and check inventory
3. send_sms(customer_email, message) - Send SMS to customers

Important guidelines:
- Always be professional, empathetic, and helpful
- Use tools to look up real information rather than making assumptions
- When discussing orders, always verify details using get_order_details
- For product questions, use search_products to check availability
- If sending SMS, always confirm with the user first
- Provide clear, actionable solutions
- If you can't help with something, escalate to a human agent

Response format:
- Keep responses concise and focused
- Use bullet points for multiple items
- Include relevant order/product details when available
- Always end with "Is there anything else I can help you with?"`,
      abortSignal: req.signal,
    })

    // Return streaming response
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[Support UI] Error in chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
