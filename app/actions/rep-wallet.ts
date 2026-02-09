"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { siteConfig } from "@/lib/site-config"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { ethers } from "ethers"
import { sendSMS, sendEmail, getPaymentSmsMessage, getPaymentEmailHtml } from "@/lib/notifications"

// Encryption helpers
const ALGORITHM = "aes-256-gcm"

function getEncryptionKey(): Buffer {
  const key = process.env.WALLET_ENCRYPTION_KEY || "default-key-change-in-production"
  return crypto.createHash("sha256").update(key).digest()
}

function encryptData(data: string): { encrypted: string; iv: string; authTag: string } {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  }
}

function decryptData(encrypted: string, iv: string, authTag: string): string {
  const key = getEncryptionKey()
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, "hex"))
  decipher.setAuthTag(Buffer.from(authTag, "hex"))
  
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}

// Types
export interface RepWallet {
  id: string
  rep_id: string
  address: string
  currency: string
  is_active: boolean
  has_pin: boolean
  has_password: boolean
  balance_eth?: string
  balance_usdc?: string
  created_at: string
}

export interface RepWalletWithMnemonic extends RepWallet {
  mnemonic?: string
}

// Create a wallet for a rep (called during onboarding or manually)
export async function createRepWallet(
  repId: string,
  options?: {
    pin?: string
    password?: string
  }
): Promise<{ success: boolean; wallet?: RepWalletWithMnemonic; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  // Check if rep already has a wallet
  const { data: existingWallet } = await supabase
    .from("rep_wallets")
    .select("id")
    .eq("rep_id", repId)
    .eq("is_active", true)
    .single()

  if (existingWallet) {
    return { success: false, error: "Rep already has an active wallet" }
  }

  // Generate new wallet
  const wallet = ethers.Wallet.createRandom()
  const mnemonic = wallet.mnemonic?.phrase

  if (!mnemonic) {
    return { success: false, error: "Failed to generate wallet" }
  }

  // Encrypt private key
  const encryptedPK = encryptData(wallet.privateKey)

  // Encrypt mnemonic (stored for rep to retrieve later)
  const encryptedMnemonic = encryptData(mnemonic)

  // Hash PIN if provided
  let pinHash = null
  if (options?.pin) {
    if (options.pin.length < 4 || options.pin.length > 12 || !/^\d+$/.test(options.pin)) {
      return { success: false, error: "PIN must be 4-12 digits" }
    }
    pinHash = await bcrypt.hash(options.pin, 12)
  }

  // Hash password if provided
  let passwordHash = null
  if (options?.password) {
    if (options.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }
    passwordHash = await bcrypt.hash(options.password, 12)
  }

  // Store wallet
  const { data: newWallet, error } = await supabase
    .from("rep_wallets")
    .insert({
      rep_id: repId,
      address: wallet.address,
      currency: "ETH",
      encrypted_private_key: encryptedPK.encrypted,
      private_key_iv: encryptedPK.iv,
      private_key_auth_tag: encryptedPK.authTag,
      encrypted_mnemonic: encryptedMnemonic.encrypted,
      mnemonic_iv: encryptedMnemonic.iv,
      mnemonic_auth_tag: encryptedMnemonic.authTag,
      pin_hash: pinHash,
      password_hash: passwordHash,
      is_active: true,
    })
    .select("id, rep_id, address, currency, is_active, created_at")
    .single()

  if (error) {
    console.error("[RepWallet] Error creating wallet:", error)
    return { success: false, error: "Failed to create wallet" }
  }

  // Also update the rep's crypto_wallet_address in users table
  await supabase
    .from("users")
    .update({ crypto_wallet_address: wallet.address })
    .eq("id", repId)

  return {
    success: true,
    wallet: {
      ...newWallet,
      has_pin: !!pinHash,
      has_password: !!passwordHash,
      mnemonic, // Return mnemonic only on creation for backup
    },
  }
}

// Get rep wallet info (without sensitive data)
export async function getRepWallet(repId: string): Promise<RepWallet | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("rep_wallets")
    .select("id, rep_id, address, currency, is_active, created_at, balance_eth, balance_usdc, pin_hash, password_hash")
    .eq("rep_id", repId)
    .eq("is_active", true)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    rep_id: data.rep_id,
    address: data.address,
    currency: data.currency,
    is_active: data.is_active,
    has_pin: !!data.pin_hash,
    has_password: !!data.password_hash,
    balance_eth: data.balance_eth,
    balance_usdc: data.balance_usdc,
    created_at: data.created_at,
  }
}

