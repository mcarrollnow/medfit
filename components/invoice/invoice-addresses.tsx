"use client"

import { motion } from "framer-motion"

interface Address {
  name: string
  attention?: string
  address: string
  city: string
  email: string
}

interface InvoiceAddressesProps {
  from: Address
  to: Address
}

export function InvoiceAddresses({ from, to }: InvoiceAddressesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 pb-12 md:pb-16 border-b border-border"
    >
      <div>
        <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-4">From</p>
        <h3 className="font-serif text-xl md:text-2xl font-light mb-3 text-[#f0f0f0]">{from.name}</h3>
        <div className="space-y-1 text-sm text-[#999999]">
          <p>{from.address}</p>
          <p>{from.city}</p>
          <p className="mt-2">{from.email}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-4">Bill To</p>
        <h3 className="font-serif text-xl md:text-2xl font-light mb-3 text-[#f0f0f0]">{to.name}</h3>
        <div className="space-y-1 text-sm text-[#999999]">
          {to.attention && <p className="italic">Attn: {to.attention}</p>}
          <p>{to.address}</p>
          <p>{to.city}</p>
          <p className="mt-2">{to.email}</p>
        </div>
      </div>
    </motion.div>
  )
}
