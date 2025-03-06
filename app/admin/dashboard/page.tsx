'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from "@/components/page-header"
import { AdminTabs } from "@/components/admin/admin-tabs"

interface Theme {
  id: string
  name: string
  emoji: string
  description: string | null
  gradient_class: string
  created_at?: string
}

export default function AdminDashboardPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/themes')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setThemes(data)
      }
    } catch (error) {
      console.error('Failed to load themes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (themeData: Partial<Theme>) => {
    try {
      const method = themeData.id ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/themes', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save theme')
      }

      await loadThemes()
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/themes?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete theme')
      }

      loadThemes() // Перезагружаем список после успешного удаления
    } catch (error) {
      console.error('Error deleting theme:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="sparkme! Админ"
        description="Управляйте темами и карточками"
        backLink="/"
        backLinkText="Назад на главную"
      />

      <AdminTabs />

    </div>
  )
}

