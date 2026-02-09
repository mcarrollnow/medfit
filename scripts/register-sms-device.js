// Register SMS Gateway Device
const fcmToken = "fcn80jdZTdiA-hb3hWZ0bb:APA91bHfJlu1V0tqA3KZdnbzR2Jck35poogVKc2PxIcR6-aSCFMoB7PQYYSveYuqoMPgMGm3lYzKtfIgBdLZPkvETArMRp178gSMoB0A7ai3NthGaLedU10";

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://modernhealth.pro';
fetch(`${API_URL}/api/sms/register-device`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fcmToken: fcmToken,
    deviceName: 'Michael Android Phone'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Device registered:', data);
})
.catch(err => {
  console.error('❌ Registration failed:', err);
});
