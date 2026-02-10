"use client"

import { useState, useEffect } from "react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Download, Wallet, Smartphone, ChevronRight, Loader2, Package } from "lucide-react"
import type { ShippingAddress } from "@/lib/address-store"
import { getCurrentUser, getCustomerProfile } from "@/lib/auth-client"
import { WalletConnectModal } from "./wallet-connect-modal"
import { useCartStore } from "@/lib/cart-store"

interface VisualCryptoOnboardingProps {
  ethAmount: string
  ethPrice: number
  merchantAddress: string
  orderTotal: number
  onPaymentComplete: () => void
  onCreateOrder?: (shippingAddress: Omit<ShippingAddress, "id">) => Promise<{ orderId: string; orderNumber: string }>
}

export function VisualCryptoOnboarding({ 
  ethAmount, 
  ethPrice,
  merchantAddress,
  orderTotal,
  onPaymentComplete,
  onCreateOrder
}: VisualCryptoOnboardingProps) {
  const clearCart = useCartStore((state) => state.clearCart)
  const [step, setStep] = useState(1)
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [skipToPayment, setSkipToPayment] = useState(false)
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<'trust' | 'coinbase' | 'metamask' | 'other' | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [expandedQR, setExpandedQR] = useState<'load' | 'payment' | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setDevice(isMobile ? 'mobile' : 'desktop')
  }, [])

  // Auto-fill shipping address from customer profile
  useEffect(() => {
    async function loadCustomerInfo() {
      try {
        const user = await getCurrentUser()
        const profile = await getCustomerProfile()
        
        if (profile) {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          setShippingAddress({
            name: fullName,
            email: user?.email || (profile as any).email || '',
            phone: profile.phone || '',
            addressLine1: (profile as any).shipping_address_line1 || '',
            addressLine2: (profile as any).shipping_address_line2 || '',
            city: (profile as any).shipping_city || '',
            state: (profile as any).shipping_state || '',
            zipCode: (profile as any).shipping_zip || '',
            country: (profile as any).shipping_country || 'United States'
          })
        }
      } catch (error) {
        console.error('Failed to load customer info:', error)
      }
    }
    loadCustomerInfo()
  }, [])

  // Links
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const downloadUrl = isIOS 
    ? 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409'
    : 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
  
  // Calculate ETH amount needed (order total + gas)
  const gasPercent = 0.03 // 3% for gas
  const gasFeeEstimate = orderTotal * gasPercent
  const totalUsdToBuy = (orderTotal + gasFeeEstimate).toFixed(2)
  const totalEthNeeded = ((orderTotal + gasFeeEstimate) / ethPrice).toFixed(6)
  
  // Official Trust Wallet deep link format (from docs)
  // Buy: fiat_quantity is USD amount to spend
  const buyUrl = `https://link.trustwallet.com/buy?asset=c60&fiat_currency=USD&fiat_quantity=${totalUsdToBuy}`
  
  // Send: amount is ETH amount to send
  const ethAmountForPayment = parseFloat(ethAmount).toFixed(6)
  const payUrl = `https://link.trustwallet.com/send?asset=c60&address=${merchantAddress}&amount=${ethAmountForPayment}`
  
  // Universal Ethereum payment link (works with any wallet)
  const weiAmount = Math.floor(parseFloat(ethAmount) * 1e18).toString()
  const universalPaymentUrl = `ethereum:${merchantAddress}@1?value=${weiAmount}`

  const isShippingValid = 
    shippingAddress.name && shippingAddress.email && shippingAddress.phone && 
    shippingAddress.addressLine1 && shippingAddress.city && 
    shippingAddress.state && shippingAddress.zipCode

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-hidden">

      {/* Step 1: Shipping Address */}
      {step === 1 && (
        <Card className="border-0 md:border-2 border-primary overflow-hidden">
          <CardContent className="p-4 md:pt-8 md:pb-8 md:px-6 space-y-4">
            <div className="text-center mb-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Shipping Info</h2>
            </div>

            <div className="space-y-3 w-full mx-auto">
              <Input
                placeholder="Full Name"
                className="text-base"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
              />
              <Input
                type="email"
                placeholder="Email"
                className="text-base"
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
              />
              <Input
                type="tel"
                placeholder="Phone Number (for order updates)"
                className="text-base"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
              />
              <Input
                placeholder="Address"
                className="text-base"
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
              />
              <Input
                placeholder="Apt, Suite (optional)"
                className="text-base"
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="City"
                  className="text-base"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                />
                <Input
                  placeholder="State"
                  className="text-base"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                />
              </div>
              <Input
                placeholder="ZIP Code"
                className="text-base"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
              />
              <div className="text-center">
                <div className="mt-6">
                  {!isProcessingPayment ? (
                    <>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-semibold rounded-xl"
                        size="lg"
                        onClick={async () => {
                          if (onCreateOrder) {
                            try {
                              setIsProcessingPayment(true)
                              const orderData = await onCreateOrder(shippingAddress)
                              setOrderId(orderData.orderId)
                              setOrderNumber(orderData.orderNumber)
                              
                              // Clear cart after successful order creation
                              await clearCart()
                              console.log('[Checkout] Cart cleared after order creation')
                              
                              // Generate ethereum payment link
                              const ethAmountInWei = Math.floor(parseFloat(ethAmount) * 1e18).toString()
                              const paymentUrl = `ethereum:${merchantAddress}@1?value=${ethAmountInWei}`
                              
                              // Open wallet immediately
                              window.location.href = paymentUrl
                              
                              // Redirect to payment tracker after wallet opens
                              setTimeout(() => {
                                window.location.href = `/payment-status/${orderData.orderNumber}`
                              }, 1500)
                            } catch (error) {
                              console.error('Failed to create order:', error)
                              setIsProcessingPayment(false)
                            }
                          }
                        }}
                        disabled={!isShippingValid}
                      >
                        <Wallet className="mr-2 h-5 w-5" />
                        Pay Now with Crypto
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Opens your crypto wallet to complete payment
                      </p>
                    </>
                  ) : (
                    <div className="bg-green-600/10 border-2 border-green-600 rounded-xl p-6 text-center space-y-4 animate-pulse">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-green-600">Opening Wallet...</p>
                        <p className="text-sm text-foreground font-medium">
                          📱 Select "Allow" to open your wallet app
                        </p>
                        <p className="text-sm text-muted-foreground">
                          After confirming payment, come back to this page for payment status
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Download */}
      {step === 2 && !skipToPayment && (
        <Card className="border-2 border-primary overflow-hidden">
          <CardContent className="pt-6 pb-6 md:pt-8 md:pb-8 px-3 md:px-6 text-center space-y-6">
            {/* Trust Wallet Logo - Clickable */}
            <div 
              className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={() => {
                setSelectedWallet('trust')
                setShowWalletOptions(false) // Hide other options
              }}
            >
              <span className="text-5xl">🛡️</span>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Use Trust</h2>
              <p className="text-sm text-muted-foreground">Best choice for our store</p>
              {!selectedWallet && (
                <p className="text-xs text-muted-foreground mt-2 italic">Tap logo to continue</p>
              )}
            </div>

            {/* Next Step Button - Show if Trust selected */}
            {selectedWallet === 'trust' && !showWalletOptions && (
              <Button 
                size="lg" 
                className="w-full max-w-xs text-lg h-14"
                onClick={() => setStep(3)}
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {/* Use Another Wallet Button - Only show if Trust not selected yet */}
            {selectedWallet !== 'trust' && (
              <Button 
                variant="outline"
                size="lg"
                className="w-full max-w-xs"
                onClick={() => setShowWalletOptions(!showWalletOptions)}
              >
                Use another wallet
                <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${showWalletOptions ? 'rotate-90' : ''}`} />
              </Button>
            )}

            {/* Expanded Wallet Options */}
            {showWalletOptions && selectedWallet !== 'trust' && (
              <div className="w-full max-w-xs mx-auto space-y-2 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base h-12"
                  onClick={() => {
                    setSelectedWallet('coinbase')
                    setStep(3)
                  }}
                >
                  <span className="mr-3 text-xl">🔵</span>
                  Coinbase Wallet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base h-12"
                  onClick={() => {
                    setSelectedWallet('metamask')
                    setStep(3)
                  }}
                >
                  <span className="mr-3 text-xl">🦊</span>
                  MetaMask
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base h-12"
                  onClick={() => {
                    setSelectedWallet('other')
                    setStep(3)
                  }}
                >
                  <span className="mr-3 text-xl">💼</span>
                  Other Wallet
                </Button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 max-w-xs mx-auto pt-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Skip to Payment */}
            <Button 
              variant="outline"
              size="lg"
              className="w-full max-w-xs text-base"
              onClick={async () => {
                // Create order if not already created
                if (onCreateOrder && !orderId) {
                  const orderData = await onCreateOrder(shippingAddress as Omit<ShippingAddress, "id">)
                  setOrderId(orderData.orderId)
                  setOrderNumber(orderData.orderNumber)
                }
                setSkipToPayment(true)
              }}
            >
              Skip to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Universal Payment (Skip Flow) */}
      {skipToPayment && (
        <Card className="border-2 border-primary overflow-hidden">
          <CardContent className="pt-6 pb-6 md:pt-12 md:pb-12 text-center space-y-4 md:space-y-8">
            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10 text-blue-600" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Send Payment</h2>
              <p className="text-muted-foreground">Use any Ethereum wallet</p>
            </div>

            {/* Payment Details */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-muted rounded-lg p-6 space-y-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-2xl font-bold text-primary">{ethAmount} ETH</p>
                  <p className="text-sm text-muted-foreground">${orderTotal.toFixed(2)}</p>
                </div>
                
                <div className="h-px bg-border"></div>
                
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-2">To Address</p>
                  <div className="flex items-center gap-2 bg-background rounded p-3 min-w-0">
                    <code className="text-xs flex-1 truncate break-all">{merchantAddress}</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(merchantAddress)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Universal Payment Link */}
              <Button 
                size="lg" 
                className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // Store order ID for dashboard to auto-expand
                  if (orderId) {
                    localStorage.setItem('pending_order_id', orderId)
                    console.log('[Payment Button] Stored order ID in localStorage:', orderId)
                  }
                  // Open wallet in new tab
                  window.open(universalPaymentUrl, '_blank')
                  
                  // Redirect to dashboard immediately
                  const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl
                  const dashboardUrl = `${mainAppUrl}/dashboard`
                  console.log('[Payment Button] Redirecting to dashboard:', dashboardUrl)
                  window.location.href = dashboardUrl
                }}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Open in Wallet
              </Button>

              <p className="text-xs text-muted-foreground">
                Works with MetaMask, Trust Wallet, Coinbase Wallet, and more
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Load ETH */}
      {step === 3 && !skipToPayment && (
        <Card className="border-2 border-primary overflow-hidden">
          <CardContent className="pt-6 pb-6 md:pt-8 md:pb-8 px-3 md:px-6 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10 text-green-600" />
            </div>
            <div>
              {selectedWallet === 'trust' && (
                <>
                  <h2 className="text-3xl font-bold mb-2">Buy ${totalUsdToBuy}</h2>
                  <p className="text-sm text-muted-foreground">${orderTotal.toFixed(2)} + 3% gas</p>
                </>
              )}
              {selectedWallet === 'coinbase' && (
                <>
                  <h2 className="text-3xl font-bold mb-2">Load {ethAmount} ETH</h2>
                  <p className="text-sm text-muted-foreground">Buy in Coinbase Wallet</p>
                </>
              )}
              {selectedWallet === 'metamask' && (
                <>
                  <h2 className="text-3xl font-bold mb-2">Load {ethAmount} ETH</h2>
                  <p className="text-sm text-muted-foreground">Buy ETH and return</p>
                </>
              )}
              {selectedWallet === 'other' && (
                <>
                  <h2 className="text-3xl font-bold mb-2">You Need {ethAmount} ETH</h2>
                  <p className="text-sm text-muted-foreground">${orderTotal.toFixed(2)}</p>
                </>
              )}
            </div>
            
            {/* Trust Wallet - Buy ETH flow */}
            {selectedWallet === 'trust' && device === 'mobile' && (
              <>
                <Button 
                  size="lg" 
                  className="w-full max-w-xs text-lg h-14 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    window.location.href = buyUrl
                    setTimeout(() => setStep(4), 5000)
                  }}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Buy in App
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(4)}
                  className="text-primary"
                >
                  Already loaded? <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            )}

            {/* Trust Wallet - Desktop: QR code */}
            {selectedWallet === 'trust' && device !== 'mobile' && (
              <div className="space-y-4">
                <div className="inline-block">
                  <QRCodeDisplay value={buyUrl} size={200} />
                </div>
                <p className="text-sm text-muted-foreground">Scan with Trust Wallet to buy</p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full max-w-xs"
                  onClick={() => setStep(4)}
                >
                  I Have ETH Ready
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* MetaMask or Other Wallet */}
            {(selectedWallet === 'metamask' || selectedWallet === 'other') && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="bg-muted rounded-lg p-6">
                  <p className="text-sm mb-2">Amount needed:</p>
                  <p className="text-xl font-bold text-primary mb-1">{ethAmount} ETH</p>
                  <p className="text-xs text-muted-foreground">${orderTotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Buy ETH in your wallet, then return here to complete payment
                </p>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(4)}
                >
                  I'm Ready to Pay
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Coinbase Wallet */}
            {selectedWallet === 'coinbase' && (
              <div className="max-w-md mx-auto space-y-4">
                <p className="text-sm text-muted-foreground">
                  Open Coinbase Wallet and buy {ethAmount} ETH, then return here
                </p>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(4)}
                >
                  I'm Ready to Pay
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Pay */}
      {step === 4 && !skipToPayment && (
        <Card className="border-2 border-primary overflow-hidden">
          <CardContent className="pt-6 pb-6 md:pt-8 md:pb-8 px-3 md:px-6 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Pay Now</h2>
              <p className="text-xl font-semibold text-primary">{ethAmount} ETH</p>
              <p className="text-muted-foreground">${orderTotal.toFixed(2)}</p>
            </div>
            
            {device === 'mobile' ? (
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full max-w-xs text-lg h-14 bg-blue-600 hover:bg-blue-700"
                  onClick={async () => {
                    console.log('[Payment Button] Clicked! orderId:', orderId)
                    // Use appropriate payment URL based on wallet
                    const paymentLink = selectedWallet === 'trust' ? payUrl : universalPaymentUrl
                    console.log('[Payment Button] Payment link:', paymentLink)
                    
                    // Clear cart now that payment is initiated
                    try {
                      await clearCart()
                      console.log('[Payment Button] Cart cleared')
                    } catch (error) {
                      console.error('[Payment Button] Failed to clear cart:', error)
                    }
                    
                    // Store order ID for dashboard auto-expand
                    if (orderId) {
                      localStorage.setItem('pending_order_id', orderId)
                      console.log('[Payment Button] Stored order ID in localStorage:', orderId)
                      
                      // Store the wallet deep link so dashboard can open it
                      localStorage.setItem('pending_payment_link', paymentLink)
                      console.log('[Payment Button] Stored payment link for dashboard')
                    }
                    
                    // Redirect to dashboard with payment data in URL (to cross domains)
                    if (orderId) {
                      const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl
                      const paymentDataEncoded = encodeURIComponent(JSON.stringify({
                        orderId: orderId,
                        orderNumber: orderNumber || orderId.substring(0, 13).toUpperCase(),
                        amount: ethAmount,
                        currency: 'ETH',
                        usdAmount: orderTotal,
                        timestamp: Date.now(),
                        paymentLink: paymentLink
                      }))
                      const dashboardUrl = `${mainAppUrl}/dashboard#payment=${paymentDataEncoded}`
                      console.log('[Payment Button] Redirecting to dashboard with payment data')
                      window.location.href = dashboardUrl
                    }
                  }}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {selectedWallet === 'trust' ? 'Pay with Trust Wallet' : 'Open Wallet to Pay'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  After payment, return to your browser and go to Dashboard to see your order
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-block">
                  <QRCodeDisplay value={selectedWallet === 'trust' ? payUrl : universalPaymentUrl} size={200} />
                </div>
                <p className="text-sm text-muted-foreground">Scan to send {ethAmount} ETH</p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full max-w-xs"
                  onClick={async () => {
                    const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl
                    const dashboardUrl = orderId 
                      ? `${mainAppUrl}/dashboard#order-${orderId}`
                      : `${mainAppUrl}/dashboard`
                    window.location.href = dashboardUrl
                  }}
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wallet Selection Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        paymentUrl={payUrl}
        onWalletSelected={(wallet) => {
          // Redirect to dashboard after wallet opens
          const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl
          setTimeout(() => {
            window.location.href = `${mainAppUrl}/dashboard`
          }, 1000)
        }}
      />
    </div>
  )
}


// High-quality QR Code component using qrcode library
function QRCodeDisplay({ value, size }: { value: string; size: number }) {
  const canvasRef = useState<HTMLCanvasElement | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  
  useEffect(() => {
    async function generateQR() {
      try {
        const QRCode = (await import('qrcode')).default
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M' // Medium error correction
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
      }
    }
    generateQR()
  }, [value, size])
  
  return (
    <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
      {qrDataUrl ? (
        <img 
          src={qrDataUrl} 
          alt="Payment QR Code" 
          width={size} 
          height={size}
          className="rounded"
        />
      ) : (
        <div className="flex items-center justify-center" style={{width: size, height: size}}>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
