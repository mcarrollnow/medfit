"use client"

import { Suspense } from "react"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"
import { CryptoPaymentContent } from "./crypto-payment-content"

export default function CryptoPaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentFlowWrapper>
        {(props) => <CryptoPaymentContent {...props} />}
      </PaymentFlowWrapper>
    </Suspense>
  )
}