import { SingleCardView } from "@/components/single-card-view"
import { PageHeader } from "@/components/page-header"
import { getTheme } from "@/app/lib/data" // Updated import path
import { notFound } from "next/navigation"

export default async function ThemePage({ params }: { params: { id: string } }) {
  const theme = await getTheme(params.id)

  if (!theme) {
    notFound()
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <PageHeader
        title={`${theme.emoji} ${theme.name}`}
        description={theme.description || "Исследуйте карточки для беседы в этой теме"}
        backLink="/"
        backLinkText="Назад к темам"
      />
      <SingleCardView themeId={theme.id} />
    </main>
  )
}
