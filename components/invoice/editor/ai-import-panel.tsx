"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, ImageIcon, Wand2, Loader2, Sparkles, Mic, MicOff, Square, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InvoiceData, InvoiceItem } from "@/lib/invoice-types"

type ImportMode = "prompt" | "paste" | "upload" | "voice"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

interface Product {
  id: string
  name: string
  cost_price: number
  b2b_price: number
  retail_price: number
  sku?: string
}

interface AIImportPanelProps {
  onImport: (data: Partial<InvoiceData>) => void
  customers?: Customer[]
  products?: Product[]
  onCustomerSelect?: (customer: Customer) => void
  onProductAdd?: (product: Product, tier: 'cost' | 'b2b' | 'retail', quantity?: number) => void
  onQuantityUpdate?: (quantity: number) => void
  onPriceUpdate?: (price: number) => void
  onSetTotal?: (total: number) => void
}

export function AIImportPanel({ onImport, customers = [], products = [], onCustomerSelect, onProductAdd, onQuantityUpdate, onPriceUpdate, onSetTotal }: AIImportPanelProps) {
  const [mode, setMode] = useState<ImportMode>("prompt")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [promptText, setPromptText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  // @ mention state for customers
  const [showAtMention, setShowAtMention] = useState(false)
  const [atMentionQuery, setAtMentionQuery] = useState("")
  const [atMentionStartIndex, setAtMentionStartIndex] = useState(-1)

  // @@ mention state for products
  const [showProductMention, setShowProductMention] = useState(false)
  const [productMentionQuery, setProductMentionQuery] = useState("")
  const [productMentionStartIndex, setProductMentionStartIndex] = useState(-1)

  // Track if we just added a product (for # quantity updates) - use ref for synchronous access
  const justAddedProductRef = useRef(false)
  const lastQuantityAppliedRef = useRef<number | null>(null)
  const lastPriceAppliedRef = useRef<number | null>(null)

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Speech-to-text for prompt mode
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any | null>(null)

  // Filter customers based on @ mention query
  const atMentionCustomers = customers.filter(c => {
    if (!c || !c.name) return false // Skip invalid entries
    const query = atMentionQuery.toLowerCase().trim()
    if (!query) return true // Show all if no query
    return c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.company && c.company.toLowerCase().includes(query))
  }).slice(0, 10) // Limit to 10 results

  // Filter products based on @@ mention query
  const productMentionProducts = products.filter(p => {
    if (!p || !p.name) return false // Skip invalid entries
    const query = productMentionQuery.toLowerCase().trim()
    if (!query) return true // Show all if no query
    return p.name.toLowerCase().includes(query) ||
      (p.sku && p.sku.toLowerCase().includes(query))
  }).slice(0, 15) // Limit to 15 results

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let transcript = ""
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setPromptText(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  // Handle prompt text change with @ and @@ detection
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart || 0
    setPromptText(value)

    const textBeforeCursor = value.substring(0, cursorPos)
    
    // Check for @@ (product mention) first - must check before single @
    // Allow #number at end for quantity (e.g., @@AOD-9604 #15)
    const doubleAtMatch = textBeforeCursor.match(/@@([\w\s-]+(?:\s*#\d*)?)$/)
    if (doubleAtMatch) {
      // Extract just the product name part (before any #)
      const fullMatch = doubleAtMatch[1]
      const query = fullMatch.replace(/\s*#\d*$/, '').trim() // Remove #quantity for search
      setProductMentionQuery(query)
      setProductMentionStartIndex(cursorPos - doubleAtMatch[0].length)
      setShowProductMention(true)
      setShowAtMention(false)
      justAddedProductRef.current = false // Reset when starting new product mention
      return
    }

    // Check for $$ followed by amount (sets invoice total)
    // Pattern: $$500 or $$ 500 - sets the manualTotal
    const totalMatch = textBeforeCursor.match(/\$\$\s*(\d+(?:\.\d{0,2})?)$/)
    if (totalMatch && onSetTotal) {
      const total = parseFloat(totalMatch[1])
      if (total > 0) {
        onSetTotal(total)
      }
    }

    // Check for #quantity $price pattern (quantity and price per item)
    // Only active if we just added a product via @@
    // Pattern: #5 $50 or #5$50 - sets 5 items at $50 each
    if (justAddedProductRef.current) {
      // Look for #qty $price pattern
      const qtyPriceMatch = textBeforeCursor.match(/(?:^|[^@])#(\d+)\s*\$(\d+(?:\.\d{0,2})?)$/)
      if (qtyPriceMatch) {
        const qty = parseInt(qtyPriceMatch[1], 10)
        const price = parseFloat(qtyPriceMatch[2])
        
        // Update quantity if changed
        if (qty > 0 && qty !== lastQuantityAppliedRef.current && onQuantityUpdate) {
          lastQuantityAppliedRef.current = qty
          onQuantityUpdate(qty)
        }
        
        // Update price if changed
        if (price > 0 && price !== lastPriceAppliedRef.current && onPriceUpdate) {
          lastPriceAppliedRef.current = price
          onPriceUpdate(price)
        }
      } else if (onQuantityUpdate) {
        // Fallback: Check for standalone #number (quantity only, no price)
        const quantityMatch = textBeforeCursor.match(/(?:^|[^@$])#(\d+)$/)
        if (quantityMatch) {
          const qty = parseInt(quantityMatch[1], 10)
          if (qty > 0 && qty !== lastQuantityAppliedRef.current) {
            lastQuantityAppliedRef.current = qty
            onQuantityUpdate(qty)
          }
        }
      }
    }

    // Check for single @ (customer mention) - but not if it's @@
    const singleAtMatch = textBeforeCursor.match(/@([\w\s]*)$/)
    if (singleAtMatch && !textBeforeCursor.match(/@@[\w\s-]*$/)) {
      const query = singleAtMatch[1] // The captured group after @
      setAtMentionQuery(query)
      setAtMentionStartIndex(cursorPos - singleAtMatch[0].length)
      setShowAtMention(true)
      setShowProductMention(false)
      return
    }

    // No mention active
    setShowAtMention(false)
    setShowProductMention(false)
  }

  // Select customer from @ mention
  const selectAtMentionCustomer = (customer: Customer) => {
    const beforeAt = promptText.substring(0, atMentionStartIndex)
    // +1 for the @ symbol, plus the query length
    const afterQuery = promptText.substring(atMentionStartIndex + 1 + atMentionQuery.length)
    const newText = `${beforeAt}${customer.name} ${afterQuery}`
    
    setPromptText(newText)
    setShowAtMention(false)
    setAtMentionQuery("")
    setAtMentionStartIndex(-1)
    
    // Notify parent to populate customer info
    if (onCustomerSelect) {
      onCustomerSelect(customer)
    }
    
    // Refocus the textarea
    promptInputRef.current?.focus()
  }

  // Select product from @@ mention with price tier
  const selectProductMention = (product: Product, tier: 'cost' | 'b2b' | 'retail') => {
    const beforeAt = promptText.substring(0, productMentionStartIndex)
    
    // Get everything after @@ up to cursor position and beyond
    const afterAtStart = promptText.substring(productMentionStartIndex + 2)
    
    // Look for #quantity anywhere in the mention area
    // Match: product query, optional whitespace, optional #number, then rest
    const fullPattern = /^([\w\s-]+?)(?:\s*#(\d+))?([\s\S]*)$/
    const match = afterAtStart.match(fullPattern)
    
    let quantity = 1
    let afterQuery = ''
    
    if (match) {
      // match[1] is the product name part
      // match[2] is the quantity (if present)
      // match[3] is everything after
      quantity = match[2] ? parseInt(match[2], 10) : 1
      afterQuery = match[3] || ''
    }
    
    // Keep product name visible with quantity, remove @@ prefix
    const quantityText = quantity > 1 ? ` x${quantity}` : ''
    const newText = `${beforeAt}${product.name}${quantityText}${afterQuery}`
    
    setPromptText(newText)
    setShowProductMention(false)
    setProductMentionQuery("")
    setProductMentionStartIndex(-1)
    
    // Mark that we just added a product - enables # quantity updates (use ref for sync)
    justAddedProductRef.current = true
    lastQuantityAppliedRef.current = quantity > 1 ? quantity : null
    
    // Notify parent to add product with the parsed quantity
    if (onProductAdd) {
      onProductAdd(product, tier, quantity)
    }
    
    // Refocus the textarea
    promptInputRef.current?.focus()
  }

  // Voice recording - uses Whisper API for professional transcription
  const [isTranscribing, setIsTranscribing] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Use mp3-compatible format for Whisper
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
        
        // Automatically transcribe with Whisper
        await transcribeWithWhisper(blob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)
      setVoiceTranscript("")

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)
    } catch (err) {
      console.error("Failed to start recording:", err)
      setProcessError("Could not access microphone. Please check permissions.")
    }
  }

  const transcribeWithWhisper = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setVoiceTranscript("Transcribing with AI...")
    
    try {
      // Create form data with audio file
      const formData = new FormData()
      const audioFile = new File([audioBlob], 'recording.webm', { type: audioBlob.type })
      formData.append('audio', audioFile)
      formData.append('productHints', JSON.stringify(products.map(p => p.name)))
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        setVoiceTranscript(data.transcript || '')
      } else {
        const error = await response.text()
        console.error('Transcription failed:', error)
        setVoiceTranscript('')
        setProcessError('Transcription failed. Please try again or type manually.')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      setVoiceTranscript('')
      setProcessError('Transcription failed. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setVoiceTranscript("")
    setRecordingTime(0)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(droppedFile)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const [processError, setProcessError] = useState<string | null>(null)
  
  // Confirmation state - show parsed results before applying
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingImportData, setPendingImportData] = useState<{
    customer: {
      name: string
      email: string
      address?: string
      city?: string
      matched_confidence?: 'high' | 'medium' | 'low' | 'none'
      alternatives?: Array<{ id: string; name: string; email?: string }>
    } | null
    items: Array<{
      description: string
      quantity: number
      rate: number
      matched_confidence?: 'high' | 'medium' | 'low' | 'none'
    }>
    notes: string
    manualTotal?: number
    discount?: { type: 'percentage' | 'fixed' | 'total_price'; value: number }
  } | null>(null)

  // Correct common speech recognition errors using product names
  const correctTranscript = (text: string): string => {
    if (!text || products.length === 0) return text
    
    let corrected = text.toLowerCase()
    
    // Build a map of product names and their phonetic variations
    const productCorrections: Array<{ patterns: RegExp[], replacement: string }> = []
    
    for (const product of products) {
      const name = product.name.toLowerCase()
      const patterns: RegExp[] = []
      
      // Common peptide/pharmaceutical mishearings
      if (name.includes('tirzepatide')) {
        patterns.push(/\b(trepid|tersip|ter\s*zep|tirz|turzep|terza\s*pat|terse\s*peptide|tears\s*a\s*peptide)\w*\b/gi)
      }
      if (name.includes('semaglutide')) {
        patterns.push(/\b(sema\s*glue|sem\s*a\s*glue|semi\s*glue|sema\s*glutide|semi\s*glutide|some\s*a\s*glue)\w*\b/gi)
      }
      if (name.includes('bpc-157') || name.includes('bpc157') || name.includes('bpc 157')) {
        patterns.push(/\b(bpc|b\s*p\s*c|be\s*pc|beep\s*c)[\s-]*(157|one\s*five\s*seven|one\s*57)?\b/gi)
      }
      if (name.includes('tb-500') || name.includes('tb500') || name.includes('tb 500')) {
        patterns.push(/\b(tb|t\s*b|tee\s*bee)[\s-]*(500|five\s*hundred)?\b/gi)
      }
      if (name.includes('nad+') || name.includes('nad')) {
        patterns.push(/\b(nad|n\s*a\s*d|nad\s*plus)\+?\b/gi)
      }
      if (name.includes('glutathione')) {
        patterns.push(/\b(glue\s*ta\s*thigh|gluta\s*thigh|glue\s*tath|glue\s*ta\s*thion)\w*\b/gi)
      }
      if (name.includes('methylene')) {
        patterns.push(/\b(meth\s*a\s*lean|methy\s*lean|meth\s*leen|methyl\s*een)\w*\b/gi)
      }
      if (name.includes('rapamycin')) {
        patterns.push(/\b(rapa\s*my|rap\s*a\s*my|rappa\s*my)\w*\b/gi)
      }
      
      // Extract base product name (without dosage) for generic matching
      const baseName = name.replace(/\s*\d+\s*(mg|ml|mcg|iu)\s*/gi, '').trim()
      if (baseName.length >= 4) {
        // Create pattern for words that sound similar (simple phonetic matching)
        const simplified = baseName.replace(/[aeiou]/gi, '.?').replace(/[^a-z.?]/gi, '\\s*')
        if (simplified.length > 4) {
          try {
            patterns.push(new RegExp(`\\b${simplified}\\b`, 'gi'))
          } catch (e) {
            // Invalid regex, skip
          }
        }
      }
      
      if (patterns.length > 0) {
        // Use base name without dosage for replacement - let the AI handle dosage
        const replacementName = name.split(/\s+\d+\s*(mg|ml|mcg|iu)/i)[0].trim()
        productCorrections.push({ patterns, replacement: replacementName })
      }
    }
    
    // Apply corrections
    for (const { patterns, replacement } of productCorrections) {
      for (const pattern of patterns) {
        corrected = corrected.replace(pattern, replacement)
      }
    }
    
    return corrected
  }

  const handleProcess = async () => {
    setProcessError(null)
    setIsProcessing(true)

    try {
      // For voice mode, use the transcribed text with corrections applied
      let textToProcess = mode === 'prompt' ? promptText : mode === 'paste' ? pastedText : mode === 'voice' ? voiceTranscript : undefined
      const imageToProcess = mode === 'upload' ? preview : undefined

      // Log the original text
      console.log('[AI Import] Original text:', textToProcess)
      
      // NOTE: Removed auto-correction - was causing false matches
      // User should edit transcript manually if needed

      if (mode === 'voice' && !voiceTranscript.trim()) {
        throw new Error('No speech detected. Please try recording again.')
      }

      const response = await fetch('/api/authorize-net/invoices/parse-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          image: imageToProcess,
          // Send product names so Claude knows what to look for
          productCatalog: products.map(p => p.name),
          // Send customer names for accurate matching (prevents Michael Stroud/Shahbazian confusion)
          customerCatalog: customers.map(c => {
            const parts = [c.name]
            if (c.company) parts.push(`(${c.company})`)
            return parts.join(' ')
          }),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const results = data.data

        console.log('[AI Import] Parsed results:', results)

        // Transform parsed data to InvoiceData format
        const items: InvoiceItem[] = results.products?.map((p: any, idx: number) => {
          // Use custom_price if specified, otherwise use retail_price from matched product
          const price = p.custom_price || p.retail_price || 0
          console.log(`[AI Import] Product: ${p.matched_product_name || p.name}, Price: ${price}, Custom: ${p.custom_price}, Retail: ${p.retail_price}`)
          return {
            id: Date.now() + idx,
            description: p.matched_product_name || p.name,
            details: '',
            quantity: p.quantity || 1,
            rate: price,
          }
        }) || []

        // Use matched customer from API (server-side matching is more accurate)
        let customerEmail = results.customer_email || ''
        let customerAddress = ''
        let customerCity = ''
        let matchedCustomerFromList: Customer | null = null
        
        // Check if API returned a matched customer with high/medium confidence
        if (results.matched_customer && results.matched_customer.matched_confidence !== 'none') {
          const mc = results.matched_customer
          console.log('[AI Import] Server matched customer:', mc.name, 'confidence:', mc.matched_confidence)
          
          // If there are alternatives (ambiguous match), log a warning
          if (mc.alternatives && mc.alternatives.length > 1) {
            console.warn('[AI Import] AMBIGUOUS: Multiple customers match. Options:', mc.alternatives.map((a: any) => a.name))
          }
          
          // Find the customer in our local list by ID
          matchedCustomerFromList = customers.find(c => c.id === mc.id) || null
          
          if (matchedCustomerFromList) {
            customerEmail = matchedCustomerFromList.email || customerEmail
            customerAddress = matchedCustomerFromList.address || ''
            customerCity = [matchedCustomerFromList.city, matchedCustomerFromList.state, matchedCustomerFromList.zip].filter(Boolean).join(', ')
            console.log('[AI Import] Using matched customer:', matchedCustomerFromList.name, matchedCustomerFromList.email)
          }
        } else if (results.customer_name && customers.length > 0) {
          // Fallback: exact match only (no fuzzy matching to prevent misidentification)
          matchedCustomerFromList = customers.find(c => 
            c && c.name && c.name.toLowerCase() === results.customer_name.toLowerCase()
          ) || null
          
          if (matchedCustomerFromList) {
            customerEmail = matchedCustomerFromList.email || customerEmail
            customerAddress = matchedCustomerFromList.address || ''
            customerCity = [matchedCustomerFromList.city, matchedCustomerFromList.state, matchedCustomerFromList.zip].filter(Boolean).join(', ')
            console.log('[AI Import] Exact match customer:', matchedCustomerFromList.name, matchedCustomerFromList.email)
          } else {
            console.log('[AI Import] No exact customer match for:', results.customer_name)
          }
        }

        // Build pending data for confirmation
        const pendingData = {
          customer: (results.customer_name || customerEmail) ? {
            name: results.matched_customer?.name || results.customer_name || '',
            email: customerEmail,
            address: customerAddress,
            city: customerCity,
            matched_confidence: results.matched_customer?.matched_confidence,
            alternatives: results.matched_customer?.alternatives,
          } : null,
          items: items.map((item: any, idx: number) => ({
            ...item,
            matched_confidence: results.products?.[idx]?.matched_confidence,
          })),
          notes: results.notes && results.notes.trim() ? results.notes : '',
          manualTotal: results.discount?.type === 'total_price' ? results.discount.value : undefined,
          discount: results.discount,
        }

        // Show confirmation modal instead of directly importing
        setPendingImportData(pendingData)
        setShowConfirmation(true)
      } else {
        const errorText = await response.text()
        console.error('AI parse failed:', errorText)
        setProcessError('Failed to parse. Please try again.')
      }
    } catch (error: any) {
      console.error('Failed to process:', error)
      setProcessError(error.message || 'Failed to process. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Confirm and apply the pending import data
  const confirmImport = () => {
    if (!pendingImportData) return

    const importedData: Partial<InvoiceData> = {
      to: pendingImportData.customer ? {
        name: pendingImportData.customer.name,
        address: pendingImportData.customer.address || '',
        city: pendingImportData.customer.city || '',
        email: pendingImportData.customer.email,
      } : undefined,
      items: pendingImportData.items.length > 0 ? pendingImportData.items : undefined,
      notes: pendingImportData.notes,
      manualTotal: pendingImportData.manualTotal,
    }

    onImport(importedData)
    setPendingImportData(null)
    setShowConfirmation(false)
  }

  // Cancel the pending import
  const cancelImport = () => {
    setPendingImportData(null)
    setShowConfirmation(false)
  }

  const canProcess =
    mode === "upload"
      ? !!file
      : mode === "paste"
        ? pastedText.trim().length > 0
        : mode === "voice"
          ? voiceTranscript.trim().length > 0
          : promptText.trim().length > 0

  const modes: { id: ImportMode; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: "prompt", label: "Quick Command", shortLabel: "Command", icon: <Wand2 className="w-4 h-4" /> },
    { id: "paste", label: "Paste Text", shortLabel: "Paste", icon: <FileText className="w-4 h-4" /> },
    { id: "upload", label: "Screenshot", shortLabel: "Image", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "voice", label: "Voice", shortLabel: "Voice", icon: <Mic className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-4 md:space-y-6 relative z-40 overflow-visible">
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 rounded-full font-mono text-[10px] md:text-xs uppercase tracking-wider transition-all ${
              mode === m.id
                ? "bg-foreground text-background"
                : "bg-foreground/5 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
            }`}
          >
            {m.icon}
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-10 relative overflow-visible"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* Prompt Mode */}
            {mode === "prompt" && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Wand2 className="w-5 h-5 text-foreground/60" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Quick Command
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    ref={promptInputRef}
                    value={promptText}
                    onChange={handlePromptChange}
                    placeholder={`Smart shortcuts:
• @CustomerName - search & select customer
• @@ProductName - search & add product with pricing
• #5 - set quantity (after adding product)
• #5 $50 - set qty 5 at $50 each
• $$500 - set invoice total to $500

Examples:
• @John Smith @@BPC-157 #2 $75
• @@Tirzepatide 10mg #3 $120 $$350`}
                    className="w-full h-48 bg-foreground/40 border border-primary/15 rounded-2xl p-6 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-border focus:ring-1 focus:ring-foreground/20 transition-colors"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {promptText && (
                      <button
                        onClick={() => setPromptText("")}
                        className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={toggleListening}
                      className={`p-2 rounded-full transition-colors ${
                        isListening
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                      }`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* @ Customer Mention Dropdown */}
                  {showAtMention && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl max-h-80 overflow-y-auto z-[300] shadow-2xl">
                      {atMentionCustomers.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground font-mono text-sm">No customers found</div>
                      ) : (
                        <>
                          <div className="px-4 py-2 text-xs font-mono text-emerald-400 uppercase tracking-wider border-b border-border flex items-center gap-2">
                            <User className="w-3 h-3" />
                            Select Customer
                          </div>
                          {atMentionCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              onClick={() => selectAtMentionCustomer(customer)}
                              className="w-full p-4 text-left hover:bg-foreground/5 transition-colors border-b border-border last:border-0"
                            >
                              <p className="font-medium text-foreground">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                              {customer.company && (
                                <p className="text-xs text-muted-foreground/70">{customer.company}</p>
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {/* @@ Product Mention Dropdown */}
                  {showProductMention && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl max-h-96 overflow-y-auto z-[300] shadow-2xl">
                      {productMentionProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground font-mono text-sm">No products found</div>
                      ) : (
                        <>
                          <div className="px-4 py-2 text-xs font-mono text-emerald-400 uppercase tracking-wider border-b border-border flex items-center gap-2">
                            <Package className="w-3 h-3" />
                            Select Product & Price
                          </div>
                          {productMentionProducts.map((product) => (
                            <div
                              key={product.id}
                              className="p-4 border-b border-border last:border-0"
                            >
                              <p className="font-medium text-foreground mb-3">{product.name}</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => selectProductMention(product, 'cost')}
                                  className="flex-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono hover:bg-red-500/20 transition-colors"
                                >
                                  Cost ${product.cost_price}
                                </button>
                                <button
                                  onClick={() => selectProductMention(product, 'b2b')}
                                  className="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-mono hover:bg-blue-500/20 transition-colors"
                                >
                                  B2B ${product.b2b_price}
                                </button>
                                <button
                                  onClick={() => selectProductMention(product, 'retail')}
                                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono hover:bg-emerald-500/20 transition-colors"
                                >
                                  Retail ${product.retail_price}
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isListening && (
                  <p className="font-mono text-xs text-red-400 mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Listening... speak now
                  </p>
                )}
              </motion.div>
            )}

            {/* Paste Text Mode */}
            {mode === "paste" && (
              <motion.div
                key="paste"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-foreground/60" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Paste Conversation or Email
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your conversation or invoice details here...

Example:
'Hey, can you send me an invoice for the website redesign project? It's for Acme Corp, $2,500 for the design work and $1,000 for development. Due in 30 days.'"
                    className="w-full h-48 bg-foreground/40 border border-primary/15 rounded-2xl p-6 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-border focus:ring-1 focus:ring-foreground/20 transition-colors"
                  />
                  {pastedText && (
                    <button
                      onClick={() => setPastedText("")}
                      className="absolute top-3 right-3 p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Upload Screenshot Mode */}
            {mode === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-5 h-5 text-foreground/60" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Upload Invoice Screenshot
                  </span>
                </div>

                {!preview ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      dragActive
                        ? "border-foreground/40 bg-foreground/5"
                        : "border-border hover:border-border hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-serif text-lg text-foreground mb-1">Drop your screenshot here</p>
                        <p className="font-mono text-xs text-muted-foreground">or click to browse • PNG, JPG, WEBP</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-foreground/5">
                    <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
                    <button
                      onClick={clearFile}
                      className="absolute top-3 right-3 p-2 rounded-full bg-foreground/60 hover:bg-background/80 transition-colors text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/60 to-transparent p-4">
                      <p className="font-mono text-xs text-foreground/80 truncate">{file?.name}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Voice Mode */}
            {mode === "voice" && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Mic className="w-5 h-5 text-foreground/60" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Voice Recording (Whisper AI Transcription)
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                  {!audioBlob && !isTranscribing ? (
                    <>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? "bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30"
                            : "bg-foreground/5 border-2 border-border hover:bg-foreground/10 hover:border-border"
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-8 h-8 text-red-400" />
                        ) : (
                          <Mic className="w-8 h-8 text-foreground/60" />
                        )}
                      </button>

                      {isRecording ? (
                        <div className="mt-6 text-center w-full">
                          <p className="font-mono text-2xl text-red-400">{formatTime(recordingTime)}</p>
                          <p className="font-mono text-xs text-muted-foreground mt-2 flex items-center gap-2 justify-center">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            Recording... tap to stop
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 text-center">
                          <p className="font-mono text-xs text-muted-foreground">
                            Tap to start recording your invoice details
                          </p>
                          <p className="font-mono text-[10px] text-emerald-400/70 mt-2">
                            Uses OpenAI Whisper for accurate product name recognition
                          </p>
                        </div>
                      )}
                    </>
                  ) : isTranscribing ? (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      </div>
                      <p className="font-mono text-sm text-emerald-400">Transcribing audio...</p>
                      <p className="font-mono text-xs text-muted-foreground mt-2">
                        AI is listening to your recording
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center justify-between bg-foreground/40 border border-border rounded-2xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-mono text-sm text-foreground">Recording Complete</p>
                            <p className="font-mono text-xs text-muted-foreground">{formatTime(recordingTime)} • Whisper transcribed</p>
                          </div>
                        </div>
                        <button
                          onClick={clearRecording}
                          className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {voiceTranscript && (
                        <div className="mt-4 p-4 bg-foreground/40 border border-border rounded-xl">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-2">
                            AI Transcript (editable)
                          </p>
                          <textarea
                            value={voiceTranscript}
                            onChange={(e) => setVoiceTranscript(e.target.value)}
                            className="w-full bg-transparent font-mono text-sm text-foreground focus:outline-none resize-none min-h-[60px]"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {processError && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="font-mono text-sm text-red-400">{processError}</p>
            </div>
          )}

          {/* Process Button */}
          <div className="mt-8 flex items-center justify-between">
            {mode === "voice" && voiceTranscript && (
              <p className="font-mono text-xs text-muted-foreground">
                Transcript ready • {voiceTranscript.split(' ').length} words
              </p>
            )}
            {mode !== "voice" && <div />}
            <Button
              onClick={handleProcess}
              disabled={!canProcess || isProcessing}
              className="bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-wider px-6 py-5 rounded-full disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {mode === "prompt" ? "Generate Invoice" : "Extract Invoice Data"}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && pendingImportData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-background/90 backdrop-blur-md"
              onClick={cancelImport}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg"
            >
              <div className="glass-card rounded-2xl p-6 bg-background/95 border border-border">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Confirm Invoice Data</h2>
                    <p className="text-xs text-muted-foreground">Review before applying</p>
                  </div>
                </div>

                {/* Customer */}
                {pendingImportData.customer && (
                  <div className="mb-4 p-3 rounded-xl bg-foreground/5 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Customer</span>
                      {pendingImportData.customer.matched_confidence && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          pendingImportData.customer.matched_confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                          pendingImportData.customer.matched_confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {pendingImportData.customer.matched_confidence}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-foreground">{pendingImportData.customer.name}</p>
                    {pendingImportData.customer.email && (
                      <p className="text-sm text-muted-foreground">{pendingImportData.customer.email}</p>
                    )}
                    {/* Show alternatives if ambiguous */}
                    {pendingImportData.customer.alternatives && pendingImportData.customer.alternatives.length > 1 && (
                      <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/30">
                        <p className="text-[10px] text-amber-400 font-mono">⚠️ Multiple matches:</p>
                        {pendingImportData.customer.alternatives.slice(0, 3).map((alt, idx) => (
                          <p key={alt.id} className={`text-xs ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {idx === 0 ? '→ ' : '  '}{alt.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Items */}
                {pendingImportData.items.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-foreground/5 border border-border">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Items ({pendingImportData.items.length})
                    </span>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {pendingImportData.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex-1 min-w-0">
                            <span className="text-foreground truncate block">{item.description}</span>
                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.matched_confidence && (
                              <span className={`px-1 py-0.5 rounded text-[9px] font-mono ${
                                item.matched_confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                                item.matched_confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                item.matched_confidence === 'low' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {item.matched_confidence}
                              </span>
                            )}
                            <span className="font-mono text-foreground">${(item.quantity * item.rate).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="mb-5 p-3 rounded-xl bg-foreground/5 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono text-foreground">
                      ${pendingImportData.items.reduce((sum, i) => sum + i.quantity * i.rate, 0).toFixed(2)}
                    </span>
                  </div>
                  {pendingImportData.discount && (
                    <div className="flex justify-between items-center mt-1 text-amber-400 text-sm">
                      <span>
                        {pendingImportData.discount.type === 'total_price' ? 'Set Total' : 'Discount'}
                      </span>
                      <span className="font-mono">
                        {pendingImportData.discount.type === 'total_price' 
                          ? `→ $${pendingImportData.discount.value.toFixed(2)}`
                          : pendingImportData.discount.type === 'percentage'
                            ? `-${pendingImportData.discount.value}%`
                            : `-$${pendingImportData.discount.value.toFixed(2)}`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={cancelImport}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmImport}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
