// Ethereum utility functions for payment processing

export interface PaymentRequest {
  id: string
  amount: number // USD amount
  ethAmount: string // ETH amount
  recipientAddress: string
  status: "pending" | "processing" | "completed" | "failed"
  transactionHash?: string
  createdAt: Date
}

export interface WalletConnection {
  address: string
  chainId: number
  isConnected: boolean
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  blockHash: string
  from: string
  to: string
  gasUsed: string
  status: "success" | "failed"
  confirmations: number
}

export interface TransactionStatus {
  hash: string
  status: "pending" | "confirmed" | "failed"
  confirmations: number
  blockNumber?: number
  timestamp?: number
  from?: string
  to?: string
  value?: string
}

// Fetch real-time ETH price from CoinGecko (free API)
export async function fetchEthPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum.usd
  } catch (error) {
    console.error('[Ethereum] Failed to fetch ETH price:', error)
    return 3000 // Fallback to $3000
  }
}

// Convert USD to ETH (using real-time price or fallback)
export async function convertUsdToEth(usdAmount: number): Promise<string> {
  const ETH_PRICE = await fetchEthPrice()
  const ethAmount = usdAmount / ETH_PRICE
  return ethAmount.toFixed(6)
}

// Synchronous version with provided price
export function convertUsdToEthSync(usdAmount: number, ethPrice: number): string {
  const ethAmount = usdAmount / ethPrice
  return ethAmount.toFixed(6)
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Check if Ethereum wallet is installed (Coinbase Wallet, Trust Wallet, etc.)
export function isWalletInstalled(): boolean {
  if (typeof window === "undefined") return false
  return typeof window.ethereum !== "undefined"
}

// Connect to Ethereum wallet (works with any EIP-1193 compatible wallet)
export async function connectWallet(): Promise<WalletConnection> {
  if (!isWalletInstalled()) {
    throw new Error("No Ethereum wallet detected. Please install Coinbase Wallet or another compatible wallet.")
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })

    return {
      address: accounts[0],
      chainId: Number.parseInt(chainId, 16),
      isConnected: true,
    }
  } catch (error) {
    console.error("[Ethereum] Wallet connection error:", error)
    throw new Error("Failed to connect wallet. Please try again.")
  }
}

// Create a payment request
export async function createPaymentRequest(usdAmount: number, recipientAddress: string): Promise<PaymentRequest> {
  const ethAmount = convertUsdToEth(usdAmount)

  const paymentRequest: PaymentRequest = {
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: usdAmount,
    ethAmount,
    recipientAddress,
    status: "pending",
    createdAt: new Date(),
  }

  console.log("[v0] Payment request created:", paymentRequest)
  return paymentRequest
}

// Send Ethereum payment via any connected wallet
export async function sendEthereumPayment(
  recipientAddress: string,
  ethAmount: string,
  fromAddress: string,
): Promise<string> {
  if (!isWalletInstalled()) {
    throw new Error("No Ethereum wallet detected")
  }

  try {
    // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
    const weiAmount = (Number.parseFloat(ethAmount) * 1e18).toString(16)

    const transactionHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: fromAddress,
          to: recipientAddress,
          value: `0x${weiAmount}`,
          gas: "0x5208", // 21000 gas (standard ETH transfer)
        },
      ],
    })

    console.log("[v0] Transaction sent:", transactionHash)
    return transactionHash
  } catch (error) {
    console.error("[v0] Payment error:", error)
    throw new Error("Payment failed. Please try again.")
  }
}

export async function getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt | null> {
  if (!isWalletInstalled()) {
    throw new Error("No Ethereum wallet detected")
  }

  try {
    const receipt = await window.ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [transactionHash],
    })

    if (!receipt) {
      return null
    }

    // Get current block number to calculate confirmations
    const currentBlock = await window.ethereum.request({
      method: "eth_blockNumber",
      params: [],
    })

    const confirmations = Number.parseInt(currentBlock, 16) - Number.parseInt(receipt.blockNumber, 16)

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: Number.parseInt(receipt.blockNumber, 16),
      blockHash: receipt.blockHash,
      from: receipt.from,
      to: receipt.to,
      gasUsed: Number.parseInt(receipt.gasUsed, 16).toString(),
      status: receipt.status === "0x1" ? "success" : "failed",
      confirmations: Math.max(0, confirmations),
    }
  } catch (error) {
    console.error("[v0] Error getting transaction receipt:", error)
    throw new Error("Failed to get transaction receipt")
  }
}

export async function getTransactionStatus(transactionHash: string): Promise<TransactionStatus> {
  if (!isWalletInstalled()) {
    throw new Error("No Ethereum wallet detected")
  }

  try {
    // Get transaction details
    const transaction = await window.ethereum.request({
      method: "eth_getTransactionByHash",
      params: [transactionHash],
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Get transaction receipt
    const receipt = await getTransactionReceipt(transactionHash)

    if (!receipt) {
      // Transaction is still pending
      return {
        hash: transactionHash,
        status: "pending",
        confirmations: 0,
        from: transaction.from,
        to: transaction.to,
        value: Number.parseInt(transaction.value, 16).toString(),
      }
    }

    // Transaction is confirmed
    return {
      hash: transactionHash,
      status: receipt.status === "success" ? "confirmed" : "failed",
      confirmations: receipt.confirmations,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      value: Number.parseInt(transaction.value, 16).toString(),
    }
  } catch (error) {
    console.error("[v0] Error getting transaction status:", error)
    throw new Error("Failed to get transaction status")
  }
}

export async function verifyPayment(
  transactionHash: string,
  expectedRecipient: string,
  expectedAmount: string,
): Promise<{ verified: boolean; message: string }> {
  try {
    const status = await getTransactionStatus(transactionHash)

    // Check if transaction is confirmed
    if (status.status === "pending") {
      return {
        verified: false,
        message: "Transaction is still pending confirmation",
      }
    }

    if (status.status === "failed") {
      return {
        verified: false,
        message: "Transaction failed on the blockchain",
      }
    }

    // Verify recipient address
    if (status.to?.toLowerCase() !== expectedRecipient.toLowerCase()) {
      return {
        verified: false,
        message: "Transaction recipient does not match expected address",
      }
    }

    // Convert expected amount to Wei for comparison
    const expectedWei = (Number.parseFloat(expectedAmount) * 1e18).toString()
    const actualWei = status.value || "0"

    // Allow for small differences due to rounding
    const difference = Math.abs(Number.parseFloat(expectedWei) - Number.parseFloat(actualWei))
    const tolerance = Number.parseFloat(expectedWei) * 0.01 // 1% tolerance

    if (difference > tolerance) {
      return {
        verified: false,
        message: "Transaction amount does not match expected amount",
      }
    }

    // Check for sufficient confirmations (at least 1)
    if (status.confirmations < 1) {
      return {
        verified: false,
        message: "Transaction needs more confirmations",
      }
    }

    return {
      verified: true,
      message: "Payment verified successfully",
    }
  } catch (error) {
    console.error("[v0] Error verifying payment:", error)
    return {
      verified: false,
      message: "Failed to verify payment",
    }
  }
}

// Get current network name
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    5: "Goerli Testnet",
    11155111: "Sepolia Testnet",
    137: "Polygon Mainnet",
    80001: "Polygon Mumbai Testnet",
  }

  return networks[chainId] || `Unknown Network (${chainId})`
}

// Type declarations for window.ethereum (EIP-1193 compatible wallets)
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean // Legacy - kept for compatibility
      isCoinbaseWallet?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<any>
      on?: (event: string, callback: (...args: any[]) => void) => void
      removeListener?: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
