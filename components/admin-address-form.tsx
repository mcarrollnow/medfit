'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import Script from 'next/script'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

export interface GuestOrderInfo {
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
}

interface AdminAddressFormProps {
  value: GuestOrderInfo
  onChange: (info: GuestOrderInfo) => void
}

export function AdminAddressForm({ value, onChange }: AdminAddressFormProps) {
  const addressInputRef = useRef<HTMLInputElement>(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (googleLoaded && addressInputRef.current && window.google?.maps?.places) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: ['us'] }
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.address_components) return

          let street = ''
          let city = ''
          let state = ''
          let zip = ''

          place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
            const types = component.types
            if (types.includes('street_number')) {
              street = component.long_name + ' '
            }
            if (types.includes('route')) {
              street += component.long_name
            }
            if (types.includes('locality')) {
              city = component.long_name
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name
            }
            if (types.includes('postal_code')) {
              zip = component.long_name
            }
          })

          onChange({
            ...value,
            addressLine1: street,
            city,
            state,
            zip,
          })
        })

        console.log('[AdminAddressForm] Google Places Autocomplete initialized')
      } catch (error) {
        console.error('[AdminAddressForm] Failed to initialize Google Places:', error)
      }
    }
  }, [googleLoaded, onChange, value])

  const handleChange = (field: keyof GuestOrderInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue })
  }

  return (
    <>
      {GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY.length > 10 && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`}
          strategy="lazyOnload"
          onLoad={() => setGoogleLoaded(true)}
          onError={() => console.log('[AdminAddressForm] Google Maps unavailable')}
        />
      )}

      <div className="space-y-4">
        {/* Name & Contact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-1">Name *</label>
            <Input
              value={value.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Customer name"
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Phone</label>
            <Input
              type="tel"
              value={value.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 555-5555"
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-white/40 mb-1">Email</label>
          <Input
            type="email"
            value={value.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Address with Autocomplete */}
        <div>
          <label className="block text-xs text-white/40 mb-1">Street Address *</label>
          <Input
            ref={addressInputRef}
            value={value.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            placeholder="Start typing address..."
            autoComplete="off"
            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-xs text-white/40 mb-1">Apt, Suite, Unit</label>
          <Input
            value={value.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            placeholder="Optional"
            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs text-white/40 mb-1">City *</label>
            <Input
              value={value.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">State *</label>
            <Input
              value={value.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
              placeholder="CA"
              maxLength={2}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">ZIP *</label>
            <Input
              value={value.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              placeholder="90210"
              className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>
      </div>
    </>
  )
}

