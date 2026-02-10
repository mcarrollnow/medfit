'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Save, Loader2, Upload, Image as ImageIcon, Trash2, ExternalLink, Info, Check
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import Image from 'next/image'

// Image slot definitions with exact dimensions from the original template
const imageSlots = [
  // Hero Section
  {
    id: 'hero_main',
    section: 'Hero Section',
    name: 'Main Hero Image',
    description: 'Full-screen background image with text overlay',
    dimensions: '1920 x 1080 px (16:9)',
    aspectRatio: '16/9',
    path: '/images/hero-main.png',
  },
  {
    id: 'hero_left_1',
    section: 'Hero Section',
    name: 'Hero Left Side - Top',
    description: 'Top image in left column of bento grid',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'hero-left-1',
  },
  {
    id: 'hero_left_2',
    section: 'Hero Section',
    name: 'Hero Left Side - Bottom',
    description: 'Bottom image in left column of bento grid',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'hero-left-2',
  },
  {
    id: 'hero_right_1',
    section: 'Hero Section',
    name: 'Hero Right Side - Top',
    description: 'Top image in right column of bento grid',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'hero-right-1',
  },
  {
    id: 'hero_right_2',
    section: 'Hero Section',
    name: 'Hero Right Side - Bottom',
    description: 'Bottom image in right column of bento grid',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'hero-right-2',
  },
  
  // Philosophy Section (Meet Alpine & Forest)
  {
    id: 'philosophy_left',
    section: 'Philosophy Section',
    name: 'Alpine Product Image',
    description: 'Left sliding product card',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/product-backpack.png',
  },
  {
    id: 'philosophy_right',
    section: 'Philosophy Section',
    name: 'Forest Product Image',
    description: 'Right sliding product card',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/02cdc426-dff4-4dff-b131-1b134c3699b5.png',
  },
  
  // Featured Products Section (6 images)
  {
    id: 'featured_1',
    section: 'Featured Products',
    name: 'Feature 1 - Smart Temperature',
    description: 'First feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/d18fe616-5596-4559-90f5-a90f5397d0d8.png',
  },
  {
    id: 'featured_2',
    section: 'Featured Products',
    name: 'Feature 2 - Carbon Frame',
    description: 'Second feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/e26fa9c3-966d-4966-94a4-954a1e511c1c.png',
  },
  {
    id: 'featured_3',
    section: 'Featured Products',
    name: 'Feature 3 - Weather Resistant',
    description: 'Third feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/car.jpg',
  },
  {
    id: 'featured_4',
    section: 'Featured Products',
    name: 'Feature 4 - GPS Tracking',
    description: 'Fourth feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/204cee22-9e85-49e8-9303-1d309af626b0.png',
  },
  {
    id: 'featured_5',
    section: 'Featured Products',
    name: 'Feature 5 - LED Flashlight',
    description: 'Fifth feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/led-flashlight-bottle.png',
  },
  {
    id: 'featured_6',
    section: 'Featured Products',
    name: 'Feature 6 - Self-Heating',
    description: 'Sixth feature card image',
    dimensions: '800 x 600 px (4:3)',
    aspectRatio: '4/3',
    path: '/images/heating-campfire.png',
  },
  
  // Technology Section
  {
    id: 'tech_main',
    section: 'Technology Section',
    name: 'Main Technology Image',
    description: 'Full-screen center image with "Technology Meets Wilderness" text',
    dimensions: '1920 x 1080 px (16:9)',
    aspectRatio: '16/9',
    path: 'tech-main',
  },
  {
    id: 'tech_left_1',
    section: 'Technology Section',
    name: 'Tech Left Side - Top',
    description: 'Top image in left column',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'tech-left-1',
  },
  {
    id: 'tech_left_2',
    section: 'Technology Section',
    name: 'Tech Left Side - Bottom',
    description: 'Bottom image in left column',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'tech-left-2',
  },
  {
    id: 'tech_right_1',
    section: 'Technology Section',
    name: 'Tech Right Side - Top',
    description: 'Top image in right column',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'tech-right-1',
  },
  {
    id: 'tech_right_2',
    section: 'Technology Section',
    name: 'Tech Right Side - Bottom',
    description: 'Bottom image in right column',
    dimensions: '500 x 750 px (2:3)',
    aspectRatio: '2/3',
    path: 'tech-right-2',
  },
  
  // Gallery Section (8 horizontal scroll images)
  {
    id: 'gallery_1',
    section: 'Gallery Section',
    name: 'Gallery Image 1',
    description: 'First horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-bike.png',
  },
  {
    id: 'gallery_2',
    section: 'Gallery Section',
    name: 'Gallery Image 2',
    description: 'Second horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-lake.png',
  },
  {
    id: 'gallery_3',
    section: 'Gallery Section',
    name: 'Gallery Image 3',
    description: 'Third horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-water.png',
  },
  {
    id: 'gallery_4',
    section: 'Gallery Section',
    name: 'Gallery Image 4',
    description: 'Fourth horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-stream.png',
  },
  {
    id: 'gallery_5',
    section: 'Gallery Section',
    name: 'Gallery Image 5',
    description: 'Fifth horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-fire.png',
  },
  {
    id: 'gallery_6',
    section: 'Gallery Section',
    name: 'Gallery Image 6',
    description: 'Sixth horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-snow.png',
  },
  {
    id: 'gallery_7',
    section: 'Gallery Section',
    name: 'Gallery Image 7',
    description: 'Seventh horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-mountain.png',
  },
  {
    id: 'gallery_8',
    section: 'Gallery Section',
    name: 'Gallery Image 8',
    description: 'Eighth horizontal scroll image',
    dimensions: '1200 x 800 px (3:2)',
    aspectRatio: '3/2',
    path: '/images/bottle-canyon.png',
  },
  
  // Collection Section (6 accessory images)
  {
    id: 'accessory_1',
    section: 'Collection Section',
    name: 'Accessory 1 - Charger',
    description: 'First accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-charger.png',
  },
  {
    id: 'accessory_2',
    section: 'Collection Section',
    name: 'Accessory 2 - Sleeve',
    description: 'Second accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-sleeve.png',
  },
  {
    id: 'accessory_3',
    section: 'Collection Section',
    name: 'Accessory 3 - Bike Mount',
    description: 'Third accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-bike-mount.png',
  },
  {
    id: 'accessory_4',
    section: 'Collection Section',
    name: 'Accessory 4 - Carry Strap',
    description: 'Fourth accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-strap.png',
  },
  {
    id: 'accessory_5',
    section: 'Collection Section',
    name: 'Accessory 5 - Carabiner',
    description: 'Fifth accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-carabiner.png',
  },
  {
    id: 'accessory_6',
    section: 'Collection Section',
    name: 'Accessory 6 - Speaker Base',
    description: 'Sixth accessory card',
    dimensions: '600 x 900 px (2:3)',
    aspectRatio: '2/3',
    path: '/images/accessory-speaker-base.png',
  },
  
  // Testimonials Section
  {
    id: 'testimonials_bg',
    section: 'Testimonials Section',
    name: 'About Background Image',
    description: 'Full-width background image with gradient overlay',
    dimensions: '1920 x 1080 px (16:9)',
    aspectRatio: '16/9',
    path: '/images/3d4046a0-b072-4b07-941f-9141ee3ed4a7.png',
  },
]

