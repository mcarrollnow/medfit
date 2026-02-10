"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, ChevronRight, Check, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitRepRating } from "@/app/actions/rep-ratings"

interface RepRatingPopupProps {
  isOpen: boolean
  onClose: () => void
  repName: string
  repId: string
  customerId: string
  orderId?: string
}

// Feedback options organized by star rating with nested categories
const FEEDBACK_OPTIONS: Record<
  number,
  {
    category: string
    options: string[]
    subcategories?: Record<string, string[]>
  }[]
> = {
  5: [
    {
      category: "Service Quality",
      options: ["Exceptional service", "Very professional", "Extremely helpful", "Went above and beyond"],
    },
    {
      category: "Communication",
      options: ["Great communicator", "Always responsive", "Clear explanations", "Proactive updates"],
    },
    {
      category: "Knowledge",
      options: ["Very knowledgeable", "Expert advice", "Excellent recommendations", "Understood my needs"],
    },
    {
      category: "Overall",
      options: ["Would highly recommend", "Best rep experience", "Made ordering easy", "Trustworthy partner"],
    },
  ],
  4: [
    {
      category: "Positive",
      options: ["Good service overall", "Helpful and friendly", "Professional approach", "Reliable rep"],
    },
    {
      category: "Minor Improvements",
      options: [
        "Slightly slow responses",
        "Could be more proactive",
        "Room for improvement",
        "Mostly met expectations",
      ],
      subcategories: {
        "Slightly slow responses": ["Busy but got back to me", "Delayed on weekends", "Eventually responsive"],
        "Could be more proactive": ["Had to follow up sometimes", "Needed reminders", "Updates were reactive"],
      },
    },
  ],
  3: [
    {
      category: "Positive Aspects",
      options: ["Adequate service", "Gets the job done", "Friendly enough", "Basic needs met"],
    },
    {
      category: "Areas of Concern",
      options: ["Slow response times", "Lacked product knowledge", "Communication gaps", "Inconsistent service"],
      subcategories: {
        "Slow response times": ["Days to respond", "Hard to reach", "Often unavailable"],
        "Communication gaps": ["Unclear information", "Missed updates", "Confusion on orders"],
        "Inconsistent service": ["Good days and bad days", "Unreliable follow-through", "Mixed experiences"],
      },
    },
  ],
  2: [
    {
      category: "Main Issues",
      options: ["Poor communication", "Very slow responses", "Unhelpful attitude", "Lacked professionalism"],
      subcategories: {
        "Poor communication": ["Never answered calls", "Ignored messages", "Dismissive responses"],
        "Unhelpful attitude": ["Seemed uninterested", "Pushy sales tactics", "Didn't listen to needs"],
        "Lacked professionalism": ["Unprepared for meetings", "Made errors", "Missed commitments"],
      },
    },
    {
      category: "Service Failures",
      options: ["Order issues unresolved", "Wrong recommendations", "Pricing mistakes", "Failed to follow up"],
    },
  ],
  1: [
    {
      category: "Severe Issues",
      options: [
        "Completely unresponsive",
        "Dishonest or misleading",
        "Rude or disrespectful",
        "Caused significant problems",
      ],
      subcategories: {
        "Completely unresponsive": ["Ghosted me entirely", "Never available", "Zero communication"],
        "Dishonest or misleading": ["Lied about products", "Hidden charges", "False promises"],
        "Rude or disrespectful": ["Insulting behavior", "Aggressive attitude", "Unprofessional conduct"],
        "Caused significant problems": ["Major order errors", "Financial loss", "Business disruption"],
      },
    },
    {
      category: "Critical Failures",
      options: ["Request rep change", "Need manager contact", "Considering leaving", "Formal complaint needed"],
    },
  ],
}

