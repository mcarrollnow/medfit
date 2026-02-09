# ⚡ Quick Start Guide

Get your SMS Gateway running in 30 minutes.

## 🎯 What You'll Build

Android app that:
- Receives SMS → Forwards to your server
- Receives FCM messages → Sends SMS from phone

## 🚀 Installation (4 steps)

### 1. Firebase Setup (10 min)

```bash
# 1. Create project at https://console.firebase.google.com
# 2. Add Android app: co.livewellshop.smsgateway
# 3. Download google-services.json
# 4. Replace placeholder:
mv ~/Downloads/google-services.json android-sms-gateway/app/google-services.json

# 5. Get Firebase Admin credentials:
# Settings → Service Accounts → Generate New Private Key
# Add to .env:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Build & Install (5 min)

```bash
# 1. Open Android Studio
# 2. Open android-sms-gateway folder
# 3. Connect Android phone via USB
# 4. Enable USB debugging on phone
# 5. Click Run ▶ button
# 6. Wait for install
```

### 3. Configure App (5 min)

**On your phone:**
1. Grant Permissions
2. Disable Battery Optimization
3. Start Gateway
4. Copy FCM Token

### 4. Register Device (5 min)

```bash
# Run database migration
supabase migration up 20251024000000_create_sms_devices_table.sql

# Register device with your FCM token
curl -X POST https://modernhealth.pro/api/sms/register-device \
  -H "Content-Type: application/json" \
  -d '{
    "fcmToken": "YOUR_COPIED_TOKEN",
    "deviceName": "My Phone"
  }'
```

## ✅ Test It

### Test incoming:
```bash
# Send SMS to your phone
# Check database:
SELECT * FROM sms_conversations WHERE direction = 'incoming' ORDER BY created_at DESC LIMIT 1;
```

### Test outgoing:
```bash
curl -X POST https://modernhealth.pro/api/sms/send-via-fcm \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Test message!"
  }'
```

## 🎉 Done!

Your gateway is now:
- ✅ Receiving SMS
- ✅ Sending SMS via FCM
- ✅ Running 24/7 in background

## 📝 Next Steps

1. **Integrate with AI Claude**: Add SMS sending to your AI tools
2. **Monitor**: Check app statistics regularly
3. **Keep running**: Don't force close the app

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App crashes | Check `google-services.json` is correct |
| SMS not forwarding | Grant SMS permissions |
| Can't send via FCM | Verify FCM token registered |
| Service stops | Disable battery optimization |

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Complete documentation
- **Architecture** - How it all works

---

**Need detailed help?** See `SETUP_GUIDE.md`
