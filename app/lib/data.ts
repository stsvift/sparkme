import fs from 'fs/promises'
import path from 'path'
import type { Theme, Card } from '@/lib/types'

const themesPath = path.join(process.cwd(), 'data', 'themes.json')
const cardsPath = path.join(process.cwd(), 'data', 'cards.json')

// Простые операции для тем
export async function getThemes() {
  const data = await fs.readFile(themesPath, 'utf-8')
  return JSON.parse(data).themes
}

export async function createTheme(theme) {
  const data = JSON.parse(await fs.readFile(themesPath, 'utf-8'))
  const newTheme = {
    ...theme,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  data.themes.push(newTheme)
  await fs.writeFile(themesPath, JSON.stringify(data, null, 2))
  return newTheme
}

// Простые операции для карточек
export async function getCards() {
  const data = await fs.readFile(cardsPath, 'utf-8')
  return JSON.parse(data).cards
}

export async function createCard(card) {
  const data = JSON.parse(await fs.readFile(cardsPath, 'utf-8'))
  const newCard = {
    ...card,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  data.cards.push(newCard)
  await fs.writeFile(cardsPath, JSON.stringify(data, null, 2))
  return newCard
}

// Helpers
async function readJSON(filePath: string) {
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

async function writeJSON(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// Themes
export async function getTheme(id: string): Promise<Theme | null> {
  const themes = await getThemes()
  return themes.find(theme => theme.id === id) || null
}

export async function updateTheme(id: string, theme: Partial<Theme>): Promise<Theme | null> {
  const data = await readJSON(themesPath)
  const index = data.themes.findIndex((t: Theme) => t.id === id)
  
  if (index === -1) return null
  
  data.themes[index] = { ...data.themes[index], ...theme }
  await writeJSON(themesPath, data)
  return data.themes[index]
}

export async function deleteTheme(id: string): Promise<boolean> {
  const data = await readJSON(themesPath)
  data.themes = data.themes.filter((t: Theme) => t.id !== id)
  await writeJSON(themesPath, data)
  return true
}

// Cards
export async function getCard(id: string): Promise<Card | null> {
  const cards = await getCards()
  return cards.find(card => card.id === id) || null
}

export async function getCardsByTheme(themeId: string): Promise<Card[]> {
  const cards = await getCards()
  return cards.filter(card => card.theme_id === themeId)
}

export async function updateCard(id: string, card: Partial<Card>): Promise<Card | null> {
  const data = await readJSON(cardsPath)
  const index = data.cards.findIndex((c: Card) => c.id === id)
  
  if (index === -1) return null
  
  data.cards[index] = { ...data.cards[index], ...card }
  await writeJSON(cardsPath, data)
  return data.cards[index]
}

export async function deleteCard(id: string): Promise<boolean> {
  const data = await readJSON(cardsPath)
  data.cards = data.cards.filter((c: Card) => c.id !== id)
  await writeJSON(cardsPath, data)
  return true
}
