import { prisma } from '@/lib/prisma'
import type { Theme, Card } from '@/lib/types'

// Themes
export async function getThemes() {
  return prisma.theme.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function getTheme(id: string) {
  if (!id) return null;
  
  try {
    const theme = await prisma.theme.findUnique({
      where: { id }
    });
    return theme;
  } catch (error) {
    console.error('Error fetching theme:', error);
    return null;
  }
}

export async function createTheme(data: { title: string; description: string }) {
  return prisma.theme.create({
    data
  })
}

export async function updateTheme(id: string, data: Partial<Theme>) {
  return prisma.theme.update({
    where: { id },
    data
  })
}

export async function deleteTheme(id: string) {
  await prisma.theme.delete({
    where: { id }
  })
  return true
}

// Cards
export async function getCards() {
  return prisma.card.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function getCard(id: string) {
  return prisma.card.findUnique({
    where: { id }
  })
}

export async function getCardsByTheme(themeId: string) {
  return prisma.card.findMany({
    where: { theme_id: themeId },
    orderBy: { created_at: 'asc' }
  })
}

export async function createCard(data: { theme_id: string; question: string; hint: string }) {
  return prisma.card.create({
    data
  })
}

export async function updateCard(id: string, data: Partial<Card>) {
  return prisma.card.update({
    where: { id },
    data
  })
}

export async function deleteCard(id: string) {
  await prisma.card.delete({
    where: { id }
  })
  return true
}
