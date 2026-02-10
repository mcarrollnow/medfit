"use client"

import { motion } from "framer-motion"

interface LineItem {
  id: number
  description: string
  details: string
  quantity: number
  rate: number
}

interface InvoiceLineItemsProps {
  items: LineItem[]
}

export function InvoiceLineItems({ items }: InvoiceLineItemsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-12 md:mb-16"
    >
      <p className="text-xs font-mono tracking-[0.3em] text-[#888888] uppercase mb-6">Services</p>

      {/* Header - Desktop */}
      <div className="hidden md:grid grid-cols-[1fr,80px,120px,120px] gap-4 pb-4 border-b border-border text-xs font-mono tracking-widest text-[#888888] uppercase">
        <div>Description</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Rate</div>
        <div className="text-right">Amount</div>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/5">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="py-6 md:py-8"
          >
            {/* Desktop */}
            <div className="hidden md:grid grid-cols-[1fr,80px,120px,120px] gap-4 items-start">
              <div>
                <h4 className="font-serif text-lg font-light mb-1 text-[#f0f0f0]">{item.description}</h4>
                <p className="text-sm text-[#888888]">{item.details}</p>
              </div>
              <div className="text-right font-mono text-[#999999]">{item.quantity}</div>
              <div className="text-right font-mono text-[#999999]">{formatCurrency(item.rate)}</div>
              <div className="text-right font-mono text-lg text-[#f0f0f0]">{formatCurrency(item.quantity * item.rate)}</div>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <h4 className="font-serif text-lg font-light mb-1 text-[#f0f0f0]">{item.description}</h4>
              <p className="text-sm text-[#888888] mb-4">{item.details}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-[#999999]">
                  {item.quantity} × {formatCurrency(item.rate)}
                </div>
                <div className="font-mono text-lg text-[#f0f0f0]">{formatCurrency(item.quantity * item.rate)}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
