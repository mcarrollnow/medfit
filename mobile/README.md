# Modern Health Pro Mobile App

A React Native mobile app for managing the Modern Health Pro store. Built with Expo for iOS and Android.

## Features

- 📲 **Push Notifications** - Real-time order alerts
- 🔔 **Order Management** - View, search, and filter orders
- 📧 **Send Invoices** - One-tap invoice sending to customers
- ➕ **Create Orders** - Quick order creation on the go
- 📷 **QR Code Scanner** - Scan products for inventory management
- 📦 **Inventory Tracking** - Real-time stock levels and updates

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Backend**: Supabase (shared with web dashboard)
- **Push Notifications**: Expo Notifications
- **Camera/Scanner**: Expo Camera

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Navigate to the mobile folder:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Development

Start the development server:
```bash
pnpm start
```

Run on specific platform:
```bash
# iOS
pnpm ios

# Android
pnpm android
```

### Building for Production

This app uses EAS Build for production builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen with quick actions
│   │   ├── orders.tsx     # Orders list
│   │   ├── inventory.tsx  # Inventory management
│   │   └── settings.tsx   # App settings
│   ├── orders/
│   │   └── [id].tsx       # Order detail screen
│   ├── scanner.tsx        # QR code scanner
│   ├── send-invoice.tsx   # Send invoice modal
│   ├── create-order.tsx   # Create order flow
│   ├── login.tsx          # Login screen
│   └── _layout.tsx        # Root layout
├── src/
│   ├── hooks/             # Custom React hooks
│   │   └── useNotifications.ts
│   ├── lib/               # Utilities
│   │   └── supabase.ts    # Supabase client
│   ├── store/             # Zustand stores
│   │   ├── auth.ts
│   │   └── orders.ts
│   └── types/             # TypeScript types
│       ├── database.ts
│       └── index.ts
├── assets/                # Images and icons
├── app.json              # Expo config
├── package.json
└── tsconfig.json
```

## Push Notifications Setup

### Expo Push Notifications

1. Get your Expo push token in the app
2. Store the token in Supabase `users.push_token`
3. Send notifications from your backend using Expo's push service

### Backend Integration

Add a push notification trigger when new orders are created:

```typescript
// In your Supabase Edge Function or API route
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

// When a new order is created
async function notifyNewOrder(order: Order, pushToken: string) {
  await expo.sendPushNotificationsAsync([{
    to: pushToken,
    sound: 'default',
    title: 'New Order! 🎉',
    body: `${order.customer_name} placed an order for $${order.total}`,
    data: { type: 'new_order', orderId: order.id },
  }]);
}
```

## Database Schema Requirements

The mobile app expects these Supabase tables:

- `users` - with `push_token` column for notifications
- `orders` - order data
- `order_items` - order line items
- `products` - product catalog

See the main dashboard `ARCHITECTURE.md` for full schema details.

## Customization

### Theming

The app uses a dark theme matching the web dashboard. Colors are defined in component StyleSheets and can be customized by modifying the color values.

### Quick Actions

Customize the home screen quick actions in `app/(tabs)/index.tsx`:

```typescript
const quickActions: QuickAction[] = [
  {
    id: 'send-invoice',
    title: 'Send Invoice',
    icon: 'mail',
    color: '#22c55e',
    route: '/send-invoice',
  },
  // Add more actions...
];
```

## Contributing

This mobile app is part of the Live Well Shop project. See the main repository for contribution guidelines.

## License

MIT
