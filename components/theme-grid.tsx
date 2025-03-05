import { ThemeCard } from "@/components/theme-card"
import { getThemes } from "@/app/lib/supabase/themes"

export async function ThemeGrid() {
  const themes = await getThemes()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </div>
  )
}

