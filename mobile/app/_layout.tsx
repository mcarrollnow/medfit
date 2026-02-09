import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';
import { ChroniclesColors } from '../src/theme/chronicles';

async function checkForUpdates() {
  if (__DEV__) return;
  
  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (e) {
    // Silent fail - don't interrupt the user
    console.log('Update check failed:', e);
  }
}

export default function RootLayout() {
  useEffect(() => {
    // Check for updates on launch
    checkForUpdates();
    
    // Check again when app comes to foreground
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkForUpdates();
      }
    });
    
    return () => subscription.remove();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: ChroniclesColors.background },
        headerTintColor: ChroniclesColors.foreground,
        headerTitleStyle: {
          fontWeight: '300',
          fontSize: 17,
        },
        contentStyle: { backgroundColor: ChroniclesColors.background },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen 
        name="scanner" 
        options={{ 
          title: 'Scan QR Code', 
          presentation: 'fullScreenModal',
        }} 
      />
      <Stack.Screen 
        name="create-order" 
        options={{ 
          title: 'Create Order', 
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="send-invoice" 
        options={{ 
          title: 'Send Invoice', 
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
