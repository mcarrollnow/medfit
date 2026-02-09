"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Send, Printer, Pencil, Loader2 } from "lucide-react"

interface InvoiceActionsProps {
  onEdit?: () => void
  invoiceRef?: React.RefObject<HTMLDivElement | null>
  invoiceNumber?: string
  // Customer-facing props
  invoiceId?: string
  paymentUrl?: string
  total?: number
  isPaid?: boolean
  isHidden?: boolean // Hidden invoices have no payment capability
}

const OKLCH_TO_HEX: Record<string, string> = {
  "oklch(0.08 0 0)": "#121212",
  "oklch(0.1 0 0)": "#1a1a1a",
  "oklch(0.12 0 0)": "#1f1f1f",
  "oklch(0.15 0 0)": "#262626",
  "oklch(0.2 0 0)": "#333333",
  "oklch(0.25 0 0)": "#404040",
  "oklch(0.3 0 0)": "#4d4d4d",
  "oklch(0.35 0 0)": "#595959",
  "oklch(0.4 0 0)": "#666666",
  "oklch(0.45 0 0)": "#737373",
  "oklch(0.5 0 0)": "#808080",
  "oklch(0.55 0 0)": "#8c8c8c",
  "oklch(0.6 0 0)": "#999999",
  "oklch(0.65 0 0)": "#a6a6a6",
  "oklch(0.7 0 0)": "#b3b3b3",
  "oklch(0.75 0 0)": "#bfbfbf",
  "oklch(0.8 0 0)": "#cccccc",
  "oklch(0.85 0 0)": "#d9d9d9",
  "oklch(0.9 0 0)": "#e6e6e6",
  "oklch(0.95 0 0)": "#f2f2f2",
  "oklch(1 0 0)": "#ffffff",
}

export function InvoiceActions({ onEdit, invoiceRef, invoiceNumber = "INV-001", invoiceId, paymentUrl, total, isPaid, isHidden }: InvoiceActionsProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  
  // Customer-facing view (with invoice ID or payment URL)
  const isCustomerView = !!invoiceId || !!paymentUrl || isPaid !== undefined
  
  // Can pay only if not hidden and has payment URL or invoice ID with payment capability
  const canPay = !isHidden && (!!paymentUrl || !!invoiceId)

  // Navigate to embedded payment form
  const handlePayNow = () => {
    if (invoiceId) {
      // Use embedded Accept.js payment form
      window.location.href = `/invoice/${invoiceId}/pay`
    } else if (paymentUrl) {
      // Fallback to hosted payment URL
      window.open(paymentUrl, '_blank')
    }
  }

  const convertOklchToHex = (colorStr: string): string => {
    // Direct lookup
    const normalized = colorStr.replace(/\s+/g, " ").trim()
    if (OKLCH_TO_HEX[normalized]) {
      return OKLCH_TO_HEX[normalized]
    }

    // Try to parse and approximate
    const match = colorStr.match(/oklch$$([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)$$/)
    if (match) {
      const lightness = Number.parseFloat(match[1])
      // For grayscale (chroma = 0), lightness maps directly to gray
      const gray = Math.round(lightness * 255)
      return `rgb(${gray}, ${gray}, ${gray})`
    }

    return colorStr
  }

  const applyHexColorsToElement = (element: HTMLElement) => {
    const computed = window.getComputedStyle(element)

    // Get computed color values and convert if they contain oklch
    const color = computed.color
    const bgColor = computed.backgroundColor
    const borderColor = computed.borderColor

    // Apply direct hex colors as inline styles
    if (color.includes("oklch")) {
      element.style.color = convertOklchToHex(color)
    } else if (color.startsWith("rgb")) {
      element.style.color = color
    }

    if (bgColor.includes("oklch")) {
      element.style.backgroundColor = convertOklchToHex(bgColor)
    } else if (bgColor.startsWith("rgb") && bgColor !== "rgba(0, 0, 0, 0)") {
      element.style.backgroundColor = bgColor
    }

    if (borderColor.includes("oklch")) {
      element.style.borderColor = convertOklchToHex(borderColor)
    }

    // Process children
    Array.from(element.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        applyHexColorsToElement(child)
      }
    })
  }

  const handleDownloadPdf = async () => {
    if (!invoiceRef?.current) return

    setIsGeneratingPdf(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const clone = invoiceRef.current.cloneNode(true) as HTMLElement
      clone.style.position = "absolute"
      clone.style.left = "-9999px"
      clone.style.top = "0"
      clone.style.width = `${invoiceRef.current.offsetWidth}px`
      clone.style.backgroundColor = "#121212"
      document.body.appendChild(clone)

      // Apply hex colors recursively
      applyHexColorsToElement(clone)

      clone.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          const computed = window.getComputedStyle(el)
          // Force text color if it contains oklch
          if (computed.color.includes("oklch") || computed.color === "") {
            el.style.color = "#e6e6e6"
          }
          // Handle background
          if (computed.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#1a1a1a"
          }
        }
      })

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#121212",
        logging: false,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style")
          style.textContent = `
            * {
              color: inherit !important;
            }
          `
          clonedDoc.head.appendChild(style)
        },
      })

      document.body.removeChild(clone)

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`${invoiceNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Customer-facing view - show Pay Now button
  if (isCustomerView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-4 mt-8 print:hidden"
      >
        {isPaid ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-8 py-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-mono text-sm tracking-widest uppercase text-emerald-400">Paid</span>
          </div>
        ) : canPay ? (
          <button
            onClick={handlePayNow}
            className="bg-foreground text-background rounded-2xl px-8 py-4 flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span className="font-mono text-sm tracking-widest uppercase">
              Pay Now {total ? `$${total.toLocaleString()}` : ''}
            </span>
          </button>
        ) : null}

        <button
          onClick={handlePrint}
          className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span className="font-mono text-sm tracking-widest uppercase">Print</span>
        </button>
      </motion.div>
    )
  }

  // Admin/editor view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="flex flex-wrap justify-center gap-4 mt-8 print:hidden"
    >
      {onEdit && (
        <button onClick={onEdit} className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer">
          <Pencil className="w-5 h-5" />
          <span className="font-mono text-sm tracking-widest uppercase">Edit</span>
        </button>
      )}

      <button
        onClick={handleDownloadPdf}
        disabled={isGeneratingPdf}
        className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer disabled:opacity-50"
      >
        {isGeneratingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        <span className="font-mono text-sm tracking-widest uppercase">
          {isGeneratingPdf ? "Generating..." : "Download PDF"}
        </span>
      </button>

      <button className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer">
        <Send className="w-5 h-5" />
        <span className="font-mono text-sm tracking-widest uppercase">Send Invoice</span>
      </button>

      <button
        onClick={handlePrint}
        className="glass-button rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer"
      >
        <Printer className="w-5 h-5" />
        <span className="font-mono text-sm tracking-widest uppercase">Print</span>
      </button>
    </motion.div>
  )
}
