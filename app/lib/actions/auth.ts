'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSession() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin-session')
  return session?.value === 'true'
}

export async function signIn(email: string, password: string) {
  // For demo purposes - replace with your actual auth logic
  if (email === 'admin@example.com' && password === 'admin') {
    cookies().set('admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return true
  }
  throw new Error('Invalid credentials')
}

export async function signOut() {
  cookies().delete('admin-session')
  redirect('/admin/login')
}

// Since we're using simple admin auth, we don't need signUp
export async function signUp(email: string, password: string) {
  throw new Error('Registration is not available')
}
