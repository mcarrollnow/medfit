"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FirstTimeDialogProps {
  open: boolean
  onResponse: (isFirstTime: boolean) => void
}

export function FirstTimeDialog({ open, onResponse }: FirstTimeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onResponse(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to Crypto Checkout</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Is this your first time using crypto to pay and need help getting set up?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
          <Button variant="outline" onClick={() => onResponse(false)} className="w-full sm:w-auto">
            No, I'm Ready to Pay
          </Button>
          <Button onClick={() => onResponse(true)} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Yes, Help Me Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
