"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { InvoiceHeader } from "./invoice-header"
import { InvoiceAddresses } from "./invoice-addresses"
import { InvoiceLineItems } from "./invoice-line-items"
import { InvoiceSummary } from "./invoice-summary"
import { InvoiceFooter } from "./invoice-footer"
import { InvoiceActions } from "./invoice-actions"
import type { InvoiceData } from "@/lib/invoice-types"

interface InvoiceProps {
  data: InvoiceData
  onEdit?: () => void
}

export function Invoice({ data, onEdit }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const tax = subtotal * data.taxRate
  const originalTotal = subtotal + tax
  
  // If manualTotal is set and different from original, calculate discount
  const hasManualTotal = data.manualTotal != null && data.manualTotal !== originalTotal
  const total = hasManualTotal ? data.manualTotal! : originalTotal
  const discount = hasManualTotal ? total - originalTotal : 0

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div ref={invoiceRef} className="print:bg-card print:p-8">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16">
          <InvoiceHeader
            invoiceNumber={data.invoiceNumber}
            issueDate={data.issueDate}
            dueDate={data.dueDate}
            status={data.status}
          />

          <InvoiceAddresses from={data.from} to={data.to} />

          <InvoiceLineItems items={data.items} />

          <InvoiceSummary subtotal={subtotal} tax={tax} discount={discount} total={total} />

          <InvoiceFooter notes={data.notes} />
        </div>
      </div>

      <InvoiceActions onEdit={onEdit} invoiceRef={invoiceRef} invoiceNumber={data.invoiceNumber} />
    </motion.div>
  )
}
