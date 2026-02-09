import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import crypto from 'crypto'
import { ethers } from 'ethers'
import bcrypt from 'bcryptjs'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'
import { HDKey } from '@scure/bip32'
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { Wallet as XrplWallet } from 'xrpl'

// Initialize ECPair with tiny-secp256k1
const ECPair = ECPairFactory(ecc)

const SUPPORTED_CURRENCIES = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP', 'BTC', 'LTC', 'DASH', 'XRP']

// EVM-compatible chains (use Ethereum addresses)
const EVM_CHAINS = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP']

// Bitcoin-style chains
const BITCOIN_STYLE_CHAINS = ['BTC', 'LTC', 'DASH']

// Network configurations for Bitcoin-style chains
const NETWORK_CONFIGS: Record<string, bitcoin.Network> = {
  BTC: bitcoin.networks.bitcoin,
  LTC: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: { public: 0x019da462, private: 0x019d9cfe },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  },
  DASH: {
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bech32: '',
    bip32: { public: 0x0488b21e, private: 0x0488ade4 },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
  },
}

// BIP44 coin types
const COIN_TYPES: Record<string, number> = {
  BTC: 0,
  LTC: 2,
  DASH: 5,
  ETH: 60,
}

// Encrypt data using AES-256-GCM
function encryptData(data: string): { encrypted: string; iv: string; authTag: string } {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-key-change-in-production'
  const algorithm = 'aes-256-gcm'
  
  const key = crypto.createHash('sha256').update(encryptionKey).digest()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

// Generate EVM wallet (Ethereum and ERC-20 tokens)
function generateEVMWallet(): { privateKey: string; address: string; mnemonic: string } {
  const wallet = ethers.Wallet.createRandom()
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic: wallet.mnemonic?.phrase || ''
  }
}

// Generate Bitcoin-style wallet (BTC, LTC, DASH)
function generateBitcoinStyleWallet(currency: string): { privateKey: string; address: string; mnemonic: string } {
  const mnemonic = generateMnemonic(wordlist, 256)
  const seed = mnemonicToSeedSync(mnemonic)
  const network = NETWORK_CONFIGS[currency]
  const coinType = COIN_TYPES[currency]
  
  // BIP44 derivation path: m/44'/coinType'/0'/0/0
  const root = HDKey.fromMasterSeed(seed)
  const path = `m/44'/${coinType}'/0'/0/0`
  const child = root.derive(path)
  
  if (!child.privateKey) {
    throw new Error('Failed to derive private key')
  }
  
  // Create key pair from private key
  const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network })
  
  // Generate P2PKH address (legacy format - most compatible)
  const { address } = bitcoin.payments.p2pkh({ 
    pubkey: keyPair.publicKey, 
    network 
  })
  
  if (!address) {
    throw new Error('Failed to generate address')
  }
  
  return {
    privateKey: keyPair.toWIF(),
    address,
    mnemonic
  }
}

// Generate XRP wallet
function generateXRPWallet(): { privateKey: string; address: string; mnemonic: string; seed: string } {
  const wallet = XrplWallet.generate()
  
  // Generate a mnemonic for backup purposes
  const mnemonic = generateMnemonic(wordlist, 256)
  
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic,
    seed: wallet.seed || ''
  }
}

// Import wallet from mnemonic for different chains
function importFromMnemonic(mnemonic: string, currency: string): { privateKey: string; address: string } {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  if (EVM_CHAINS.includes(currency)) {
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    return { privateKey: wallet.privateKey, address: wallet.address }
  }
  
  if (BITCOIN_STYLE_CHAINS.includes(currency)) {
    const seed = mnemonicToSeedSync(mnemonic)
    const network = NETWORK_CONFIGS[currency]
    const coinType = COIN_TYPES[currency]
    
    const root = HDKey.fromMasterSeed(seed)
    const path = `m/44'/${coinType}'/0'/0/0`
    const child = root.derive(path)
    
    if (!child.privateKey) {
      throw new Error('Failed to derive private key')
    }
    
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network })
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
    
    if (!address) {
      throw new Error('Failed to generate address')
    }
    
    return { privateKey: keyPair.toWIF(), address }
  }
  
  if (currency === 'XRP') {
    // For XRP, use the mnemonic directly
    const wallet = XrplWallet.fromMnemonic(mnemonic)
    return { privateKey: wallet.privateKey, address: wallet.address }
  }
  
  throw new Error(`Mnemonic import not supported for ${currency}`)
}

