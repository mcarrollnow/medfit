import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'modernhealth.pro',
  appName: 'modern health pro admin',
  webDir: 'public'
};

export default config;
