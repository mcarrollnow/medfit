"use client"

import type { InvoiceData, InvoiceAddress } from "@/lib/invoice-types"

interface EditorAddressesProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
}

function AddressForm({
  label,
  address,
  onChange,
  showAttention = false,
}: {
  label: string
  address: InvoiceAddress
  onChange: (address: InvoiceAddress) => void
  showAttention?: boolean
}) {
  return (
    <div className="space-y-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>

      <div className="space-y-3">
        <input
          type="text"
          value={address.name}
          onChange={(e) => onChange({ ...address, name: e.target.value })}
          placeholder="Company / Name"
          className="w-full bg-transparent border-b border-border py-2 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
        />

        {showAttention && (
          <input
            type="text"
            value={address.attention || ""}
            onChange={(e) => onChange({ ...address, attention: e.target.value })}
            placeholder="Attention (optional)"
            className="w-full bg-transparent border-b border-border py-2 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
          />
        )}

        <input
          type="text"
          value={address.address}
          onChange={(e) => onChange({ ...address, address: e.target.value })}
          placeholder="Street Address"
          className="w-full bg-transparent border-b border-border py-2 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
        />

        <input
          type="text"
          value={address.city}
          onChange={(e) => onChange({ ...address, city: e.target.value })}
          placeholder="City, State ZIP"
          className="w-full bg-transparent border-b border-border py-2 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
        />

        <input
          type="email"
          value={address.email}
          onChange={(e) => onChange({ ...address, email: e.target.value })}
          placeholder="Email Address"
          className="w-full bg-transparent border-b border-border py-2 text-foreground font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
    </div>
  )
}

export function EditorAddresses({ data, onChange }: EditorAddressesProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-light text-foreground mb-8">Addresses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AddressForm label="From" address={data.from} onChange={(from) => onChange({ ...data, from })} />

        <AddressForm label="Bill To" address={data.to} onChange={(to) => onChange({ ...data, to })} showAttention />
      </div>
    </div>
  )
}
