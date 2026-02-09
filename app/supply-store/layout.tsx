import type { Metadata } from "next"
import { SupplyStoreNavbar } from "@/components/supply-store/navbar"
import { SupplyStoreFooter } from "@/components/supply-store/footer"
import { SupplyStoreBusinessProvider } from "@/lib/supply-store/business-context"

export const metadata: Metadata = {
  title: "Modern Health Pro | B2B Wellness Supply",
  description:
    "Premium wholesale equipment and supplies for gyms, med spas, and wellness centers. Outfit your facility with professional-grade recovery, fitness, and wellness equipment.",
}

export default function SupplyStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupplyStoreBusinessProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <SupplyStoreNavbar />
        <main className="flex-1 pt-28">{children}</main>
        <SupplyStoreFooter />
      </div>
    </SupplyStoreBusinessProvider>
  )
}

