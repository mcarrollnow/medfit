"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ShippingAddress, useAddressStore } from "@/lib/address-store"
import { getCustomerProfile } from "@/lib/auth-client"
import Script from "next/script"

// Get the API key for client-side use
const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

interface ShippingAddressFormProps {
  onAddressChange?: (address: Omit<ShippingAddress, "id">) => void
}

export function ShippingAddressFormSimplified({ onAddressChange }: ShippingAddressFormProps) {
  const { addresses, getDefaultAddress, addAddress } = useAddressStore()
  const addressInputRef = useRef<HTMLInputElement>(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Validate API key on component mount (silently - don't show user errors)
  useEffect(() => {
    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.length < 10 || GOOGLE_PLACES_API_KEY === 'YOUR_NEW_UNRESTRICTED_API_KEY') {
      // Google Places not configured - that's fine, manual entry works
      console.log('[Checkout] Google Places API not configured - manual entry available')
    }
  }, [])
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  // Load saved addresses and profile on mount
  useEffect(() => {
    async function loadData() {
      try {
        const profile = await getCustomerProfile()
        if (profile) {
          // First set name and email from profile
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          const email = profile.email || ''
          
          // Now fetch the default shipping address from shipping_addresses table
          const supabase = (await import('@/lib/supabase')).getSupabaseBrowserClient()
          if (supabase && profile.id) {
            const { data: defaultAddress } = await supabase
              .from('shipping_addresses')
              .select('*')
              .eq('customer_id', profile.id)
              .eq('is_default', true)
              .single()
            
            if (defaultAddress) {
              setFormData({
                name,
                email,
                addressLine1: defaultAddress.address_line1 || '',
                addressLine2: defaultAddress.address_line2 || '',
                city: defaultAddress.city || '',
                state: defaultAddress.state || '',
                zipCode: defaultAddress.zip || '',
                country: defaultAddress.country || 'United States',
              })
              return
            }
          }
          
          // If no saved shipping address, just set name and email
          setFormData(prev => ({
            ...prev,
            name,
            email,
          }))
        }
      } catch (error) {
        console.error('[Checkout] Error loading customer data:', error)
      }
    }
    loadData()
  }, [])

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (googleLoaded && addressInputRef.current && window.google) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: ['us'] }
        })
        
        setApiError(null)
        console.log('[Checkout] Google Places Autocomplete initialized successfully')

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        
        if (!place.address_components) return

        let street = ''
        let city = ''
        let state = ''
        let zip = ''

        place.address_components.forEach((component: any) => {
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

        setFormData(prev => ({
          ...prev,
          addressLine1: street,
          city,
          state,
          zipCode: zip,
        }))
      })
      } catch (error) {
        console.error('[Checkout] Failed to initialize Google Places:', error)
        setApiError('Address autocomplete unavailable. Manual entry is still supported.')
      }
    }
  }, [googleLoaded])

  useEffect(() => {
    onAddressChange?.(formData)
  }, [formData, onAddressChange])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressSelect = (addressId: string) => {
    if (addressId === 'new') {
      setFormData(prev => ({
        ...prev,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
      }))
    } else {
      const addr = addresses.find(a => a.id === addressId)
      if (addr) {
        setFormData(prev => ({
          ...prev,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 || '',
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
        }))
      }
    }
  }

  return (
    <>
      {GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY.length > 10 && !apiError && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`}
          strategy="lazyOnload"
          onLoad={() => {
            console.log('[Checkout] Google Maps script loaded successfully')
            setGoogleLoaded(true)
            setIsLoading(false)
          }}
          onError={() => {
            // Silently handle - manual address entry is still available
            console.log('[Checkout] Google Maps unavailable - using manual entry')
            setApiError(null) // Don't show error, just disable autocomplete
            setIsLoading(false)
          }}
          onReady={() => {
            setIsLoading(true)
          }}
        />
      )}
      
      <div className="space-y-3 md:space-y-6">
        {addresses.length > 0 && (
          <div>
            <Label>Saved Addresses</Label>
            <Select onValueChange={handleAddressSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((addr) => (
                  <SelectItem key={addr.id} value={addr.id}>
                    {addr.name} - {addr.addressLine1}, {addr.city}, {addr.state}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ New Address</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="name" className="text-base font-semibold mb-2 block pl-3">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-semibold mb-2 block pl-3">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
            required
          />
        </div>

        <div className="relative">
          <Label className="text-base font-semibold mb-2 block pl-3">Address</Label>
          <Input
            ref={addressInputRef}
            value={formData.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            placeholder={apiError ? "Address autocomplete unavailable - type full address" : "Start typing address..."}
            disabled={!!apiError && isLoading}
            className={`h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg ${apiError ? "border-red-500" : ""}`}
            autoComplete="off"
            required
          />
          
          {isLoading && !googleLoaded && (
            <div className="absolute right-3 top-10">
              <div className="animate-spin h-4 w-4 border-2 border-border0 border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {apiError && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              <div className="font-medium">Address Autocomplete Error:</div>
              <div className="text-xs mt-1">{apiError}</div>
              <div className="text-xs mt-2 text-red-500">
                Please manually enter your complete address in the fields below.
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="addressLine2" className="text-base font-semibold mb-2 block pl-3">Apt, Suite, Unit (Optional)</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          <div className="col-span-2">
            <Label htmlFor="city" className="text-base font-semibold mb-2 block pl-3">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
              required
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-base font-semibold mb-2 block pl-3">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              maxLength={2}
              placeholder="CA"
              className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
              required
            />
          </div>
          <div>
            <Label htmlFor="zipCode" className="text-base font-semibold mb-2 block pl-3">ZIP</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="90210"
              className="h-12 text-base bg-foreground/[0.04] border-border focus:border-border rounded-lg"
              required
            />
          </div>
        </div>
      </div>
    </>
  )
}
