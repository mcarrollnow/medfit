'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Search,
  DollarSign,
  User,
  ShoppingCart,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Box
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { NumericKeypad } from '@/components/numeric-keypad'
import { AdminAddressForm, type GuestOrderInfo } from '@/components/admin-address-form'
import { AdminPaymentOptionsModal } from '@/components/admin-payment-options-modal'

// Keypad state type
interface KeypadState {
  isOpen: boolean
  type: 'qty' | 'price' | 'shipping' | 'discount' | 'custom-qty' | 'custom-price' | 'new-custom-qty' | 'new-custom-price'
  targetId?: string // variant id or custom item id
  label: string
  value: string
  allowDecimal: boolean
  prefix: string
}

interface Product {
  id: string
  barcode: string
  name: string
  base_name: string
  variant: string
  category_id: string | null
  color: string
  cost_price: string
  b2b_price: string
  retail_price: string
  current_stock: number
  is_active: boolean
  category?: {
    id: string
    name: string
    color: string | null
  } | null
}

interface GroupedProduct {
  base_name: string
  category_id: string | null
  category?: { id: string; name: string; color: string | null } | null
  color: string
  is_active: boolean
  variants: Product[]
}

interface OrderItem {
  id: string
  product_id: string | null
  product_name: string
  product_barcode: string | null
  variant: string
  quantity: number
  unit_price: number
  total_price: number
  is_custom: boolean
}

interface CustomItem {
  id: string
  name: string
  quantity: number
  unit_price: number
}

interface Customer {
  id: string
  user_id: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  company_name: string | null
  customer_type: 'retail' | 'b2b'
  phone: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  total_orders?: number
  total_spent?: number
}

// Guest customer placeholder
const GUEST_CUSTOMER: Customer = {
  id: 'guest',
  user_id: null,
  first_name: 'Guest',
  last_name: 'Customer',
  email: null,
  company_name: null,
  customer_type: 'retail',
  phone: null,
  shipping_address_line1: null,
  shipping_city: null,
  shipping_state: null,
  shipping_zip: null,
  shipping_country: null
}

function groupProductsByBaseName(products: Product[]): GroupedProduct[] {
  const grouped: Record<string, GroupedProduct> = {}

  for (const product of products) {
    if (!grouped[product.base_name]) {
      grouped[product.base_name] = {
        base_name: product.base_name,
        category_id: product.category_id,
        category: product.category,
        color: product.color,
        is_active: product.is_active,
        variants: []
      }
    }
    grouped[product.base_name].variants.push(product)
  }

  return Object.values(grouped).sort((a, b) => a.base_name.localeCompare(b.base_name))
}

