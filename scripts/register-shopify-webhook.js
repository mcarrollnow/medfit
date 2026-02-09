#!/usr/bin/env node
/**
 * Register Shopify Webhooks for Invoice Payment Updates
 * 
 * Usage:
 *   node scripts/register-shopify-webhook.js
 * 
 * Required environment variables:
 *   SHOPIFY_STORE_DOMAIN - e.g., ayf518-u2.myshopify.com
 *   SHOPIFY_ACCESS_TOKEN - Admin API access token (shpat_...)
 *   SUPABASE_PROJECT_REF - e.g., bteugdayafihvdzhpnlv
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'ayf518-u2.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'bteugdayafihvdzhpnlv';

const WEBHOOK_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/shopify-webhook`;

const WEBHOOKS_TO_REGISTER = [
  { topic: 'draft_orders/update', address: WEBHOOK_URL },
  { topic: 'orders/create', address: WEBHOOK_URL },
  { topic: 'orders/paid', address: WEBHOOK_URL }
];

async function listWebhooks() {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/webhooks.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list webhooks: ${await response.text()}`);
  }

  const data = await response.json();
  return data.webhooks || [];
}

async function deleteWebhook(id) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/webhooks/${id}.json`,
    {
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      }
    }
  );

  return response.ok;
}

async function createWebhook(topic, address) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/webhooks.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: 'json'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create webhook ${topic}: ${error}`);
  }

  const data = await response.json();
  return data.webhook;
}

async function main() {
  console.log('🔗 Shopify Webhook Registration');
  console.log('================================');
  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log('');

  try {
    // List existing webhooks
    console.log('📋 Checking existing webhooks...');
    const existingWebhooks = await listWebhooks();
    
    // Remove any existing webhooks pointing to our function
    for (const webhook of existingWebhooks) {
      if (webhook.address === WEBHOOK_URL) {
        console.log(`  🗑️  Removing existing webhook: ${webhook.topic}`);
        await deleteWebhook(webhook.id);
      }
    }

    // Register new webhooks
    console.log('\n📝 Registering webhooks...');
    for (const { topic, address } of WEBHOOKS_TO_REGISTER) {
      try {
        const webhook = await createWebhook(topic, address);
        console.log(`  ✅ ${topic} -> ${webhook.id}`);
      } catch (error) {
        console.error(`  ❌ ${topic}: ${error.message}`);
      }
    }

    console.log('\n✨ Webhook registration complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Deploy the shopify-webhook edge function');
    console.log('2. Test by paying an invoice in Shopify');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

