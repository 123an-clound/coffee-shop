import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isProtectedAdminPath } from '@/lib/supabase/admin-guard'
import { isAdminUser } from '@/lib/data/admin-users'

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request)

  if (!isProtectedAdminPath(request.nextUrl.pathname)) {
    return response
  }

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const isAdmin = await isAdminUser(supabase, user.id)
  if (!isAdmin) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
