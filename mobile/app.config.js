export default {
  expo: {
    name: "Modern Health Pro",
    slug: "modern-health-pro",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "modernhealthpro",
    userInterfaceStyle: "dark",
    splash: {
      backgroundColor: "#0a0a0a"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.modernhealthpro.app",
      infoPlist: {
        NSCameraUsageDescription: "Allow camera access to scan QR codes for inventory management",
        NSMicrophoneUsageDescription: "Allow microphone access for voice commands"
      }
    },
    android: {
      package: "com.modernhealthpro.app",
      permissions: [
        "CAMERA",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera for QR code scanning."
        }
      ],
      [
        "expo-notifications",
        {
          color: "#ffffff"
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    newArchEnabled: true,
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/29897565-6888-4489-ab6a-e15a1af61126"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://modernhealth.pro",
      mobileApiKey: process.env.EXPO_PUBLIC_MOBILE_API_KEY || "",
      router: {},
      eas: {
        projectId: "29897565-6888-4489-ab6a-e15a1af61126"
      }
    },
    owner: "mcarrollnow"
  }
};
