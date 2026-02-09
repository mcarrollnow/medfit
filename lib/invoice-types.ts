export interface InvoiceAddress {
  name: string
  attention?: string
  address: string
  city: string
  email: string
}

export interface InvoiceItem {
  id: number
  description: string
  details: string
  quantity: number
  rate: number
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: "Draft" | "Due" | "Paid" | "Overdue"
  from: InvoiceAddress
  to: InvoiceAddress
  items: InvoiceItem[]
  notes: string
  taxRate: number
  // Optional manual total - when set lower than subtotal, shows as discount
  manualTotal?: number | null
}
