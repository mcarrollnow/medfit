'use client'
import { useState, useEffect, useCallback } from 'react';
import { Bell, X, MessageSquare, CheckCheck, Package, DollarSign, Wallet, Mail, AlertCircle, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { toast } from 'sonner';

interface Notification {
  id: string;
  user_id: string;
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
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  // Fetch notifications from database
  const fetchNotifications = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[NotificationCenter] Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (error) {
      console.error('[NotificationCenter] Failed to fetch notifications:', error);
    }
  }, [supabase]);

  // Setup realtime subscription
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtimeSubscription = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('[NotificationCenter] No user session, skipping realtime setup');
        return;
      }

      const uid = session.user.id;
      setUserId(uid);

      // Fetch initial notifications
      await fetchNotifications(uid);

      // Subscribe to realtime changes for this user's notifications
      channel = supabase
        .channel(`notifications:${uid}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            console.log('[NotificationCenter] New notification received:', payload.new);
            const newNotification = payload.new as Notification;
            
            // Add to front of list
            setNotifications(prev => [newNotification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notification
            toast(newNotification.title, {
              description: newNotification.message,
              duration: 5000,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            console.log('[NotificationCenter] Notification updated:', payload.new);
            const updatedNotification = payload.new as Notification;
            
            setNotifications(prev =>
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
            
            // Recalculate unread count
            setNotifications(prev => {
              setUnreadCount(prev.filter(n => !n.read).length);
              return prev;
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            console.log('[NotificationCenter] Notification deleted:', payload.old);
            const deletedId = (payload.old as { id: string }).id;
            
            setNotifications(prev => {
              const updated = prev.filter(n => n.id !== deletedId);
              setUnreadCount(updated.filter(n => !n.read).length);
              return updated;
            });
          }
        )
        .subscribe((status) => {
          console.log('[NotificationCenter] Realtime subscription status:', status);
        });
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        console.log('[NotificationCenter] Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('[NotificationCenter] Error marking as read:', error);
        return;
      }

      // Update local state (realtime will also update but this is faster)
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('[NotificationCenter] Error marking all as read:', error);
        toast.error('Failed to mark notifications as read');
        return;
      }

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
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    setShowOverlay(false);

    // Navigate based on action_url or notification type
    if (notification.action_url) {
      router.push(notification.action_url);
    } else {
      // Fallback navigation based on type
      switch (notification.type) {
        case 'support_response':
        case 'support_ticket':
          if (notification.related_id) {
            router.push('/support');
            setTimeout(() => {
              sessionStorage.setItem('openTicketId', notification.related_id!);
              window.dispatchEvent(new Event('storage'));
            }, 100);
          }
          break;
        case 'order_shipped':
        case 'order_delivered':
        case 'order_cancelled':
        case 'payment_confirmed':
          router.push('/dashboard');
          break;
        case 'wallet_transaction':
          router.push('/wallet');
          break;
        case 'rep_message':
          router.push('/messages');
          break;
        default:
          router.push('/dashboard');
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_shipped':
        return Truck;
      case 'order_delivered':
      case 'order_update':
        return Package;
      case 'order_cancelled':
        return AlertCircle;
      case 'payment_confirmed':
        return DollarSign;
      case 'wallet_transaction':
        return Wallet;
      case 'rep_message':
        return Mail;
      case 'support_response':
      case 'support_ticket':
      default:
        return MessageSquare;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'order_shipped':
      case 'order_delivered':
      case 'order_cancelled':
      case 'payment_confirmed':
        return 'View orders';
      case 'wallet_transaction':
        return 'View wallet';
      case 'rep_message':
        return 'View messages';
      case 'support_response':
      case 'support_ticket':
      default:
        return 'View ticket';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowOverlay(true);
        }}
        className={`p-3 bg-transparent border border-theme-text hover:bg-theme-card-hover rounded-xl transition relative ${className}`}
      >
        <Bell className="w-5 h-5 text-theme-text" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Overlay */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-[9999] menu-overlay-bg flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOverlay(false);
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowOverlay(false)}
            className="absolute top-6 right-6 p-3 bg-theme-card-hover hover:bg-theme-card rounded-xl transition"
          >
            <X className="w-6 h-6 text-theme-text" />
          </button>

          {/* Notifications Container */}
          <div className="w-full max-w-3xl max-h-[85vh] bg-theme-bg-secondary rounded-xl border border-theme-border overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-theme-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-theme-text">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-theme-card hover:bg-theme-card-hover rounded-lg transition text-theme-text text-sm font-medium disabled:opacity-50"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="w-16 h-16 text-theme-text-muted mb-4" />
                  <h3 className="text-xl font-semibold text-theme-text mb-2">No notifications</h3>
                  <p className="text-theme-text-secondary">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-5 rounded-xl border cursor-pointer transition ${
                        notification.read
                          ? 'bg-theme-card border-theme-border hover:border-theme-text'
                          : 'bg-theme-card border-primary hover:border-primary'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          notification.read ? 'bg-theme-card-hover' : 'bg-primary bg-opacity-20'
                        }`}>
                          {(() => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                              <Icon className={`w-5 h-5 ${
                                notification.read ? 'text-theme-text-secondary' : 'text-primary'
                              }`} />
                            );
                          })()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-semibold ${
                              notification.read ? 'text-theme-text' : 'text-theme-text'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-theme-text-secondary text-sm mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-theme-text-muted">
                              {formatDate(notification.created_at)}
                            </span>
                            <span className="text-xs text-primary font-medium">
                              {getActionText(notification.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
