"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { InvoiceHeader } from "./invoice-header"
import { InvoiceAddresses } from "./invoice-addresses"
import { InvoiceLineItems } from "./invoice-line-items"
import { InvoiceSummary } from "./invoice-summary"
import { InvoiceFooter } from "./invoice-footer"
import type { InvoiceData } from "@/lib/invoice-types"
import { Pencil, Download, Printer } from "lucide-react"

interface InvoicePreviewProps {
  data: InvoiceData
  onEdit?: () => void
}

export function InvoicePreview({ data, onEdit }: InvoicePreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const tax = subtotal * data.taxRate
  const originalTotal = subtotal + tax
  
  // If manualTotal is set and different from original, calculate discount
  const hasManualTotal = data.manualTotal != null && data.manualTotal !== originalTotal
  const total = hasManualTotal ? data.manualTotal! : originalTotal
  const discount = hasManualTotal ? total - originalTotal : 0

  // Transform items to expected format
  const items = data.items.map(item => ({
    id: item.id,
    description: item.description,
    details: item.details,
    quantity: item.quantity,
    rate: item.rate,
  }))

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div ref={invoiceRef} className="print:bg-[#121212] print:p-8">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16">
          <InvoiceHeader
            invoiceNumber={data.invoiceNumber}
            issueDate={formatDate(data.issueDate)}
            dueDate={formatDate(data.dueDate)}
            status={data.status}
          />

          <InvoiceAddresses from={data.from} to={data.to} />

          <InvoiceLineItems items={items} />

          <InvoiceSummary subtotal={subtotal} tax={tax} discount={discount} total={total} />

          <InvoiceFooter notes={data.notes} />
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-4 mt-8 print:hidden"
      >
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer"
          >
            <Pencil className="w-5 h-5 text-[#f0f0f0]" />
            <span className="font-mono text-sm tracking-widest uppercase text-[#f0f0f0]">Edit</span>
          </button>
        )}

        <button
          onClick={handlePrint}
          className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer"
        >
          <Printer className="w-5 h-5 text-[#f0f0f0]" />
          <span className="font-mono text-sm tracking-widest uppercase text-[#f0f0f0]">Print</span>
        </button>
      </motion.div>
    </motion.div>
  )
}
