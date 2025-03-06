import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin-session')
    
    if (req.nextUrl.pathname === '/admin/login') {
      if (adminSession?.value === 'true') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return res
    }

    if (adminSession?.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