// Import wallet from private key for different chains
function importFromPrivateKey(privateKey: string, currency: string): { address: string } {
  if (EVM_CHAINS.includes(currency)) {
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      throw new Error('Invalid Ethereum private key format. Must be 64-character hex string with 0x prefix')
    }
    const wallet = new ethers.Wallet(privateKey)
    return { address: wallet.address }
  }
  
  if (BITCOIN_STYLE_CHAINS.includes(currency)) {
    const network = NETWORK_CONFIGS[currency]
    const keyPair = ECPair.fromWIF(privateKey, network)
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
    
    if (!address) {
      throw new Error('Failed to generate address from private key')
    }
    return { address }
  }
  
  if (currency === 'XRP') {
    const wallet = XrplWallet.fromSecret(privateKey)
    return { address: wallet.address }
  }
  
  throw new Error(`Private key import not supported for ${currency}`)
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { 
      label, 
      currency, 
      generateNew = true,
      importPrivateKey,
      importMnemonic,
      pin,
      password,
      enableBiometric = false,
      enableHardwareKey = false
    } = body

    // Validate required fields
    if (!label || !currency) {
      return NextResponse.json({ error: 'Label and currency are required' }, { status: 400 })
    }

    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      return NextResponse.json({ 
        error: `Invalid currency. Supported: ${SUPPORTED_CURRENCIES.join(', ')}` 
      }, { status: 400 })
    }

    let privateKey: string
    let mnemonic: string | null = null
    let address: string
    let extraData: Record<string, string> = {}

    if (generateNew) {
      // Generate wallet based on currency type
      if (EVM_CHAINS.includes(currency)) {
        const wallet = generateEVMWallet()
        privateKey = wallet.privateKey
        mnemonic = wallet.mnemonic
        address = wallet.address
      } else if (BITCOIN_STYLE_CHAINS.includes(currency)) {
        const wallet = generateBitcoinStyleWallet(currency)
        privateKey = wallet.privateKey
        mnemonic = wallet.mnemonic
        address = wallet.address
      } else if (currency === 'XRP') {
        const wallet = generateXRPWallet()
        privateKey = wallet.privateKey
        mnemonic = wallet.mnemonic
        address = wallet.address
        extraData.seed = wallet.seed
      } else {
        return NextResponse.json({ 
          error: `Wallet generation not supported for ${currency}` 
        }, { status: 400 })
      }
    } else if (importPrivateKey) {
      try {
        const result = importFromPrivateKey(importPrivateKey, currency)
        privateKey = importPrivateKey
        address = result.address
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Invalid private key' }, { status: 400 })
      }
    } else if (importMnemonic) {
      try {
        const result = importFromMnemonic(importMnemonic, currency)
        privateKey = result.privateKey
        mnemonic = importMnemonic
        address = result.address
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Invalid mnemonic phrase' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ 
        error: 'Must either generate new wallet or provide private key/mnemonic to import' 
      }, { status: 400 })
    }

    // Use service role client for database operations
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if address already exists
    const { data: existingWallet } = await supabase
      .from('business_wallets')
      .select('id, is_active')
      .eq('address', address)
      .single()

    if (existingWallet && existingWallet.is_active) {
      return NextResponse.json({ error: 'Wallet address already exists' }, { status: 400 })
    }

    // If inactive wallet exists, delete it
    if (existingWallet && !existingWallet.is_active) {
      await supabase
        .from('business_wallets')
        .delete()
        .eq('id', existingWallet.id)
    }

    // Encrypt private key
    const encryptedPK = encryptData(privateKey)

    // Encrypt mnemonic if present
    let encryptedMnemonic = null
    if (mnemonic) {
      encryptedMnemonic = encryptData(mnemonic)
    }

    // Hash PIN if provided (4-12 digits)
    let pinHash = null
    if (pin) {
      if (pin.length < 4 || pin.length > 12 || !/^\d+$/.test(pin)) {
        return NextResponse.json({ 
          error: 'PIN must be 4-12 digits' 
        }, { status: 400 })
      }
      pinHash = await bcrypt.hash(pin, 12)
    }

    // Hash password if provided
    let passwordHash = null
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ 
          error: 'Password must be at least 8 characters' 
        }, { status: 400 })
      }
      passwordHash = await bcrypt.hash(password, 12)
    }

    // Store wallet in database
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .insert({
        label,
        address,
        currency,
        encrypted_private_key: encryptedPK.encrypted,
        private_key_iv: encryptedPK.iv,
        private_key_auth_tag: encryptedPK.authTag,
        encrypted_mnemonic: encryptedMnemonic?.encrypted || null,
        mnemonic_iv: encryptedMnemonic?.iv || null,
        mnemonic_auth_tag: encryptedMnemonic?.authTag || null,
        pin_hash: pinHash,
        password_hash: passwordHash,
        biometric_enabled: enableBiometric,
        hardware_key_enabled: enableHardwareKey,
        is_active: true,
        created_by: authResult.user?.id || null
      })
      .select('id, label, address, currency, created_at')
      .single()

    if (walletError) {
      console.error('Error creating wallet:', walletError)
      return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 })
    }

    // Return wallet info (without sensitive data)
    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        label: wallet.label,
        address: wallet.address,
        currency: wallet.currency,
        created_at: wallet.created_at
      },
      // Only show mnemonic on creation for backup
      ...(generateNew && mnemonic ? { 
        mnemonic,
        warning: 'SAVE THIS MNEMONIC! It will not be shown again.',
        ...(extraData.seed ? { xrpSeed: extraData.seed, xrpSeedWarning: 'This is your XRP seed - also save this!' } : {})
      } : {})
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating wallet:', error)
    return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 })
  }
}
