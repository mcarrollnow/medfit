import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Fetch transaction history from Etherscan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const currency = searchParams.get('currency')

    if (!address || !currency) {
      return NextResponse.json({ error: 'Missing address or currency' }, { status: 400 })
    }

    const transactions: any[] = []
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'

    // Only fetch for EVM-compatible chains
    const evmChains = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP']
    if (!evmChains.includes(currency)) {
      // For non-EVM chains, return empty (would need specific APIs)
      return NextResponse.json({ success: true, transactions: [] })
    }

    try {
      // Fetch ETH transactions
      if (currency === 'ETH') {
        const ethTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey}`
        
        const ethTxResponse = await fetch(ethTxUrl)
        const ethTxData = await ethTxResponse.json()

        if (Array.isArray(ethTxData.result) && ethTxData.result.length > 0) {
          for (const tx of ethTxData.result.slice(0, 20)) {
            const type = tx.to.toLowerCase() === address.toLowerCase() ? 'incoming' : 'outgoing'
            const amount = ethers.formatEther(tx.value)
            
            // Skip zero value transactions
            if (parseFloat(amount) === 0) continue

            transactions.push({
              hash: tx.hash,
              type,
              amount,
              currency: 'ETH',
              from: tx.from,
              to: tx.to,
              timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
              status: tx.isError === '0' ? 'confirmed' : 'failed',
              blockNumber: parseInt(tx.blockNumber)
            })
          }
        }
      }

      // Fetch USDC (ERC-20) transactions
      if (currency === 'USDC' || currency === 'ETH') {
        const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        const usdcTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${usdcAddress}&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey}`
        
        const usdcTxResponse = await fetch(usdcTxUrl)
        const usdcTxData = await usdcTxResponse.json()

        if (Array.isArray(usdcTxData.result) && usdcTxData.result.length > 0) {
          for (const tx of usdcTxData.result.slice(0, 20)) {
            const type = tx.to.toLowerCase() === address.toLowerCase() ? 'incoming' : 'outgoing'
            const amount = ethers.formatUnits(tx.value, 6) // USDC has 6 decimals

            transactions.push({
              hash: tx.hash,
              type,
              amount,
              currency: 'USDC',
              from: tx.from,
              to: tx.to,
              timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
              status: 'confirmed',
              blockNumber: parseInt(tx.blockNumber)
            })
          }
        }
      }

      // Fetch USDT (ERC-20) transactions
      if (currency === 'USDT' || currency === 'ETH') {
        const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        const usdtTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${usdtAddress}&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey}`
        
        const usdtTxResponse = await fetch(usdtTxUrl)
        const usdtTxData = await usdtTxResponse.json()

        if (Array.isArray(usdtTxData.result) && usdtTxData.result.length > 0) {
          for (const tx of usdtTxData.result.slice(0, 20)) {
            const type = tx.to.toLowerCase() === address.toLowerCase() ? 'incoming' : 'outgoing'
            const amount = ethers.formatUnits(tx.value, 6) // USDT has 6 decimals

            transactions.push({
              hash: tx.hash,
              type,
              amount,
              currency: 'USDT',
              from: tx.from,
              to: tx.to,
              timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
              status: 'confirmed',
              blockNumber: parseInt(tx.blockNumber)
            })
          }
        }
      }

      // Sort by timestamp descending
      transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    } catch (apiError) {
      console.error('Etherscan API error:', apiError)
    }

    return NextResponse.json({ 
      success: true, 
      transactions: transactions.slice(0, 20) // Limit to 20 most recent
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

