# Mobile App Agent Instructions

## 🚨 CRITICAL: Workspace Location

**This mobile app is located at:**
```
/Users/michaelcarroll/dashboard/mobile
```

**NOT in p2 or any other folder.**

---

## Project Overview

- **App Name:** Medfit 90
- **Framework:** Expo / React Native with Expo Router
- **Styling:** Custom theme system (Chronicles theme - monochromatic black/white luxury aesthetic)
- **State:** Zustand (if used)
- **Backend:** Supabase

---

## Project Structure

```
/Users/michaelcarroll/dashboard/mobile/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout with OTA updates
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen (with hamburger menu)
│   │   ├── orders.tsx            # Orders tab
│   │   ├── inventory.tsx         # Inventory tab
│   │   ├── customers.tsx         # Customers tab
│   │   ├── promo-codes.tsx       # Promo codes tab
│   │   └── settings.tsx          # Settings tab
│   ├── login.tsx                 # Login screen
│   ├── scanner.tsx               # QR scanner modal
│   ├── create-order.tsx          # Create order modal
│   ├── send-invoice.tsx          # Send invoice modal
│   └── orders/[id].tsx           # Order detail screen
├── src/
│   ├── components/               # Reusable components
│   │   └── DrawerMenu.tsx        # Hamburger/drawer navigation
│   ├── theme/
│   │   └── chronicles.ts         # Theme colors, typography, spacing
│   ├── lib/
│   │   └── supabase.ts           # Supabase client
│   ├── hooks/                    # Custom hooks
│   ├── store/                    # Zustand stores
│   └── types/                    # TypeScript types
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
└── package.json
```

---

## Theme System

Import theme from:
```typescript
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';
```

### Colors
- `ChroniclesColors.background` - #050505 (near black)
- `ChroniclesColors.foreground` - #FAFAFA (off-white)
- `ChroniclesColors.mutedForeground` - #999999 (grey)
- `ChroniclesColors.glassBackground` - rgba(255,255,255,0.03)
- `ChroniclesColors.borderLight` - rgba(255,255,255,0.08)
- `ChroniclesColors.success` - #22C55E
- `ChroniclesColors.destructive` - #DC2626

### Border Radius
- `ChroniclesRadius.sm` - 12
- `ChroniclesRadius.md` - 16
- `ChroniclesRadius.lg` - 20
- `ChroniclesRadius.xl` - 24
- `ChroniclesRadius['2xl']` - 28
- `ChroniclesRadius.full` - 9999

---

## Current Features

### Navigation
- **Bottom Tabs:** Home, Orders, Inventory, Customers, Promos, Settings
- **Hamburger Menu:** Slide-out drawer accessible from Home screen
  - Inventory
  - Customers
  - Promo Codes
  - Voice Prompt (links to Home)

### Screens
- **Home:** Dashboard with quick actions and stats
- **Orders:** Order list and management
- **Inventory:** Stock management with QR scanner
- **Customers:** Customer list with search and stats
- **Promo Codes:** Code generator and existing codes list
- **Settings:** App preferences and account

---

## OTA Updates (Expo Updates)

The app has OTA updates configured in `app/_layout.tsx`:
- Checks for updates on app launch
- Checks when app comes to foreground
- Prompts user to restart when update is available

### Push an Update
```bash
cd /Users/michaelcarroll/dashboard/mobile
git add .
git commit -m "Your message"
git push
npx eas-cli update --branch preview --message "Your message"
```

### Build New APK
```bash
npx eas-cli build --profile preview --platform android
```

**Important:** EAS builds from git, not local files. Always commit & push before building.

---

## Build Profiles (eas.json)

- **development** - Dev client, internal distribution, channel: `development`
- **preview** - APK build, internal distribution, channel: `preview`
- **production** - App bundle, channel: `production`

---

## Adding New Screens

### Add a Tab Screen
1. Create file in `app/(tabs)/your-screen.tsx`
2. Add to tab layout in `app/(tabs)/_layout.tsx`:
```typescript
<Tabs.Screen
  name="your-screen"
  options={{
    title: 'Your Screen',
    tabBarIcon: ({ color, size }) => <Ionicons name="icon-name" size={size} color={color} />,
  }}
/>
```

### Add a Modal Screen
1. Create file in `app/your-modal.tsx`
2. Add to root layout in `app/_layout.tsx`:
```typescript
<Stack.Screen 
  name="your-modal" 
  options={{ 
    title: 'Your Modal', 
    presentation: 'modal',
  }} 
/>
```

### Add to Hamburger Menu
Edit `src/components/DrawerMenu.tsx` and add to `menuItems` array:
```typescript
{
  id: 'your-item',
  title: 'Your Item',
  description: 'Description here',
  icon: 'icon-name',
  route: '/your-route',
},
```

---

## Component Pattern

```typescript
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius, ChroniclesTypography, ChroniclesSpacing } from '../../src/theme/chronicles';

export default function YourScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Your content */}
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
  // Glass card style
  card: {
    backgroundColor: ChroniclesColors.glassBackground,
    borderWidth: 1,
    borderColor: ChroniclesColors.borderLight,
    borderRadius: ChroniclesRadius.xl,
    padding: 16,
  },
});
```

---

## ⚠️ Common Mistakes to Avoid

1. **Wrong directory** - Always verify you're in `/Users/michaelcarroll/dashboard/mobile`
2. **Forgetting to commit** - EAS builds from git, not local files
3. **Wrong branch** - APKs are on `preview` channel, not `production`
4. **Using p2 theme** - This app uses Chronicles theme, not Tailwind

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/michaelcarroll/dashboard/mobile

# Start dev server
npx expo start

# Push OTA update
git add . && git commit -m "message" && git push
npx eas-cli update --branch preview --message "message"

# Build APK
npx eas-cli build --profile preview --platform android

# Check build status
npx eas-cli build:list --platform android
```
