import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../src/theme/chronicles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    // Simulate login - will connect to Supabase auth
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Text style={styles.eyebrow}>WELCOME</Text>
          <Text style={styles.heroTitle}>Modern Health</Text>
          <Text style={styles.heroTitleItalic}>Pro</Text>
          <Text style={styles.subtitle}>Premium research compounds for scientific discovery</Text>
        </View>

        {/* Glass Card */}
        <View style={styles.glassCard}>
          {/* Mode Toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputGroup}>
                <Ionicons name="mail-outline" size={18} color={ChroniclesColors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={ChroniclesColors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed-outline" size={18} color={ChroniclesColors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={ChroniclesColors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={18} 
                    color={ChroniclesColors.mutedForeground} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotButtonText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color={ChroniclesColors.background} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 MODERN HEALTH PRO</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ChroniclesColors.background,
  },
  content: {
    flex: 1,
    padding: ChroniclesSpacing.sectionHorizontal,
    justifyContent: 'center',
  },
  
  // Hero
  heroContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  eyebrow: {
    ...ChroniclesTypography.eyebrow,
    color: ChroniclesColors.mutedForeground,
    marginBottom: 12,
  },
  heroTitle: {
    ...ChroniclesTypography.hero,
    color: ChroniclesColors.foreground,
    textAlign: 'center',
  },
  heroTitleItalic: {
    ...ChroniclesTypography.hero,
    color: ChroniclesColors.mutedForeground,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -8,
  },
  subtitle: {
    ...ChroniclesTypography.body,
    color: ChroniclesColors.mutedForeground,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 280,
  },
  
  // Glass Card
  glassCard: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius['3xl'],
    padding: ChroniclesSpacing.cardPadding,
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: ChroniclesRadius.lg,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: ChroniclesRadius.md,
  },
  tabActive: {
    backgroundColor: ChroniclesColors.foreground,
  },
  tabText: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 14,
    fontWeight: '300',
  },
  tabTextActive: {
    color: ChroniclesColors.background,
    fontSize: 14,
    fontWeight: '400',
  },
  
  // Form
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    ...ChroniclesTypography.label,
    color: ChroniclesColors.mutedForeground,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ChroniclesColors.glassButtonBg,
    borderRadius: ChroniclesRadius.xl,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderMedium,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: ChroniclesColors.foreground,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
  },
  
  // Buttons
  forgotButton: {
    alignItems: 'flex-end',
  },
  forgotButtonText: {
    color: ChroniclesColors.mutedForeground,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: ChroniclesColors.foreground,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: ChroniclesRadius.xl,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '300',
    color: ChroniclesColors.background,
    letterSpacing: 0.5,
  },
  
  // Footer
  footer: {
    ...ChroniclesTypography.eyebrow,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 10,
  },
});