// Group slots by section
const groupedSlots = imageSlots.reduce((acc, slot) => {
  if (!acc[slot.section]) {
    acc[slot.section] = []
  }
  acc[slot.section].push(slot)
  return acc
}, {} as Record<string, typeof imageSlots>)

interface UploadedImage {
  id: string
  url: string
  fileName: string
}

export default function Landing3ImagesPage() {
  const [uploading, setUploading] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadedImages, setUploadedImages] = useState<Record<string, UploadedImage>>({})
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchUploadedImages()
  }, [])

  const fetchUploadedImages = async () => {
    try {
      const { data, error } = await supabase
        .from('landing3_images')
        .select('*')

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        const imagesMap: Record<string, UploadedImage> = {}
        data.forEach((img: any) => {
          imagesMap[img.slot_id] = {
            id: img.id,
            url: img.url,
            fileName: img.file_name,
          }
        })
        setUploadedImages(imagesMap)
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      toast.error('Failed to load uploaded images')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (slotId: string, file: File) => {
    setUploading(slotId)
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `landing3/${slotId}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName)

      // Save to database
      const { error: dbError } = await supabase
        .from('landing3_images')
        .upsert({
          slot_id: slotId,
          url: urlData.publicUrl,
          file_name: file.name,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'slot_id',
        })

      if (dbError) throw dbError

      // Update local state
      setUploadedImages(prev => ({
        ...prev,
        [slotId]: {
          id: slotId,
          url: urlData.publicUrl,
          fileName: file.name,
        }
      }))

      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('landing3_images')
        .delete()
        .eq('slot_id', slotId)

      if (error) throw error

      setUploadedImages(prev => {
        const newState = { ...prev }
        delete newState[slotId]
        return newState
      })

      toast.success('Image removed')
    } catch (error: any) {
      console.error('Delete failed:', error)
      toast.error(error.message || 'Failed to delete image')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Landing 3 Images</h1>
            <p className="text-lg text-muted-foreground">
              Upload images for the ecommerce template landing page
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.open('/landing3', '_blank')}
              variant="outline"
              className="h-12 px-6 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Page
            </Button>
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300 font-medium">Image Dimensions</p>
              <p className="text-sm text-blue-300/70 mt-1">
                Each image slot shows the recommended dimensions. Upload images at these sizes for best results.
                Images will be automatically resized to fit, but matching dimensions ensures optimal quality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Image Sections */}
        {Object.entries(groupedSlots).map(([section, slots], sectionIndex) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + sectionIndex * 0.05 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-foreground">{section}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot) => {
                const uploaded = uploadedImages[slot.id]
                const isUploading = uploading === slot.id
                
                return (
                  <div
                    key={slot.id}
                    className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl"
                  >
                    {/* Image Preview */}
                    <div 
                      className="relative bg-black/20"
                      style={{ aspectRatio: slot.aspectRatio }}
                    >
                      {uploaded ? (
                        <Image
                          src={uploaded.url}
                          alt={slot.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                          <span className="text-sm">No image uploaded</span>
                        </div>
                      )}
                      
                      {/* Upload overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                      
                      {/* Uploaded indicator */}
                      {uploaded && !isUploading && (
                        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{slot.name}</h3>
                        <p className="text-sm text-muted-foreground">{slot.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-md bg-primary/20 text-primary font-mono">
                          {slot.dimensions}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Label className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleUpload(slot.id, file)
                            }}
                            disabled={isUploading}
                          />
                          <div className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors font-medium text-sm">
                            <Upload className="h-4 w-4" />
                            {uploaded ? 'Replace' : 'Upload'}
                          </div>
                        </Label>
                        
                        {uploaded && (
                          <Button
                            onClick={() => handleDelete(slot.id)}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {uploaded && (
                        <p className="text-xs text-muted-foreground truncate">
                          {uploaded.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
