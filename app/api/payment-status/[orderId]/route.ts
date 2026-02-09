import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { ethers } from "ethers"

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { orderId } = await context.params

  try {
    // Use service role to query order
    // NOTE: No auth required - crypto orders are guest orders
    // Order ID itself acts as the authorization token (like tracking a package)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Detect if orderId is UUID or order_number
    const isUuid = orderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    
    // Query orders table - only payment status, no sensitive customer data
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id, 
        order_number, 
        payment_status, 
        transaction_hash, 
        payment_verified_at, 
        expected_payment_amount, 
        expected_payment_currency,
        assigned_wallet_id,
        customer_id
      `)
      .eq(isUuid ? "id" : "order_number", orderId)
      .single()

    if (error) {
      console.error("[Payment Status] Error fetching order:", error)
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // If payment is processing and we have a tx hash, actively check blockchain
    if (order.payment_status === "payment_processing" && order.transaction_hash) {
      console.log("[Payment Status] Checking blockchain for tx:", order.transaction_hash)
      
      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo'
        )
        
        const receipt = await provider.getTransactionReceipt(order.transaction_hash)
        
        if (receipt && receipt.status === 1) {
          // Transaction confirmed on blockchain!
          console.log("[Payment Status] Transaction confirmed! Updating order to paid")
          
          const { error: updateError } = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "paid",
              payment_verified_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("id", order.id)
          
          if (!updateError) {
            // Update wallet transaction status too
            await supabase
              .from("wallet_transactions")
              .update({ 
                status: "confirmed",
                confirmed_at: new Date().toISOString()
              })
              .eq("tx_hash", order.transaction_hash)
            
            // Also update customer wallet transaction
            await supabase
              .from("customer_wallet_transactions")
              .update({ status: "completed" })
              .eq("tx_hash", order.transaction_hash)
            
            // Create notification for customer
            if (order.customer_id) {
              const { data: customer } = await supabase
                .from("customers")
                .select("user_id")
                .eq("id", order.customer_id)
                .single()
              
              if (customer?.user_id) {
                await supabase
                  .from("notifications")
                  .insert({
                    user_id: customer.user_id,
                    customer_id: order.customer_id,
                    type: "order_update",
                    title: `Payment Confirmed - Order #${order.order_number}`,
                    message: `Your payment has been confirmed on the blockchain! Your order is now being processed.`,
                    order_id: order.id,
                    read: false,
                    created_at: new Date().toISOString()
                  })
              }
            }
            
            return Response.json({
              orderId,
              status: "confirmed",
              timestamp: new Date().toISOString(),
              transactionHash: order.transaction_hash,
              confirmedAt: new Date().toISOString(),
              amount: order.expected_payment_amount,
              currency: order.expected_payment_currency,
              message: "Payment confirmed!"
            })
          }
        } else if (receipt && receipt.status === 0) {
          // Transaction failed
          console.log("[Payment Status] Transaction FAILED on blockchain")
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("id", order.id)
        }
        // If receipt is null, transaction is still pending
      } catch (blockchainError) {
        console.error("[Payment Status] Error checking blockchain:", blockchainError)
        // Continue with normal status response
      }
    }

    // Map order payment_status to tracker status
    // 'paid' → 'confirmed' triggers final "Payment Complete" state in tracker
    let trackerStatus = "pending"
    if (order.payment_status === "paid") {
      trackerStatus = "confirmed"
    } else if (order.payment_status === "payment_processing") {
      trackerStatus = "processing"
    } else if (order.payment_status === "failed") {
      trackerStatus = "failed"
    }

    return Response.json({
      orderId,
      status: trackerStatus,
      timestamp: order.payment_verified_at || new Date().toISOString(),
      transactionHash: order.transaction_hash,
      confirmedAt: order.payment_verified_at,
      amount: order.expected_payment_amount,
      currency: order.expected_payment_currency,
    })
  } catch (error) {
    console.error("[Payment Status] Error checking payment status:", error)
    return Response.json(
      {
        orderId,
        status: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// POST endpoint removed - Alchemy webhook handles payment updates directly in orders table
