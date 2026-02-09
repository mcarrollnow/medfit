"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, XCircle, Clock, RefreshCw, ExternalLink } from "lucide-react"
import { getTransactionStatus, verifyPayment, type TransactionStatus } from "@/lib/ethereum"

interface TransactionVerifierProps {
  transactionHash: string
  expectedRecipient: string
  expectedAmount: string
}

export function TransactionVerifier({ transactionHash, expectedRecipient, expectedAmount }: TransactionVerifierProps) {
  const [status, setStatus] = useState<TransactionStatus | null>(null)
  const [verification, setVerification] = useState<{ verified: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkTransaction = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Checking transaction status:", transactionHash)

      // Get transaction status
      const txStatus = await getTransactionStatus(transactionHash)
      setStatus(txStatus)

      console.log("[v0] Transaction status:", txStatus)

      // Verify payment
      const verificationResult = await verifyPayment(transactionHash, expectedRecipient, expectedAmount)
      setVerification(verificationResult)

      console.log("[v0] Verification result:", verificationResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check transaction"
      setError(errorMessage)
      console.error("[v0] Transaction check error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkTransaction()

    // Auto-refresh every 15 seconds if transaction is pending
    const interval = setInterval(() => {
      if (status?.status === "pending") {
        checkTransaction()
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [transactionHash])

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifying Transaction</CardTitle>
          <CardDescription>Checking blockchain for transaction details...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verification Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={checkTransaction} variant="outline" className="w-full mt-4 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Verification</CardTitle>
        <CardDescription>Real-time blockchain verification status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                {status.status === "pending" && (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                    <div>
                      <div className="font-medium">Pending</div>
                      <div className="text-xs text-muted-foreground">Waiting for confirmation</div>
                    </div>
                  </>
                )}
                {status.status === "confirmed" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <div>
                      <div className="font-medium">Confirmed</div>
                      <div className="text-xs text-muted-foreground">{status.confirmations} confirmations</div>
                    </div>
                  </>
                )}
                {status.status === "failed" && (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <div className="font-medium">Failed</div>
                      <div className="text-xs text-muted-foreground">Transaction failed</div>
                    </div>
                  </>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={checkTransaction} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {status.blockNumber && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-muted-foreground mb-1">Block Number</div>
                  <div className="font-medium">#{status.blockNumber.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-muted-foreground mb-1">Confirmations</div>
                  <div className="font-medium">{status.confirmations}</div>
                </div>
              </div>
            )}

            {status.from && status.to && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-muted-foreground mb-1">From</div>
                  <code className="font-mono break-all">
                    {status.from.slice(0, 10)}...{status.from.slice(-8)}
                  </code>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-muted-foreground mb-1">To</div>
                  <code className="font-mono break-all">
                    {status.to.slice(0, 10)}...{status.to.slice(-8)}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {verification && (
          <Alert
            variant={verification.verified ? "default" : "destructive"}
            className={verification.verified ? "border-accent" : ""}
          >
            {verification.verified ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              <span className="font-medium">{verification.verified ? "Payment Verified" : "Verification Failed"}</span>
              <span className="block text-xs mt-1">{verification.message}</span>
            </AlertDescription>
          </Alert>
        )}

        <Button variant="outline" className="w-full bg-transparent" asChild>
          <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            View on Etherscan
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>

        {status?.status === "pending" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This page will automatically refresh every 15 seconds until the transaction is confirmed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
