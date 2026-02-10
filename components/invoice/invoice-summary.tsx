"use client"

import { motion } from "framer-motion"

interface InvoiceSummaryProps {
  subtotal: number
  tax?: number
  discount?: number
  total: number
}

export function InvoiceSummary({ subtotal, tax = 0, discount = 0, total }: InvoiceSummaryProps) {
  console.log('[InvoiceSummary] Props received:', { subtotal, tax, discount, total })
  console.log('[InvoiceSummary] hasDiscount:', discount < 0)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const hasDiscount = discount < 0
  const originalTotal = subtotal + tax

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex justify-end mb-12 md:mb-16"
    >
      <div className="w-full md:w-80">
        <div className="space-y-4 pb-6 border-b border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#999999]">Subtotal</span>
            <span className="font-mono text-[#f0f0f0]">{formatCurrency(subtotal)}</span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#999999]">Tax</span>
              <span className="font-mono text-[#f0f0f0]">{formatCurrency(tax)}</span>
            </div>
          )}
          {hasDiscount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-400 font-medium">Discount</span>
              <span className="font-mono text-emerald-400">
                -{formatCurrency(Math.abs(discount))}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#999999]">Adjustment</span>
              <span className="font-mono text-[#f0f0f0]">+{formatCurrency(discount)}</span>
            </div>
          )}
        </div>

        <div className="pt-6">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs tracking-[0.3em] text-[#888888] uppercase">Total Due</span>
            <div className="text-right">
              {hasDiscount && (
                <span className="font-mono text-lg text-[#666666] line-through block mb-1">
                  {formatCurrency(originalTotal)}
                </span>
              )}
              <span className="font-serif text-3xl md:text-4xl font-light text-[#f0f0f0]">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
