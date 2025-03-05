import { createClient } from '@/utils/supabase/client'

export async function checkIsAdminClient() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  const { data: user } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('id', session.user.id)
    .single()
  
  return user?.isAdmin || false
}
