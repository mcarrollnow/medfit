"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  Paperclip,
  Camera,
  Mic,
  Sun,
  Moon,
  Package,
  MessageSquare,
  User,
  ChevronRight,
  ChevronDown,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ChevronLeft,
} from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

export function CustomerDesktopInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"tickets" | "orders" | "profile">("tickets")
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)
  const [ticketView, setTicketView] = useState<"order" | "conversation">("order")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  // Mock data (same as mobile)
  const customerTickets = [
    {
      id: "TKT-001",
      subject: "Order delivery delayed",
      status: "open",
      priority: "high",
      date: "2 hours ago",
      order: {
        number: "ORD-12345",
        date: "Jan 15, 2025",
        total: 299.99,
        items: [
          { name: "Wireless Headphones", quantity: 1, price: 149.99 },
          { name: "Phone Case", quantity: 2, price: 75.0 },
        ],
        subtotal: 224.99,
        tax: 22.5,
        shipping: 52.5,
        payment: {
          method: "Credit Card",
          last4: "4242",
        },
        tracking: {
          carrier: "FedEx",
          number: "1234567890",
          status: "In Transit",
          estimatedDelivery: "Jan 20, 2025",
        },
        timeline: [
          { stage: "Order Placed", completed: true, date: "Jan 15, 10:30 AM" },
          { stage: "Order Approved", completed: true, date: "Jan 15, 10:35 AM" },
          { stage: "Payment Confirmed", completed: true, date: "Jan 15, 10:36 AM" },
          { stage: "Order Shipped", completed: true, date: "Jan 16, 2:00 PM" },
          { stage: "Out for Delivery", completed: false, date: "Estimated Jan 20" },
          { stage: "Delivered", completed: false, date: "Estimated Jan 20" },
        ],
      },
      conversation: [
        { sender: "customer", message: "My order is delayed. When will it arrive?", time: "2 hours ago" },
        { sender: "ai", message: "I apologize for the delay. Let me check your order status...", time: "2 hours ago" },
        {
          sender: "ai",
          message:
            "Your order is currently in transit and should arrive by Jan 20. Would you like me to contact the carrier?",
          time: "2 hours ago",
        },
      ],
    },
    {
      id: "TKT-002",
      subject: "Product question",
      status: "resolved",
      priority: "low",
      date: "1 day ago",
      order: null,
      conversation: [
        { sender: "customer", message: "Do the headphones support noise cancellation?", time: "1 day ago" },
        {
          sender: "ai",
          message: "Yes! The wireless headphones feature active noise cancellation with 3 modes.",
          time: "1 day ago",
        },
      ],
    },
  ]

  const customerOrders = [
    {
      id: "ORD-12345",
      date: "Jan 15, 2025",
      total: 299.99,
      status: "shipped",
      itemCount: 3,
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 149.99 },
        { name: "Phone Case", quantity: 2, price: 75.0 },
      ],
      subtotal: 224.99,
      tax: 22.5,
      shipping: 52.5,
      payment: {
        method: "Credit Card",
        last4: "4242",
      },
      tracking: {
        carrier: "FedEx",
        number: "1234567890",
        status: "In Transit",
        estimatedDelivery: "Jan 20, 2025",
      },
      timeline: [
        { stage: "Order Placed", completed: true, date: "Jan 15, 10:30 AM" },
        { stage: "Order Approved", completed: true, date: "Jan 15, 10:35 AM" },
        { stage: "Payment Confirmed", completed: true, date: "Jan 15, 10:36 AM" },
        { stage: "Order Shipped", completed: true, date: "Jan 16, 2:00 PM" },
        { stage: "Out for Delivery", completed: false, date: "Estimated Jan 20" },
        { stage: "Delivered", completed: false, date: "Estimated Jan 20" },
      ],
    },
    {
      id: "ORD-12344",
      date: "Jan 10, 2025",
      total: 89.99,
      status: "delivered",
      itemCount: 1,
      items: [{ name: "USB-C Cable", quantity: 1, price: 89.99 }],
      subtotal: 89.99,
      tax: 0,
      shipping: 0,
      payment: {
        method: "PayPal",
        last4: "N/A",
      },
      tracking: {
        carrier: "USPS",
        number: "9876543210",
        status: "Delivered",
        estimatedDelivery: "Jan 12, 2025",
      },
      timeline: [
        { stage: "Order Placed", completed: true, date: "Jan 10, 9:00 AM" },
        { stage: "Order Approved", completed: true, date: "Jan 10, 9:05 AM" },
        { stage: "Payment Confirmed", completed: true, date: "Jan 10, 9:06 AM" },
        { stage: "Order Shipped", completed: true, date: "Jan 10, 3:00 PM" },
        { stage: "Out for Delivery", completed: true, date: "Jan 12, 8:00 AM" },
        { stage: "Delivered", completed: true, date: "Jan 12, 2:30 PM" },
      ],
    },
  ]

  const customerProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    memberSince: "Jan 2024",
    totalOrders: 12,
    totalSpent: 1249.99,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "resolved":
        return "bg-green-500"
      case "shipped":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex h-screen bg-background pt-28">
      {/* Main Chat Interface */}
      <div className={`flex flex-1 flex-col ${sidebarOpen ? "max-w-[calc(100%-400px)]" : ""}`}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 border-b px-6 py-4 z-10 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                <Image
                  src={theme === "dark" ? "/eagle-white.svg" : "/eagle-black.svg"}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-semibold">Health Pro Support</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 mt-28">
          <div className="mx-auto max-w-3xl">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                <div className="relative h-32 w-32 opacity-20">
                  <Image
                    src={theme === "dark" ? "/eagle-white.svg" : "/eagle-black.svg"}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Welcome to Support</h2>
                  <p className="text-muted-foreground">How can we help you today?</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[600px] rounded-2xl px-6 py-4 ${
                        message.role === "user" ? "bg-foreground text-background" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-base leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t px-6 py-6">
          <div className="mx-auto max-w-3xl">
            {/* Hot Buttons */}
            <div className="mb-4 flex gap-3">
              <Button variant="outline" size="default" className="flex-1 bg-transparent">
                <Package className="mr-2 h-4 w-4" />
                Track Order
              </Button>
              <Button variant="outline" size="default" className="flex-1 bg-transparent">
                <Truck className="mr-2 h-4 w-4" />
                Return Item
              </Button>
              <Button variant="outline" size="default" className="flex-1 bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                Get Help
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="min-h-[100px] resize-none text-base"
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Camera className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button type="submit" size="default" disabled={!input.trim() || isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-[400px] border-l bg-background">
          {/* Sidebar Header */}
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">My Account</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "tickets" ? "border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "orders" ? "border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "profile" ? "border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile
            </button>
          </div>

          {/* Tab Content */}
          <div className="h-[calc(100vh-120px)] overflow-y-auto p-4">
            {/* My Tickets Tab */}
            {activeTab === "tickets" && (
              <div className="space-y-3">
                {customerTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <button
                      onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                      className="w-full p-4 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>{ticket.status}</Badge>
                            <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">{ticket.date}</p>
                        </div>
                        {expandedTicket === ticket.id ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {expandedTicket === ticket.id && ticket.order && (
                      <div className="border-t">
                        {/* Ticket Tabs */}
                        <div className="flex border-b">
                          <button
                            onClick={() => setTicketView("order")}
                            className={`flex-1 px-4 py-2 text-sm transition-colors ${
                              ticketView === "order"
                                ? "border-b-2 border-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Order Details
                          </button>
                          <button
                            onClick={() => setTicketView("conversation")}
                            className={`flex-1 px-4 py-2 text-sm transition-colors ${
                              ticketView === "conversation"
                                ? "border-b-2 border-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Conversation
                          </button>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto p-4">
                          {ticketView === "order" && (
                            <div className="space-y-4">
                              {/* Order Items */}
                              <div>
                                <h4 className="mb-2 text-sm font-semibold">Order Items</h4>
                                <div className="space-y-2">
                                  {ticket.order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span>
                                        {item.name} x{item.quantity}
                                      </span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                  <Separator />
                                  <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${ticket.order.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>${ticket.order.tax.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>${ticket.order.shipping.toFixed(2)}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${ticket.order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Info */}
                              <div>
                                <h4 className="mb-2 text-sm font-semibold">Payment</h4>
                                <p className="text-sm text-muted-foreground">
                                  {ticket.order.payment.method} ending in {ticket.order.payment.last4}
                                </p>
                              </div>

                              {/* Tracking */}
                              <div>
                                <h4 className="mb-2 text-sm font-semibold">Tracking</h4>
                                <div className="space-y-2 rounded-lg bg-muted p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{ticket.order.tracking.carrier}</span>
                                    <Badge>{ticket.order.tracking.status}</Badge>
                                  </div>
                                  <p className="font-mono text-xs">{ticket.order.tracking.number}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Est. Delivery: {ticket.order.tracking.estimatedDelivery}
                                  </p>
                                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    <Truck className="mr-2 h-3 w-3" />
                                    Track Package
                                  </Button>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div>
                                <h4 className="mb-3 text-sm font-semibold">Order Status</h4>
                                <div className="space-y-3">
                                  {ticket.order.timeline.map((stage, idx) => (
                                    <div key={idx} className="flex gap-3">
                                      <div className="flex flex-col items-center">
                                        <div
                                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                            stage.completed
                                              ? "bg-foreground text-background"
                                              : "bg-muted text-muted-foreground"
                                          }`}
                                        >
                                          {stage.completed ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                          ) : (
                                            <Clock className="h-4 w-4" />
                                          )}
                                        </div>
                                        {idx < ticket.order.timeline.length - 1 && (
                                          <div
                                            className={`h-8 w-0.5 transition-colors ${
                                              stage.completed ? "bg-foreground" : "bg-muted"
                                            }`}
                                          />
                                        )}
                                      </div>
                                      <div className="flex-1 pb-3">
                                        <p className="text-sm font-medium">{stage.stage}</p>
                                        <p className="text-xs text-muted-foreground">{stage.date}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {ticketView === "conversation" && (
                            <div className="space-y-3">
                              {ticket.conversation.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[280px] rounded-lg p-3 ${
                                      msg.sender === "customer" ? "bg-foreground text-background" : "bg-muted"
                                    }`}
                                  >
                                    <p className="text-sm">{msg.message}</p>
                                    <p className="mt-1 text-xs opacity-70">{msg.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-3">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-9" />
                </div>
                {customerOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full p-4 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{order.id}</span>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                          </div>
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.date} • {order.itemCount} items
                          </p>
                        </div>
                        {expandedOrder === order.id ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="border-t p-4">
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              ))}
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>${order.shipping.toFixed(2)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tracking */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Tracking</h4>
                            <div className="space-y-2 rounded-lg bg-muted p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{order.tracking.carrier}</span>
                                <Badge>{order.tracking.status}</Badge>
                              </div>
                              <p className="font-mono text-xs">{order.tracking.number}</p>
                              <p className="text-xs text-muted-foreground">
                                Est. Delivery: {order.tracking.estimatedDelivery}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Truck className="mr-2 h-3 w-3" />
                              Track
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <MessageSquare className="mr-2 h-3 w-3" />
                              Help
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
                        <User className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{customerProfile.name}</p>
                        <p className="text-sm text-muted-foreground">Member since {customerProfile.memberSince}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>{customerProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{customerProfile.phone}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="mb-4 font-semibold">Order Statistics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-3xl font-bold">{customerProfile.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">${customerProfile.totalSpent.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="mr-2 h-4 w-4" />
                    Manage Addresses
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 bg-transparent"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
