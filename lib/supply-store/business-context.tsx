"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SupplyStoreBusinessType } from "./types"

interface BusinessContextType {
  businessType: SupplyStoreBusinessType
  setBusinessType: (type: SupplyStoreBusinessType) => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function SupplyStoreBusinessProvider({ 
  children,
  initialBusinessType 
}: { 
  children: ReactNode
  initialBusinessType?: SupplyStoreBusinessType 
}) {
  const [businessType, setBusinessType] = useState<SupplyStoreBusinessType>(initialBusinessType || "gym")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If initial type is provided (from user role), use that
    if (initialBusinessType) {
      setBusinessType(initialBusinessType)
      return
    }
    // Otherwise check localStorage
    const stored = localStorage.getItem("supply-store-business-type") as SupplyStoreBusinessType | null
    if (stored && ["gym", "medspa", "wellness"].includes(stored)) {
      setBusinessType(stored)
    }
  }, [initialBusinessType])

  const handleSetBusinessType = (type: SupplyStoreBusinessType) => {
    setBusinessType(type)
    localStorage.setItem("supply-store-business-type", type)
  }

  if (!mounted) {
    return null
  }

  return (
    <BusinessContext.Provider value={{ businessType, setBusinessType: handleSetBusinessType }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useSupplyStoreBusinessType() {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error("useSupplyStoreBusinessType must be used within a SupplyStoreBusinessProvider")
  }
  return context
}

