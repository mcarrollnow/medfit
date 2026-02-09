"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Trash2, Upload, Tag, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  items: OrderItem[]
  shippingAddress: {
    line1: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
  carrier?: string
  shippingCost: number
  discountCode?: string
  discountAmount: number
  notes?: string
  originalTotal: number
}

interface OrderEditModalProps {
  order: Order
  onClose: () => void
  onSave: (updatedOrder: Order) => void
}

export function OrderEditModal({ order, onClose, onSave }: OrderEditModalProps) {
  const [editedOrder, setEditedOrder] = useState<Order>(order)
  const [discountType, setDiscountType] = useState<"code" | "manual">(order.discountCode ? "code" : "manual")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Calculate subtotal
  const subtotal = editedOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  // Calculate new total
  const newTotal = subtotal + editedOrder.shippingCost - editedOrder.discountAmount

  // Calculate difference from original
  const totalDifference = newTotal - order.originalTotal

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productName: "",
      quantity: 1,
      unitPrice: 0,
    }
    setEditedOrder({
      ...editedOrder,
      items: [...editedOrder.items, newItem],
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setEditedOrder({
      ...editedOrder,
      items: editedOrder.items.filter((item) => item.id !== itemId),
    })
  }

  const handleItemChange = (itemId: string, field: keyof OrderItem, value: string | number) => {
    setEditedOrder({
      ...editedOrder,
      items: editedOrder.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    })
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
        // Simulate AI scanning
        setIsScanning(true)
        setTimeout(() => {
          setIsScanning(false)
          // Mock extracted data
          setEditedOrder({
            ...editedOrder,
            trackingNumber: "1Z999AA10123456784",
            carrier: "UPS",
            shippingCost: 12.99,
          })
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(editedOrder)
  }

  return (
    <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />

      {/* Modal Container */}
      <Card className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-xl border-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Order #{order.id}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* ORDER ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <Button
                onClick={handleAddItem}
                size="sm"
                className="px-3 py-1 text-sm bg-accent-yellow hover:bg-accent-yellow/90 text-black"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {editedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <Input
                      value={item.productName}
                      onChange={(e) => handleItemChange(item.id, "productName", e.target.value)}
                      placeholder="Product name"
                      className="w-full px-3 py-2 text-sm mb-2"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Quantity</label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Unit Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Total</label>
                        <Input
                          value={`$${(item.quantity * item.unitPrice).toFixed(2)}`}
                          readOnly
                          className="w-full bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
            <div className="space-y-3">
              <Input
                value={editedOrder.shippingAddress.line1}
                onChange={(e) =>
                  setEditedOrder({
                    ...editedOrder,
                    shippingAddress: {
                      ...editedOrder.shippingAddress,
                      line1: e.target.value,
                    },
                  })
                }
                placeholder="Address line 1"
                className="w-full px-4 py-3 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={editedOrder.shippingAddress.city}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      shippingAddress: {
                        ...editedOrder.shippingAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="City"
                />
                <Input
                  value={editedOrder.shippingAddress.state}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      shippingAddress: {
                        ...editedOrder.shippingAddress,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={editedOrder.shippingAddress.zip}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      shippingAddress: {
                        ...editedOrder.shippingAddress,
                        zip: e.target.value,
                      },
                    })
                  }
                  placeholder="ZIP"
                />
                <Input
                  value={editedOrder.shippingAddress.country}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      shippingAddress: {
                        ...editedOrder.shippingAddress,
                        country: e.target.value,
                      },
                    })
                  }
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* TRACKING INFO */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tracking Info</h3>
            <div className="space-y-3">
              {/* Receipt Upload */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {!receiptPreview ? (
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                    <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload receipt to auto-fill tracking info</p>
                  </label>
                ) : (
                  <div>
                    <img
                      src={receiptPreview || "/placeholder.svg"}
                      alt="Receipt"
                      className="max-h-40 mx-auto rounded mb-2"
                    />
                    {isScanning && <p className="text-sm text-accent-yellow animate-pulse">Scanning receipt...</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={editedOrder.trackingNumber || ""}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      trackingNumber: e.target.value,
                    })
                  }
                  placeholder="Tracking number"
                />
                <Select
                  value={editedOrder.carrier || ""}
                  onValueChange={(value) => setEditedOrder({ ...editedOrder, carrier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="USPS">USPS</SelectItem>
                    <SelectItem value="DHL">DHL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Shipping Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editedOrder.shippingCost}
                  onChange={(e) =>
                    setEditedOrder({
                      ...editedOrder,
                      shippingCost: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* DISCOUNT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Discount</h3>
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                onClick={() => setDiscountType("code")}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  discountType === "code" ? "bg-accent-yellow text-black" : "bg-muted"
                }`}
              >
                Discount Code
              </Button>
              <Button
                onClick={() => setDiscountType("manual")}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  discountType === "manual" ? "bg-accent-yellow text-black" : "bg-muted"
                }`}
              >
                Manual Discount
              </Button>
            </div>

            {discountType === "code" ? (
              <Select
                value={editedOrder.discountCode || ""}
                onValueChange={(value) => {
                  // Mock discount codes
                  const discounts: Record<string, number> = {
                    SAVE10: 10,
                    SAVE20: 20,
                    FREESHIP: 15,
                  }
                  setEditedOrder({
                    ...editedOrder,
                    discountCode: value,
                    discountAmount: discounts[value] || 0,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAVE10">SAVE10 ($10 off)</SelectItem>
                  <SelectItem value="SAVE20">SAVE20 ($20 off)</SelectItem>
                  <SelectItem value="FREESHIP">FREESHIP ($15 off)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="number"
                step="0.01"
                value={editedOrder.discountAmount}
                onChange={(e) =>
                  setEditedOrder({
                    ...editedOrder,
                    discountAmount: Number.parseFloat(e.target.value) || 0,
                    discountCode: undefined,
                  })
                }
                placeholder="Enter discount amount"
              />
            )}

            {editedOrder.discountAmount > 0 && (
              <p className="text-sm text-accent-green mt-2">
                Discount applied: ${editedOrder.discountAmount.toFixed(2)}
              </p>
            )}
          </div>

          {/* NOTES */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <Textarea
              value={editedOrder.notes || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
              rows={3}
              placeholder="Add notes about this order..."
              className="w-full px-4 py-3 rounded-lg"
            />
          </div>

          {/* TOTALS SUMMARY */}
          <Card className="p-4 rounded-lg border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping:</span>
              <span>${editedOrder.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount:</span>
              <span className="text-red-500">-${editedOrder.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>New Total:</span>
              <span>${newTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Original Total:</span>
              <span>${order.originalTotal.toFixed(2)}</span>
            </div>
            {totalDifference !== 0 && (
              <div
                className={`flex justify-between text-sm font-medium ${
                  totalDifference > 0 ? "text-red-500" : "text-accent-green"
                }`}
              >
                <span>{totalDifference > 0 ? "Increase:" : "Savings:"}</span>
                <span>
                  {totalDifference > 0 ? "+" : ""}${totalDifference.toFixed(2)}
                </span>
              </div>
            )}
          </Card>

          {/* ACTION BUTTONS */}
          <div className="flex space-x-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 px-6 py-3 rounded-lg bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 px-6 py-3 rounded-lg bg-accent-green hover:bg-accent-green/90 text-black"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
