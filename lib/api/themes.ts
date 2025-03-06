import { getBaseUrl } from '@/lib/utils'
import type { Theme } from '@/lib/types'

export async function getThemes(): Promise<Theme[]> {
  const res = await fetch(`${getBaseUrl()}/api/admin/themes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch themes')
  }

  return res.json()
}

export async function createTheme(themeData: Omit<Theme, 'id'>): Promise<Theme> {
  const res = await fetch(`${getBaseUrl()}/api/admin/themes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(themeData),
  })
  
  if (!res.ok) {
    throw new Error(await res.text())
  }
  
  return res.json()
}

export async function updateTheme(id: string, themeData: Partial<Theme>): Promise<Theme> {
  const res = await fetch(`${getBaseUrl()}/api/admin/themes?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: themeData.name,
      emoji: themeData.emoji,
      description: themeData.description,
      gradient_class: themeData.gradient_class
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Failed to update theme')
  }

  return res.json()
}

export async function deleteTheme(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/admin/themes?id=${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}
