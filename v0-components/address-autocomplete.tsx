"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }) => void
  placeholder?: string
  value?: string
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Enter address...",
  value = "",
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autocompleteService = useRef<any>(null)
  const placesService = useRef<any>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    // Initialize Google Places Autocomplete service
    if (typeof window !== "undefined" && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService()
      placesService.current = new (window as any).google.maps.places.PlacesService(document.createElement("div"))
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = async (value: string) => {
    setInputValue(value)

    if (value.length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    // Mock suggestions for demo (replace with actual Google Places API call)
    setTimeout(() => {
      const mockSuggestions = [
        {
          place_id: "1",
          description: "123 Main St, New York, NY 10001, USA",
        },
        {
          place_id: "2",
          description: "456 Broadway, New York, NY 10013, USA",
        },
        {
          place_id: "3",
          description: "789 Park Ave, New York, NY 10021, USA",
        },
      ].filter((s) => s.description.toLowerCase().includes(value.toLowerCase()))

      setSuggestions(mockSuggestions)
      setIsOpen(mockSuggestions.length > 0)
      setIsLoading(false)
    }, 300)

    // Actual Google Places API call (uncomment when API key is available):
    /*
    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['address'],
        },
        (predictions: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setIsOpen(true)
          } else {
            setSuggestions([])
            setIsOpen(false)
          }
          setIsLoading(false)
        }
      )
    }
    */
  }

  const handleSelectSuggestion = (suggestion: any) => {
    setInputValue(suggestion.description)
    setIsOpen(false)

    // Mock address parsing (replace with actual Google Places Details API call)
    const mockAddress = {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    }
    onAddressSelect(mockAddress)

    // Actual Google Places Details API call (uncomment when API key is available):
    /*
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['address_components'],
        },
        (place: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK) {
            const addressComponents = place.address_components
            const address = {
              address: '',
              city: '',
              state: '',
              zip: '',
              country: '',
            }

            addressComponents.forEach((component: any) => {
              const types = component.types
              if (types.includes('street_number')) {
                address.address = component.long_name + ' '
              }
              if (types.includes('route')) {
                address.address += component.long_name
              }
              if (types.includes('locality')) {
                address.city = component.long_name
              }
              if (types.includes('administrative_area_level_1')) {
                address.state = component.short_name
              }
              if (types.includes('postal_code')) {
                address.zip = component.long_name
              }
              if (types.includes('country')) {
                address.country = component.long_name
              }
            })

            onAddressSelect(address)
          }
        }
      )
    }
    */
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-background border-2 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-3 border-b last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 rounded-lg shadow-lg z-50 px-4 py-3">
          <div className="text-sm text-muted-foreground">Loading suggestions...</div>
        </div>
      )}
    </div>
  )
}
