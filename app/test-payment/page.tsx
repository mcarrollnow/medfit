"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink } from "lucide-react"

export default function TestPaymentPage() {
  const [recipientAddress, setRecipientAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0")
  const [amount, setAmount] = useState("10.00")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const generateUSDCUrl = () => {
    const usdcContract = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const usdcAmountRaw = Math.round(parseFloat(amount) * 1000000) // 6 decimals
    
    const transferSelector = 'a9059cbb'
    const paddedRecipient = recipientAddress.slice(2).padStart(64, '0')
    const paddedAmount = usdcAmountRaw.toString(16).padStart(64, '0')
    const data = `0x${transferSelector}${paddedRecipient}${paddedAmount}`
    
    const url = `ethereum:${usdcContract}@1?value=0&data=${data}`
    
    console.log('Generated USDC URL:', {
      contract: usdcContract,
      recipient: recipientAddress,
      amountUSDC: amount,
      amountRaw: usdcAmountRaw,
      amountHex: paddedAmount,
      data: data,
      url: url
    })
    
    setGeneratedUrl(url)
    return url
  }

  const generateETHUrl = () => {
    const ethAmount = parseFloat(amount)
    const amountInWei = Math.floor(ethAmount * 1e18).toString()
    
    const url = `ethereum:${recipientAddress}@1?value=${amountInWei}`
    
    console.log('Generated ETH URL:', {
      recipient: recipientAddress,
      amountETH: ethAmount,
      amountWei: amountInWei,
      url: url
    })
    
    setGeneratedUrl(url)
    return url
  }

  const testUSDC = () => {
    const url = generateUSDCUrl()
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      console.log('[Mobile] Using window.location.href')
      window.location.href = url
    } else {
      console.log('[Desktop] Using window.open')
      window.open(url, '_blank')
    }
  }

  const testETH = () => {
    const url = generateETHUrl()
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      console.log('[Mobile] Using window.location.href')
      window.location.href = url
    } else {
      console.log('[Desktop] Using window.open')
      window.open(url, '_blank')
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Deep Link Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>Before testing:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Make sure you have Trust Wallet or MetaMask installed</li>
                  <li>Check browser console for debug logs</li>
                  <li>On mobile: Wallet should open automatically</li>
                  <li>On desktop: Opens in new tab (may not prefill)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Recipient Address</Label>
                <Input 
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div>
                <Label>Amount (USD/ETH)</Label>
                <Input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10.00"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={testUSDC} className="flex-1">
                Test USDC Payment
              </Button>
              <Button onClick={testETH} variant="outline" className="flex-1">
                Test ETH Payment
              </Button>
            </div>

            {generatedUrl && (
              <div className="space-y-2">
                <Label>Generated URL (check console for details)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedUrl}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button 
                    size="icon"
                    variant="outline"
                    onClick={copyUrl}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">Copied to clipboard!</p>
                )}
              </div>
            )}

            <Alert className="border-blue-500 bg-blue-500/10">
              <AlertDescription>
                <strong>Troubleshooting:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li><strong>Nothing happens:</strong> Check if wallet is installed</li>
                  <li><strong>Opens but empty:</strong> Wallet may not support ethereum: URLs</li>
                  <li><strong>Browser opens:</strong> No wallet is set as default handler</li>
                  <li><strong>Desktop issues:</strong> Try on mobile for better support</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Manual Testing</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Copy the generated URL and paste it in your mobile browser's address bar
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Device: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">
                  Is Mobile: {/iPhone|iPad|iPod|Android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '') ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