// Get rep's mnemonic (requires PIN verification)
export async function getRepMnemonic(
  repId: string,
  pin: string
): Promise<{ success: boolean; mnemonic?: string; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  const { data: wallet, error } = await supabase
    .from("rep_wallets")
    .select("*")
    .eq("rep_id", repId)
    .eq("is_active", true)
    .single()

  if (error || !wallet) {
    return { success: false, error: "Wallet not found" }
  }

  // Verify PIN
  if (wallet.pin_hash) {
    const pinValid = await bcrypt.compare(pin, wallet.pin_hash)
    if (!pinValid) {
      return { success: false, error: "Invalid PIN" }
    }
  }

  // Decrypt and return mnemonic
  if (!wallet.encrypted_mnemonic || !wallet.mnemonic_iv || !wallet.mnemonic_auth_tag) {
    return { success: false, error: "Mnemonic not available" }
  }

  try {
    const mnemonic = decryptData(
      wallet.encrypted_mnemonic,
      wallet.mnemonic_iv,
      wallet.mnemonic_auth_tag
    )
    return { success: true, mnemonic }
  } catch (e) {
    return { success: false, error: "Failed to decrypt mnemonic" }
  }
}

// Set up security for rep wallet (PIN/password)
export async function setupRepWalletSecurity(
  repId: string,
  options: {
    pin?: string
    password?: string
    currentPin?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  const { data: wallet, error } = await supabase
    .from("rep_wallets")
    .select("id, pin_hash")
    .eq("rep_id", repId)
    .eq("is_active", true)
    .single()

  if (error || !wallet) {
    return { success: false, error: "Wallet not found" }
  }

  // If wallet already has a PIN, verify the current PIN
  if (wallet.pin_hash && options.currentPin) {
    const pinValid = await bcrypt.compare(options.currentPin, wallet.pin_hash)
    if (!pinValid) {
      return { success: false, error: "Invalid current PIN" }
    }
  }

  const updates: Record<string, string | null> = {}

  // Set new PIN
  if (options.pin) {
    if (options.pin.length < 4 || options.pin.length > 12 || !/^\d+$/.test(options.pin)) {
      return { success: false, error: "PIN must be 4-12 digits" }
    }
    updates.pin_hash = await bcrypt.hash(options.pin, 12)
  }

  // Set new password
  if (options.password) {
    if (options.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }
    updates.password_hash = await bcrypt.hash(options.password, 12)
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, error: "No security options provided" }
  }

  const { error: updateError } = await supabase
    .from("rep_wallets")
    .update(updates)
    .eq("id", wallet.id)

  if (updateError) {
    return { success: false, error: "Failed to update security" }
  }

  return { success: true }
}

