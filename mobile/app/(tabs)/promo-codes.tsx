import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
import { getPromoCodes, PromoCode, PromoStats } from '../../src/lib/api';

// Random code generator
const generateRandomCode = (length: number = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function PromoCodesScreen() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<PromoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPromoCodes();
      setPromoCodes(data.promoCodes);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to load promo codes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getPromoCodes();
      setPromoCodes(data.promoCodes);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Failed to refresh promo codes:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleGenerateCode = () => {
    const newCode = generateRandomCode(8);
    setGeneratedCode(newCode);
    setCopied(false);
  };

  const handleCopyCode = async () => {
    if (generatedCode) {
      await Clipboard.setStringAsync(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'expired': return styles.statusExpired;
      case 'disabled': return styles.statusDisabled;
      default: return {};
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ChroniclesColors.foreground} />
        <Text style={styles.loadingText}>Loading promo codes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={ChroniclesColors.mutedForeground} />
        <Text style={styles.errorText}>Failed to load promo codes</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPromoCodes}>
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
          <Text style={styles.statValue}>{stats?.active || 0}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatNumber(stats?.totalUses || 0)}</Text>
          <Text style={styles.statLabel}>USES</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{promoCodes.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Code Generator */}
      <View style={styles.generatorCard}>
        <View style={styles.generatorHeader}>
          <Ionicons name="sparkles" size={20} color={ChroniclesColors.foreground} />
          <Text style={styles.generatorTitle}>Generate Code</Text>
        </View>

        {/* Generated Code Display */}
        <TouchableOpacity 
          style={styles.codeDisplay}
          onPress={handleCopyCode}
          activeOpacity={0.7}
        >
          <Text style={styles.codeText}>
            {generatedCode || 'TAP GENERATE'}
          </Text>
          {generatedCode && (
            <Ionicons 
              name={copied ? "checkmark" : "copy-outline"} 
              size={20} 
              color={copied ? '#22C55E' : ChroniclesColors.mutedForeground} 
            />
          )}
        </TouchableOpacity>

        {/* Generate Button */}
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGenerateCode}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color={ChroniclesColors.background} />
          <Text style={styles.generateButtonText}>Generate New Code</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Codes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXISTING CODES</Text>
        
        {promoCodes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={32} color={ChroniclesColors.mutedForeground} />
            <Text style={styles.emptyText}>No promo codes yet</Text>
          </View>
        ) : (
          promoCodes.map((promo) => (
            <View key={promo.id} style={styles.promoCard}>
              <View style={styles.promoRow}>
                {/* Icon */}
                <View style={styles.promoIcon}>
                  <Ionicons name="pricetag-outline" size={20} color={ChroniclesColors.foreground} />
                </View>

                {/* Info */}
                <View style={styles.promoInfo}>
                  <View style={styles.promoHeader}>
                    <Text style={styles.promoCode}>{promo.code}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(promo.status)]}>
                      <Text style={styles.statusText}>{promo.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.promoDetails}>
                    <Text style={styles.promoDiscount}>
                      {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                    </Text>
                    <Text style={styles.promoDivider}>•</Text>
                    <Text style={styles.promoUsage}>
                      {promo.usageCount}{promo.maxUses ? `/${promo.maxUses}` : ''} uses
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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

  // Generator
  generatorCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    borderRadius: ChroniclesRadius['2xl'],
    padding: 20,
    marginBottom: 24,
  },
  generatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  generatorTitle: {
    ...ChroniclesTypography.h4,
    color: ChroniclesColors.foreground,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ChroniclesColors.background,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    borderRadius: ChroniclesRadius.xl,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '300',
    color: ChroniclesColors.foreground,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ChroniclesColors.foreground,
    borderRadius: ChroniclesRadius.xl,
    paddingVertical: 14,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: ChroniclesColors.background,
    letterSpacing: 0.5,
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

  // Promo Card
  promoCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 16,
    marginBottom: 10,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  promoIcon: {
    width: 44,
    height: 44,
    borderRadius: ChroniclesRadius.lg,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoInfo: {
    flex: 1,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  promoCode: {
    fontSize: 16,
    fontWeight: '500',
    color: ChroniclesColors.foreground,
    letterSpacing: 2,
  },
  promoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoDiscount: {
    fontSize: 13,
    color: ChroniclesColors.foreground,
    fontWeight: '400',
  },
  promoDivider: {
    color: ChroniclesColors.mutedForeground,
  },
  promoUsage: {
    fontSize: 13,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
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
  statusExpired: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusDisabled: {
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderColor: ChroniclesColors.borderLight,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
    color: ChroniclesColors.foreground,
  },
});
