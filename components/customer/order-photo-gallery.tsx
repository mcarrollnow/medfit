'use client'

import { useState, useEffect, useCallback } from 'react'
import { Camera, X, Loader2, ImagePlus, ZoomIn } from 'lucide-react'
import Image from 'next/image'

interface OrderPhoto {
  id: string
  order_id: string
  url: string
  filename: string
  size: number | null
  content_type: string | null
  created_at: string
}

interface OrderPhotoGalleryProps {
  orderNumber: string
}

export function OrderPhotoGallery({ orderNumber }: OrderPhotoGalleryProps) {
  const [photos, setPhotos] = useState<OrderPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxPhoto, setLightboxPhoto] = useState<OrderPhoto | null>(null)

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/order-photos/${orderNumber}/photos`)
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.photos || [])
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    } finally {
      setLoading(false)
    }
  }, [orderNumber])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

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
    <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 lg:p-16 transition-all duration-300">
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
              Photos will appear here once your order is processed.
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
                {/* Thumbnail - large, full width */}
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

                {/* Photo Info - larger text, more padding */}
                <div className="px-6 md:px-8 py-5 md:py-6">
                  <p className="text-base md:text-lg text-foreground/80 truncate">
                    {photo.filename}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground mt-2">
                    {formatDate(photo.created_at)}
                    {photo.size ? ` \u00B7 ${formatFileSize(photo.size)}` : ''}
                  </p>
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
