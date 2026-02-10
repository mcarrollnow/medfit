'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  ChevronRight, 
  Eye,
  ExternalLink,
  Copy,
  Send,
  Mail, 
  MessageSquare, 
  Trash2, 
  Archive,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Ban,
  Printer,
  Edit3
} from 'lucide-react'

interface InvoiceItem {
  name?: string
  description?: string
  quantity: number
  unit_price: number
}

interface ContextMenuProps {
  x: number
  y: number
  invoice: {
    id: string
    invoice_number: string
    customer_name: string
    customer_email: string
    status: string
    total: number
    payment_url?: string
    items?: InvoiceItem[] | string
  }
  onClose: () => void
  onUpdateStatus: (invoiceId: string, status: string) => void
  onCopyLink: (paymentUrl: string) => void
  onOpenPaymentPage: (paymentUrl: string) => void
  onViewInvoice: (invoiceId: string) => void
  onSendReminder: (invoiceId: string, method: 'email' | 'text') => void
  onVoid: (invoiceId: string) => void
  onCancel: (invoiceId: string) => void
  onArchive: (invoiceId: string) => void
  onDelete: (invoiceId: string) => void
  onDuplicate: (invoiceId: string) => void
  onEdit: (invoiceId: string) => void
}

const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', icon: FileText, color: 'text-muted-foreground' },
  { value: 'sent', label: 'Sent', icon: Send, color: 'text-blue-400' },
  { value: 'paid', label: 'Paid', icon: CheckCircle, color: 'text-emerald-400' },
  { value: 'overdue', label: 'Overdue', icon: Clock, color: 'text-orange-400' },
  { value: 'void', label: 'Void', icon: Ban, color: 'text-red-400' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-400' },
  { value: 'archived', label: 'Archived', icon: Archive, color: 'text-zinc-500' },
]

