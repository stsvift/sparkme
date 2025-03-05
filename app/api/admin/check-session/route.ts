import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const adminSession = cookies().get('admin-session')
  
  if (adminSession?.value === 'true') {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  )
}
