'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    })

    if (response.ok) {
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-0.5 text-sm font-medium text-white hover:text-white focus:outline-none focus:ring-4 focus:ring-red-200 group-hover:from-red-500 group-hover:to-red-600"
        >
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 text-red-600 hover:text-white">
            Выйти
          </span>
        </button>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
