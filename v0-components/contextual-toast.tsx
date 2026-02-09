"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
  x: number
  y: number
}

type ToastListener = (toast: Omit<Toast, "id">) => void

class ToastManager {
  private listeners: ToastListener[] = []

  subscribe(listener: ToastListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private emit(toast: Omit<Toast, "id">) {
    this.listeners.forEach((listener) => listener(toast))
  }

  success(message: string, event?: React.MouseEvent) {
    const position = this.getPosition(event)
    this.emit({ message, type: "success", ...position })
  }

  error(message: string, event?: React.MouseEvent) {
    const position = this.getPosition(event)
    this.emit({ message, type: "error", ...position })
  }

  private getPosition(event?: React.MouseEvent): { x: number; y: number } {
    if (!event) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }
  }
}

export const contextualToast = new ToastManager()

export function ContextualToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = contextualToast.subscribe((toast) => {
      const id = Math.random().toString(36).substring(7)
      const newToast = { ...toast, id }

      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 2000)
    })

    return unsubscribe
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="absolute pointer-events-auto animate-slideUp"
          style={{
            left: `${toast.x}px`,
            top: `${toast.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border ${
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100"
                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
