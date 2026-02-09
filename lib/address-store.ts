"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ShippingAddress {
  id: string
  name: string
  email?: string
  phone?: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  zip?: string
  country: string
  isDefault?: boolean
}

interface AddressStore {
  addresses: ShippingAddress[]
  addAddress: (address: Omit<ShippingAddress, "id">) => void
  updateAddress: (id: string, address: Partial<ShippingAddress>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  getDefaultAddress: () => ShippingAddress | undefined
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (addressData) => {
        const address: ShippingAddress = {
          ...addressData,
          id: `addr-${Date.now()}`,
        }

        // If this is the first address, make it default
        const isFirstAddress = get().addresses.length === 0
        if (isFirstAddress) {
          address.isDefault = true
        }

        set((state) => ({
          addresses: [...state.addresses, address],
        }))
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr)),
        }))
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
        }))
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }))
      },

      getDefaultAddress: () => {
        return get().addresses.find((addr) => addr.isDefault)
      },
    }),
    {
      name: "address-storage",
    },
  ),
)
