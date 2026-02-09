"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  X,
  Ticket,
  History,
  Wrench,
  Plus,
  Search,
  DollarSign,
  Package,
  User,
  CreditCard,
  Truck,
  BarChart3,
  ChevronRight,
  Copy,
  Check,
  Calendar,
  Filter,
  ArrowLeft,
  ChevronDown,
  MessageSquare,
  Clock,
  UserCircle,
  ShoppingBag,
  FileText,
  Send,
  Bot,
  Shield,
  MapPin,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = "tickets" | "history" | "tools"
type ToolView = "list" | "discount" | "order" | "customer" | "refund" | "shipping" | "analytics"
type TicketTabType = "order-details" | "conversation" | "profile" | "resolve"
type ConversationSubTab = "full" | "admin-only"

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tickets")
  const [activeToolView, setActiveToolView] = useState<ToolView>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)
  const [activeTicketTab, setActiveTicketTab] = useState<TicketTabType>("order-details")
  const [activeConversationTab, setActiveConversationTab] = useState<ConversationSubTab>("full")
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false)
  const [showAssignAIModal, setShowAssignAIModal] = useState(false)
  const [requestInfoMessage, setRequestInfoMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const tabs = [
    { id: "tickets" as TabType, label: "Tickets", icon: Ticket },
    { id: "history" as TabType, label: "History", icon: History },
    { id: "tools" as TabType, label: "Tools", icon: Wrench },
  ]

  const getRotatingTabs = (activeView: TicketTabType) => {
    const allTabs = [
      { id: "order-details" as TicketTabType, label: "Order Details", icon: Package },
      { id: "conversation" as TicketTabType, label: "Conversation", icon: MessageSquare },
      { id: "profile" as TicketTabType, label: "Customer Profile", icon: UserCircle },
      { id: "resolve" as TicketTabType, label: "Resolve", icon: Check },
    ]

    // Return all tabs except the active one
    return allTabs.filter((tab) => tab.id !== activeView)
  }

  const tickets = [
    {
      id: "1",
      title: "Order #12345 Issue",
      status: "open",
      customer: "John Doe",
      email: "john.doe@example.com",
      lastMessage: "Customer waiting for response about delayed shipment",
      time: "2m ago",
      priority: "high",
      description:
        "Customer ordered a product 5 days ago and hasn't received any shipping updates. They're concerned about the delivery timeline and want to know the current status of their order.",
      orderDetails: {
        orderNumber: "#12345",
        orderDate: "Jan 15, 2025",
        total: "$125.99",
        items: [
          { name: "Blue Widget", quantity: 2, price: "$45.99" },
          { name: "Red Gadget", quantity: 1, price: "$34.01" },
        ],
        subtotal: "$125.99",
        shipping: "$0.00",
        tax: "$0.00",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        trackingNumber: "1Z999AA10123456784",
        timeline: [
          { status: "Order Placed", date: "Jan 15, 2025", time: "10:30 AM", completed: true },
          { status: "Order Approved", date: "Jan 15, 2025", time: "11:15 AM", completed: true },
          { status: "Payment Made", date: "Jan 15, 2025", time: "11:20 AM", completed: true },
          { status: "Order Shipped", date: "Jan 16, 2025", time: "2:45 PM", completed: true },
          { status: "Order Delivered", date: "Pending", time: "ETA: Jan 20", completed: false },
        ],
      },
      fullConversation: [
        {
          date: "Jan 15, 2025",
          messages: [
            {
              sender: "customer",
              senderName: "John Doe",
              text: "Hi, I just placed order #12345. When will it ship?",
              time: "10:30 AM",
            },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "Thank you for your order! Your order is being processed and should ship within 1-2 business days. You'll receive a tracking number via email.",
              time: "10:32 AM",
            },
            { sender: "customer", senderName: "John Doe", text: "Great, thank you!", time: "10:35 AM" },
          ],
        },
        {
          date: "Jan 18, 2025",
          messages: [
            {
              sender: "customer",
              senderName: "John Doe",
              text: "I still haven't received any shipping updates. It's been 3 days.",
              time: "2:15 PM",
            },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "I apologize for the delay. Let me check on your order status for you.",
              time: "2:17 PM",
            },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "I see there was a delay in our warehouse. Your order is now being prepared for shipment and should go out today.",
              time: "2:18 PM",
            },
            {
              sender: "customer",
              senderName: "John Doe",
              text: "Okay, but I'm getting concerned. I need this by next week.",
              time: "2:20 PM",
            },
          ],
        },
        {
          date: "Today",
          messages: [
            {
              sender: "customer",
              senderName: "John Doe",
              text: "I haven't received any updates on my order",
              time: "10m ago",
            },
            { sender: "admin", senderName: "Support Agent", text: "Let me check the status for you", time: "8m ago" },
            { sender: "customer", senderName: "John Doe", text: "Thank you, I'm getting worried", time: "2m ago" },
          ],
        },
      ],
      adminOnlyConversation: [
        {
          date: "Jan 18, 2025",
          messages: [
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "Flagging this ticket - customer is getting frustrated about shipping delays. Warehouse confirmed delay but item should ship today.",
              time: "2:19 PM",
            },
            {
              sender: "admin",
              senderName: "Support Manager",
              text: "Thanks for the heads up. I'll monitor this one closely.",
              time: "2:25 PM",
            },
          ],
        },
        {
          date: "Today",
          messages: [
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "Customer has reached out again. Still no tracking update in system. Recommend escalating to warehouse manager.",
              time: "15m ago",
            },
            {
              sender: "admin",
              senderName: "Support Agent",
              text: "On it. Contacting warehouse now.",
              time: "10m ago",
            },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "Sentiment analysis shows customer frustration level is high. Consider offering discount code as goodwill gesture.",
              time: "5m ago",
            },
          ],
        },
      ],
      customerProfile: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        customerSince: "Jan 2024",
        totalOrders: 12,
        totalSpent: "$1,245.99",
        averageOrderValue: "$103.83",
        lastOrderDate: "Jan 15, 2025",
        orderHistory: [
          {
            orderNumber: "#12345",
            date: "Jan 15, 2025",
            total: "$125.99",
            status: "Processing",
            items: [
              { name: "Blue Widget", quantity: 2, price: "$45.99" },
              { name: "Red Gadget", quantity: 1, price: "$34.01" },
            ],
            subtotal: "$125.99",
            shipping: "$0.00",
            tax: "$0.00",
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            trackingNumber: "1Z999AA10123456784",
            timeline: [
              { status: "Order Placed", date: "Jan 15, 2025", time: "10:30 AM", completed: true },
              { status: "Order Approved", date: "Jan 15, 2025", time: "11:15 AM", completed: true },
              { status: "Payment Made", date: "Jan 15, 2025", time: "11:20 AM", completed: true },
              { status: "Order Shipped", date: "Jan 16, 2025", time: "2:45 PM", completed: true },
              { status: "Order Delivered", date: "Pending", time: "ETA: Jan 20", completed: false },
            ],
          },
          {
            orderNumber: "#12289",
            date: "Dec 28, 2024",
            total: "$89.50",
            status: "Delivered",
            items: [{ name: "Green Gadget", quantity: 1, price: "$89.50" }],
            subtotal: "$89.50",
            shipping: "$0.00",
            tax: "$0.00",
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            trackingNumber: "1Z999AA10123456790",
            timeline: [
              { status: "Order Placed", date: "Dec 28, 2024", time: "2:00 PM", completed: true },
              { status: "Order Approved", date: "Dec 28, 2024", time: "2:30 PM", completed: true },
              { status: "Payment Made", date: "Dec 28, 2024", time: "2:35 PM", completed: true },
              { status: "Order Shipped", date: "Dec 29, 2024", time: "10:00 AM", completed: true },
              { status: "Order Delivered", date: "Jan 2, 2025", time: "3:45 PM", completed: true },
            ],
          },
          {
            orderNumber: "#12156",
            date: "Dec 10, 2024",
            total: "$210.00",
            status: "Delivered",
            items: [
              { name: "Premium Headphones", quantity: 1, price: "$150.00" },
              { name: "Carrying Case", quantity: 1, price: "$60.00" },
            ],
            subtotal: "$210.00",
            shipping: "$0.00",
            tax: "$0.00",
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            trackingNumber: "1Z999AA10123456791",
            timeline: [
              { status: "Order Placed", date: "Dec 10, 2024", time: "11:00 AM", completed: true },
              { status: "Order Approved", date: "Dec 10, 2024", time: "11:30 AM", completed: true },
              { status: "Payment Made", date: "Dec 10, 2024", time: "11:35 AM", completed: true },
              { status: "Order Shipped", date: "Dec 11, 2024", time: "9:00 AM", completed: true },
              { status: "Order Delivered", date: "Dec 14, 2024", time: "2:15 PM", completed: true },
            ],
          },
          {
            orderNumber: "#11987",
            date: "Nov 22, 2024",
            total: "$156.75",
            status: "Delivered",
            items: [{ name: "Smart Watch", quantity: 1, price: "$156.75" }],
            subtotal: "$156.75",
            shipping: "$0.00",
            tax: "$0.00",
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            trackingNumber: "1Z999AA10123456792",
            timeline: [
              { status: "Order Placed", date: "Nov 22, 2024", time: "4:00 PM", completed: true },
              { status: "Order Approved", date: "Nov 22, 2024", time: "4:30 PM", completed: true },
              { status: "Payment Made", date: "Nov 22, 2024", time: "4:35 PM", completed: true },
              { status: "Order Shipped", date: "Nov 23, 2024", time: "8:00 AM", completed: true },
              { status: "Order Delivered", date: "Nov 26, 2024", time: "1:30 PM", completed: true },
            ],
          },
        ],
        adminNotes: [
          { date: "Jan 10, 2025", author: "Admin", note: "Customer prefers email communication" },
          { date: "Dec 15, 2024", author: "Support", note: "Resolved shipping issue quickly, very satisfied" },
        ],
      },
      messages: [
        { sender: "customer", text: "I haven't received any updates on my order", time: "10m ago" },
        { sender: "agent", text: "Let me check the status for you", time: "8m ago" },
        { sender: "customer", text: "Thank you, I'm getting worried", time: "2m ago" },
      ],
    },
    {
      id: "2",
      title: "Refund Request - Order #12340",
      status: "pending",
      customer: "Jane Smith",
      email: "jane.smith@example.com",
      lastMessage: "Processing refund for damaged item",
      time: "15m ago",
      priority: "medium",
      description:
        "Customer received a damaged item and is requesting a full refund. They've provided photos of the damage and want to know the refund timeline.",
      orderDetails: {
        orderNumber: "#12340",
        orderDate: "Jan 12, 2025",
        total: "$89.50",
        items: [{ name: "Glass Vase", quantity: 1, price: "$89.50" }],
        subtotal: "$89.50",
        shipping: "$0.00",
        tax: "$0.00",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // Placeholder
        trackingNumber: "1Z999AA10123456785", // Placeholder
        timeline: [
          { status: "Order Placed", date: "Jan 12, 2025", time: "9:00 AM", completed: true },
          { status: "Order Approved", date: "Jan 12, 2025", time: "9:30 AM", completed: true },
          { status: "Payment Made", date: "Jan 12, 2025", time: "9:35 AM", completed: true },
          { status: "Refund Processed", date: "Jan 14, 2025", time: "2:00 PM", completed: true },
        ],
      },
      fullConversation: [
        {
          date: "Jan 14, 2025",
          messages: [
            { sender: "customer", senderName: "Jane Smith", text: "The vase arrived broken", time: "1h ago" },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "I'm sorry to hear that. Can you send photos?",
              time: "45m ago",
            },
            { sender: "customer", senderName: "Jane Smith", text: "Here are the photos [attached]", time: "30m ago" },
            { sender: "admin", senderName: "Support Agent", text: "Processing your refund now", time: "15m ago" },
          ],
        },
      ],
      customerProfile: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        customerSince: "Mar 2024",
        totalOrders: 8,
        totalSpent: "$687.25",
        averageOrderValue: "$85.91",
        lastOrderDate: "Jan 12, 2025",
        orderHistory: [
          { orderNumber: "#12340", date: "Jan 12, 2025", total: "$89.50", status: "Refund Pending" },
          { orderNumber: "#12201", date: "Dec 20, 2024", total: "$145.00", status: "Delivered" },
        ],
        adminNotes: [
          { date: "Dec 22, 2024", author: "Support", note: "Very understanding customer, easy to work with" },
        ],
      },
      messages: [
        { sender: "customer", text: "The vase arrived broken", time: "1h ago" },
        { sender: "agent", text: "I'm sorry to hear that. Can you send photos?", time: "45m ago" },
        { sender: "customer", text: "Here are the photos [attached]", time: "30m ago" },
        { sender: "agent", text: "Processing your refund now", time: "15m ago" },
      ],
    },
    {
      id: "3",
      title: "Product Question - SKU #789",
      status: "resolved",
      customer: "Mike Johnson",
      email: "mike.j@example.com",
      lastMessage: "Issue resolved - provided product specifications",
      time: "1h ago",
      priority: "low",
      description: "Customer had questions about product specifications and compatibility with their existing setup.",
      orderDetails: null, // No specific order linked for this ticket
      fullConversation: [
        {
          date: "Today",
          messages: [
            { sender: "customer", senderName: "Mike Johnson", text: "Does this work with Model X?", time: "2h ago" },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "Yes, it's fully compatible with Model X",
              time: "1h 30m ago",
            },
            { sender: "customer", senderName: "Mike Johnson", text: "Perfect, thank you!", time: "1h ago" },
          ],
        },
      ],
      customerProfile: {
        name: "Mike Johnson",
        email: "mike.j@example.com",
        phone: "+1 (555) 345-6789",
        customerSince: "Jun 2023",
        totalOrders: 24,
        totalSpent: "$2,456.80",
        averageOrderValue: "$102.37",
        lastOrderDate: "Jan 10, 2025",
        orderHistory: [
          { orderNumber: "#12298", date: "Jan 10, 2025", total: "$156.00", status: "Delivered" },
          { orderNumber: "#12187", date: "Dec 18, 2024", total: "$98.50", status: "Delivered" },
        ],
        adminNotes: [{ date: "Nov 5, 2024", author: "Admin", note: "VIP customer - frequent buyer, always satisfied" }],
      },
      messages: [
        { sender: "customer", text: "Does this work with Model X?", time: "2h ago" },
        { sender: "agent", text: "Yes, it's fully compatible with Model X", time: "1h 30m ago" },
        { sender: "customer", text: "Perfect, thank you!", time: "1h ago" },
      ],
    },
    {
      id: "4",
      title: "Shipping Address Change",
      status: "open",
      customer: "Sarah Williams",
      email: "sarah.w@example.com",
      lastMessage: "Need to update delivery address before shipment",
      time: "3h ago",
      priority: "high",
      description: "Customer needs to change their shipping address urgently before the order ships out.",
      orderDetails: {
        orderNumber: "#12346",
        orderDate: "Jan 16, 2025",
        total: "$210.00",
        items: [
          { name: "Premium Headphones", quantity: 1, price: "$150.00" },
          { name: "Carrying Case", quantity: 1, price: "$60.00" },
        ],
        subtotal: "$210.00",
        shipping: "$0.00",
        tax: "$0.00",
        walletAddress: "0xabc...", // Placeholder
        trackingNumber: "Not Yet Assigned",
        timeline: [
          { status: "Order Placed", date: "Jan 16, 2025", time: "11:00 AM", completed: true },
          { status: "Order Approved", date: "Jan 16, 2025", time: "11:30 AM", completed: true },
          { status: "Payment Made", date: "Jan 16, 2025", time: "11:35 AM", completed: true },
          { status: "Awaiting Shipment", date: "Jan 16, 2025", time: "3:00 PM", completed: false },
        ],
      },
      fullConversation: [
        {
          date: "Today",
          messages: [
            {
              sender: "customer",
              senderName: "Sarah Williams",
              text: "I need to change my shipping address!",
              time: "3h ago",
            },
            {
              sender: "ai",
              senderName: "AI Assistant",
              text: "I can help with that. What's the new address?",
              time: "2h 45m ago",
            },
            {
              sender: "customer",
              senderName: "Sarah Williams",
              text: "123 New Street, Boston, MA 02101",
              time: "2h 30m ago",
            },
            {
              sender: "admin",
              senderName: "Support Agent",
              text: "Address updated. Your order will ship to the new address.",
              time: "1h ago",
            },
          ],
        },
      ],
      customerProfile: {
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        phone: "+1 (555) 456-7890",
        customerSince: "Sep 2024",
        totalOrders: 5,
        totalSpent: "$542.30",
        averageOrderValue: "$108.46",
        lastOrderDate: "Jan 16, 2025",
        orderHistory: [
          { orderNumber: "#12346", date: "Jan 16, 2025", total: "$210.00", status: "Processing" },
          { orderNumber: "#12234", date: "Dec 30, 2024", total: "$125.50", status: "Delivered" },
        ],
        adminNotes: [],
      },
      messages: [
        { sender: "customer", text: "I need to change my shipping address!", time: "3h ago" },
        { sender: "agent", text: "I can help with that. What's the new address?", time: "2h 45m ago" },
        { sender: "customer", text: "123 New Street, Boston, MA 02101", time: "2h 30m ago" },
      ],
    },
  ]

  const conversations = [
    {
      id: "1",
      title: "Order Tracking Inquiry",
      customer: "John Doe",
      preview: "How can I track my order? I haven't received any updates.",
      time: "Today, 2:30 PM",
      messageCount: 8,
    },
    {
      id: "2",
      title: "Shipping Options Question",
      customer: "Emily Brown",
      preview: "What are the available shipping options for international orders?",
      time: "Today, 1:15 PM",
      messageCount: 5,
    },
    {
      id: "3",
      title: "Return Request",
      customer: "Mike Johnson",
      preview: "I need to return an item that doesn't fit properly.",
      time: "Yesterday, 4:20 PM",
      messageCount: 12,
    },
    {
      id: "4",
      title: "Product Availability",
      customer: "Sarah Williams",
      preview: "When will the blue variant be back in stock?",
      time: "Yesterday, 2:10 PM",
      messageCount: 3,
    },
    {
      id: "5",
      title: "Payment Issue",
      customer: "David Lee",
      preview: "My payment was declined but I was still charged.",
      time: "2 days ago",
      messageCount: 15,
    },
  ]

  const handleGenerateDiscount = () => {
    const code = `SAVE${Math.floor(Math.random() * 90 + 10)}`
    setGeneratedCode(code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleRequestMoreInfo = async () => {
    setIsProcessing(true)
    console.log("[v0] Requesting more info from customer:", requestInfoMessage)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update ticket status (in real app, this would update the database)
    console.log("[v0] Ticket status updated to 'Waiting on Customer'")

    setIsProcessing(false)
    setShowRequestInfoModal(false)
    setRequestInfoMessage("")

    // Show success feedback
    alert("Request sent to customer successfully!")
  }

  const handleAssignToAI = async () => {
    setIsProcessing(true)
    console.log("[v0] Assigning ticket to AI agent")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update ticket assignment (in real app, this would update the database)
    console.log("[v0] Ticket assigned to AI agent successfully")

    setIsProcessing(false)
    setShowAssignAIModal(false)

    // Show success feedback
    alert("Ticket assigned to AI agent successfully!")
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleTicket = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId)
    if (expandedTicketId !== ticketId) {
      setActiveTicketTab("order-details")
      setActiveConversationTab("full")
      setExpandedOrderId(null)
    }
  }

  const toggleOrderExpansion = (orderNumber: string) => {
    setExpandedOrderId(expandedOrderId === orderNumber ? null : orderNumber)
  }

  const renderOrderDetails = (orderDetails: any) => (
    <div className="space-y-4 mt-4">
      {/* Order Header */}
      <Card className="p-4 bg-background">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Order Number</span>
          <span className="text-sm font-mono font-semibold text-foreground">{orderDetails.orderNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Order Date</span>
          <span className="text-sm text-foreground">{orderDetails.date}</span>
        </div>
      </Card>

      {/* Itemized Receipt */}
      <div>
        <h6 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Items
        </h6>
        <Card className="p-4 bg-background space-y-3">
          {orderDetails.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.price}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{orderDetails.subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">{orderDetails.shipping}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">{orderDetails.tax}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-sm font-bold text-foreground">{orderDetails.total}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Crypto Wallet */}
      <Card className="p-4 bg-background">
        <h6 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Wallet
        </h6>
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs font-mono text-muted-foreground break-all">{orderDetails.walletAddress}</code>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Order Timeline */}
      <div>
        <h6 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Order Timeline
        </h6>
        <Card className="p-4 bg-background">
          <div className="space-y-4">
            {orderDetails.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      step.completed ? "bg-green-500" : "bg-muted",
                    )}
                  >
                    {step.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  {idx < orderDetails.timeline.length - 1 && (
                    <div className={cn("w-0.5 h-8 mt-1", step.completed ? "bg-green-500" : "bg-muted")} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p
                    className={cn("text-sm font-medium", step.completed ? "text-foreground" : "text-muted-foreground")}
                  >
                    {step.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.date} {step.time && `• ${step.time}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tracking Info */}
      <Card className="p-4 bg-background">
        <h6 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Tracking Information
        </h6>
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs font-mono text-muted-foreground">{orderDetails.trackingNumber}</code>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
          <MapPin className="w-3 h-3 mr-2" />
          Track Package
        </Button>
      </Card>
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-50 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {activeToolView !== "list" ? (
            <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => setActiveToolView("list")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
          ) : (
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          )}
          <Button variant="ghost" size="icon" className="h-11 w-11" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Tabs - only show when in list view */}
        {activeToolView === "list" && (
          <div className="flex border-b border-border bg-card">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tickets Tab */}
          {activeTab === "tickets" && activeToolView === "list" && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Support Tickets</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tickets.length} active tickets</p>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New
                </Button>
              </div>

              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="w-3 h-3" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Open
                </Button>
                <Button variant="outline" size="sm">
                  Pending
                </Button>
              </div>

              {tickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  {/* Collapsed View */}
                  <div
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => toggleTicket(ticket.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-foreground">{ticket.title}</h4>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              ticket.priority === "high" && "bg-red-500/10 text-red-500",
                              ticket.priority === "medium" && "bg-yellow-500/10 text-yellow-500",
                              ticket.priority === "low" && "bg-blue-500/10 text-blue-500",
                            )}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{ticket.customer}</p>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full whitespace-nowrap",
                          ticket.status === "open" && "bg-green-500/10 text-green-500",
                          ticket.status === "pending" && "bg-yellow-500/10 text-yellow-500",
                          ticket.status === "resolved" && "bg-gray-500/10 text-gray-500",
                        )}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{ticket.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{ticket.time}</p>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedTicketId === ticket.id && "rotate-180",
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedTicketId === ticket.id && (
                    <div className="border-t border-border bg-muted/30">
                      <div className="flex border-b border-border bg-card">
                        {getRotatingTabs(activeTicketTab).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTicketTab(tab.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-4">
                        {activeTicketTab === "order-details" && ticket.orderDetails && (
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-foreground">Order Details</h5>
                            {renderOrderDetails(ticket.orderDetails)}
                          </div>
                        )}

                        {/* Conversation Tab */}
                        {activeTicketTab === "conversation" && (
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-foreground">Conversation</h5>

                            <div className="flex gap-2 border-b border-border">
                              <button
                                onClick={() => setActiveConversationTab("full")}
                                className={cn(
                                  "flex-1 py-2 text-xs font-medium transition-colors",
                                  activeConversationTab === "full"
                                    ? "text-foreground border-b-2 border-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                Full Conversation
                              </button>
                              <button
                                onClick={() => setActiveConversationTab("admin-only")}
                                className={cn(
                                  "flex-1 py-2 text-xs font-medium transition-colors",
                                  activeConversationTab === "admin-only"
                                    ? "text-foreground border-b-2 border-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                Admin Only
                              </button>
                            </div>

                            {activeConversationTab === "full" && (
                              <div className="space-y-3">
                                {ticket.fullConversation?.map((dayThread, dayIdx) => (
                                  <div key={dayIdx} className="space-y-3">
                                    {/* Date Label */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-px bg-border" />
                                      <span className="text-xs text-muted-foreground font-medium">
                                        {dayThread.date}
                                      </span>
                                      <div className="flex-1 h-px bg-border" />
                                    </div>
                                    {/* Messages for this day */}
                                    {dayThread.messages.map((message, msgIdx) => (
                                      <div
                                        key={msgIdx}
                                        className={cn(
                                          "p-3 rounded-lg text-xs",
                                          message.sender === "customer" && "bg-background border border-border",
                                          message.sender === "ai" && "bg-blue-500/5 border border-blue-500/20",
                                          message.sender === "admin" && "bg-foreground/5",
                                        )}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            {message.sender === "ai" && <Bot className="w-3 h-3 text-blue-500" />}
                                            {message.sender === "admin" && (
                                              <Shield className="w-3 h-3 text-foreground" />
                                            )}
                                            {message.sender === "customer" && (
                                              <User className="w-3 h-3 text-muted-foreground" />
                                            )}
                                            <span className="font-medium text-foreground">{message.senderName}</span>
                                          </div>
                                          <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {message.time}
                                          </span>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{message.text}</p>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                                {/* Reply Input */}
                                <div className="pt-2">
                                  <div className="flex gap-2">
                                    <Input placeholder="Type your response..." className="flex-1" />
                                    <Button size="icon">
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeConversationTab === "admin-only" && (
                              <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs font-semibold text-yellow-500">Private Admin Thread</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    This conversation is only visible to admins and AI agents. Customer cannot see these
                                    messages.
                                  </p>
                                </div>

                                {ticket.adminOnlyConversation?.map((dayThread, dayIdx) => (
                                  <div key={dayIdx} className="space-y-3">
                                    {/* Date Label */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-px bg-border" />
                                      <span className="text-xs text-muted-foreground font-medium">
                                        {dayThread.date}
                                      </span>
                                      <div className="flex-1 h-px bg-border" />
                                    </div>
                                    {/* Messages for this day */}
                                    {dayThread.messages.map((message, msgIdx) => (
                                      <div
                                        key={msgIdx}
                                        className={cn(
                                          "p-3 rounded-lg text-xs",
                                          message.sender === "ai" && "bg-blue-500/5 border border-blue-500/20",
                                          message.sender === "admin" && "bg-foreground/5 border border-border",
                                        )}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            {message.sender === "ai" && <Bot className="w-3 h-3 text-blue-500" />}
                                            {message.sender === "admin" && (
                                              <Shield className="w-3 h-3 text-foreground" />
                                            )}
                                            <span className="font-medium text-foreground">{message.senderName}</span>
                                          </div>
                                          <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {message.time}
                                          </span>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{message.text}</p>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                                {/* Admin Reply Input */}
                                <div className="pt-2">
                                  <div className="flex gap-2">
                                    <Input placeholder="Add admin note or message AI..." className="flex-1" />
                                    <Button size="icon">
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Customer Profile Tab */}
                        {activeTicketTab === "profile" && ticket.customerProfile && (
                          <div className="space-y-4">
                            {/* Customer Info Header */}
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <UserCircle className="w-8 h-8 text-foreground" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-foreground">{ticket.customerProfile.name}</h4>
                                <p className="text-xs text-muted-foreground">{ticket.customerProfile.email}</p>
                                <p className="text-xs text-muted-foreground">{ticket.customerProfile.phone}</p>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                              <Card className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                                <p className="text-lg font-bold text-foreground">{ticket.customerProfile.totalSpent}</p>
                              </Card>
                              <Card className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                                <p className="text-lg font-bold text-foreground">
                                  {ticket.customerProfile.totalOrders}
                                </p>
                              </Card>
                              <Card className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                                <p className="text-lg font-bold text-foreground">
                                  {ticket.customerProfile.averageOrderValue}
                                </p>
                              </Card>
                              <Card className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Customer Since</p>
                                <p className="text-lg font-bold text-foreground">
                                  {ticket.customerProfile.customerSince}
                                </p>
                              </Card>
                            </div>

                            {/* Order History */}
                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Order History
                              </h5>
                              <div className="space-y-2">
                                {ticket.customerProfile.orderHistory.map((order, idx) => (
                                  <div key={idx}>
                                    <Card
                                      className="p-3 cursor-pointer hover:bg-accent transition-colors"
                                      onClick={() => toggleOrderExpansion(order.orderNumber)}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-mono text-foreground">{order.orderNumber}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-semibold text-foreground">{order.total}</span>
                                          <ChevronDown
                                            className={cn(
                                              "w-4 h-4 text-muted-foreground transition-transform",
                                              expandedOrderId === order.orderNumber && "rotate-180",
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{order.date}</span>
                                        <span
                                          className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            order.status === "Delivered" && "bg-green-500/10 text-green-500",
                                            order.status === "Processing" && "bg-yellow-500/10 text-yellow-500",
                                            order.status === "Refund Pending" && "bg-red-500/10 text-red-500",
                                          )}
                                        >
                                          {order.status}
                                        </span>
                                      </div>
                                    </Card>

                                    {expandedOrderId === order.orderNumber && (
                                      <div className="ml-2 border-l-2 border-border pl-3">
                                        {renderOrderDetails(order)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Admin Notes */}
                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Admin Notes
                              </h5>
                              {ticket.customerProfile.adminNotes.length > 0 ? (
                                <div className="space-y-2">
                                  {ticket.customerProfile.adminNotes.map((note, idx) => (
                                    <Card key={idx} className="p-3 bg-muted/50">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-foreground">{note.author}</span>
                                        <span className="text-xs text-muted-foreground">{note.date}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{note.note}</p>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No admin notes yet</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Resolve Tab */}
                        {activeTicketTab === "resolve" && (
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-foreground">Resolution Tools</h5>

                            {/* Discount Code Section */}
                            <Card className="p-4">
                              <h6 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Assign Discount Code
                              </h6>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="resolve-discount-type" className="text-xs mb-1.5 block">
                                    Discount Type
                                  </Label>
                                  <Select>
                                    <SelectTrigger id="resolve-discount-type">
                                      <SelectValue placeholder="Percentage Off" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">Percentage Off</SelectItem>
                                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                                      <SelectItem value="shipping">Free Shipping</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="resolve-discount-value" className="text-xs mb-1.5 block">
                                    Value
                                  </Label>
                                  <Input id="resolve-discount-value" type="number" placeholder="10" />
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="flex-1" onClick={handleGenerateDiscount}>
                                    Generate Code
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                    Custom Code
                                  </Button>
                                </div>
                                {generatedCode && (
                                  <div className="p-3 rounded-lg bg-muted">
                                    <div className="flex items-center justify-between">
                                      <code className="text-sm font-bold text-foreground">{generatedCode}</code>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyCode}>
                                        {copiedCode ? (
                                          <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>

                            {/* Admin Notes Section */}
                            <Card className="p-4">
                              <h6 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Add Admin Note to Profile
                              </h6>
                              <textarea
                                rows={3}
                                placeholder="Add a note about this customer or interaction..."
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                              />
                              <Button size="sm" className="w-full mt-2">
                                Save Note
                              </Button>
                            </Card>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-2 bg-transparent"
                                onClick={() => setShowRequestInfoModal(true)}
                              >
                                <MessageSquare className="w-4 h-4" />
                                Request More Info from Customer
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-2 bg-transparent"
                                onClick={() => setShowAssignAIModal(true)}
                              >
                                <Bot className="w-4 h-4" />
                                Assign to AI Agent
                              </Button>

                              <Button size="sm" className="w-full gap-2">
                                <Check className="w-4 h-4" />
                                Mark as Resolved
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Collapse Button */}
                      <div className="px-4 pb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTicket(ticket.id)
                          }}
                        >
                          <ChevronDown className="w-4 h-4 rotate-180" />
                          Collapse
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && activeToolView === "list" && (
            <div className="p-4 space-y-3">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Conversation History</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm">
                  All Time
                </Button>
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
              </div>

              {filteredConversations.map((conversation) => (
                <Card key={conversation.id} className="p-4 cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground mb-1">{conversation.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.customer}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {conversation.messageCount} msgs
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{conversation.preview}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{conversation.time}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              )}
            </div>
          )}

          {/* Tools Tab - List View */}
          {activeTab === "tools" && activeToolView === "list" && (
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-4">Support Tools</h3>
              <div className="space-y-2">
                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("discount")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Discount Code Generator</h4>
                        <p className="text-xs text-muted-foreground">Create custom discount codes</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("order")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Order History</h4>
                        <p className="text-xs text-muted-foreground">View and edit customer orders</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("customer")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Customer Lookup</h4>
                        <p className="text-xs text-muted-foreground">Search customer information</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("refund")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Refund Processor</h4>
                        <p className="text-xs text-muted-foreground">Process refunds and returns</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("shipping")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Truck className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Shipping Manager</h4>
                        <p className="text-xs text-muted-foreground">Track and update shipments</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setActiveToolView("analytics")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Analytics Dashboard</h4>
                        <p className="text-xs text-muted-foreground">View support metrics</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Discount Code Generator Tool */}
          {activeToolView === "discount" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Discount Code Generator</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="discount-type" className="text-sm font-medium mb-2 block">
                    Discount Type
                  </Label>
                  <Select>
                    <SelectTrigger id="discount-type">
                      <SelectValue placeholder="Percentage Off" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount-value" className="text-sm font-medium mb-2 block">
                    Discount Value
                  </Label>
                  <Input id="discount-value" type="number" placeholder="10" />
                </div>

                <div>
                  <Label htmlFor="min-purchase" className="text-sm font-medium mb-2 block">
                    Minimum Purchase (optional)
                  </Label>
                  <Input id="min-purchase" type="number" placeholder="50.00" />
                </div>

                <div>
                  <Label htmlFor="expiry-date" className="text-sm font-medium mb-2 block">
                    Expiry Date
                  </Label>
                  <div className="relative">
                    <Input id="expiry-date" type="date" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <Button onClick={handleGenerateDiscount} className="w-full">
                  Generate Code
                </Button>

                {generatedCode && (
                  <Card className="p-4 bg-muted">
                    <p className="text-xs text-muted-foreground mb-2">Generated Code:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-bold text-foreground">{generatedCode}</code>
                      <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                        {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Order History Tool */}
          {activeToolView === "order" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Order History</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by order number or customer..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  {[
                    { id: "#12345", customer: "John Doe", total: "$125.99", status: "Delivered", date: "Jan 15, 2025" },
                    {
                      id: "#12344",
                      customer: "Jane Smith",
                      total: "$89.50",
                      status: "In Transit",
                      date: "Jan 14, 2025",
                    },
                    {
                      id: "#12343",
                      customer: "Mike Johnson",
                      total: "$210.00",
                      status: "Processing",
                      date: "Jan 14, 2025",
                    },
                  ].map((order) => (
                    <Card key={order.id} className="p-4 cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm text-foreground">{order.id}</h4>
                          <p className="text-xs text-muted-foreground">{order.customer}</p>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{order.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {order.status}
                        </span>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customer Lookup Tool */}
          {activeToolView === "customer" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Customer Lookup</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">John Doe</h4>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders:</span>
                      <span className="text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lifetime Value:</span>
                      <span className="text-foreground">$1,245.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="text-foreground">Jan 2024</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">View Full Profile</Button>
                </Card>
              </div>
            </div>
          )}

          {/* Refund Processor Tool */}
          {activeToolView === "refund" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Refund Processor</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-id" className="text-sm font-medium mb-2 block">
                    Order Number
                  </Label>
                  <Input id="order-id" placeholder="#12345" />
                </div>

                <div>
                  <Label htmlFor="refund-amount" className="text-sm font-medium mb-2 block">
                    Refund Amount
                  </Label>
                  <Input id="refund-amount" type="number" placeholder="125.99" />
                </div>

                <div>
                  <Label htmlFor="refund-reason" className="text-sm font-medium mb-2 block">
                    Reason for Refund
                  </Label>
                  <Select>
                    <SelectTrigger id="refund-reason">
                      <SelectValue placeholder="Damaged Item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damaged">Damaged Item</SelectItem>
                      <SelectItem value="wrong">Wrong Item Received</SelectItem>
                      <SelectItem value="changed-mind">Customer Changed Mind</SelectItem>
                      <SelectItem value="not-described">Item Not as Described</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="refund-notes" className="text-sm font-medium mb-2 block">
                    Additional Notes
                  </Label>
                  <textarea
                    id="refund-notes"
                    rows={3}
                    placeholder="Add any additional information..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <Button className="w-full">Process Refund</Button>
              </div>
            </div>
          )}

          {/* Shipping Manager Tool */}
          {activeToolView === "shipping" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Shipping Manager</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by tracking number..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  {[
                    {
                      tracking: "1Z999AA10123456784",
                      order: "#12345",
                      status: "In Transit",
                      eta: "Jan 18, 2025",
                      location: "Chicago, IL",
                    },
                    {
                      tracking: "1Z999AA10123456785",
                      order: "#12344",
                      status: "Out for Delivery",
                      eta: "Today",
                      location: "New York, NY",
                    },
                  ].map((shipment) => (
                    <Card key={shipment.tracking} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm text-foreground mb-1">Order {shipment.order}</h4>
                          <p className="text-xs text-muted-foreground font-mono">{shipment.tracking}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                          {shipment.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="text-muted-foreground">Current Location</p>
                          <p className="text-foreground font-medium">{shipment.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">ETA</p>
                          <p className="text-foreground font-medium">{shipment.eta}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Dashboard Tool */}
          {activeToolView === "analytics" && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-6">Analytics Dashboard</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Tickets</p>
                    <p className="text-2xl font-bold text-foreground">247</p>
                    <p className="text-xs text-green-500 mt-1">+12% this week</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                    <p className="text-2xl font-bold text-foreground">4.2m</p>
                    <p className="text-xs text-green-500 mt-1">-8% faster</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Resolution Rate</p>
                    <p className="text-2xl font-bold text-foreground">94%</p>
                    <p className="text-xs text-green-500 mt-1">+3% this week</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Customer Satisfaction</p>
                    <p className="text-2xl font-bold text-foreground">4.8</p>
                    <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Top Issues This Week</h4>
                  <div className="space-y-2">
                    {[
                      { issue: "Shipping Delays", count: 45, percentage: 35 },
                      { issue: "Product Questions", count: 38, percentage: 30 },
                      { issue: "Refund Requests", count: 28, percentage: 22 },
                      { issue: "Account Issues", count: 17, percentage: 13 },
                    ].map((item) => (
                      <div key={item.issue}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground">{item.issue}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRequestInfoModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowRequestInfoModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] max-w-md mx-auto">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Request More Information</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowRequestInfoModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="request-message" className="text-sm mb-2 block">
                    Message to Customer
                  </Label>
                  <textarea
                    id="request-message"
                    rows={4}
                    value={requestInfoMessage}
                    onChange={(e) => setRequestInfoMessage(e.target.value)}
                    placeholder="Please provide more details about..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowRequestInfoModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleRequestMoreInfo}
                    disabled={!requestInfoMessage.trim() || isProcessing}
                  >
                    {isProcessing ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {showAssignAIModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowAssignAIModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] max-w-md mx-auto">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Assign to AI Agent</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAssignAIModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">AI Agent Capabilities</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Respond to customer inquiries automatically</li>
                        <li>• Provide order status updates</li>
                        <li>• Handle common support requests</li>
                        <li>• Escalate complex issues to human agents</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  The AI agent will take over this conversation and provide updates in the Admin Only thread. You can
                  take back control at any time.
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowAssignAIModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleAssignToAI} disabled={isProcessing}>
                    {isProcessing ? "Assigning..." : "Assign to AI"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}
