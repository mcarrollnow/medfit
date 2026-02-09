import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { ethers } from 'ethers'

// Decrypt private key using AES-256-GCM
function decryptPrivateKey(encrypted: string, iv: string, authTag: string): string {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production'
  const algorithm = 'aes-256-gcm'
  
  const key = crypto.createHash('sha256').update(encryptionKey).digest()
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id
    const body = await request.json()
    const { 
      walletId, 
      orderId,
      amount,
      currency,
      pin, 
      password,
      webAuthnVerified // Flag from client if WebAuthn was verified
    } = body

    if (!walletId || !orderId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // customers.user_id references public.users.id (profile id)
    console.log('[WalletPay] Looking up customer for user_id:', userId)

    // Get customer by public.users.id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      console.error('[WalletPay] Customer not found for user_id:', userId, customerError)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    console.log('[WalletPay] Found customer:', customer.id)

    // Get wallet - MUST belong to this customer
    console.log('[WalletPay] Looking up wallet:', walletId, 'for customer:', customer.id)
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select(`
        id, 
        customer_id,
        address, 
        currency,
        pin_hash, 
        password_hash, 
        biometric_enabled, 
        hardware_key_enabled,
        encrypted_private_key,
        private_key_iv,
        private_key_auth_tag
      `)
      .eq('id', walletId)
      .eq('customer_id', customer.id)  // STRICT: wallet MUST belong to this customer
      .single()

    if (walletError || !wallet) {
      console.error('[WalletPay] Wallet not found or access denied:', walletId, walletError)
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    console.log('[WalletPay] Found wallet:', wallet.id, 'currency:', wallet.currency)

    // Security verification
    let securityVerified = false
    let verificationMethod = ''

    // Verify PIN if provided
    if (wallet.pin_hash && pin) {
      const isValidPin = await bcrypt.compare(pin, wallet.pin_hash)
      if (isValidPin) {
        securityVerified = true
        verificationMethod = 'pin'
      }
    }

    // Verify password if provided
    if (!securityVerified && wallet.password_hash && password) {
      const isValidPassword = await bcrypt.compare(password, wallet.password_hash)
      if (isValidPassword) {
        securityVerified = true
        verificationMethod = 'password'
      }
    }

    // WebAuthn verification (biometric/hardware key) - verified client-side
    if (!securityVerified && (wallet.biometric_enabled || wallet.hardware_key_enabled) && webAuthnVerified) {
      securityVerified = true
      verificationMethod = wallet.biometric_enabled ? 'biometric' : 'hardware_key'
    }

    if (!securityVerified) {
      console.error('[WalletPay] Security verification failed for wallet:', walletId)
      return NextResponse.json({ error: 'Security verification failed' }, { status: 401 })
    }

    console.log('[WalletPay] Security verified via:', verificationMethod)

    // Get the order to verify amount and status
    console.log('[WalletPay] Looking up order:', orderId)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, payment_status, customer_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('[WalletPay] Order not found:', orderId, orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('[WalletPay] Found order:', order.id, 'customer:', order.customer_id, 'amount:', order.total_amount)

    // Verify order belongs to this customer
    if (order.customer_id !== customer.id) {
      console.error('[WalletPay] Order customer mismatch:', order.customer_id, '!==', customer.id)
      return NextResponse.json({ error: 'Order does not belong to this customer' }, { status: 403 })
    }

    // Verify order is pending payment
    if (order.payment_status !== 'pending' && order.payment_status !== 'new') {
      console.error('[WalletPay] Order not pending:', order.payment_status)
      return NextResponse.json({ error: 'Order is not pending payment' }, { status: 400 })
    }

    // Verify amount matches (using total_amount column)
    if (Math.abs(parseFloat(amount) - parseFloat(order.total_amount)) > 0.01) {
      console.error('[WalletPay] Amount mismatch:', amount, '!==', order.total_amount)
      return NextResponse.json({ error: 'Amount does not match order total' }, { status: 400 })
    }

    // Get a business wallet to receive the payment
    const { data: businessWallet, error: bizWalletError } = await supabase
      .from('business_wallets')
      .select('id, address, label')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (bizWalletError || !businessWallet) {
      console.error('[WalletPay] No active business wallet found:', bizWalletError)
      return NextResponse.json({ error: 'Payment system temporarily unavailable' }, { status: 503 })
    }

    console.log('[WalletPay] Sending to business wallet:', businessWallet.address)

    // Decrypt the customer's private key
    if (!wallet.encrypted_private_key || !wallet.private_key_iv || !wallet.private_key_auth_tag) {
      console.error('[WalletPay] Wallet missing encryption data')
      return NextResponse.json({ error: 'Wallet configuration error' }, { status: 500 })
    }

    let privateKey: string
    try {
      privateKey = decryptPrivateKey(
        wallet.encrypted_private_key,
        wallet.private_key_iv,
        wallet.private_key_auth_tag
      )
      // Don't log private key operations in detail
    } catch (decryptError) {
      console.error('[WalletPay] Wallet access failed')
      return NextResponse.json({ error: 'Failed to access wallet' }, { status: 500 })
    }

    // Get ETH price for conversion
    let ethPrice = 3000 // Default fallback
    try {
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      const priceData = await priceResponse.json()
      ethPrice = priceData.ethereum?.usd || 3000
      console.log('[WalletPay] Current ETH price:', ethPrice)
    } catch (priceError) {
      console.error('[WalletPay] Failed to fetch ETH price, using fallback:', priceError)
    }

    // Convert USD amount to ETH
    const usdAmount = parseFloat(amount)
    const ethAmount = usdAmount / ethPrice
    const ethAmountStr = ethAmount.toFixed(8)
    console.log('[WalletPay] Converting $', usdAmount, 'to', ethAmountStr, 'ETH')

    // Create ethers wallet and provider
    const provider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo'
    )
    const customerWallet = new ethers.Wallet(privateKey, provider)

    // Generate payment reference
    const paymentRef = `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    // Sign and broadcast the transaction
    let transactionHash: string
    try {
      console.log('[WalletPay] Preparing transaction...')
      
      // Get current gas price
      const feeData = await provider.getFeeData()
      
      const tx = {
        to: businessWallet.address,
        value: ethers.parseEther(ethAmountStr),
        gasLimit: 21000, // Standard ETH transfer
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      }

      console.log('[WalletPay] Signing transaction...')
      const signedTx = await customerWallet.sendTransaction(tx)
      transactionHash = signedTx.hash
      
      console.log('[WalletPay] Transaction broadcast! Hash:', transactionHash)
    } catch (txError: any) {
      console.error('[WalletPay] Transaction failed:', txError.message)
      
      // Check for insufficient funds
      if (txError.message?.includes('insufficient funds')) {
        return NextResponse.json({ 
          error: 'Insufficient wallet balance for this payment',
          details: 'Please add funds to your wallet'
        }, { status: 400 })
      }
      
      return NextResponse.json({ error: 'Transaction failed: ' + txError.message }, { status: 500 })
    }

    // Record the payment attempt with transaction hash
    const { error: txRecordError } = await supabase
      .from('customer_wallet_transactions')
      .insert({
        wallet_id: walletId,
        type: 'payment',
        amount: ethAmountStr,
        currency: 'ETH',
        to_address: businessWallet.address,
        tx_hash: transactionHash,
        status: 'pending', // Will be confirmed by verify-payment
        reference: paymentRef,
        metadata: {
          order_id: orderId,
          customer_id: customer.id,
          verification_method: verificationMethod,
          usd_amount: usdAmount,
          eth_price: ethPrice,
          timestamp: new Date().toISOString()
        }
      })

    if (txRecordError) {
      console.error('[WalletPay] Error recording transaction:', txRecordError)
    }

    // Calculate gas fee in USD (gasLimit * maxFeePerGas)
    const gasFeeData = await provider.getFeeData()
    const gasLimit = BigInt(21000)
    const gasFeeWei = gasLimit * (gasFeeData.maxFeePerGas || BigInt(0))
    const gasFeeEth = ethers.formatEther(gasFeeWei)
    const gasFeeUsd = parseFloat(gasFeeEth) * ethPrice

    // Update order status to payment_processing (will be marked paid after blockchain confirmation)
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'payment_processing',
        payment_method: `wallet_${wallet.currency.toLowerCase()}`,
        payment_reference: paymentRef,
        transaction_hash: transactionHash,
        assigned_wallet_id: businessWallet.id,
        expected_payment_amount: ethAmountStr,
        expected_payment_currency: 'ETH',
        payment_initiated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_metadata: {
          from_wallet: wallet.address,
          to_wallet: businessWallet.address,
          eth_price: ethPrice,
          gas_fee_eth: gasFeeEth,
          gas_fee_usd: gasFeeUsd
        }
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('[WalletPay] Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Record in business wallet transactions
    await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: businessWallet.id,
        tx_hash: transactionHash,
        type: 'incoming',
        from_address: wallet.address,
        to_address: businessWallet.address,
        amount: ethAmountStr,
        currency: 'ETH',
        status: 'pending',
        created_at: new Date().toISOString()
      })

    // Get order number for response
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('order_number')
      .eq('id', orderId)
      .single()

    console.log('[WalletPay] Payment initiated successfully!')

    return NextResponse.json({
      success: true,
      paymentRef,
      transactionHash,
      message: 'Transaction broadcast to blockchain',
      orderId,
      orderNumber: updatedOrder?.order_number,
      amount: usdAmount,
      ethAmount: ethAmountStr,
      ethPrice,
      fromAddress: wallet.address,
      toAddress: businessWallet.address,
      verificationMethod,
      paymentStatus: 'processing'
    })

  } catch (error) {
    console.error('Error processing wallet payment:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}

