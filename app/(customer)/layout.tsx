import GlobalNav from '@/components/global-nav'
import { GlobalFooter } from '@/components/global-footer'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalNav showCart={true} />
      <main className="flex-1">
      {children}
      </main>
      <GlobalFooter />
    </div>
  )
}