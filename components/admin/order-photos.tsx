'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Upload, Trash2, X, Loader2, ImagePlus, ZoomIn } from 'lucide-react'
import Image from 'next/image'

interface OrderPhoto {
  id: string
  order_id: string
  url: string
  filename: string
  size: number | null
  content_type: string | null
  storage_path?: string
  created_at: string
}

interface OrderPhotosProps {
  orderId?: string
  orderNumber?: string
  autoOpenCamera?: boolean
}

export function OrderPhotos({ orderId, orderNumber, autoOpenCamera }: OrderPhotosProps) {
  const [photos, setPhotos] = useState<OrderPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<OrderPhoto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [resolvedOrderId, setResolvedOrderId] = useState<string | undefined>(orderId)
  const [cameraTriggered, setCameraTriggered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Determine which API base to use
  const apiBase = orderNumber
    ? `/api/order-photos/${orderNumber}/photos`
    : `/api/admin/orders/${orderId}/photos`

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(apiBase)
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.photos || [])
        // If using orderNumber route, capture the resolved orderId
        if (data.orderId && !resolvedOrderId) {
          setResolvedOrderId(data.orderId)
        }
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    } finally {
      setLoading(false)
    }
  }, [apiBase, resolvedOrderId])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  // Auto-open camera when requested and no photos exist
  useEffect(() => {
    if (autoOpenCamera && !loading && photos.length === 0 && !cameraTriggered) {
      setCameraTriggered(true)
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        cameraInputRef.current?.click()
      }, 500)
    }
  }, [autoOpenCamera, loading, photos.length, cameraTriggered])

  const uploadFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const res = await fetch(apiBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileData: reader.result as string,
            }),
          })

          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Upload failed')
          }

          resolve()
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const total = files.length
    let uploaded = 0

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        setUploadProgress(`Uploading ${uploaded + 1} of ${total}...`)
        await uploadFile(file)
        uploaded++
      }
      await fetchPhotos()
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      setUploadProgress(null)
      // Reset inputs
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    }
  }

  const handleDelete = async (photo: OrderPhoto) => {
    setDeletingId(photo.id)
    try {
      const res = await fetch(apiBase, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: photo.id,
          storagePath: photo.storage_path,
        }),
      })

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
        if (lightboxPhoto?.id === photo.id) setLightboxPhoto(null)
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 lg:p-16 transition-all duration-300 hover:bg-foreground/[0.05]">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
      <div className="relative z-10">
        {/* Header - larger, more space */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground flex items-center gap-4">
            <Camera className="w-8 h-8 text-muted-foreground" />
            Order Photos
            {photos.length > 0 && (
              <span className="text-base md:text-lg font-normal text-muted-foreground">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </span>
            )}
          </h2>
        </div>

        {/* Upload Buttons - stacked vertically, full width, plenty of touch space */}
        <div className="flex flex-col gap-6 mb-12 md:mb-16">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-4 px-8 py-6 md:py-8 glass-button rounded-2xl text-foreground hover:bg-foreground/[0.08] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Camera className="w-8 h-8" />
            <span className="text-lg md:text-xl font-light">Take Photo</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-4 px-8 py-6 md:py-8 glass-button rounded-2xl text-foreground hover:bg-foreground/[0.08] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload className="w-8 h-8" />
            <span className="text-lg md:text-xl font-light">Upload Photos</span>
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="flex items-center gap-4 mb-12 p-6 md:p-8 glass-button rounded-2xl">
            <Loader2 className="w-8 h-8 text-foreground animate-spin flex-shrink-0" />
            <span className="text-base md:text-lg text-foreground/80">{uploadProgress}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24 md:py-32">
            <Loader2 className="w-10 h-10 text-foreground/30 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 md:py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-foreground/[0.05] flex items-center justify-center mb-8">
              <ImagePlus className="w-12 h-12 text-foreground/20" />
            </div>
            <p className="text-xl md:text-2xl font-serif font-light text-foreground mb-3">No photos yet</p>
            <p className="text-base md:text-lg text-muted-foreground max-w-md">
              Take or upload photos of this order before shipping.
            </p>
          </div>
        )}

        {/* Photo list - single column, stacked vertically with plenty of space */}
        {!loading && photos.length > 0 && (
          <div className="space-y-10 md:space-y-12">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/[0.04] transition-all duration-200 hover:border-border"
              >
                <button
                  type="button"
                  onClick={() => setLightboxPhoto(photo)}
                  className="relative w-full aspect-[4/3] md:aspect-[2/1] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 rounded-t-2xl"
                >
                  <Image
                    src={photo.url}
                    alt={photo.filename}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/20 transition-all duration-200 flex items-center justify-center">
                    <ZoomIn className="w-10 h-10 text-foreground opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
                  </div>
                </button>

                <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-base md:text-lg text-foreground/80 truncate">
                      {photo.filename}
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                      {formatDate(photo.created_at)}
                      {photo.size ? ` \u00B7 ${formatFileSize(photo.size)}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deletingId === photo.id}
                    className="flex-shrink-0 p-4 rounded-xl text-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-40"
                    aria-label={`Delete ${photo.filename}`}
                  >
                    {deletingId === photo.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Trash2 className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setLightboxPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo preview"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors z-10"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative w-full max-w-4xl max-h-[85vh] aspect-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxPhoto.url}
                alt={lightboxPhoto.filename}
                fill
                className="object-contain rounded-2xl"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>

            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-foreground/60 backdrop-blur-sm rounded-xl text-foreground/70 text-base"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxPhoto.filename}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
