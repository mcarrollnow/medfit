"use client"

import { useState, useEffect } from 'react';
import { Bell, X, MessageSquare, CheckCheck, Package, DollarSign, Wallet, Mail, AlertCircle, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  related_id?: string | null;
  action_url?: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  // Use relative URLs for development, absolute for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const mainAppUrl = isDevelopment ? '' : (process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ notification_id: notificationId })
      });

      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ mark_all_read: true })
      });

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark notifications as read');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on action URL
    if (notification.action_url) {
      if (notification.action_url.startsWith('http')) {
        window.location.href = notification.action_url;
      } else {
        window.location.href = `${mainAppUrl}${notification.action_url}`;
      }
    }

    setShowOverlay(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'order_confirmed':
      case 'order_paid':
        return <CheckCheck className="w-5 h-5" />;
      case 'order_shipped':
        return <Truck className="w-5 h-5" />;
      case 'order_delivered':
        return <Package className="w-5 h-5" />;
      case 'payment_received':
      case 'payment_confirmed':
        return <DollarSign className="w-5 h-5" />;
      case 'wallet_update':
        return <Wallet className="w-5 h-5" />;
      case 'email_update':
        return <Mail className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => setShowOverlay(true)}
        className={`relative text-white hover:text-primary transition p-2 ${className}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowOverlay(false)}>
          <div 
            className="bg-[#111111] border border-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setShowOverlay(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 hover:bg-gray-900/50 transition text-left ${
                        !notification.read ? 'bg-gray-900/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 ${!notification.read ? 'text-primary' : 'text-gray-400'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.created_at)}</p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-800">
                <a
                  href={`${mainAppUrl}/notifications`}
                  className="block text-center text-primary hover:text-primary/80 font-medium"
                >
                  View all notifications
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
