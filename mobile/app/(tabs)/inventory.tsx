import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
import { getProducts, Product, ProductStats } from '../../src/lib/api';

export default function InventoryScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data.products);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getProducts();
      setProducts(data.products);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to refresh products:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getStockColor = (stock: number) => {
    if (stock > 10) return '#22C55E';
    if (stock > 0) return '#EAB308';
    return '#EF4444';
  };

  const getStockLabel = (stock: number) => {
    if (stock > 10) return 'In Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ChroniclesColors.foreground} />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={ChroniclesColors.mutedForeground} />
        <Text style={styles.errorText}>Failed to load inventory</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
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
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="cube-outline" size={48} color={ChroniclesColors.foreground} />
        </View>
        
        <Text style={styles.eyebrow}>STOCK MANAGEMENT</Text>
        <Text style={styles.title}>Inventory</Text>
        
        {/* Scan Button */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/scanner')}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={20} color={ChroniclesColors.background} />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
          <Ionicons name="arrow-forward" size={18} color={ChroniclesColors.background} />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.total || 0}</Text>
          <Text style={styles.statLabel}>TOTAL ITEMS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#EAB308' }]}>{stats?.lowStock || 0}</Text>
          <Text style={styles.statLabel}>LOW STOCK</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats?.outOfStock || 0}</Text>
          <Text style={styles.statLabel}>OUT OF STOCK</Text>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ALL PRODUCTS</Text>
        
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={32} color={ChroniclesColors.mutedForeground} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          products.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              activeOpacity={0.7}
            >
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productSku}>SKU: {product.sku}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>B2B:</Text>
                    <Text style={styles.priceValue}>${product.b2b_price?.toFixed(2)}</Text>
                    <Text style={styles.priceLabel}>Retail:</Text>
                    <Text style={styles.priceValue}>${product.retail_price?.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.stockContainer}>
                  <Text style={[styles.stockValue, { color: getStockColor(product.stock) }]}>
                    {product.stock}
                  </Text>
                  <Text style={[styles.stockLabel, { color: getStockColor(product.stock) }]}>
                    {getStockLabel(product.stock)}
                  </Text>
                </View>
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
    flex: 1,
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
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius['2xl'],
    padding: 28,
    marginBottom: 24,
  },
  eyebrow: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 8,
  },
  title: {
    ...ChroniclesTypography.h1,
    color: ChroniclesColors.foreground,
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ChroniclesColors.foreground,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: ChroniclesRadius.xl,
    gap: 10,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '300',
    color: ChroniclesColors.background,
    letterSpacing: 0.5,
  },
  
  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: ChroniclesColors.borderLight,
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
  
  // Product Card
  productCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 16,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: ChroniclesColors.foreground,
    marginBottom: 4,
  },
  productSku: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '400',
    color: ChroniclesColors.foreground,
    fontVariant: ['tabular-nums'],
    marginRight: 8,
  },
  stockContainer: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: ChroniclesColors.borderLight,
  },
  stockValue: {
    fontSize: 24,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  stockLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
