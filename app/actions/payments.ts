"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { unstable_noStore as noStore } from "next/cache"

// Types
export interface PaymentContact {
  id: string
  name: string
  normalized_name: string
  total_paid: number
  payment_count: number
  first_payment_date: string | null
  last_payment_date: string | null
}

export interface Payment {
  id: string
  contact_id: string | null
  contact_name: string
  payment_date: string
  payment_method: string | null
  amount: number
  received_minus_fee: number | null
  confirmed: boolean
  notes: string | null
  tracking_numbers: string[] | null
  tariff_cost: number | null
  confirmation_status: string | null
  wire_transfer_notes: string | null
  contact?: PaymentContact
}

export interface WireTransfer {
  id: string
  amount: number
  transfer_date: string
  status: string
  total_left_to_transfer: number | null
  bank_reference: string | null
  notes: string | null
  transaction_numbers: string[] | null
  tariff_cost: number | null
  tariff_notes: string | null
}

export interface PaymentMessage {
  id: string
  sender: 'johnny' | 'admin'
  message: string
  read_at: string | null
  created_at: string
}

// Get all payment contacts
export async function getPaymentContacts(): Promise<PaymentContact[]> {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('payment_contacts')
    .select('*')
    .order('total_paid', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }

  return data || []
}

// Get a single contact with their payments
export async function getContactWithPayments(contactId: string): Promise<{
  contact: PaymentContact | null
  payments: Payment[]
}> {
  const supabase = await getSupabaseServerClient()
  
  const { data: contact } = await supabase
    .from('payment_contacts')
    .select('*')
    .eq('id', contactId)
    .single()

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('contact_id', contactId)
    .order('payment_date', { ascending: false })

  return {
    contact: contact || null,
    payments: payments || []
  }
}

