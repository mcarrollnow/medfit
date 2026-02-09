# 🚀 SMS Gateway Setup Guide

Complete step-by-step guide to set up your Android SMS Gateway.

## 📋 Prerequisites Checklist

- [ ] Android phone (API 26+, Android 8.0 or newer)
- [ ] USB cable to connect phone to computer
- [ ] Google account for Firebase
- [ ] Computer with Android Studio installed
- [ ] LiveWell Shop server access

## Part 1: Firebase Setup (15 minutes)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Enter project name: `LiveWell SMS Gateway`
4. Disable Google Analytics (not needed)
5. Click **"Create project"**
6. Wait for project creation

### Step 2: Add Android App to Firebase

1. In Firebase Console, click **"Add app"** → Android icon
2. Enter package name: `co.livewellshop.smsgateway`
3. App nickname: `SMS Gateway`
4. Leave SHA-1 blank (not needed for FCM)
5. Click **"Register app"**

### Step 3: Download Configuration File

1. Click **"Download google-services.json"**
2. Save the file
3. **IMPORTANT**: Replace the placeholder file:
   ```bash
   mv ~/Downloads/google-services.json android-sms-gateway/app/google-services.json
   ```
4. Click **"Next"** and **"Continue to console"**

### Step 4: Get Firebase Admin Credentials

1. In Firebase Console → ⚙️ Settings → **Project settings**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (downloads JSON file)
5. Open the downloaded JSON file
6. Copy these values for later:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 5: Add to Server Environment Variables

Add to your `.env` file:

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=livewell-sms-gateway
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@livewell-sms-gateway.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"
```

⚠️ **Important**: Keep the quotes around `FIREBASE_PRIVATE_KEY` and the `\n` characters.

## Part 2: Android Studio Setup (10 minutes)

### Step 1: Install Android Studio

1. Download from https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio
4. Complete the setup wizard

### Step 2: Open Project

1. Click **"Open"**
2. Navigate to `android-sms-gateway` folder
3. Click **"OK"**
4. Wait for Gradle sync (first time takes 5-10 minutes)

### Step 3: Configure Android Device

**On your Android phone:**

1. Go to **Settings** → **About phone**
2. Tap **"Build number"** 7 times (enables Developer mode)
3. Go back to **Settings** → **System** → **Developer options**
4. Enable **"USB debugging"**
5. Connect phone to computer via USB
6. Tap **"Allow"** when prompted for USB debugging

### Step 4: Verify Device Connection

In Android Studio:
1. Look at top toolbar for device dropdown
2. Should show your phone model
3. If not, click dropdown and select your device

## Part 3: Build and Install App (5 minutes)

### Step 1: Build App

1. In Android Studio, click green ▶ **"Run"** button
2. Select your connected phone
3. Click **"OK"**
4. Wait for build (2-3 minutes first time)
5. App will install and launch automatically

### Step 2: Grant Permissions

**On your phone (app is now open):**

1. Click **"Grant Permissions"** button
   - Tap **"Allow"** for SMS permissions (3 prompts)
   - Tap **"Allow"** for Notifications
2. Click **"Disable Battery Optimization"** button
   - Select **"Allow"** to prevent Android from killing app
3. Click **"Start Gateway"** button
   - Should see "Service Status: Running ✓"

### Step 3: Get FCM Token

1. Click **"Copy Token"** button
2. Token is now in your clipboard
3. **Save this token** - you'll need it next!

## Part 4: Server Configuration (10 minutes)

### Step 1: Run Database Migration

```bash
cd /Users/michaelcarroll/dashboard
supabase migration up 20251024000000_create_sms_devices_table.sql
```

Or manually run the SQL in Supabase Dashboard.

### Step 2: Register Your Device

Use the FCM token you copied earlier:

```bash
curl -X POST https://modernhealth.pro/api/sms/register-device \
  -H "Content-Type: application/json" \
  -d '{
    "fcmToken": "YOUR_FCM_TOKEN_HERE",
    "deviceName": "My Android Phone"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Device registered successfully",
  "deviceId": "uuid-here"
}
```

### Step 3: Verify Installation

Check device is registered:

```sql
SELECT * FROM sms_devices WHERE active = true;
```

Should see your device with the FCM token.

## Part 5: Testing (10 minutes)

### Test 1: Incoming SMS

1. **Send a text message TO your phone** from another phone
2. Check Supabase `sms_conversations` table:
   ```sql
   SELECT * FROM sms_conversations 
   WHERE direction = 'incoming' 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
