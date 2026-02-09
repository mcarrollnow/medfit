"use client"

import { Suspense } from "react"
import { PaymentFlowWrapper } from "@/components/payment-flow-wrapper"
import { PayPalPaymentFlow } from "@/components/payment-flows/paypal/page"

function PayPalPaymentContent() {
  return (
    <PaymentFlowWrapper>
      {({ 
        orderTotal, 
        merchantWallet, 
        orderId, 
        onPaymentComplete,
        orderDetails,
        isLoading,
        isProcessingPayment
      }) => (
        <PayPalPaymentFlow
          orderTotal={orderTotal}
          merchantWallet={merchantWallet}
          orderId={orderId}
          onPaymentComplete={onPaymentComplete}
          orderDetails={orderDetails}
          isLoading={isLoading}
          isProcessingPayment={isProcessingPayment}
        />
      )}
    </PaymentFlowWrapper>
  )
}

export default function PayPalPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PayPalPaymentContent />
    </Suspense>
  )
}