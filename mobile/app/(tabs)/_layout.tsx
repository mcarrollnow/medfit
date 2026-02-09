import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChroniclesColors, ChroniclesRadius } from '../../src/theme/chronicles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: ChroniclesColors.background,
          borderTopColor: ChroniclesColors.borderLight,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: ChroniclesColors.foreground,
        tabBarInactiveTintColor: ChroniclesColors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        headerStyle: { 
          backgroundColor: ChroniclesColors.background,
        },
        headerTintColor: ChroniclesColors.foreground,
        headerTitleStyle: {
          fontWeight: '300',
          fontSize: 17,
          letterSpacing: 0.5,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="promo-codes"
        options={{
          title: 'Promos',
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
