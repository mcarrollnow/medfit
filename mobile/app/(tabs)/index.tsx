import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
import { DrawerMenu, HamburgerButton } from '../../src/components/DrawerMenu';
import { getDashboardStats, DashboardStats } from '../../src/lib/api';

const quickActions = [
  {
    id: 'invoice',
    title: 'Send Invoice',
    description: 'Quick invoice to customer',
    icon: 'document-text-outline' as const,
    route: '/send-invoice',
  },
  {
    id: 'order',
    title: 'Create Order',
    description: 'New customer order',
    icon: 'cart-outline' as const,
    route: '/create-order',
  },
  {
    id: 'scan',
    title: 'Scan QR',
    description: 'Inventory management',
    icon: 'qr-code-outline' as const,
    route: '/scanner',
  },
  {
    id: 'orders',
    title: 'View Orders',
    description: 'Order management',
    icon: 'list-outline' as const,
    route: '/orders',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <>
      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header with Hamburger */}
        <View style={styles.headerRow}>
          <HamburgerButton onPress={() => setDrawerVisible(true)} />
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DASHBOARD</Text>
          <Text style={styles.title}>Modern Health</Text>
          <Text style={styles.titleItalic}>Pro</Text>
        </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>QUICK ACTIONS</Text>
        
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id}
              style={styles.card}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name={action.icon} size={28} color={ChroniclesColors.foreground} />
              </View>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardDesc}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>TODAY'S OVERVIEW</Text>
          <TouchableOpacity onPress={loadStats} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={16} color={ChroniclesColors.mutedForeground} />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={ChroniclesColors.foreground} />
          </View>
        ) : error ? (
          <TouchableOpacity style={styles.errorContainer} onPress={loadStats}>
            <Text style={styles.errorText}>Failed to load stats</Text>
            <Text style={styles.errorHint}>Tap to retry</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.ordersToday ?? 0}</Text>
              <Text style={styles.statLabel}>ORDERS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(stats?.revenueToday ?? 0)}</Text>
              <Text style={styles.statLabel}>REVENUE</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.pendingOrders ?? 0}</Text>
              <Text style={styles.statLabel}>PENDING</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
    </>
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
  
  // Header Row with Hamburger
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 50,
    marginBottom: 8,
  },
  
  // Header
  header: {
    marginBottom: ChroniclesSpacing.headerMarginBottom,
    marginTop: 8,
  },
  eyebrow: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 8,
  },
  title: {
    ...ChroniclesTypography.h1,
    color: ChroniclesColors.foreground,
  },
  titleItalic: {
    ...ChroniclesTypography.h1,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
    marginTop: -4,
  },
  
  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEyebrow: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 16,
  },
  refreshButton: {
    padding: 8,
    marginBottom: 16,
  },
  
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  // Card - Glass morphism style
  card: {
    width: '48%',
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius['2xl'],
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  cardIconContainer: {
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    borderRadius: ChroniclesRadius.xl,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    ...ChroniclesTypography.h4,
    color: ChroniclesColors.foreground,
    marginTop: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
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
    fontSize: 24,
    fontWeight: '300',
    color: ChroniclesColors.foreground,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...ChroniclesTypography.label,
    color: ChroniclesColors.mutedForeground,
    marginTop: 4,
    fontSize: 10,
  },
  
  // Loading/Error states
  loadingContainer: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 32,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: ChroniclesColors.foreground,
    fontSize: 14,
    marginBottom: 4,
  },
  errorHint: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
