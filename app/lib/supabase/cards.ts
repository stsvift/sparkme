'use client'

import { createClientSupabaseClient } from './client'
export {
  getCards,
  getCard,
  getCardsByTheme,
  createCard,
  updateCard,
  deleteCard,
} from '@/app/lib/actions/cards'

export async function markCardUsed(cardId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase
    .from('cards')
    .update({ used: true })
    .eq('id', cardId)

  if (error) {
    console.error('Error marking card as used:', error)
    throw new Error(`Error marking card as used: ${error.message}`)
  }
}

export async function markCardUnused(cardId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase
    .from('cards')
    .update({ used: false })
    .eq('id', cardId)

  if (error) {
    console.error('Error marking card as unused:', error)
    throw new Error(`Error marking card as unused: ${error.message}`)
  }
}
