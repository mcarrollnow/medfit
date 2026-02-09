"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Camera, CheckCircle2, Upload, Loader2, X, Plus, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedPhoto {
  url: string
  name: string
}

export default function QRPhotoUploadPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const token = searchParams.get("token") || ""

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate token on load
  useEffect(() => {
    async function validate() {
      if (!token) {
        setIsValidating(false)
        setError("Missing token — scan the QR code on the packing slip")
        return
      }

      try {
        // Quick validation by attempting a small test — we'll just check via the upload endpoint
        // For now, validate via server action
        const res = await fetch(`/api/orders/${orderId}/upload-photo`, {
          method: "POST",
          body: (() => {
            const fd = new FormData()
            fd.append("token", token)
            // No file = will get "File required" error which proves token validation passed
            return fd
          })(),
        })

        const data = await res.json()

        // If we get "File required" it means token was valid
        if (res.status === 400 && data.error === "File required") {
          setIsValid(true)
          setOrderNumber(orderId.slice(0, 8))
        } else if (res.status === 403) {
          setError("Invalid or expired token")
        } else if (res.status === 404) {
          setError("Order not found")
        } else {
          // Still valid for other cases
          setIsValid(true)
        }
      } catch {
        setError("Connection error — please try again")
      } finally {
        setIsValidating(false)
      }
    }
    validate()
  }, [orderId, token])

  // Auto-open camera on valid load
  useEffect(() => {
    if (isValid && photos.length === 0 && fileInputRef.current) {
      // Small delay to ensure UI renders first
      const timer = setTimeout(() => {
        fileInputRef.current?.click()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isValid, photos.length])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("token", token)
      formData.append("file", file)

      const res = await fetch(`/api/orders/${orderId}/upload-photo`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setPhotos((prev) => [...prev, { url: data.url, name: file.name }])
        if (data.orderNumber) setOrderNumber(data.orderNumber)
      } else {
        setError(data.error || "Upload failed")
      }
    } catch {
      setError("Network error — please try again")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Loading
  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm">Verifying...</p>
        </div>
      </div>
    )
  }

  // Invalid token
  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="bg-white/[0.04] rounded-full p-6 inline-block mb-6">
            <X className="h-8 w-8 text-destructive-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-light mb-3 text-foreground">
            Invalid Link
          </h1>
          <p className="text-muted-foreground text-sm">
            {error || "This link is invalid or has expired. Please scan the QR code on the packing slip."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-white/[0.04] rounded-full p-4 inline-block mb-4">
          <Package className="h-6 w-6 text-foreground" />
        </div>
        <h1 className="font-serif text-xl font-light text-foreground">
          Order Photos
        </h1>
        {orderNumber && (
          <p className="text-sm text-muted-foreground font-mono mt-1">
            #{orderNumber}
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Take Photo Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "w-full py-6 rounded-2xl font-mono flex items-center justify-center gap-3 transition-all mb-6",
          isUploading
            ? "bg-white/[0.04] text-muted-foreground"
            : "bg-foreground text-background active:scale-[0.98]"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="h-6 w-6" />
            {photos.length === 0 ? "Take Photo" : "Take Another Photo"}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-destructive-foreground">{error}</p>
        </div>
      )}

      {/* Uploaded Photos */}
      {photos.length > 0 && (
        <div className="flex-1">
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
            Uploaded ({photos.length})
          </p>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden aspect-square border border-white/[0.08]"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-foreground text-background rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl border border-dashed border-white/[0.15] aspect-square flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-white/30 transition-colors"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-mono">Add</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Photos are attached to the order for quality verification
        </p>
      </div>
    </div>
  )
}
