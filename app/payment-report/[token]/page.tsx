"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { 
  Lock, Check, X, Download, Copy, Printer, Mail, MessageSquare,
  ArrowRight, FileText, ExternalLink, Shield, DollarSign, Calendar,
  User, Hash, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Commission {
  id: string
  order_total: number
  commission_rate: number
  commission_amount: number
  created_at: string
  order?: {
    id: string
    status: string
    created_at: string
  }
}

interface PaymentData {
  id: string
  amount: number
  currency: string
  transaction_hash: string
  recipient_address: string
  status: string
  notes?: string
  completed_at: string
  created_at: string
  rep: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  admin?: {
    first_name: string
    last_name: string
  }
  commissions: Array<{ commission: Commission }>
}

export default function PaymentReportPage() {
  const params = useParams()
  const token = params.token as string
  
  const [pin, setPin] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleVerify = async () => {
    if (pin.length < 4) {
      setError("Please enter your wallet PIN")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/payment-report/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, pin }),
      })

      const data = await response.json()

      if (data.success) {
        setPayment(data.payment)
        setIsVerified(true)
      } else {
        setError(data.error || "Invalid PIN")
      }
    } catch (e) {
      setError("Failed to verify. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    // Use browser print to PDF functionality
    window.print()
  }

  const handleDownloadCSV = () => {
    if (!payment) return

    const commissions = payment.commissions.map(c => c.commission)
    const csvContent = [
      ["Commission Payment Report"],
      [""],
      ["Payment Details"],
      ["Amount", `$${payment.amount.toFixed(2)} ${payment.currency}`],
      ["Transaction Hash", payment.transaction_hash],
      ["Date", format(new Date(payment.completed_at), "PPpp")],
      ["Recipient", `${payment.rep.first_name} ${payment.rep.last_name}`],
      ["Wallet Address", payment.recipient_address],
      [""],
      ["Commission Breakdown"],
      ["Order ID", "Order Total", "Commission Rate", "Commission Amount", "Date"],
      ...commissions.map(c => [
        c.order?.id || "N/A",
        `$${c.order_total.toFixed(2)}`,
        `${c.commission_rate}%`,
        `$${c.commission_amount.toFixed(2)}`,
        format(new Date(c.created_at), "PP")
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `commission-payment-${payment.id.slice(0, 8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyText = () => {
    if (!payment) return

    const commissions = payment.commissions.map(c => c.commission)
    const text = `
Commission Payment Report
=========================

Payment Details
---------------
Amount: $${payment.amount.toFixed(2)} ${payment.currency}
Transaction Hash: ${payment.transaction_hash}
Date: ${format(new Date(payment.completed_at), "PPpp")}
Recipient: ${payment.rep.first_name} ${payment.rep.last_name}
Wallet Address: ${payment.recipient_address}
Status: ${payment.status}

Commission Breakdown
--------------------
${commissions.map(c => `
Order: ${c.order?.id || "N/A"}
Order Total: $${c.order_total.toFixed(2)}
Commission Rate: ${c.commission_rate}%
Commission Amount: $${c.commission_amount.toFixed(2)}
Date: ${format(new Date(c.created_at), "PP")}
`).join("\n")}

Total: $${payment.amount.toFixed(2)}
    `.trim()

    copyToClipboard(text, "report")
  }

  const handleSendEmail = () => {
    if (!payment) return
    
    const subject = encodeURIComponent(`Commission Payment Receipt - $${payment.amount.toFixed(2)}`)
    const body = encodeURIComponent(`View your commission payment details at:\n${window.location.href}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleSendSMS = () => {
    if (!payment) return
    
    const message = encodeURIComponent(`Your commission payment of $${payment.amount.toFixed(2)} - View details: ${window.location.href}`)
    window.open(`sms:?body=${message}`)
  }

  // Access Code Entry Screen
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Payment Report</h1>
                <p className="text-muted-foreground">
                  Enter your PIN to view payment details
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* PIN Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    placeholder="Enter PIN"
                    maxLength={12}
                    className="h-16 pl-12 bg-foreground/5 border-border rounded-xl text-foreground text-center text-2xl tracking-[0.5em] font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || pin.length < 4}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold text-lg disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      View Report
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-muted-foreground text-sm">
                Use the PIN you set up for your wallet
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Payment Report Screen
  return (
    <div className="min-h-screen bg-background">
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .bg-white\\/5, .bg-white\\/10 { background: #f5f5f5 !important; }
          .text-foreground { color: black !important; }
          .text-foreground\\/50, .text-foreground\\/60, .text-foreground\\/40 { color: #666 !important; }
          .border-primary\\/10, .border-primary\\/20 { border-color: #ddd !important; }
        }
      `}</style>

      <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-8" ref={reportRef}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">Payment Report</h1>
              <Badge className={cn(
                "rounded-full",
                payment?.status === "completed" 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              )}>
                {payment?.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {payment?.completed_at && format(new Date(payment.completed_at), "PPpp")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 no-print">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="h-10 bg-foreground/5 border-border hover:bg-foreground/10 rounded-xl"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              className="h-10 bg-foreground/5 border-border hover:bg-foreground/10 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="h-10 bg-foreground/5 border-border hover:bg-foreground/10 rounded-xl"
            >
              {copied === "report" ? (
                <><Check className="h-4 w-4 mr-2" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" /> Copy</>
              )}
            </Button>
            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="h-10 bg-foreground/5 border-border hover:bg-foreground/10 rounded-xl"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={handleSendSMS}
              variant="outline"
              className="h-10 bg-foreground/5 border-border hover:bg-foreground/10 rounded-xl"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Text
            </Button>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Amount */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Payment Amount</p>
                <p className="text-5xl font-bold text-foreground">
                  ${payment?.amount.toFixed(2)}
                  <span className="text-xl text-muted-foreground ml-2">{payment?.currency}</span>
                </p>
              </div>

              {/* Recipient */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-foreground/60" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {payment?.rep.first_name} {payment?.rep.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{payment?.rep.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Hash */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Transaction Hash
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-foreground bg-foreground/5 px-3 py-2 rounded-lg break-all">
                    {payment?.transaction_hash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(payment?.transaction_hash || "", "hash")}
                    className="p-2 rounded-lg hover:bg-foreground/10 no-print"
                  >
                    {copied === "hash" ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <a
                    href={`https://etherscan.io/tx/${payment?.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-foreground/10 no-print"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-foreground bg-foreground/5 px-3 py-2 rounded-lg break-all">
                    {payment?.recipient_address}
                  </code>
                  <button
                    onClick={() => copyToClipboard(payment?.recipient_address || "", "address")}
                    className="p-2 rounded-lg hover:bg-foreground/10 no-print"
                  >
                    {copied === "address" ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-foreground mb-6">Commission Breakdown</h2>
            
            <div className="space-y-4">
              {payment?.commissions.map(({ commission }, index) => (
                <div
                  key={commission.id}
                  className="p-4 rounded-xl bg-foreground/5 border border-border"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-foreground/60" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Order #{commission.order?.id?.slice(0, 8) || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(commission.created_at), "PP")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Order Total</p>
                        <p className="text-foreground font-medium">${commission.order_total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rate</p>
                        <p className="text-foreground font-medium">{commission.commission_rate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Commission</p>
                        <p className="text-emerald-400 font-bold">
                          ${commission.commission_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
              <p className="text-lg font-semibold text-foreground">Total Payment</p>
              <p className="text-2xl font-bold text-emerald-400">
                ${payment?.amount.toFixed(2)} {payment?.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {payment?.notes && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
              <p className="text-foreground">{payment.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm py-8">
          <p>This payment report was generated automatically.</p>
          <p>For questions, contact support.</p>
        </div>
      </div>
    </div>
  )
}

