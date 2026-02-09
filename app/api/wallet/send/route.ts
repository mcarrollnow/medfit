import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'
import crypto from 'crypto'
import { ethers } from 'ethers'
import bcrypt from 'bcryptjs'

// ERC-20 Token addresses on Ethereum mainnet
const TOKEN_ADDRESSES: Record<string, string> = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
}

// Token decimals
const TOKEN_DECIMALS: Record<string, number> = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18
}

// ERC-20 transfer ABI
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)'
]

// Decrypt data using AES-256-GCM
function decryptData(encrypted: string, iv: string, authTag: string): string {
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
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { 
      walletId,
      toAddress,
      amount,
      currency = 'ETH',
      pin,
      password
    } = body

    // Validate required fields
    if (!walletId || !toAddress || !amount) {
      return NextResponse.json({ 
        error: 'Wallet ID, recipient address, and amount are required' 
      }, { status: 400 })
    }

    // Validate Ethereum address
    if (!ethers.isAddress(toAddress)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 })
    }

    // Validate amount
    const sendAmount = parseFloat(amount)
    if (isNaN(sendAmount) || sendAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Use service role client
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get wallet with encrypted private key
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('*')
      .eq('id', walletId)
      .eq('is_active', true)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Verify security credentials
    if (wallet.pin_hash && !pin) {
      return NextResponse.json({ error: 'PIN required for this wallet' }, { status: 401 })
    }

    if (wallet.pin_hash && pin) {
      const pinValid = await bcrypt.compare(pin, wallet.pin_hash)
      if (!pinValid) {
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
      }
    }

    if (wallet.password_hash && !password) {
      return NextResponse.json({ error: 'Password required for this wallet' }, { status: 401 })
    }

    if (wallet.password_hash && password) {
      const passwordValid = await bcrypt.compare(password, wallet.password_hash)
      if (!passwordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }

    // Decrypt private key
    if (!wallet.encrypted_private_key || !wallet.private_key_iv || !wallet.private_key_auth_tag) {
      return NextResponse.json({ error: 'Wallet has no private key' }, { status: 400 })
    }

    const privateKey = decryptData(
      wallet.encrypted_private_key,
      wallet.private_key_iv,
      wallet.private_key_auth_tag
    )

    // Create provider and wallet signer
    const provider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
    
    const signer = new ethers.Wallet(privateKey, provider)

    let tx: ethers.TransactionResponse

    if (currency === 'ETH') {
      // Send ETH
      const amountWei = ethers.parseEther(amount.toString())
      
      // Check balance
      const balance = await provider.getBalance(wallet.address)
      if (balance < amountWei) {
        return NextResponse.json({ error: 'Insufficient ETH balance' }, { status: 400 })
      }

      // Estimate gas
      const gasEstimate = await provider.estimateGas({
        to: toAddress,
        value: amountWei
      })

      // Get current gas price
      const feeData = await provider.getFeeData()
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei')

      tx = await signer.sendTransaction({
        to: toAddress,
        value: amountWei,
        gasLimit: gasEstimate,
        gasPrice
      })

    } else {
      // Send ERC-20 token
      const tokenAddress = TOKEN_ADDRESSES[currency]
      if (!tokenAddress) {
        return NextResponse.json({ error: `Unsupported token: ${currency}` }, { status: 400 })
      }

      const decimals = TOKEN_DECIMALS[currency] || 18
      const amountUnits = ethers.parseUnits(amount.toString(), decimals)

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)

      // Check token balance
      const tokenBalance = await tokenContract.balanceOf(wallet.address)
      if (tokenBalance < amountUnits) {
        return NextResponse.json({ error: `Insufficient ${currency} balance` }, { status: 400 })
      }

      tx = await tokenContract.transfer(toAddress, amountUnits)
    }

    // Wait for transaction to be mined
    console.log(`[Wallet Send] Transaction sent: ${tx.hash}`)

    // Store transaction in database
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: walletId,
        tx_hash: tx.hash,
        from_address: wallet.address,
        to_address: toAddress,
        amount: amount.toString(),
        currency,
        type: 'outgoing',
        status: 'pending'
      })

    if (txError) {
      console.error('[Wallet Send] Error storing transaction:', txError)
    }

    return NextResponse.json({
      success: true,
      transaction: {
        hash: tx.hash,
        from: wallet.address,
        to: toAddress,
        amount,
        currency,
        status: 'pending'
      }
    })

  } catch (error: any) {
    console.error('Error sending transaction:', error)
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ error: 'Insufficient funds for gas' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to send transaction',
      details: error.message 
    }, { status: 500 })
  }
}

