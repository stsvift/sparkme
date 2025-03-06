'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Успешный выход",
          description: "Вы успешно вышли из системы",
        })
        router.push('/admin/login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer with logout button */}
      <footer className="w-full border-t bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">sparkme!</span>
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </footer>
    </div>
  )
}
