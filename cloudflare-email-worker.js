/**
 * Cloudflare Email Worker
 * 
 * Forwards USPS receipt emails to your webhook for automatic tracking updates
 * 
 * SETUP:
 * 1. Go to Cloudflare Dashboard → Email Routing → Email Workers
 * 2. Create new worker, paste this code
 * 3. Set environment variables:
 *    - USPS_WEBHOOK_URL: https://yourdomain.com/api/tracking/inbound-email
 *    - USPS_WEBHOOK_API_KEY: (generate from Admin → Tracking Settings)
 * 4. Create routing rule: tracking@yourdomain.com → This Worker
 * 
 * USAGE:
 * Forward USPS receipt emails to: tracking@yourdomain.com
 */

export default {
  async email(message, env, ctx) {
    // Process webhook in background, don't block email
    ctx.waitUntil(processEmail(message, env));
  }
};

async function processEmail(message, env) {
    try {
      console.log('Email Worker triggered');
      console.log('From:', message.from);
      console.log('To:', message.to);
      console.log('Subject:', message.headers.get('subject'));

      // Extract email data
      const from = message.from;
      const to = message.to;
      const subject = message.headers.get('subject') || '';
      
      // Get email body using built-in method
      const rawEmail = await new Response(message.raw).text();
      
      console.log('Raw email preview:', rawEmail.substring(0, 500));

      // Send to webhook
      const webhookUrl = env.USPS_WEBHOOK_URL;
      const apiKey = env.USPS_WEBHOOK_API_KEY;

      if (!webhookUrl || !apiKey) {
        console.error('USPS_WEBHOOK_URL or USPS_WEBHOOK_API_KEY not configured');
        return;
      }

      console.log('Sending to webhook:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          text: rawEmail,
          date: new Date().toISOString()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        console.log('Successfully forwarded to webhook');
      } else {
        console.error('Webhook error - Status:', response.status, 'Body:', responseText);
      }

    } catch (error) {
      console.error('Email Worker error:', error);
    }
}
