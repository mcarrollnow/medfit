'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { getHeaderColor, getProfileCardUrl } from '@/lib/profile-cards'

interface MiniProductCardProps {
  product: Product
  onClick: () => void
}

interface EfficacyBar {
  label: string
  value: number
}

const abbreviateLabel = (label: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Testosterone Production': 'Testosterone Prod.',
    'Cardiovascular Protection': 'Cardiovascular Prot.',
    'Anti-Inflammatory': 'Anti-Inflam.',
    'Tissue Regeneration': 'Tissue Regen.',
    'Collagen Synthesis': 'Collagen Synth.',
    'Growth Hormone': 'Growth Hormone',
    'Glucose Control': 'Glucose Control',
    'Weight Loss': 'Weight Loss',
    'Fertility Enhancement': 'Fertility Enh.',
    'Muscle Growth': 'Muscle Growth',
    'Fat Loss': 'Fat Loss',
  }
  
  // Return abbreviated version if exists, otherwise truncate if too long
  if (abbreviations[label]) return abbreviations[label]
  if (label.length > 18) return label.substring(0, 15) + '...'
  return label
}

export default function MiniProductCard({ product, onClick }: MiniProductCardProps) {
  const baseName = product.base_name || product.name.split(' ')[0]
  const variant = product.variant || product.name.match(/\d+\s*(?:IU|iu|MG|mg|ML|ml)/i)?.[0]?.toUpperCase() || ''
  const labelColor = getHeaderColor(product.name)
  const [efficacyBars, setEfficacyBars] = useState<EfficacyBar[]>([])
  
  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(255, 249, 94, ${alpha})`
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  useEffect(() => {
    const fetchEfficacyBars = async () => {
      try {
        const profileCardPath = getProfileCardUrl(product.name)
        if (!profileCardPath) {
          console.log('[v0] No profile card found for:', product.name)
          return
        }
        
        const response = await fetch(profileCardPath)
        if (!response.ok) {
          console.log('[v0] Failed to fetch profile card:', profileCardPath)
          return
        }
        
        const html = await response.text()
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        const bars: EfficacyBar[] = []
        const efficacyLabels = doc.querySelectorAll('.efficacy-label')
        const efficacyFills = doc.querySelectorAll('.efficacy-fill')
        
        efficacyLabels.forEach((label, index) => {
          const fillElement = efficacyFills[index] as HTMLElement
          const widthStr = fillElement?.style.width || '0%'
          const value = parseInt(widthStr.replace('%', ''))
          
          bars.push({
            label: label.textContent?.trim() || '',
            value: value
          })
        })
        
        setEfficacyBars(bars.slice(0, 3))
      } catch (error) {
        console.error('[v0] Error fetching efficacy bars:', error)
      }
    }
    
    fetchEfficacyBars()
  }, [product.name])

  return (
    <button
      onClick={onClick}
      className="group relative w-full h-80 flex flex-col justify-between items-center bg-black rounded-lg p-4 sm:p-6 border border-neutral-800 transition-all duration-300 cursor-pointer font-mono hover:-translate-y-1 hover:rotate-1"
      style={{
        boxShadow: `0 4px 16px ${hexToRgba(labelColor, 0.2)}, 0 0 40px ${hexToRgba(labelColor, 0.1)}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${hexToRgba(labelColor, 0.35)}, 0 0 60px ${hexToRgba(labelColor, 0.2)}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 16px ${hexToRgba(labelColor, 0.2)}, 0 0 40px ${hexToRgba(labelColor, 0.1)}`
      }}
    >
      {/* Product Name - Top Centered */}
      <div className="w-full text-center px-2">
        <h3 className="text-lg sm:text-xl font-extrabold tracking-wider text-white uppercase leading-tight">
          {baseName}
        </h3>
      </div>

      {/* Efficacy Bars - Centered Middle Section */}
      {efficacyBars.length > 0 ? (
        <div className="w-full flex flex-col gap-2 sm:gap-3 px-2">
          {efficacyBars.map((bar, index) => (
            <div key={index} className="w-full space-y-1">
              <div className="w-full text-center text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wide">
                {abbreviateLabel(bar.label)}
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${bar.value}%`,
                    backgroundColor: labelColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Dosage - Bottom Centered */}
      {variant && (
        <div className="w-full text-center px-2">
          <p className="text-lg sm:text-xl font-black text-white tracking-widest uppercase">
            {variant}
          </p>
        </div>
      )}
    </button>
  )
}
