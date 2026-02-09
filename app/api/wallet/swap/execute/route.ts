import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import { ethers } from 'ethers'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Uniswap V3 Router contract address (mainnet)
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

// Token addresses (mainnet)
const TOKEN_ADDRESSES: Record<string, string> = {
  ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EescdeCB5E4fECf'
}

const TOKEN_DECIMALS: Record<string, number> = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18
}

// Router ABI (minimal)
const ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
]

// ERC20 ABI for approvals
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)'
]

// Decrypt private key
function decryptPrivateKey(encrypted: string, iv: string, authTag: string): string {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production'
  const key = crypto.createHash('sha256').update(encryptionKey).digest()
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'))
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

    const { walletId, fromToken, toToken, amount, minAmountOut, slippage, pin, password } = await request.json()

    if (!walletId || !fromToken || !toToken || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get wallet from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('*')
      .eq('id', walletId)
      .eq('is_active', true)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Verify PIN if required
    if (wallet.pin_hash && pin) {
      const pinValid = await bcrypt.compare(pin, wallet.pin_hash)
      if (!pinValid) {
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
      }
    }

    // Verify password if required
    if (wallet.password_hash && password) {
      const passwordValid = await bcrypt.compare(password, wallet.password_hash)
      if (!passwordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }

    // Decrypt private key
    if (!wallet.encrypted_private_key || !wallet.private_key_iv || !wallet.private_key_auth_tag) {
      return NextResponse.json({ error: 'Wallet private key not available' }, { status: 400 })
    }

    const privateKey = decryptPrivateKey(
      wallet.encrypted_private_key,
      wallet.private_key_iv,
      wallet.private_key_auth_tag
    )

    // Connect to Ethereum
    const provider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
    
    const signer = new ethers.Wallet(privateKey, provider)

    const tokenIn = TOKEN_ADDRESSES[fromToken]
    const tokenOut = TOKEN_ADDRESSES[toToken]
    const decimalsIn = TOKEN_DECIMALS[fromToken]
    const decimalsOut = TOKEN_DECIMALS[toToken]
    
    const amountIn = ethers.parseUnits(amount, decimalsIn)
    const slippageBps = Math.floor(parseFloat(slippage || '0.5') * 100)
    const amountOutMin = ethers.parseUnits(minAmountOut, decimalsOut) * BigInt(10000 - slippageBps) / BigInt(10000)

    // If not swapping from ETH, need to approve token first
    let txHash: string
    
    if (fromToken !== 'ETH') {
      const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer)
      
      // Check current allowance
      const allowance = await tokenContract.allowance(wallet.address, UNISWAP_ROUTER_ADDRESS)
      
      if (allowance < amountIn) {
        // Approve router to spend tokens
        console.log('Approving token spend...')
        const approveTx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, amountIn)
        await approveTx.wait()
        console.log('Approval confirmed')
      }
    }

    // Execute swap
    const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, ROUTER_ABI, signer)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

    const swapParams = {
      tokenIn: fromToken === 'ETH' ? TOKEN_ADDRESSES.WETH : tokenIn,
      tokenOut,
      fee: 3000, // 0.3% pool
      recipient: wallet.address,
      deadline,
      amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0
    }

    let tx
    if (fromToken === 'ETH') {
      // Swap ETH -> Token (send ETH with transaction)
      tx = await router.exactInputSingle(swapParams, { value: amountIn })
    } else {
      // Swap Token -> Token or Token -> ETH
      tx = await router.exactInputSingle(swapParams)
    }

    console.log('Swap transaction sent:', tx.hash)
    const receipt = await tx.wait()
    console.log('Swap confirmed in block:', receipt.blockNumber)

    // Log the transaction
    await supabase.from('wallet_transactions').insert({
      wallet_id: walletId,
      transaction_hash: tx.hash,
      transaction_type: 'swap',
      amount: parseFloat(amount),
      currency: fromToken,
      from_address: wallet.address,
      to_address: UNISWAP_ROUTER_ADDRESS,
      status: 'confirmed',
      notes: `Swapped ${amount} ${fromToken} to ${toToken}`
    })

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber
    })

  } catch (error: any) {
    console.error('Swap execute error:', error)
    
    // Handle specific errors
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ error: 'Insufficient balance for swap and gas' }, { status: 400 })
    }
    
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return NextResponse.json({ error: 'Swap would fail - check amounts and liquidity' }, { status: 400 })
    }

    return NextResponse.json({ 
      error: error.message || 'Swap failed' 
    }, { status: 500 })
  }
}

