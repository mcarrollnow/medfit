import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    console.log(`[Verify Payment] Verifying payment for order ${orderId}`)

    // Get order with payment details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify user owns this order via customer record
    if (order.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('id, user_id')
        .eq('id', order.customer_id)
        .single()

      if (!customer || customer.user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json({
        verified: true,
        status: 'paid',
        transactionHash: order.transaction_hash,
        message: 'Payment already verified'
      })
    }

    // Check if payment is being processed
    if (order.payment_status !== 'payment_processing') {
      return NextResponse.json({
        error: 'Payment not initiated',
        status: order.payment_status
      }, { status: 400 })
    }

    if (!order.assigned_wallet_id || !order.expected_payment_amount) {
      return NextResponse.json({ error: 'Payment details not found' }, { status: 400 })
    }

    console.log(`[Verify Payment] Looking for payment of ${order.expected_payment_amount} ${order.expected_payment_currency}`)

    // Get wallet address to sync from blockchain
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('address')
      .eq('id', order.assigned_wallet_id)
      .single()

    if (wallet && wallet.address) {
      console.log('[Verify Payment] Auto-syncing transactions from blockchain...')
      
      // Auto-sync transactions from Etherscan
      const etherscanApiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'
      
      try {
        // Sync ETH transactions
        const ethTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${wallet.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${etherscanApiKey}`
        const ethTxResponse = await fetch(ethTxUrl)
        const ethTxData = await ethTxResponse.json()

        if (Array.isArray(ethTxData.result) && ethTxData.result.length > 0) {
          for (const tx of ethTxData.result.slice(0, 10)) {
            // Check if transaction already exists
            const { data: existing } = await supabase
              .from('wallet_transactions')
              .select('id')
              .eq('tx_hash', tx.hash)
              .single()

            if (!existing) {
              const type = tx.to.toLowerCase() === wallet.address.toLowerCase() ? 'incoming' : 'outgoing'
              const amount = ethers.formatEther(tx.value)

              await supabase
                .from('wallet_transactions')
                .insert({
                  wallet_id: order.assigned_wallet_id,
                  tx_hash: tx.hash,
                  type: type,
                  from_address: tx.from,
                  to_address: tx.to,
                  amount: amount,
                  currency: 'ETH',
                  status: tx.isError === '0' ? 'confirmed' : 'failed',
                  block_number: parseInt(tx.blockNumber),
                  created_at: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
                })
              
              console.log(`[Verify Payment] Synced new ETH transaction: ${tx.hash.substring(0, 10)} - ${amount} ETH`)
            }
          }
        }

        // Sync USDC (ERC-20) transactions
        const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        const usdcTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${usdcAddress}&address=${wallet.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${etherscanApiKey}`
        const usdcTxResponse = await fetch(usdcTxUrl)
        const usdcTxData = await usdcTxResponse.json()

        if (Array.isArray(usdcTxData.result) && usdcTxData.result.length > 0) {
          for (const tx of usdcTxData.result.slice(0, 10)) {
            // Check if transaction already exists
            const { data: existing } = await supabase
              .from('wallet_transactions')
              .select('id')
              .eq('tx_hash', tx.hash)
              .single()

            if (!existing) {
              const type = tx.to.toLowerCase() === wallet.address.toLowerCase() ? 'incoming' : 'outgoing'
              const amount = ethers.formatUnits(tx.value, 6) // USDC has 6 decimals

              await supabase
                .from('wallet_transactions')
                .insert({
                  wallet_id: order.assigned_wallet_id,
                  tx_hash: tx.hash,
                  type: type,
                  from_address: tx.from,
                  to_address: tx.to,
                  amount: amount,
                  currency: 'USDC',
                  status: 'confirmed',
                  block_number: parseInt(tx.blockNumber),
                  created_at: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
                })
              
              console.log(`[Verify Payment] Synced new USDC transaction: ${tx.hash.substring(0, 10)} - ${amount} USDC`)
            }
          }
        }
      } catch (syncError: any) {
        console.error('[Verify Payment] Auto-sync error (continuing anyway):', syncError.message)
        // Continue with verification even if sync fails
      }
    }

    // Get wallet transactions after payment was initiated
    const { data: transactions, error: txError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', order.assigned_wallet_id)
      .eq('type', 'incoming')
      .eq('currency', order.expected_payment_currency)
      .eq('status', 'confirmed')
      .gte('created_at', order.payment_initiated_at)
      .order('created_at', { ascending: false })

    if (txError) {
      console.error('Error fetching transactions:', txError)
      return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
    }

    console.log(`[Verify Payment] Found ${transactions?.length || 0} incoming transactions to check`)

    // Look for matching transaction with currency-specific precision
    const expectedAmount = parseFloat(order.expected_payment_amount)
    const isUSDC = order.expected_payment_currency === 'USDC'
    const precision = isUSDC ? 2 : 5 // USDC uses 2 decimals, ETH uses 5
    const tolerance = isUSDC ? 0.01 : 0.00001 // $0.01 for USDC, 0.00001 ETH for ETH

    const matchingTx = transactions?.find(tx => {
      // Round both to appropriate decimal places based on currency
      const txAmount = parseFloat(parseFloat(tx.amount).toFixed(precision))
      const expectedRounded = parseFloat(expectedAmount.toFixed(precision))
      const difference = Math.abs(txAmount - expectedRounded)
      
      console.log(`   Checking tx ${tx.tx_hash.substring(0, 10)}: ${txAmount} ${tx.currency} vs ${expectedRounded} (diff: ${difference})`)
      
      // Match if within tolerance
      return difference < tolerance
    })

    if (matchingTx) {
      console.log(`[Verify Payment] Payment verified! Transaction: ${matchingTx.tx_hash}`)

      // Update order to paid status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_date: matchingTx.created_at,
          payment_verified_at: new Date().toISOString(),
          transaction_hash: matchingTx.tx_hash
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
      }

      // Create notification for customer about order confirmation
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            customer_id: order.customer_id,
            type: 'order_update',
            title: `Order #${order.order_number} - Payment Confirmed`,
            message: `Your payment of ${matchingTx.amount} ${matchingTx.currency} has been confirmed! Your order is now being processed.`,
            order_id: orderId,
            read: false,
            created_at: new Date().toISOString()
          })
        
        console.log(`[Verify Payment] Created notification for customer about order ${order.order_number}`)
      } catch (notifError) {
        console.error('[Verify Payment] Failed to create notification (continuing):', notifError)
        // Don't fail the payment verification if notification fails
      }

      // Save customer wallet address to their profile for future refunds/credits
      if (matchingTx.from_address && order.customer_id) {
        try {
          // Get current customer data
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('wallet_addresses')
            .eq('id', order.customer_id)
            .single()

          if (!customerError && customer) {
            const walletAddresses = customer.wallet_addresses || []
            
            // Check if address already exists
            const addressExists = walletAddresses.some(
              (entry: any) => entry.address.toLowerCase() === matchingTx.from_address.toLowerCase()
            )

            let updatedAddresses
            if (addressExists) {
              // Update existing address with latest usage
              updatedAddresses = walletAddresses.map((entry: any) =>
                entry.address.toLowerCase() === matchingTx.from_address.toLowerCase()
                  ? {
                      ...entry,
                      last_used: new Date().toISOString(),
                      last_order_id: orderId
                    }
                  : entry
              )
            } else {
              // Add new address
              updatedAddresses = [
                ...walletAddresses,
                {
                  address: matchingTx.from_address,
                  first_used: new Date().toISOString(),
                  last_used: new Date().toISOString(),
                  first_order_id: orderId,
                  last_order_id: orderId
                }
              ]
            }

            // Update customer with new wallet addresses
            await supabase
              .from('customers')
              .update({ wallet_addresses: updatedAddresses })
              .eq('id', order.customer_id)
            
            console.log(`[Verify Payment] Saved customer wallet address: ${matchingTx.from_address}`)
          }
        } catch (walletError) {
          console.error('[Verify Payment] Failed to save wallet address (continuing):', walletError)
          // Don't fail the payment verification if wallet save fails
        }
      }

      return NextResponse.json({
        verified: true,
        status: 'paid',
        transactionHash: matchingTx.tx_hash,
        amount: matchingTx.amount,
        currency: matchingTx.currency,
        fromAddress: matchingTx.from_address,
        message: 'Payment successfully verified'
      })
    } else {
      console.log('[Verify Payment] No matching transaction found yet')
      return NextResponse.json({
        verified: false,
        status: 'pending',
        message: 'Payment not yet received. Please wait for blockchain confirmation.',
        checkedTransactions: transactions?.length || 0
      })
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
