import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingRowProps {
  icon: IoniconsName;
  label: string;
  value?: string;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, onPress }: SettingRowProps) {
  return (
    <TouchableOpacity 
      style={styles.row} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowIconContainer}>
        <Ionicons name={icon} size={18} color={ChroniclesColors.foreground} />
      </View>
      <Text style={styles.rowText}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={ChroniclesColors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="person-outline" label="Profile" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow icon="notifications-outline" label="Notifications" onPress={() => {}} />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="moon-outline" label="Dark Mode" value="On" />
          <View style={styles.rowDivider} />
          <SettingRow icon="globe-outline" label="Language" value="English" />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="information-circle-outline" label="Version" value="1.0.0" />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={18} color={ChroniclesColors.mutedForeground} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.appName}>Medfit 90</Text>
        <Text style={styles.copyright}>© 2025 MEDFIT 90</Text>
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
  
  // Section
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderRadius: ChroniclesRadius.xl,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    overflow: 'hidden',
  },
  
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowIconContainer: {
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderRadius: ChroniclesRadius.md,
    padding: 8,
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    color: ChroniclesColors.foreground,
    fontSize: 16,
    fontWeight: '300',
  },
  rowValue: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 15,
    fontStyle: 'italic',
  },
  rowDivider: {
    height: 1,
    backgroundColor: ChroniclesColors.borderLight,
    marginLeft: 56,
  },
  
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ChroniclesColors.glassBackground,
    borderRadius: ChroniclesRadius.xl,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  logoutText: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 15,
    fontWeight: '400',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 48,
  },
  appName: {
    ...ChroniclesTypography.h4,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
  },
  copyright: {
    ...ChroniclesTypography.eyebrow,
    color: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
    fontSize: 9,
  },
});
