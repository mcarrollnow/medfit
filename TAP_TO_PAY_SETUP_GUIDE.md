# Tap to Pay POS Setup Guide
## Stripe Terminal - iPhone & Android

This guide covers everything needed to build a React Native POS app with Tap to Pay functionality using Stripe Terminal.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Stripe Dashboard Setup](#stripe-dashboard-setup)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [React Native App Setup](#react-native-app-setup)
5. [App Code Structure](#app-code-structure)
6. [iOS Specific Configuration](#ios-specific-configuration)
7. [Android Specific Configuration](#android-specific-configuration)
8. [Testing](#testing)
9. [Common Issues](#common-issues)

---

## Prerequisites

- Stripe account with Terminal enabled
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Mac with Xcode 14+, Apple Developer account ($99/year)
- For Android: Android Studio
- Physical device (Tap to Pay doesn't work on simulators)

### Device Requirements
- **iPhone**: iPhone XS or later, iOS 16.4+
- **Android**: Android 9+, NFC-enabled device with Google Play Services

---

## Stripe Dashboard Setup

### Step 1: Enable Terminal
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Terminal** → **Overview**
3. Click **Get Started** if not already enabled

### Step 2: Apply for Tap to Pay Access
1. Go to **Terminal** → **Readers**
2. Click **"Tap to Pay on iPhone"** and/or **"Tap to Pay on Android"**
3. Complete the application form
4. Wait for approval (24-48 hours typically)

### Step 3: Create a Location
```bash
# Using Stripe CLI or Dashboard
stripe terminal locations create \
  --display-name="Your Store Name" \
  --address[line1]="123 Main St" \
  --address[city]="San Francisco" \
  --address[state]="CA" \
  --address[postal_code]="94102" \
  --address[country]="US"
```

Save the location ID (starts with `tml_...`)

---

## Backend API Endpoints

Add these to your Next.js dashboard backend:

### 1. Connection Token Endpoint
```typescript
// app/api/stripe/terminal/connection-token/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create()
    return NextResponse.json({ secret: connectionToken.secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 2. Create Payment Intent Endpoint
```typescript
// app/api/stripe/terminal/create-payment-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd', orderId, customerId } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card_present'],
      capture_method: 'automatic',
      metadata: {
        order_id: orderId || '',
        customer_id: customerId || '',
      },
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 3. Capture Payment Endpoint (if using manual capture)
```typescript
// app/api/stripe/terminal/capture-payment/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json()
    
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)
    
    return NextResponse.json({ 
      success: true,
      paymentIntent 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## React Native App Setup

### Step 1: Create Expo Project
```bash
npx create-expo-app@latest pos-terminal --template blank-typescript
cd pos-terminal
```

### Step 2: Install Dependencies
```bash
npx expo install @stripe/stripe-terminal-react-native
npx expo install expo-location
npx expo install expo-haptics
npx expo install @expo/vector-icons
```

### Step 3: Create Development Build
Tap to Pay requires native code - you CANNOT use Expo Go.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Create development build
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

---

## App Code Structure

### App.tsx - Main Entry Point
```tsx
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native'
import { POSScreen } from './screens/POSScreen'

// Your dashboard API URL
const API_URL = 'https://your-dashboard.vercel.app'

export default function App() {
  const fetchTokenProvider = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/stripe/terminal/connection-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const { secret } = await response.json()
    return secret
  }

  return (
    <StripeTerminalProvider
      logLevel="verbose"
      tokenProvider={fetchTokenProvider}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" />
        <POSScreen apiUrl={API_URL} />
      </SafeAreaView>
    </StripeTerminalProvider>
  )
}
```

### screens/POSScreen.tsx - Main POS Interface
```tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import {
  useStripeTerminal,
  PaymentIntent,
  Reader,
} from '@stripe/stripe-terminal-react-native'
import * as Haptics from 'expo-haptics'

interface POSScreenProps {
  apiUrl: string
}

export function POSScreen({ apiUrl }: POSScreenProps) {
  const [amount, setAmount] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentReader, setCurrentReader] = useState<Reader.Type | null>(null)

  const {
    initialize,
    discoverReaders,
    connectLocalMobileReader,
    createPaymentIntent,
    collectPaymentMethod,
    confirmPaymentIntent,
    cancelCollectPaymentMethod,
  } = useStripeTerminal({
    onUpdateDiscoveredReaders: (readers) => {
      console.log('Discovered readers:', readers)
    },
    onDidChangeConnectionStatus: (status) => {
      console.log('Connection status:', status)
      setIsConnected(status === 'connected')
    },
  })

  // Initialize Terminal on mount
  useEffect(() => {
    initializeTerminal()
  }, [])

  const initializeTerminal = async () => {
    try {
      const { error } = await initialize()
      if (error) {
        console.error('Initialize error:', error)
        Alert.alert('Error', `Failed to initialize: ${error.message}`)
        return
      }
      console.log('Terminal initialized')
      await connectToReader()
    } catch (err) {
      console.error('Init error:', err)
    }
  }

  const connectToReader = async () => {
    try {
      // Discover local mobile reader (the phone itself)
      const { error: discoverError } = await discoverReaders({
        discoveryMethod: 'localMobile',
        simulated: false, // Set to true for testing without real cards
      })

      if (discoverError) {
        console.error('Discover error:', discoverError)
        return
      }

      // Connect to local mobile reader (Tap to Pay)
      const { reader, error: connectError } = await connectLocalMobileReader({
        reader: { serialNumber: 'LOCAL_MOBILE' } as any,
        locationId: 'YOUR_LOCATION_ID', // Replace with your tml_... ID
      })

      if (connectError) {
        console.error('Connect error:', connectError)
        Alert.alert('Connection Error', connectError.message)
        return
      }

      setCurrentReader(reader)
      setIsConnected(true)
      console.log('Connected to local mobile reader')
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

  const handleKeyPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    
    if (key === 'C') {
      setAmount('0')
      return
    }
    
    if (key === '⌫') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
      return
    }

    // Max 6 digits
    if (amount.replace('.', '').length >= 6) return

    if (amount === '0' && key !== '.') {
      setAmount(key)
    } else {
      setAmount(prev => prev + key)
    }
  }

  const getDisplayAmount = () => {
    const cents = parseInt(amount) || 0
    return (cents / 100).toFixed(2)
  }

  const processPayment = async () => {
    const amountInCents = parseInt(amount)
    if (amountInCents < 50) {
      Alert.alert('Invalid Amount', 'Minimum amount is $0.50')
      return
    }

    if (!isConnected) {
      Alert.alert('Not Connected', 'Please wait for reader connection')
      await connectToReader()
      return
    }

    setIsProcessing(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)

    try {
      // 1. Create Payment Intent on your server
      const response = await fetch(`${apiUrl}/api/stripe/terminal/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents / 100, // Convert to dollars for API
        }),
      })

      const { clientSecret, error: serverError } = await response.json()
      if (serverError) throw new Error(serverError)

      // 2. Collect payment method (customer taps card)
      const { paymentIntent: collectedPI, error: collectError } = 
        await collectPaymentMethod({ paymentIntent: { clientSecret } as any })

      if (collectError) {
        if (collectError.code === 'Canceled') {
          console.log('Payment canceled')
          return
        }
        throw new Error(collectError.message)
      }

      // 3. Confirm the payment
      const { paymentIntent: confirmedPI, error: confirmError } = 
        await confirmPaymentIntent({ paymentIntent: collectedPI as any })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      // Success!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Alert.alert(
        'Payment Successful',
        `$${getDisplayAmount()} charged successfully`,
        [{ text: 'OK', onPress: () => setAmount('0') }]
      )

    } catch (err: any) {
      console.error('Payment error:', err)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Payment Failed', err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const cancelPayment = async () => {
    await cancelCollectPaymentMethod()
    setIsProcessing(false)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>POS Terminal</Text>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <Text style={styles.amount}>{getDisplayAmount()}</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.key,
              key === 'C' && styles.clearKey,
              key === '⌫' && styles.backspaceKey,
            ]}
            onPress={() => handleKeyPress(key)}
            disabled={isProcessing}
          >
            <Text style={[
              styles.keyText,
              (key === 'C' || key === '⌫') && styles.specialKeyText,
            ]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Charge Button */}
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.processingText}>Tap Card to Pay</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelPayment}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.chargeButton, parseInt(amount) < 50 && styles.chargeButtonDisabled]}
          onPress={processPayment}
          disabled={parseInt(amount) < 50}
        >
          <Text style={styles.chargeButtonText}>
            Charge ${getDisplayAmount()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 40,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '300',
    color: '#fff',
    marginTop: 10,
    marginRight: 4,
  },
  amount: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -2,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  key: {
    width: '30%',
    aspectRatio: 1.6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearKey: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  backspaceKey: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  keyText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
  },
  specialKeyText: {
    fontSize: 24,
  },
  chargeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  chargeButtonDisabled: {
    backgroundColor: '#374151',
  },
  chargeButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#ef4444',
  },
})
```

---

## iOS Specific Configuration

### app.json / app.config.js
```json
{
  "expo": {
    "name": "POS Terminal",
    "slug": "pos-terminal",
    "ios": {
      "bundleIdentifier": "com.yourcompany.posterminal",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Location is used to verify payment location",
        "NSBluetoothAlwaysUsageDescription": "Bluetooth is used to connect to card readers",
        "NFCReaderUsageDescription": "NFC is used to accept contactless payments"
      },
      "entitlements": {
        "com.apple.developer.proximity-reader.payment.acceptance": true
      }
    }
  }
}
```

### Required Entitlements
You need the **Tap to Pay on iPhone** entitlement from Apple:
1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Go to **Identifiers** → Your App ID
3. Enable **Tap to Pay on iPhone** capability
4. Regenerate provisioning profiles

### eas.json
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

---

## Android Specific Configuration

### app.json / app.config.js
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.posterminal",
      "permissions": [
        "android.permission.NFC",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

### AndroidManifest.xml (if using bare workflow)
```xml
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc" android:required="true" />
```

---

## Testing

### Simulated Mode
For development without real cards, enable simulated mode:

```tsx
const { error: discoverError } = await discoverReaders({
  discoveryMethod: 'localMobile',
  simulated: true, // Enable simulated mode
})
```

### Test Cards (Physical)
Stripe provides test cards that work with real NFC:
- Use Stripe's physical test cards (order from dashboard)
- Or use Apple Pay / Google Pay with test card saved

### Test Card Numbers (Simulated)
In simulated mode, these trigger different scenarios:
- `4242424242424242` - Success
- `4000000000000002` - Decline
- `4000000000009995` - Insufficient funds

---

## Common Issues

### "Not authorized for Tap to Pay"
- Ensure you've applied for access in Stripe Dashboard
- Wait for approval email
- Verify your app's bundle ID matches Stripe Dashboard

### "Location required"
- Request location permission before connecting
- Create a location in Stripe Dashboard and use the ID

### "Reader not found"
- Must use physical device (not simulator)
- Ensure NFC is enabled on device
- For iOS, ensure entitlements are configured

### Connection Drops
- Implement reconnection logic
- Handle `onDidChangeConnectionStatus` callback

### "Payment method not supported"
- Ensure payment intent uses `payment_method_types: ['card_present']`
- Verify Terminal is enabled in Stripe Dashboard

---

## Production Checklist

- [ ] Applied for Tap to Pay on iPhone access
- [ ] Applied for Tap to Pay on Android access
- [ ] Created Terminal location in Stripe Dashboard
- [ ] Configured iOS entitlements
- [ ] Configured Android NFC permissions
- [ ] Created connection token endpoint
- [ ] Created payment intent endpoint
- [ ] Tested with simulated mode
- [ ] Tested with physical test cards
- [ ] Built production app with EAS
- [ ] Submitted to App Store / Play Store

---

## Links

- [Stripe Terminal Docs](https://stripe.com/docs/terminal)
- [Tap to Pay on iPhone](https://stripe.com/docs/terminal/payments/setup-reader/tap-to-pay?platform=ios)
- [Tap to Pay on Android](https://stripe.com/docs/terminal/payments/setup-reader/tap-to-pay?platform=android)
- [React Native SDK](https://github.com/stripe/stripe-terminal-react-native)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

