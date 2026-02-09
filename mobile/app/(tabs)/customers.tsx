import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
import { getCustomers, Customer, CustomerStats } from '../../src/lib/api';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers({ limit: 100 });
      setCustomers(data.customers);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to load customers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getCustomers({ limit: 100 });
      setCustomers(data.customers);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to refresh customers:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'new': return styles.statusNew;
      case 'inactive': return styles.statusInactive;
      default: return {};
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ChroniclesColors.foreground} />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={ChroniclesColors.mutedForeground} />
        <Text style={styles.errorText}>Failed to load customers</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCustomers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={ChroniclesColors.foreground}
        />
      }
    >
      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatNumber(stats?.total || 0)}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatNumber(stats?.new || 0)}</Text>
          <Text style={styles.statLabel}>NEW</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatNumber(stats?.active || 0)}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={ChroniclesColors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          placeholderTextColor={ChroniclesColors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={ChroniclesColors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Customer List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `RESULTS (${filteredCustomers.length})` : 'ALL CUSTOMERS'}
        </Text>
        
        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={32} color={ChroniclesColors.mutedForeground} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </Text>
          </View>
        ) : (
          filteredCustomers.map((customer) => (
            <TouchableOpacity 
              key={customer.id} 
              style={styles.customerCard}
              activeOpacity={0.7}
            >
              <View style={styles.customerRow}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(customer.name)}</Text>
                </View>

                {/* Info */}
                <View style={styles.customerInfo}>
                  <View style={styles.customerHeader}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(customer.status)]}>
                      <Text style={styles.statusText}>{customer.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.customerEmail}>{customer.email}</Text>
                  
                  {/* Stats */}
                  <View style={styles.customerStats}>
                    <View style={styles.customerStat}>
                      <Text style={styles.customerStatValue}>{customer.orders}</Text>
                      <Text style={styles.customerStatLabel}>orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.customerStat}>
                      <Text style={styles.customerStatValue}>${customer.totalSpent.toLocaleString()}</Text>
                      <Text style={styles.customerStatLabel}>spent</Text>
                    </View>
                  </View>
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={20} color={ChroniclesColors.mutedForeground} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ChroniclesColors.background,
  },
  content: {
    padding: ChroniclesSpacing.sectionHorizontal,
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '300',
    color: ChroniclesColors.foreground,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...ChroniclesTypography.label,
    color: ChroniclesColors.mutedForeground,
    marginTop: 4,
    fontSize: 9,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    color: ChroniclesColors.foreground,
    fontSize: 16,
    fontWeight: '300',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 12,
  },

  // Empty State
  emptyState: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: ChroniclesColors.mutedForeground,
    marginTop: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Customer Card
  customerCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 16,
    marginBottom: 10,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: ChroniclesRadius.full,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '400',
    color: ChroniclesColors.foreground,
  },
  customerInfo: {
    flex: 1,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '400',
    color: ChroniclesColors.foreground,
  },
  customerEmail: {
    fontSize: 13,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ChroniclesRadius.sm,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusNew: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statusInactive: {
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderColor: ChroniclesColors.borderLight,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
    color: ChroniclesColors.foreground,
  },
  customerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  customerStatValue: {
    fontSize: 14,
    fontWeight: '400',
    color: ChroniclesColors.foreground,
    fontVariant: ['tabular-nums'],
  },
  customerStatLabel: {
    fontSize: 11,
    color: ChroniclesColors.mutedForeground,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: ChroniclesColors.borderLight,
  },
});
