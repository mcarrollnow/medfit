import { CustomerMobileInterface } from "@/components/customer-mobile-interface"
import { CustomerDesktopInterface } from "@/components/customer-desktop-interface"

export default function CustomerPage() {
  return (
    <>
      {/* Mobile Version */}
      <div className="lg:hidden">
        <CustomerMobileInterface />
      </div>

      {/* Desktop Version */}
      <div className="hidden lg:block">
        <CustomerDesktopInterface />
      </div>
    </>
  )
}
