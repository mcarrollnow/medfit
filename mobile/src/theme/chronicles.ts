/**
 * Chronicles Collection Theme for React Native
 * 
 * A monochromatic black/white luxury aesthetic with glass morphism effects.
 * Based on the Chronicles style guide - no colored backgrounds or text,
 * only white with varying opacity for accents.
 */

export const ChroniclesColors = {
  // Core colors
  background: '#050505',      // Near black - oklch(0.02 0 0)
  foreground: '#FAFAFA',      // Off-white - oklch(0.985 0 0)
  
  // Card/Surface colors
  card: '#141414',            // Slightly lighter black
  cardForeground: '#FAFAFA',
  
  // Muted/Secondary
  muted: '#1F1F1F',
  mutedForeground: '#999999', // Grey for secondary text - oklch(0.6 0 0)
  
  // Borders
  border: '#262626',          // Subtle border
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderMedium: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  
  // Glass morphism
  glassBackground: 'rgba(255, 255, 255, 0.03)',
  glassBackgroundHover: 'rgba(255, 255, 255, 0.05)',
  glassButtonBg: 'rgba(255, 255, 255, 0.05)',
  glassButtonBgHover: 'rgba(255, 255, 255, 0.1)',
  
  // Chart colors (monochromatic white palette)
  chart1: 'rgba(255, 255, 255, 0.8)',
  chart2: 'rgba(255, 255, 255, 0.5)',
  chart3: 'rgba(255, 255, 255, 0.3)',
  chart4: 'rgba(255, 255, 255, 0.15)',
  chart5: 'rgba(255, 255, 255, 0.1)',
  
  // Semantic (minimal use)
  destructive: '#DC2626',
  success: '#22C55E',
};

export const ChroniclesSpacing = {
  // Section spacing
  sectionVertical: 48,        // py-24 equivalent (24 * 4 / 2 for mobile)
  sectionHorizontal: 24,      // px-6 equivalent
  
  // Card internal padding
  cardPadding: 24,
  cardPaddingLarge: 32,
  
  // Element spacing
  elementGap: 16,
  elementGapLarge: 24,
  
  // Header spacing
  headerMarginBottom: 32,
};

export const ChroniclesRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  full: 9999,
};

export const ChroniclesTypography = {
  // Font families (will use system fonts as fallback)
  // To match Chronicles: Playfair Display for serif, Inter for sans, Geist Mono for mono
  fontFamilySans: undefined,  // System default
  fontFamilySerif: undefined, // Would need to load Playfair Display
  fontFamilyMono: undefined,  // Would need to load Geist Mono
  
  // Heading sizes (scaled for mobile)
  hero: {
    fontSize: 48,
    fontWeight: '300' as const,  // font-light
    letterSpacing: -1,
    lineHeight: 52,
  },
  h1: {
    fontSize: 36,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '300' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontSize: 22,
    fontWeight: '300' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '300' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  
  // Eyebrow text (mono, uppercase, letter-spaced)
  eyebrow: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 3,        // tracking-[0.3em] equivalent
    textTransform: 'uppercase' as const,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  
  // Labels
  label: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
};

// Glass card styles for StyleSheet
export const glassCardStyle = {
  backgroundColor: ChroniclesColors.glassBackground,
  borderWidth: 1,
  borderColor: ChroniclesColors.borderLight,
  borderRadius: ChroniclesRadius['3xl'],
};

// Glass button styles for StyleSheet  
export const glassButtonStyle = {
  backgroundColor: ChroniclesColors.glassButtonBg,
  borderWidth: 1,
  borderColor: ChroniclesColors.borderMedium,
  borderRadius: ChroniclesRadius.xl,
};

export default {
  colors: ChroniclesColors,
  spacing: ChroniclesSpacing,
  radius: ChroniclesRadius,
  typography: ChroniclesTypography,
};
