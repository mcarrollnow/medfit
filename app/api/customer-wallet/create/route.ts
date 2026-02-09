import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import crypto from 'crypto'
import { ethers } from 'ethers'
import bcrypt from 'bcryptjs'
// BTC/LTC/DASH imports moved to dynamic imports to avoid WASM loading issues on Vercel
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

const SUPPORTED_CURRENCIES = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP', 'BTC', 'LTC', 'DASH', 'XRP']
const EVM_CHAINS = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP']
const BITCOIN_STYLE_CHAINS = ['BTC', 'LTC', 'DASH']

// Network configurations loaded dynamically for Bitcoin-style chains
const COIN_TYPES: Record<string, number> = {
  BTC: 0,
  LTC: 2,
  DASH: 5,
  ETH: 60,
}

// Get Bitcoin network config (loaded dynamically)
async function getBitcoinNetworkConfig(currency: string) {
  const bitcoin = await import('bitcoinjs-lib')
  
  const configs: Record<string, any> = {
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
  return configs[currency]
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

// Generate EVM wallet
function generateEVMWallet(): { privateKey: string; address: string; mnemonic: string } {
  const wallet = ethers.Wallet.createRandom()
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic: wallet.mnemonic?.phrase || ''
  }
}

// Generate Bitcoin-style wallet (uses dynamic imports)
async function generateBitcoinStyleWallet(currency: string): Promise<{ privateKey: string; address: string; mnemonic: string }> {
  // Dynamic imports to avoid WASM loading on Vercel for non-BTC wallets
  const bitcoin = await import('bitcoinjs-lib')
  const ecc = await import('tiny-secp256k1')
  const { ECPairFactory } = await import('ecpair')
  const { HDKey } = await import('@scure/bip32')
  
  const ECPair = ECPairFactory(ecc)
  const network = await getBitcoinNetworkConfig(currency)
  
  const mnemonic = generateMnemonic(wordlist, 256)
  const seed = mnemonicToSeedSync(mnemonic)
  const coinType = COIN_TYPES[currency]
  
  const root = HDKey.fromMasterSeed(seed)
  const path = `m/44'/${coinType}'/0'/0/0`
  const child = root.derive(path)
  
  if (!child.privateKey) {
    throw new Error('Failed to derive private key')
  }
  
  const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network })
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

// Generate XRP wallet (uses dynamic imports)
async function generateXRPWallet(): Promise<{ privateKey: string; address: string; mnemonic: string; seed: string }> {
  const { Wallet: XrplWallet } = await import('xrpl')
  const wallet = XrplWallet.generate()
  const mnemonic = generateMnemonic(wordlist, 256)
  
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic,
    seed: wallet.seed || ''
  }
}

// Import from mnemonic (uses dynamic imports for non-EVM)
async function importFromMnemonic(mnemonic: string, currency: string): Promise<{ privateKey: string; address: string }> {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  if (EVM_CHAINS.includes(currency)) {
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    return { privateKey: wallet.privateKey, address: wallet.address }
  }
  
  if (BITCOIN_STYLE_CHAINS.includes(currency)) {
    const bitcoin = await import('bitcoinjs-lib')
    const ecc = await import('tiny-secp256k1')
    const { ECPairFactory } = await import('ecpair')
    const { HDKey } = await import('@scure/bip32')
    
    const ECPair = ECPairFactory(ecc)
    const network = await getBitcoinNetworkConfig(currency)
    
    const seed = mnemonicToSeedSync(mnemonic)
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
    const { Wallet: XrplWallet } = await import('xrpl')
    const wallet = XrplWallet.fromMnemonic(mnemonic)
    return { privateKey: wallet.privateKey, address: wallet.address }
  }
  
  throw new Error(`Mnemonic import not supported for ${currency}`)
}

// Import from private key (uses dynamic imports for non-EVM)
async function importFromPrivateKey(privateKey: string, currency: string): Promise<{ address: string }> {
  if (EVM_CHAINS.includes(currency)) {
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      throw new Error('Invalid Ethereum private key format')
    }
    const wallet = new ethers.Wallet(privateKey)
    return { address: wallet.address }
  }
  
  if (BITCOIN_STYLE_CHAINS.includes(currency)) {
    const bitcoin = await import('bitcoinjs-lib')
    const ecc = await import('tiny-secp256k1')
    const { ECPairFactory } = await import('ecpair')
    
    const ECPair = ECPairFactory(ecc)
    const network = await getBitcoinNetworkConfig(currency)
    
    const keyPair = ECPair.fromWIF(privateKey, network)
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
    
    if (!address) {
      throw new Error('Failed to generate address from private key')
    }
    return { address }
  }
  
  if (currency === 'XRP') {
    const { Wallet: XrplWallet } = await import('xrpl')
    const wallet = XrplWallet.fromSecret(privateKey)
    return { address: wallet.address }
  }
  
  throw new Error(`Private key import not supported for ${currency}`)
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id

    // Get customer record (user_id = users.id)
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
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
      enableHardwareKey = false,
      isPrimary = false
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

    // At least one security method required
    if (!pin && !password && !enableBiometric && !enableHardwareKey) {
      return NextResponse.json({ 
        error: 'At least one security method (PIN, password, biometric, or hardware key) is required' 
      }, { status: 400 })
    }

    let privateKey: string
    let mnemonic: string | null = null
    let address: string
    let extraData: Record<string, string> = {}

    if (generateNew) {
      if (EVM_CHAINS.includes(currency)) {
        const wallet = generateEVMWallet()
        privateKey = wallet.privateKey
        mnemonic = wallet.mnemonic
        address = wallet.address
      } else if (BITCOIN_STYLE_CHAINS.includes(currency)) {
        const wallet = await generateBitcoinStyleWallet(currency)
        privateKey = wallet.privateKey
        mnemonic = wallet.mnemonic
        address = wallet.address
      } else if (currency === 'XRP') {
        const wallet = await generateXRPWallet()
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
        const result = await importFromPrivateKey(importPrivateKey, currency)
        privateKey = importPrivateKey
        address = result.address
      } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Invalid private key' }, { status: 400 })
      }
    } else if (importMnemonic) {
      try {
        const result = await importFromMnemonic(importMnemonic, currency)
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

    // Check if address already exists for this customer
    const { data: existingWallet } = await supabase
      .from('customer_wallets')
      .select('id')
      .eq('customer_id', customer.id)
      .eq('address', address)
      .eq('is_active', true)
      .single()

    if (existingWallet) {
      return NextResponse.json({ error: 'You already have this wallet address' }, { status: 400 })
    }

    // Encrypt private key
    const encryptedPK = encryptData(privateKey)

    // Encrypt mnemonic if present
    let encryptedMnemonic = null
    if (mnemonic) {
      encryptedMnemonic = encryptData(mnemonic)
    }

    // Hash PIN if provided
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
      .from('customer_wallets')
      .insert({
        customer_id: customer.id,
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
        is_primary: isPrimary,
        is_active: true
      })
      .select('id, label, address, currency, is_primary, created_at')
      .single()

    if (walletError) {
      console.error('Error creating customer wallet:', walletError)
      return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        label: wallet.label,
        address: wallet.address,
        currency: wallet.currency,
        is_primary: wallet.is_primary,
        created_at: wallet.created_at
      },
      ...(generateNew && mnemonic ? { 
        mnemonic,
        warning: 'SAVE THIS MNEMONIC! It will not be shown again.',
        ...(extraData.seed ? { xrpSeed: extraData.seed } : {})
      } : {})
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating customer wallet:', error)
    return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 })
  }
}
