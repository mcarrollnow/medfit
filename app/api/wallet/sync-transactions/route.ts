import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()
    const { address } = body

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    // Get wallet by address
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('*')
      .eq('address', address)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    let newTransactions = 0

    // Sync from Etherscan
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'
    
    console.log('[Sync Transactions] Fetching transactions for address:', address)
    
    try {
      // Fetch ETH transactions using V2 API
      const ethTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey}`
      
      const ethTxResponse = await fetch(ethTxUrl)
      const ethTxData = await ethTxResponse.json()
      
      console.log('[Sync Transactions] ETH transactions API status:', ethTxData.status, ethTxData.message)
      console.log('[Sync Transactions] ETH transactions result type:', typeof ethTxData.result)
      console.log('[Sync Transactions] ETH transactions result:', Array.isArray(ethTxData.result) ? `Array with ${ethTxData.result.length} items` : ethTxData.result)

      // Only process if result is an actual array (not error string)
      if (Array.isArray(ethTxData.result) && ethTxData.result.length > 0) {
        console.log(`[Sync Transactions] Processing ${ethTxData.result.length} ETH transactions`)
        for (const tx of ethTxData.result.slice(0, 20)) { // Last 20 transactions
          // Check if transaction already exists
          const { data: existing } = await supabase
            .from('wallet_transactions')
            .select('id, status')
            .eq('tx_hash', tx.hash)
            .single()

          if (existing && existing.status === 'pending') {
            // Update pending transaction to confirmed
            console.log(`[Sync Transactions] Updating pending transaction to confirmed:`, tx.hash.substring(0, 20))
            const { error: updateError } = await supabase
              .from('wallet_transactions')
              .update({
                status: tx.isError === '0' ? 'confirmed' : 'failed',
                block_number: parseInt(tx.blockNumber)
              })
              .eq('tx_hash', tx.hash)

            if (updateError) {
              console.error('[Sync Transactions] Error updating transaction:', updateError)
            } else {
              newTransactions++ // Count updates as "new" for reporting
            }
          } else if (!existing) {
            // Determine if incoming or outgoing
            const type = tx.to.toLowerCase() === address.toLowerCase() ? 'incoming' : 'outgoing'
            const amount = ethers.formatEther(tx.value)

            console.log(`[Sync Transactions] Inserting ${type} ETH transaction:`, {
              hash: tx.hash,
              amount: amount,
              from: tx.from.substring(0, 10),
              to: tx.to.substring(0, 10),
              walletAddress: address.substring(0, 10),
              txTo: tx.to.substring(0, 10),
              match: tx.to.toLowerCase() === address.toLowerCase()
            })

            // Insert transaction
            const { error: insertError } = await supabase
              .from('wallet_transactions')
              .insert({
                wallet_id: wallet.id,
                tx_hash: tx.hash,
                type: type,
                from_address: tx.from,
                to_address: tx.to,
                amount: amount,
                currency: 'ETH',
                status: tx.isError === '0' ? 'confirmed' : 'failed',
                block_number: parseInt(tx.blockNumber),
                created_at: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
              })

            if (insertError) {
              console.error('[Sync Transactions] Error inserting transaction:', insertError)
            } else {
              newTransactions++
            }
          }
        }
      }

      // Fetch USDC (ERC-20) transactions using V2 API
      const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      const usdcTxUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=${usdcAddress}&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey}`
      
      const usdcTxResponse = await fetch(usdcTxUrl)
      const usdcTxData = await usdcTxResponse.json()
      
      console.log('[Sync Transactions] USDC transactions API status:', usdcTxData.status)
      console.log('[Sync Transactions] USDC result:', usdcTxData.result ? 'exists' : 'missing')

      // Process USDC transactions even if rate limited
      if (usdcTxData.result && Array.isArray(usdcTxData.result) && usdcTxData.result.length > 0) {
        for (const tx of usdcTxData.result.slice(0, 20)) {
          const { data: existing } = await supabase
            .from('wallet_transactions')
            .select('id, status')
            .eq('tx_hash', tx.hash)
            .single()

          if (existing && existing.status === 'pending') {
            // Update pending USDC transaction to confirmed
            console.log(`[Sync Transactions] Updating pending USDC transaction to confirmed:`, tx.hash.substring(0, 20))
            await supabase
              .from('wallet_transactions')
              .update({
                status: 'confirmed',
                block_number: parseInt(tx.blockNumber)
              })
              .eq('tx_hash', tx.hash)

            newTransactions++
          } else if (!existing) {
            const type = tx.to.toLowerCase() === address.toLowerCase() ? 'incoming' : 'outgoing'
            const amount = ethers.formatUnits(tx.value, 6) // USDC has 6 decimals

            await supabase
              .from('wallet_transactions')
              .insert({
                wallet_id: wallet.id,
                tx_hash: tx.hash,
                type: type,
                from_address: tx.from,
                to_address: tx.to,
                amount: amount,
                currency: 'USDC',
                status: 'confirmed',
                block_number: parseInt(tx.blockNumber),
                created_at: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
              })

            newTransactions++
          }
        }
      }
    } catch (error) {
      console.error('[Sync Transactions] API error:', error)
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${newTransactions} new transactions`,
      newTransactions: newTransactions
    })

  } catch (error) {
    console.error('Error syncing transactions:', error)
    return NextResponse.json({ error: 'Failed to sync transactions' }, { status: 500 })
  }
}
