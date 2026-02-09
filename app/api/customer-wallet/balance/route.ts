import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Simple balance checker for different chains
// Note: For production, you'd want to use proper RPC endpoints with API keys

const RPC_ENDPOINTS: Record<string, string> = {
  ETH: 'https://eth.llamarpc.com',
  MATIC: 'https://polygon-rpc.com',
  ARB: 'https://arb1.arbitrum.io/rpc',
  OP: 'https://mainnet.optimism.io',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const currency = searchParams.get('currency')

    if (!address || !currency) {
      return NextResponse.json({ error: 'Missing address or currency' }, { status: 400 })
    }

    // For EVM chains, fetch real balance
    const rpc = RPC_ENDPOINTS[currency]
    if (rpc) {
      try {
        const provider = new ethers.JsonRpcProvider(rpc)
        const balance = await provider.getBalance(address)
        return NextResponse.json({ 
          success: true, 
          balance: ethers.formatEther(balance),
          currency 
        })
      } catch (err) {
        console.error('RPC error:', err)
        return NextResponse.json({ success: true, balance: '0', currency })
      }
    }

    // For non-EVM chains, return 0 (would need specific APIs)
    return NextResponse.json({ success: true, balance: '0', currency })
  } catch (error) {
    console.error('Balance check error:', error)
    return NextResponse.json({ error: 'Failed to check balance' }, { status: 500 })
  }
}

