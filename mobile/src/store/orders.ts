import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';

interface OrdersState {
  orders: Order[];
  newOrdersCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<void>;
  subscribeToOrders: () => () => void;
  markOrderViewed: (orderId: string) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  newOrdersCount: 0,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    if (!isSupabaseConfigured) {
      set({ error: 'Supabase not configured', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      // Count new orders (created in last 24 hours and status is 'new')
      const newCount = data?.filter(
        (order) => 
          order.status === 'new' && 
          new Date(order.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;

      set({ 
        orders: data || [], 
        newOrdersCount: newCount,
        isLoading: false 
      });
    } catch (e) {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },

  subscribeToOrders: () => {
    if (!isSupabaseConfigured) {
      return () => {}; // Return empty cleanup function
    }

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new as Order;
          set((state) => ({
            orders: [newOrder, ...state.orders],
            newOrdersCount: state.newOrdersCount + 1,
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          set((state) => ({
            orders: state.orders.map((o) => 
              o.id === updatedOrder.id ? updatedOrder : o
            ),
          }));
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },

  markOrderViewed: (orderId: string) => {
    set((state) => ({
      newOrdersCount: Math.max(0, state.newOrdersCount - 1),
    }));
  },
}));
