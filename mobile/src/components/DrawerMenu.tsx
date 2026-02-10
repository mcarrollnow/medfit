import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../theme/chronicles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Manage products & stock',
    icon: 'cube-outline',
    route: '/inventory',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Customer management',
    icon: 'people-outline',
    route: '/customers',
  },
  {
    id: 'promo-codes',
    title: 'Promo Codes',
    description: 'Generate & manage codes',
    icon: 'pricetag-outline',
    route: '/promo-codes',
  },
  {
    id: 'voice-prompt',
    title: 'Voice Prompt',
    description: 'AI voice assistant',
    icon: 'mic-outline',
    route: '/',
  },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 200);
  };

  const isActive = (route: string) => {
    if (route === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View 
        style={[styles.backdrop, { opacity: fadeAnim }]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="sparkles" size={24} color={ChroniclesColors.foreground} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>Navigation</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color={ChroniclesColors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, active && styles.menuItemActive]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                {active && <View style={styles.activeIndicator} />}
                <View style={[styles.menuIconContainer, active && styles.menuIconContainerActive]}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={ChroniclesColors.foreground} 
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, active && styles.menuTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={active ? ChroniclesColors.foreground : ChroniclesColors.mutedForeground} 
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>Medfit 90</Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

// Hamburger button component to trigger the drawer
export function HamburgerButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={styles.hamburgerButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="menu" size={22} color={ChroniclesColors.foreground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: ChroniclesColors.background,
    borderRightWidth: 1,
    borderRightColor: ChroniclesColors.borderLight,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ChroniclesSpacing.sectionHorizontal,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: ChroniclesColors.borderLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: ChroniclesRadius.xl,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...ChroniclesTypography.h4,
    color: ChroniclesColors.foreground,
  },
  headerSubtitle: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: ChroniclesRadius.md,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Menu
  menuContainer: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: ChroniclesRadius.xl,
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: ChroniclesColors.borderMedium,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -16,
    width: 3,
    height: 32,
    backgroundColor: ChroniclesColors.foreground,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: ChroniclesRadius.lg,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconContainerActive: {
    borderColor: ChroniclesColors.borderMedium,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: ChroniclesColors.mutedForeground,
  },
  menuTitleActive: {
    color: ChroniclesColors.foreground,
  },
  menuDescription: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
    marginTop: 2,
    fontStyle: 'italic',
  },
  
  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ChroniclesColors.borderLight,
  },
  footerCard: {
    padding: 16,
    borderRadius: ChroniclesRadius.xl,
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
  },
  
  // Hamburger Button
  hamburgerButton: {
    width: 44,
    height: 44,
    borderRadius: ChroniclesRadius.xl,
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