// Get payments with optional filters
export async function getPayments(options?: {
  contactId?: string
  startDate?: string
  endDate?: string
  paymentMethod?: string
}): Promise<Payment[]> {
  noStore() // Prevent caching of this server action
  
  const supabase = await getSupabaseServerClient()
  
  console.log('[getPayments] Called with options:', JSON.stringify(options))
  
  let query = supabase
    .from('payments')
    .select(`
      *,
      contact:payment_contacts(*)
    `)
    .order('payment_date', { ascending: false })

  if (options?.contactId) {
    query = query.eq('contact_id', options.contactId)
  }
  
  if (options?.startDate) {
    console.log('[getPayments] Filtering gte payment_date:', options.startDate)
    query = query.gte('payment_date', options.startDate)
  }
  
  if (options?.endDate) {
    console.log('[getPayments] Filtering lte payment_date:', options.endDate)
    query = query.lte('payment_date', options.endDate)
  }
  
  if (options?.paymentMethod) {
    query = query.ilike('payment_method', `%${options.paymentMethod}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getPayments] Error:', error)
    return []
  }

  console.log('[getPayments] Returned', data?.length || 0, 'payments')
  if (data && data.length > 0) {
    console.log('[getPayments] Sample payment_date format:', data[0].payment_date)
  }
  return data || []
}

// Get payment stats
export async function getPaymentStats(options?: {
  startDate?: string
  endDate?: string
}): Promise<{
  totalReceived: number
  totalPayments: number
  uniqueCustomers: number
  avgPayment: number
}> {
  noStore() // Prevent caching of this server action
  
  const supabase = await getSupabaseServerClient()
  
  console.log('[getPaymentStats] Called with options:', JSON.stringify(options))
  
  let query = supabase.from('payments').select('amount, contact_id')
  
  if (options?.startDate) {
    query = query.gte('payment_date', options.startDate)
  }
  if (options?.endDate) {
    query = query.lte('payment_date', options.endDate)
  }

  const { data } = await query

  if (!data || data.length === 0) {
    return { totalReceived: 0, totalPayments: 0, uniqueCustomers: 0, avgPayment: 0 }
  }

  const totalReceived = data.reduce((sum, p) => sum + (p.amount || 0), 0)
  const uniqueCustomers = new Set(data.map(p => p.contact_id).filter(Boolean)).size
  
  return {
    totalReceived,
    totalPayments: data.length,
    uniqueCustomers,
    avgPayment: totalReceived / data.length
  }
}

// Create a new payment (saves to both DB and Google Sheet)
export async function createPayment(payment: {
  contact_name: string
  payment_date: string
  payment_method?: string
  amount: number
  received_minus_fee?: number
  confirmed?: boolean
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabaseServerClient()
  
  // Find or create contact
  const normalizedName = payment.contact_name.toLowerCase().trim()
  
  let { data: existingContact } = await supabase
    .from('payment_contacts')
    .select('id')
    .eq('normalized_name', normalizedName)
    .single()

  let contactId = existingContact?.id

  if (!contactId) {
    const { data: newContact, error: contactError } = await supabase
      .from('payment_contacts')
      .insert({
        name: payment.contact_name.trim(),
        normalized_name: normalizedName
      })
      .select('id')
      .single()

    if (contactError) {
      return { success: false, error: contactError.message }
    }
    contactId = newContact.id
  }

  // Add to Google Sheet first to get row number
  const { addPaymentToSheet } = await import('./payments-sync')
  const sheetResult = await addPaymentToSheet({
    contact_name: payment.contact_name.trim(),
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
    amount: payment.amount,
    received_minus_fee: payment.received_minus_fee,
    confirmed: payment.confirmed
  })

  // Create payment in database
  const { error } = await supabase.from('payments').insert({
    contact_id: contactId,
    contact_name: payment.contact_name.trim(),
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
    amount: payment.amount,
    received_minus_fee: payment.received_minus_fee,
    confirmed: payment.confirmed ?? false,
    notes: payment.notes,
    sheet_row_number: sheetResult.row
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/payments')
  return { success: true }
}

// Wire Transfers
export async function getWireTransfers(): Promise<WireTransfer[]> {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('wire_transfers')
    .select('*')
    .order('transfer_date', { ascending: false })

  if (error) {
    console.error('Error fetching wire transfers:', error)
    return []
  }

  return data || []
}

export async function createWireTransfer(transfer: {
  amount: number
  transfer_date: string
  status?: string
  total_left_to_transfer?: number
  bank_reference?: string
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabaseServerClient()
  
  // Add to Google Sheet
  const { addWireTransferToSheet } = await import('./payments-sync')
  await addWireTransferToSheet({
    amount: transfer.amount,
    transfer_date: transfer.transfer_date,
    total_left_to_transfer: transfer.total_left_to_transfer,
    notes: transfer.notes
  })

  const { error } = await supabase.from('wire_transfers').insert({
    amount: transfer.amount,
    transfer_date: transfer.transfer_date,
    status: transfer.status || 'pending',
    total_left_to_transfer: transfer.total_left_to_transfer,
    bank_reference: transfer.bank_reference,
    notes: transfer.notes
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/payments')
  return { success: true }
}

export async function updateWireTransfer(
  id: string, 
  updates: Partial<WireTransfer>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabaseServerClient()
  
  // Get the current record to find the sheet row
  const { data: current } = await supabase
    .from('wire_transfers')
    .select('sheet_row_number')
    .eq('id', id)
    .single()
  
  // Update Google Sheet if we have a row number
  if (current?.sheet_row_number) {
    const { updateWireTransferInSheet } = await import('./payments-sync')
    await updateWireTransferInSheet(current.sheet_row_number, {
      amount: updates.amount,
      transfer_date: updates.transfer_date,
      total_left_to_transfer: updates.total_left_to_transfer ?? undefined
    })
  }

  const { error } = await supabase
    .from('wire_transfers')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/payments')
  return { success: true }
}

// Messages
export async function getMessages(): Promise<PaymentMessage[]> {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('payment_messages')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function sendMessage(message: {
  sender: 'johnny' | 'admin'
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabaseServerClient()
  
  // Add to Google Sheet first to get the row number
  const { addMessageToSheet } = await import('./payments-sync')
  const sheetResult = await addMessageToSheet(message.message, message.sender)

  const { error } = await supabase.from('payment_messages').insert({
    sender: message.sender,
    message: message.message,
    sheet_row_number: sheetResult.row
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/payments')
  return { success: true }
}

export async function markMessagesAsRead(sender: 'johnny' | 'admin'): Promise<void> {
  const supabase = await getSupabaseServerClient()
  
  await supabase
    .from('payment_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender', sender)
    .is('read_at', null)
}

// Get unread message count
export async function getUnreadMessageCount(fromSender: 'johnny' | 'admin'): Promise<number> {
  const supabase = await getSupabaseServerClient()
  
  const { count } = await supabase
    .from('payment_messages')
    .select('*', { count: 'exact', head: true })
    .eq('sender', fromSender)
    .is('read_at', null)

  return count || 0
}

// Wire transfer stats
export async function getWireTransferStats(): Promise<{
  totalSent: number
  pendingAmount: number
  completedCount: number
  pendingCount: number
}> {
  const supabase = await getSupabaseServerClient()
  
  const { data } = await supabase.from('wire_transfers').select('amount, status')

  if (!data) {
    return { totalSent: 0, pendingAmount: 0, completedCount: 0, pendingCount: 0 }
  }

  const completed = data.filter(t => t.status === 'completed')
  const pending = data.filter(t => t.status === 'pending')

  return {
    totalSent: completed.reduce((sum, t) => sum + (t.amount || 0), 0),
    pendingAmount: pending.reduce((sum, t) => sum + (t.amount || 0), 0),
    completedCount: completed.length,
    pendingCount: pending.length
  }
}

