import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import crypto from 'crypto'
import { ethers } from 'ethers'

// Token configurations for EVM chains
const TOKEN_CONFIGS: Record<string, { address: string; decimals: number }> = {
  'ETH': { address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  'USDC': { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  'USDT': { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  'DAI': { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  'MATIC': { address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18 },
  'ARB': { address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', decimals: 18 },
  'OP': { address: '0x4200000000000000000000000000000042', decimals: 18 }
}

const EVM_CHAINS = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP']

// Decrypt data using AES-256-GCM
function decryptData(encrypted: string, iv: string, authTag: string): string {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production'
  const algorithm = 'aes-256-gcm'
  
  const key = crypto.createHash('sha256').update(encryptionKey).digest()
  const ivBuffer = Buffer.from(iv, 'hex')
  const authTagBuffer = Buffer.from(authTag, 'hex')
  
  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer)
  decipher.setAuthTag(authTagBuffer)
  
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
    const { walletId, toAddress, amount } = body

    // Validate required fields
    if (!walletId || !toAddress || !amount) {
      return NextResponse.json({ 
        error: 'Wallet ID, recipient address, and amount are required' 
      }, { status: 400 })
    }

    // Validate amount
    const sendAmount = parseFloat(amount)
    if (isNaN(sendAmount) || sendAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get customer by user ID
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get wallet - user is already authenticated via session
    // Wallet ownership is verified by customer_id match
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select('*')
      .eq('id', walletId)
      .eq('customer_id', customer.id)
      .eq('is_active', true)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Check if private key is stored
    if (!wallet.encrypted_private_key || !wallet.private_key_iv || !wallet.private_key_auth_tag) {
      return NextResponse.json({ 
        error: 'This wallet cannot send transactions. Private key not stored.',
        details: 'Please re-import this wallet with its private key to enable sending.'
      }, { status: 400 })
    }

    // Only support EVM chains for now
    if (!EVM_CHAINS.includes(wallet.currency)) {
      return NextResponse.json({ 
        error: `Sending ${wallet.currency} is not yet supported. EVM chains only.` 
      }, { status: 400 })
    }

    // Decrypt private key
    let decryptedPrivateKey: string
    try {
      decryptedPrivateKey = decryptData(
        wallet.encrypted_private_key,
        wallet.private_key_iv,
        wallet.private_key_auth_tag
      )
    } catch (decryptError) {
      console.error('[WalletSend] Wallet access failed')
      return NextResponse.json({ error: 'Failed to decrypt wallet' }, { status: 500 })
    }

    // Get RPC provider
    const rpcUrl = process.env.ETH_RPC_URL || process.env.VITE_ETH_RPC_URL || 'https://eth.llamarpc.com'
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // Test provider connection
    try {
      await provider.getBlockNumber()
    } catch (providerError: any) {
      console.error('RPC provider error:', providerError)
      return NextResponse.json({ 
        error: 'Failed to connect to blockchain network',
        details: providerError.message 
      }, { status: 500 })
    }

    // Create wallet instance
    const walletInstance = new ethers.Wallet(decryptedPrivateKey, provider)

    // Validate recipient address
    if (!ethers.isAddress(toAddress)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 })
    }

    const tokenConfig = TOKEN_CONFIGS[wallet.currency]
    if (!tokenConfig) {
      return NextResponse.json({ error: `Unsupported currency: ${wallet.currency}` }, { status: 400 })
    }

    let txHash: string

    if (wallet.currency === 'ETH') {
      // Send native ETH
      const amountInWei = ethers.parseEther(amount.toString())
      
      // Check ETH balance
      const balance = await provider.getBalance(wallet.address)
      
      // Get gas estimate
      const feeData = await provider.getFeeData()
      const gasLimit = BigInt(21000)
      const estimatedGas = gasLimit * (feeData.gasPrice || BigInt(0))
      const totalRequired = amountInWei + estimatedGas

      if (balance < totalRequired) {
        return NextResponse.json({ 
          error: 'Insufficient balance',
          details: `Need ${ethers.formatEther(totalRequired)} ETH (including gas), have ${ethers.formatEther(balance)} ETH`
        }, { status: 400 })
      }

      // Send transaction
      const tx = await walletInstance.sendTransaction({
        to: toAddress,
        value: amountInWei,
        gasLimit,
        gasPrice: feeData.gasPrice
      })

      txHash = tx.hash
      console.log(`[Customer Wallet Send] ETH transaction sent: ${txHash}`)

    } else {
      // Send ERC-20 token
      const tokenABI = [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function balanceOf(address) view returns (uint256)'
      ]

      const tokenContract = new ethers.Contract(tokenConfig.address, tokenABI, walletInstance)
      const amountInSmallestUnit = ethers.parseUnits(amount.toString(), tokenConfig.decimals)

      // Check token balance
      const tokenBalance = await tokenContract.balanceOf(wallet.address)
      if (tokenBalance < amountInSmallestUnit) {
        return NextResponse.json({ 
          error: `Insufficient ${wallet.currency} balance`,
          details: `Need ${ethers.formatUnits(amountInSmallestUnit, tokenConfig.decimals)} ${wallet.currency}, have ${ethers.formatUnits(tokenBalance, tokenConfig.decimals)} ${wallet.currency}`
        }, { status: 400 })
      }

      // Check ETH for gas
      const ethBalance = await provider.getBalance(wallet.address)
      const feeData = await provider.getFeeData()
      const estimatedGas = BigInt(65000) * (feeData.gasPrice || BigInt(0)) // ERC-20 transfers use ~65k gas
      
      if (ethBalance < estimatedGas) {
        return NextResponse.json({ 
          error: 'Insufficient ETH for gas',
          details: `Need approximately ${ethers.formatEther(estimatedGas)} ETH for gas fees`
        }, { status: 400 })
      }

      // Send token
      const tx = await tokenContract.transfer(toAddress, amountInSmallestUnit)
      txHash = tx.hash
      console.log(`[Customer Wallet Send] ${wallet.currency} transaction sent: ${txHash}`)
    }

    // Record transaction in database (as pending)
    try {
      const { error: txRecordError } = await supabase
        .from('customer_wallet_transactions')
        .insert({
          customer_wallet_id: walletId,
          tx_hash: txHash,
          type: 'withdrawal',
          from_address: wallet.address,
          to_address: toAddress,
          amount: sendAmount,
          currency: wallet.currency,
          status: 'pending'
        })
      
      if (txRecordError) {
        console.error('Error recording transaction:', txRecordError)
      }
    } catch (recordError) {
      // Don't fail the transaction if recording fails
      console.error('Error recording transaction:', recordError)
    }

    return NextResponse.json({
      success: true,
      txHash,
      message: `Successfully sent ${amount} ${wallet.currency} to ${toAddress}`,
      explorerUrl: `https://etherscan.io/tx/${txHash}`
    })

  } catch (error: any) {
    console.error('Error sending transaction:', error)
    
    // Handle specific ethers errors
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ 
        error: 'Insufficient funds for gas',
        details: 'Your wallet does not have enough ETH to pay for the transaction gas fees.'
      }, { status: 400 })
    }
    
    if (error.code === 'NONCE_EXPIRED') {
      return NextResponse.json({ 
        error: 'Transaction nonce expired',
        details: 'Please try again.'
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to send transaction',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

