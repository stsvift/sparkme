import { QuestionCard } from "@/components/question-card"
import { getCardsByTheme } from "@/app/lib/supabase/cards"

interface CardGridProps {
  themeId: string
}

export async function CardGrid({ themeId }: CardGridProps) {
  const cards = await getCardsByTheme(themeId)

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cards found for this theme.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <QuestionCard key={card.id} card={card} />
      ))}
    </div>
  )
}

