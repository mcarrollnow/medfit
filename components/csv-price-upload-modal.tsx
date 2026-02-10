"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  X,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  Loader2,
  ChevronDown,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { bulkUpdatePrices, type PriceType } from "@/app/actions/inventory"

interface ParsedPriceRow {
  original_name: string
  matched_product_id: string | null
  matched_product_name: string | null
  matched_variant: string | null
  price: number
  confidence: "high" | "medium" | "low" | "no_match"
  alternatives?: Array<{ id: string; name: string; variant: string }>
  // For UI state
  selected_product_id?: string | null
  include: boolean
}

interface CSVPriceUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PRICE_TYPES: { value: PriceType; label: string; description: string; color: string }[] = [
  { value: "cost_price", label: "Cost Price", description: "Your acquisition cost", color: "bg-blue-500/20 border-blue-500/40 text-blue-400" },
  { value: "b2b_price", label: "B2B Price", description: "Wholesale/business pricing", color: "bg-green-500/20 border-green-500/40 text-green-400" },
  { value: "retail_price", label: "Retail Price", description: "Customer-facing price", color: "bg-purple-500/20 border-purple-500/40 text-purple-400" },
  { value: "supplier_price", label: "Supplier Price", description: "Admin-only supplier cost", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
]

export function CSVPriceUploadModal({ isOpen, onClose, onSuccess }: CSVPriceUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<"upload" | "review" | "applying">("upload")
  const [priceType, setPriceType] = useState<PriceType>("supplier_price")
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [csvContent, setCsvContent] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [parsedRows, setParsedRows] = useState<ParsedPriceRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ updated: number } | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)

    try {
      // Check if it's a PDF or image - these need base64 encoding for AI vision
      const isPdfOrImage = file.type === "application/pdf" || file.type.startsWith("image/")
      
      if (isPdfOrImage) {
        // Convert to base64 for vision API
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          setCsvContent(base64) // Store base64 data URL
        }
        reader.onerror = () => setError("Failed to read file")
        reader.readAsDataURL(file)
      } else {
        // Text-based file
        const text = await file.text()
        setCsvContent(text)
      }
    } catch (err) {
      setError("Failed to read file")
    }
  }

  const handleParse = async () => {
    if (!csvContent) {
      setError("Please upload a CSV file first")
      return
    }

    setIsParsing(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/inventory/parse-csv-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv_content: csvContent,
          price_type: priceType,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Failed to parse CSV")
        return
      }

      // Initialize UI state for each row
      const rowsWithState: ParsedPriceRow[] = data.parsed_rows.map((row: ParsedPriceRow) => ({
        ...row,
        selected_product_id: row.matched_product_id,
        include: row.confidence !== "no_match" && row.matched_product_id !== null,
      }))

      setParsedRows(rowsWithState)
      setStep("review")
    } catch (err) {
      setError("Failed to parse CSV. Please try again.")
    } finally {
      setIsParsing(false)
    }
  }

  const handleApplyPrices = async () => {
    const rowsToApply = parsedRows.filter(r => r.include && r.selected_product_id)

    if (rowsToApply.length === 0) {
      setError("No products selected to update")
      return
    }

    setIsApplying(true)
    setStep("applying")
    setError(null)

    try {
      const updates = rowsToApply.map(row => ({
        product_id: row.selected_product_id!,
        price: row.price,
      }))

      const result = await bulkUpdatePrices(updates, priceType)

      if (result.success) {
        setResult({ updated: result.updated })
        onSuccess()
      } else {
        setError(result.error || "Failed to update prices")
        setStep("review")
      }
    } catch (err) {
      setError("Failed to apply prices")
      setStep("review")
    } finally {
      setIsApplying(false)
    }
  }

  const toggleRowInclude = (index: number) => {
    setParsedRows(prev => prev.map((row, i) => 
      i === index ? { ...row, include: !row.include } : row
    ))
  }

  const selectAlternative = (rowIndex: number, productId: string, productName: string, variant: string) => {
    setParsedRows(prev => prev.map((row, i) => 
      i === rowIndex ? { 
        ...row, 
        selected_product_id: productId,
        matched_product_name: productName,
        matched_variant: variant,
        include: true,
        confidence: "medium" as const
      } : row
    ))
  }

  const handleClose = () => {
    setStep("upload")
    setCsvContent("")
    setFileName("")
    setParsedRows([])
    setError(null)
    setResult(null)
    onClose()
  }

  const matchedCount = parsedRows.filter(r => r.include && r.selected_product_id).length
  const totalRows = parsedRows.length
  const selectedPriceType = PRICE_TYPES.find(p => p.value === priceType)!

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Import Prices</h2>
                <p className="text-sm text-muted-foreground">Upload any file with product names and prices</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === "upload" && (
              <div className="space-y-6">
                {/* Price Type Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/70">Price Type to Update</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-xl border p-4 transition-all",
                        selectedPriceType.color
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium">{selectedPriceType.label}</p>
                          <p className="text-xs opacity-70">{selectedPriceType.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={cn("h-5 w-5 transition-transform", showPriceDropdown && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {showPriceDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-border rounded-xl overflow-hidden z-10"
                        >
                          {PRICE_TYPES.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => {
                                setPriceType(type.value)
                                setShowPriceDropdown(false)
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-4 hover:bg-foreground/5 transition-colors text-left",
                                priceType === type.value && "bg-foreground/5"
                              )}
                            >
                              <div className={cn("w-3 h-3 rounded-full", type.color.split(" ")[0])} />
                              <div>
                                <p className="font-medium text-foreground">{type.label}</p>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                              </div>
                              {priceType === type.value && (
                                <Check className="h-4 w-4 text-foreground ml-auto" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* File Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                    csvContent
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-border hover:border-border hover:bg-foreground/5"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="*/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {csvContent ? (
                    <>
                      <FileSpreadsheet className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground">{fileName}</p>
                      <p className="text-sm text-muted-foreground mt-1">Click to choose a different file</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground">Drop your file here</p>
                      <p className="text-sm text-muted-foreground mt-1">or click to browse (any format)</p>
                    </>
                  )}
                </div>

                {/* Format Guide */}
                <div className="rounded-xl bg-foreground/5 border border-border p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Supported Formats</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload any file with product names and prices - AI will parse it automatically.
                    Works with <span className="text-foreground/70">PDF, images, CSV, TXT, Excel exports</span>, or any format.
                  </p>
                  <div className="bg-foreground/30 rounded-lg p-3 font-mono text-xs text-foreground/70">
                    <p>Product Name, Price</p>
                    <p>Tirzepatide 5mg, $199.99</p>
                    <p>Semaglutide 10mg, 249.00</p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Matched Products</p>
                    <p className="text-2xl font-bold text-foreground">
                      {matchedCount} <span className="text-lg text-muted-foreground">of {totalRows}</span>
                    </p>
                  </div>
                  <div className={cn("px-4 py-2 rounded-xl border", selectedPriceType.color)}>
                    Updating: {selectedPriceType.label}
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-foreground/5">
                      <tr>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Include</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">CSV Name</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase">Matched Product</th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground uppercase">Price</th>
                        <th className="text-center p-3 text-xs font-medium text-muted-foreground uppercase">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.map((row, index) => (
                        <tr key={index} className={cn(
                          "border-t border-border transition-colors",
                          row.include ? "bg-transparent" : "bg-foreground/[0.03] opacity-50"
                        )}>
                          <td className="p-3">
                            <button
                              onClick={() => toggleRowInclude(index)}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                row.include 
                                  ? "bg-green-500 border-green-500" 
                                  : "border-border hover:border-border0"
                              )}
                            >
                              {row.include && <Check className="h-3 w-3 text-foreground" />}
                            </button>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-foreground/80">{row.original_name}</p>
                          </td>
                          <td className="p-3">
                            {row.selected_product_id ? (
                              <div>
                                <p className="text-sm text-foreground">{row.matched_product_name}</p>
                                {row.matched_variant && (
                                  <p className="text-xs text-muted-foreground">{row.matched_variant}</p>
                                )}
                              </div>
                            ) : row.alternatives && row.alternatives.length > 0 ? (
                              <div className="space-y-1">
                                <p className="text-xs text-amber-400">Select a match:</p>
                                {row.alternatives.map((alt) => (
                                  <button
                                    key={alt.id}
                                    onClick={() => selectAlternative(index, alt.id, alt.name, alt.variant)}
                                    className="block text-left text-sm text-blue-400 hover:text-blue-300"
                                  >
                                    {alt.name}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-red-400">No match found</p>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <p className="text-sm font-mono text-foreground">${row.price.toFixed(2)}</p>
                          </td>
                          <td className="p-3 text-center">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              row.confidence === "high" && "bg-green-500/20 text-green-400",
                              row.confidence === "medium" && "bg-amber-500/20 text-amber-400",
                              row.confidence === "low" && "bg-orange-500/20 text-orange-400",
                              row.confidence === "no_match" && "bg-red-500/20 text-red-400",
                            )}>
                              {row.confidence === "no_match" ? "No Match" : row.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}

            {step === "applying" && (
              <div className="text-center py-12">
                {isApplying ? (
                  <>
                    <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium text-foreground">Applying prices...</p>
                    <p className="text-sm text-muted-foreground mt-1">Updating {matchedCount} products</p>
                  </>
                ) : result ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Prices Updated!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Successfully updated {result.updated} product{result.updated !== 1 ? "s" : ""}
                    </p>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-foreground/[0.03]">
            {step === "upload" && (
              <>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleParse}
                  disabled={!csvContent || isParsing}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-card/90 px-6"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      Parse & Match Products
                    </>
                  )}
                </Button>
              </>
            )}

            {step === "review" && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setStep("upload")}
                  className="rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                >
                  Back
                </Button>
                <Button
                  onClick={handleApplyPrices}
                  disabled={matchedCount === 0 || isApplying}
                  className={cn("rounded-xl px-6", selectedPriceType.color)}
                >
                  Apply {matchedCount} Price{matchedCount !== 1 ? "s" : ""}
                </Button>
              </>
            )}

            {step === "applying" && result && (
              <Button
                onClick={handleClose}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-card/90 px-6 ml-auto"
              >
                Done
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
