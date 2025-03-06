"use client"

import { type Theme } from '@/lib/types'
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface ThemeSelectorProps {
  themes: Theme[]
}

export function ThemeSelector({ themes }: ThemeSelectorProps) {
  const router = useRouter()

  const handleThemeClick = (themeId: string) => {
    router.push(`/themes/${themeId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <Card 
          key={theme.id} 
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleThemeClick(theme.id)}
        >
          <div className={`${theme.gradient_class || "gradient-1"} p-4 md:p-6`}>
            <div className="text-3xl md:text-4xl mb-2 emoji-style">{theme.emoji}</div>
            <h3 className="font-bold text-base md:text-lg text-white">{theme.name}</h3>
            {theme.description && (
              <p className="text-xs md:text-sm text-white/80 mt-1">{theme.description}</p>
            )}
          </div>
        </Card>
      ))}
      {themes.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">Темы пока не добавлены</p>
        </div>
      )}
    </div>
  )
}
