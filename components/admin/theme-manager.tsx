"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Theme } from "@/lib/types"
import { getThemes, createTheme, updateTheme, deleteTheme } from '@/lib/supabase/themes'
import { EmojiPicker } from "@/components/admin/emoji-picker"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive" // Replace useMobile with useResponsive

export function ThemeManager() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("💡")
  const [description, setDescription] = useState("")
  const [gradientClass, setGradientClass] = useState("gradient-1")
  const { toast } = useToast()
  const { isMobile } = useResponsive() // Replace useMobile() with useResponsive()

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      const data = await getThemes()
      setThemes(data)
    } catch (error) {
      toast({
        title: "Ошибка загрузки тем",
        description: "Не удалось загрузить темы. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmoji("💡")
    setDescription("")
    setGradientClass("gradient-1")
    setCurrentTheme(null)
    setFormMode(null)
  }

  // Обновленный обработчик создания темы
  const handleCreateTheme = () => {
    console.log("Creating new theme...")
    setName("")
    setEmoji("💡")
    setDescription("")
    setGradientClass("gradient-1")
    setCurrentTheme(null)
    setFormMode("create") // Устанавливаем режим создания
  }

  const handleEditTheme = (theme: Theme) => {
    setFormMode("edit")
    setCurrentTheme(theme)
    setName(theme.name)
    setEmoji(theme.emoji)
    setDescription(theme.description || "")
    setGradientClass(theme.gradient_class || "gradient-1")
  }

  const handleDeleteTheme = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту тему? Это также удалит все карточки в этой теме.")) {
      return
    }

    try {
      await deleteTheme(id)
      toast({
        title: "Тема удалена",
        description: "Тема была успешно удалена",
      })
      loadThemes()
    } catch (error) {
      toast({
        title: "Ошибка удаления темы",
        description: "Не удалось удалить тему. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  // Обновленный обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form...")

    if (!name.trim() || !emoji.trim()) {
      toast({
        title: "Отсутствуют поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    try {
      const themeData = {
        name: name.trim(),
        emoji: emoji.trim(),
        description: description.trim() || null,
        gradient_class: gradientClass,
      }

      console.log('Theme data before save:', themeData)
      let result;
      
      if (formMode === "create") {
        result = await createTheme(themeData)
      } else if (formMode === "edit" && currentTheme) {
        result = await updateTheme(currentTheme.id, themeData)
      }

      console.log('Response from server:', result)

      if (!result) {
        throw new Error('Failed to save theme')
      }

      if (formMode === "create") {
        setThemes(prev => [...prev, result])
      } else if (formMode === "edit") {
        setThemes(prev => prev.map(theme => 
          theme.id === currentTheme?.id ? result : theme
        ))
      }

      toast({
        title: formMode === "create" ? "Тема создана" : "Тема обновлена",
        description: formMode === "create" 
          ? "Тема была успешно создана" 
          : "Тема была успешно обновлена",
      })
      
      resetForm()
    } catch (error: any) {
      console.error('Error details:', error)
      toast({
        title: `Ошибка ${formMode === "create" ? "создания" : "обновления"} темы`,
        description: error.message || "Пожалуйста, попробуйте снова",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка тем...</div>
  }

  return (
    <div className="space-y-8">
      {formMode ? (
        <Card>
          <CardHeader>
            <CardTitle>{formMode === "create" ? "Создать новую тему" : "Редактировать тему"}</CardTitle>
            <CardDescription>
              {formMode === "create" ? "Добавьте новую тему в вашу коллекцию" : "Обновите выбранную тему"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название темы</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите название темы"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Эмодзи</Label>
                <EmojiPicker selectedEmoji={emoji} onEmojiSelect={setEmoji} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание (необязательно)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Введите описание темы"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradient">Фоновый градиент</Label>
                <Select value={gradientClass} onValueChange={setGradientClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите градиент" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient-1">Розовый градиент</SelectItem>
                    <SelectItem value="gradient-2">Синий градиент</SelectItem>
                    <SelectItem value="gradient-3">Оранжевый градиент</SelectItem>
                    <SelectItem value="gradient-4">Бирюзовый градиент</SelectItem>
                    <SelectItem value="gradient-5">Зеленый градиент</SelectItem>
                    <SelectItem value="gradient-6">Фиолетово-розовый градиент</SelectItem>
                    <SelectItem value="gradient-7">Оранжево-фиолетовый градиент</SelectItem>
                    <SelectItem value="gradient-8">Фиолетово-синий градиент</SelectItem>
                  </SelectContent>
                </Select>

                <div className={`${gradientClass} h-12 rounded-md mt-2`}></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={resetForm}>
                Отмена
              </Button>
              <Button type="submit">{formMode === "create" ? "Создать тему" : "Обновить тему"}</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Button onClick={handleCreateTheme}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить новую тему
        </Button>
      )}

      <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6`}>
        {themes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden">
            <div className={`${theme.gradient_class || "gradient-1"} p-4 md:p-6`}>
              <div className="text-3xl md:text-4xl mb-2 emoji-style">{theme.emoji}</div>
              <h3 className="font-bold text-base md:text-lg text-white">{theme.name}</h3>
              {theme.description && (
                <p className="text-xs md:text-sm text-white/80 mt-1">{theme.description}</p>
              )}
            </div>
            <CardFooter className="flex flex-col md:flex-row gap-2 p-2 md:py-4">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="w-full md:w-auto"
                onClick={() => handleEditTheme(theme)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Редактировать
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="w-full md:w-auto text-destructive hover:text-destructive"
                onClick={() => handleDeleteTheme(theme.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </CardFooter>
          </Card>
        ))}

        {themes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Темы не найдены. Создайте свою первую тему, чтобы начать.</p>
          </div>
        )}
      </div>
    </div>
  )
}

