import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home } from 'lucide-react'
import DecryptedText from '@/components/decryptedText'

export default function NotFound() {
  return (
    <main className="h-screen w-full flex items-center justify-center px-4 bg-white">
      <div className="text-center space-y-8" style={{ width: '100%', justifyContent: 'center',  display: 'inline-flex', flexDirection:  'column' } }>
      <DecryptedText 
          text="Страница не найдена :(" 
          className="text-2xl font-medium text-gray-800"
          parentClassName="block mb-6"
        />
      <Link href="/">
          <Button 
            variant="default" 
            className="font-medium bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Home className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>
    </main>
  )
}
