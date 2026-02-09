"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  PackageX,
  Clock,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Check,
  ArrowLeft,
  Camera,
  Package,
  Loader2,
  Headphones,
} from "lucide-react"
import { submitSupportTicket, getMyTickets, type SupportTicket } from "@/app/actions/support"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import Link from "next/link"

type CategoryId = "missing_delivery" | "late_delivery" | "damaged_product" | "adverse_reaction" | "general_complaint"

interface Question {
  id: string
  text: string
  type: "options" | "text" | "photo" | "info" | "datetime"
  options?: string[]
  multiSelect?: boolean
  placeholder?: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  created_at: string
  status: string
}

const CATEGORIES: {
  id: CategoryId
  title: string
  icon: any
  description: string
  priority: string
  questions: Question[]
}[] = [
  {
    id: "missing_delivery",
    title: "Missing Delivery",
    icon: PackageX,
    description: "Package marked delivered but not received",
    priority: "High",
    questions: [
      {
        id: "checked_tracking",
        text: "Have you checked the tracking information?",
        type: "options",
        options: ["Yes, it says delivered", "Yes, it's stuck", "No, I haven't"],
      },
      {
        id: "checked_neighbors",
        text: "Have you checked with neighbors or building management?",
        type: "options",
        options: ["Yes, checked everywhere", "No, not yet"],
      },
      {
        id: "address_correct",
        text: "Is the shipping address on your order correct?",
        type: "options",
        options: ["Yes, it is correct", "No, it is incorrect"],
      },
      {
        id: "last_update",
        text: "When was the last tracking update?",
        type: "datetime",
      },
    ],
  },
  {
    id: "late_delivery",
    title: "Late Delivery",
    icon: Clock,
    description: "Order hasn't arrived by expected date",
    priority: "Medium",
    questions: [
      {
        id: "days_late",
        text: "How many days late is the order?",
        type: "options",
        options: ["1-2 days", "3-5 days", "1 week+", "2 weeks+"],
      },
      {
        id: "tracking_status",
        text: "What does the latest tracking status show?",
        type: "options",
        options: ["In Transit", "Stuck at facility", "Out for delivery", "No information"],
      },
      {
        id: "urgency",
        text: "Is this delay causing an urgent issue?",
        type: "options",
        options: ["No rush", "Needed soon", "Urgent"],
      },
      {
        id: "urgency_reason",
        text: "If urgent, please select the reason:",
        type: "options",
        options: ["Event/Deadline", "Running out of supply", "Gift", "Other"],
      },
    ],
  },
  {
    id: "damaged_product",
    title: "Broken/Damaged",
    icon: AlertCircle,
    description: "Product arrived broken or unusable",
    priority: "High",
    questions: [
      {
        id: "damage_type",
        text: "What type of damage is it?",
        type: "options",
        options: [
          "Packaging only",
          "Minor product damage",
          "Major product damage",
          "Product unusable",
          "Wrong item",
          "Missing parts",
        ],
      },
      {
        id: "outer_box",
        text: "Was the outer shipping box damaged?",
        type: "options",
        options: ["Yes, visibly damaged", "No, box looks fine"],
      },
      {
        id: "photos",
        text: "Please upload photos of the damage (Optional)",
        type: "photo",
      },
      {
        id: "resolution",
        text: "What is your preferred resolution?",
        type: "options",
        options: ["Replacement", "Full refund", "Partial refund", "Store credit"],
      },
    ],
  },
  {
    id: "adverse_reaction",
    title: "Adverse Reaction",
    icon: HelpCircle,
    description: "Unexpected reaction to product",
    priority: "Urgent",
    questions: [
      {
        id: "severity",
        text: "How would you rate the severity?",
        type: "options",
        options: ["Mild", "Moderate", "Severe"],
      },
      {
        id: "stopped_using",
        text: "Have you stopped using the product?",
        type: "options",
        options: ["Yes", "No"],
      },
      {
        id: "medical_attention",
        text: "Have you sought medical attention?",
        type: "options",
        options: ["Yes", "No"],
      },
      {
        id: "safety_contact",
        text: "May our safety team contact you for more details?",
        type: "options",
        options: ["Yes, please contact me", "No, I prefer not"],
      },
    ],
  },
  {
    id: "general_complaint",
    title: "General Complaint",
    icon: MessageSquare,
    description: "Feedback about product or service",
    priority: "Low",
    questions: [
      {
        id: "topic",
        text: "What is your complaint about?",
        type: "options",
        options: [
          "Product quality",
          "Packaging issues",
          "Pricing",
          "Customer service",
          "Website/Ordering",
          "Shipping service",
          "Other",
        ],
      },
      {
        id: "importance",
        text: "How important is resolving this issue?",
        type: "options",
        options: ["FYI only", "Would appreciate resolution", "Very important"],
      },
      {
        id: "response_needed",
        text: "Would you like a response from us?",
        type: "options",
        options: ["Yes, please", "No, not needed"],
      },
      {
        id: "details",
        text: "Please provide any additional details:",
        type: "text",
        placeholder: "Type your message here...",
      },
    ],
  },
]

