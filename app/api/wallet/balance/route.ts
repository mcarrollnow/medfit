import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'
import { ethers } from 'ethers'

// ERC-20 Token addresses on Ethereum mainnet
const TOKEN_ADDRESSES = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  ARB: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  OP: '0x4200000000000000000000000000000000000042'
}

// Token decimals
const TOKEN_DECIMALS = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ARB: 18,
  OP: 18
}

// Minimal ERC-20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)'
]

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    // Validate Ethereum address
    if (!ethers.isAddress(address)) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Create provider (you can use Infura, Alchemy, or other providers)
    const provider = new ethers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID || 'YOUR_INFURA_ID'}`
    )

    const balances: Record<string, string> = {}

    try {
      // Get ETH balance
      console.log('[Balance] Fetching ETH balance for:', address)
      const ethBalance = await provider.getBalance(address)
      balances.ETH = ethers.formatEther(ethBalance)

      // Get ERC-20 token balances
      for (const [token, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
        try {
          console.log(`[Balance] Fetching ${token} balance...`)
          const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
          const balance = await contract.balanceOf(address)
          const decimals = TOKEN_DECIMALS[token as keyof typeof TOKEN_DECIMALS]
          balances[token] = ethers.formatUnits(balance, decimals)
        } catch (error) {
          console.error(`[Balance] Error fetching ${token} balance:`, error)
          balances[token] = '0'
        }
      }

      // Update wallet balance in database for quick access
      const { error: updateError } = await supabase
        .from('business_wallets')
        .update({
          balance_eth: balances.ETH,
          balance_usdc: balances.USDC
        })
        .eq('address', address)

      if (updateError) {
        console.error('[Balance] Error updating cached balances:', updateError)
        // Don't fail the request if cache update fails
      }

    } catch (error) {
      console.error('[Balance] Error fetching balances:', error)
      return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      address,
      balances,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
  }
}
