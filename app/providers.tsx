'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
