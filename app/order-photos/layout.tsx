import type React from "react"
import GlobalNav from "@/components/global-nav"

export default function OrderPhotosLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav showCart={true} />
      <main>{children}</main>
    </div>
  )
}
