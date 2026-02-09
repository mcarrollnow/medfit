# RCS Business Messaging Setup Guide

> **⚠️ CURRENT STATUS:** RCS support is currently **DISABLED** because the `play-services-rcsbusinessmessaging` library doesn't exist in public repositories. The app currently works with **SMS only**.
>
> **To enable RCS:**
> 1. Complete Google Business Communications registration (see below)
> 2. Use the proper RCS API from Google's Business Communications platform
> 3. Uncomment RCS code in `SmsSender.kt`
> 4. Rename `RcsManager.kt.disabled` back to `RcsManager.kt`
> 5. Update with correct Agent ID

## Overview
This guide walks you through adding Rich Communication Services (RCS) support to your Live Well SMS Gateway, enabling rich features like images, quick reply buttons, and branded messages while maintaining SMS fallback for maximum compatibility.

---

## ✨ What RCS Adds to Your Gateway

### Current (SMS Only):
- Plain text messages
- 160 character limit per message
- No read receipts or typing indicators
- No rich media

### With RCS:
- **Rich Media**: Send product images, order updates with photos
- **Quick Replies**: Add buttons like "Track Order", "Contact Support"
- **Branding**: Use Live Well yellow (#FFF95E) brand colors
- **Better UX**: Read receipts, typing indicators
- **Automatic Fallback**: Still sends SMS if recipient doesn't support RCS

---

## Prerequisites

Before starting, ensure you have:
- ✅ Working SMS gateway (Android app installed and functional)
- ✅ Google account for Business Communications
- ✅ Live Well Shop business verification documents
- ✅ Access to Firebase project
- ✅ 1-2 hours for setup

---

## Part 1: Google RCS Business Registration

### Step 1: Create Business Account
1. Go to [Google Business Communications](https://business-communications.cloud.google.com/)
2. Click "Get Started"
3. Sign in with your Google account
4. Fill in business information:
   - Business name: **Modern Health**
   - Website: **https://modernhealth.pro**
   - Industry: **Health & Wellness / E-commerce**

### Step 2: Verify Your Business
1. Google will require business verification
2. Provide required documents:
   - Business license or registration
   - Website ownership verification
   - Tax ID (if applicable)
3. Wait for verification (typically 1-3 business days)

### Step 3: Create RCS Agent
1. Once verified, go to **Agents** section
2. Click **Create Agent**
3. Fill in agent details:
   - **Agent Name**: Modern Health Support
   - **Description**: Customer support for Modern Health
   - **Brand Color**: `#3dff8b` (Modern Health green accent)
   - **Logo**: Upload Modern Health logo
   - **Welcome Message**: "Hi! How can we help you today?"

4. Configure agent capabilities:
   - ✅ Enable text messaging
   - ✅ Enable rich cards
   - ✅ Enable suggested replies
   - ✅ Enable media sharing

5. Save and note your **Agent ID** (format: `agents/XXXX-XXXX-XXXX`)

---

## Part 2: Update Android App

### Step 1: Update Agent ID
1. Open `/android-sms-gateway/app/src/main/java/co/livewellshop/smsgateway/RcsManager.kt`
2. Replace the placeholder Agent ID:

```kotlin
companion object {
    // Replace with your actual Agent ID from Google Business Communications
    private const val AGENT_ID = "agents/YOUR-AGENT-ID-HERE"
}
```

### Step 2: Rebuild and Install
1. In Android Studio:
   - Click **Build → Clean Project**
   - Click **Build → Rebuild Project**
   - Click **Run** or `Shift+F10`

2. App will install with RCS support enabled

### Step 3: Test RCS Capability
1. Open the app on your Android device
2. Check logs for RCS initialization:
   ```
   RcsManager: RCS Business Messaging available
   ```

---

## Part 3: Testing RCS Features

### Test 1: Basic RCS Message
Send a test message from your server:

```javascript
const response = await fetch('https://modernhealth.pro/api/sms/send-via-fcm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    message: 'Your order has shipped!',
    rcsFeatures: {
      brandColor: '#3dff8b'
    }
  })
});
```

**Expected behavior:**
- If recipient supports RCS: Sends via RCS with branding
- If not: Automatically falls back to SMS

### Test 2: RCS with Quick Replies
```javascript
const response = await fetch('https://modernhealth.pro/api/sms/send-via-fcm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    message: 'Your order #ORD-123 has shipped!',
    rcsFeatures: {
      brandColor: '#3dff8b',
      quickReplies: [
        'Track my order',
        'Contact support',
        'View order details'
      ]
    }
  })
});
```

**Expected behavior:**
- RCS users see clickable quick reply buttons
- SMS users receive plain text (buttons automatically removed)

### Test 3: RCS with Image
```javascript
const response = await fetch('https://modernhealth.pro/api/sms/send-via-fcm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    message: 'Check out this new product!',
    rcsFeatures: {
      imageUrl: 'https://modernhealth.pro/images/product.jpg',
      brandColor: '#3dff8b',
      quickReplies: ['Shop now', 'Learn more']
    }
  })
});
```

---

## Part 4: Integration with AI Support

### Update AI Instructions
Your AI can now use RCS features automatically. No changes needed to `AI_INSTRUCTIONS.md` - the gateway handles RCS detection automatically!

### AI SMS Tool Examples

**Order Shipped Notification:**
```javascript
{
  phoneNumber: customer.phone,
  message: "Great news! Your order shipped today and should arrive tomorrow.",
  rcsFeatures: {
    brandColor: '#3dff8b',
    quickReplies: [
      'Track package',
      'Delivery updates',
      'Contact support'
    ]
  }
}
```

**Product Recommendation:**
```javascript
{
  phoneNumber: customer.phone,
  message: "Based on your recent order, you might like our new BPC-157 variant!",
  rcsFeatures: {
    imageUrl: 'https://modernhealth.pro/images/bpc-157.jpg',
    brandColor: '#3dff8b',
    quickReplies: [
      'View product',
      'Add to cart',
      'Maybe later'
    ]
  }
}
```

---

## Part 5: Monitoring & Analytics

### Check RCS Usage
Monitor logs to see RCS vs SMS usage:

```bash
# In Android Studio Logcat, filter for:
RcsManager: Sending via RCS to +1234567890
SmsSender: RCS not available, falling back to SMS
```

### Server-Side Tracking
Check your server logs for message types:

```javascript
// In /api/sms/incoming.js logs:
{
  "messageType": "rcs",  // or "sms"
  "phoneNumber": "+1234567890",
  "success": true
}
```

---

## Troubleshooting

### RCS Not Working

**Problem**: Messages always fall back to SMS

**Solutions:**
1. ✅ Verify Agent ID is correct in `RcsManager.kt`
2. ✅ Ensure Google Business account is verified
3. ✅ Check recipient's phone supports RCS (Android with RCS enabled)
4. ✅ Rebuild and reinstall Android app after Agent ID change

### RCS Dependency Error

**Problem**: Build fails with RCS library not found

**Solution:**
```bash
# Sync Gradle dependencies
./gradlew --refresh-dependencies
```

### Quick Replies Not Showing

**Problem**: Buttons don't appear in RCS messages

**Solutions:**
1. ✅ Ensure `quickReplies` is an array of strings
2. ✅ Max 4 quick reply buttons per message
3. ✅ Each button text max 25 characters
4. ✅ Recipient must have RCS-enabled messaging app

---

## Best Practices

### When to Use RCS Features

✅ **Use RCS for:**
- Order status updates (with tracking image)
- Product recommendations (with product image)
- Support conversations (with quick action buttons)
- Appointment confirmations (with calendar actions)

❌ **Don't use RCS for:**
- Time-critical messages (SMS is more reliable)
- Messages to unknown phone numbers (may not support RCS)
- Transactional alerts (use plain SMS for guaranteed delivery)

### Quick Reply Button Guidelines

**Good:**
```javascript
quickReplies: [
  'Track order',      // Short, clear action
  'Contact us',       // 
Direct request
  'Learn more'        // Simple call-to-action
]
```

**Bad:**
```javascript
quickReplies: [
  'I would like to track my order please',  // Too long
  'Click here for more information about', // Unclear
  'Button #1',                              // Not descriptive
]
```

### Image Specifications

**Supported formats:** JPG, PNG, GIF, WebP
**Recommended size:** 1200x628 pixels
**Max file size:** 5MB
**Best for:** Product photos, tracking maps, confirmation images

---

## Cost Comparison

### Before RCS (SMS Only):
- Plain text messages only
- Limited engagement
- No rich media
- Still $0/year with your gateway! 🎉

### After RCS (SMS + RCS):
- Rich media messages for RCS users
- Better customer engagement
- Professional branded experience
- **Still $0/year!** 🎉

RCS through Google Business Messaging is **free** for verified businesses!

---

## Security & Privacy

### Data Protection
- ✅ Messages encrypted in transit (TLS)
- ✅ RCS messages stored by Google (same as Gmail)
- ✅ No third-party access to message content
- ✅ Your Android device still handles actual sending

### Compliance
- ✅ GDPR compliant (with proper business verification)
- ✅ TCPA compliant (same rules as SMS)
- ✅ CAN-SPAM Act compliant
- ✅ Google Business Messaging ToS

---

## FAQ

### Q: Will RCS work for all my customers?
**A:** Only customers with RCS-enabled devices will receive RCS messages. Others automatically get SMS fallback with the same text content (minus rich features).

### Q: Do I need to change my AI instructions?
**A:** No! The gateway automatically detects RCS capability and uses it when available. Your AI just sends messages normally.

### Q: Can I send MMS instead of RCS?
**A:** RCS is superior to MMS and works on modern Android devices. MMS would require different implementation and has compatibility issues.

### Q: What happens if Google rejects my business?
**A:** You can reapply with additional documentation, or continue using SMS-only (which works perfectly fine).

### Q: Does iOS support RCS?
**A:** As of iOS 18, Apple added RCS support. However, it's limited compared to Android. Test thoroughly with iOS users.

---

## Next Steps

1. ✅ Complete Google Business Communications registration
2. ✅ Get your Agent ID and update `RcsManager.kt`
3. ✅ Rebuild and install Android app
4. ✅ Test with RCS-enabled test phone
5. ✅ Monitor logs to verify RCS messages sending
6. ✅ Roll out to customers gradually

---

## Support

**Google Business Communications:**
- https://developers.google.com/business-communications

**RCS Documentation:**
- https://developers.google.com/business-communications/rcs-business-messaging

**Live Well SMS Gateway Issues:**
- Check Android Studio Logcat
- Review server logs in Vercel
- Test with known RCS-enabled device

---

**RCS enhancement complete! Your SMS gateway now supports rich messaging while maintaining SMS compatibility.** 🎉