// Pay rep commission (sends crypto to their wallet)
export async function payRepCommission(
  adminId: string,
  repId: string,
  amount: number,
  commissionIds: string[],
  options?: {
    currency?: string
    sourceWalletId?: string
    notes?: string
  }
): Promise<{
  success: boolean
  paymentId?: string
  transactionHash?: string
  error?: string
}> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  // Get rep wallet
  const { data: repWallet } = await supabase
    .from("rep_wallets")
    .select("address")
    .eq("rep_id", repId)
    .eq("is_active", true)
    .single()

  if (!repWallet) {
    // Fall back to crypto_wallet_address in users table
    const { data: user } = await supabase
      .from("users")
      .select("crypto_wallet_address")
      .eq("id", repId)
      .single()

    if (!user?.crypto_wallet_address) {
      return { success: false, error: "Rep has no wallet address" }
    }
  }

  const recipientAddress = repWallet?.address

  // Get source wallet (business wallet)
  const sourceWalletId = options?.sourceWalletId
  let sourceWallet

  if (sourceWalletId) {
    const { data } = await supabase
      .from("business_wallets")
      .select("*")
      .eq("id", sourceWalletId)
      .eq("is_active", true)
      .single()
    sourceWallet = data
  } else {
    // Get default business wallet
    const { data } = await supabase
      .from("business_wallets")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .single()
    sourceWallet = data
  }

  if (!sourceWallet) {
    return { success: false, error: "No source wallet available" }
  }

  // Create payment record
  const paymentToken = crypto.randomBytes(32).toString("hex")
  const pinHash = crypto.randomBytes(6).toString("hex").toUpperCase().slice(0, 6) // Generate 6-char access code
  
  const { data: payment, error: paymentError } = await supabase
    .from("rep_commission_payments")
    .insert({
      rep_id: repId,
      admin_id: adminId,
      amount,
      currency: options?.currency || "USDC",
      source_wallet_id: sourceWallet.id,
      recipient_address: recipientAddress,
      status: "processing",
      payment_token: paymentToken,
      access_code_hash: await bcrypt.hash(pinHash, 10),
      notes: options?.notes,
    })
    .select()
    .single()

  if (paymentError || !payment) {
    console.error("[RepWallet] Error creating payment:", paymentError)
    return { success: false, error: "Failed to create payment record" }
  }

  // Link commissions to this payment
  if (commissionIds.length > 0) {
    const commissionLinks = commissionIds.map((cid) => ({
      payment_id: payment.id,
      commission_id: cid,
    }))

    await supabase.from("payment_commissions").insert(commissionLinks)

    // Mark commissions as processing
    await supabase
      .from("rep_commissions")
      .update({ status: "paid" })
      .in("id", commissionIds)
  }

  // Execute the transaction
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/wallet/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletId: sourceWallet.id,
        toAddress: recipientAddress,
        amount: amount.toString(),
        currency: options?.currency || "USDC",
      }),
    })

    const result = await response.json()

    if (result.success && result.transaction?.hash) {
      // Update payment with transaction hash
      await supabase
        .from("rep_commission_payments")
        .update({
          transaction_hash: result.transaction.hash,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", payment.id)

      return {
        success: true,
        paymentId: payment.id,
        transactionHash: result.transaction.hash,
      }
    } else {
      // Mark payment as failed
      await supabase
        .from("rep_commission_payments")
        .update({ status: "failed", error_message: result.error })
        .eq("id", payment.id)

      return { success: false, error: result.error || "Transaction failed" }
    }
  } catch (e: any) {
    // Mark payment as failed
    await supabase
      .from("rep_commission_payments")
      .update({ status: "failed", error_message: e.message })
      .eq("id", payment.id)

    return { success: false, error: "Transaction failed" }
  }
}

// Get payment report by token - requires rep's wallet PIN for verification
export async function getPaymentReport(
  paymentToken: string,
  pin: string
): Promise<{
  success: boolean
  payment?: any
  error?: string
}> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  // Get the payment with rep info
  const { data: payment, error } = await supabase
    .from("rep_commission_payments")
    .select(`
      *,
      rep:users!rep_id(id, first_name, last_name, email, phone),
      admin:users!admin_id(first_name, last_name),
      commissions:payment_commissions(
        commission:rep_commissions(
          id, order_total, commission_rate, commission_amount, created_at,
          order:orders(id, status, created_at)
        )
      )
    `)
    .eq("payment_token", paymentToken)
    .single()

  if (error || !payment) {
    return { success: false, error: "Payment not found" }
  }

  // Get the rep's wallet to verify PIN
  const { data: repWallet, error: walletError } = await supabase
    .from("rep_wallets")
    .select("pin_hash")
    .eq("rep_id", payment.rep_id)
    .eq("is_active", true)
    .single()

  if (walletError || !repWallet) {
    return { success: false, error: "Wallet not found. Please set up your wallet first." }
  }

  if (!repWallet.pin_hash) {
    return { success: false, error: "No PIN set. Please set up your wallet PIN first." }
  }

  // Verify PIN against rep's wallet PIN
  const pinValid = await bcrypt.compare(pin, repWallet.pin_hash)
  if (!pinValid) {
    return { success: false, error: "Invalid PIN" }
  }

  // Remove sensitive fields before returning
  delete payment.payment_token

  return { success: true, payment }
}

