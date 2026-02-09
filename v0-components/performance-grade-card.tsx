"use client"

import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PerformanceGradeCardProps {
  grade: {
    grade: string
    percentage: string
    status: string
    message: string
    color: string
    needsIntervention: boolean
  }
}

export function PerformanceGradeCard({ grade }: PerformanceGradeCardProps) {
  // Map color strings to Tailwind classes
  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          border: "border-green-500",
          bg: "bg-green-500/10",
          text: "text-green-500",
          alert: "border-green-500 bg-green-500/10 text-green-500",
        }
      case "blue":
        return {
          border: "border-blue-500",
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          alert: "border-blue-500 bg-blue-500/10 text-blue-500",
        }
      case "yellow":
        return {
          border: "border-accent-yellow",
          bg: "bg-accent-yellow/10",
          text: "text-accent-yellow",
          alert: "border-accent-yellow bg-accent-yellow/10 text-accent-yellow",
        }
      case "orange":
        return {
          border: "border-orange-500",
          bg: "bg-orange-500/10",
          text: "text-orange-500",
          alert: "border-orange-500 bg-orange-500/10 text-orange-500",
        }
      case "red":
        return {
          border: "border-red-500",
          bg: "bg-red-500/10",
          text: "text-red-500",
          alert: "border-red-500 bg-red-500/10 text-red-500",
        }
      default:
        return {
          border: "border-border",
          bg: "bg-muted",
          text: "text-muted-foreground",
          alert: "border-border bg-muted text-muted-foreground",
        }
    }
  }

  const colors = getColorClasses(grade.color)

  return (
    <Card className={`p-6 rounded-lg border-2 ${colors.border}`}>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Performance Grade</h3>

        <div className={`p-8 rounded-lg ${colors.bg} mb-4`}>
          <div className={`text-6xl font-bold mb-2 ${colors.text}`}>{grade.grade}</div>
          <div className={`text-3xl font-semibold ${colors.text}`}>{grade.percentage}</div>
        </div>

        <p className="text-lg px-4 text-foreground">{grade.message}</p>

        {grade.needsIntervention && (
          <div
            className={`mt-4 p-3 border rounded-md text-sm font-semibold flex items-center justify-center gap-2 ${colors.alert}`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Intervention Required</span>
          </div>
        )}
      </div>
    </Card>
  )
}
