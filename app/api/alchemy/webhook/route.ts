import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Alchemy Address Activity Webhook Handler
 * 
 * Automatically processes incoming crypto transactions and matches them to orders
 * Replaces the polling-based verify-payment system with real-time webhook notifications
 * 
 * Event Payload Structure:
 * {
 *   "createdAt": "2024-09-25T13:52:47.561987389Z",
 *   "event": {
 *     "activity": [
 *       {
 *         "asset": "USDC",
 *         "blockNum": "0xdf34a3",
 *         "category": "token",
 *         "hash": "0x7a4a39da2a3fa1fc2ef88fd1eaea070286ed2aba21e0419dcfb6d5c5d9f02a72",
 *         "fromAddress": "0x503828976d22510aad0201ac7ec88293211d23da",
 *         "toAddress": "0xbe3f4b43db5eb49d1f48f53443b9abce45da3b79",
 *         "value": 293.092129,
 *         "rawContract": {
 *           "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
 *           "decimals": 6,
 *           "rawValue": "0x0000000000000000000000000000000000000000000000000000000011783b21"
 *         }
 *       }
 *     ],
 *     "network": "ETH_MAINNET"
 *   },
 *   "id": "whevt_pz2qu8k04anfjknt",
 *   "type": "ADDRESS_ACTIVITY",
 *   "webhookId": "wh_ac5sekedy2t7n2gs"
 * }
 */

