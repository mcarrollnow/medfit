"use client"

import { useState } from "react"
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
} from "lucide-react"
import { submitSupportTicket } from "@/app/actions/support"
import { Button } from "@/components/ui/button"

interface SupportTicketFlowProps {
  orderId: string
  onClose: () => void
}

type CategoryId = "missing_delivery" | "late_delivery" | "damaged_product" | "adverse_reaction" | "general_complaint"

interface Question {
  id: string
  text: string
  type: "options" | "text" | "photo" | "info" | "datetime"
  options?: string[]
  multiSelect?: boolean
  placeholder?: string
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

export function SupportTicketFlow({ orderId, onClose }: SupportTicketFlowProps) {
  const [step, setStep] = useState<"category" | "questions" | "success">("category")
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [timeDigits, setTimeDigits] = useState<string[]>([])
  const [timePeriod, setTimePeriod] = useState<"AM" | "PM">("AM")

  // Format time digits as HH:MM
  const formatTimeDisplay = () => {
    const digits = [...timeDigits]
    while (digits.length < 4) digits.unshift("-")
    return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`
  }

  const handleTimeKeyPress = (digit: string) => {
    if (timeDigits.length < 4) {
      const newDigits = [...timeDigits, digit]
      // Validate as we go
      if (newDigits.length === 1 && parseInt(digit) > 1) return // First hour digit can only be 0 or 1
      if (newDigits.length === 2) {
        const hour = parseInt(newDigits.join(""))
        if (hour > 12 || hour === 0) return // Hours 01-12 only
      }
      if (newDigits.length === 3 && parseInt(digit) > 5) return // First minute digit 0-5
      setTimeDigits(newDigits)
    }
  }

  const handleTimeBackspace = () => {
    setTimeDigits(timeDigits.slice(0, -1))
  }

  const clearTime = () => {
    setTimeDigits([])
    setTimePeriod("AM")
  }

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
      // Submit ticket
      await submitTicket(newAnswers)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex((prev) => prev - 1)
    } else {
      setStep("category")
      setSelectedCategory(null)
    }
  }

  const handleDone = () => {
    setStep("category")
    setSelectedCategory(null)
    setAnswers({})
    if (onClose) onClose()
  }

  const submitTicket = async (finalAnswers: Record<string, any>) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("subject", currentCategoryData?.title || "Support Request")
      formData.append("message", JSON.stringify(finalAnswers))
      formData.append("priority", currentCategoryData?.priority || "Medium")
      formData.append("customerId", "mock-customer-id") // Replace with actual auth

      await submitSupportTicket(formData)
      setStep("success")
    } catch (error) {
      console.error("Failed to submit ticket", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="w-full max-w-xl mx-auto min-h-[500px] max-h-[80vh] flex flex-col relative overflow-y-auto overflow-x-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        {step === "category" && (
          <motion.div
            key="category"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">How can we help?</h3>
              <p className="text-white/50">Select the issue you're experiencing with order #{orderId}</p>
            </div>
            <div className="flex-1 space-y-3 pr-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 text-left"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200 shrink-0">
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">{cat.title}</p>
                    <p className="text-sm text-white/50">{cat.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white transition-colors duration-200" />
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
                className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors duration-200"
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
                    animate={{
                      width: `${((currentQuestionIndex + 1) / currentCategoryData!.questions.length) * 100}%`,
                    }}
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
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-center text-lg transition-colors duration-200 hover:bg-white hover:text-black hover:border-white"
                    >
                      {option}
                    </button>
                  ))}

                {currentQuestion.type === "datetime" && (
                  <div className="space-y-5 w-full max-w-sm mx-auto">
                    {/* Date Input */}
                    <div>
                      <label className="block text-white/50 text-sm mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full py-4 px-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-lg transition-colors duration-200 focus:border-white/50 focus:outline-none cursor-pointer [color-scheme:dark]"
                      />
                    </div>

                    {/* Time Picker */}
                    <div>
                      <label className="block text-white/50 text-sm mb-2">Time (optional)</label>
                      
                      {/* Time Display */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex-1 py-4 px-4 rounded-xl border border-white/10 bg-white/5 text-center">
                          <span className="font-mono text-3xl font-bold text-white tracking-widest">
                            {formatTimeDisplay()}
                          </span>
                        </div>
                        
                        {/* AM/PM Toggle */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setTimePeriod("AM")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
                              timePeriod === "AM" 
                                ? "bg-white text-black" 
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimePeriod("PM")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
                              timePeriod === "PM" 
                                ? "bg-white text-black" 
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>

                      {/* Number Keypad */}
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleTimeKeyPress(num.toString())}
                            className="py-4 rounded-xl border border-white/10 bg-white/5 text-white text-xl font-bold transition-colors duration-200 hover:bg-white/20 active:bg-white active:text-black"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={clearTime}
                          className="py-4 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-bold transition-colors duration-200 hover:bg-white/20"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTimeKeyPress("0")}
                          className="py-4 rounded-xl border border-white/10 bg-white/5 text-white text-xl font-bold transition-colors duration-200 hover:bg-white/20 active:bg-white active:text-black"
                        >
                          0
                        </button>
                        <button
                          type="button"
                          onClick={handleTimeBackspace}
                          className="py-4 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-bold transition-colors duration-200 hover:bg-white/20"
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
                            dateStr = dateObj.toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          } else {
                            dateStr = new Date(selectedDate).toLocaleDateString("en-US", {
                              dateStyle: "medium",
                            })
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
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors duration-200 resize-none text-lg"
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
                      onClick={() => handleAnswer("photo_uploaded")} // Mock upload
                      className="w-full h-48 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors duration-200 group"
                    >
                      <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                        <Camera className="h-8 w-8 text-white/50 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-white transition-colors duration-200">
                          Take a Photo
                        </p>
                        <p className="text-sm text-white/40">or upload from gallery</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAnswer("skipped")}
                      className="w-full py-3 text-white/50 hover:text-white transition-colors duration-200"
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
              Done
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
  )
}