export default function CreateCustomOrderPage() {
  const router = useRouter()
  
  // Data loading state
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Order state
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customItems, setCustomItems] = useState<CustomItem[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [orderNotes, setOrderNotes] = useState('')
  const [shippingAmount, setShippingAmount] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    customer_type: 'retail' as 'retail' | 'b2b'
  })
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  
  // Guest order info (name + address)
  const [guestOrderInfo, setGuestOrderInfo] = useState<GuestOrderInfo>({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  })
  
  // Ref for click outside handling
  const customerDropdownRef = useRef<HTMLDivElement>(null)
  
  // Click outside handler for customer dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false)
      }
    }
    
    if (showCustomerDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCustomerDropdown])
  
  // New custom item form
  const [newCustomItem, setNewCustomItem] = useState({
    name: '',
    quantity: 1,
    unit_price: 0
  })

  // Keypad state
  const [keypad, setKeypad] = useState<KeypadState>({
    isOpen: false,
    type: 'qty',
    label: '',
    value: '',
    allowDecimal: false,
    prefix: ''
  })

  // Fetch products and customers
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch('/api/admin/products', { credentials: 'include' }),
          fetch('/api/admin/customers', { credentials: 'include' })
        ])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData)
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json()
          console.log('[Create Order] Loaded customers:', customersData.length)
          setCustomers(customersData)
        } else {
          console.error('[Create Order] Failed to load customers:', customersRes.status)
          const errorData = await customersRes.json().catch(() => ({}))
          console.error('[Create Order] Customer error:', errorData)
        }
      } catch (err) {
        console.error('[Create Order] Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Group products by base name
  const groupedProducts = useMemo(() => groupProductsByBaseName(products), [products])

  // Filter products by search
  const filteredProducts = useMemo(() => {
    return groupedProducts.filter(p => 
      p.base_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some(v => v.variant.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [groupedProducts, searchQuery])

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers.slice(0, 20)
    const query = customerSearch.toLowerCase()
    return customers.filter(c => 
      c.first_name?.toLowerCase().includes(query) ||
      c.last_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.company_name?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query)
    ).slice(0, 20)
  }, [customers, customerSearch])

  // Calculate totals
  const subtotal = useMemo(() => {
    const productTotal = orderItems.reduce((sum, item) => sum + item.total_price, 0)
    const customTotal = customItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    return productTotal + customTotal
  }, [orderItems, customItems])

  const total = useMemo(() => {
    return subtotal + shippingAmount - discountAmount
  }, [subtotal, shippingAmount, discountAmount])

  const selectedCustomer = useMemo(() => {
    if (selectedCustomerId === 'guest') return GUEST_CUSTOMER
    return customers.find(c => c.id === selectedCustomerId)
  }, [customers, selectedCustomerId])

  // Toggle product expansion
  const toggleProductExpansion = (baseName: string) => {
    setExpandedProducts(prev => {
      const next = new Set(prev)
      if (next.has(baseName)) {
        next.delete(baseName)
      } else {
        next.add(baseName)
      }
      return next
    })
  }

  // Add variant to order
  const addVariantToOrder = (product: Product, quantity: number, customPrice?: number) => {
    if (quantity <= 0) return

    const priceToUse = customPrice ?? parseFloat(product.b2b_price || product.retail_price)
    
    setOrderItems(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity, unit_price: priceToUse, total_price: quantity * priceToUse }
            : item
        )
      } else {
        return [...prev, {
          id: `item-${Date.now()}-${Math.random()}`,
          product_id: product.id,
          product_name: `${product.base_name} ${product.variant}`,
          product_barcode: product.barcode,
          variant: product.variant,
          quantity,
          unit_price: priceToUse,
          total_price: quantity * priceToUse,
          is_custom: false
        }]
      }
    })
  }

  // Update order item quantity
  const updateOrderItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeOrderItem(itemId)
      return
    }
    setOrderItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total_price: quantity * item.unit_price }
        : item
    ))
  }

  // Update order item price
  const updateOrderItemPrice = (itemId: string, price: number) => {
    setOrderItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, unit_price: price, total_price: item.quantity * price }
        : item
    ))
  }

  // Remove order item
  const removeOrderItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Get order item for a variant
  const getOrderItemForVariant = (productId: string): OrderItem | undefined => {
    return orderItems.find(item => item.product_id === productId)
  }

  // Add custom item
  const addCustomItem = () => {
    if (!newCustomItem.name.trim() || newCustomItem.quantity <= 0) return

    setCustomItems(prev => [...prev, {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: newCustomItem.name.trim(),
      quantity: newCustomItem.quantity,
      unit_price: newCustomItem.unit_price
    }])

    setNewCustomItem({ name: '', quantity: 1, unit_price: 0 })
  }

  // Update custom item
  const updateCustomItem = (itemId: string, field: keyof CustomItem, value: string | number) => {
    setCustomItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  // Remove custom item
  const removeCustomItem = (itemId: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Create new customer
  const handleCreateCustomer = async () => {
    if (!newCustomer.first_name.trim() && !newCustomer.company_name.trim()) {
      setSaveError('Please enter a name or company name')
      return
    }

    setIsCreatingCustomer(true)
    try {
      const response = await fetch('/api/admin/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCustomer)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create customer')
      }

      const createdCustomer = await response.json()
      
      // Add to customers list and select
      setCustomers(prev => [createdCustomer, ...prev])
      setSelectedCustomerId(createdCustomer.id)
      setCustomerSearch(`${createdCustomer.first_name || ''} ${createdCustomer.last_name || ''}`.trim())
      setShowNewCustomerForm(false)
      setNewCustomer({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        customer_type: 'retail'
      })
    } catch (err) {
      console.error('Error creating customer:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to create customer')
    } finally {
      setIsCreatingCustomer(false)
    }
  }

  // Open keypad for variant quantity
  const openQtyKeypad = (variant: Product, currentQty: number) => {
    setKeypad({
      isOpen: true,
      type: 'qty',
      targetId: variant.id,
      label: `${variant.base_name} ${variant.variant} - Quantity`,
      value: currentQty > 0 ? currentQty.toString() : '',
      allowDecimal: false,
      prefix: ''
    })
  }

  // Open keypad for variant price - starts empty so user can type fresh
  const openPriceKeypad = (variant: Product, currentPrice: number) => {
    setKeypad({
      isOpen: true,
      type: 'price',
      targetId: variant.id,
      label: `${variant.base_name} ${variant.variant} - Price`,
      value: '',
      allowDecimal: true,
      prefix: '$'
    })
  }

  // Open keypad for custom item quantity
  const openCustomQtyKeypad = (item: CustomItem) => {
    setKeypad({
      isOpen: true,
      type: 'custom-qty',
      targetId: item.id,
      label: `${item.name} - Quantity`,
      value: item.quantity.toString(),
      allowDecimal: false,
      prefix: ''
    })
  }

  // Open keypad for custom item price - starts empty so user can type fresh
  const openCustomPriceKeypad = (item: CustomItem) => {
    setKeypad({
      isOpen: true,
      type: 'custom-price',
      targetId: item.id,
      label: `${item.name} - Price`,
      value: '',
      allowDecimal: true,
      prefix: '$'
    })
  }

  // Open keypad for new custom item
  const openNewCustomQtyKeypad = () => {
    setKeypad({
      isOpen: true,
      type: 'new-custom-qty',
      label: 'New Item - Quantity',
      value: newCustomItem.quantity.toString(),
      allowDecimal: false,
      prefix: ''
    })
  }

  // Starts empty so user can type fresh
  const openNewCustomPriceKeypad = () => {
    setKeypad({
      isOpen: true,
      type: 'new-custom-price',
      label: 'New Item - Price',
      value: '',
      allowDecimal: true,
      prefix: '$'
    })
  }

  // Open keypad for shipping - starts empty so user can type fresh
  const openShippingKeypad = () => {
    setKeypad({
      isOpen: true,
      type: 'shipping',
      label: 'Shipping Amount',
      value: '',
      allowDecimal: true,
      prefix: '$'
    })
  }

  // Open keypad for discount - starts empty so user can type fresh
  const openDiscountKeypad = () => {
    setKeypad({
      isOpen: true,
      type: 'discount',
      label: 'Discount Amount',
      value: '',
      allowDecimal: true,
      prefix: '$'
    })
  }

  // Handle keypad value change
  const handleKeypadChange = (value: string) => {
    setKeypad(prev => ({ ...prev, value }))
  }

  // Handle keypad close/submit
  const handleKeypadClose = () => {
    const numValue = keypad.allowDecimal ? parseFloat(keypad.value) || 0 : parseInt(keypad.value) || 0

    switch (keypad.type) {
      case 'qty':
        if (keypad.targetId) {
          const variant = products.find(p => p.id === keypad.targetId)
          if (variant) {
            const orderItem = getOrderItemForVariant(variant.id)
            if (numValue > 0) {
              addVariantToOrder(variant, numValue, orderItem?.unit_price)
            } else if (orderItem) {
              removeOrderItem(orderItem.id)
            }
          }
        }
        break
      case 'price':
        if (keypad.targetId) {
          const variant = products.find(p => p.id === keypad.targetId)
          if (variant) {
            const orderItem = getOrderItemForVariant(variant.id)
            if (orderItem) {
              updateOrderItemPrice(orderItem.id, numValue)
            } else if (numValue > 0) {
              addVariantToOrder(variant, 1, numValue)
            }
          }
        }
        break
      case 'custom-qty':
        if (keypad.targetId) {
          updateCustomItem(keypad.targetId, 'quantity', Math.max(1, numValue))
        }
        break
      case 'custom-price':
        if (keypad.targetId) {
          updateCustomItem(keypad.targetId, 'unit_price', numValue)
        }
        break
      case 'new-custom-qty':
        setNewCustomItem(prev => ({ ...prev, quantity: Math.max(1, numValue) }))
        break
      case 'new-custom-price':
        setNewCustomItem(prev => ({ ...prev, unit_price: numValue }))
        break
      case 'shipping':
        setShippingAmount(numValue)
        break
      case 'discount':
        setDiscountAmount(numValue)
        break
    }

    setKeypad(prev => ({ ...prev, isOpen: false }))
  }

  // Submit order
  const handleSubmitOrder = async () => {
    console.log('[Create Order] Button clicked')
    console.log('[Create Order] selectedCustomerId:', selectedCustomerId)
    console.log('[Create Order] orderItems:', orderItems.length)
    console.log('[Create Order] customItems:', customItems.length)
    
    if (!selectedCustomerId) {
      setSaveError('Please select a customer')
      return
    }
    
    // Validate guest order has required info
    if (selectedCustomerId === 'guest') {
      if (!guestOrderInfo.name.trim()) {
        setSaveError('Please enter customer name')
        return
      }
      if (!guestOrderInfo.addressLine1.trim()) {
        setSaveError('Please enter street address')
        return
      }
      if (!guestOrderInfo.city.trim() || !guestOrderInfo.state.trim() || !guestOrderInfo.zip.trim()) {
        setSaveError('Please enter complete address (city, state, ZIP)')
        return
      }
    }

    if (orderItems.length === 0 && customItems.length === 0) {
      setSaveError('Please add at least one item to the order')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Combine order items and custom items
      const allItems = [
        ...orderItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_barcode: item.product_barcode,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          is_custom: false
        })),
        ...customItems.map(item => ({
          product_id: null,
          product_name: item.name,
          product_barcode: null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          is_custom: true
        }))
      ]

      console.log('[Create Order] Sending request...')
      const requestBody: any = {
        customer_id: selectedCustomerId,
        items: allItems,
        subtotal,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total_amount: total,
        notes: orderNotes
      }
      
      // Include guest order info if guest checkout
      if (selectedCustomerId === 'guest') {
        requestBody.guest_info = guestOrderInfo
      }
      
      console.log('[Create Order] Request body:', requestBody)

      const response = await fetch('/api/admin/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      console.log('[Create Order] Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[Create Order] Error response:', errorData)
        throw new Error(errorData.error || errorData.details || 'Failed to create order')
      }

      const result = await response.json()
      console.log('[Create Order] Success:', result)
      setSaveSuccess(true)
      
      // Show payment form inline
      const orderId = result.order?.id
      if (orderId) {
        setCreatedOrderId(orderId)
        setShowPaymentForm(true)
      } else {
        setTimeout(() => {
          router.push(`/admin/orders`)
        }, 1500)
      }

    } catch (err) {
      console.error('Error creating order:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading inventory...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden pb-32 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6 px-4 lg:px-0">
        {/* Back Navigation */}
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Orders</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white">Create Custom Order</h1>
            <p className="text-base sm:text-lg text-white/50">Build an order from inventory or add custom items</p>
          </div>
          {/* Desktop only - mobile uses fixed bottom bar */}
          <Button
            onClick={handleSubmitOrder}
            disabled={isSaving || !selectedCustomerId || (orderItems.length === 0 && customItems.length === 0)}
            className="hidden lg:flex rounded-xl px-8 h-12 disabled:opacity-50 bg-emerald-500 text-white hover:bg-emerald-600"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Continue to Payment
              </>
            )}
          </Button>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center"
          >
            <Check className="w-5 h-5 mr-3" />
            Order created successfully! Redirecting...
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            {saveError}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Inventory Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-white/50" />
                  Customer
                </h3>

                {/* Show selected customer or selection UI */}
                {selectedCustomerId === 'guest' ? (
                  /* Guest Order - Show Address Form */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Guest Order</Badge>
                        <span className="text-sm text-white/50">Enter shipping details</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCustomerId('')
                          setGuestOrderInfo({
                            name: '',
                            phone: '',
                            email: '',
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            zip: ''
                          })
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    </div>
                    <AdminAddressForm
                      value={guestOrderInfo}
                      onChange={setGuestOrderInfo}
                    />
                  </div>
                ) : selectedCustomer ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">
                            {selectedCustomer.first_name} {selectedCustomer.last_name}
                          </p>
                          {selectedCustomer.customer_type === 'b2b' && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">B2B</Badge>
                          )}
                        </div>
                        {selectedCustomer.email && (
                          <p className="text-sm text-white/50">{selectedCustomer.email}</p>
                        )}
                        {selectedCustomer.phone && (
                          <p className="text-sm text-white/40">{selectedCustomer.phone}</p>
                        )}
                        {selectedCustomer.shipping_address_line1 && (
                          <p className="text-sm text-white/40 mt-1">
                            {selectedCustomer.shipping_address_line1}, {selectedCustomer.shipping_city}, {selectedCustomer.shipping_state} {selectedCustomer.shipping_zip}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCustomerId('')
                          setCustomerSearch('')
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    </div>
                  </div>
                ) : showNewCustomerForm ? (
                  /* New Customer Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/40 mb-1">First Name</label>
                        <Input
                          value={newCustomer.first_name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                          placeholder="First name"
                          className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Last Name</label>
                        <Input
                          value={newCustomer.last_name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                          placeholder="Last name"
                          className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Email</label>
                      <Input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="email@example.com"
                        className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Phone</label>
                      <Input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="(555) 555-5555"
                        className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Company (optional)</label>
                      <Input
                        value={newCustomer.company_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                        placeholder="Company name"
                        className="h-12 rounded-xl bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Customer Type</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewCustomer({ ...newCustomer, customer_type: 'retail' })}
                          className={cn(
                            "flex-1 h-12 rounded-xl border font-medium transition-all",
                            newCustomer.customer_type === 'retail'
                              ? "bg-green-500/20 border-green-500/50 text-green-400"
                              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                          )}
                        >
                          Retail
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCustomer({ ...newCustomer, customer_type: 'b2b' })}
                          className={cn(
                            "flex-1 h-12 rounded-xl border font-medium transition-all",
                            newCustomer.customer_type === 'b2b'
                              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                          )}
                        >
                          B2B
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleCreateCustomer}
                        disabled={isCreatingCustomer || (!newCustomer.first_name.trim() && !newCustomer.company_name.trim())}
                        className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
                      >
                        {isCreatingCustomer ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Create Customer
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowNewCustomerForm(false)}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Customer Search & Quick Options */
                  <div className="space-y-4">
                    {/* Quick Options */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomerId('guest')
                          setCustomerSearch('Guest Customer')
                        }}
                        className="flex-1 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-medium hover:bg-yellow-500/20 transition-all"
                      >
                        Guest Checkout
                      </button>
                      <button
                        onClick={() => setShowNewCustomerForm(true)}
                        className="flex-1 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        New Customer
                      </button>
                    </div>

                    {/* Search existing customers */}
                    <div className="relative" ref={customerDropdownRef}>
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                      <Input
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value)
                          setShowCustomerDropdown(true)
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        placeholder="Search existing customers..."
                        className="pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                      />
                      {showCustomerDropdown && (
                        <div className="mt-2 max-h-[400px] overflow-y-auto overscroll-contain rounded-xl bg-zinc-900 border border-white/10 shadow-lg">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map(customer => (
                              <button
                                key={customer.id}
                                onClick={() => {
                                  setSelectedCustomerId(customer.id)
                                  setCustomerSearch(`${customer.first_name || ''} ${customer.last_name || ''}`.trim())
                                  setShowCustomerDropdown(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between border-b border-white/5 last:border-0",
                                  selectedCustomerId === customer.id && "bg-white/10"
                                )}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-white font-medium truncate">
                                    {customer.first_name || ''} {customer.last_name || ''}
                                    {customer.company_name && <span className="text-white/50"> ({customer.company_name})</span>}
                                  </p>
                                  <p className="text-sm text-white/40 truncate">{customer.email || 'No email'}</p>
                                  {customer.total_orders !== undefined && (
                                    <p className="text-xs text-white/30">{customer.total_orders} orders • ${(customer.total_spent || 0).toFixed(2)} spent</p>
                                  )}
                                </div>
                                <Badge variant="outline" className={cn(
                                  "border shrink-0 ml-2",
                                  customer.customer_type === 'b2b' 
                                    ? "border-blue-500/50 text-blue-400"
                                    : "border-green-500/50 text-green-400"
                                )}>
                                  {customer.customer_type === 'b2b' ? 'B2B' : 'Retail'}
                                </Badge>
                              </button>
                            ))
                          ) : customers.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                              <p className="text-white/40 mb-3">No customers in database</p>
                              <button
                                onClick={() => {
                                  setShowNewCustomerForm(true)
                                  setShowCustomerDropdown(false)
                                }}
                                className="text-emerald-400 hover:text-emerald-300 font-medium"
                              >
                                + Create first customer
                              </button>
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-white/40 mb-3">No customers found for &quot;{customerSearch}&quot;</p>
                              <button
                                onClick={() => {
                                  setNewCustomer({ ...newCustomer, first_name: customerSearch.split(' ')[0] || '', last_name: customerSearch.split(' ').slice(1).join(' ') || '' })
                                  setShowNewCustomerForm(true)
                                  setShowCustomerDropdown(false)
                                }}
                                className="text-emerald-400 hover:text-emerald-300 font-medium"
                              >
                                + Create new customer
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Customer count */}
                    <p className="text-xs text-white/30 text-center">
                      {customers.length} customers loaded
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Search */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-white/50" />
                  Inventory
                </h3>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                  />
                </div>

                {/* Product List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.map((product) => {
                    const isExpanded = expandedProducts.has(product.base_name)
                    const productColor = product.color || product.category?.color || '#FFFFFF'
                    const hasItemsInOrder = product.variants.some(v => getOrderItemForVariant(v.id))

                    return (
                      <motion.div
                        key={product.base_name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "rounded-xl border transition-all duration-300",
                          hasItemsInOrder 
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                        )}
                      >
                        {/* Product Header */}
                        <button
                          onClick={() => toggleProductExpansion(product.base_name)}
                          className="w-full p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${productColor}20` }}
                            >
                              <Box className="h-5 w-5" style={{ color: productColor }} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-white font-medium">{product.base_name}</h4>
                              <p className="text-sm text-white/40">
                                {product.category?.name || 'Uncategorized'} • {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasItemsInOrder && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                In Order
                              </Badge>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white/40" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white/40" />
                            )}
                          </div>
                        </button>

                        {/* Variants */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-2">
                            {product.variants.map((variant) => {
                              const orderItem = getOrderItemForVariant(variant.id)
                              const defaultPrice = parseFloat(variant.b2b_price || variant.retail_price) || 0

                              return (
                                <div
                                  key={variant.id}
                                  className={cn(
                                    "p-4 rounded-xl border transition-all",
                                    orderItem 
                                      ? "bg-emerald-500/10 border-emerald-500/30"
                                      : "bg-white/[0.03] border-white/5"
                                  )}
                                >
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span 
                                            className="inline-flex items-center justify-center rounded-lg px-3 py-1 text-sm font-bold text-black"
                                            style={{ backgroundColor: productColor }}
                                          >
                                            {variant.variant}
                                          </span>
                                          <span className="text-white/40 font-mono text-xs truncate">{variant.barcode}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/50">
                                          <span>B2B: ${parseFloat(variant.b2b_price).toFixed(2)}</span>
                                          <span>Retail: ${parseFloat(variant.retail_price).toFixed(2)}</span>
                                          <span className={cn(
                                            variant.current_stock <= 10 ? "text-red-400" : "text-white/50"
                                          )}>
                                            Stock: {variant.current_stock}
                                          </span>
                                        </div>
                                      </div>
                                      {/* Remove Button - positioned top right on mobile */}
                                      {orderItem && (
                                        <button
                                          onClick={() => removeOrderItem(orderItem.id)}
                                          className="p-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors shrink-0 sm:hidden"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-end gap-3 w-full sm:w-auto">
                                      {/* Quantity Input - Tap to open keypad */}
                                      <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                                        <label className="text-xs text-white/40">Qty</label>
                                        <button
                                          type="button"
                                          onClick={() => openQtyKeypad(variant, orderItem?.quantity || 0)}
                                          className={cn(
                                            "w-full sm:w-24 h-14 rounded-xl border text-center text-xl font-semibold transition-all",
                                            "bg-white/5 border-white/10 text-white",
                                            "hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
                                            orderItem?.quantity ? "ring-2 ring-emerald-500/50" : ""
                                          )}
                                        >
                                          {orderItem?.quantity || <span className="text-white/30">0</span>}
                                        </button>
                                      </div>

                                      {/* Price Input - Tap to open keypad */}
                                      <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                                        <label className="text-xs text-white/40">Price</label>
                                        <button
                                          type="button"
                                          onClick={() => openPriceKeypad(variant, orderItem?.unit_price ?? defaultPrice)}
                                          className={cn(
                                            "w-full sm:w-36 h-14 rounded-xl border text-xl font-semibold transition-all",
                                            "bg-white/5 border-white/10 text-white",
                                            "hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
                                            "flex items-center justify-center gap-1"
                                          )}
                                        >
                                          <DollarSign className="w-5 h-5 text-white/40" />
                                          {(orderItem?.unit_price ?? defaultPrice).toFixed(2)}
                                        </button>
                                      </div>

                                      {/* Remove Button - only show on desktop, mobile has it at top */}
                                      {orderItem && (
                                        <button
                                          onClick={() => removeOrderItem(orderItem.id)}
                                          className="hidden sm:block p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors shrink-0"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                      <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Items Section */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-white/50" />
                  Custom Items
                </h3>
                <p className="text-sm text-white/40 mb-6">Add items that aren't in inventory - they'll still be tracked in the order</p>

                {/* Custom Items List */}
                {customItems.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {customItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 rounded-xl bg-purple-500/10 border border-purple-500/30"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Item Name</label>
                            <Input
                              value={item.name}
                              onChange={(e) => updateCustomItem(item.id, 'name', e.target.value)}
                              placeholder="Item name..."
                              className="h-12 rounded-xl bg-white/5 border-white/10 text-white text-base"
                            />
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs text-white/40">Qty</label>
                              <button
                                type="button"
                                onClick={() => openCustomQtyKeypad(item)}
                                className="w-full h-14 rounded-xl bg-white/5 border border-white/10 text-white text-center text-xl font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all"
                              >
                                {item.quantity}
                              </button>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs text-white/40">Price</label>
                              <button
                                type="button"
                                onClick={() => openCustomPriceKeypad(item)}
                                className="w-full h-14 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                              >
                                <DollarSign className="w-5 h-5 text-white/40" />
                                {item.unit_price.toFixed(2)}
                              </button>
                            </div>
                            <div className="text-right min-w-[80px] sm:min-w-[100px] pb-2">
                              <span className="text-white font-bold text-lg sm:text-xl">
                                ${(item.quantity * item.unit_price).toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() => removeCustomItem(item.id)}
                              className="p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Custom Item Form */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-dashed border-white/20">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Item Name</label>
                      <Input
                        value={newCustomItem.name}
                        onChange={(e) => setNewCustomItem({ ...newCustomItem, name: e.target.value })}
                        placeholder="Enter custom item name..."
                        className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 text-base"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs text-white/40">Qty</label>
                        <button
                          type="button"
                          onClick={openNewCustomQtyKeypad}
                          className="w-full h-14 rounded-xl bg-white/5 border border-white/10 text-white text-center text-xl font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all"
                        >
                          {newCustomItem.quantity}
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs text-white/40">Price</label>
                        <button
                          type="button"
                          onClick={openNewCustomPriceKeypad}
                          className="w-full h-14 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                        >
                          <DollarSign className="w-5 h-5 text-white/40" />
                          {newCustomItem.unit_price > 0 ? newCustomItem.unit_price.toFixed(2) : <span className="text-white/30">0.00</span>}
                        </button>
                      </div>
                      <Button
                        onClick={addCustomItem}
                        disabled={!newCustomItem.name.trim()}
                        className="h-14 px-6 rounded-xl bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 shrink-0"
                      >
                        <Plus className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            {/* Order Items Summary */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl lg:sticky lg:top-6">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-white/50" />
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto mb-6">
                  {orderItems.length === 0 && customItems.length === 0 ? (
                    <p className="text-center text-white/40 py-6">No items added yet</p>
                  ) : (
                    <>
                      {orderItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-white/40">
                              {item.quantity} × ${item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">${item.total_price.toFixed(2)}</span>
                            <button
                              onClick={() => removeOrderItem(item.id)}
                              className="p-1.5 rounded hover:bg-red-500/10 text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {customItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">Custom</Badge>
                              <p className="text-white text-sm font-medium">{item.name}</p>
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                              {item.quantity} × ${item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">${(item.quantity * item.unit_price).toFixed(2)}</span>
                            <button
                              onClick={() => removeCustomItem(item.id)}
                              className="p-1.5 rounded hover:bg-red-500/10 text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white text-lg font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">Shipping</span>
                    <button
                      type="button"
                      onClick={openShippingKeypad}
                      className="w-36 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                    >
                      <DollarSign className="w-5 h-5 text-white/40" />
                      {shippingAmount > 0 ? shippingAmount.toFixed(2) : <span className="text-white/30">0.00</span>}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">Discount</span>
                    <button
                      type="button"
                      onClick={openDiscountKeypad}
                      className="w-36 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                    >
                      <DollarSign className="w-5 h-5 text-white/40" />
                      {discountAmount > 0 ? discountAmount.toFixed(2) : <span className="text-white/30">0.00</span>}
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-medium text-white text-lg">Total</span>
                    <span className="font-bold text-3xl text-white">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm text-white/50 mb-2">Order Notes</label>
                  <Textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Internal notes about this order..."
                    className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                  />
                </div>

                {/* Create Button - Desktop only */}
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSaving || !selectedCustomerId || (orderItems.length === 0 && customItems.length === 0)}
                  className="hidden lg:flex w-full mt-6 rounded-xl h-14 disabled:opacity-50 text-base font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white/50 text-xs">Order Total</p>
            <p className="text-white text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleSubmitOrder}
            disabled={isSaving || !selectedCustomerId || (orderItems.length === 0 && customItems.length === 0)}
            className="rounded-xl h-14 px-8 disabled:opacity-50 text-base font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Continue to Payment
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Numeric Keypad Modal */}
      <NumericKeypad
        isOpen={keypad.isOpen}
        onClose={handleKeypadClose}
        value={keypad.value}
        onChange={handleKeypadChange}
        allowDecimal={keypad.allowDecimal}
        label={keypad.label}
        prefix={keypad.prefix}
      />

      {/* Payment Options Modal */}
      <AdminPaymentOptionsModal
        isOpen={showPaymentForm && !!createdOrderId}
        onClose={() => {
          setShowPaymentForm(false)
          router.push('/admin/orders')
        }}
        orderId={createdOrderId || ''}
        orderNumber={undefined}
        amount={total}
        customerEmail={selectedCustomer?.email || guestOrderInfo.email || undefined}
        customerName={
          selectedCustomerId === 'guest'
            ? guestOrderInfo.name
            : selectedCustomer
              ? `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim()
              : undefined
        }
        customerPhone={selectedCustomer?.phone || guestOrderInfo.phone || undefined}
        items={[
          ...orderItems.map(item => ({
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
          ...customItems.map(item => ({
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        ]}
        onSuccess={(paymentMethod, details) => {
          console.log('Payment successful:', paymentMethod, details)
          // Update order with payment info
          fetch(`/api/admin/orders/${createdOrderId}/capture-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_method: paymentMethod,
              stripe_payment_intent_id: details?.paymentIntentId || null,
              invoice_id: details?.invoiceId || null,
              payment_link_url: details?.paymentLinkUrl || null,
            })
          }).then(() => {
            setTimeout(() => {
              router.push('/admin/orders')
            }, 1500)
          })
        }}
        onError={(message) => {
          console.error('Payment error:', message)
        }}
      />
    </div>
  )
}

