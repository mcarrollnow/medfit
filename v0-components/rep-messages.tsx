"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Loader2 } from "lucide-react"
import { MessageThread } from "@/components/message-thread"
import { MessageInput } from "@/components/message-input"

interface RepMessagesProps {
  customerId: string
}

interface Rep {
  id: string
  name: string
  email: string
}

interface Message {
  id: string
  senderId: string
  senderType: "rep" | "customer"
  content: string
  timestamp: string
  isRead: boolean
}

export function RepMessages({ customerId }: RepMessagesProps) {
  const [loading, setLoading] = useState(true)
  const [rep, setRep] = useState<Rep | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    fetchCustomerAndMessages()
  }, [customerId])

  const fetchCustomerAndMessages = async () => {
    setLoading(true)
    try {
      // Fetch customer data to check for rep_id
      const customerResponse = await fetch(`/api/customers/${customerId}`)
      const customerData = await customerResponse.json()

      if (customerData.rep_id) {
        // Fetch rep info
        const repResponse = await fetch(`/api/reps/${customerData.rep_id}`)
        const repData = await repResponse.json()
        setRep(repData)

        // Fetch message history
        const messagesResponse = await fetch(`/api/messages?customerId=${customerId}&repId=${customerData.rep_id}`)
        const messagesData = await messagesResponse.json()
        setMessages(messagesData)
      } else {
        setRep(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Mock data for demo
      setRep({
        id: "rep-1",
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
      })
      setMessages([
        {
          id: "1",
          senderId: "rep-1",
          senderType: "rep",
          content: "Hi! I'm your dedicated sales representative. How can I help you today?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "2",
          senderId: customerId,
          senderType: "customer",
          content: "I have a question about my recent order.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "3",
          senderId: "rep-1",
          senderType: "rep",
          content: "Of course! I'd be happy to help. What's your order number?",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!rep) return

    try {
      // Send message via API
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          repId: rep.id,
          content,
          senderType: "customer",
        }),
      })

      // Refresh messages
      await fetchCustomerAndMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      // Mock: Add message locally for demo
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: customerId,
        senderType: "customer",
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
      }
      setMessages([...messages, newMessage])
    }
  }

  if (loading) {
    return (
      <div className="p-6 rounded-lg border-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
        </div>
        <div className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    )
  }

  if (!rep) {
    return (
      <div className="p-6 rounded-lg border-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          No sales representative assigned yet. A rep will be assigned to your account soon.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg border-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{rep.name}</div>
          <div className="text-xs text-muted-foreground">{rep.email}</div>
        </div>
      </div>

      <MessageThread messages={messages} currentUserType="customer" />

      <div className="mt-4">
        <MessageInput onSend={handleSendMessage} placeholder="Type your message to your rep..." />
      </div>
    </div>
  )
}
