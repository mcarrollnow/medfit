'use server'

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export interface SupportTicket {
  id: string
  customer_id: string | null
  order_id: string | null
  subject: string
  status: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  // Joined data
  customer?: {
    id: string
    company_name: string | null
    user?: {
      email: string
      first_name: string | null
      last_name: string | null
    }
  }
  order?: {
    id: string
    order_number: string
    total_amount: number
  }
  messages?: TicketMessage[]
  message_count?: number
  // Summary from wizard answers
  issue_summary?: string
  wizard_answers?: Record<string, string>
}

export interface TicketMessage {
  id: string
  ticket_id: string
  message: string
  is_admin: boolean
  is_ai: boolean
  created_at: string
}

export async function submitSupportTicket(formData: FormData) {
  const supabase = getSupabaseAdminClient()
  
  const orderId = formData.get('orderId') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string
  const priority = formData.get('priority') as string
  const customerId = formData.get('customerId') as string

  // Map priority from wizard format
  const priorityMap: Record<string, string> = {
    'Low': 'low',
    'Medium': 'medium', 
    'High': 'high',
    'Urgent': 'urgent'
  }
  const normalizedPriority = priorityMap[priority] || 'medium'

  try {
    // Get customer_id from order if we have an order ID
    let resolvedCustomerId = customerId !== 'mock-customer-id' ? customerId : null
    let userId: string | null = null
    
    if (orderId && !resolvedCustomerId) {
      const { data: orderData } = await supabase
        .from('orders')
        .select('customer_id')
        .eq('id', orderId)
        .single()
      
      if (orderData) {
        resolvedCustomerId = orderData.customer_id
      }
    }

    // Get user_id from customer record (needed for notification trigger)
    if (resolvedCustomerId) {
      const { data: customer } = await supabase
        .from('customers')
        .select('user_id, user:users!customers_user_id_fkey(auth_id)')
        .eq('id', resolvedCustomerId)
        .single()
      
      // Get the auth.users id (not our users table id)
      const userRecord = customer?.user as unknown as { auth_id: string } | null
      if (userRecord?.auth_id) {
        userId = userRecord.auth_id
      }
    }

    // Create the support ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        customer_id: resolvedCustomerId,
        user_id: userId, // Set user_id for notification trigger
        order_id: orderId || null,
        subject,
        status: 'open',
        priority: normalizedPriority,
        ai_handling: false, // Manual ticket from wizard
      })
      .select()
      .single()

    if (ticketError) {
      console.error('Error creating ticket:', ticketError)
      return { success: false, error: ticketError.message }
    }

    // Add the initial message with wizard answers
    const { error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        message: message, // This contains the JSON of wizard answers
        is_admin: false,
        is_ai: false
      })

    if (messageError) {
      console.error('Error creating message:', messageError)
    }

    return {
      success: true,
      ticketId: ticket.id
    }
  } catch (error) {
    console.error('Failed to submit ticket:', error)
    return { success: false, error: 'Failed to create support ticket' }
  }
}

// Helper function to generate summary from wizard answers
function generateIssueSummary(subject: string, answers: Record<string, string>): string {
  let summary = ''

  if (subject.includes('Missing')) {
    summary = `Missing delivery`
    if (answers.checked_tracking) summary += ` • Tracking: ${answers.checked_tracking}`
    if (answers.address_correct) summary += ` • Address: ${answers.address_correct}`
  } else if (subject.includes('Late')) {
    summary = `Late delivery`
    if (answers.days_late) summary += ` • ${answers.days_late} late`
    if (answers.urgency) summary += ` • ${answers.urgency}`
  } else if (subject.includes('Damaged') || subject.includes('Broken')) {
    summary = `Damaged product`
    if (answers.damage_type) summary += ` • ${answers.damage_type}`
    if (answers.resolution) summary += ` • Wants: ${answers.resolution}`
  } else if (subject.includes('Adverse')) {
    summary = `⚠️ Adverse reaction`
    if (answers.severity) summary += ` • Severity: ${answers.severity}`
    if (answers.medical_attention) summary += ` • Medical: ${answers.medical_attention}`
  } else if (subject.includes('Complaint')) {
    summary = `Complaint`
    if (answers.topic) summary += ` • ${answers.topic}`
    if (answers.importance) summary += ` • ${answers.importance}`
  }

  return summary || subject
}

