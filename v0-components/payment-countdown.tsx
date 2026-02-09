"use client"

import { useState, useEffect } from "react"

interface PaymentCountdownProps {
  initiatedAt: string
  durationSeconds?: number
}

export function PaymentCountdown({
  initiatedAt,
  durationSeconds = 60, // Default 60 seconds for blockchain confirmation UX
}: PaymentCountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    const calculateRemaining = () => {
      const initiated = new Date(initiatedAt).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - initiated) / 1000)
      const remaining = Math.max(0, durationSeconds - elapsed)
      setRemainingSeconds(remaining)
    }

    // Calculate immediately
    calculateRemaining()

    // Update every second
    const interval = setInterval(calculateRemaining, 1000)

    return () => clearInterval(interval)
  }, [initiatedAt, durationSeconds])

  const formatTime = (seconds: number) => {
    return `${seconds}s`
  }

  const getColorClass = () => {
    if (remainingSeconds === 0) return "text-green-500"
    if (remainingSeconds < 10) return "text-yellow-500"
    return "text-foreground"
  }

  return (
    <div className="text-center">
      <div className={`text-4xl font-bold mb-2 ${getColorClass()}`}>
        {remainingSeconds === 0 ? "✓" : formatTime(remainingSeconds)}
      </div>
      <div className="text-sm text-muted-foreground">
        {remainingSeconds === 0 ? "Transaction confirmed" : "Confirming transaction..."}
      </div>
    </div>
  )
}
