"use client"

import { Suspense } from "react"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"
import { ZellePaymentContent } from "./zelle-payment-content"

export default function ZellePaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentFlowWrapper>
        {(props) => <ZellePaymentContent {...props} />}
      </PaymentFlowWrapper>
    </Suspense>
  )
}
