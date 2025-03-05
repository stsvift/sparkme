'use client'

import { createClientSupabaseClient, type TypedSupabaseClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'

const Context = createContext<{ supabase: TypedSupabaseClient } | null>(null)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}