export function RepRatingPopup({ isOpen, onClose, repName, repId, customerId, orderId }: RepRatingPopupProps) {
  const [step, setStep] = useState<"rating" | "feedback" | "subcategory" | "additional" | "success">("rating")
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [additionalFeedback, setAdditionalFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSelect = useCallback((rating: number) => {
    setSelectedRating(rating)
    setSelectedTags([])
    setExpandedCategory(null)
    setActiveSubcategory(null)
    setStep("feedback")
  }, [])

  const handleTagToggle = useCallback(
    (tag: string, hasSubcategory: boolean) => {
      if (hasSubcategory) {
        setActiveSubcategory(activeSubcategory === tag ? null : tag)
      } else {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
      }
    },
    [activeSubcategory],
  )

  const handleSubcategorySelect = useCallback((parentTag: string, subTag: string) => {
    const combined = `${parentTag}: ${subTag}`
    setSelectedTags((prev) => {
      const withoutParent = prev.filter((t) => !t.startsWith(parentTag))
      return [...withoutParent, combined]
    })
    setActiveSubcategory(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const result = await submitRepRating({
        customerId,
        repId,
        orderId,
        rating: selectedRating,
        feedbackTags: selectedTags,
        additionalFeedback: additionalFeedback.trim() || undefined,
      })

      if (result.success) {
        setStep("success")
        setTimeout(() => {
          onClose()
          // Reset state
          setStep("rating")
          setSelectedRating(0)
          setSelectedTags([])
          setAdditionalFeedback("")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [customerId, repId, orderId, selectedRating, selectedTags, additionalFeedback, onClose])

  const getRatingLabel = (rating: number) => {
    const labels: Record<number, string> = {
      1: "Very Poor",
      2: "Poor",
      3: "Average",
      4: "Good",
      5: "Excellent",
    }
    return labels[rating] || ""
  }

  const feedbackOptions = FEEDBACK_OPTIONS[selectedRating] || []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg md:inset-x-auto"
          >
            <div className="overflow-hidden rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Rate Your Experience</h2>
                  <p className="text-sm text-foreground/60">with {repName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Star Rating */}
                  {step === "rating" && (
                    <motion.div
                      key="rating"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <p className="text-center text-lg text-foreground/80">How would you rate your experience?</p>

                      {/* Stars */}
                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => handleRatingSelect(star)}
                            className="group relative p-1 transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={cn(
                                "h-12 w-12 transition-all duration-200 md:h-14 md:w-14",
                                (hoveredRating || selectedRating) >= star
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-transparent text-muted-foreground",
                              )}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Rating Label */}
                      <p className="text-center text-lg font-medium text-foreground/60">
                        {hoveredRating ? getRatingLabel(hoveredRating) : "Tap a star to rate"}
                      </p>
                    </motion.div>
                  )}

                  {/* Step 2: Feedback Tags */}
                  {step === "feedback" && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Selected Rating Display */}
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-6 w-6",
                                star <= selectedRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-transparent text-muted-foreground/50",
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-medium text-foreground">{getRatingLabel(selectedRating)}</span>
                      </div>

                      <p className="text-center text-foreground/60">What describes your experience? (tap all that apply)</p>

                      {/* Feedback Categories */}
                      <div className="max-h-[40vh] space-y-4 overflow-y-auto pr-2">
                        {feedbackOptions.map((category) => (
                          <div key={category.category} className="space-y-2">
                            <button
                              onClick={() =>
                                setExpandedCategory(expandedCategory === category.category ? null : category.category)
                              }
                              className="flex w-full items-center justify-between rounded-xl bg-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/10"
                            >
                              <span className="text-sm font-medium uppercase tracking-wider text-foreground/60">
                                {category.category}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-muted-foreground transition-transform",
                                  expandedCategory === category.category && "rotate-90",
                                )}
                              />
                            </button>

                            <AnimatePresence>
                              {expandedCategory === category.category && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-wrap gap-2 py-2">
                                    {category.options.map((option) => {
                                      const hasSubcategory = category.subcategories?.[option]
                                      const isSelected = selectedTags.some((t) => t.startsWith(option))
                                      const isExpanded = activeSubcategory === option

                                      return (
                                        <div key={option} className="relative">
                                          <button
                                            onClick={() => handleTagToggle(option, !!hasSubcategory)}
                                            className={cn(
                                              "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                                              isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-foreground/5 text-foreground hover:bg-foreground/10",
                                            )}
                                          >
                                            {option}
                                            {hasSubcategory && (
                                              <ChevronRight
                                                className={cn(
                                                  "h-3 w-3 transition-transform",
                                                  isExpanded && "rotate-90",
                                                )}
                                              />
                                            )}
                                            {isSelected && !hasSubcategory && <Check className="h-3 w-3" />}
                                          </button>

                                          {/* Subcategory dropdown */}
                                          <AnimatePresence>
                                            {isExpanded && hasSubcategory && (
                                              <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute left-0 top-full z-10 mt-2 min-w-[200px] rounded-xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl"
                                              >
                                                {category.subcategories?.[option]?.map((sub) => (
                                                  <button
                                                    key={sub}
                                                    onClick={() => handleSubcategorySelect(option, sub)}
                                                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground"
                                                  >
                                                    {sub}
                                                  </button>
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Selected Tags Display */}
                      {selectedTags.length > 0 && (
                        <div className="rounded-xl border border-border bg-foreground/5 p-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Selected Feedback
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                              <span key={tag} className="rounded-full bg-foreground/10 px-3 py-1 text-sm text-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setStep("rating")}
                          className="flex-1 rounded-xl border border-border py-4 text-base font-medium text-foreground transition-colors hover:bg-foreground/10"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setStep("additional")}
                          className="flex-1 rounded-xl bg-white py-4 text-base font-bold text-black transition-colors hover:bg-card/90"
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Additional Feedback */}
                  {step === "additional" && (
                    <motion.div
                      key="additional"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <MessageSquare className="h-6 w-6 text-foreground/60" />
                        <span className="text-lg font-medium text-foreground">Anything else to add?</span>
                      </div>

                      <p className="text-center text-sm text-foreground/60">
                        Optional: Share any additional thoughts or details
                      </p>

                      <textarea
                        value={additionalFeedback}
                        onChange={(e) => setAdditionalFeedback(e.target.value)}
                        placeholder="Type your feedback here... (optional)"
                        className="h-32 w-full resize-none rounded-xl border border-border bg-foreground/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-border focus:outline-none focus:ring-0"
                      />

                      {/* Summary */}
                      <div className="rounded-xl border border-border bg-foreground/5 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Your Rating Summary
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-5 w-5",
                                  star <= selectedRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-transparent text-muted-foreground/50",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-foreground/60">{selectedTags.length} feedback items selected</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setStep("feedback")}
                          className="flex-1 rounded-xl border border-border py-4 text-base font-medium text-foreground transition-colors hover:bg-foreground/10"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex-1 rounded-xl bg-white py-4 text-base font-bold text-black transition-colors hover:bg-card/90 disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Rating"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
                      >
                        <Check className="h-10 w-10 text-green-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                      <p className="mt-2 text-center text-foreground/60">Your feedback helps us improve our service</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