// Send payment notification (SMS/Email)
// NOTE: The payment report is secured by the rep's wallet PIN - NOT an access code sent in the message
// This prevents anyone with access to their text/email from viewing payment details
export async function sendPaymentNotification(
  paymentId: string,
  method: "sms" | "email" | "both"
): Promise<{ success: boolean; emailSent?: boolean; smsSent?: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return { success: false, error: "Database not available" }
  }

  const { data: payment, error } = await supabase
    .from("rep_commission_payments")
    .select(`
      *,
      rep:users!rep_id(first_name, last_name, email, phone)
    `)
    .eq("id", paymentId)
    .single()

  if (error || !payment) {
    return { success: false, error: "Payment not found" }
  }

  const baseUrl = siteConfig.appUrl
  const reportUrl = `${baseUrl}/payment-report/${payment.payment_token}`
  
  // Update notification timestamp
  await supabase
    .from("rep_commission_payments")
    .update({ 
      notification_sent_at: new Date().toISOString()
    })
    .eq("id", paymentId)

  const repName = `${payment.rep?.first_name || ""}`.trim() || "there"
  const currency = payment.currency || "ETH"
  
  let emailSent = false
  let smsSent = false
  const errors: string[] = []

  // Notification data for templates (NO access code - they use their wallet PIN)
  const notificationData = {
    repName,
    paymentAmount: Number(payment.amount),
    currency,
    paymentReportUrl: reportUrl,
  }

  // Send SMS if requested
  if ((method === "sms" || method === "both") && payment.rep?.phone) {
    try {
      const smsMessage = `💰 Commission Payment!\n\nHi ${repName}, you received ${Number(payment.amount).toFixed(6)} ${currency}.\n\n📄 View report: ${reportUrl}\n\nUse your PIN to view details.`
      
      const smsResult = await sendSMS({
        to: payment.rep.phone,
        body: smsMessage,
        metadata: {
          type: "commission_payment",
          payment_id: paymentId,
          rep_id: payment.rep_id,
        },
      })
      
      if (smsResult.success) {
        smsSent = true
        console.log(`[PaymentNotification] SMS sent to ${payment.rep.phone}`)
      } else {
        errors.push(`SMS: ${smsResult.error}`)
      }
    } catch (e: any) {
      errors.push(`SMS: ${e.message}`)
    }
  }

  // Send Email if requested
  if ((method === "email" || method === "both") && payment.rep?.email) {
    try {
      const emailHtml = getPaymentEmailHtml(notificationData)
      
      const emailResult = await sendEmail({
        to: payment.rep.email,
        subject: `💰 Commission Payment: ${Number(payment.amount).toFixed(6)} ${currency}`,
        html: emailHtml,
        text: `Hi ${repName}, you received a commission payment of ${Number(payment.amount).toFixed(6)} ${currency}. View your payment report at: ${reportUrl} - Use your PIN to access.`,
      })
      
      if (emailResult.success) {
        emailSent = true
        console.log(`[PaymentNotification] Email sent to ${payment.rep.email}`)
      } else {
        errors.push(`Email: ${emailResult.error}`)
      }
    } catch (e: any) {
      errors.push(`Email: ${e.message}`)
    }
  }

  const success = emailSent || smsSent

  // Update notification status
  await supabase
    .from("rep_commission_payments")
    .update({
      notification_method: method,
      email_sent: emailSent,
      sms_sent: smsSent,
    })
    .eq("id", paymentId)

  return {
    success,
    emailSent,
    smsSent,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  }
}

// Get all reps with their wallet and commission info (for admin)
export async function getRepsWithCommissions(): Promise<any[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const { data: reps, error } = await supabase
    .from("users")
    .select(`
      id, first_name, last_name, email, phone, crypto_wallet_address,
      rep_wallet:rep_wallets(id, address, is_active)
    `)
    .eq("role", "rep")

  if (error || !reps) return []

  // Get commission summaries for each rep
  const result = await Promise.all(
    reps.map(async (rep) => {
      const { data: commissions } = await supabase
        .from("rep_commissions")
        .select("commission_amount, status")
        .eq("rep_id", rep.id)

      const { data: payments } = await supabase
        .from("rep_commission_payments")
        .select("amount, status")
        .eq("rep_id", rep.id)
        .eq("status", "completed")

      const totalEarned = (commissions || [])
        .filter((c) => c.status !== "cancelled")
        .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

      const totalPaid = (payments || [])
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)

      const pendingAmount = (commissions || [])
        .filter((c) => c.status === "pending")
        .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

      const approvedAmount = (commissions || [])
        .filter((c) => c.status === "approved")
        .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

      return {
        ...rep,
        wallet_address: rep.rep_wallet?.[0]?.address || rep.crypto_wallet_address,
        has_wallet: !!(rep.rep_wallet?.[0]?.is_active || rep.crypto_wallet_address),
        total_earned: totalEarned,
        total_paid: totalPaid,
        pending_amount: pendingAmount,
        approved_amount: approvedAmount,
        balance_owed: approvedAmount, // Available to pay
      }
    })
  )

  return result
}

