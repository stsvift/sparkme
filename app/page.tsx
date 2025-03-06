import { PageHeader } from "@/components/page-header"
import { ThemeSelector } from '@/components/theme-selector'
import type { Theme } from '@/lib/types'
import Link from 'next/link'

async function getThemes(): Promise<Theme[]> {
  // Use absolute URL in development, relative in production
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : ''
  
  const res = await fetch(`${baseUrl}/api/admin/themes`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch themes')
  }

  return res.json()
}

export default async function HomePage() {
  const themes = await getThemes()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <PageHeader title="sparkme!" description="Выберите тему для увлекательной беседы" />
      <ThemeSelector themes={themes} />
    </main>
  )
}

