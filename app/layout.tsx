import type React from "react"
import type { Metadata } from "next"
import { Inter, Tilt_Neon } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })
const tinyFont = Tilt_Neon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "sparkme!",
  description: "Интерактивные карточки для увлекательных бесед",
  icons: {
    icon: '/favicon.png'
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tiny:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full bg-white">
        <Providers>
          <div className="min-h-screen flex flex-col justify-between">
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

