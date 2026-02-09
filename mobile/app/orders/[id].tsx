import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data - will connect to Supabase
  const order = {
    id,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '(555) 123-4567',
    total: 299.99,
    status: 'pending',
    items: [
      { name: 'Product A', qty: 2, price: 99.99 },
      { name: 'Product B', qty: 1, price: 100.01 },
    ],
    created_at: new Date().toISOString(),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.rowText}>{order.customer_name}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.rowText}>{order.customer_email}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.rowText}>{order.customer_phone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((item, idx) => (
            <View key={idx} style={[styles.itemRow, idx > 0 && styles.itemRowBorder]}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Ionicons name="document-text" size={20} color="#000" />
          <Text style={styles.primaryButtonText}>Send Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
          <Text style={styles.actionButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowText: {
    color: '#fff',
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  itemQty: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 4,
  },
  itemPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#4ade80',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButton: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
