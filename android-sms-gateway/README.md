# 📱 SMS Gateway App for LiveWell Shop

A free, privacy-focused Android SMS gateway that forwards incoming SMS to your webhook and sends outgoing SMS via Firebase Cloud Messaging.

## 🎯 Features

- ✅ **100% Free** - No API fees, no subscriptions
- ✅ **Privacy First** - All messages stay between your phone and server
- ✅ **Auto-Start** - Starts automatically on device boot
- ✅ **Background Service** - Runs reliably in the background
- ✅ **Firebase Cloud Messaging** - Receive send requests from your server
- ✅ **Modern UI** - Clean Material Design 3 interface
- ✅ **Statistics** - Track sent and received messages

## 🔧 Prerequisites

1. **Android Studio** - Download from https://developer.android.com/studio
2. **Android Device** - Physical phone with SMS capability (API 26+)
3. **Firebase Account** - Free at https://console.firebase.google.com
4. **Google Account** - For Firebase setup

## 📦 Installation Steps

### 1. Setup Firebase

1. Go to https://console.firebase.google.com
2. Click "Add project" and create a new project (e.g., "LiveWell SMS Gateway")
3. Add an Android app:
   - Package name: `co.livewellshop.smsgateway`
   - App nickname: "SMS Gateway"
   - Click "Register app"
4. Download `google-services.json`
5. **Replace** the placeholder file at `app/google-services.json` with your downloaded file
6. In Firebase Console, go to "Cloud Messaging" and note your **Server Key** (you'll need this)

### 2. Build the App

1. Open Android Studio
2. Click "Open" and select the `android-sms-gateway` folder
3. Wait for Gradle sync to complete
4. Connect your Android phone via USB
5. Enable "Developer Options" and "USB Debugging" on your phone
6. Click the green "Run" button (▶) in Android Studio
7. Select your phone when prompted
8. Wait for app to install and launch

### 3. Configure Permissions

Once the app launches on your phone:

1. Click **"Grant Permissions"**
   - Allow SMS permissions
   - Allow Notifications
2. Click **"Disable Battery Optimization"**
   - Select "Allow" to prevent Android from killing the app
3. Click **"Copy Token"** to get your FCM token
4. **Save this token** - you'll need it for the server setup

### 4. Start the Gateway

1. Click **"Start Gateway"** button
2. You should see "Service Status: Running ✓"
3. The app is now listening for SMS!

## 🖥️ Server Setup

You need to set up two API endpoints on your server:

### 1. Register FCM Token Endpoint

Create `/api/sms/register-device.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fcmToken, deviceName } = req.body;

  if (!fcmToken) {
    return res.status(400).json({ error: 'FCM token required' });
  }

  // Store FCM token in database
  const { error } = await supabase
    .from('sms_devices')
    .upsert({
      fcm_token: fcmToken,
      device_name: deviceName || 'SMS Gateway',
      active: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'fcm_token'
    });

  if (error) {
    console.error('Failed to register device:', error);
    return res.status(500).json({ error: 'Failed to register device' });
  }

  res.json({ success: true, message: 'Device registered' });
}
```

### 2. Send SMS via FCM Endpoint

Create `/api/sms/send-via-fcm.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'phoneNumber and message required' });
  }

  // Get active device FCM token
  const { data: device, error: dbError } = await supabase
    .from('sms_devices')
    .select('fcm_token')
    .eq('active', true)
    .single();

  if (dbError || !device) {
    return res.status(500).json({ error: 'No active SMS device found' });
  }

  // Send FCM message to device
  try {
    const fcmMessage = {
      data: {
        phoneNumber: phoneNumber,
        message: message
      },
      token: device.fcm_token
    };

    const response = await admin.messaging().send(fcmMessage);
    console.log('FCM message sent:', response);

    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('FCM send error:', error);
    res.status(500).json({ error: 'Failed to send FCM message' });
  }
}
```

### 3. Database Schema

Create the `sms_devices` table:

```sql
CREATE TABLE sms_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fcm_token TEXT UNIQUE NOT NULL,
  device_name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_sms_devices_active ON sms_devices(active);
```

### 4. Environment Variables

Add to your `.env` file:

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Get these from Firebase Console → Project Settings → Service Accounts → Generate New Private Key

## 🔄 How It Works

### Incoming SMS Flow
```
SMS arrives on phone
  → SmsReceiver catches it
  → WebhookClient forwards to https://modernhealth.pro/api/sms/incoming
  → Server stores in database
  → AI Claude can read it
```

### Outgoing SMS Flow
```
AI Claude wants to send SMS
  → Server calls /api/sms/send-via-fcm
  → Firebase sends FCM message to phone
  → FcmService receives message
  → SmsSender sends actual SMS
  → Reports status back to server
```

## 📊 Monitoring

The app shows real-time statistics:
- **Messages Sent**: Count of SMS sent from this device
- **Messages Received**: Count of SMS received and forwarded
- **FCM Token**: Your unique device identifier

## 🔒 Security

- All webhook calls use HTTPS
- FCM tokens are private to your Firebase project
- No third parties can access your messages
- SMS permissions are only used by this app

## 🐛 Troubleshooting

### App not receiving FCM messages
1. Check that FCM token is registered on server
2. Verify Firebase Server Key is correct
3. Check app has notification permission

### SMS not forwarding
1. Check app has SMS permissions
2. Verify internet connection
3. Check webhook URL is correct
4. View logs in Android Studio (Logcat)

### Service stops after reboot
1. Click "Disable Battery Optimization"
2. Check Boot Receiver is enabled in AndroidManifest.xml

### Messages not sending
1. Check phone has cellular signal
2. Verify SMS permission is granted
3. Check phone number format (+1234567890)

## 📝 Development

### Project Structure
```
android-sms-gateway/
├── app/
│   ├── src/main/
│   │   ├── java/co/livewellshop/smsgateway/
│   │   │   ├── MainActivity.kt          # Main UI
│   │   │   ├── SmsReceiver.kt          # Incoming SMS
│   │   │   ├── SmsSender.kt            # Outgoing SMS
│   │   │   ├── FcmService.kt           # FCM handler
│   │   │   ├── SmsGatewayService.kt    # Background service
│   │   │   ├── WebhookClient.kt        # HTTP client
│   │   │   └── BootReceiver.kt         # Auto-start
│   │   ├── res/
│   │   │   ├── layout/                  # UI layouts
│   │   │   └── values/                  # Strings, colors
│   │   └── AndroidManifest.xml          # Permissions, components
│   ├── build.gradle.kts                 # Dependencies
│   └── google-services.json             # Firebase config
└── build.gradle.kts                     # Project config
```

### Building from Source
```bash
cd android-sms-gateway
./gradlew assembleDebug
```

APK will be in: `app/build/outputs/apk/debug/app-debug.apk`

### Viewing Logs
```bash
adb logcat | grep -E "(SmsReceiver|SmsSender|FcmService)"
```

## 🚀 Next Steps

1. Install app on phone
2. Copy FCM token
3. Register token on server
4. Test incoming SMS
5. Test outgoing SMS via FCM
6. Integrate with AI Claude

## 📄 License

Built for LiveWell Shop - Private use only

## 🙏 Support

For issues or questions, check:
- Android Studio Logcat for errors
- Firebase Console for FCM delivery logs
- Server logs for webhook calls

---

**Ready to use!** 🎉 Your SMS gateway is now running on your Android phone.
