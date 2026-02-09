"use client"

import { Check, X, AlertCircle } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
  className?: string
}

type StrengthLevel = "very_weak" | "weak" | "fair" | "good" | "strong"

interface StrengthResult {
  score: number
  level: StrengthLevel
  label: string
  color: string
  bgColor: string
}

// Common passwords list (subset for demo)
const COMMON_PASSWORDS = [
  "password",
  "123456",
  "12345678",
  "qwerty",
  "abc123",
  "monkey",
  "1234567",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "passw0rd",
  "shadow",
  "123123",
  "654321",
  "superman",
  "qazwsx",
  "michael",
  "football",
]

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  className = "",
}: PasswordStrengthIndicatorProps) {
  if (!password) return null

  // Calculate strength score
  const calculateStrength = (): StrengthResult => {
    let score = 0

    // Length scoring
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 20
    if (password.length >= 16) score += 10

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^a-zA-Z0-9]/.test(password)) score += 20

    // Penalize common passwords
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      score = Math.min(score, 20)
    }

    // Map score to level
    let level: StrengthLevel
    let label: string
    let color: string
    let bgColor: string

    if (score < 30) {
      level = "very_weak"
      label = "Very Weak"
      color = "text-red-500"
      bgColor = "bg-red-500"
    } else if (score < 50) {
      level = "weak"
      label = "Weak"
      color = "text-red-400"
      bgColor = "bg-red-400"
    } else if (score < 70) {
      level = "fair"
      label = "Fair"
      color = "text-yellow-500"
      bgColor = "bg-yellow-500"
    } else if (score < 90) {
      level = "good"
      label = "Good"
      color = "text-green-400"
      bgColor = "bg-green-400"
    } else {
      level = "strong"
      label = "Strong"
      color = "text-green-500"
      bgColor = "bg-green-500"
    }

    return { score, level, label, color, bgColor }
  }

  const strength = calculateStrength()
  const isCommonPassword = COMMON_PASSWORDS.includes(password.toLowerCase())

  // Requirements checks
  const requirements = [
    { met: password.length >= 12, text: "At least 12 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[a-z]/.test(password), text: "One lowercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
    { met: /[^a-zA-Z0-9]/.test(password), text: "One special character" },
  ]

  return (
    <div className={className}>
      {/* Strength Bar */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Password Strength</span>
          <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.bgColor} transition-all duration-300`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Common Password Warning */}
      {isCommonPassword && (
        <div className="p-2 rounded-md border border-red-500 bg-red-500/10 mb-2 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">
            This is a commonly used password. Please choose a more unique password.
          </p>
        </div>
      )}

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1">
          <p className="text-sm font-medium mb-2">Password Requirements</p>
          <div className="grid grid-cols-1 gap-1">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )}
                <span className={req.met ? "text-foreground" : "text-muted-foreground"}>{req.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
