"use client"

import { useState } from "react"
import { OrderCard } from "@/components/dashboard/order-card"

// Mock Data
const MOCK_ORDERS = [
  {
    id: "ORD-2024-8832",
    date: "Nov 18, 2024",
    status: "In Transit",
    total: "$425.00",
    items: [
      { name: "BPC-157 (5mg)", quantity: 2, price: "$45.00" },
      { name: "TB-500 (5mg)", quantity: 2, price: "$55.00" },
      { name: "GHK-Cu (50mg)", quantity: 1, price: "$65.00" },
    ],
    tracking: {
      carrier: "FedEx Priority",
      number: "782201923381",
      estimated_delivery: "Nov 20, 2024",
    },
    payment: {
      method: "Bitcoin (BTC)",
      hash: "8x92...3k21",
      amount: "0.0065 BTC",
      status: "Confirmed",
    },
    timeline: [
      { status: "Order Placed", date: "Nov 18, 10:23 AM", completed: true },
      { status: "Payment Confirmed", date: "Nov 18, 10:45 AM", completed: true },
      { status: "Preparing to ship", date: "Nov 18, 02:00 PM", completed: true },
      { status: "Shipped", date: "Nov 19, 09:30 AM", completed: true },
      { status: "Out for Delivery", date: null, completed: false },
      { status: "Delivered", date: null, completed: false },
    ],
    points_earned: 425,
  },
  {
    id: "ORD-2024-8711",
    date: "Nov 10, 2024",
    status: "Delivered",
    total: "$1,250.00",
    items: [
      { name: "Semaglutide (5mg)", quantity: 5, price: "$110.00" },
      { name: "Tirzepatide (10mg)", quantity: 3, price: "$180.00" },
    ],
    tracking: {
      carrier: "UPS Express",
      number: "1Z9928320192",
      estimated_delivery: "Nov 12, 2024",
    },
    payment: {
      method: "USDC (ERC20)",
      hash: "0x71...9a2b",
      amount: "1250.00 USDC",
      status: "Confirmed",
    },
    timeline: [
      { status: "Order Placed", date: "Nov 10, 08:15 AM", completed: true },
      { status: "Payment Confirmed", date: "Nov 10, 08:20 AM", completed: true },
      { status: "Preparing to ship", date: "Nov 10, 11:00 AM", completed: true },
      { status: "Shipped", date: "Nov 10, 04:30 PM", completed: true },
      { status: "Out for Delivery", date: "Nov 12, 08:45 AM", completed: true },
      { status: "Delivered", date: "Nov 12, 02:15 PM", completed: true },
    ],
    points_earned: 1250,
  },
]

export function OrderList() {
  return (
    <div className="grid gap-6">
      {MOCK_ORDERS.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
