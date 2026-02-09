import { notFound } from "next/navigation"
import { getRepById } from "@/app/actions/rep-management"
import { RepDetailTabs } from "@/components/admin/rep-detail-tabs"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RepDetailPage({ params }: PageProps) {
  const { id } = await params
  const rep = await getRepById(id)

  if (!rep) {
    notFound()
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <RepDetailTabs rep={rep} />
      </div>
    </div>
  )
}

