"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

// Распространенные эмодзи по категориям
const COMMON_EMOJIS = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  people: ["👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👵", "🧓", "👴", "👮", "🕵️", "👷", "👸", "🤴", "👳"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵"],
  objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖"],
}

interface EmojiPickerProps {
  selectedEmoji: string
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<keyof typeof COMMON_EMOJIS>("smileys")

  const categories = Object.keys(COMMON_EMOJIS) as Array<keyof typeof COMMON_EMOJIS>

  const filteredEmojis = searchTerm.trim()
    ? Object.values(COMMON_EMOJIS)
        .flat()
        .filter((emoji) => emoji.includes(searchTerm.toLowerCase()))
    : COMMON_EMOJIS[activeCategory]

  const categoryNames: Record<keyof typeof COMMON_EMOJIS, string> = {
    smileys: "Смайлики",
    people: "Люди",
    animals: "Животные",
    food: "Еда",
    activities: "Активности",
    travel: "Транспорт",
    objects: "Объекты",
    symbols: "Символы",
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <span className="mr-2 text-2xl">{selectedEmoji}</span>
          <span>Выберите эмодзи</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <Input
            placeholder="Поиск эмодзи..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />

          {!searchTerm && (
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="text-xs"
                >
                  {categoryNames[category]}
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-8 gap-2">
            {filteredEmojis.map((emoji, index) => (
              <Button
                key={`${emoji}-${index}`}
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  onEmojiSelect(emoji)
                  setSearchTerm("")
                }}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            ))}
          </div>

          {filteredEmojis.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">Эмодзи не найдены</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

