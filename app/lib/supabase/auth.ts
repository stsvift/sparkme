import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { cookies } from 'next/headers'

// Server-side admin check
export async function checkIsAdminServer() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  const { data: user } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('id', session.user.id)
    .single()
  
  return user?.isAdmin || false
}

// Client-side admin check
export async function checkIsAdminClient() {
  const supabase = createBrowserClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  const { data: user } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('id', session.user.id)
    .single()
  
  return user?.isAdmin || false
}
