'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, RefreshCw, Send, QrCode, ArrowDownLeft, ArrowUpRight, 
  X, Plus, ExternalLink, ChevronDown, ChevronUp, Wallet, 
  Shield, Key, Fingerprint, Lock, Eye, EyeOff, Check, AlertCircle,
  Users, DollarSign, Search, UserCheck, MessageSquare, Mail,
  ArrowLeftRight, Loader2, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getRepsWithCommissions, payRepCommission, sendPaymentNotification } from '@/app/actions/rep-wallet'
import { getRepCommissions, approveCommissions } from '@/app/actions/payouts'

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  { symbol: 'BTC', name: 'Bitcoin', decimals: 8 },
  { symbol: 'DASH', name: 'Dash', decimals: 8 },
  { symbol: 'LTC', name: 'Litecoin', decimals: 8 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', decimals: 6 },
  { symbol: 'XRP', name: 'Ripple', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', decimals: 18 },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
  { symbol: 'ARB', name: 'Arbitrum', decimals: 18 },
  { symbol: 'OP', name: 'Optimism', decimals: 18 },
]

interface BusinessWallet {
  id: string
  label: string
  address: string
  currency: string
  is_active: boolean
  created_at: string
  balance_eth?: string
  balance_usdc?: string
  has_pin: boolean
  has_webauthn: boolean
  has_password?: boolean
  biometric_enabled?: boolean
  hardware_key_enabled?: boolean
}

interface Transaction {
  id: string
  type: 'incoming' | 'outgoing'
  amount: string
  currency: string
  from_address: string
  to_address: string
  tx_hash: string
  created_at: string
  status: 'confirmed' | 'pending' | 'failed'
}

interface RepWithCommissions {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  wallet_address?: string
  has_wallet: boolean
  total_earned: number
  total_paid: number
  pending_amount: number
  approved_amount: number
  balance_owed: number
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<BusinessWallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ethPrice, setEthPrice] = useState(3000)
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<BusinessWallet | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendForm, setSendForm] = useState({
    to: '',
    amount: '',
    currency: 'ETH',
    pin: '',
    password: ''
  })
  
  // Swap state
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapForm, setSwapForm] = useState({
    fromToken: 'ETH',
    toToken: 'USDC',
    amount: '',
    slippage: '0.5'
  })
  const [swapQuote, setSwapQuote] = useState<{
    amountOut: string
    priceImpact: string
    gasEstimate: string
    route: string
  } | null>(null)
  const [isGettingQuote, setIsGettingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    label: '',
    currency: 'ETH',
    generateNew: true,
    importPrivateKey: '',
    importMnemonic: '',
    securityPin: false,
    securityPassword: false,
    securityBiometric: false,
    securityHardwareKey: false,
    pin: '',
    password: ''
  })
  const [showPin, setShowPin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [createdMnemonic, setCreatedMnemonic] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unlockedWallets, setUnlockedWallets] = useState<Set<string>>(new Set())
  const [unlockingWallet, setUnlockingWallet] = useState<string | null>(null)
  const [unlockPin, setUnlockPin] = useState('')
  const [unlockPassword, setUnlockPassword] = useState('')
  const [showUnlockPin, setShowUnlockPin] = useState(false)
  const [showUnlockPassword, setShowUnlockPassword] = useState(false)
  
  // Pay Rep state
  const [showPayRepModal, setShowPayRepModal] = useState(false)
  const [reps, setReps] = useState<RepWithCommissions[]>([])
  const [repSearchQuery, setRepSearchQuery] = useState('')
  const [selectedRep, setSelectedRep] = useState<RepWithCommissions | null>(null)
  const [repCommissions, setRepCommissions] = useState<any[]>([])
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([])
  const [payRepLoading, setPayRepLoading] = useState(false)
  const [payRepStep, setPayRepStep] = useState<'search' | 'details' | 'confirm' | 'success'>('search')
  const [paymentResult, setPaymentResult] = useState<{ paymentId?: string; transactionHash?: string } | null>(null)
  const [notificationMethod, setNotificationMethod] = useState<'sms' | 'email' | 'both'>('both')

  useEffect(() => {
    loadWallets()
    fetchEthPrice()
    loadReps()
  }, [])

  async function loadReps() {
    try {
      const data = await getRepsWithCommissions()
      setReps(data || [])
    } catch (error) {
      console.error('Failed to load reps:', error)
    }
  }

  async function handleSelectRep(rep: RepWithCommissions) {
    setSelectedRep(rep)
    setPayRepStep('details')
    setPayRepLoading(true)
    
    try {
      const commissions = await getRepCommissions(rep.id)
      // Only show approved commissions that can be paid
      const payableCommissions = commissions.filter((c: any) => c.status === 'approved')
      setRepCommissions(payableCommissions)
      // Select all by default
      setSelectedCommissions(payableCommissions.map((c: any) => c.id))
    } catch (error) {
      console.error('Failed to load commissions:', error)
    } finally {
      setPayRepLoading(false)
    }
  }

  async function handlePayRep() {
    if (!selectedRep || selectedCommissions.length === 0) return
    
    const amount = repCommissions
      .filter(c => selectedCommissions.includes(c.id))
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
    
    if (amount <= 0) {
      setError('No commission amount to pay')
      return
    }

    setPayRepLoading(true)
    setError(null)
    setPayRepStep('confirm')

    try {
      // Get current user ID (admin)
      const { supabase } = await import('@/lib/supabase-client')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Not authenticated')
        setPayRepLoading(false)
        return
      }

      const result = await payRepCommission(
        user.id,
        selectedRep.id,
        amount,
        selectedCommissions,
        {
          currency: 'USDC',
          sourceWalletId: wallets[0]?.id, // Use first wallet
          notes: `Commission payment for ${selectedCommissions.length} orders`
        }
      )

      if (result.success) {
        setPaymentResult({
          paymentId: result.paymentId,
          transactionHash: result.transactionHash
        })
        setPayRepStep('success')
        
        // Send notification
        if (result.paymentId) {
          await sendPaymentNotification(result.paymentId, notificationMethod)
        }
        
        // Reload data
        await loadReps()
      } else {
        setError(result.error || 'Payment failed')
        setPayRepStep('details')
      }
    } catch (error: any) {
      setError(error.message || 'Payment failed')
      setPayRepStep('details')
    } finally {
      setPayRepLoading(false)
    }
  }

  function resetPayRepModal() {
    setShowPayRepModal(false)
    setSelectedRep(null)
    setRepCommissions([])
    setSelectedCommissions([])
    setPayRepStep('search')
    setPaymentResult(null)
    setRepSearchQuery('')
    setError(null)
  }

  const filteredReps = reps.filter(rep => {
    const query = repSearchQuery.toLowerCase()
    return (
      rep.first_name?.toLowerCase().includes(query) ||
      rep.last_name?.toLowerCase().includes(query) ||
      rep.email?.toLowerCase().includes(query)
    )
  })

  async function fetchEthPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      const data = await response.json()
      setEthPrice(data.ethereum.usd)
    } catch (error) {
      console.error('Failed to fetch ETH price:', error)
    }
  }

  async function loadWallets() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/wallet/list')
      const data = await response.json()
      if (data.success) {
        setWallets(data.wallets || [])
      }
    } catch (error) {
      console.error('Failed to load wallets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const calculateUSDValue = (amount: string, currency: string) => {
    const amt = parseFloat(amount || '0')
    if (currency === 'ETH') return (amt * ethPrice).toFixed(2)
    if (['USDC', 'USDT', 'DAI'].includes(currency)) return amt.toFixed(2)
    return (amt * ethPrice * 0.001).toFixed(2)
  }

  const getTotalUSDValue = (wallet: BusinessWallet) => {
    let total = 0
    if (wallet.balance_eth) {
      total += parseFloat(wallet.balance_eth) * ethPrice
    }
    if (wallet.balance_usdc) {
      total += parseFloat(wallet.balance_usdc)
    }
    return total.toFixed(2)
  }

  const handleSync = async (walletId: string, address: string) => {
    setIsSyncing(prev => ({ ...prev, [walletId]: true }))
    try {
      const response = await fetch(`/api/wallet/balance?address=${address}`)
      const data = await response.json()
      if (data.success) {
        await loadWallets()
      }
    } catch (error) {
      console.error('Failed to sync wallet:', error)
    } finally {
      setIsSyncing(prev => ({ ...prev, [walletId]: false }))
    }
  }

  // Register WebAuthn credential (for biometric or hardware key)
  const registerWebAuthn = async (walletId: string, type: 'biometric' | 'hardware'): Promise<string | null> => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Get registration options from server
      const optionsRes = await fetch('/api/webauthn/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletId,
          authenticatorType: type === 'hardware' ? 'cross-platform' : 'platform'
        })
      })
      
      if (!optionsRes.ok) {
        const err = await optionsRes.json()
        throw new Error(err.error || 'Failed to get registration options')
      }
      
      const options = await optionsRes.json()
      
      // Convert base64 to ArrayBuffer
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0))
      options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0))
      
      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: options
      }) as PublicKeyCredential
      
      if (!credential) {
        throw new Error('Failed to create credential')
      }
      
      const response = credential.response as AuthenticatorAttestationResponse
      
      // Send credential to server to verify and store
      const verifyRes = await fetch('/api/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId,
          credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
          attestationObject: btoa(String.fromCharCode(...new Uint8Array(response.attestationObject))),
          type
        })
      })
      
      if (!verifyRes.ok) {
        const err = await verifyRes.json()
        throw new Error(err.error || 'Failed to verify credential')
      }
      
      const result = await verifyRes.json()
      return result.credentialId
    } catch (error: any) {
      console.error('WebAuthn registration error:', error)
      // Don't throw - just return null and wallet will be created without WebAuthn
      setError(`${type === 'hardware' ? 'Hardware key' : 'Biometric'} setup failed: ${error.message}. Wallet created without it.`)
      return null
    }
  }

  const handleCreateWallet = async () => {
    if (!createForm.label) {
      setError('Wallet label is required')
      return
    }

    if (createForm.securityPin && (createForm.pin.length < 4 || createForm.pin.length > 12)) {
      setError('PIN must be 4-12 digits')
      return
    }

    if (createForm.securityPassword && createForm.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      // First create the wallet
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: createForm.label,
          currency: createForm.currency,
          generateNew: createForm.generateNew,
          importPrivateKey: !createForm.generateNew ? createForm.importPrivateKey : undefined,
          importMnemonic: !createForm.generateNew ? createForm.importMnemonic : undefined,
          pin: createForm.securityPin ? createForm.pin : undefined,
          password: createForm.securityPassword ? createForm.password : undefined,
          enableBiometric: createForm.securityBiometric,
          enableHardwareKey: createForm.securityHardwareKey
        })
      })

      const data = await response.json()

      if (data.success) {
        const walletId = data.wallet?.id

        // Register WebAuthn if hardware key or biometric selected
        if (walletId && createForm.securityHardwareKey) {
          await registerWebAuthn(walletId, 'hardware')
        }
        
        if (walletId && createForm.securityBiometric) {
          await registerWebAuthn(walletId, 'biometric')
        }

        if (data.mnemonic) {
          setCreatedMnemonic(data.mnemonic)
        } else {
          setShowCreateForm(false)
          resetCreateForm()
          await loadWallets()
        }
      } else {
        setError(data.error || 'Failed to create wallet')
      }
    } catch (error) {
      setError('Failed to create wallet')
    } finally {
      setIsCreating(false)
    }
  }

  // Verify WebAuthn credential (for biometric or hardware key)
  const verifyWebAuthn = async (walletId: string, type: 'biometric' | 'hardware'): Promise<boolean> => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Get authentication options from server
      const optionsRes = await fetch('/api/webauthn/auth-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId })
      })
      
      if (!optionsRes.ok) {
        const err = await optionsRes.json()
        throw new Error(err.error || 'Failed to get auth options')
      }
      
      const options = await optionsRes.json()
      
      // Convert base64 to ArrayBuffer
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0))
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred: any) => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
        }))
      }
      
      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: options
      }) as PublicKeyCredential
      
      if (!credential) {
        throw new Error('Authentication cancelled')
      }
      
      const response = credential.response as AuthenticatorAssertionResponse
      
      // Verify with server
      const verifyRes = await fetch('/api/webauthn/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId,
          credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
          authenticatorData: btoa(String.fromCharCode(...new Uint8Array(response.authenticatorData))),
          signature: btoa(String.fromCharCode(...new Uint8Array(response.signature)))
        })
      })
      
      if (!verifyRes.ok) {
        const err = await verifyRes.json()
        throw new Error(err.error || 'Verification failed')
      }
      
      return true
    } catch (error: any) {
      console.error('WebAuthn verification error:', error)
      setError(`${type === 'hardware' ? 'Hardware key' : 'Biometric'} verification failed: ${error.message}`)
      return false
    }
  }

  const handleSend = async () => {
    if (!selectedWallet || !sendForm.to || !sendForm.amount) {
      setError('Please fill in all fields')
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Verify hardware key if enabled
      if (selectedWallet.hardware_key_enabled) {
        const verified = await verifyWebAuthn(selectedWallet.id, 'hardware')
        if (!verified) {
          setIsSending(false)
          return
        }
      }
      
      // Verify biometric if enabled (and hardware key not already verified)
      if (selectedWallet.biometric_enabled && !selectedWallet.hardware_key_enabled) {
        const verified = await verifyWebAuthn(selectedWallet.id, 'biometric')
        if (!verified) {
          setIsSending(false)
          return
        }
      }

      const response = await fetch('/api/wallet/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          toAddress: sendForm.to,
          amount: sendForm.amount,
          currency: sendForm.currency,
          pin: sendForm.pin || undefined,
          password: sendForm.password || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        setShowSendModal(false)
        setSendForm({ to: '', amount: '', currency: 'ETH', pin: '', password: '' })
        setSelectedWallet(null)
        await loadWallets()
      } else {
        setError(data.error || 'Failed to send transaction')
      }
    } catch (error) {
      setError('Failed to send transaction')
    } finally {
      setIsSending(false)
    }
  }

  const resetCreateForm = () => {
    setCreateForm({
      label: '',
      currency: 'ETH',
      generateNew: true,
      importPrivateKey: '',
      importMnemonic: '',
      securityPin: false,
      securityPassword: false,
      securityBiometric: false,
      securityHardwareKey: false,
      pin: '',
      password: ''
    })
    setCreatedMnemonic(null)
    setError(null)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  // Get swap quote
  const getSwapQuote = async () => {
    if (!selectedWallet || !swapForm.amount || parseFloat(swapForm.amount) <= 0) {
      return
    }

    setIsGettingQuote(true)
    setSwapQuote(null)
    setError(null)

    try {
      const response = await fetch('/api/wallet/swap/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          fromToken: swapForm.fromToken,
          toToken: swapForm.toToken,
          amount: swapForm.amount,
          slippage: swapForm.slippage
        })
      })

      const data = await response.json()

      if (data.success) {
        setSwapQuote({
          amountOut: data.amountOut,
          priceImpact: data.priceImpact,
          gasEstimate: data.gasEstimate,
          route: data.route
        })
      } else {
        setError(data.error || 'Failed to get quote')
      }
    } catch (err) {
      setError('Failed to get quote')
    } finally {
      setIsGettingQuote(false)
    }
  }

  // Execute swap
  const handleSwap = async () => {
    if (!selectedWallet || !swapQuote) {
      setError('No quote available')
      return
    }

    // Verify security if needed
    if (selectedWallet.hardware_key_enabled) {
      const verified = await verifyWebAuthn(selectedWallet.id, 'hardware')
      if (!verified) return
    }
    
    if (selectedWallet.biometric_enabled && !selectedWallet.hardware_key_enabled) {
      const verified = await verifyWebAuthn(selectedWallet.id, 'biometric')
      if (!verified) return
    }

    setIsSwapping(true)
    setError(null)

    try {
      const response = await fetch('/api/wallet/swap/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          fromToken: swapForm.fromToken,
          toToken: swapForm.toToken,
          amount: swapForm.amount,
          minAmountOut: swapQuote.amountOut,
          slippage: swapForm.slippage,
          pin: sendForm.pin || undefined,
          password: sendForm.password || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        setShowSwapModal(false)
        setSwapForm({ fromToken: 'ETH', toToken: 'USDC', amount: '', slippage: '0.5' })
        setSwapQuote(null)
        setSelectedWallet(null)
        await loadWallets()
      } else {
        setError(data.error || 'Swap failed')
      }
    } catch (err) {
      setError('Swap failed')
    } finally {
      setIsSwapping(false)
    }
  }

  // Check if wallet needs unlock
  const walletNeedsUnlock = (wallet: BusinessWallet) => {
    return wallet.has_pin || wallet.has_password || wallet.biometric_enabled || wallet.hardware_key_enabled
  }

  // Handle wallet unlock
  const handleUnlockWallet = async (wallet: BusinessWallet) => {
    // If no security, just expand
    if (!walletNeedsUnlock(wallet)) {
      setExpandedWallet(wallet.id)
      return
    }

    // If already unlocked, just toggle
    if (unlockedWallets.has(wallet.id)) {
      setExpandedWallet(expandedWallet === wallet.id ? null : wallet.id)
      return
    }

    // Need to unlock - show unlock modal
    setUnlockingWallet(wallet.id)
    setUnlockPin('')
    setUnlockPassword('')
    setError(null)
  }

  // Verify unlock credentials
  const verifyUnlock = async () => {
    const wallet = wallets.find(w => w.id === unlockingWallet)
    if (!wallet) return

    setError(null)

    try {
      // Verify hardware key first if enabled
      if (wallet.hardware_key_enabled) {
        const verified = await verifyWebAuthn(wallet.id, 'hardware')
        if (!verified) return
      }
      
      // Verify biometric if enabled
      if (wallet.biometric_enabled && !wallet.hardware_key_enabled) {
        const verified = await verifyWebAuthn(wallet.id, 'biometric')
        if (!verified) return
      }

      // Verify PIN if required
      if (wallet.has_pin) {
        if (!unlockPin || unlockPin.length < 4) {
          setError('Please enter your PIN')
          return
        }
        
        // Verify PIN with server
        const res = await fetch('/api/wallet/verify-security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: wallet.id, pin: unlockPin })
        })
        const data = await res.json()
        if (!data.success) {
          setError(data.error || 'Invalid PIN')
          return
        }
      }

      // Verify password if required
      if (wallet.has_password) {
        if (!unlockPassword || unlockPassword.length < 8) {
          setError('Please enter your password')
          return
        }
        
        // Verify password with server
        const res = await fetch('/api/wallet/verify-security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: wallet.id, password: unlockPassword })
        })
        const data = await res.json()
        if (!data.success) {
          setError(data.error || 'Invalid password')
          return
        }
      }

      // All verifications passed - unlock and expand
      setUnlockedWallets(prev => new Set([...prev, wallet.id]))
      setExpandedWallet(wallet.id)
      setUnlockingWallet(null)
      setUnlockPin('')
      setUnlockPassword('')
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Wallets</h1>
            <p className="text-xl text-muted-foreground">Manage cryptocurrency wallets and transactions.</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowPayRepModal(true)}
              className="h-12 px-6 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl font-semibold"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Pay Rep
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Wallet
            </Button>
          </div>
        </div>

        {/* Stats */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Wallets</p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{wallets.length}</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Secured</p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    {wallets.filter(w => w.has_pin || w.has_password || w.biometric_enabled || w.hardware_key_enabled).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    ${wallets.reduce((sum, w) => sum + parseFloat(getTotalUSDValue(w)), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Create Wallet Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Create New Wallet</h2>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-8">
                  {createdMnemonic ? (
                    // Show mnemonic backup screen
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Save Your Recovery Phrase</h3>
                          <p className="text-muted-foreground">Write this down and store it safely. This will not be shown again.</p>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <p className="font-mono text-lg text-amber-200 leading-relaxed break-all">
                          {createdMnemonic}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => copyToClipboard(createdMnemonic)}
                          className="h-12 px-6 bg-foreground/10 hover:bg-foreground/20 rounded-xl"
                        >
                          {copiedText === createdMnemonic ? (
                            <><Check className="w-4 h-4 mr-2" /> Copied</>
                          ) : (
                            <><Copy className="w-4 h-4 mr-2" /> Copy Phrase</>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowCreateForm(false)
                            resetCreateForm()
                            loadWallets()
                          }}
                          className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                        >
                          I've Saved It
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Show create form
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-foreground">New Wallet</h3>
                        <button
                          onClick={() => {
                            setShowCreateForm(false)
                            resetCreateForm()
                          }}
                          className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"
                        >
                          <X className="w-5 h-5 text-foreground/60" />
                        </button>
                      </div>

                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Wallet Label</label>
                          <Input
                            value={createForm.label}
                            onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                            placeholder="e.g. Main Business Wallet"
                            className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Currency</label>
                          <select
                            value={createForm.currency}
                            onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value })}
                            className="w-full h-14 bg-foreground/5 border border-border rounded-xl px-4 text-foreground"
                          >
                            {TOKENS.map((token) => (
                              <option key={token.symbol} value={token.symbol} className="bg-background">
                                {token.name} ({token.symbol})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Generation Mode */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground/60">Wallet Source</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setCreateForm({ ...createForm, generateNew: true })}
                            className={cn(
                              "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                              createForm.generateNew
                                ? "bg-foreground/10 border-border text-foreground"
                                : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10"
                            )}
                          >
                            <Plus className="w-5 h-5" />
                            Generate New
                          </button>
                          <button
                            onClick={() => setCreateForm({ ...createForm, generateNew: false })}
                            className={cn(
                              "flex-1 h-14 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium",
                              !createForm.generateNew
                                ? "bg-foreground/10 border-border text-foreground"
                                : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10"
                            )}
                          >
                            <Key className="w-5 h-5" />
                            Import Existing
                          </button>
                        </div>
                      </div>

                      {/* Import Fields */}
                      {!createForm.generateNew && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Private Key (optional)</label>
                            <Input
                              type="password"
                              value={createForm.importPrivateKey}
                              onChange={(e) => setCreateForm({ ...createForm, importPrivateKey: e.target.value })}
                              placeholder="0x..."
                              className="h-14 bg-foreground/5 border-border rounded-xl text-foreground font-mono"
                            />
                          </div>
                          <div className="text-center text-muted-foreground">or</div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Recovery Phrase (optional)</label>
                            <Input
                              type="password"
                              value={createForm.importMnemonic}
                              onChange={(e) => setCreateForm({ ...createForm, importMnemonic: e.target.value })}
                              placeholder="word1 word2 word3..."
                              className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                            />
                          </div>
                        </div>
                      )}

                      {/* Security Options */}
                      <div className="space-y-4 pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-foreground">Security Options</h4>
                        <p className="text-muted-foreground text-sm">Tap to select security layers for your wallet.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* PIN */}
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, securityPin: !createForm.securityPin })}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left",
                              createForm.securityPin
                                ? "bg-emerald-500/20 border-emerald-500/40 ring-2 ring-emerald-500/30"
                                : "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Lock className={cn("w-5 h-5", createForm.securityPin ? "text-emerald-400" : "text-foreground/60")} />
                              {createForm.securityPin && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
                            </div>
                            <p className={cn("font-medium", createForm.securityPin ? "text-foreground" : "text-foreground/80")}>PIN</p>
                            <p className="text-xs text-muted-foreground">4-12 digit code</p>
                          </button>

                          {/* Password */}
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, securityPassword: !createForm.securityPassword })}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left",
                              createForm.securityPassword
                                ? "bg-blue-500/20 border-blue-500/40 ring-2 ring-blue-500/30"
                                : "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Key className={cn("w-5 h-5", createForm.securityPassword ? "text-blue-400" : "text-foreground/60")} />
                              {createForm.securityPassword && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                            </div>
                            <p className={cn("font-medium", createForm.securityPassword ? "text-foreground" : "text-foreground/80")}>Password</p>
                            <p className="text-xs text-muted-foreground">8+ characters</p>
                          </button>

                          {/* Biometric */}
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, securityBiometric: !createForm.securityBiometric })}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left",
                              createForm.securityBiometric
                                ? "bg-purple-500/20 border-purple-500/40 ring-2 ring-purple-500/30"
                                : "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Fingerprint className={cn("w-5 h-5", createForm.securityBiometric ? "text-purple-400" : "text-foreground/60")} />
                              {createForm.securityBiometric && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                            </div>
                            <p className={cn("font-medium", createForm.securityBiometric ? "text-foreground" : "text-foreground/80")}>Biometric</p>
                            <p className="text-xs text-muted-foreground">Face ID / Touch</p>
                          </button>

                          {/* Hardware Key */}
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, securityHardwareKey: !createForm.securityHardwareKey })}
                            className={cn(
                              "p-4 rounded-xl border transition-all text-left",
                              createForm.securityHardwareKey
                                ? "bg-amber-500/20 border-amber-500/40 ring-2 ring-amber-500/30"
                                : "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Shield className={cn("w-5 h-5", createForm.securityHardwareKey ? "text-amber-400" : "text-foreground/60")} />
                              {createForm.securityHardwareKey && <Check className="w-4 h-4 text-amber-400 ml-auto" />}
                            </div>
                            <p className={cn("font-medium", createForm.securityHardwareKey ? "text-foreground" : "text-foreground/80")}>Hardware</p>
                            <p className="text-xs text-muted-foreground">YubiKey / Key</p>
                          </button>
                        </div>

                        {/* PIN Input (shows when PIN is selected) */}
                        {createForm.securityPin && (
                          <div className="relative">
                            <Input
                              type={showPin ? "text" : "password"}
                              value={createForm.pin}
                              onChange={(e) => setCreateForm({ ...createForm, pin: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                              placeholder="Enter 4-12 digit PIN"
                              maxLength={12}
                              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground text-center text-xl tracking-[0.5em] font-mono pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPin(!showPin)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        )}

                        {/* Password Input (shows when Password is selected) */}
                        {createForm.securityPassword && (
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={createForm.password}
                              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                              placeholder="Enter password (8+ characters)"
                              className="h-12 bg-foreground/5 border-border rounded-xl text-foreground pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleCreateWallet}
                          disabled={isCreating || !createForm.label}
                          className="h-12 px-8 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                        >
                          {isCreating ? (
                            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Plus className="w-5 h-5 mr-2" />
                          )}
                          {isCreating ? 'Creating...' : 'Create Wallet'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowCreateForm(false)
                            resetCreateForm()
                          }}
                          className="h-12 px-6 bg-foreground/5 hover:bg-foreground/10 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Wallets List */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Wallets</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-foreground/5 p-6 animate-pulse">
                  <div className="h-8 bg-foreground/10 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-foreground/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : wallets.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg mb-6">No wallets yet</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                >
                  Create Your First Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const isExpanded = expandedWallet === wallet.id
                const totalUSD = getTotalUSDValue(wallet)

                return (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    
                    {/* Collapsed Header */}
                    <div
                      onClick={() => handleUnlockWallet(wallet)}
                      className="relative z-10 p-6 cursor-pointer hover:bg-foreground/5 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-border flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-foreground">{wallet.label}</h3>
                              {(wallet.has_pin || wallet.has_password || wallet.biometric_enabled || wallet.hardware_key_enabled) && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-full">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Secured
                                </Badge>
                              )}
                            </div>
                            <p className="font-mono text-muted-foreground text-sm">{formatAddress(wallet.address)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="text-2xl font-bold text-foreground">${totalUSD}</p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="relative z-10 border-t border-border"
                        >
                          <div className="p-6 space-y-6">
                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(wallet.address)
                                }}
                                className="h-11 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl"
                              >
                                {copiedText === wallet.address ? (
                                  <><Check className="w-4 h-4 mr-2" /> Copied</>
                                ) : (
                                  <><Copy className="w-4 h-4 mr-2" /> Copy Address</>
                                )}
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedWallet(wallet)
                                  setShowQRModal(true)
                                }}
                                className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl"
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                QR Code
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedWallet(wallet)
                                  setShowSendModal(true)
                                }}
                                className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedWallet(wallet)
                                  setSwapForm({ fromToken: 'ETH', toToken: 'USDC', amount: '', slippage: '0.5' })
                                  setSwapQuote(null)
                                  setShowSwapModal(true)
                                }}
                                className="h-11 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl"
                              >
                                <ArrowLeftRight className="w-4 h-4 mr-2" />
                                Swap
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSync(wallet.id, wallet.address)
                                }}
                                disabled={isSyncing[wallet.id]}
                                className="h-11 bg-foreground/10 hover:bg-foreground/20 rounded-xl"
                              >
                                <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing[wallet.id] && "animate-spin")} />
                                {isSyncing[wallet.id] ? 'Syncing...' : 'Sync'}
                              </Button>
                            </div>

                            {/* Balances */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {wallet.balance_eth && parseFloat(wallet.balance_eth) > 0 && (
                                <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">ETH</p>
                                  <p className="text-2xl font-bold text-foreground">
                                    ${calculateUSDValue(wallet.balance_eth, 'ETH')}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {parseFloat(wallet.balance_eth).toFixed(6)} ETH
                                  </p>
                                </div>
                              )}
                              {wallet.balance_usdc && parseFloat(wallet.balance_usdc) > 0 && (
                                <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">USDC</p>
                                  <p className="text-2xl font-bold text-foreground">
                                    ${parseFloat(wallet.balance_usdc).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {parseFloat(wallet.balance_usdc).toFixed(2)} USDC
                                  </p>
                                </div>
                              )}
                              {(!wallet.balance_eth || parseFloat(wallet.balance_eth) === 0) &&
                               (!wallet.balance_usdc || parseFloat(wallet.balance_usdc) === 0) && (
                                <div className="p-4 rounded-xl bg-foreground/5 border border-border col-span-full">
                                  <p className="text-muted-foreground text-center">Click "Sync" to fetch balances</p>
                                </div>
                              )}
                            </div>

                            {/* Security Info */}
                            <div className="flex flex-wrap gap-2">
                              {wallet.has_pin && (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-lg px-3 py-1">
                                  <Lock className="w-3 h-3 mr-1" /> PIN
                                </Badge>
                              )}
                              {wallet.has_password && (
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 rounded-lg px-3 py-1">
                                  <Key className="w-3 h-3 mr-1" /> Password
                                </Badge>
                              )}
                              {wallet.biometric_enabled && (
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 rounded-lg px-3 py-1">
                                  <Fingerprint className="w-3 h-3 mr-1" /> Biometric
                                </Badge>
                              )}
                              {wallet.hardware_key_enabled && (
                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-lg px-3 py-1">
                                  <Shield className="w-3 h-3 mr-1" /> Hardware Key
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && selectedWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowSendModal(false)
              setSelectedWallet(null)
              setSendForm({ to: '', amount: '', currency: 'ETH', pin: '', password: '' })
              setError(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Send {sendForm.currency}</h2>
                  <button
                    onClick={() => {
                      setShowSendModal(false)
                      setSelectedWallet(null)
                      setSendForm({ to: '', amount: '', currency: 'ETH', pin: '', password: '' })
                      setError(null)
                    }}
                    className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">From</label>
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                      <p className="font-semibold text-foreground">{selectedWallet.label}</p>
                      <p className="font-mono text-sm text-muted-foreground">{formatAddress(selectedWallet.address)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">To Address</label>
                    <Input
                      value={sendForm.to}
                      onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                      placeholder="0x..."
                      className="h-14 bg-foreground/5 border-border rounded-xl text-foreground font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Amount</label>
                      <Input
                        type="number"
                        value={sendForm.amount}
                        onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                        placeholder="0.0"
                        className="h-14 bg-foreground/5 border-border rounded-xl text-foreground text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Currency</label>
                      <select
                        value={sendForm.currency}
                        onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}
                        className="w-full h-14 bg-foreground/5 border border-border rounded-xl px-4 text-foreground"
                      >
                        {['ETH', 'USDC', 'USDT', 'DAI'].map((token) => (
                          <option key={token} value={token} className="bg-background">
                            {token}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedWallet.has_pin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Enter PIN</label>
                      <Input
                        type="password"
                        value={sendForm.pin}
                        onChange={(e) => setSendForm({ ...sendForm, pin: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                        placeholder="••••"
                        maxLength={12}
                        className="h-14 bg-foreground/5 border-border rounded-xl text-foreground text-center text-2xl tracking-[0.5em]"
                      />
                    </div>
                  )}

                  {selectedWallet.has_password && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Enter Password</label>
                      <Input
                        type="password"
                        value={sendForm.password}
                        onChange={(e) => setSendForm({ ...sendForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="h-14 bg-foreground/5 border-border rounded-xl text-foreground"
                      />
                    </div>
                  )}

                  {selectedWallet.hardware_key_enabled && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-amber-400" />
                        <div>
                          <p className="font-medium text-amber-400">Hardware Key Required</p>
                          <p className="text-xs text-amber-400/70">You'll be prompted to tap your security key</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedWallet.biometric_enabled && (
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-purple-400">Biometric Required</p>
                          <p className="text-xs text-purple-400/70">You'll be prompted for Face ID / Touch ID</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSend}
                    disabled={isSending || !sendForm.to || !sendForm.amount}
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold text-lg disabled:opacity-50"
                  >
                    {isSending ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSending ? 'Sending...' : 'Send Transaction'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Wallet Modal */}
      <AnimatePresence>
        {unlockingWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setUnlockingWallet(null)
              setUnlockPin('')
              setUnlockPassword('')
              setError(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Unlock Wallet</h2>
                  </div>
                  <button
                    onClick={() => {
                      setUnlockingWallet(null)
                      setUnlockPin('')
                      setUnlockPassword('')
                      setError(null)
                    }}
                    className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {(() => {
                    const wallet = wallets.find(w => w.id === unlockingWallet)
                    if (!wallet) return null
                    
                    return (
                      <>
                        {/* Wallet Info */}
                        <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                          <p className="font-semibold text-foreground">{wallet.label}</p>
                          <p className="font-mono text-sm text-muted-foreground">{formatAddress(wallet.address)}</p>
                        </div>

                        {/* Required Security Methods */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-foreground/60">Security verification required:</p>
                          <div className="flex flex-wrap gap-2">
                            {wallet.hardware_key_enabled && (
                              <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-amber-400" />
                                <span className="text-amber-400 text-sm">Hardware Key</span>
                              </div>
                            )}
                            {wallet.biometric_enabled && (
                              <div className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
                                <Fingerprint className="h-4 w-4 text-purple-400" />
                                <span className="text-purple-400 text-sm">Biometric</span>
                              </div>
                            )}
                            {wallet.has_pin && (
                              <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm">PIN</span>
                              </div>
                            )}
                            {wallet.has_password && (
                              <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                <Key className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-400 text-sm">Password</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PIN Input */}
                        {wallet.has_pin && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Enter PIN</label>
                            <div className="relative">
                              <Input
                                type={showUnlockPin ? "text" : "password"}
                                value={unlockPin}
                                onChange={(e) => setUnlockPin(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                placeholder="••••"
                                maxLength={12}
                                className="h-14 bg-foreground/5 border-border rounded-xl text-foreground text-center text-2xl tracking-[0.5em] font-mono pr-12"
                              />
                              <button
                                type="button"
                                onClick={() => setShowUnlockPin(!showUnlockPin)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showUnlockPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Password Input */}
                        {wallet.has_password && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">Enter Password</label>
                            <div className="relative">
                              <Input
                                type={showUnlockPassword ? "text" : "password"}
                                value={unlockPassword}
                                onChange={(e) => setUnlockPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-14 bg-foreground/5 border-border rounded-xl text-foreground pr-12"
                              />
                              <button
                                type="button"
                                onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showUnlockPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Hardware/Biometric Notice */}
                        {(wallet.hardware_key_enabled || wallet.biometric_enabled) && (
                          <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                            <p className="text-foreground/60 text-sm">
                              {wallet.hardware_key_enabled && wallet.biometric_enabled
                                ? "You'll be prompted for your hardware key first, then biometric."
                                : wallet.hardware_key_enabled
                                ? "You'll be prompted to tap your hardware security key."
                                : "You'll be prompted for Face ID / Touch ID."}
                            </p>
                          </div>
                        )}
                      </>
                    )
                  })()}

                  <Button
                    onClick={verifyUnlock}
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold text-lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Unlock Wallet
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && selectedWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowQRModal(false)
              setSelectedWallet(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Receive</h2>
                  <button
                    onClick={() => {
                      setShowQRModal(false)
                      setSelectedWallet(null)
                    }}
                    className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-white p-6 rounded-2xl flex justify-center">
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-600 rounded-xl">
                      QR Code
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
                    <p className="font-mono text-foreground break-all">{selectedWallet.address}</p>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(selectedWallet.address)}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                  >
                    {copiedText === selectedWallet.address ? (
                      <><Check className="w-4 h-4 mr-2" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy Address</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swap Modal */}
      <AnimatePresence>
        {showSwapModal && selectedWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowSwapModal(false)
              setSelectedWallet(null)
              setSwapQuote(null)
              setError(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <ArrowLeftRight className="h-5 w-5 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Swap Tokens</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowSwapModal(false)
                      setSelectedWallet(null)
                      setSwapQuote(null)
                      setError(null)
                    }}
                    className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* From Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">From</label>
                    <div className="flex gap-3">
                      <select
                        value={swapForm.fromToken}
                        onChange={(e) => {
                          setSwapForm({ ...swapForm, fromToken: e.target.value })
                          setSwapQuote(null)
                        }}
                        className="w-28 h-14 bg-foreground/5 border border-border rounded-xl px-4 text-foreground"
                      >
                        <option value="ETH" className="bg-background">ETH</option>
                        <option value="USDC" className="bg-background">USDC</option>
                        <option value="USDT" className="bg-background">USDT</option>
                        <option value="DAI" className="bg-background">DAI</option>
                        <option value="WETH" className="bg-background">WETH</option>
                      </select>
                      <Input
                        type="number"
                        value={swapForm.amount}
                        onChange={(e) => {
                          setSwapForm({ ...swapForm, amount: e.target.value })
                          setSwapQuote(null)
                        }}
                        placeholder="0.0"
                        className="flex-1 h-14 bg-foreground/5 border-border rounded-xl text-foreground text-lg"
                      />
                    </div>
                    {selectedWallet && (
                      <p className="text-xs text-muted-foreground">
                        Balance: {swapForm.fromToken === 'ETH' 
                          ? `${parseFloat(selectedWallet.balance_eth || '0').toFixed(6)} ETH`
                          : `${parseFloat(selectedWallet.balance_usdc || '0').toFixed(2)} USDC`}
                      </p>
                    )}
                  </div>

                  {/* Swap Arrow */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setSwapForm({
                          ...swapForm,
                          fromToken: swapForm.toToken,
                          toToken: swapForm.fromToken
                        })
                        setSwapQuote(null)
                      }}
                      className="h-10 w-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                    >
                      <ArrowLeftRight className="w-5 h-5 text-foreground/60 rotate-90" />
                    </button>
                  </div>

                  {/* To Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">To</label>
                    <div className="flex gap-3">
                      <select
                        value={swapForm.toToken}
                        onChange={(e) => {
                          setSwapForm({ ...swapForm, toToken: e.target.value })
                          setSwapQuote(null)
                        }}
                        className="w-28 h-14 bg-foreground/5 border border-border rounded-xl px-4 text-foreground"
                      >
                        <option value="ETH" className="bg-background">ETH</option>
                        <option value="USDC" className="bg-background">USDC</option>
                        <option value="USDT" className="bg-background">USDT</option>
                        <option value="DAI" className="bg-background">DAI</option>
                        <option value="WETH" className="bg-background">WETH</option>
                      </select>
                      <div className="flex-1 h-14 bg-foreground/5 border border-border rounded-xl px-4 flex items-center">
                        {isGettingQuote ? (
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        ) : swapQuote ? (
                          <span className="text-lg text-foreground">{parseFloat(swapQuote.amountOut).toFixed(6)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Slippage */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">Slippage Tolerance</label>
                    <div className="flex gap-2">
                      {['0.1', '0.5', '1.0'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setSwapForm({ ...swapForm, slippage: val })}
                          className={cn(
                            "flex-1 h-10 rounded-xl border transition-all text-sm font-medium",
                            swapForm.slippage === val
                              ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                              : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10"
                          )}
                        >
                          {val}%
                        </button>
                      ))}
                      <Input
                        type="number"
                        value={swapForm.slippage}
                        onChange={(e) => setSwapForm({ ...swapForm, slippage: e.target.value })}
                        placeholder="Custom"
                        className="w-20 h-10 bg-foreground/5 border-border rounded-xl text-foreground text-center text-sm"
                      />
                    </div>
                  </div>

                  {/* Quote Details */}
                  {swapQuote && (
                    <div className="p-4 rounded-xl bg-foreground/5 border border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="text-foreground">
                          1 {swapForm.fromToken} ≈ {(parseFloat(swapQuote.amountOut) / parseFloat(swapForm.amount)).toFixed(4)} {swapForm.toToken}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Impact</span>
                        <span className={cn(
                          parseFloat(swapQuote.priceImpact) > 5 ? "text-red-400" : "text-foreground"
                        )}>
                          {swapQuote.priceImpact}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Gas</span>
                        <span className="text-foreground">{swapQuote.gasEstimate} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Route</span>
                        <span className="text-foreground">{swapQuote.route}</span>
                      </div>
                    </div>
                  )}

                  {/* Security Requirements */}
                  {(selectedWallet.hardware_key_enabled || selectedWallet.biometric_enabled) && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-amber-400 text-sm">
                        {selectedWallet.hardware_key_enabled 
                          ? "Hardware key verification required for swap"
                          : "Biometric verification required for swap"}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={getSwapQuote}
                      disabled={isGettingQuote || !swapForm.amount || parseFloat(swapForm.amount) <= 0 || swapForm.fromToken === swapForm.toToken}
                      className="flex-1 h-14 bg-foreground/10 hover:bg-foreground/20 rounded-xl font-semibold disabled:opacity-50"
                    >
                      {isGettingQuote ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-5 h-5 mr-2" />
                      )}
                      {isGettingQuote ? 'Getting Quote...' : 'Get Quote'}
                    </Button>
                    <Button
                      onClick={handleSwap}
                      disabled={isSwapping || !swapQuote}
                      className="flex-1 h-14 bg-purple-500 text-white hover:bg-purple-600 rounded-xl font-semibold disabled:opacity-50"
                    >
                      {isSwapping ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <ArrowLeftRight className="w-5 h-5 mr-2" />
                      )}
                      {isSwapping ? 'Swapping...' : 'Swap'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Rep Modal */}
      <AnimatePresence>
        {showPayRepModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={resetPayRepModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                {/* Header */}
                <div className="sticky top-0 bg-background/80 backdrop-blur-xl p-6 border-b border-border flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Pay Rep Commission</h2>
                  </div>
                  <button
                    onClick={resetPayRepModal}
                    className="h-10 w-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-foreground/60" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Step 1: Search Rep */}
                  {payRepStep === 'search' && (
                    <div className="space-y-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          value={repSearchQuery}
                          onChange={(e) => setRepSearchQuery(e.target.value)}
                          placeholder="Search rep by name or email..."
                          className="h-14 pl-12 bg-foreground/5 border-border rounded-xl text-foreground"
                        />
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredReps.map((rep) => (
                          <button
                            key={rep.id}
                            onClick={() => handleSelectRep(rep)}
                            disabled={rep.balance_owed <= 0}
                            className={cn(
                              "w-full p-4 rounded-xl text-left transition-all border",
                              rep.balance_owed > 0
                                ? "bg-foreground/5 border-border hover:bg-foreground/10 hover:border-border"
                                : "bg-foreground/[0.03] border-border opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                                  <Users className="h-6 w-6 text-foreground/60" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {rep.first_name} {rep.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{rep.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Balance Owed</p>
                                <p className={cn(
                                  "text-xl font-bold",
                                  rep.balance_owed > 0 ? "text-emerald-400" : "text-muted-foreground"
                                )}>
                                  ${rep.balance_owed.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {!rep.has_wallet && (
                              <p className="mt-2 text-xs text-amber-400">⚠️ No wallet configured</p>
                            )}
                          </button>
                        ))}
                        {filteredReps.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">No reps found</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Rep Details & Commissions */}
                  {payRepStep === 'details' && selectedRep && (
                    <div className="space-y-6">
                      {/* Rep Info */}
                      <div className="p-4 rounded-xl bg-foreground/5 border border-border">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Users className="h-7 w-7 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-foreground">
                              {selectedRep.first_name} {selectedRep.last_name}
                            </p>
                            <p className="text-muted-foreground">{selectedRep.email}</p>
                            {selectedRep.wallet_address && (
                              <p className="text-xs font-mono text-muted-foreground mt-1">
                                {selectedRep.wallet_address.slice(0, 10)}...{selectedRep.wallet_address.slice(-8)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-foreground/5 border border-border text-center">
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                          <p className="text-xl font-bold text-foreground">${selectedRep.total_earned.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-foreground/5 border border-border text-center">
                          <p className="text-sm text-muted-foreground">Already Paid</p>
                          <p className="text-xl font-bold text-foreground">${selectedRep.total_paid.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-sm text-emerald-400">Balance Owed</p>
                          <p className="text-xl font-bold text-emerald-400">${selectedRep.balance_owed.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Commissions List */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">Select Commissions to Pay</p>
                          <button
                            onClick={() => {
                              if (selectedCommissions.length === repCommissions.length) {
                                setSelectedCommissions([])
                              } else {
                                setSelectedCommissions(repCommissions.map(c => c.id))
                              }
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {selectedCommissions.length === repCommissions.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>

                        {payRepLoading ? (
                          <div className="flex justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : repCommissions.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">No approved commissions to pay</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {repCommissions.map((commission) => (
                              <button
                                key={commission.id}
                                onClick={() => {
                                  if (selectedCommissions.includes(commission.id)) {
                                    setSelectedCommissions(prev => prev.filter(id => id !== commission.id))
                                  } else {
                                    setSelectedCommissions(prev => [...prev, commission.id])
                                  }
                                }}
                                className={cn(
                                  "w-full p-3 rounded-xl text-left transition-all border",
                                  selectedCommissions.includes(commission.id)
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-foreground/5 border-border"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "h-5 w-5 rounded border-2 flex items-center justify-center",
                                      selectedCommissions.includes(commission.id)
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-border"
                                    )}>
                                      {selectedCommissions.includes(commission.id) && (
                                        <Check className="h-3 w-3 text-black" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm text-foreground">
                                        Order #{commission.order?.id?.slice(0, 8) || 'N/A'}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {commission.commission_rate}% of ${commission.order_total?.toFixed(2) || '0'}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-semibold text-emerald-400">
                                    ${Number(commission.commission_amount || 0).toFixed(2)}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Payment Total */}
                      <div className="p-4 rounded-xl bg-foreground/10 border border-border">
                        <div className="flex items-center justify-between">
                          <p className="text-foreground/60">Payment Total</p>
                          <p className="text-3xl font-bold text-foreground">
                            ${repCommissions
                              .filter(c => selectedCommissions.includes(c.id))
                              .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Notification Method */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground/60">Send Payment Notification Via</p>
                        <div className="flex gap-3">
                          {(['sms', 'email', 'both'] as const).map((method) => (
                            <button
                              key={method}
                              onClick={() => setNotificationMethod(method)}
                              className={cn(
                                "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center gap-2 capitalize",
                                notificationMethod === method
                                  ? "bg-foreground/10 border-border text-foreground"
                                  : "bg-foreground/5 border-border text-foreground/60"
                              )}
                            >
                              {method === 'sms' && <MessageSquare className="h-4 w-4" />}
                              {method === 'email' && <Mail className="h-4 w-4" />}
                              {method === 'both' && <><MessageSquare className="h-4 w-4" /><Mail className="h-4 w-4" /></>}
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setPayRepStep('search')}
                          className="h-12 px-6 bg-foreground/5 hover:bg-foreground/10 rounded-xl"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handlePayRep}
                          disabled={selectedCommissions.length === 0 || payRepLoading || !selectedRep.wallet_address}
                          className="flex-1 h-12 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-semibold disabled:opacity-50"
                        >
                          {payRepLoading ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <DollarSign className="h-5 w-5 mr-2" />
                              Pay Commission
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Processing */}
                  {payRepStep === 'confirm' && (
                    <div className="text-center py-12 space-y-6">
                      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Processing Payment</h3>
                        <p className="text-muted-foreground mt-2">Sending transaction to the blockchain...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Success */}
                  {payRepStep === 'success' && paymentResult && (
                    <div className="text-center py-8 space-y-6">
                      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Payment Sent!</h3>
                        <p className="text-muted-foreground mt-2">
                          Commission has been sent to {selectedRep?.first_name} {selectedRep?.last_name}
                        </p>
                      </div>

                      {paymentResult.transactionHash && (
                        <div className="p-4 rounded-xl bg-foreground/5 border border-border text-left">
                          <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm font-mono text-foreground break-all">
                              {paymentResult.transactionHash}
                            </code>
                            <button
                              onClick={() => copyToClipboard(paymentResult.transactionHash || '')}
                              className="p-2 rounded-lg hover:bg-foreground/10"
                            >
                              {copiedText === paymentResult.transactionHash ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                            <a
                              href={`https://etherscan.io/tx/${paymentResult.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-foreground/10"
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        A payment report link has been sent to the rep via {notificationMethod}.
                      </p>

                      <Button
                        onClick={resetPayRepModal}
                        className="h-12 px-8 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