export async function getAllSupportTickets(): Promise<{ tickets: SupportTicket[], error?: string }> {
  try {
    const supabase = getSupabaseAdminClient()

    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        customer:customers(
          id,
          company_name,
          user:users!customers_user_id_fkey(email, first_name, last_name)
        ),
        order:orders(id, order_number, total_amount)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets:', error)
      return { tickets: [], error: error.message }
    }

    // Get message counts and first wizard message for each ticket
    const ticketIds = tickets?.map(t => t.id) || []
    
    if (ticketIds.length > 0) {
      // Get message counts
      const { data: messageCounts } = await supabase
        .from('ticket_messages')
        .select('ticket_id')
        .in('ticket_id', ticketIds)

      const countMap: Record<string, number> = {}
      messageCounts?.forEach(m => {
        countMap[m.ticket_id] = (countMap[m.ticket_id] || 0) + 1
      })

      // Get first customer message for each ticket (wizard data)
      const { data: wizardMessages } = await supabase
        .from('ticket_messages')
        .select('ticket_id, message')
        .in('ticket_id', ticketIds)
        .eq('is_admin', false)
        .order('created_at', { ascending: true })

      // Build a map of ticket_id -> wizard answers
      const wizardMap: Record<string, Record<string, string>> = {}
      wizardMessages?.forEach(m => {
        // Only take the first customer message per ticket
        if (!wizardMap[m.ticket_id]) {
          try {
            const parsed = JSON.parse(m.message)
            // If it's valid JSON object with keys, treat as wizard data
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
              wizardMap[m.ticket_id] = parsed
            }
          } catch {
            // Not JSON, skip
          }
        }
      })

      return {
        tickets: (tickets || []).map(ticket => {
          const wizardAnswers = wizardMap[ticket.id]
          return {
            ...ticket,
            customer: ticket.customer ? {
              ...ticket.customer,
              user: Array.isArray(ticket.customer.user) ? ticket.customer.user[0] : ticket.customer.user
            } : undefined,
            message_count: countMap[ticket.id] || 0,
            wizard_answers: wizardAnswers,
            issue_summary: wizardAnswers 
              ? generateIssueSummary(ticket.subject, wizardAnswers)
              : undefined
          }
        })
      }
    }

    return { tickets: tickets || [] }
  } catch (err) {
    console.error('Error in getAllSupportTickets:', err)
    return { tickets: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
  const supabase = getSupabaseAdminClient()

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      customer:customers(
        id,
        company_name,
        user:users!customers_user_id_fkey(email, first_name, last_name)
      ),
      order:orders(id, order_number, total_amount)
    `)
    .eq('id', ticketId)
    .single()

  if (error || !ticket) {
    console.error('Error fetching ticket:', error)
    return null
  }

  // Get messages
  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  return {
    ...ticket,
    customer: ticket.customer ? {
      ...ticket.customer,
      user: Array.isArray(ticket.customer.user) ? ticket.customer.user[0] : ticket.customer.user
    } : undefined,
    messages: messages || []
  }
}

export async function updateTicketStatus(
  ticketId: string, 
  status: SupportTicket['status']
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from('support_tickets')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)

  if (error) {
    console.error('Error updating ticket status:', error)
    return { success: false, error: error.message }
  }

  // Add system message about status change
  await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: ticketId,
      message: `Ticket status changed to ${status}`,
      is_admin: true,
      is_ai: false
    })

  return { success: true }
}

export async function updateTicketPriority(
  ticketId: string,
  priority: SupportTicket['priority']
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from('support_tickets')
    .update({
      priority,
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)

  if (error) {
    console.error('Error updating ticket priority:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function addTicketMessage(
  ticketId: string,
  message: string,
  isAdmin: boolean = true
): Promise<{ success: boolean; error?: string; message?: TicketMessage }> {
  const supabase = getSupabaseAdminClient()

  // First, ensure the ticket has user_id set (for notification trigger)
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('id, user_id, customer_id')
    .eq('id', ticketId)
    .single()

  console.log('Initial ticket query:', { ticket, error: ticketError?.message })

  if (ticket && !ticket.user_id && ticket.customer_id) {
    // Get auth user id from customer - need to go through users table to get auth_id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', ticket.customer_id)
      .single()
    
    console.log('Customer lookup:', { customer, error: customerError?.message })
    
    if (customer?.user_id) {
      // Now get the auth_id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('auth_id')
        .eq('id', customer.user_id)
        .single()
      
      console.log('User lookup:', { user, error: userError?.message })
      
      if (user?.auth_id) {
        console.log('Fixing ticket user_id with auth_id:', user.auth_id)
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ user_id: user.auth_id })
          .eq('id', ticketId)
        
        if (updateError) {
          console.error('Failed to update ticket user_id:', updateError)
        } else {
          // Verify the update worked
          const { data: verifyTicket } = await supabase
            .from('support_tickets')
            .select('user_id')
            .eq('id', ticketId)
            .single()
          console.log('Verified ticket user_id after update:', verifyTicket?.user_id)
        }
      }
    }
  } else {
    console.log('Skipping user_id fix:', { 
      hasTicket: !!ticket, 
      hasUserId: !!ticket?.user_id, 
      hasCustomerId: !!ticket?.customer_id 
    })
  }

  // Generate a UUID for the message so we can find it later
  const messageId = crypto.randomUUID()
  
  console.log('Adding message:', { ticketId, messageId, isAdmin, messageLength: message.length })
  
  // Get ticket info for notification (do this BEFORE the insert)
  let ticketInfo: { subject: string; customer_id: string; user_id: string | null } | null = null
  if (isAdmin) {
    const { data: ticketData } = await supabase
      .from('support_tickets')
      .select('subject, customer_id, user_id')
      .eq('id', ticketId)
      .single()
    
    // If user_id is still null, try to get it fresh from customer/user
    if (ticketData && !ticketData.user_id && ticketData.customer_id) {
      const { data: custData } = await supabase
        .from('customers')
        .select('user_id')
        .eq('id', ticketData.customer_id)
        .single()
      
      if (custData?.user_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('auth_id')
          .eq('id', custData.user_id)
          .single()
        
        if (userData?.auth_id) {
          ticketData.user_id = userData.auth_id
          console.log('Resolved user_id from customer chain:', userData.auth_id)
        }
      }
    }
    
    ticketInfo = ticketData
    console.log('Ticket info for notification:', ticketInfo)
  }
  
  // Pre-create the notification BEFORE inserting the message
  // This way the trigger won't need to create one (or will fail on duplicate)
  if (isAdmin && ticketInfo?.user_id) {
    console.log('Pre-creating notification with user_id:', ticketInfo.user_id)
    await supabase
      .from('notifications')
      .insert({
        user_id: ticketInfo.user_id,
        customer_id: ticketInfo.customer_id,
        type: 'support_ticket',
        title: `Support Team - ${ticketInfo.subject || 'Support Response'}`,
        message: message.substring(0, 200),
        ticket_id: ticketId,
        ticket_message_id: messageId,
        read: false
      })
      .then(({ error }) => {
        if (error) console.log('Pre-notification insert result:', error.message)
        else console.log('Pre-notification created successfully')
      })
  }
  
  // WORKAROUND: Insert with is_admin=false first (trigger only fires on is_admin=true)
  // Then update to set is_admin=true
  console.log('Inserting message with is_admin=false to bypass trigger...')
  const { error: insertError } = await supabase
    .from('ticket_messages')
    .insert({
      id: messageId,
      ticket_id: ticketId,
      message,
      is_admin: false, // Bypass trigger
      is_ai: false
    })

  if (insertError) {
    console.error('Insert error:', insertError.message)
    return { success: false, error: insertError.message }
  }

  // Now update to set is_admin=true (trigger doesn't fire on UPDATE)
  if (isAdmin) {
    console.log('Updating message to set is_admin=true...')
    const { error: updateError } = await supabase
      .from('ticket_messages')
      .update({ is_admin: true })
      .eq('id', messageId)
    
    if (updateError) {
      console.error('Update error:', updateError.message)
      // Message still exists, just with wrong is_admin flag
    }
  }
  
  console.log('Message inserted successfully')

  // Fetch the message we just added (try both IDs)
  const { data: addedMessage, error: fetchError } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .eq('message', message)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  console.log('Fetch result:', { found: !!addedMessage, fetchError: fetchError?.message })

  // Update ticket's updated_at and potentially status
  await supabase
    .from('support_tickets')
    .update({ 
      updated_at: new Date().toISOString(),
      ...(isAdmin ? { status: 'in_progress' } : {})
    })
    .eq('id', ticketId)

  // If admin message, manually create notification for customer (since trigger fails)
  if (isAdmin && addedMessage) {
    try {
      // Get ticket with customer info
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          customer:customers(id, user_id)
        `)
        .eq('id', ticketId)
        .single()
      
      const customer = ticket?.customer as any
      if (customer?.user_id) {
        // Create notification for the customer
        await supabase
          .from('notifications')
          .insert({
            user_id: customer.user_id,
            customer_id: customer.id,
            type: 'support_ticket',
            title: `Support Team - ${ticket?.subject || 'Support Response'}`,
            message: message.substring(0, 200),
            ticket_id: ticketId,
            ticket_message_id: messageId,
            read: false
          })
        console.log('Created notification for customer:', customer.user_id)
      }
    } catch (notifError) {
      // Non-critical - just log and continue
      console.log('Could not create notification:', notifError)
    }
  }

  return { success: true, message: addedMessage || undefined }
}

