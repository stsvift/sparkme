import type React from "react"
import type { Metadata } from "next"
import { Inter, Tilt_Neon } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import SupabaseProvider from './providers'

const inter = Inter({ subsets: ["latin"] })
const tinyFont = Tilt_Neon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "sparkme!",
  description: "Интерактивные карточки для увлекательных бесед",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tiny:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <main className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="flex-grow container mx-auto max-w-7xl">
              {children}
            </div>
            <Footer />
          </main>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}

