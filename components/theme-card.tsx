import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Theme } from "@/lib/types"

interface ThemeCardProps {
  theme: Theme
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const gradientClass = theme.gradient_class || "gradient-1"

  return (
    <Link href={`/theme/${theme.id}`}>
      <Card className="overflow-hidden h-40 transition-transform hover:scale-105">
        <CardContent className={`${gradientClass} h-full p-6 flex flex-col justify-between`}>
          <div className="text-4xl">{theme.emoji}</div>
          <div>
            <h3 className="font-bold text-lg text-white">{theme.name}</h3>
            {theme.description && <p className="text-sm text-white/80 mt-1">{theme.description}</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

