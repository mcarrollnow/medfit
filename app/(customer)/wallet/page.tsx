'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, Plus, Copy, QrCode, ExternalLink, Check, AlertCircle,
  Eye, EyeOff, Shield, Key, Fingerprint, Lock, ChevronDown, ChevronUp,
  ArrowDownLeft, ArrowUpRight, RefreshCw, Loader2, X, Coins, History,
  Send, ArrowLeftRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, color: '#627EEA', icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', decimals: 8, color: '#F7931A', icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, color: '#2775CA', icon: '$' },
  { symbol: 'USDT', name: 'Tether', decimals: 6, color: '#26A17B', icon: '₮' },
  { symbol: 'LTC', name: 'Litecoin', decimals: 8, color: '#BFBBBB', icon: 'Ł' },
  { symbol: 'DASH', name: 'Dash', decimals: 8, color: '#008CE7', icon: 'Đ' },
  { symbol: 'XRP', name: 'Ripple', decimals: 6, color: '#23292F', icon: '✕' },
  { symbol: 'DAI', name: 'Dai', decimals: 18, color: '#F5AC37', icon: '◈' },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18, color: '#8247E5', icon: '⬡' },
  { symbol: 'ARB', name: 'Arbitrum', decimals: 18, color: '#28A0F0', icon: '◇' },
  { symbol: 'OP', name: 'Optimism', decimals: 18, color: '#FF0420', icon: '◎' },
]

interface CustomerWallet {
  id: string
  label: string
  address: string
  currency: string
  is_primary: boolean
  is_active: boolean
  has_pin: boolean
  has_password: boolean
  has_biometric: boolean
  has_hardware_key: boolean
  created_at: string
}

