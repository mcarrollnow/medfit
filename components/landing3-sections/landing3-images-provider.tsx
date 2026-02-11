'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

// Default/fallback images keyed by slot_id
// All fallbacks use placeholder.svg — upload real images via /admin/landing3
const PLACEHOLDER = '/placeholder.svg'

const defaultImages: Record<string, string> = {
  // Hero Section
  hero_main: PLACEHOLDER,
  hero_left_1: PLACEHOLDER,
  hero_left_2: PLACEHOLDER,
  hero_right_1: PLACEHOLDER,
  hero_right_2: PLACEHOLDER,

  // Philosophy Section
  philosophy_left: PLACEHOLDER,
  philosophy_right: PLACEHOLDER,

  // Featured Products
  featured_1: PLACEHOLDER,
  featured_2: PLACEHOLDER,
  featured_3: PLACEHOLDER,
  featured_4: PLACEHOLDER,
  featured_5: PLACEHOLDER,
  featured_6: PLACEHOLDER,

  // Technology Section
  tech_main: PLACEHOLDER,
  tech_left_1: PLACEHOLDER,
  tech_left_2: PLACEHOLDER,
  tech_right_1: PLACEHOLDER,
  tech_right_2: PLACEHOLDER,

  // Gallery Section
  gallery_1: PLACEHOLDER,
  gallery_2: PLACEHOLDER,
  gallery_3: PLACEHOLDER,
  gallery_4: PLACEHOLDER,
  gallery_5: PLACEHOLDER,
  gallery_6: PLACEHOLDER,
  gallery_7: PLACEHOLDER,
  gallery_8: PLACEHOLDER,

  // Collection Section
  accessory_1: PLACEHOLDER,
  accessory_2: PLACEHOLDER,
  accessory_3: PLACEHOLDER,
  accessory_4: PLACEHOLDER,
  accessory_5: PLACEHOLDER,
  accessory_6: PLACEHOLDER,

  // Testimonials Section
  testimonials_bg: PLACEHOLDER,
}

interface Landing3ImagesContextType {
  getImage: (slotId: string) => string
  isLoaded: boolean
}

const Landing3ImagesContext = createContext<Landing3ImagesContextType>({
  getImage: (slotId: string) => defaultImages[slotId] || '/placeholder.svg',
  isLoaded: false,
})

export function useLanding3Images() {
  return useContext(Landing3ImagesContext)
}

export function Landing3ImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function fetchImages() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('landing3_images')
          .select('slot_id, url')

        if (error) {
          // Table might not exist yet or be empty — just use defaults
          console.warn('landing3_images fetch:', error.message)
          setIsLoaded(true)
          return
        }

        if (data && data.length > 0) {
          const imageMap: Record<string, string> = {}
          data.forEach((row: { slot_id: string; url: string }) => {
            imageMap[row.slot_id] = row.url
          })
          setImages(imageMap)
        }
      } catch (err) {
        console.warn('Failed to fetch landing3 images:', err)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchImages()
  }, [])

  const getImage = (slotId: string): string => {
    // Supabase image takes priority, then fall back to default
    return images[slotId] || defaultImages[slotId] || '/placeholder.svg'
  }

  return (
    <Landing3ImagesContext.Provider value={{ getImage, isLoaded }}>
      {children}
    </Landing3ImagesContext.Provider>
  )
}
