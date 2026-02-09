import { PaymentCard } from "./payment-card"
import { MetaMaskLogo, TrustWalletLogo, PayPalLogo, VenmoLogo, WalletIcon, ZelleLogo, BankIcon } from "./payment-icons"

export function PaymentHub() {
  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
            Choose Your Payment Method
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
            Select the payment option that works best for you
          </p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Time Crypto User */}
          <PaymentCard
            title="First Time Crypto User"
            description="New to crypto? Get step-by-step guidance to set up your wallet"
            logos={[
              { icon: <MetaMaskLogo />, name: "MetaMask" },
              { icon: <TrustWalletLogo />, name: "Trust Wallet" },
              { icon: <PayPalLogo />, name: "PayPal" },
              { icon: <VenmoLogo />, name: "Venmo" },
            ]}
            buttonText="Get Started"
          />

          {/* Existing Crypto Wallet */}
          <PaymentCard
            title="Pay with Any Crypto Wallet"
            description="Already have a wallet? Complete your purchase quickly"
            logos={[{ icon: <WalletIcon />, name: "Any Wallet" }]}
            buttonText="Pay Using Your Wallet"
            featured
          />

          {/* Zelle */}
          <PaymentCard
            title="Zelle"
            description="Send payment via Zelle with easy copy-paste instructions"
            logos={[{ icon: <ZelleLogo />, name: "Zelle" }]}
            buttonText="Pay with Zelle"
          />

          {/* ACH Transfer */}
          <PaymentCard
            title="ACH Transfer"
            description="Send bank transfer with detailed routing information"
            logos={[{ icon: <BankIcon />, name: "Bank Transfer" }]}
            buttonText="Bank Transfer"
          />
        </div>
      </div>
    </div>
  )
}

