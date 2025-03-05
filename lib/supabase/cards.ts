import type { Card } from "@/lib/types"

// Replace with fetch calls to our local API
export async function getCards() {
  const res = await fetch('/api/admin/cards')
  if (!res.ok) throw new Error('Failed to fetch cards')
  return res.json()
}

export async function createCard(cardData: Partial<Card>) {
  const res = await fetch('/api/cards', {  // изменен URL
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: cardData.question,
      hint: cardData.hint || null,
      theme_id: cardData.theme_id,
      used: false
    })
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to create card')
  }
  
  return res.json()
}

export async function updateCard(id: string, card: any) {
  const res = await fetch('/api/admin/cards', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...card })
  })
  if (!res.ok) throw new Error('Failed to update card')
  return res.json()
}

export async function deleteCard(id: string) {
  const res = await fetch(`/api/admin/cards?id=${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete card')
  return res.json()
}
