"use client"

import { motion } from "framer-motion"

interface InvoiceFooterProps {
  notes?: string
}

export function InvoiceFooter({ notes }: InvoiceFooterProps) {
  if (!notes) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="pt-8 border-t border-white/10"
    >
      <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-4">Notes</p>
      <p className="text-sm text-[#999999] leading-relaxed max-w-xl">{notes}</p>
    </motion.div>
  )
}
