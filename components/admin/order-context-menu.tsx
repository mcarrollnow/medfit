'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronRight, 
  Printer, 
  FileText, 
  Package, 
  Send, 
  Mail, 
  MessageSquare, 
  User, 
  RotateCcw, 
  Trash2, 
  Archive,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileDown
} from 'lucide-react'

interface OrderItem {
  product_name: string
  quantity: number
}

interface ContextMenuProps {
  x: number
  y: number
  order: {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    customer_id: string
    status: string
    payment_status: string
    total_amount: number
    item_count: number
    items?: OrderItem[]
  }
  onClose: () => void
  onUpdateStatus: (orderId: string, status: string) => void
  onPrint: (orderId: string, type: 'label' | 'packing_slip' | 'both') => void
  onSaveAsPdf: (orderId: string) => void
  onSendReminder: (orderId: string, method: 'email' | 'text') => void
  onViewCustomer: (customerId: string) => void
  onRefund: (orderId: string) => void
  onDelete: (orderId: string) => void
  onArchive: (orderId: string) => void
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-foreground/70' },
  { value: 'payment_requested', label: 'Payment Requested', icon: CreditCard, color: 'text-yellow-400' },
  { value: 'paid', label: 'Paid', icon: CheckCircle, color: 'text-emerald-400' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-400' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-400' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-muted-foreground' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-400' },
  { value: 'archived', label: 'Archived (Incomplete)', icon: AlertCircle, color: 'text-orange-400' },
]

export function OrderContextMenu({
  x,
  y,
  order,
  onClose,
  onUpdateStatus,
  onPrint,
  onSaveAsPdf,
  onSendReminder,
  onViewCustomer,
  onRefund,
  onDelete,
  onArchive,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [products, setProducts] = useState<OrderItem[]>(order.items || [])
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

  // Load products when hovering products menu item
  const handleLoadProducts = async () => {
    if (products.length === 0 && !loadingProducts) {
      setLoadingProducts(true)
      try {
        const response = await fetch(`/api/admin/orders/${order.id}`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setProducts(data.order_items || [])
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
  }

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
        <p className="font-semibold text-foreground text-sm">{order.order_number}</p>
        <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* Update Status - with submenu */}
        <div className="relative group">
          <button className={menuItemClass}>
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Update Status</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1">
              {ORDER_STATUSES.map((status) => {
                const StatusIcon = status.icon
                const isCurrentStatus = order.status === status.value
                return (
                  <button
                    key={status.value}
                    onClick={() => {
                      onUpdateStatus(order.id, status.value)
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

        {/* Print - with submenu */}
        <div className="relative group">
          <button className={menuItemClass}>
            <Printer className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Print</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1">
              <button
                onClick={() => { onPrint(order.id, 'label'); onClose() }}
                className={menuItemClass}
              >
                <FileText className="w-4 h-4" />
                <span>Print Shipping Label</span>
              </button>
              <button
                onClick={() => { onPrint(order.id, 'packing_slip'); onClose() }}
                className={menuItemClass}
              >
                <Package className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => { onPrint(order.id, 'both'); onClose() }}
                className={menuItemClass}
              >
                <Printer className="w-4 h-4" />
                <span>Print Both</span>
              </button>
            </div>
          </SubmenuWrapper>
        </div>

        {/* Save as PDF - direct action */}
        <button
          onClick={() => { onSaveAsPdf(order.id); onClose() }}
          className={menuItemClass}
        >
          <FileDown className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Save as PDF</span>
        </button>

        <div className="my-1 border-t border-border" />

        {/* Send Payment Reminder - with submenu */}
        <div className="relative group">
          <button className={menuItemClass}>
            <Send className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Send Payment Reminder</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1">
              <button
                onClick={() => { onSendReminder(order.id, 'email'); onClose() }}
                className={menuItemClass}
              >
                <Mail className="w-4 h-4" />
                <span>Send via Email</span>
              </button>
              <button
                onClick={() => { onSendReminder(order.id, 'text'); onClose() }}
                className={menuItemClass}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send via Text (SMS)</span>
              </button>
            </div>
          </SubmenuWrapper>
        </div>

        {/* View Customer Profile - direct action */}
        <button
          onClick={() => { onViewCustomer(order.customer_id); onClose() }}
          className={menuItemClass}
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">View Customer Profile</span>
        </button>

        <div className="my-1 border-t border-border" />

        {/* Show Products - with submenu */}
        <div className="relative group" onMouseEnter={handleLoadProducts}>
          <button className={menuItemClass}>
            <Package className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Show Products</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <SubmenuWrapper>
            <div className="py-1 max-h-[300px] overflow-y-auto">
              {loadingProducts ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
              ) : products.length > 0 ? (
                products.map((product, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2.5 flex items-center justify-between text-sm border-b border-border last:border-0"
                  >
                    <span className="text-foreground/80 flex-1 truncate pr-2">{product.product_name}</span>
                    <span className="text-muted-foreground font-mono text-xs bg-foreground/10 px-2 py-0.5 rounded">
                      ×{product.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">No products</div>
              )}
            </div>
          </SubmenuWrapper>
        </div>

        <div className="my-1 border-t border-border" />

        {/* Refund Order - direct action */}
        <button
          onClick={() => { onRefund(order.id); onClose() }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-orange-400 hover:bg-orange-500/10"
        >
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Refund Order</span>
        </button>

        {/* Archive Order - direct action */}
        <button
          onClick={() => { onArchive(order.id); onClose() }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-muted-foreground hover:bg-zinc-500/10"
        >
          <Archive className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Archive Order</span>
        </button>

        {/* Delete Order - direct action */}
        <button
          onClick={() => { onDelete(order.id); onClose() }}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Delete Order</span>
        </button>
      </div>
    </div>
  )
}
