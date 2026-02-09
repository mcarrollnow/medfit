import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
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
  DAI: '0x6B175474E89094C44Da98b954EescdeCB5E4fECf',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  ARB: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  OP: '0x4200000000000000000000000000000000000042'
}

const TOKEN_DECIMALS: Record<string, number> = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ARB: 18,
  OP: 18
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
    // Verify customer authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.customerId) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { walletId, fromToken, toToken, amount, minAmountOut, slippage, fee, pin, password } = await request.json()

    if (!walletId || !fromToken || !toToken || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get wallet from database - ensure it belongs to this customer
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select('*')
      .eq('id', walletId)
      .eq('customer_id', authResult.customerId)
      .eq('is_active', true)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Verify PIN if wallet has one
    if (wallet.pin_hash) {
      if (!pin) {
        return NextResponse.json({ error: 'PIN required' }, { status: 401 })
      }
      const pinValid = await bcrypt.compare(pin, wallet.pin_hash)
      if (!pinValid) {
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
      }
    }

    // Verify password if wallet has one and no PIN
    if (wallet.password_hash && !wallet.pin_hash) {
      if (!password) {
        return NextResponse.json({ error: 'Password required' }, { status: 401 })
      }
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
      process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    )

    const signer = new ethers.Wallet(privateKey, provider)

    const tokenIn = TOKEN_ADDRESSES[fromToken]
    const tokenOut = TOKEN_ADDRESSES[toToken]
    const decimalsIn = TOKEN_DECIMALS[fromToken]
    const decimalsOut = TOKEN_DECIMALS[toToken]

    if (!tokenIn || !tokenOut) {
      return NextResponse.json({ error: 'Unsupported token pair' }, { status: 400 })
    }

    const amountIn = ethers.parseUnits(amount, decimalsIn)
    const slippageBps = Math.floor(parseFloat(slippage || '0.5') * 100)
    const amountOutMin = ethers.parseUnits(minAmountOut, decimalsOut) * BigInt(10000 - slippageBps) / BigInt(10000)

    // If not swapping from ETH, need to approve token first
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
      fee: fee || 3000, // Use the fee from quote or default 0.3%
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
    await supabase.from('customer_wallet_transactions').insert({
      customer_wallet_id: walletId,
      type: 'swap',
      amount: parseFloat(amount),
      currency: fromToken,
      tx_hash: tx.hash,
      status: 'confirmed',
      notes: `Swapped ${amount} ${fromToken} to ${toToken}`
    })

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://etherscan.io/tx/${tx.hash}`
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
