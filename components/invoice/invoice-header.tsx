"use client"

import { motion } from "framer-motion"

interface InvoiceHeaderProps {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: "Draft" | "Due" | "Paid" | "Overdue"
}

export function InvoiceHeader({ invoiceNumber, issueDate, dueDate, status }: InvoiceHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-12 md:mb-16"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <p className="text-xs md:text-sm font-mono tracking-[0.3em] text-[#888888] uppercase mb-4">Invoice</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#f0f0f0]">{invoiceNumber}</h1>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="glass-button rounded-2xl px-5 py-3">
            <p className="text-xs font-mono tracking-widest text-[#888888] uppercase mb-1">Status</p>
            <p className="font-serif text-xl font-light text-[#f0f0f0]">{status}</p>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="font-mono text-xs tracking-widest text-[#888888] uppercase mb-1">Issued</p>
              <p className="text-[#f0f0f0]">{issueDate}</p>
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-[#888888] uppercase mb-1">Due</p>
              <p className="text-[#f0f0f0]">{dueDate}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
