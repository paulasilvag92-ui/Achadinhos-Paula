import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT, COOKIE_NAME } from '@/lib/auth'

// Rotas que requerem autenticação admin
const PROTECTED_PATHS = ['/admin']
// Exceção: página de login não precisa de autenticação
const PUBLIC_ADMIN_PATHS = ['/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota é protegida
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !isPublicAdmin) {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = await verifyJWT(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete(COOKIE_NAME)
      return response
    }
  }

  // Se já estiver logado e tentar acessar /admin/login, redirecionar para /admin
  if (isPublicAdmin) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (token) {
      const payload = await verifyJWT(token)
      if (payload) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