3. Should see the message you sent

### Test 2: Outgoing SMS via FCM

```bash
curl -X POST https://modernhealth.pro/api/sms/send-via-fcm \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Test from SMS Gateway!"
  }'
```

Expected:
- FCM message sent to phone
- Phone sends actual SMS
- Recipient receives text message
- Status reported back to server

### Test 3: Check Statistics

Open the app on your phone:
- **Messages Sent**: Should show 1
- **Messages Received**: Should show 1
- **Service Status**: Should show "Running ✓"

## Part 6: Integration with AI Claude

Now that the gateway is working, integrate it with your AI support system.

### Option 1: Direct API Call

In your AI agent tools, add a function to send SMS:

```javascript
async function sendSmsToCustomer(phoneNumber, message) {
  const response = await fetch('https://modernhealth.pro/api/sms/send-via-fcm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, message })
  });
  
  return await response.json();
}
```

### Option 2: Add to Existing SMS Endpoint

Update `/api/send-sms.js` to use FCM instead of Telnyx:

```javascript
// Instead of Telnyx, use our gateway
const result = await fetch('https://modernhealth.pro/api/sms/send-via-fcm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber, message })
});
```

## 🎉 You're Done!

Your SMS Gateway is now:
- ✅ Running on your Android phone
- ✅ Forwarding incoming SMS to your server
- ✅ Receiving send requests via Firebase
- ✅ Sending outgoing SMS from your phone
- ✅ Reporting status back to server

## 🔧 Maintenance

### Keep App Running

- **Don't force close the app** - Let it run in background
- **Check battery optimization is disabled** - Prevents Android from killing it
- **Service should auto-start on phone reboot** - Via BootReceiver

### Monitor Health

Check app periodically:
- Service status should be "Running ✓"
- Statistics should update as messages are sent/received
- If service stops, tap "Start Gateway" again

### Update FCM Token

If you reinstall the app or token changes:
1. Open app
2. Copy new token
3. Call `/api/sms/register-device` again with new token

## 🐛 Troubleshooting

### App crashes on launch
- Check Android Studio Logcat for errors
- Verify `google-services.json` is correct
- Rebuild: Build → Rebuild Project

### SMS not forwarding
- Check SMS permissions granted
- Check internet connection
- View logs: `adb logcat | grep SmsReceiver`

### Can't send SMS via FCM
- Verify FCM token is registered
- Check Firebase credentials in `.env`
- View FCM logs in Firebase Console

### Service stops running
- Disable battery optimization
- Check phone isn't in extreme power saving mode
- Restart service from app

## 📱 Best Practices

1. **Use a dedicated phone** - Don't use your personal phone
2. **Keep phone charged** - Plugged in or on wireless charger
3. **Stable internet** - WiFi preferred over cellular
4. **Monitor logs** - Check Firebase Console for delivery issues
5. **Backup FCM token** - Save it somewhere safe

## 🔐 Security Notes

- **FCM token is sensitive** - Don't share publicly
- **Firebase private key is critical** - Keep in `.env`, never commit
- **Webhook is public** - Anyone can POST to it (consider adding auth)
- **SMS permissions** - Only this app uses them

---

Need help? Check logs:
- **Android Studio**: Logcat tab
- **Firebase**: Cloud Messaging logs
- **Server**: Vercel function logs
