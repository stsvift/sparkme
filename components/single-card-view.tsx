"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight, Undo2, Shuffle, Download } from "lucide-react"
import type { Card as CardType } from "@/lib/types"
import { getCardsByTheme } from "@/app/lib/actions/cards" // Update this import
import { markCardUsed, markCardUnused } from "@/app/lib/supabase/cards"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from 'html2canvas'

interface SingleCardViewProps {
  themeId: string
}

export function SingleCardView({ themeId }: SingleCardViewProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)
  const exportCardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function loadCards() {
      try {
        const cardsData = await getCardsByTheme(themeId)
        setCards(cardsData)
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить карточки",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCards()
  }, [themeId, toast])

  const currentCard = cards[currentCardIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleRandomCard = () => {
    if (cards.length <= 1) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * cards.length);
    } while (newIndex === currentCardIndex);
    
    setCurrentCardIndex(newIndex);
    setIsFlipped(false);
  }

  const handleExportCard = async () => {
    if (!exportCardRef.current) return
    
    try {
      setIsExporting(true)
      // Даем время для рендера элемента
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(exportCardRef.current, {
        scale: 2, // Увеличиваем качество
        backgroundColor: null,
        logging: false
      })
      
      const image = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement("a")
      link.href = image
      link.download = `sparkme-card-${currentCardIndex + 1}.png`
      link.click()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось экспортировать карточку",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Загрузка карточек...</div>
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Карточки для этой темы не найдены.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-4 px-4 sm:px-6">
      <div className={`card-flip ${isFlipped ? "flipped" : ""} w-full max-w-4xl h-[600px] sm:h-[500px]`}>
        <div className="card-flip-inner relative h-full" ref={cardRef}>
          <Card
            className={`card-flip-front p-8 sm:p-8 h-full bg-gradient-to-br from-purple-500 to-pink-500`}
            onClick={handleFlip}
          >
            <div className="h-full flex flex-col text-white">
              <div className="pixel-text text-base sm:text-base tracking-wider mb-4 sm:mb-4">sparkme!</div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-2xl sm:text-2xl font-medium text-center leading-relaxed">{currentCard.question}</div>
              </div>
              <div className="text-sm sm:text-sm opacity-75 text-center mt-4 sm:mt-4">Нажмите, чтобы увидеть подсказку</div>
            </div>
          </Card>
          <Card 
            className="card-flip-back p-8 sm:p-8 h-full bg-gradient-to-br from-pink-500 to-purple-500"
            onClick={handleFlip}
          >
            <div className="h-full flex flex-col text-white">
              <div className="pixel-text text-base sm:text-sm mb-4 sm:mb-4">sparkme!</div>
              <div className="text-sm sm:text-sm opacity-75 text-center">Подсказка</div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-xl sm:text-xl font-medium text-center leading-relaxed">{currentCard.hint}</div>
              </div>
              <div className="text-sm sm:text-sm opacity-75 text-center mt-4 sm:mt-4">Нажмите, чтобы вернуться</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Export card */}
      <div className={isExporting ? "absolute left-0 top-0" : "hidden"}>
        <div ref={exportCardRef} className="w-[1200px] h-[1000px]">
          <Card className="p-16 h-full bg-gradient-to-br from-purple-500 to-pink-500">
            <div className="h-full flex flex-col text-white">
              <div className="pixel-text text-5xl tracking-wider text-center mb-8">sparkme!</div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-5xl font-medium text-center px-12">
                  {isFlipped ? currentCard.hint : currentCard.question}
                </div>
              </div>
              <div className="text-xl opacity-75 text-center">
                Powered by sviftcommunity with 💕
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Buttons section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentCardIndex === 0}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Предыдущая</span>
        </Button>

        <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleRandomCard} 
            disabled={cards.length <= 1}
            className="flex-1 sm:flex-initial"
          >
            <Shuffle className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Случайная</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportCard}
            className="flex-1 sm:flex-initial"
          >
            <Download className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Экспорт</span>
          </Button>
        </div>

        <Button 
          variant="outline" 
          onClick={handleNext} 
          disabled={currentCardIndex === cards.length - 1}
          className="w-full sm:w-auto order-3"
        >
          <span className="hidden sm:inline">Следующая</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground w-full max-w-2xl text-center">
        Карточка {currentCardIndex + 1} из {cards.length}
      </div>
    </div>
  )
}