export default function SupportChatPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [existingTickets, setExistingTickets] = useState<SupportTicket[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  // Support flow state
  const [view, setView] = useState<"main" | "select-order" | "wizard">("main")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [step, setStep] = useState<"category" | "questions" | "success">("category")
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [timeDigits, setTimeDigits] = useState<string[]>([])
  const [timePeriod, setTimePeriod] = useState<"AM" | "PM">("AM")

  // Load user and orders
  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', session.user.id)
          .single()

        if (dbUser) {
          setUserId(dbUser.id)
          
          // Get customer record
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', dbUser.id)
            .single()
          
          if (customer) {
            setCustomerId(customer.id)
            
            // Get customer's orders
            const { data: customerOrders } = await supabase
              .from('orders')
              .select('id, order_number, total_amount, created_at, status')
              .eq('customer_id', customer.id)
              .order('created_at', { ascending: false })
              .limit(10)
            
            setOrders(customerOrders || [])
            
            // Get existing tickets
            const tickets = await getMyTickets(dbUser.id)
            setExistingTickets(tickets)
          }
        }
        setLoadingOrders(false)
      } else {
        router.push('/login?redirect=/support-chat')
      }
    }
    loadUser()
  }, [])

  // Time picker helpers
  const formatTimeDisplay = () => {
    const digits = [...timeDigits]
    while (digits.length < 4) digits.unshift("-")
    return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`
  }

  const handleTimeKeyPress = (digit: string) => {
    if (timeDigits.length < 4) {
      const newDigits = [...timeDigits, digit]
      if (newDigits.length === 1 && parseInt(digit) > 1) return
      if (newDigits.length === 2) {
        const hour = parseInt(newDigits.join(""))
        if (hour > 12 || hour === 0) return
      }
      if (newDigits.length === 3 && parseInt(digit) > 5) return
      setTimeDigits(newDigits)
    }
  }

  const handleTimeBackspace = () => setTimeDigits(timeDigits.slice(0, -1))
  const clearTime = () => { setTimeDigits([]); setTimePeriod("AM") }
  
  const getFormattedTime = () => {
    if (timeDigits.length === 4) {
      const hour = parseInt(timeDigits.slice(0, 2).join(""))
      const minute = timeDigits.slice(2, 4).join("")
      return `${hour}:${minute} ${timePeriod}`
    }
    return null
  }

  const currentCategoryData = CATEGORIES.find((c) => c.id === selectedCategory)
  const currentQuestion = currentCategoryData?.questions[currentQuestionIndex]

  const handleCategorySelect = (id: CategoryId) => {
    setSelectedCategory(id)
    setStep("questions")
    setCurrentQuestionIndex(0)
    setDirection(1)
  }

  const handleAnswer = async (value: any) => {
    if (!selectedCategory || !currentCategoryData) return

    const newAnswers = { ...answers, [currentQuestion!.id]: value }
    setAnswers(newAnswers)

    if (currentQuestionIndex < currentCategoryData.questions.length - 1) {
      setDirection(1)
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 200)
    } else {
      await submitTicket(newAnswers)
    }
  }

  const handleBack = () => {
    if (step === "questions" && currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex((prev) => prev - 1)
    } else if (step === "questions") {
      setStep("category")
      setSelectedCategory(null)
    } else if (step === "category") {
      setView("select-order")
    }
  }

  const handleDone = () => {
    router.push('/support')
  }

  const submitTicket = async (finalAnswers: Record<string, any>) => {
    if (!customerId) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("orderId", selectedOrder?.id || "")
      formData.append("subject", currentCategoryData?.title || "Support Request")
      formData.append("message", JSON.stringify(finalAnswers))
      formData.append("priority", currentCategoryData?.priority || "Medium")
      formData.append("customerId", customerId)

      await submitSupportTicket(formData)
      setStep("success")
    } catch (error) {
      console.error("Failed to submit ticket", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0, scale: 0.95 }),
  }

  // Count unread messages
  const totalUnread = existingTickets.reduce((acc, ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) return acc
    let lastCustomerIndex = -1
    for (let i = ticket.messages.length - 1; i >= 0; i--) {
      if (!ticket.messages[i].is_admin) {
        lastCustomerIndex = i
        break
      }
    }
    for (let i = lastCustomerIndex + 1; i < ticket.messages.length; i++) {
      if (ticket.messages[i].is_admin) acc++
    }
    return acc
  }, 0)

  if (loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="max-w-xl mx-auto px-4 pt-8">
        {/* Main View */}
        {view === "main" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
              <p className="text-white/50">How can we help you today?</p>
            </div>

            {/* New Ticket Button */}
            <button
              onClick={() => setView("select-order")}
              className="w-full group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shrink-0">
                <MessageSquare className="h-7 w-7 text-black" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white text-lg">Start New Request</p>
                <p className="text-sm text-white/50">Get help with an order or general inquiry</p>
              </div>
              <ChevronRight className="h-6 w-6 text-white/30 group-hover:text-white transition-colors" />
            </button>

            {/* View Existing Tickets */}
            <Link href="/support">
              <button className="w-full group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all relative">
                <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0 relative">
                  <Package className="h-7 w-7 text-white" />
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalUnread}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white text-lg">View My Tickets</p>
                  <p className="text-sm text-white/50">
                    {existingTickets.length > 0 
                      ? `${existingTickets.length} ticket${existingTickets.length > 1 ? 's' : ''} • ${existingTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length} active`
                      : 'No tickets yet'}
                  </p>
                </div>
                <ChevronRight className="h-6 w-6 text-white/30 group-hover:text-white transition-colors" />
              </button>
            </Link>

            {/* Quick links */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-white/40 mb-3">Quick links</p>
              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-white/70 hover:text-white text-sm transition-all">
                  My Orders
                </Link>
                <Link href="/profile" className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-white/70 hover:text-white text-sm transition-all">
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Order Selection View */}
        {view === "select-order" && (
          <div>
            <button
              onClick={() => setView("main")}
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Select an Order</h2>
              <p className="text-white/50">Which order do you need help with?</p>
            </div>

            <div className="space-y-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order)
                      setView("wizard")
                    }}
                    className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-white">Order #{order.order_number}</p>
                      <p className="text-sm text-white/50">
                        ${order.total_amount?.toFixed(2)} • {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-white/40">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}

              {/* General inquiry option */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={() => {
                    setSelectedOrder(null)
                    setView("wizard")
                  }}
                  className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-white">General Inquiry</p>
                    <p className="text-sm text-white/50">Not related to a specific order</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wizard View */}
        {view === "wizard" && (
          <div className="min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {step === "category" && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col"
                >
                  <button
                    onClick={() => setView("select-order")}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 self-start"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
                  </button>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">How can we help?</h3>
                    <p className="text-white/50">
                      {selectedOrder 
                        ? `Select the issue with Order #${selectedOrder.order_number}`
                        : 'Select the type of issue you\'re experiencing'}
                    </p>
                  </div>
                  <div className="flex-1 space-y-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                          <cat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-lg">{cat.title}</p>
                          <p className="text-sm text-white/50">{cat.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "questions" && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={handleBack}
                      className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white/50">{currentCategoryData?.title}</span>
                        <span className="text-sm font-medium text-white/30">
                          {currentQuestionIndex + 1} / {currentCategoryData?.questions.length}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: `${(currentQuestionIndex / currentCategoryData!.questions.length) * 100}%` }}
                          animate={{ width: `${((currentQuestionIndex + 1) / currentCategoryData!.questions.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-4">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">{currentQuestion.text}</h3>

                    <div className="space-y-3 w-full max-w-xs mx-auto">
                      {currentQuestion.type === "options" &&
                        currentQuestion.options?.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-center text-lg transition-colors hover:bg-white hover:text-black hover:border-white"
                          >
                            {option}
                          </button>
                        ))}

                      {currentQuestion.type === "datetime" && (
                        <div className="space-y-5 w-full max-w-sm mx-auto">
                          <div>
                            <label className="block text-white/50 text-sm mb-2">Date</label>
                            <input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="w-full py-4 px-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-lg transition-colors focus:border-white/50 focus:outline-none cursor-pointer [color-scheme:dark]"
                            />
                          </div>

                          <div>
                            <label className="block text-white/50 text-sm mb-2">Time (optional)</label>
                            <div className="flex items-center justify-center gap-3 mb-4">
                              <div className="flex-1 py-4 px-4 rounded-xl border border-white/10 bg-white/5 text-center">
                                <span className="font-mono text-3xl font-bold text-white tracking-widest">
                                  {formatTimeDisplay()}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => setTimePeriod("AM")}
                                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                    timePeriod === "AM" ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
                                  }`}
                                >
                                  AM
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTimePeriod("PM")}
                                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                    timePeriod === "PM" ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/20"
                                  }`}
                                >
                                  PM
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleTimeKeyPress(num.toString())}
                                  className="py-4 rounded-xl border border-white/10 bg-white/5 text-white text-xl font-bold transition-colors hover:bg-white/20 active:bg-white active:text-black"
                                >
                                  {num}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={clearTime}
                                className="py-4 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-bold transition-colors hover:bg-white/20"
                              >
                                Clear
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTimeKeyPress("0")}
                                className="py-4 rounded-xl border border-white/10 bg-white/5 text-white text-xl font-bold transition-colors hover:bg-white/20 active:bg-white active:text-black"
                              >
                                0
                              </button>
                              <button
                                type="button"
                                onClick={handleTimeBackspace}
                                className="py-4 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-bold transition-colors hover:bg-white/20"
                              >
                                ←
                              </button>
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              if (selectedDate) {
                                const time = getFormattedTime()
                                let dateStr: string
                                if (time) {
                                  const [hourMin, period] = time.split(" ")
                                  const [hour, minute] = hourMin.split(":")
                                  let hour24 = parseInt(hour)
                                  if (period === "PM" && hour24 !== 12) hour24 += 12
                                  if (period === "AM" && hour24 === 12) hour24 = 0
                                  const dateObj = new Date(`${selectedDate}T${hour24.toString().padStart(2, "0")}:${minute}`)
                                  dateStr = dateObj.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                                } else {
                                  dateStr = new Date(selectedDate).toLocaleDateString("en-US", { dateStyle: "medium" })
                                }
                                handleAnswer(dateStr)
                                setSelectedDate("")
                                clearTime()
                              }
                            }}
                            disabled={!selectedDate}
                            className="w-full py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continue
                          </Button>
                        </div>
                      )}

                      {currentQuestion.type === "text" && (
                        <div className="space-y-4">
                          <textarea
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors resize-none text-lg"
                            placeholder={currentQuestion.placeholder}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleAnswer(e.currentTarget.value)
                              }
                            }}
                          />
                          <Button
                            onClick={(e) => {
                              const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement
                              handleAnswer(textarea.value)
                            }}
                            className="w-full py-6 text-lg"
                          >
                            Continue
                          </Button>
                        </div>
                      )}

                      {currentQuestion.type === "photo" && (
                        <div className="space-y-4">
                          <button
                            onClick={() => handleAnswer("photo_uploaded")}
                            className="w-full h-48 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors group"
                          >
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                              <Camera className="h-8 w-8 text-white/50 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-medium text-white">Take a Photo</p>
                              <p className="text-sm text-white/40">or upload from gallery</p>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAnswer("skipped")}
                            className="w-full py-3 text-white/50 hover:text-white transition-colors"
                          >
                            Skip this step
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12"
                >
                  <div className="h-24 w-24 rounded-full bg-white text-black flex items-center justify-center mb-4 shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)]">
                    <Check className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Ticket Submitted</h3>
                    <p className="text-white/60 text-lg max-w-xs mx-auto">
                      We've received your request and will get back to you shortly.
                    </p>
                  </div>
                  <Button onClick={handleDone} className="px-12 py-6 text-lg rounded-xl mt-8">
                    View My Tickets
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {isSubmitting && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-white font-medium">Submitting ticket...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
