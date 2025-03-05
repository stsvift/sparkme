"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Undo2 } from "lucide-react"
import type { Card as CardType } from "@/lib/types"
import { markCardUsed, markCardUnused } from "@/app/lib/supabase/cards"
import { useToast } from "@/components/ui/use-toast"

interface QuestionCardProps {
  card: CardType
}

export function QuestionCard({ card }: QuestionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isUsed, setIsUsed] = useState(card.used || false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMarkUsed = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await markCardUsed(card.id)
      setIsUsed(true)
      toast({
        title: "Card marked as used",
        description: "This card won't appear in your regular rotation",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark card as used",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkUnused = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await markCardUnused(card.id)
      setIsUsed(false)
      toast({
        title: "Card marked as unused",
        description: "This card will appear in your regular rotation",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark card as unused",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`card-flip ${isFlipped ? "flipped" : ""}`}>
      <div className="card-flip-inner relative h-64">
        <Card
          className={`card-flip-front p-6 h-full flex flex-col justify-between ${isUsed ? "opacity-60" : ""}`}
          onClick={handleFlip}
        >
          <div className="text-lg font-medium">{card.question}</div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">Tap to see hint</div>
            {isUsed ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkUnused()
                }}
                disabled={isLoading}
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Reset
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkUsed()
                }}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-1" />
                Used
              </Button>
            )}
          </div>
        </Card>
        <Card className="card-flip-back p-6 h-full flex flex-col justify-between" onClick={handleFlip}>
          <div className="text-sm text-muted-foreground">Hint</div>
          <div className="text-lg font-medium">{card.hint}</div>
          <div className="text-xs text-muted-foreground">Tap to go back</div>
        </Card>
      </div>
    </div>
  )
}

