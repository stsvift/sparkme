import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Проверяем админ маршруты
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin-session')
    
    // Пропускаем страницу логина
    if (req.nextUrl.pathname === '/admin/login') {
      if (adminSession?.value === 'true') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return res
    }

    // Проверяем сессию для остальных admin маршрутов
    if (adminSession?.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
