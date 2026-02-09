"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Paperclip,
  Mic,
  Camera,
  Send,
  StopCircle,
  Moon,
  Sun,
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
  Filter,
  ChevronDown,
  MessageSquare,
  Clock,
  UserCircle,
  ShoppingBag,
  Bot,
  Shield,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  X,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const HOT_BUTTONS = [
  { icon: Mic, label: "Summarize", prompt: "Summarize this for me" },
  { icon: Camera, label: "Quick Answer", prompt: "Give me a quick answer" },
  { icon: Paperclip, label: "Explain", prompt: "Explain this in detail" },
]

type TabType = "tickets" | "history" | "tools"
type ToolView = "list" | "discount" | "order" | "customer" | "refund" | "shipping" | "analytics"
type TicketTabType = "order-details" | "conversation" | "profile" | "resolve"
type ConversationSubTab = "full" | "admin-only"

export function DesktopChatInterface() {
  const { theme, toggleTheme } = useTheme()
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ type: string; url: string; name?: string }>>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return
    sendMessage({ text: input })
    setInput("")
    setAttachments([])
  }

  const handleHotButton = (prompt: string) => {
    setInput(prompt)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachments((prev) => [
        ...prev,
        { type: file.type.startsWith("image/") ? "image" : "file", url, name: file.name },
      ])
    })
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files[0]) return
    const url = URL.createObjectURL(files[0])
    setAttachments((prev) => [...prev, { type: "image", url, name: files[0].name }])
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAttachments((prev) => [...prev, { type: "audio", url, name: "voice-memo.webm" }])
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const isLoading = status === "in_progress"

  // Sidebar data and functions (same as mobile)
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
            walletAddress: "0x742d35Cc6634C0532925a3b90",
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
        ],
        adminNotes: [
          { date: "Jan 10, 2025", author: "Admin", note: "Customer prefers email communication" },
          { date: "Dec 15, 2024", author: "Support", note: "Resolved shipping issue quickly, very satisfied" },
        ],
      },
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
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        trackingNumber: "1Z999AA10123456785",
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
      adminOnlyConversation: [],
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
          {
            orderNumber: "#12340",
            date: "Jan 12, 2025",
            total: "$89.50",
            status: "Refund Pending",
            items: [{ name: "Glass Vase", quantity: 1, price: "$89.50" }],
            subtotal: "$89.50",
            shipping: "$0.00",
            tax: "$0.00",
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            trackingNumber: "1Z999AA10123456785",
            timeline: [
              { status: "Order Placed", date: "Jan 12, 2025", time: "9:00 AM", completed: true },
              { status: "Order Approved", date: "Jan 12, 2025", time: "9:30 AM", completed: true },
              { status: "Payment Made", date: "Jan 12, 2025", time: "9:35 AM", completed: true },
              { status: "Refund Processed", date: "Jan 14, 2025", time: "2:00 PM", completed: true },
            ],
          },
        ],
        adminNotes: [
          { date: "Dec 22, 2024", author: "Support", note: "Very understanding customer, easy to work with" },
        ],
      },
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
      <Card className="p-4 bg-background">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Order Number</span>
          <span className="text-sm font-mono font-semibold text-foreground">{orderDetails.orderNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Order Date</span>
          <span className="text-sm text-foreground">{orderDetails.date || orderDetails.orderDate}</span>
        </div>
      </Card>

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
    <div className="hidden lg:flex h-screen w-full bg-background pt-16">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            {/* Removed logo and title, replaced with section title */}
            
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                <img
                  src={theme === "light" ? "/eagle-logo-black.png" : "/eagle-logo.png"}
                  alt="Eagle Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Start a conversation</h2>
              <p className="text-sm text-muted-foreground mb-6">{"Ask me anything, share files, or use voice memos"}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {HOT_BUTTONS.map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleHotButton(button.prompt)}
                    className="gap-2"
                  >
                    <button.icon className="w-4 h-4" />
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <Card
                className={cn(
                  "max-w-[70%] p-4",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
                )}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  }
                  return null
                })}
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-card text-card-foreground p-4">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Hot Buttons */}
        {messages.length > 0 && (
          <div className="px-6 pb-3">
            <div className="flex gap-2">
              {HOT_BUTTONS.map((button, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleHotButton(button.prompt)}
                  className="gap-2"
                >
                  <button.icon className="w-4 h-4" />
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-6 pb-3">
            <div className="flex gap-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative">
                  {attachment.type === "image" && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {attachment.type === "audio" && (
                    <div className="relative w-28 h-20 rounded-lg bg-accent flex items-center justify-center">
                      <Mic className="w-6 h-6 text-accent-foreground" />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {attachment.type === "file" && (
                    <div className="relative w-28 h-20 rounded-lg bg-muted flex items-center justify-center p-2">
                      <Paperclip className="w-6 h-6 text-muted-foreground" />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-border bg-card">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="*/*"
              />
              <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
              </Button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
              />
              <Button variant="outline" size="icon" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="w-5 h-5" />
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type a message..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />

            <Button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "border-l border-border bg-card transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-96" : "w-0 overflow-hidden",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Support Panel</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-card">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setActiveToolView("list")
              }}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tickets Tab */}
          {activeTab === "tickets" && (
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
              </div>

              {tickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
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
                            <span className="hidden xl:inline">{tab.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 max-h-96 overflow-y-auto">
                        {activeTicketTab === "order-details" && ticket.orderDetails && (
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-foreground">Order Details</h5>
                            {renderOrderDetails(ticket.orderDetails)}
                          </div>
                        )}

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
                                Full
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
                                Admin
                              </button>
                            </div>

                            {activeConversationTab === "full" && (
                              <div className="space-y-3">
                                {ticket.fullConversation?.map((dayThread, dayIdx) => (
                                  <div key={dayIdx} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-px bg-border" />
                                      <span className="text-xs text-muted-foreground font-medium">
                                        {dayThread.date}
                                      </span>
                                      <div className="flex-1 h-px bg-border" />
                                    </div>
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
                              </div>
                            )}

                            {activeConversationTab === "admin-only" && (
                              <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs font-semibold text-yellow-500">Private Admin Thread</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Only visible to admins and AI agents.</p>
                                </div>

                                {ticket.adminOnlyConversation?.map((dayThread, dayIdx) => (
                                  <div key={dayIdx} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-px bg-border" />
                                      <span className="text-xs text-muted-foreground font-medium">
                                        {dayThread.date}
                                      </span>
                                      <div className="flex-1 h-px bg-border" />
                                    </div>
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
                              </div>
                            )}
                          </div>
                        )}

                        {activeTicketTab === "profile" && ticket.customerProfile && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <UserCircle className="w-8 h-8 text-foreground" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-foreground">{ticket.customerProfile.name}</h4>
                                <p className="text-xs text-muted-foreground">{ticket.customerProfile.email}</p>
                              </div>
                            </div>

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
                            </div>

                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Order History
                              </h5>
                              <div className="space-y-2">
                                {ticket.customerProfile.orderHistory.slice(0, 3).map((order, idx) => (
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
                          </div>
                        )}

                        {activeTicketTab === "resolve" && (
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-foreground">Resolution Tools</h5>

                            <Card className="p-4">
                              <h6 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Discount Code
                              </h6>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="resolve-discount-type" className="text-xs mb-1.5 block">
                                    Type
                                  </Label>
                                  <Select>
                                    <SelectTrigger id="resolve-discount-type">
                                      <SelectValue placeholder="Percentage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">Percentage</SelectItem>
                                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="resolve-discount-value" className="text-xs mb-1.5 block">
                                    Value
                                  </Label>
                                  <Input id="resolve-discount-value" type="number" placeholder="10" />
                                </div>
                                <Button size="sm" className="w-full" onClick={handleGenerateDiscount}>
                                  Generate
                                </Button>
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

                            <div className="space-y-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-2 bg-transparent"
                                onClick={() => setShowRequestInfoModal(true)}
                              >
                                <MessageSquare className="w-4 h-4" />
                                Request Info
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full gap-2 bg-transparent"
                                onClick={() => setShowAssignAIModal(true)}
                              >
                                <Bot className="w-4 h-4" />
                                Assign to AI
                              </Button>

                              <Button size="sm" className="w-full gap-2">
                                <Check className="w-4 h-4" />
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
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
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === "tools" && (
            <div className="p-4 space-y-3">
              {activeToolView === "list" ? (
                <>
                  <h3 className="text-sm font-semibold text-foreground mb-4">Support Tools</h3>
                  <div className="space-y-2">
                    {[
                      {
                        id: "discount" as ToolView,
                        icon: DollarSign,
                        label: "Discount Generator",
                        desc: "Create discount codes",
                      },
                      { id: "order" as ToolView, icon: Package, label: "Order History", desc: "View customer orders" },
                      { id: "customer" as ToolView, icon: User, label: "Customer Lookup", desc: "Search customers" },
                      {
                        id: "refund" as ToolView,
                        icon: CreditCard,
                        label: "Refund Processor",
                        desc: "Process refunds",
                      },
                      { id: "shipping" as ToolView, icon: Truck, label: "Shipping Manager", desc: "Track shipments" },
                      { id: "analytics" as ToolView, icon: BarChart3, label: "Analytics", desc: "View metrics" },
                    ].map((tool) => (
                      <Card
                        key={tool.id}
                        className="p-4 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setActiveToolView(tool.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <tool.icon className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-foreground">{tool.label}</h4>
                              <p className="text-xs text-muted-foreground">{tool.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => setActiveToolView("list")}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tools
                  </Button>

                  {/* Discount Code Generator Tool */}
                  {activeToolView === "discount" && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-6">Discount Code Generator</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="desktop-discount-type" className="text-sm font-medium mb-2 block">
                            Discount Type
                          </Label>
                          <Select>
                            <SelectTrigger id="desktop-discount-type">
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
                          <Label htmlFor="desktop-discount-value" className="text-sm font-medium mb-2 block">
                            Discount Value
                          </Label>
                          <Input id="desktop-discount-value" type="number" placeholder="10" />
                        </div>

                        <div>
                          <Label htmlFor="desktop-min-purchase" className="text-sm font-medium mb-2 block">
                            Minimum Purchase (optional)
                          </Label>
                          <Input id="desktop-min-purchase" type="number" placeholder="50.00" />
                        </div>

                        <div>
                          <Label htmlFor="desktop-expiry-date" className="text-sm font-medium mb-2 block">
                            Expiry Date
                          </Label>
                          <Input id="desktop-expiry-date" type="date" />
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
                                {copiedCode ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order History Tool */}
                  {activeToolView === "order" && (
                    <div>
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
                            {
                              id: "#12345",
                              customer: "John Doe",
                              total: "$125.99",
                              status: "Delivered",
                              date: "Jan 15, 2025",
                            },
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
                    <div>
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
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-6">Refund Processor</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="desktop-order-id" className="text-sm font-medium mb-2 block">
                            Order Number
                          </Label>
                          <Input id="desktop-order-id" placeholder="#12345" />
                        </div>

                        <div>
                          <Label htmlFor="desktop-refund-amount" className="text-sm font-medium mb-2 block">
                            Refund Amount
                          </Label>
                          <Input id="desktop-refund-amount" type="number" placeholder="125.99" />
                        </div>

                        <div>
                          <Label htmlFor="desktop-refund-reason" className="text-sm font-medium mb-2 block">
                            Reason for Refund
                          </Label>
                          <Select>
                            <SelectTrigger id="desktop-refund-reason">
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
                          <Label htmlFor="desktop-refund-notes" className="text-sm font-medium mb-2 block">
                            Additional Notes
                          </Label>
                          <textarea
                            id="desktop-refund-notes"
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
                    <div>
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
                    <div>
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
                                  <div
                                    className="h-full bg-foreground rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showRequestInfoModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowRequestInfoModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Request More Information</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowRequestInfoModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="desktop-request-message" className="text-sm mb-2 block">
                    Message to Customer
                  </Label>
                  <textarea
                    id="desktop-request-message"
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
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md">
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
    </div>
  )
}
