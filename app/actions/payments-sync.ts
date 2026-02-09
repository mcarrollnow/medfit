"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { 
  getSheetData, 
  appendSheetRow, 
  updateSheetRowColumns,
  getSheetRowCount,
  getLastRowInColumns
} from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"

// Use the same spreadsheet as other syncs, sheet name from the CSV file
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || ""
const PAYMENT_SHEET = "payment" // This should match the tab name in your Google Sheet

// Column mappings based on the CSV structure
// A: Date (0), B: Name (1), C: Payment method (2), D: amount (3), 
// E: Received minus fee (4), F: Confirmed (5), G: Wire Transfer to Johnny (6),
// H: Date of wire (7), I: Total left to transfer (8), J: Cost of Tariff (9),
// K: Value (10), L: Questions From Michael (11), M: Answer from Johnny (12), N: Sum (13)

const COLUMNS = {
  DATE: 'A',
  NAME: 'B', 
  METHOD: 'C',
  AMOUNT: 'D',
  RECEIVED: 'E',
  CONFIRMED: 'F',
  WIRE_AMOUNT: 'G',
  WIRE_DATE: 'H',
  BALANCE: 'I',
  TARIFF: 'J',
  VALUE: 'K',
  QUESTION: 'L',
  ANSWER: 'M',
  SUM: 'N',
  MESSAGE_TIMESTAMP: 'O'
}

// Parse date in various formats
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null
  
  const clean = dateStr.toString().trim()
  
  // Handle formats like "2024.6.12" or "2024-6-12"
  const match1 = clean.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/)
  if (match1) {
    const [, year, month, day] = match1
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  
  // Handle "6.12" format (assume current year)
  const match2 = clean.match(/^(\d{1,2})[.\-/](\d{1,2})$/)
  if (match2) {
    const [, month, day] = match2
    const year = new Date().getFullYear()
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  
  return null
}

// Format date for sheet (YYYY.M.D format)
function formatDateForSheet(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}

// Parse amount (handle commas, dollar signs, etc)
function parseAmount(amountStr: string | number): number {
  if (typeof amountStr === 'number') return amountStr
  if (!amountStr) return 0
  
  const clean = amountStr.toString()
    .replace(/[$,]/g, '')
    .replace(/[^\d.-]/g, '')
    .trim()
  
  const num = parseFloat(clean)
  return isNaN(num) ? 0 : num
}

// Normalize name for matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
}

