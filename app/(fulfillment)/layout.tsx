import GlobalNav from '@/components/global-nav'

export default function FulfillmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