// Validate Alchemy webhook signature using HMAC SHA256
function isValidSignature(body: string, signature: string, signingKey: string): boolean {
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(body, 'utf8');
  const digest = hmac.digest('hex');
  return signature === digest;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Alchemy-Signature',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature validation
    const rawBody = await req.text();
    
    // Get host info for SMS API calls
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    // Validate Alchemy signature for security
    const signature = req.headers.get('x-alchemy-signature');
    const signingKey = process.env.ALCHEMY_WEBHOOK_SIGNING_KEY;

    if (!signingKey) {
      console.error('[Alchemy Webhook] ALCHEMY_WEBHOOK_SIGNING_KEY not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    
    if (!signature || !isValidSignature(rawBody, signature, signingKey)) {
      console.error('[Alchemy Webhook] Invalid signature - unauthorized request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[Alchemy Webhook] ✅ Signature validated');

    // Parse the body as JSON
    const webhookEvent = JSON.parse(rawBody);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { id: eventId, type, event, createdAt } = webhookEvent;

    console.log(`[Alchemy Webhook] Processing event ${eventId} (${type})`);

    // Only process ADDRESS_ACTIVITY events
    if (type !== 'ADDRESS_ACTIVITY') {
      console.log(`[Alchemy Webhook] Skipping non-address-activity event: ${type}`);
      return NextResponse.json({ message: 'Event type not processed' });
    }

    const { activity, network } = event;

    if (!activity || !Array.isArray(activity) || activity.length === 0) {
      console.log('[Alchemy Webhook] No activity in event');
      return NextResponse.json({ message: 'No activity to process' });
    }

    console.log(`[Alchemy Webhook] Processing ${activity.length} transaction(s) on ${network}`);

    // Log webhook event to database for auditing
    try {
      await supabase
        .from('alchemy_webhook_events')
        .insert({
          event_id: eventId,
          webhook_id: webhookEvent.webhookId,
          event_type: type,
          network: network,
          transactions_count: activity.length,
          raw_payload: webhookEvent,
          processed_at: new Date().toISOString()
        });
      console.log(`[Alchemy Webhook] Event logged to database`);
    } catch (logError: any) {
      console.error('[Alchemy Webhook] Failed to log event (continuing):', logError.message);
    }

    // Process each transaction in the activity array
    for (const tx of activity) {
      try {
        await processTransaction(supabase, tx, network, eventId, baseUrl);
      } catch (error: any) {
        console.error(`[Alchemy Webhook] Error processing tx ${tx.hash}:`, error.message);
        // Continue processing other transactions even if one fails
      }
    }

    // Respond with 200 to acknowledge receipt
    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      eventId,
      transactionsProcessed: activity.length
    });

  } catch (error: any) {
    console.error('[Alchemy Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Process a single transaction from Alchemy webhook
 */
async function processTransaction(supabase: any, tx: any, network: string, eventId: string, baseUrl: string) {
  const {
    hash,
    fromAddress,
    toAddress,
    value,
    asset,
    blockNum,
    category,
    rawContract,
    log
  } = tx;

  console.log(`\n[Alchemy Webhook] Processing transaction:`);
  console.log(`  Hash: ${hash}`);
  console.log(`  From: ${fromAddress} (sender)`);
  console.log(`  To: ${toAddress} (receiver)`);
  console.log(`  Value: ${value} ${asset}`);
  console.log(`  Block: ${parseInt(blockNum, 16)}`);
  console.log(`  Category: ${category}`);

  // Check if transaction already exists
  const { data: existingTx } = await supabase
    .from('wallet_transactions')
    .select('id')
    .eq('tx_hash', hash)
    .single();

  if (existingTx) {
    console.log(`  ⚠️  Transaction already exists in database - skipping`);
    return;
  }

  // Find which wallet this transaction belongs to
  // Use ilike for case-insensitive match (addresses may be stored with mixed case)
  const { data: wallet } = await supabase
    .from('business_wallets')
    .select('*')
    .ilike('address', toAddress)
    .eq('is_active', true)
    .single();

  if (!wallet) {
    console.log(`  ⚠️  Wallet ${toAddress} not found or inactive - skipping`);
    return;
  }

  console.log(`  ✅ Matched to wallet: ${wallet.label} (${wallet.id})`);

  // Determine currency (normalize to ETH/USDC format)
  let currency = asset;
  if (asset === 'ETH' || category === 'external') {
    currency = 'ETH';
  } else if (asset === 'USDC' || (rawContract && rawContract.address.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')) {
    currency = 'USDC';
  }

  // Create wallet transaction record
  const { data: walletTx, error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      tx_hash: hash,
      type: 'incoming',
      from_address: fromAddress.toLowerCase(),
      to_address: toAddress.toLowerCase(),
      amount: value.toString(),
      currency: currency,
      status: 'confirmed', // Alchemy only sends confirmed transactions
      block_number: parseInt(blockNum, 16),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (txError) {
    console.error(`  ❌ Error creating wallet transaction:`, txError.message);
    return;
  }

  console.log(`  ✅ Wallet transaction created`);

  // Try to match this transaction to a pending order
  await matchTransactionToOrder(supabase, walletTx, wallet, baseUrl);
}

/**
 * Match a confirmed transaction to a pending order
 */
async function matchTransactionToOrder(supabase: any, walletTx: any, wallet: any, baseUrl: string) {
  console.log(`\n[Alchemy Webhook] Searching for matching order...`);

  // Find orders that:
  // 1. Are assigned to this wallet
  // 2. Are in payment_processing status
  // 3. Expect payment in this currency
  // 4. Were initiated recently (within 24 hours)
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('*, customers!inner(user_id)')
    .eq('assigned_wallet_id', wallet.id)
    .eq('payment_status', 'payment_processing')
    .eq('expected_payment_currency', walletTx.currency)
    .gte('payment_initiated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('payment_initiated_at', { ascending: false });

  if (!pendingOrders || pendingOrders.length === 0) {
    console.log(`  ⚠️  No matching pending orders found`);
    return;
  }

  console.log(`  Found ${pendingOrders.length} pending order(s) to check`);

  // Check each order for a match
  const txAmount = parseFloat(walletTx.amount);
  const txTime = new Date(walletTx.created_at).getTime();

  for (const order of pendingOrders) {
    const expectedAmount = parseFloat(order.expected_payment_amount);
    const paymentInitTime = new Date(order.payment_initiated_at).getTime();
    const timeDiffMinutes = (txTime - paymentInitTime) / 1000 / 60;
    const percentOfExpected = (txAmount / expectedAmount) * 100;
    const shortage = expectedAmount - txAmount;

    console.log(`\n  Checking order ${order.order_number}:`);
    console.log(`    Expected: ${expectedAmount} ${walletTx.currency}`);
    console.log(`    Received: ${txAmount} ${walletTx.currency}`);
    console.log(`    Match: ${percentOfExpected.toFixed(2)}%`);
    console.log(`    Time: ${timeDiffMinutes.toFixed(1)} min after payment initiated`);

    // Match criteria:
    // 1. Within 24 hour time window
    // 2. Amount is 70-105% of expected (allows for small shorts/overpayments)
    const withinTimeWindow = Math.abs(timeDiffMinutes) <= 24 * 60;
    const reasonableAmount = percentOfExpected >= 70 && percentOfExpected <= 105;

    if (withinTimeWindow && reasonableAmount) {
      console.log(`    ✅ MATCH FOUND! Updating order to PAID`);

      // Update order to paid status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'payment_received',
          payment_status: 'paid',
          payment_date: walletTx.confirmed_at,
          payment_verified_at: new Date().toISOString(),
          transaction_hash: walletTx.tx_hash,
          actual_payment_amount: txAmount,
          payment_shortage: shortage > 0 ? shortage : null
        })
        .eq('id', order.id);

      if (updateError) {
        console.error(`    ❌ Error updating order:`, updateError.message);
        continue;
      }

      // Link transaction to order
      await supabase
        .from('wallet_transactions')
        .update({ order_id: order.id })
        .eq('id', walletTx.id);

      // TODO: Re-enable notifications after fixing database constraint
      // Run this SQL in Supabase:
      // ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
      // ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
      //   CHECK (type IN ('support_ticket', 'order_update', 'system'));
      console.log(`    ℹ️  In-app notification skipped (using SMS)`);

      // Save customer wallet address for future reference
      if (order.customer_id) {
        try {
          const { data: customer } = await supabase
            .from('customers')
            .select('wallet_addresses')
            .eq('id', order.customer_id)
            .single();

          if (customer) {
            const walletAddresses = customer.wallet_addresses || [];
            const addressExists = walletAddresses.some(
              (entry: any) => entry.address.toLowerCase() === walletTx.from_address.toLowerCase()
            );

            let updatedAddresses;
            if (addressExists) {
              updatedAddresses = walletAddresses.map((entry: any) =>
                entry.address.toLowerCase() === walletTx.from_address.toLowerCase()
                  ? {
                      ...entry,
                      last_used: new Date().toISOString(),
                      last_order_id: order.id
                    }
                  : entry
              );
            } else {
              updatedAddresses = [
                ...walletAddresses,
                {
                  address: walletTx.from_address,
                  first_used: new Date().toISOString(),
                  last_used: new Date().toISOString(),
                  first_order_id: order.id,
                  last_order_id: order.id
                }
              ];
            }

            await supabase
              .from('customers')
              .update({ wallet_addresses: updatedAddresses })
              .eq('id', order.customer_id);

            console.log(`    ✅ Customer wallet address saved`);
          }
        } catch (error: any) {
          console.error(`    ⚠️  Failed to save wallet address:`, error.message);
        }
      }

      // Send SMS notification now that payment is confirmed
      try {
        const { data: customer } = await supabase
          .from('customers')
          .select('user_id, users!customers_user_id_fkey(phone)')
          .eq('id', order.customer_id)
          .single();

        const phoneNumber = customer?.users?.phone;
        
      if (phoneNumber) {
        console.log(`    📱 Sending SMS to: ${phoneNumber}`);
        console.log(`    📞 Calling SMS API at: ${baseUrl}/api/orders/send-order-sms`);
        
        const smsResponse = await fetch(`${baseUrl}/api/orders/send-order-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            phoneNumber: phoneNumber
          })
        });

          if (smsResponse.ok) {
            console.log(`    ✅ SMS notification sent to customer`);
          } else {
            console.log(`    ⚠️  SMS notification failed (non-critical)`);
          }
        }
      } catch (smsError: any) {
        console.error(`    ⚠️  Failed to send SMS (non-critical):`, smsError.message);
      }

      console.log(`\n  🎉 Payment processed successfully!`);
      console.log(`     Order: ${order.order_number}`);
      console.log(`     Amount: ${txAmount} ${walletTx.currency}`);
      console.log(`     Transaction: ${walletTx.tx_hash}`);
      console.log(`     Block: ${walletTx.block_number}`);
      
      if (shortage > 0) {
        console.log(`     ⚠️  Customer short: ${shortage.toFixed(6)} ${walletTx.currency}`);
      }

      return; // Stop checking other orders once we find a match
    } else {
      console.log(`    ❌ No match (time: ${withinTimeWindow ? 'OK' : 'FAIL'}, amount: ${reasonableAmount ? 'OK' : 'FAIL'})`);
    }
  }

  console.log(`  ⚠️  Transaction received but no matching order found`);
}
