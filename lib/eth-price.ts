/**
 * Fetch current ETH price in USD with automatic fallback
 * Tries CoinGecko first (no geo-restrictions), falls back to Binance
 */
export async function getEthPrice(): Promise<number> {
  // Try CoinGecko first (reliable, no geo-blocks)
  try {
    console.log('[ETH Price] Fetching from CoinGecko...')
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    const price = parseFloat(data.ethereum?.usd)
    
    if (!price || isNaN(price) || price <= 0) {
      throw new Error('Invalid price from CoinGecko')
    }
    
    console.log(`[ETH Price] CoinGecko: $${price}`)
    return price
  } catch (coinGeckoError: any) {
    console.error('[ETH Price] CoinGecko failed:', coinGeckoError.message)
    
    // Fallback to Binance
    try {
      console.log('[ETH Price] Trying Binance fallback...')
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
      const data = await response.json()
      
      // Binance returns error object when geo-blocked
      if (data.code !== undefined) {
        throw new Error(`Binance API error: ${data.msg}`)
      }
      
      const price = parseFloat(data.price)
      
      if (!price || isNaN(price) || price <= 0) {
        throw new Error('Invalid price from Binance')
      }
      
      console.log(`[ETH Price] Binance: $${price}`)
      return price
    } catch (binanceError: any) {
      console.error('[ETH Price] Binance failed:', binanceError.message)
      throw new Error('Failed to fetch ETH price from all sources')
    }
  }
}

/**
 * Convert USD to Wei (smallest ETH unit)
 */
export function usdToWei(usdAmount: number, ethPrice: number): string {
  const ethAmount = usdAmount / ethPrice
  const weiAmount = Math.floor(ethAmount * 1e18) // 1 ETH = 10^18 Wei
  return weiAmount.toString()
}
