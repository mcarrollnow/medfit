"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X, Download, Printer, Image as ImageIcon, Loader2 } from "lucide-react"

interface ReceiptModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  // Get the actual payment timestamp from original order data
  const getPaymentTimestamp = () => {
    const originalOrder = order._original || {}
    const timestamp = originalOrder.payment_verified_at || 
                     originalOrder.payment_date || 
                     originalOrder.created_at ||
                     order.date
    return timestamp
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) {
      return { date: "N/A", time: "N/A" }
    }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return { date: dateString, time: "" }
    }
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }
  }

  const paymentTimestamp = getPaymentTimestamp()
  const { date: formattedDate, time: formattedTime } = formatDateTime(paymentTimestamp)

  // Generate export-friendly HTML with white background
  const generateExportHTML = () => {
    const items = order.items?.map((item: any) => `
      <div class="item" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
          <p class="item-name" style="font-size: 14px; font-weight: 600; margin: 0;">${item.name}</p>
          <p style="font-size: 11px; color: #666; margin: 2px 0 0 0;">Qty: ${item.quantity}</p>
        </div>
        <p class="item-price" style="font-family: monospace; font-size: 15px; font-weight: 700; margin: 0;">${item.price}</p>
      </div>
    `).join('') || ''

    const transactionHashSection = order.payment?.hash && order.payment.hash !== 'N/A' ? `
      <div class="section" style="margin-bottom: 24px; border-radius: 12px; border: 1px solid #e5e5e5; background: #f9f9f9; padding: 16px;">
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Transaction Hash</p>
        <p style="font-family: monospace; font-size: 11px; line-height: 1.5; color: #333; word-break: break-all; margin: 0;">${order.payment.hash}</p>
      </div>
    ` : ''

    const trackingSection = order.tracking?.number && order.tracking.number !== 'Pending' ? `
      <div class="section" style="margin-bottom: 24px; border-radius: 12px; border: 1px solid #e5e5e5; background: #f9f9f9; padding: 16px;">
        <h3 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Shipping Details</h3>
        <div style="margin-bottom: 8px;">
          <p style="font-size: 10px; color: #666; margin: 0;">Carrier</p>
          <p style="font-size: 14px; font-weight: 600; margin: 2px 0 0 0;">${order.tracking.carrier}</p>
        </div>
        <div>
          <p style="font-size: 10px; color: #666; margin: 0;">Tracking Number</p>
          <p style="font-family: monospace; font-size: 13px; font-weight: 700; margin: 2px 0 0 0;">${order.tracking.number}</p>
        </div>
      </div>
    ` : ''

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Receipt - ${order.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
              background: #ffffff; 
              color: #000000; 
              padding: 48px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              @page {
                size: letter;
                margin: 0.4in;
              }
              body { 
                padding: 0;
                font-size: 11px;
              }
              h1 { font-size: 24px !important; }
              .receipt-header { margin-bottom: 20px !important; }
              .receipt-info { margin-bottom: 16px !important; gap: 12px !important; }
              .receipt-info p { font-size: 12px !important; }
              .receipt-info .label { font-size: 9px !important; }
              .section { margin-bottom: 16px !important; padding: 12px !important; }
              .items-section { margin-bottom: 16px !important; }
              .item { padding-bottom: 8px !important; margin-bottom: 8px !important; }
              .item-name { font-size: 13px !important; }
              .item-price { font-size: 14px !important; }
              .totals { margin-bottom: 16px !important; padding-top: 12px !important; }
              .total-row { font-size: 13px !important; margin-bottom: 6px !important; }
              .grand-total { font-size: 16px !important; padding-top: 8px !important; }
              .rewards { margin-bottom: 16px !important; padding: 12px !important; }
              .rewards-value { font-size: 20px !important; }
              .footer { padding-top: 16px !important; }
              .footer p { font-size: 9px !important; }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <div class="receipt-header" style="margin-bottom: 32px; text-align: center;">
              <h1 style="margin-bottom: 6px; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">MODERN HEALTH PRO</h1>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Research Peptides Receipt</p>
              <div style="width: 80px; height: 1px; background: #ccc; margin: 16px auto 0;"></div>
            </div>

            <!-- Receipt Info -->
            <div class="receipt-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <p class="label" style="margin-bottom: 2px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Receipt Number</p>
                <p style="font-family: monospace; font-size: 14px; font-weight: 700;">${order.id}</p>
              </div>
              <div>
                <p class="label" style="margin-bottom: 2px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Transaction Date & Time</p>
                <p style="font-family: monospace; font-size: 14px; font-weight: 700;">${formattedDate}</p>
                ${formattedTime ? `<p style="font-family: monospace; font-size: 11px; color: #666;">${formattedTime}</p>` : ''}
              </div>
              <div>
                <p class="label" style="margin-bottom: 2px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Payment Method</p>
                <p style="font-size: 14px; font-weight: 600;">${order.payment?.method || 'Crypto'}</p>
              </div>
              <div>
                <p class="label" style="margin-bottom: 2px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Status</p>
                <p style="font-size: 14px; font-weight: 600;">${order.status}</p>
              </div>
            </div>

            <!-- Transaction Hash -->
            ${transactionHashSection}

            <!-- Items -->
            <div class="items-section" style="margin-bottom: 24px;">
              <h3 style="margin-bottom: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666;">Order Items</h3>
              ${items}
            </div>

            <!-- Totals -->
            <div class="totals" style="margin-bottom: 24px; border-top: 1px solid #e5e5e5; padding-top: 16px;">
              <div class="total-row" style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                <span style="color: #666;">Subtotal</span>
                <span style="font-family: monospace; font-weight: 600;">${order.total}</span>
              </div>
              <div class="total-row" style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                <span style="color: #666;">Shipping</span>
                <span style="font-family: monospace; font-weight: 600;">$0.00</span>
              </div>
              <div class="grand-total" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e5e5; padding-top: 12px; font-size: 18px;">
                <span style="font-weight: 700;">Total Paid</span>
                <span style="font-family: monospace; font-weight: 700;">${order.payment?.amount || order.total}</span>
              </div>
            </div>

            <!-- Rewards Points -->
            <div class="rewards section" style="margin-bottom: 24px; border-radius: 12px; border: 1px solid #e5e5e5; background: #f9f9f9; padding: 16px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Rewards Earned</p>
              <p class="rewards-value" style="font-size: 24px; font-weight: 700; margin: 0;">+${order.points_earned || 0} Points</p>
            </div>

            <!-- Tracking Info -->
            ${trackingSection}

            <!-- Footer -->
            <div class="footer" style="border-top: 1px solid #e5e5e5; padding-top: 20px; text-align: center;">
              <p style="font-size: 10px; line-height: 1.5; color: #666; margin: 0;">
                For research purposes only. Not for human consumption.<br>
                Thank you for your purchase from Modern Health Pro.
              </p>
              <div style="width: 48px; height: 1px; background: #ccc; margin: 12px auto;"></div>
              <p style="font-size: 9px; color: #999; margin: 0;">Questions? Contact support@modernhealthpro.com</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(generateExportHTML())
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    setExportType('pdf')

    try {
      const html2canvasModule = await import('html2canvas')
      const html2canvas = html2canvasModule.default || html2canvasModule
      const jspdfModule = await import('jspdf')
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default

      // Create an iframe to completely isolate from page styles
      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 800px; height: 2000px; border: none;'
      document.body.appendChild(iframe)
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) throw new Error('Could not access iframe document')
      
      iframeDoc.open()
      iframeDoc.write(generateExportHTML())
      iframeDoc.close()

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 100))

      const content = iframeDoc.body
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
      })

      document.body.removeChild(iframe)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`receipt-${order.id}.pdf`)
    } catch (error: any) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message}`)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const handleDownloadPNG = async () => {
    setIsExporting(true)
    setExportType('png')

    try {
      const html2canvasModule = await import('html2canvas')
      const html2canvas = html2canvasModule.default || html2canvasModule

      // Create an iframe to completely isolate from page styles
      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 800px; height: 2000px; border: none;'
      document.body.appendChild(iframe)
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) throw new Error('Could not access iframe document')
      
      iframeDoc.open()
      iframeDoc.write(generateExportHTML())
      iframeDoc.close()

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 100))

      const content = iframeDoc.body
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
      })

      document.body.removeChild(iframe)

      const link = document.createElement('a')
      link.download = `receipt-${order.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error: any) {
      console.error('Error generating PNG:', error)
      alert(`Error generating PNG: ${error.message}`)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border p-0">
        <VisuallyHidden>
          <DialogTitle>Receipt for Order {order.id}</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 rounded-lg p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Receipt content - Display version (dark theme) */}
          <div className="receipt-content p-12 text-foreground">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-2 text-4xl font-bold tracking-tight">MODERN HEALTH PRO</h1>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">Research Peptides Receipt</p>
              <div className="mx-auto mt-6 h-px w-24 bg-foreground/20" />
            </div>

            {/* Receipt Info */}
            <div className="mb-10 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Receipt Number</p>
                <p className="font-mono text-lg font-bold">{order.id}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Transaction Date & Time</p>
                <p className="font-mono text-lg font-bold">{formattedDate}</p>
                {formattedTime && <p className="font-mono text-sm text-foreground/60">{formattedTime}</p>}
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Payment Method</p>
                <p className="text-lg font-semibold">{order.payment?.method || 'Crypto'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">{order.status}</p>
              </div>
            </div>

            {/* Transaction Hash */}
            {order.payment?.hash && order.payment.hash !== 'N/A' && (
            <div className="mb-10 rounded-2xl border border-border bg-foreground/5 p-6">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Transaction Hash</p>
              <p className="font-mono text-sm leading-relaxed text-foreground/80 break-all">{order.payment.hash}</p>
            </div>
            )}

            {/* Items */}
            <div className="mb-10">
              <h3 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-start justify-between border-b border-border pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="text-lg font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-mono text-xl font-bold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="mb-10 space-y-3 border-t border-border pt-6">
              <div className="flex justify-between text-lg">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-mono font-semibold">{order.total}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-foreground/60">Shipping</span>
                <span className="font-mono font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 text-2xl">
                <span className="font-bold">Total Paid</span>
                <span className="font-mono font-bold">{order.payment?.amount || order.total}</span>
              </div>
            </div>

            {/* Rewards Points */}
            <div className="mb-10 rounded-2xl border border-border bg-foreground/5 p-6 text-center">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Rewards Earned</p>
              <p className="text-3xl font-bold">+{order.points_earned || 0} Points</p>
            </div>

            {/* Tracking Info */}
            {order.tracking && order.tracking.number && order.tracking.number !== 'Pending' && (
              <div className="mb-10 rounded-2xl border border-border bg-foreground/5 p-6">
                <h3 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Shipping Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Carrier</p>
                    <p className="text-lg font-semibold">{order.tracking.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tracking Number</p>
                    <p className="font-mono text-base font-bold">{order.tracking.number}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border pt-8 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                For research purposes only. Not for human consumption.
                <br />
                Thank you for your purchase from Modern Health Pro.
              </p>
              <div className="mx-auto mt-6 h-px w-16 bg-foreground/20" />
              <p className="mt-4 text-xs text-muted-foreground/50">Questions? Contact support@modernhealthpro.com</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border bg-foreground/5 p-6">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handlePrint}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent py-3 text-sm font-bold text-foreground transition-all hover:bg-foreground/10 disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent py-3 text-sm font-bold text-foreground transition-all hover:bg-foreground/10 disabled:opacity-50"
              >
                {isExporting && exportType === 'png' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                Save PNG
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:bg-card/90 disabled:opacity-50"
              >
                {isExporting && exportType === 'pdf' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Save PDF
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
