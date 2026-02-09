"use client"

import type { InvoiceData } from "@/lib/invoice-types"

interface EditorSettingsProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
}

export function EditorSettings({ data, onChange }: EditorSettingsProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-light text-foreground mb-8">Settings & Notes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tax Rate (%)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={(data.taxRate * 100).toFixed(2)}
              onChange={(e) => onChange({ ...data, taxRate: Number(e.target.value) / 100 })}
              className="w-24 bg-transparent border-b border-border py-2 text-foreground font-mono focus:outline-none focus:border-foreground transition-colors"
              min="0"
              max="100"
              step="0.01"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Notes / Terms
          </label>
          <textarea
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            placeholder="Payment terms, additional notes..."
            rows={3}
            className="w-full bg-transparent border border-border rounded-xl p-4 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  )
}
