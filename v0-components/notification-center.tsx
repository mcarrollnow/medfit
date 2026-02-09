"use client"

import { useState, useEffect } from "react"
import { Bell, X, CheckCheck, Package, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationCenterProps {
  className?: string
}

interface Notification {
  id: string
  type: "order" | "ticket"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  relatedId: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Order Shipped",
      message: "Your order #12345 has been shipped and is on its way!",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
      relatedId: "12345",
    },
    {
      id: "2",
      type: "ticket",
      title: "Support Response",
      message: "Your support ticket has been updated with a new response from our team.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      relatedId: "ticket-1",
    },
    {
      id: "3",
      type: "order",
      title: "Order Delivered",
      message: "Your order #12344 has been delivered successfully.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      relatedId: "12344",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const interval = setInterval(() => {
      // Mock polling - replace with actual API call
      // fetchNotifications()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    // Navigate to ticket or order
    if (notification.type === "ticket") {
      // Navigate to ticket detail
      console.log("Navigate to ticket:", notification.relatedId)
    } else if (notification.type === "order") {
      // Navigate to order detail
      console.log("Navigate to order:", notification.relatedId)
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Bell Button */}
      <div className={className}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="relative p-3 border rounded-xl hover:bg-accent transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-xl hover:bg-accent transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Container */}
          <div className="w-full max-w-3xl max-h-[85vh] bg-background rounded-xl border flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 text-sm font-bold bg-yellow-500 text-black rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm hover:bg-accent transition-colors rounded-xl"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Bell className="w-16 h-16 mb-4" />
                  <p className="text-xl">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full p-5 rounded-xl border cursor-pointer hover:bg-accent transition-colors flex items-start space-x-4 text-left"
                  >
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        notification.type === "order" ? "bg-green-500/20" : "bg-yellow-500/20"
                      }`}
                    >
                      {notification.type === "order" ? (
                        <Package className="w-5 h-5 text-green-500" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1">{notification.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mb-2">{notification.message}</div>
                      <div className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</div>
                    </div>

                    {/* Unread Dot */}
                    {!notification.isRead && <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
