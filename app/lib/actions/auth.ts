'use server'

import { cookies } from 'next/headers'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'

export async function getSession() {
  const supabase = createServerActionClient({ cookies })
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('GetSession error:', error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createServerActionClient({ cookies })
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  revalidatePath('/')
}

export async function signUp(email: string, password: string) {
  const supabase = createServerActionClient({ cookies })
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
  
  if (error) throw error
  
  revalidatePath('/')
}

export async function signOut() {
  const supabase = createServerActionClient({ cookies })
  const { error } = await supabase.auth.signOut()
  
  if (error) throw error
  
  revalidatePath('/')
}
