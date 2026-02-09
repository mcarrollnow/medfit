"use client"

import { useParams } from "next/navigation"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"
import CryptoPaymentIntegrated from "@/components/payment-flows-integrated/crypto-payment"
import CryptoSetupOriginal from "@/components/payment-flows/crypto-setup/page"
import ZelleOriginal from "@/components/payment-flows/zelle/page"
import ACHOriginal from "@/components/payment-flows/ach/page"
import GlobalNav from "@/components/global-nav"

export default function PaymentMethodPage() {
  const params = useParams()
  const method = params.method as string
  
  // Render the appropriate payment component wrapped with PaymentFlowWrapper
  switch (method) {
    case "crypto-setup":
      return (
        <>
          <GlobalNav />
          <PaymentFlowWrapper>
            {(props) => <CryptoSetupOriginal {...props} />}
          </PaymentFlowWrapper>
        </>
      )
      
    case "crypto-payment":
      return (
        <>
          <GlobalNav />
          <PaymentFlowWrapper>
            {(props) => <CryptoPaymentIntegrated {...props} />}
          </PaymentFlowWrapper>
        </>
      )
      
    case "zelle":
      return (
        <>
          <GlobalNav />
          <PaymentFlowWrapper>
            {(props) => <ZelleOriginal {...props} />}
          </PaymentFlowWrapper>
        </>
      )
      
    case "ach":
      return (
        <>
          <GlobalNav />
          <PaymentFlowWrapper>
            {(props) => <ACHOriginal {...props} />}
          </PaymentFlowWrapper>
        </>
      )
      
    default:
      return (
        <>
          <GlobalNav />
          <div className="min-h-screen bg-background text-foreground p-4">
            <h1 className="text-2xl font-bold">Payment method not found</h1>
          </div>
        </>
      )
  }
}
