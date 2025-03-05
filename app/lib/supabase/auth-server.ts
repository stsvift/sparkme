import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function checkIsAdminServer() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  const { data: user } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('id', session.user.id)
    .single()
  
  return user?.isAdmin || false
}
