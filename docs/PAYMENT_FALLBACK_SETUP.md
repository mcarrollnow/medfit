# Payment Fallback Mode Setup Guide

This guide explains how to set up the Payment Fallback Mode feature, which allows your store to continue accepting orders when payment processing is down by sending invoices through a separate Shopify store.

## Overview

When Payment Fallback Mode is enabled:
1. Customers can create orders normally without immediate payment
2. Orders are saved with `payment_method: 'invoice'` and `payment_status: 'pending_invoice'`
3. A Supabase Edge Function automatically sends a payment invoice via Shopify
4. The invoice comes from your separate Shopify store (not your main website)
5. Customers receive an email with a secure payment link
6. Once paid through Shopify, you can manually update the order status

## Benefits

- **Zero Downtime**: Continue accepting orders even when Stripe/crypto payments are down
- **Separation of Concerns**: Invoices come from Shopify, not your main store
- **Generic Invoices**: Only order total and customer info are included—no product details or branding
- **Customer Experience**: Seamless checkout flow with clear messaging

## Setup Steps

### 1. Create a Separate Shopify Store (Invoice Store)

1. Go to [Shopify Partners](https://partners.shopify.com) or create a new store at [Shopify](https://shopify.com)
2. Create a **development store** or use an existing store dedicated to invoicing
3. Configure the store with a generic name (e.g., "Payments" or "Billing")
4. **Important**: This store doesn't need products—it's only for draft order invoices

### 2. Create an App in Dev Dashboard

1. Go to [dev.shopify.com](https://dev.shopify.com)
2. Click **Create app** or select your existing app
3. In the app, go to **Settings** in the left sidebar
4. Under **Credentials**, you'll find:
   - **Client ID** - Copy this
   - **Secret** - Click the 👁 eye icon to reveal, then copy
5. Make sure your app version has `write_draft_orders` scope configured
6. Install the app to your invoice store

### 3. Run the Database Migration

Run the migration to add the payment fallback columns:

```bash
# If using Supabase CLI
supabase db push

# Or run the SQL directly in Supabase dashboard
```

The migration file is: `supabase/migrations/20260103000000_add_payment_fallback_mode.sql`

### 4. Deploy the Supabase Edge Function

```bash
cd supabase/functions

# Deploy the edge function
supabase functions deploy send-shopify-invoice --project-ref your-project-ref
```

### 5. Set Up the Database Trigger (Optional)

The trigger in `20260103000001_create_invoice_order_trigger.sql` uses `pg_net` to call the edge function automatically.

**Alternative**: Use Supabase Webhooks instead:
1. Go to Supabase Dashboard → Database → Webhooks
2. Create a new webhook:
   - **Table**: orders
   - **Events**: INSERT
   - **URL**: `https://your-project.supabase.co/functions/v1/send-shopify-invoice`
   - **Headers**: `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
   - **Filter**: `payment_method = 'invoice'`

### 6. Configure in Admin Settings

1. Go to `/admin/settings` in your dashboard
2. Find the **Payment Fallback Mode** section
3. Enter:
   - **Store Domain**: `your-invoice-store.myshopify.com` (e.g., `ayf518-u2.myshopify.com`)
   - **Client ID**: From Dev Dashboard → Settings → Credentials
   - **Client Secret**: From Dev Dashboard → Settings → Credentials (click eye icon to reveal)
   - **Invoice Prefix**: e.g., `INV` (invoices will show as "Order INV-ORD-123456")
   - **Customer Message**: The message shown to customers during checkout
4. Toggle **Enable Payment Fallback Mode** when ready
5. Click **Save**

## How It Works

### Checkout Flow

1. Customer adds items to cart and proceeds to checkout
2. System checks if `payment_fallback_enabled` is true
3. If enabled, checkout shows:
   - Orange notice explaining invoice payment mode
   - Modified button: "Submit Order & Send Invoice"
4. Customer fills shipping info (email required)
5. On submit:
   - Order created with `payment_method: 'invoice'`
   - Customer redirected to confirmation page
   - Database trigger/webhook fires the edge function

### Edge Function Flow

1. Receives new order data
2. Fetches Shopify settings from `site_settings`
3. Gets customer email from database
4. Creates a **Draft Order** in Shopify with:
   - Single line item: "Order INV-ORD-123456"
   - Price: Order total
   - Customer email
5. Sends invoice email via Shopify's `send_invoice` API
6. Updates order with:
   - `shopify_invoice_id`
   - `shopify_invoice_url`
   - `invoice_sent_at`

### Shopify Invoice

The customer receives an email from Shopify containing:
- Generic order reference (not your product details)
- Secure payment link
- Your Shopify store branding (not your main website)

## Admin Monitoring

### View Pending Invoices

In your orders list, filter by:
- `payment_method: 'invoice'`
- `payment_status: 'pending_invoice'`

### Track Invoice Status

Check the following fields:
- `shopify_invoice_id`: Draft order ID in Shopify
- `shopify_invoice_url`: Direct link to payment page
- `invoice_sent_at`: When invoice was sent

### Manual Invoice Resend

If needed, you can resend an invoice:

```typescript
import { sendShopifyInvoice } from '@/app/actions/payment-fallback'

const result = await sendShopifyInvoice(orderId)
```

## Shopify Webhook for Payment Confirmation (Optional)

To automatically update order status when paid through Shopify:

1. In Shopify admin, go to **Settings → Notifications → Webhooks**
2. Create webhook for **Draft orders/Update**
3. Set URL to your API endpoint
4. Create an API route to handle the webhook and update order status

## Troubleshooting

### Invoice Not Sending

1. Check edge function logs in Supabase dashboard
2. Verify Shopify API token is valid
3. Ensure customer has a valid email
4. Check `site_settings` has correct Shopify domain

### Wrong Store Domain

The domain should be in format: `your-store.myshopify.com` (not the custom domain)

### API Permission Errors

Ensure your Shopify custom app has both:
- `write_draft_orders`
- `read_draft_orders`

### Edge Function Not Triggering

If using database triggers:
- Ensure `pg_net` extension is enabled
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_invoice_order_created'`

If using webhooks:
- Verify webhook is active in Supabase dashboard
- Check webhook URL is correct
- Verify authorization header

## Security Notes

1. **API Token**: Stored in database; consider using Supabase Vault for production
2. **Service Role Key**: Only used server-side in edge functions
3. **Customer Data**: Only email and name are sent to Shopify
4. **No Product Data**: Product information is NOT sent to Shopify

## Disabling Fallback Mode

When payment processing is restored:
1. Go to `/admin/settings`
2. Toggle off **Payment Fallback Mode**
3. Click **Save**

The setting takes effect immediately for new checkouts.

