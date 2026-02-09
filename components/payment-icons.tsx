const SUPABASE_STORAGE_URL = "https://bteugdayafihvdzhpnlv.supabase.co/storage/v1/object/public/theme-assets"

export function MetaMaskLogo() {
  return (
    <img
      src={`${SUPABASE_STORAGE_URL}/MetaMask-icon-fox-with-margins.svg`}
      alt="MetaMask"
      className="w-full h-full object-contain"
    />
  )
}

export function TrustWalletLogo() {
  return (
    <img src={`${SUPABASE_STORAGE_URL}/trust-shield.svg`} alt="Trust Wallet" className="w-full h-full object-contain" />
  )
}

export function PayPalLogo() {
  return (
    <img
      src={`${SUPABASE_STORAGE_URL}/paypal-rounded-logo.svg`}
      alt="PayPal"
      className="w-full h-full object-contain"
    />
  )
}

export function VenmoLogo() {
  return (
    <img src={`${SUPABASE_STORAGE_URL}/Venmo-round-logo.svg`} alt="Venmo" className="w-full h-full object-contain" />
  )
}

export function WalletIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect x="4" y="10" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 16h32" stroke="currentColor" strokeWidth="2" />
      <circle cx="28" cy="22" r="2" fill="currentColor" />
      <path d="M8 10V9a3 3 0 013-3h18a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function ZelleLogo() {
  return (
    <img src={`${SUPABASE_STORAGE_URL}/Zelle-round-logo.svg`} alt="Zelle" className="w-full h-full object-contain" />
  )
}

export function BankIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <path d="M20 4L4 12v2h32v-2L20 4z" fill="currentColor" />
      <rect x="7" y="16" width="4" height="14" fill="currentColor" />
      <rect x="14" y="16" width="4" height="14" fill="currentColor" />
      <rect x="22" y="16" width="4" height="14" fill="currentColor" />
      <rect x="29" y="16" width="4" height="14" fill="currentColor" />
      <rect x="4" y="32" width="32" height="4" fill="currentColor" />
    </svg>
  )
}

export function CreditCardIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 14h32" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="22" width="8" height="4" rx="1" fill="currentColor" />
      <rect x="20" y="22" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="20" y="26" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function RevolutIcon() {
  return (
    <img
      src={`${SUPABASE_STORAGE_URL}/Revolut-Icon-Logo.wine.svg`}
      alt="Revolut"
      className="w-full h-full object-contain"
    />
  )
}

export function CashAppIcon() {
  return (
    <img
      src={`${SUPABASE_STORAGE_URL}/Cash_App-Logo.wine.svg`}
      alt="Cash App"
      className="w-full h-full object-contain"
    />
  )
}

