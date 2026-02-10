"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SupportTicketFlow } from "./dashboard/support-ticket-flow"

interface SupportTicketDialogProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export function SupportTicketDialog({ isOpen, onClose, orderId }: SupportTicketDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background/90 border-border backdrop-blur-xl p-6 md:p-8">
        <SupportTicketFlow orderId={orderId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
