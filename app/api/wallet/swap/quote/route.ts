import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import { ethers } from 'ethers'

// Uniswap V3 Quoter contract address (mainnet)
const UNISWAP_QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

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

// Quoter ABI (minimal)
const QUOTER_ABI = [
  'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)'
]

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { walletId, fromToken, toToken, amount, slippage } = await request.json()

    if (!walletId || !fromToken || !toToken || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (fromToken === toToken) {
      return NextResponse.json({ error: 'Cannot swap same token' }, { status: 400 })
    }

    const tokenIn = TOKEN_ADDRESSES[fromToken]
    const tokenOut = TOKEN_ADDRESSES[toToken]
    
    if (!tokenIn || !tokenOut) {
      return NextResponse.json({ error: 'Unsupported token' }, { status: 400 })
    }

    // Connect to Ethereum mainnet
    const provider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )

    // Parse amount with correct decimals
    const decimalsIn = TOKEN_DECIMALS[fromToken]
    const decimalsOut = TOKEN_DECIMALS[toToken]
    const amountIn = ethers.parseUnits(amount, decimalsIn)

    // Create quoter contract instance
    const quoter = new ethers.Contract(UNISWAP_QUOTER_ADDRESS, QUOTER_ABI, provider)

    // Get quote - try different fee tiers
    const feeTiers = [500, 3000, 10000] // 0.05%, 0.3%, 1%
    let bestQuote = BigInt(0)
    let bestFee = 3000

    for (const fee of feeTiers) {
      try {
        // Use staticCall to simulate the quote
        const quote = await quoter.quoteExactInputSingle.staticCall(
          tokenIn,
          tokenOut,
          fee,
          amountIn,
          0 // sqrtPriceLimitX96
        )
        
        if (quote > bestQuote) {
          bestQuote = quote
          bestFee = fee
        }
      } catch (e) {
        // This fee tier doesn't have liquidity, try next
        continue
      }
    }

    if (bestQuote === BigInt(0)) {
      return NextResponse.json({ 
        error: 'No liquidity available for this swap' 
      }, { status: 400 })
    }

    // Calculate output amount
    const amountOut = ethers.formatUnits(bestQuote, decimalsOut)

    // Estimate gas (approximate)
    const gasEstimate = '0.005' // ~150k gas at 30 gwei

    // Calculate price impact (simplified)
    // In production, compare to spot price from pool
    const priceImpact = '0.1'

    // Route description
    const feePercent = bestFee / 10000
    const route = `${fromToken} → ${toToken} (${feePercent}% pool)`

    return NextResponse.json({
      success: true,
      amountOut,
      priceImpact,
      gasEstimate,
      route,
      fee: bestFee
    })

  } catch (error: any) {
    console.error('Swap quote error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get quote' 
    }, { status: 500 })
  }
}