export function InvoiceContextMenu({
  x,
  y,
  invoice,
  onClose,
  onUpdateStatus,
  onCopyLink,
  onOpenPaymentPage,
  onViewInvoice,
  onSendReminder,
  onVoid,
  onCancel,
  onArchive,
  onDelete,
  onDuplicate,
  onEdit,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Adjust position to stay in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const newX = x + rect.width > window.innerWidth ? x - rect.width : x
      const newY = y + rect.height > window.innerHeight ? y - rect.height : y
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) })
    }
  }, [x, y])

  // Parse items if they're a string
  const items: InvoiceItem[] = typeof invoice.items === 'string' 
    ? JSON.parse(invoice.items) 
    : invoice.items || []

  const menuItemClass = "w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-foreground/80 hover:bg-foreground/10 hover:text-foreground"
  
  // Submenu wrapper - includes invisible bridge for hover continuity
  const SubmenuWrapper = ({ children }: { children: React.ReactNode }) => (
    <>
      {/* Invisible bridge to prevent gap */}
      <div className="absolute left-full top-0 w-2 h-full hidden group-hover:block" />
      <div className="absolute left-full top-0 ml-1 min-w-[200px] rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden hidden group-hover:block z-[101]">
        {children}
      </div>
    </>
  )

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[220px] rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl"
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-foreground/[0.03]">
        <p className="font-semibold text-foreground text-sm">{invoice.invoice_number}</p>
        <p className="text-xs text-muted-foreground truncate">{invoice.customer_name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">${invoice.total.toLocaleString()}</p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* Edit Invoice - direct action (only if not paid) */}
        {invoice.status !== 'paid' && (
          <button
            onClick={() => { onEdit(invoice.id); onClose() }}
            className={menuItemClass}
          >
            <Edit3 className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Edit Invoice</span>
          </button>
        )}

        {/* View Invoice - direct action */}
        <button
          onClick={() => { onViewInvoice(invoice.id); onClose() }}
          className={menuItemClass}
        >
          <Eye className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">View Invoice</span>
        </button>

        {/* Payment URL actions - only show if payment_url exists */}
        {invoice.payment_url && (
          <>
            <button
              onClick={() => { onOpenPaymentPage(invoice.payment_url!); onClose() }}
              className={menuItemClass}
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">Open Payment Page</span>
            </button>
            <button
              onClick={() => { onCopyLink(invoice.payment_url!); onClose() }}
              className={menuItemClass}
            >
              <Copy className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">Copy Payment Link</span>
            </button>
          </>
        )}

        <div className="my-1 border-t border-border" />

        {/* Update Status - with submenu */}
        <div className="relative group">
          <button className={menuItemClass}>
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Update Status</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1">
              {INVOICE_STATUSES.map((status) => {
                const StatusIcon = status.icon
                const isCurrentStatus = invoice.status === status.value
                return (
                  <button
                    key={status.value}
                    onClick={() => {
                      onUpdateStatus(invoice.id, status.value)
                      onClose()
                    }}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors hover:bg-foreground/10 ${
                      isCurrentStatus ? 'bg-foreground/5' : ''
                    }`}
                  >
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`flex-1 text-left ${status.color}`}>{status.label}</span>
                    {isCurrentStatus && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                )
              })}
            </div>
          </SubmenuWrapper>
        </div>

        {/* Send Reminder - with submenu (only if not paid/void/cancelled) */}
        {invoice.status !== 'paid' && invoice.status !== 'void' && invoice.status !== 'cancelled' && (
          <div className="relative group">
            <button className={menuItemClass}>
              <Send className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">Send Reminder</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <SubmenuWrapper>
              <div className="py-1">
                <button
                  onClick={() => { onSendReminder(invoice.id, 'email'); onClose() }}
                  className={menuItemClass}
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email</span>
                </button>
                <button
                  onClick={() => { onSendReminder(invoice.id, 'text'); onClose() }}
                  className={menuItemClass}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via Text (SMS)</span>
                </button>
              </div>
            </SubmenuWrapper>
          </div>
        )}

        <div className="my-1 border-t border-border" />

        {/* Duplicate Invoice - direct action */}
        <button
          onClick={() => { onDuplicate(invoice.id); onClose() }}
          className={menuItemClass}
        >
          <Copy className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Duplicate Invoice</span>
        </button>

        {/* Print Invoice - direct action */}
        <button
          onClick={() => { window.open(`/invoice/${invoice.id}`, '_blank'); onClose() }}
          className={menuItemClass}
        >
          <Printer className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Print Invoice</span>
        </button>

        <div className="my-1 border-t border-border" />

        {/* Show Items - with submenu */}
        <div className="relative group">
          <button className={menuItemClass}>
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Show Items ({items.length})</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1 max-h-[300px] overflow-y-auto">
              {items.length > 0 ? (
                items.map((lineItem, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2.5 flex items-center justify-between text-sm border-b border-border last:border-0"
                  >
                    <span className="text-foreground/80 flex-1 truncate pr-2">{lineItem.name || lineItem.description || 'Item'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs bg-foreground/10 px-2 py-0.5 rounded">
                        ×{lineItem.quantity}
                      </span>
                      <span className="text-foreground/60 font-mono text-xs">
                        ${(lineItem.quantity * lineItem.unit_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">No items</div>
              )}
            </div>
          </SubmenuWrapper>
        </div>

        <div className="my-1 border-t border-border" />

        {/* Void Invoice - direct action (only if not paid/void) */}
        {invoice.status !== 'paid' && invoice.status !== 'void' && (
          <button
            onClick={() => { onVoid(invoice.id); onClose() }}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-orange-400 hover:bg-orange-500/10"
          >
            <Ban className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Void Invoice</span>
          </button>
        )}

        {/* Cancel Invoice - direct action (only if not paid/cancelled) */}
        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
          <button
            onClick={() => { onCancel(invoice.id); onClose() }}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-orange-400 hover:bg-orange-500/10"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Cancel Invoice</span>
          </button>
        )}

        {/* Archive Invoice - direct action */}
        <button
          onClick={() => { onArchive(invoice.id); onClose() }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-muted-foreground hover:bg-zinc-500/10"
        >
          <Archive className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Archive Invoice</span>
        </button>

        {/* Delete Invoice - direct action */}
        <button
          onClick={() => { onDelete(invoice.id); onClose() }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Delete Invoice</span>
        </button>
      </div>
    </div>
  )
}
