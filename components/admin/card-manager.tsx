"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Card as CardType, Theme } from "@/lib/types"
import { getCards, createCard, updateCard, deleteCard } from '@/app/lib/actions/cards'
import { getThemes } from "@/lib/api/themes"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function CardManager() {
  const [cards, setCards] = useState<CardType[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null)
  const [currentCard, setCurrentCard] = useState<CardType | null>(null)
  const [question, setQuestion] = useState("")
  const [hint, setHint] = useState("")
  const [themeId, setThemeId] = useState("")
  const { toast } = useToast()
  const isMobile = useIsMobile()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    console.log('Form mode changed:', formMode)
  }, [formMode])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cardsData, themesData] = await Promise.all([getCards(), getThemes()])
      setCards(cardsData)
      setThemes(themesData)
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки данных",
        description: error.message || "Не удалось загрузить карточки и темы. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = useCallback(() => {
    setQuestion("")
    setHint("")
    setThemeId("")
    setCurrentCard(null)
    setFormMode(null)
  }, [])

  const handleCreateCard = useCallback(() => {
    console.log('handleCreateCard called')
    setFormMode("create")
    if (themes.length > 0) {
      setThemeId(themes[0].id)
    }
  }, [themes])

  const handleEditCard = (card: CardType) => {
    setFormMode("edit")
    setCurrentCard(card)
    setQuestion(card.question)
    setHint(card.hint)
    setThemeId(card.theme_id)
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту карточку?")) {
      return
    }

    try {
      await deleteCard(id)
      toast({
        title: "Карточка удалена",
        description: "Карточка была успешно удалена",
      })
      await loadData()
    } catch (error: any) {
      toast({
        title: "Ошибка удаления карточки",
        description: error.message || "Не удалось удалить карточку. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || !hint.trim() || !themeId) {
      toast({
        title: "Отсутствуют поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    const cardData = {
      question: question.trim(),
      hint: hint.trim(),
      theme_id: themeId,
      used: false,
    }

    try {
      if (formMode === "create") {
        const newCard = await createCard(cardData)
        if (newCard) {
          setCards([...cards, newCard])
          toast({
            title: "Карточка создана",
            description: "Карточка была успешно создана",
          })
        } else {
          throw new Error("Failed to create card")
        }
      } else if (formMode === "edit" && currentCard) {
        const updatedCard = await updateCard(currentCard.id, cardData)
        if (updatedCard) {
          setCards(cards.map(card => (card.id === updatedCard.id ? updatedCard : card)))
          toast({
            title: "Карточка обновлена",
            description: "Карточка была успешно обновлена",
          })
        } else {
          throw new Error("Failed to update card")
        }
      }

      resetForm()
      await loadData()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: `Ошибка ${formMode === "create" ? "создания" : "обновления"} карточки`,
        description: error.message || "Пожалуйста, попробуйте снова",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка карточек...</div>
  }

  return (
    <div className="space-y-8">
      {console.log('Rendering with formMode:', formMode)}
      {formMode ? (
        <Card>
          <CardHeader>
            <CardTitle>{formMode === "create" ? "Создать новую карточку" : "Редактировать карточку"}</CardTitle>
            <CardDescription>
              {formMode === "create"
                ? "Добавьте новую карточку с вопросом в вашу коллекцию"
                : "Обновите выбранную карточку с вопросом"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Тема</Label>
                <Select value={themeId} onValueChange={setThemeId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.emoji} {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Вопрос</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Введите ваш вопрос"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint">Подсказка</Label>
                <Textarea
                  id="hint"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Введите подсказку или дополнение"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={resetForm}>
                Отмена
              </Button>
              <Button type="submit">{formMode === "create" ? "Создать карточку" : "Обновить карточку"}</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Button onClick={handleCreateCard} disabled={themes.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить новую карточку
        </Button>
      )}

      {themes.length === 0 && !formMode && (
        <div className="text-center py-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">Вам нужно создать хотя бы одну тему, прежде чем добавлять карточки.</p>
        </div>
      )}

      <div className="space-y-6">
        {themes.map((theme) => {
          const themeCards = cards.filter((card) => card.theme_id === theme.id)

          if (themeCards.length === 0) return null

          return (
            <div key={theme.id} className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold flex items-center">
                <span className="mr-2">{theme.emoji}</span>
                {theme.name}
              </h3>

              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
                {themeCards.map((card) => (
                  <Card key={card.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm md:text-base">{card.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-xs md:text-sm text-muted-foreground">{card.hint}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col md:flex-row gap-2 py-2">
                      <Button 
                        variant="outline" 
                        size={isMobile ? "sm" : "default"}
                        className="w-full md:w-auto"
                        onClick={() => handleEditCard(card)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        className="w-full md:w-auto text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {cards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Карточки не найдены. Создайте свою первую карточку, чтобы начать.</p>
          </div>
        )}
      </div>
    </div>
  )
}