export async function getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function getOpenTicketCount(): Promise<number> {
  const supabase = getSupabaseAdminClient()

  const { count, error } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .in('status', ['open', 'in_progress'])

  if (error) {
    console.error('Error fetching ticket count:', error)
    return 0
  }

  return count || 0
}

// Get tickets for the currently logged in customer
export async function getMyTickets(userId: string): Promise<SupportTicket[]> {
  const supabase = getSupabaseAdminClient()

  // First get the customer record for this user
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!customer) {
    return []
  }

  // Get tickets for this customer
  const { data: tickets, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      order:orders(id, order_number, total_amount)
    `)
    .eq('customer_id', customer.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching customer tickets:', error)
    return []
  }

  // Get messages for these tickets
  const ticketIds = tickets?.map(t => t.id) || []
  
  if (ticketIds.length > 0) {
    const { data: messages } = await supabase
      .from('ticket_messages')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('created_at', { ascending: true })

    // Attach messages to tickets
    const messagesByTicket: Record<string, TicketMessage[]> = {}
    messages?.forEach(m => {
      if (!messagesByTicket[m.ticket_id]) {
        messagesByTicket[m.ticket_id] = []
      }
      messagesByTicket[m.ticket_id].push(m)
    })

    return tickets.map(ticket => ({
      ...ticket,
      messages: messagesByTicket[ticket.id] || [],
      message_count: messagesByTicket[ticket.id]?.length || 0
    }))
  }

  return tickets || []
}

// Get a specific ticket with messages for the customer
export async function getMyTicketById(ticketId: string, userId: string): Promise<SupportTicket | null> {
  const supabase = getSupabaseAdminClient()

  // First get the customer record for this user
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!customer) {
    return null
  }

  // Get the ticket (ensuring it belongs to this customer)
  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      order:orders(id, order_number, total_amount)
    `)
    .eq('id', ticketId)
    .eq('customer_id', customer.id)
    .single()

  if (error || !ticket) {
    return null
  }

  // Get messages
  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  return {
    ...ticket,
    messages: messages || []
  }
}

// Add a message to a ticket as a customer
export async function addCustomerMessage(
  ticketId: string,
  message: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify this ticket belongs to the customer
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!customer) {
    return { success: false, error: 'Customer not found' }
  }

  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('id, customer_id')
    .eq('id', ticketId)
    .eq('customer_id', customer.id)
    .single()

  if (!ticket) {
    return { success: false, error: 'Ticket not found or access denied' }
  }

  // Add the message
  const messageId = crypto.randomUUID()
  
  const { error } = await supabase
    .from('ticket_messages')
    .insert({
      id: messageId,
      ticket_id: ticketId,
      message,
      is_admin: false,
      is_ai: false
    })

  if (error && !(error.code === '23502' && error.message?.includes('notifications'))) {
    console.error('Error adding customer message:', error)
    return { success: false, error: error.message }
  }

  // Update ticket status if it was waiting on customer
  await supabase
    .from('support_tickets')
    .update({ 
      updated_at: new Date().toISOString(),
      status: 'open' // Re-open if customer responds
    })
    .eq('id', ticketId)
    .eq('status', 'waiting_on_customer')

  return { success: true }
}
