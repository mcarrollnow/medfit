"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, CreditCard, AlertCircle, Lightbulb, HelpCircle, Package, Loader2 } from "lucide-react"

interface NewTicketFormProps {
  orders: Array<{ id: string; order_number: string }>
  onSubmit: (data: {
    subject: string
    message: string
    priority: string
    order_id?: string
  }) => Promise<void>
  onSuccess: () => void
  isSubmitting: boolean
}

const quickActions = [
  {
    label: "Account Security",
    icon: Lock,
    subject: "Account Security Issue",
    template: "I need help with my account security and login.",
  },
  {
    label: "Payment Problem",
    icon: CreditCard,
    subject: "Payment Issue",
    template: "I'm experiencing an issue with my payment.",
  },
  {
    label: "Order Issue",
    icon: AlertCircle,
    subject: "Order Problem",
    template: "I have a question or problem with my order.",
  },
  {
    label: "Product Question",
    icon: Lightbulb,
    subject: "Product Inquiry",
    template: "I have a question about a product.",
  },
  {
    label: "General Support",
    icon: HelpCircle,
    subject: "General Support Request",
    template: "I need general assistance.",
  },
  {
    label: "Shipping Question",
    icon: Package,
    subject: "Shipping Inquiry",
    template: "I have a question about shipping or delivery.",
  },
]

export function NewTicketForm({ orders, onSubmit, onSuccess, isSubmitting }: NewTicketFormProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("medium")
  const [orderId, setOrderId] = useState<string | undefined>(undefined)

  const handleQuickAction = (actionSubject: string, template: string) => {
    setSubject(actionSubject)
    setMessage(template)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.length < 20) return

    await onSubmit({
      subject,
      message,
      priority,
      order_id: orderId,
    })
    onSuccess()
  }

  const handleCancel = () => {
    setSubject("")
    setMessage("")
    setPriority("medium")
    setOrderId(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Select a common issue to get started quickly</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-3 bg-transparent"
                  onClick={() => handleQuickAction(action.subject, action.template)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Create Ticket Form Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Create Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Related Order (Optional)</Label>
              <Select value={orderId} onValueChange={setOrderId}>
                <SelectTrigger id="order" className="w-full">
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail (minimum 20 characters)"
                rows={6}
                required
                minLength={20}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{message.length}/20 characters minimum</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || message.length < 20}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Ticket
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
