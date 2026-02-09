import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string | null
  status: string
  priority: string
  last_message: string | null
  last_message_time: string
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  order: {
    id: string
    order_number: string
    order_date: string
    total: number
    subtotal: number
    shipping: number
    tax: number
    wallet_address: string | null
    tracking_number: string | null
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    timeline: Array<{
      status: string
      date: string
      time: string
      completed: boolean
    }>
  } | null
}

export async function getTickets() {
  const supabase = getSupabaseBrowserClient()

  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customer:customers(*),
      order:orders(
        *,
        items:order_items(*),
        timeline:order_timeline(*)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching tickets:", error)
    return []
  }

  return tickets || []
}

export async function getTicketById(ticketId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customer:customers(*),
      order:orders(
        *,
        items:order_items(*),
        timeline:order_timeline(*)
      )
    `)
    .eq("id", ticketId)
    .single()

  if (error) {
    console.error("[v0] Error fetching ticket:", error)
    return null
  }

  return ticket
}

export async function getTicketMessages(ticketId: string, adminOnly = false) {
  const supabase = getSupabaseBrowserClient()

  let query = supabase.from("messages").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: true })

  if (adminOnly) {
    query = query.eq("is_admin_only", true)
  }

  const { data: messages, error } = await query

  if (error) {
    console.error("[v0] Error fetching messages:", error)
    return []
  }

  return messages || []
}

export async function createTicket(ticketData: {
  customer_id: string
  order_id?: string
  title: string
  description?: string
  priority?: string
}) {
  const supabase = getSupabaseBrowserClient()

  // Generate ticket number
  const ticketNumber = `TKT-${Date.now()}`

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      ticket_number: ticketNumber,
      ...ticketData,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating ticket:", error)
    return null
  }

  return data
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating ticket:", error)
    return null
  }

  return data
}

export async function addMessage(messageData: {
  ticket_id: string
  sender_type: "customer" | "ai" | "admin"
  sender_name: string
  message_text: string
  is_admin_only?: boolean
}) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("messages").insert(messageData).select().single()

  if (error) {
    console.error("[v0] Error adding message:", error)
    return null
  }

  // Update ticket's last message
  await supabase
    .from("support_tickets")
    .update({
      last_message: messageData.message_text,
      last_message_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageData.ticket_id)

  return data
}