// Sync payments FROM Google Sheet to database
export async function syncPaymentsFromSheet(): Promise<{
  success: boolean
  synced: number
  contacts: number
  error?: string
}> {
  if (!SPREADSHEET_ID) {
    return { 
      success: false, 
      synced: 0, 
      contacts: 0, 
      error: 'GOOGLE_SHEET_ID environment variable not set' 
    }
  }

  const supabase = await getSupabaseServerClient()
  
  try {
    console.log('[PaymentSync] Fetching payment sheet from:', SPREADSHEET_ID, 'tab:', PAYMENT_SHEET)
    
    const rows = await getSheetData(SPREADSHEET_ID, PAYMENT_SHEET)
    
    if (!rows || rows.length < 1) {
      return { success: false, synced: 0, contacts: 0, error: 'No data in sheet' }
    }

    console.log('[PaymentSync] Processing', rows.length, 'rows')

    let syncedPayments = 0
    let syncedContacts = 0
    const contactMap = new Map<string, string>()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      
      // Get values by header names from the CSV
      const dateStr = row['Victoria Serralta']?.toString() || row['Date']?.toString() || ''
      const name = row['Name']?.toString()?.trim() || ''
      const method = row['Payment method']?.toString()?.trim() || ''
      const amountVal = row['amount']
      const receivedVal = row['Recieved (minus fee)']
      const confirmedStr = row['Confirmed？']?.toString()?.toLowerCase() || ''
      const wireNotes = row['Wire Transfer to Johnny']?.toString()?.trim() || ''
      
      if (!name || !amountVal) continue
      
      const paymentDate = parseDate(dateStr)
      if (!paymentDate) continue
      
      const amountNum = typeof amountVal === 'boolean' ? 0 : parseAmount(amountVal as string | number)
      if (amountNum <= 0) continue
      
      const receivedNum = receivedVal && typeof receivedVal !== 'boolean' 
        ? parseAmount(receivedVal as string | number) 
        : null
      const confirmed = confirmedStr === 'y' || confirmedStr === 'yes'
      
      // Check if wire column has notes (text that isn't a dollar amount)
      const wireAmount = parseAmount(wireNotes)
      const paymentNotes = (wireNotes && wireAmount <= 0) ? wireNotes : null
      
      // Find or create contact
      const normalizedName = normalizeName(name)
      let contactId: string | undefined = contactMap.get(normalizedName)
      
      if (!contactId) {
        const { data: existing } = await supabase
          .from('payment_contacts')
          .select('id')
          .eq('normalized_name', normalizedName)
          .single()
        
        if (existing) {
          contactId = existing.id
        } else {
          const { data: newContact, error: contactError } = await supabase
            .from('payment_contacts')
            .insert({
              name: name,
              normalized_name: normalizedName
            })
            .select('id')
            .single()
          
          if (contactError) continue
          contactId = newContact.id
          syncedContacts++
        }
        
        if (contactId) {
          contactMap.set(normalizedName, contactId)
        }
      }
      
      // Check if payment already exists
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('contact_id', contactId)
        .eq('payment_date', paymentDate)
        .eq('amount', amountNum)
        .single()
      
      if (existingPayment) {
        await supabase
          .from('payments')
          .update({
            payment_method: method || null,
            received_minus_fee: receivedNum,
            confirmed: confirmed,
            notes: paymentNotes,
            sheet_row_number: i + 2
          })
          .eq('id', existingPayment.id)
      } else {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            contact_id: contactId,
            contact_name: name,
            payment_date: paymentDate,
            payment_method: method || null,
            amount: amountNum,
            received_minus_fee: receivedNum,
            confirmed: confirmed,
            notes: paymentNotes,
            sheet_row_number: i + 2
          })
        
        if (!paymentError) syncedPayments++
      }
    }

    // Also sync wire transfers
    await syncWireTransfersFromSheet()
    
    // And messages
    await syncMessagesFromSheet()

    console.log('[PaymentSync] Synced', syncedPayments, 'payments,', syncedContacts, 'contacts')
    
    revalidatePath('/admin/payments')
    
    return { success: true, synced: syncedPayments, contacts: syncedContacts }
  } catch (error) {
    console.error('[PaymentSync] Error:', error)
    return {
      success: false,
      synced: 0,
      contacts: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Add a new payment to the Google Sheet
export async function addPaymentToSheet(payment: {
  contact_name: string
  payment_date: string
  payment_method?: string
  amount: number
  received_minus_fee?: number
  confirmed?: boolean
}): Promise<{ success: boolean; row?: number; error?: string }> {
  const values = [
    formatDateForSheet(payment.payment_date),
    payment.contact_name,
    payment.payment_method || '',
    payment.amount,
    payment.received_minus_fee || '',
    payment.confirmed ? 'y' : '',
    '', // Wire amount
    '', // Wire date
    '', // Balance
    '', // Tariff
    '', // Value
    '', // Question
    '', // Answer
    '' // Sum
  ]

  const result = await appendSheetRow(SPREADSHEET_ID, PAYMENT_SHEET, values)
  
  if (result.success) {
    revalidatePath('/admin/payments')
  }
  
  return result
}

// Parse transaction numbers from tariff column
function parseTransactionNumbers(tariffStr: string): string[] {
  if (!tariffStr) return []
  
  // Split by newlines, spaces, or commas
  const parts = tariffStr
    .split(/[\n\r,\s]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  // Filter to only keep numeric-looking transaction numbers (at least 6 digits)
  const numbers = parts.filter(s => /^\d{6,}$/.test(s))
  
  return numbers
}

// Sync wire transfers FROM sheet to database
export async function syncWireTransfersFromSheet(): Promise<{
  success: boolean
  synced: number
  error?: string
}> {
  const supabase = await getSupabaseServerClient()
  
  try {
    const rows = await getSheetData(SPREADSHEET_ID, PAYMENT_SHEET)
    
    if (!rows || rows.length < 1) {
      return { success: false, synced: 0, error: 'No data in sheet' }
    }

    let synced = 0
    const seenTransfers = new Set<string>()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      
      const wireAmountStr = row['Wire Transfer to Johnny']?.toString() || ''
      const wireDateStr = row['Date']?.toString() || '' // This might be in column H
      const balanceStr = row['Total left to transfer to Johnny']?.toString() || ''
      const tariffStr = row['Cost of Tariff']?.toString() || ''
      const tariffValueStr = row['Value']?.toString() || ''
      
      if (!wireAmountStr) continue
      
      const wireAmount = parseAmount(wireAmountStr)
      if (!wireAmount || wireAmount <= 0) continue
      
      // Try to parse the wire date from different possible sources
      let wireDate = parseDate(wireDateStr)
      if (!wireDate) {
        // Use current date as fallback
        wireDate = new Date().toISOString().split('T')[0]
      }
      
      const key = `${wireDate}-${wireAmount}`
      if (seenTransfers.has(key)) continue
      seenTransfers.add(key)
      
      // Parse transaction numbers from tariff column
      const transactionNumbers = parseTransactionNumbers(tariffStr)
      
      // Get non-numeric parts as tariff notes (like "DHL tariff")
      const tariffNotes = tariffStr
        .split(/[\n\r]+/)
        .filter(s => !/^\d+$/.test(s.trim()) && s.trim().length > 0)
        .join(', ')
      
      // Parse tariff cost from Value column
      const tariffCost = parseAmount(tariffValueStr) || null
      
      const { data: existing } = await supabase
        .from('wire_transfers')
        .select('id')
        .eq('transfer_date', wireDate)
        .eq('amount', wireAmount)
        .single()
      
      const balance = parseAmount(balanceStr) || null
      
      if (existing) {
        // Update existing record with transaction numbers and tariff info
        await supabase
          .from('wire_transfers')
          .update({
            transaction_numbers: transactionNumbers,
            tariff_cost: tariffCost,
            tariff_notes: tariffNotes || null,
            total_left_to_transfer: balance
          })
          .eq('id', existing.id)
      } else {
        const { error } = await supabase
          .from('wire_transfers')
          .insert({
            amount: wireAmount,
            transfer_date: wireDate,
            status: 'completed',
            total_left_to_transfer: balance,
            transaction_numbers: transactionNumbers,
            tariff_cost: tariffCost,
            tariff_notes: tariffNotes || null,
            sheet_row_number: i + 2
          })
        
        if (!error) synced++
      }
    }

    return { success: true, synced }
  } catch (error) {
    console.error('[WireSync] Error:', error)
    return {
      success: false,
      synced: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Add wire transfer to both database AND Google Sheet
export async function addWireTransferToSheet(transfer: {
  amount: number
  transfer_date: string
  total_left_to_transfer?: number
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  // Find the last row with data to append wire info
  const rowCount = await getSheetRowCount(SPREADSHEET_ID, PAYMENT_SHEET)
  const targetRow = rowCount + 1 // Append at the end
  
  const result = await updateSheetRowColumns(
    SPREADSHEET_ID,
    PAYMENT_SHEET,
    targetRow,
    [
      { column: COLUMNS.WIRE_AMOUNT, value: `$${transfer.amount.toLocaleString()}` },
      { column: COLUMNS.WIRE_DATE, value: formatDateForSheet(transfer.transfer_date) },
      { column: COLUMNS.BALANCE, value: transfer.total_left_to_transfer ? `$${transfer.total_left_to_transfer.toLocaleString()}` : '' }
    ]
  )
  
  return result
}

// Update wire transfer in a specific row
export async function updateWireTransferInSheet(
  rowNumber: number,
  updates: {
    amount?: number
    transfer_date?: string
    total_left_to_transfer?: number
  }
): Promise<{ success: boolean; error?: string }> {
  const columns: { column: string; value: string | number | boolean | null }[] = []
  
  if (updates.amount !== undefined) {
    columns.push({ column: COLUMNS.WIRE_AMOUNT, value: `$${updates.amount.toLocaleString()}` })
  }
  if (updates.transfer_date) {
    columns.push({ column: COLUMNS.WIRE_DATE, value: formatDateForSheet(updates.transfer_date) })
  }
  if (updates.total_left_to_transfer !== undefined) {
    columns.push({ column: COLUMNS.BALANCE, value: `$${updates.total_left_to_transfer.toLocaleString()}` })
  }
  
  if (columns.length === 0) {
    return { success: true }
  }
  
  return await updateSheetRowColumns(SPREADSHEET_ID, PAYMENT_SHEET, rowNumber, columns)
}

// Sync messages FROM sheet to database
export async function syncMessagesFromSheet(): Promise<{
  success: boolean
  synced: number
  error?: string
}> {
  const supabase = await getSupabaseServerClient()
  
  try {
    const rows = await getSheetData(SPREADSHEET_ID, PAYMENT_SHEET)
    
    if (!rows || rows.length < 1) {
      return { success: false, synced: 0, error: 'No data in sheet' }
    }

    let synced = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const sheetRowNumber = i + 2 // Account for 1-indexing and header row
      
      const question = row['Questions From Michael']?.toString()?.trim() || ''
      const answer = row['Answer from Johnny']?.toString()?.trim() || ''
      
      if (question) {
        // Check if this message already exists
        const { data: existing } = await supabase
          .from('payment_messages')
          .select('id')
          .eq('sender', 'admin')
          .eq('message', question)
          .single()
        
        if (!existing) {
          await supabase.from('payment_messages').insert({
            sender: 'admin',
            message: question,
            sheet_row_number: sheetRowNumber
          })
          synced++
        }
      }
      
      if (answer) {
        const { data: existing } = await supabase
          .from('payment_messages')
          .select('id')
          .eq('sender', 'johnny')
          .eq('message', answer)
          .single()
        
        if (!existing) {
          await supabase.from('payment_messages').insert({
            sender: 'johnny',
            message: answer,
            sheet_row_number: sheetRowNumber
          })
          synced++
        }
      }
    }

    return { success: true, synced }
  } catch (error) {
    console.error('[MessageSync] Error:', error)
    return {
      success: false,
      synced: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Format date-time for messages
function formatMessageTimestamp(): string {
  const now = new Date()
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Add a message to the Google Sheet
// Messages are added below the last row that has any message in columns L or M
// Timestamp goes in column O
export async function addMessageToSheet(
  message: string,
  sender: 'admin' | 'johnny'
): Promise<{ success: boolean; row?: number; error?: string }> {
  // Find the last row that has a message in column L (Questions from Michael) or M (Answer from Johnny)
  const lastMessageRow = await getLastRowInColumns(
    SPREADSHEET_ID, 
    PAYMENT_SHEET, 
    [COLUMNS.QUESTION, COLUMNS.ANSWER]
  )
  
  // Add the new message in the next row below
  const targetRow = lastMessageRow + 1
  
  // Admin messages go in column L (Questions From Michael)
  // Johnny messages go in column M (Answer from Johnny)
  const messageColumn = sender === 'admin' ? COLUMNS.QUESTION : COLUMNS.ANSWER
  
  // Get timestamp
  const timestamp = formatMessageTimestamp()
  
  console.log(`[MessageSync] Adding ${sender} message to row ${targetRow}, column ${messageColumn}, timestamp in column ${COLUMNS.MESSAGE_TIMESTAMP}`)
  
  // Write both the message and timestamp
  const result = await updateSheetRowColumns(
    SPREADSHEET_ID,
    PAYMENT_SHEET,
    targetRow,
    [
      { column: messageColumn, value: message },
      { column: COLUMNS.MESSAGE_TIMESTAMP, value: timestamp }
    ]
  )
  
  if (result.success) {
    return { success: true, row: targetRow }
  }
  
  return result
}

// Update payment confirmation status in the sheet
export async function updatePaymentConfirmationInSheet(
  rowNumber: number,
  confirmed: boolean
): Promise<{ success: boolean; error?: string }> {
  return await updateSheetRowColumns(
    SPREADSHEET_ID,
    PAYMENT_SHEET,
    rowNumber,
    [{ column: COLUMNS.CONFIRMED, value: confirmed ? 'y' : '' }]
  )
}