export default function CustomerWalletPage() {
  const supabase = getSupabaseBrowserClient()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [wallets, setWallets] = useState<CustomerWallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  // Create wallet form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createdMnemonic, setCreatedMnemonic] = useState<string | null>(null)
  const [createdWalletId, setCreatedWalletId] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState({
    label: '',
    currency: 'ETH',
    generateNew: true,
    importMnemonic: '',
    securityPin: true,
    securityPassword: false,
    securityBiometric: false,
    securityHardwareKey: false,
    pin: '',
    password: '',
    isPrimary: false
  })
  const [showPin, setShowPin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  
  // Payment success state
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  // Expanded wallet state
  const [expandedWalletId, setExpandedWalletId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'history' | 'send' | 'swap' | 'receive'>('history')
  const [walletBalances, setWalletBalances] = useState<Record<string, string>>({})
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})
  const [walletTransactions, setWalletTransactions] = useState<Record<string, any[]>>({})
  const [isLoadingTx, setIsLoadingTx] = useState(false)
  const [sendForm, setSendForm] = useState({ to: '', amount: '' })
  const [sendInputMode, setSendInputMode] = useState<'usd' | 'crypto'>('usd') // Default to USD
  const [swapForm, setSwapForm] = useState({ toCurrency: 'USDC', amount: '' })
  const [swapInputMode, setSwapInputMode] = useState<'usd' | 'crypto'>('usd') // Default to USD
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState<{ txHash: string; explorerUrl: string } | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  
  // Security/unlock state
  const [unlockedWallets, setUnlockedWallets] = useState<Set<string>>(new Set())
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [walletToUnlock, setWalletToUnlock] = useState<CustomerWallet | null>(null)
  const [unlockPin, setUnlockPin] = useState('')
  const [unlockPassword, setUnlockPassword] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [unlockError, setUnlockError] = useState<string | null>(null)
  
  // Refresh state per wallet
  const [refreshingWallets, setRefreshingWallets] = useState<Set<string>>(new Set())
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null)

  // Fetch token prices from CoinGecko
  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,litecoin,ripple,matic-network,usd-coin,tether,dai&vs_currencies=usd'
        )
        const data = await response.json()
        setTokenPrices({
          ETH: data.ethereum?.usd || 3000,
          BTC: data.bitcoin?.usd || 60000,
          LTC: data.litecoin?.usd || 100,
          XRP: data.ripple?.usd || 0.5,
          MATIC: data['matic-network']?.usd || 1,
          USDC: 1,
          USDT: 1,
          DAI: 1,
          DASH: 30,
          ARB: data.ethereum?.usd * 0.001 || 1,
          OP: data.ethereum?.usd * 0.001 || 1,
        })
      } catch (err) {
        console.log('Price fetch error:', err)
        // Fallback prices
        setTokenPrices({
          ETH: 3000, BTC: 60000, LTC: 100, XRP: 0.5, MATIC: 1,
          USDC: 1, USDT: 1, DAI: 1, DASH: 30, ARB: 1, OP: 1
        })
      }
    }
    fetchPrices()
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  // Check auth and load wallets on mount
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        loadWallets()
      } else {
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }
    init()
  }, [])


  async function loadWallets() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/customer-wallet/list')
      const data = await response.json()
      if (data.success) {
        setWallets(data.wallets || [])
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load wallets')
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh single wallet balance
  async function refreshWalletBalance(wallet: CustomerWallet) {
    setRefreshingWallets(prev => new Set(prev).add(wallet.id))
    try {
      const response = await fetch(`/api/customer-wallet/balance?address=${wallet.address}&currency=${wallet.currency}`)
      const data = await response.json()
      if (data.balance) {
        setWalletBalances(prev => ({ ...prev, [wallet.id]: data.balance }))
      }
    } catch (err) {
      console.log('Refresh balance error:', err)
    } finally {
      setRefreshingWallets(prev => {
        const next = new Set(prev)
        next.delete(wallet.id)
        return next
      })
    }
  }

  // Set wallet as primary
  async function setPrimaryWallet(walletId: string) {
    setSettingPrimary(walletId)
    try {
      const response = await fetch('/api/customer-wallet/set-primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId })
      })
      const data = await response.json()
      if (data.success) {
        // Update local state
        setWallets(prev => prev.map(w => ({
          ...w,
          is_primary: w.id === walletId
        })))
      }
    } catch (err) {
      console.log('Set primary error:', err)
    } finally {
      setSettingPrimary(null)
    }
  }

  // Register WebAuthn credential (biometric or hardware key)
  async function registerWebAuthn(walletId: string, type: 'biometric' | 'hardware'): Promise<string | null> {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser')
      }

      // Get registration options from server
      const optionsRes = await fetch('/api/customer-wallet/webauthn/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId,
          authenticatorType: type === 'biometric' ? 'platform' : 'cross-platform'
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
      
      // Create credential - this triggers Face ID/Touch ID/fingerprint prompt
      const credential = await navigator.credentials.create({
        publicKey: options
      }) as PublicKeyCredential
      
      if (!credential) {
        throw new Error('Failed to create credential')
      }
      
      const response = credential.response as AuthenticatorAttestationResponse
      
      // Send credential to server to verify and store
      const verifyRes = await fetch('/api/customer-wallet/webauthn/register-verify', {
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
      setError(`${type === 'hardware' ? 'Hardware key' : 'Biometric'} setup failed: ${error.message}`)
      return null
    }
  }

  async function handleCreateWallet() {
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

    if (!createForm.securityPin && !createForm.securityPassword && !createForm.securityBiometric && !createForm.securityHardwareKey) {
      setError('At least one security method is required')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/customer-wallet/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          label: createForm.label,
          currency: createForm.currency,
          generateNew: createForm.generateNew,
          importMnemonic: !createForm.generateNew ? createForm.importMnemonic : undefined,
          pin: createForm.securityPin ? createForm.pin : undefined,
          password: createForm.securityPassword ? createForm.password : undefined,
          enableBiometric: createForm.securityBiometric,
          enableHardwareKey: createForm.securityHardwareKey,
          isPrimary: createForm.isPrimary
        })
      })

      const data = await response.json()

      if (data.success) {
        const walletId = data.wallet?.id
        setCreatedWalletId(walletId)

        if (data.mnemonic) {
          // For new wallets, show mnemonic first, then register WebAuthn after confirmation
          setCreatedMnemonic(data.mnemonic)
        } else {
          // For imported wallets (no mnemonic), register WebAuthn now
          if (walletId && createForm.securityBiometric) {
            await registerWebAuthn(walletId, 'biometric')
          }
          
          if (walletId && createForm.securityHardwareKey) {
            await registerWebAuthn(walletId, 'hardware')
          }
          
          setShowCreateForm(false)
          resetCreateForm()
          await loadWallets()
        }
      } else {
        setError(data.error || 'Failed to create wallet')
      }
    } catch (err) {
      setError('Failed to create wallet')
    } finally {
      setIsCreating(false)
    }
  }

  function resetCreateForm() {
    setCreateForm({
      label: '',
      currency: 'ETH',
      generateNew: true,
      importMnemonic: '',
      securityPin: true,
      securityPassword: false,
      securityBiometric: false,
      securityHardwareKey: false,
      pin: '',
      password: '',
      isPrimary: false
    })
    setCreatedMnemonic(null)
    setCreatedWalletId(null)
    setError(null)
    setShowPin(false)
    setShowPassword(false)
    setShowMnemonic(false)
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  function formatAddress(address: string) {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  function getTokenInfo(symbol: string) {
    return TOKENS.find(t => t.symbol === symbol) || TOKENS[0]
  }

  // Calculate USD value from crypto balance
  function calculateUSDValue(amount: string, currency: string): string {
    const balance = parseFloat(amount || '0')
    const price = tokenPrices[currency] || 0
    return (balance * price).toFixed(2)
  }

  // Load transactions for a wallet from Etherscan
  async function loadTransactions(wallet: CustomerWallet) {
    setIsLoadingTx(true)
    try {
      const response = await fetch(`/api/customer-wallet/transactions?address=${wallet.address}&currency=${wallet.currency}`)
      const data = await response.json()
      if (data.success && data.transactions) {
        setWalletTransactions(prev => ({ ...prev, [wallet.id]: data.transactions }))
      }
    } catch (err) {
      console.log('Failed to load transactions:', err)
    } finally {
      setIsLoadingTx(false)
    }
  }

  // Format date for display
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Format time for display
  function formatTime(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Handle wallet unlock
  async function handleUnlockWallet(wallet: CustomerWallet) {
    // If wallet has no security, just expand it
    if (!wallet.has_pin && !wallet.has_biometric && !wallet.has_hardware_key) {
      expandWallet(wallet)
      return
    }

    // If already unlocked, just toggle expansion
    if (unlockedWallets.has(wallet.id)) {
      if (expandedWalletId === wallet.id) {
        setExpandedWalletId(null)
      } else {
        expandWallet(wallet)
      }
      return
    }

    // Need to unlock - handle biometric first
    if (wallet.has_biometric || wallet.has_hardware_key) {
      try {
        setIsUnlocking(true)
        setWalletToUnlock(wallet)
        
        // Try WebAuthn
        const authOptions = await fetch('/api/customer-wallet/webauthn/auth-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: wallet.id })
        }).then(r => r.json())

        if (!authOptions.error) {
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: Uint8Array.from(atob(authOptions.challenge), c => c.charCodeAt(0)),
              rpId: authOptions.rpId || window.location.hostname,
              allowCredentials: authOptions.allowCredentials?.map((cred: any) => ({
                id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
                type: 'public-key'
              })),
              timeout: 60000,
              userVerification: 'required'
            }
          })

          if (credential) {
            // WebAuthn verified
            setUnlockedWallets(prev => new Set([...prev, wallet.id]))
            expandWallet(wallet)
            setIsUnlocking(false)
            return
          }
        }
      } catch (error) {
        console.log('WebAuthn error, falling back to PIN/password')
      }
      setIsUnlocking(false)
    }

    // Show unlock modal for PIN/password
    setWalletToUnlock(wallet)
    setUnlockPin('')
    setUnlockPassword('')
    setUnlockError(null)
    setShowUnlockModal(true)
  }

  // Verify unlock credentials
  async function verifyUnlock() {
    if (!walletToUnlock) return
    
    setIsUnlocking(true)
    setUnlockError(null)

    try {
      const response = await fetch('/api/customer-wallet/verify-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: walletToUnlock.id,
          pin: unlockPin || undefined,
          password: unlockPassword || undefined
        })
      })

      const data = await response.json()

      if (data.verified) {
        setUnlockedWallets(prev => new Set([...prev, walletToUnlock.id]))
        setShowUnlockModal(false)
        expandWallet(walletToUnlock)
      } else {
        setUnlockError(data.error || 'Verification failed')
      }
    } catch (error) {
      setUnlockError('Verification failed. Please try again.')
    } finally {
      setIsUnlocking(false)
    }
  }

  // Handle send transaction - wallet is already unlocked if user can see this
  // cryptoAmount is optional - if provided, it overrides sendForm.amount (used when input is in USD mode)
  async function handleSend(wallet: CustomerWallet, cryptoAmount?: number) {
    if (!sendForm.to || !sendForm.amount) {
      setSendError('Please enter recipient address and amount')
      return
    }

    // Use provided crypto amount or fall back to form amount
    const sendAmount = cryptoAmount ?? parseFloat(sendForm.amount)
    if (isNaN(sendAmount) || sendAmount <= 0) {
      setSendError('Please enter a valid amount')
      return
    }

    // Check if wallet is unlocked (user already authenticated to view it)
    const isUnlocked = unlockedWallets.has(wallet.id) || 
      (!wallet.has_pin && !wallet.has_password && !wallet.has_biometric && !wallet.has_hardware_key)
    
    if (!isUnlocked) {
      setSendError('Please unlock your wallet first')
      return
    }

    setIsSending(true)
    setSendError(null)
    setSendSuccess(null)

    try {
      // No need to send PIN - wallet is already unlocked via session
      const response = await fetch('/api/customer-wallet/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: wallet.id,
          toAddress: sendForm.to,
          amount: sendAmount.toString()  // Always send crypto amount
        })
      })

      const data = await response.json()

      if (data.success) {
        setSendSuccess({
          txHash: data.txHash,
          explorerUrl: data.explorerUrl
        })
        // Reset form
        setSendForm({ to: '', amount: '' })
        // Reload transactions after a delay
        setTimeout(() => loadTransactions(wallet), 3000)
      } else {
        setSendError(data.error || 'Failed to send transaction')
        if (data.details) {
          setSendError(`${data.error}: ${data.details}`)
        }
      }
    } catch (err: any) {
      setSendError(err.message || 'Failed to send transaction')
    } finally {
      setIsSending(false)
    }
  }

  // Expand wallet and load data
  function expandWallet(wallet: CustomerWallet) {
    setExpandedWalletId(wallet.id)
    setActiveTab('history')
    // Reset send states when switching wallets
    setSendSuccess(null)
    setSendError(null)
    setSendForm({ to: '', amount: '' })
    
    // Fetch balance
    fetch(`/api/customer-wallet/balance?address=${wallet.address}&currency=${wallet.currency}`)
      .then(res => res.json())
      .then(data => {
        if (data.balance) {
          setWalletBalances(prev => ({ ...prev, [wallet.id]: data.balance }))
        }
      })
      .catch(() => {})
    
    // Load transactions
    loadTransactions(wallet)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading wallets...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-8 text-center max-w-md w-full">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Please Log In</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to manage your wallets</p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground flex items-center gap-3">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center">
                <Wallet className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
              </div>
              My Wallets
            </h1>
            <p className="text-lg text-muted-foreground">Manage your crypto wallets for purchases</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Wallets List */}
        {wallets.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No Wallets Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Add a wallet to start making purchases with crypto</p>
            <Button
              onClick={() => setShowCreateForm(true)}
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Wallet
            </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {wallets.map((wallet, index) => {
              const tokenInfo = getTokenInfo(wallet.currency)
              const isExpanded = expandedWalletId === wallet.id
              const balance = walletBalances[wallet.id] || '0.00'
              
              return (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500",
                    isExpanded 
                      ? "bg-foreground/[0.08] border-border" 
                      : "bg-foreground/5 border-border hover:bg-foreground/[0.08] hover:border-border"
                  )}
                >
                  {/* Noise texture overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  
                  {/* Glow effect */}
                  <div 
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-all duration-500 opacity-10 group-hover:opacity-20"
                    style={{ backgroundColor: tokenInfo.color }}
                  />
                  {/* Wallet Header - Clickable */}
                  <div 
                    className="relative z-10 p-6 cursor-pointer"
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedWalletId(null)
                      } else {
                        handleUnlockWallet(wallet)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${tokenInfo.color}20` }}
                        >
                          <span style={{ color: tokenInfo.color }}>{tokenInfo.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{wallet.label}</h3>
                            {wallet.is_primary && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">Primary</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {wallet.currency}
                            </Badge>
                            <span className="text-zinc-500 text-sm font-mono">
                              {formatAddress(wallet.address)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(wallet.address, wallet.id)
                              }}
                              className="text-zinc-500 hover:text-foreground transition-colors"
                            >
                              {copiedText === wallet.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Balance - USD prominent, crypto below */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">${calculateUSDValue(balance, wallet.currency)}</div>
                          <div className="text-sm text-muted-foreground">{parseFloat(balance).toFixed(6)} {wallet.currency}</div>
                        </div>
                        
                        {/* Refresh Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            refreshWalletBalance(wallet)
                          }}
                          disabled={refreshingWallets.has(wallet.id)}
                          className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Refresh balance"
                        >
                          <RefreshCw className={cn(
                            "w-4 h-4 text-muted-foreground",
                            refreshingWallets.has(wallet.id) && "animate-spin"
                          )} />
                        </button>
                        
                        {/* Set Primary Button */}
                        {!wallet.is_primary && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPrimaryWallet(wallet.id)
                            }}
                            disabled={settingPrimary === wallet.id}
                            className="px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-emerald-500/20 hover:text-emerald-400 text-xs font-medium text-muted-foreground transition-colors disabled:opacity-50"
                            title="Set as primary wallet for store purchases"
                          >
                            {settingPrimary === wallet.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'Set Primary'
                            )}
                          </button>
                        )}
                        
                        {/* Security Indicators */}
                        <div className="flex items-center gap-1">
                          {wallet.has_pin && (
                            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center" title="PIN Protected">
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                          {wallet.has_biometric && (
                            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center" title="Biometric Enabled">
                              <Fingerprint className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                          {wallet.has_hardware_key && (
                            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center" title="Hardware Key">
                              <Key className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* Expand/Collapse Arrow */}
                        <div className="text-muted-foreground">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
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
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-10 border-t border-border"
                      >
                        {/* Action Tabs */}
                        <div className="flex border-b border-border bg-foreground/20">
                          <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                              "flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300",
                              activeTab === 'history' 
                                ? "text-emerald-400 bg-foreground/5 border-b-2 border-emerald-400 -mb-px" 
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            )}
                          >
                            <History className="w-4 h-4" />
                            History
                          </button>
                          <button
                            onClick={() => setActiveTab('send')}
                            className={cn(
                              "flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300",
                              activeTab === 'send' 
                                ? "text-emerald-400 bg-foreground/5 border-b-2 border-emerald-400 -mb-px" 
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            )}
                          >
                            <Send className="w-4 h-4" />
                            Send
                          </button>
                          <button
                            onClick={() => setActiveTab('swap')}
                            className={cn(
                              "flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300",
                              activeTab === 'swap' 
                                ? "text-purple-400 bg-foreground/5 border-b-2 border-purple-400 -mb-px" 
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            )}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                            Swap
                          </button>
                          <button
                            onClick={() => setActiveTab('receive')}
                            className={cn(
                              "flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300",
                              activeTab === 'receive' 
                                ? "text-blue-400 bg-foreground/5 border-b-2 border-blue-400 -mb-px" 
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            )}
                          >
                            <ArrowDownLeft className="w-4 h-4" />
                            Add Funds
                          </button>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-6">
                          {/* Transaction History */}
                          {activeTab === 'history' && (
                            <div>
                              {isLoadingTx ? (
                                <div className="text-center py-8 text-zinc-500">
                                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                                  <p>Loading transactions...</p>
                                </div>
                              ) : walletTransactions[wallet.id]?.length > 0 ? (
                                <div className="space-y-3">
                                  {walletTransactions[wallet.id].map((tx: any, idx: number) => (
                                    <div 
                                      key={tx.hash || idx}
                                      className="flex items-center justify-between p-4 bg-foreground/[0.04] rounded-2xl border border-border hover:bg-foreground/[0.07] hover:border-border transition-all duration-300 cursor-pointer"
                                      onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                                          tx.type === 'incoming' 
                                            ? "bg-emerald-500/20" 
                                            : "bg-red-500/20"
                                        )}>
                                          {tx.type === 'incoming' ? (
                                            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
                                          ) : (
                                            <ArrowUpRight className="w-6 h-6 text-red-400" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-foreground font-semibold">
                                            {tx.type === 'incoming' ? 'Received' : 'Sent'}
                                          </p>
                                          <p className="text-muted-foreground text-sm">
                                            {formatDate(tx.timestamp)} • {formatTime(tx.timestamp)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className={cn(
                                          "text-lg font-bold",
                                          tx.type === 'incoming' ? "text-emerald-400" : "text-red-400"
                                        )}>
                                          {tx.type === 'incoming' ? '+' : '-'}${calculateUSDValue(tx.amount, wallet.currency)}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                          {parseFloat(tx.amount).toFixed(6)} {wallet.currency}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {/* View on Explorer link */}
                                  <a
                                    href={`https://etherscan.io/address/${wallet.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm py-4 mt-2 rounded-xl hover:bg-foreground/5 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View all on Etherscan
                                  </a>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                  <p className="text-foreground font-medium mb-1">No transactions yet</p>
                                  <p className="text-muted-foreground text-sm mb-6">Transactions will appear here once you send or receive {wallet.currency}</p>
                                  <a
                                    href={`https://etherscan.io/address/${wallet.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View on Etherscan
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Send Tab */}
                          {activeTab === 'send' && (() => {
                            const tokenPrice = tokenPrices[wallet.currency] || 0
                            const inputAmount = parseFloat(sendForm.amount) || 0
                            
                            // Calculate based on input mode
                            const cryptoAmount = sendInputMode === 'usd' 
                              ? (tokenPrice > 0 ? inputAmount / tokenPrice : 0)
                              : inputAmount
                            const usdAmount = sendInputMode === 'usd'
                              ? inputAmount
                              : inputAmount * tokenPrice
                            
                            // For MAX button - always set crypto amount
                            const handleMax = () => {
                              if (sendInputMode === 'usd') {
                                // Convert balance to USD
                                const balanceUSD = parseFloat(balance) * tokenPrice
                                setSendForm({ ...sendForm, amount: balanceUSD.toFixed(2) })
                              } else {
                                setSendForm({ ...sendForm, amount: balance })
                              }
                            }
                            
                            return (
                              <div className="space-y-4">
                                {/* Success Message */}
                                {sendSuccess && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
                                  >
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-400" />
                                      </div>
                                      <span className="text-emerald-400 font-semibold">Transaction Sent!</span>
                                    </div>
                                    <p className="text-foreground/60 text-sm mb-2">Your transaction is being confirmed on the blockchain.</p>
                                    <a
                                      href={sendSuccess.explorerUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      View on Etherscan
                                    </a>
                                  </motion.div>
                                )}

                                {/* Error Message */}
                                {sendError && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                                  >
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <span className="text-red-400">{sendError}</span>
                                    </div>
                                    <button onClick={() => setSendError(null)} className="text-red-400/60 hover:text-red-400">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                )}

                                <div>
                                  <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">Recipient Address</label>
                                  <input
                                    value={sendForm.to}
                                    onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                                    placeholder={`Enter ${wallet.currency} address`}
                                    className="w-full h-14 rounded-2xl bg-foreground/5 border border-border text-foreground font-mono px-4 placeholder:text-muted-foreground focus:border-border focus:outline-none focus:ring-0 transition-colors"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Amount</label>
                                    <div className="flex items-center gap-2">
                                      {/* USD/Crypto Toggle */}
                                      <div className="flex items-center bg-foreground/5 rounded-lg p-0.5">
                                        <button
                                          onClick={() => {
                                            if (sendInputMode !== 'usd' && sendForm.amount) {
                                              // Convert current crypto amount to USD
                                              const newUsd = parseFloat(sendForm.amount) * tokenPrice
                                              setSendForm({ ...sendForm, amount: newUsd.toFixed(2) })
                                            }
                                            setSendInputMode('usd')
                                          }}
                                          className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                                            sendInputMode === 'usd' 
                                              ? "bg-emerald-500 text-white" 
                                              : "text-muted-foreground hover:text-foreground"
                                          )}
                                        >
                                          USD
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (sendInputMode !== 'crypto' && sendForm.amount && tokenPrice > 0) {
                                              // Convert current USD amount to crypto
                                              const newCrypto = parseFloat(sendForm.amount) / tokenPrice
                                              setSendForm({ ...sendForm, amount: newCrypto.toFixed(8) })
                                            }
                                            setSendInputMode('crypto')
                                          }}
                                          className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                                            sendInputMode === 'crypto' 
                                              ? "bg-emerald-500 text-white" 
                                              : "text-muted-foreground hover:text-foreground"
                                          )}
                                        >
                                          {wallet.currency}
                                        </button>
                                      </div>
                                      <button 
                                        onClick={handleMax}
                                        className="text-xs text-foreground font-semibold px-3 py-1.5 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                                      >
                                        MAX
                                      </button>
                                    </div>
                                  </div>
                                  <div className="bg-foreground/5 border border-border rounded-2xl p-5 hover:border-border transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {sendInputMode === 'usd' ? (
                                          <>
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-emerald-500/20">
                                              <span className="text-emerald-400 text-2xl font-bold">$</span>
                                            </div>
                                            <span className="text-foreground font-semibold text-lg">USD</span>
                                          </>
                                        ) : (
                                          <>
                                            <div 
                                              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                              style={{ backgroundColor: `${tokenInfo.color}20` }}
                                            >
                                              <span style={{ color: tokenInfo.color }}>{tokenInfo.icon}</span>
                                            </div>
                                            <span className="text-foreground font-semibold text-lg">{wallet.currency}</span>
                                          </>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <input
                                          type="number"
                                          value={sendForm.amount}
                                          onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                                          placeholder="0.00"
                                          className="bg-transparent border-0 text-right text-foreground text-3xl font-bold w-40 p-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/50"
                                        />
                                        <p className="text-muted-foreground text-sm mt-1">
                                          {sendInputMode === 'usd' 
                                            ? `≈ ${cryptoAmount.toFixed(6)} ${wallet.currency}`
                                            : `≈ $${usdAmount.toFixed(2)} USD`
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-4 border-t border-border">
                                      <span>Available</span>
                                      <span className="text-foreground/60">${calculateUSDValue(balance, wallet.currency)} ({parseFloat(balance).toFixed(6)} {wallet.currency})</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleSend(wallet, cryptoAmount)}
                                  disabled={!sendForm.to || !sendForm.amount || isSending || cryptoAmount <= 0}
                                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-lg disabled:opacity-50 transition-all duration-300"
                                >
                                  {isSending ? (
                                    <>
                                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-5 h-5 mr-2" />
                                      Send ${usdAmount.toFixed(2)}
                                    </>
                                  )}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                  {cryptoAmount > 0 && `Sending ${cryptoAmount.toFixed(6)} ${wallet.currency} to the blockchain`}
                                </p>
                              </div>
                            )
                          })()}
                          
                          {/* Swap Tab */}
                          {activeTab === 'swap' && (() => {
                            const fromPrice = tokenPrices[wallet.currency] || 0
                            const toPrice = tokenPrices[swapForm.toCurrency] || 0
                            const inputAmount = parseFloat(swapForm.amount) || 0
                            
                            // Calculate based on input mode
                            const fromCryptoAmount = swapInputMode === 'usd'
                              ? (fromPrice > 0 ? inputAmount / fromPrice : 0)
                              : inputAmount
                            const fromUSD = swapInputMode === 'usd'
                              ? inputAmount
                              : inputAmount * fromPrice
                            const toAmount = toPrice > 0 ? fromUSD / toPrice : 0
                            const toTokenInfo = getTokenInfo(swapForm.toCurrency)
                            
                            // For MAX button
                            const handleSwapMax = () => {
                              if (swapInputMode === 'usd') {
                                const balanceUSD = parseFloat(balance) * fromPrice
                                setSwapForm({ ...swapForm, amount: balanceUSD.toFixed(2) })
                              } else {
                                setSwapForm({ ...swapForm, amount: balance })
                              }
                            }
                            
                            return (
                              <div className="space-y-4">
                                {/* From Token */}
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">From</label>
                                    <div className="flex items-center gap-2">
                                      {/* USD/Crypto Toggle */}
                                      <div className="flex items-center bg-foreground/5 rounded-lg p-0.5">
                                        <button
                                          onClick={() => {
                                            if (swapInputMode !== 'usd' && swapForm.amount) {
                                              const newUsd = parseFloat(swapForm.amount) * fromPrice
                                              setSwapForm({ ...swapForm, amount: newUsd.toFixed(2) })
                                            }
                                            setSwapInputMode('usd')
                                          }}
                                          className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                                            swapInputMode === 'usd' 
                                              ? "bg-purple-500 text-white" 
                                              : "text-muted-foreground hover:text-foreground"
                                          )}
                                        >
                                          USD
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (swapInputMode !== 'crypto' && swapForm.amount && fromPrice > 0) {
                                              const newCrypto = parseFloat(swapForm.amount) / fromPrice
                                              setSwapForm({ ...swapForm, amount: newCrypto.toFixed(8) })
                                            }
                                            setSwapInputMode('crypto')
                                          }}
                                          className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                                            swapInputMode === 'crypto' 
                                              ? "bg-purple-500 text-white" 
                                              : "text-muted-foreground hover:text-foreground"
                                          )}
                                        >
                                          {wallet.currency}
                                        </button>
                                      </div>
                                      <button
                                        onClick={handleSwapMax}
                                        className="text-xs text-foreground font-semibold px-3 py-1.5 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                                      >
                                        MAX
                                      </button>
                                    </div>
                                  </div>
                                  <div className="bg-card border border-border rounded-2xl p-5 hover:border-border transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        {swapInputMode === 'usd' ? (
                                          <>
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-500/20">
                                              <span className="text-purple-400 text-2xl font-bold">$</span>
                                            </div>
                                            <div>
                                              <span className="text-foreground font-semibold text-lg">USD</span>
                                              <p className="text-muted-foreground text-sm">US Dollar</p>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div 
                                              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                              style={{ backgroundColor: `${tokenInfo.color}20` }}
                                            >
                                              <span style={{ color: tokenInfo.color }}>{tokenInfo.icon}</span>
                                            </div>
                                            <div>
                                              <span className="text-foreground font-semibold text-lg">{wallet.currency}</span>
                                              <p className="text-muted-foreground text-sm">{tokenInfo.name}</p>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <input
                                          type="number"
                                          value={swapForm.amount}
                                          onChange={(e) => setSwapForm({ ...swapForm, amount: e.target.value })}
                                          placeholder="0.00"
                                          className="bg-transparent border-0 text-right text-foreground text-3xl font-bold w-40 p-0 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/50"
                                        />
                                        <p className="text-muted-foreground text-sm mt-1">
                                          {swapInputMode === 'usd'
                                            ? `≈ ${fromCryptoAmount.toFixed(6)} ${wallet.currency}`
                                            : `≈ $${fromUSD.toFixed(2)} USD`
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                      <span>Available</span>
                                      <span className="text-foreground/60">${calculateUSDValue(balance, wallet.currency)} ({parseFloat(balance).toFixed(6)} {wallet.currency})</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Swap Arrow */}
                                <div className="flex justify-center -my-2 relative z-10">
                                  <div className="w-12 h-12 rounded-full bg-foreground/10 border border-border flex items-center justify-center backdrop-blur-xl shadow-lg">
                                    <ArrowLeftRight className="w-5 h-5 text-foreground" />
                                  </div>
                                </div>
                                
                                {/* To Token */}
                                <div>
                                  <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">To (estimated)</label>
                                  <div className="bg-card border border-border rounded-2xl p-5 hover:border-border transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div 
                                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                          style={{ backgroundColor: `${toTokenInfo.color}20` }}
                                        >
                                          <span style={{ color: toTokenInfo.color }}>{toTokenInfo.icon}</span>
                                        </div>
                                        <div>
                                          <select
                                            value={swapForm.toCurrency}
                                            onChange={(e) => setSwapForm({ ...swapForm, toCurrency: e.target.value })}
                                            className="bg-secondary text-foreground font-semibold text-lg appearance-none cursor-pointer pr-6 pl-2 py-1 rounded-lg border border-border focus:outline-none focus:border-border"
                                          >
                                            {TOKENS.filter(t => t.symbol !== wallet.currency).map(token => (
                                              <option key={token.symbol} value={token.symbol} className="bg-secondary text-foreground">
                                                {token.symbol}
                                              </option>
                                            ))}
                                          </select>
                                          <p className="text-muted-foreground text-sm mt-1">{toTokenInfo.name}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-3xl font-bold text-foreground">
                                          {toAmount > 0 ? toAmount.toFixed(6) : '0.00'}
                                        </p>
                                        <p className="text-muted-foreground text-sm mt-1">${fromUSD.toFixed(2)} USD</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Rate Info */}
                                {fromCryptoAmount > 0 && (
                                  <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Exchange Rate</span>
                                      <span className="text-foreground font-medium">1 {wallet.currency} = {(fromPrice / toPrice).toFixed(6)} {swapForm.toCurrency}</span>
                                    </div>
                                  </div>
                                )}
                                
                                <Button
                                  disabled={!swapForm.amount || fromCryptoAmount <= 0}
                                  onClick={() => {
                                    // Open Changelly with pre-filled swap (dark theme)
                                    // Always pass crypto amount to Changelly, not USD
                                    const url = `https://widget.changelly.com?from=${wallet.currency.toLowerCase()}&to=${swapForm.toCurrency.toLowerCase()}&amount=${fromCryptoAmount.toFixed(8)}&address=&fromDefault=${wallet.currency.toLowerCase()}&toDefault=${swapForm.toCurrency.toLowerCase()}&merchant_id=d2Lu6Us9TtnnJQX0&payment_id=&v=3&theme=dark&headerId=hide&backgroundColor=0d0d0d&textColor=ffffff&primaryColor=10b981`
                                    window.open(url, '_blank')
                                  }}
                                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold text-lg disabled:opacity-50 transition-all duration-300"
                                >
                                  <ArrowLeftRight className="w-5 h-5 mr-2" />
                                  Swap ${fromUSD.toFixed(2)} via Changelly
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                  Powered by Changelly • Best rates guaranteed
                                </p>
                              </div>
                            )
                          })()}
                          
                          {/* Add Funds Tab */}
                          {activeTab === 'receive' && (
                            <div className="space-y-4">
                              <div className="p-6 rounded-xl bg-foreground/5 border border-border text-center">
                                <Coins className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-foreground font-medium mb-2">Add Funds</p>
                                <p className="text-muted-foreground text-sm mb-4">
                                  Send cryptocurrency directly to your wallet address below
                                </p>
                                <div className="p-4 bg-foreground/30 rounded-lg mb-4">
                                  <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
                                  <p className="text-foreground font-mono text-sm break-all">{wallet.address}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(wallet.address)
                                  }}
                                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/20 transition"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Address
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Create Wallet Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                if (!createdMnemonic) {
                  setShowCreateForm(false)
                  resetCreateForm()
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-background border border-border rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl"
              >
                {createdMnemonic ? (
                  // Mnemonic Backup Screen
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-amber-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Backup Your Wallet</h2>
                      <p className="text-muted-foreground mt-2">
                        Write down these words in order. This is the ONLY way to recover your wallet.
                      </p>
                    </div>

                    <div className="bg-background border border-amber-500/30 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-400 text-sm font-medium">Recovery Phrase</span>
                        <button
                          onClick={() => setShowMnemonic(!showMnemonic)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className={cn(
                        "grid grid-cols-3 gap-2 transition-all",
                        !showMnemonic && "blur-md select-none"
                      )}>
                        {createdMnemonic.split(' ').map((word, i) => (
                          <div key={i} className="bg-card rounded px-2 py-1 text-sm">
                            <span className="text-zinc-500 mr-1">{i + 1}.</span>
                            <span className="text-foreground">{word}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(createdMnemonic, 'mnemonic')}
                        className="mt-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        {copiedText === 'mnemonic' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy to clipboard</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
                      <p className="text-red-400 text-sm">
                        ⚠️ Never share these words with anyone. Store them securely offline.
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        // Register WebAuthn after user confirms they saved mnemonic
                        if (createdWalletId) {
                          if (createForm.securityBiometric) {
                            await registerWebAuthn(createdWalletId, 'biometric')
                          }
                          
                          if (createForm.securityHardwareKey) {
                            await registerWebAuthn(createdWalletId, 'hardware')
                          }
                        }
                        
                        setShowCreateForm(false)
                        resetCreateForm()
                        loadWallets()
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      I've Saved My Recovery Phrase
                    </Button>
                  </div>
                ) : (
                  // Create Wallet Form
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground">Add Wallet</h2>
                      <button
                        onClick={() => {
                          setShowCreateForm(false)
                          resetCreateForm()
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Wallet Label */}
                      <div>
                        <label className="block text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Wallet Name</label>
                        <input
                          value={createForm.label}
                          onChange={e => setCreateForm({ ...createForm, label: e.target.value })}
                          placeholder="My Bitcoin Wallet"
                          className="w-full h-12 bg-foreground/5 border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:border-border focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Currency Selection */}
                      <div>
                        <label className="block text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Currency</label>
                        <div className="relative">
                          <select
                            value={createForm.currency}
                            onChange={e => setCreateForm({ ...createForm, currency: e.target.value })}
                            className="w-full h-12 bg-foreground/5 border border-border rounded-xl px-4 text-foreground appearance-none cursor-pointer focus:border-border focus:outline-none transition-colors"
                            style={{ color: 'white' }}
                          >
                            {TOKENS.map(token => (
                              <option key={token.symbol} value={token.symbol} style={{ backgroundColor: '#18181b', color: 'white' }}>
                                {token.icon} {token.name} ({token.symbol})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      {/* Create vs Import */}
                      <div>
                        <label className="block text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3">Wallet Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, generateNew: true })}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all",
                              createForm.generateNew
                                ? "border-border bg-foreground/10 text-foreground"
                                : "border-border bg-foreground/5 text-foreground/60 hover:border-border hover:bg-card/[0.07]"
                            )}
                          >
                            <Plus className="w-5 h-5 mb-2" />
                            <div className="font-semibold">Create New</div>
                            <div className="text-xs text-muted-foreground mt-1">Generate a new wallet</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCreateForm({ ...createForm, generateNew: false })}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all",
                              !createForm.generateNew
                                ? "border-border bg-foreground/10 text-foreground"
                                : "border-border bg-foreground/5 text-foreground/60 hover:border-border hover:bg-card/[0.07]"
                            )}
                          >
                            <ArrowDownLeft className="w-5 h-5 mb-2" />
                            <div className="font-semibold">Import Existing</div>
                            <div className="text-xs text-muted-foreground mt-1">Use seed phrase</div>
                          </button>
                        </div>
                      </div>

                      {/* Import Mnemonic */}
                      {!createForm.generateNew && (
                        <div>
                          <label className="block text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Recovery Phrase</label>
                          <textarea
                            value={createForm.importMnemonic}
                            onChange={e => setCreateForm({ ...createForm, importMnemonic: e.target.value })}
                            placeholder="Enter your 12 or 24 word recovery phrase..."
                            rows={3}
                            className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none focus:border-border focus:outline-none transition-colors"
                          />
                        </div>
                      )}

                      {/* Security Options */}
                      <div>
                        <label className="block text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3">Security (at least one required)</label>
                        <div className="space-y-2">
                          {/* PIN */}
                          <label className="flex items-center gap-3 p-4 bg-foreground/5 border border-border rounded-xl cursor-pointer hover:border-border transition-colors">
                            <input
                              type="checkbox"
                              checked={createForm.securityPin}
                              onChange={e => setCreateForm({ ...createForm, securityPin: e.target.checked })}
                              className="w-4 h-4 rounded border-border bg-foreground/10 text-foreground accent-white"
                            />
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="text-foreground font-medium">PIN</div>
                              <div className="text-xs text-muted-foreground">4-12 digit code</div>
                            </div>
                          </label>

                          {createForm.securityPin && (
                            <div className="ml-6">
                              <div className="relative">
                                <input
                                  type={showPin ? 'text' : 'password'}
                                  value={createForm.pin}
                                  onChange={e => setCreateForm({ ...createForm, pin: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                                  placeholder="Enter PIN"
                                  className="w-full h-11 bg-foreground/5 border border-border rounded-xl px-4 pr-10 text-foreground placeholder:text-muted-foreground focus:border-border focus:outline-none transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPin(!showPin)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/60"
                                >
                                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Password */}
                          <label className="flex items-center gap-3 p-4 bg-foreground/5 border border-border rounded-xl cursor-pointer hover:border-border transition-colors">
                            <input
                              type="checkbox"
                              checked={createForm.securityPassword}
                              onChange={e => setCreateForm({ ...createForm, securityPassword: e.target.checked })}
                              className="w-4 h-4 rounded border-border bg-foreground/10 text-foreground accent-white"
                            />
                            <Key className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="text-foreground font-medium">Password</div>
                              <div className="text-xs text-muted-foreground">Minimum 8 characters</div>
                            </div>
                          </label>

                          {createForm.securityPassword && (
                            <div className="ml-6">
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={createForm.password}
                                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                                  placeholder="Enter password"
                                  className="w-full h-11 bg-foreground/5 border border-border rounded-xl px-4 pr-10 text-foreground placeholder:text-muted-foreground focus:border-border focus:outline-none transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/60"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Biometric */}
                          <label className="flex items-center gap-3 p-4 bg-foreground/5 border border-border rounded-xl cursor-pointer hover:border-border transition-colors">
                            <input
                              type="checkbox"
                              checked={createForm.securityBiometric}
                              onChange={e => setCreateForm({ ...createForm, securityBiometric: e.target.checked })}
                              className="w-4 h-4 rounded border-border bg-foreground/10 text-foreground accent-white"
                            />
                            <Fingerprint className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="text-foreground font-medium">Biometric</div>
                              <div className="text-xs text-muted-foreground">Face ID or fingerprint</div>
                            </div>
                          </label>

                          {/* Hardware Key */}
                          <label className="flex items-center gap-3 p-4 bg-foreground/5 border border-border rounded-xl cursor-pointer hover:border-border transition-colors">
                            <input
                              type="checkbox"
                              checked={createForm.securityHardwareKey}
                              onChange={e => setCreateForm({ ...createForm, securityHardwareKey: e.target.checked })}
                              className="w-4 h-4 rounded border-border bg-foreground/10 text-foreground accent-white"
                            />
                            <Shield className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="text-foreground font-medium">Hardware Key</div>
                              <div className="text-xs text-muted-foreground">YubiKey or similar</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Primary Wallet */}
                      <label className="flex items-center gap-3 p-4 bg-foreground/5 border border-border rounded-xl cursor-pointer hover:border-border transition-colors">
                        <input
                          type="checkbox"
                          checked={createForm.isPrimary}
                          onChange={e => setCreateForm({ ...createForm, isPrimary: e.target.checked })}
                          className="w-4 h-4 rounded border-border bg-foreground/10 text-foreground accent-white"
                        />
                        <div>
                          <div className="text-foreground font-medium">Set as Primary</div>
                          <div className="text-xs text-muted-foreground">Use this wallet by default for purchases</div>
                        </div>
                      </label>

                      {/* Error */}
                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Submit */}
                      <Button
                        onClick={handleCreateWallet}
                        disabled={isCreating}
                        className="w-full h-12 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            {createForm.generateNew ? 'Create Wallet' : 'Import Wallet'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet Unlock Modal */}
        <AnimatePresence>
          {showUnlockModal && walletToUnlock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowUnlockModal(false)
                setUnlockPin('')
                setUnlockPassword('')
                setUnlockError(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border border-border rounded-3xl p-6 w-full max-w-md backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-foreground/10 border border-border flex items-center justify-center">
                      {walletToUnlock.has_biometric ? (
                        <Fingerprint className="w-6 h-6 text-foreground" />
                      ) : walletToUnlock.has_pin ? (
                        <Lock className="w-6 h-6 text-foreground" />
                      ) : (
                        <Shield className="w-6 h-6 text-foreground" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Unlock Wallet</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowUnlockModal(false)
                      setUnlockPin('')
                      setUnlockPassword('')
                      setUnlockError(null)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-6 p-4 bg-foreground/5 rounded-xl border border-border">
                  <p className="text-foreground font-medium mb-1">{walletToUnlock.label}</p>
                  <p className="text-muted-foreground text-sm font-mono">
                    {walletToUnlock.address.slice(0, 10)}...{walletToUnlock.address.slice(-8)}
                  </p>
                </div>

                {/* PIN Input */}
                {walletToUnlock.has_pin && (
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">Enter your PIN</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                      value={unlockPin}
                      onChange={(e) => setUnlockPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full bg-foreground/5 border border-border rounded-xl text-foreground text-center text-2xl tracking-[0.5em] h-14 focus:border-border focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && unlockPin) {
                          verifyUnlock()
                        }
                      }}
                    />
                  </div>
                )}

                {/* Password Input */}
                {walletToUnlock.has_password && !walletToUnlock.has_pin && (
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">Enter your password</label>
                    <input
                      type="password"
                      value={unlockPassword}
                      onChange={(e) => setUnlockPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-foreground/5 border border-border rounded-xl text-foreground h-14 px-4 focus:border-border focus:outline-none transition-colors placeholder:text-muted-foreground"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && unlockPassword) {
                          verifyUnlock()
                        }
                      }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {unlockError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {unlockError}
                  </div>
                )}

                <Button
                  onClick={verifyUnlock}
                  disabled={isUnlocking || (!unlockPin && !unlockPassword)}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-card/90 font-semibold rounded-xl"
                >
                  {isUnlocking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Unlock Wallet
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your wallet is secured with {walletToUnlock.has_pin ? 'PIN' : walletToUnlock.has_password ? 'password' : 'biometric'}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
