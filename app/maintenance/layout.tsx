import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maintenance Mode',
  description: 'Site is currently under maintenance',
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Inject styles to prevent scrolling on this page */}
      <style>{`
        html, body {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          touch-action: none;
        }
      `}</style>
      <div className="h-screen w-screen overflow-hidden bg-[#0F0F0F] fixed inset-0 touch-none">
        {children}
      </div>
    </>
  )
}

