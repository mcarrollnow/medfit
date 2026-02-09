export const siteConfig = {
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'modernhealth.pro',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL || 'https://modernhealth.pro',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Modern Health',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@modernhealth.pro',
  paymentsEmail: process.env.NEXT_PUBLIC_PAYMENTS_EMAIL || 'payments@modernhealth.pro',
  noReplyEmail: process.env.RESEND_FROM_EMAIL || 'noreply@modernhealth.pro',
  capacitorAppId: process.env.CAPACITOR_APP_ID || 'modernhealth.pro',
}
