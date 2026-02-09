"use client"

import type { InvoiceData } from "@/lib/invoice-types"

interface EditorHeaderProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
}

export function EditorHeader({ data, onChange }: EditorHeaderProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-light text-foreground mb-8">Invoice Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Invoice Number
          </label>
          <input
            type="text"
            value={data.invoiceNumber}
            onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground font-light focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Issue Date</label>
          <input
            type="text"
            value={data.issueDate}
            onChange={(e) => onChange({ ...data, issueDate: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground font-light focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Due Date</label>
          <input
            type="text"
            value={data.dueDate}
            onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground font-light focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Status</label>
          <select
            value={data.status}
            onChange={(e) => onChange({ ...data, status: e.target.value as InvoiceData["status"] })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground font-light focus:outline-none focus:border-foreground transition-colors cursor-pointer"
          >
            <option value="Draft" className="bg-background">
              Draft
            </option>
            <option value="Due" className="bg-background">
              Due
            </option>
            <option value="Paid" className="bg-background">
              Paid
            </option>
            <option value="Overdue" className="bg-background">
              Overdue
            </option>
          </select>
        </div>
      </div>
    </div>
  )
}
