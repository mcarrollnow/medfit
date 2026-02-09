import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
import { getOrders, Order } from '../../src/lib/api';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders({ limit: 50, days: 30 });
      setOrders(data.orders);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getOrders({ limit: 50, days: 30 });
      setOrders(data.orders);
    } catch (err: any) {
      console.error('Failed to refresh orders:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Monochromatic status indicators
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'delivered':
      case 'paid':
        return { backgroundColor: 'rgba(34, 197, 94, 0.2)', textColor: '#22C55E' };
      case 'shipped':
      case 'processing': 
        return { backgroundColor: 'rgba(59, 130, 246, 0.2)', textColor: '#3B82F6' };
      case 'pending': 
        return { backgroundColor: 'rgba(234, 179, 8, 0.2)', textColor: '#EAB308' };
      case 'cancelled':
      case 'failed':
        return { backgroundColor: 'rgba(239, 68, 68, 0.2)', textColor: '#EF4444' };
      default: 
        return { backgroundColor: ChroniclesColors.glassButtonBg, textColor: ChroniclesColors.mutedForeground };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ChroniclesColors.foreground} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={ChroniclesColors.mutedForeground} />
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ChroniclesColors.foreground}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>RECENT ORDERS</Text>
            <Text style={styles.count}>{orders.length} orders</Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.payment_status || item.status);
          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/orders/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{item.order_number}</Text>
                  <Text style={styles.customerName}>{item.customer_name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
                    {(item.payment_status || item.status).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                <Text style={styles.total}>${item.total?.toFixed(2)}</Text>
              </View>
              {item.tracking_number && (
                <View style={styles.trackingRow}>
                  <Ionicons name="cube-outline" size={14} color={ChroniclesColors.mutedForeground} />
                  <Text style={styles.trackingText}>{item.shipping_carrier}: {item.tracking_number}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={40} color={ChroniclesColors.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Orders will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ChroniclesColors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: ChroniclesSpacing.sectionHorizontal,
  },
  
  // Loading/Error states
  loadingText: {
    color: ChroniclesColors.mutedForeground,
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: ChroniclesColors.foreground,
    marginTop: 12,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: ChroniclesColors.foreground,
    fontSize: 14,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  eyebrow: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
  },
  count: {
    fontSize: 13,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
  },
  
  // Order Card
  orderCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderRadius: ChroniclesRadius.xl,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    color: ChroniclesColors.foreground,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  customerName: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 14,
    fontWeight: '300',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ChroniclesRadius.full,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 13,
  },
  total: {
    color: ChroniclesColors.foreground,
    fontSize: 20,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ChroniclesColors.borderLight,
    gap: 6,
  },
  trackingText: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 12,
  },
  
  // Empty State
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    borderRadius: ChroniclesRadius.xl,
    padding: 20,
    marginBottom: 16,
  },
  emptyTitle: {
    ...ChroniclesTypography.h3,
    color: ChroniclesColors.foreground,
    marginBottom: 8,
  },
  emptyText: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
