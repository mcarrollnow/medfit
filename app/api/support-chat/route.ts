import { streamText, tool, convertToModelMessages, stepCountIs, type UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30
// Force rebuild to use updated @ai-sdk/anthropic v1.2.12

export async function POST(req: Request) {
  const { messages, orderId }: { messages: UIMessage[]; orderId: string } = await req.json()

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get order details for context
  const { data: order } = await supabase
    .from('orders')
    .select('order_number, payment_status, total_amount, payment_method')
    .eq('order_number', orderId)
    .single()

  const systemPrompt = `You are a helpful customer support assistant for a crypto payment platform.
You are helping a customer with order #${orderId}.
Order status: ${order?.payment_status || 'unknown'}
Payment method: ${order?.payment_method || 'unknown'}

Be friendly, professional, and provide clear information about:
- Payment tracking and blockchain confirmations
- Expected wait times (usually 1-5 minutes for crypto)
- How to check transaction status
- Common payment issues and solutions

You have access to tools to help the customer.`

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    temperature: 0.7,
    stopWhen: stepCountIs(5),
    tools: {
      get_order_details: tool({
        description: 'Get complete details for the current order including payment status, items, and shipping info.',
        inputSchema: z.object({}),
        execute: async () => {
          const { data: orderDetails, error } = await supabase
            .from('orders')
            .select(`
              id,
              order_number,
              status,
              payment_status,
              payment_method,
              total_amount,
              shipping_cost,
              tax_amount,
              discount_amount,
              created_at,
              payment_verified_at,
              transaction_hash,
              expected_payment_amount,
              expected_payment_currency,
              order_items (
                id,
                product_name,
                quantity,
                unit_price
              )
            `)
            .eq('order_number', orderId)
            .single()

          if (error) {
            return { error: 'Order not found' }
          }

          return {
            order_number: orderDetails.order_number,
            status: orderDetails.status,
            payment_status: orderDetails.payment_status,
            payment_method: orderDetails.payment_method,
            total: orderDetails.total_amount,
            items: orderDetails.order_items,
            transaction_hash: orderDetails.transaction_hash,
            payment_verified_at: orderDetails.payment_verified_at,
            expected_payment: {
              amount: orderDetails.expected_payment_amount,
              currency: orderDetails.expected_payment_currency
            }
          }
        }
      }),

      check_payment_status: tool({
        description: 'Check the current blockchain payment status and transaction confirmations.',
        inputSchema: z.object({}),
        execute: async () => {
          const { data: order } = await supabase
            .from('orders')
            .select('payment_status, transaction_hash, payment_verified_at, expected_payment_amount, expected_payment_currency')
            .eq('order_number', orderId)
            .single()

          if (!order) {
            return { error: 'Order not found' }
          }

          return {
            payment_status: order.payment_status,
            transaction_hash: order.transaction_hash,
            verified_at: order.payment_verified_at,
            expected_amount: order.expected_payment_amount,
            currency: order.expected_payment_currency,
            blockchain_explorer: order.transaction_hash 
              ? `https://etherscan.io/tx/${order.transaction_hash}`
              : null
          }
        }
      }),

      search_products: tool({
        description: 'Search for products by name to help answer questions about items in the order.',
        inputSchema: z.object({
          query: z.string().optional().describe('Product name or keyword')
        }),
        execute: async ({ query }) => {
          let queryBuilder = supabase
            .from('products')
            .select('id, name, description, retail_price, stock_quantity')
            .eq('active', true)

          if (query) {
            queryBuilder = queryBuilder.ilike('name', `%${query}%`)
          }

          const { data: products } = await queryBuilder.limit(5)

          return products?.map(p => ({
            name: p.name,
            description: p.description,
            price: p.retail_price,
            in_stock: p.stock_quantity > 0
          })) || []
        }
      })
    }
  })

  return result.toUIMessageStreamResponse()
}
