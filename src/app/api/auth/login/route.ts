import { NextRequest, NextResponse } from 'next/server'

import { signJWT, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica de campos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

    // Validação usando as variáveis de ambiente
    if (
      email.toLowerCase().trim() !== adminEmail.toLowerCase().trim() ||
      password !== adminPassword
    ) {
      // Mensagem genérica para não revelar se o email existe
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar JWT
    const token = await signJWT({ adminId: 1, email: adminEmail })

    // Retornar com cookie httpOnly
    const response = NextResponse.json({ success: true, email: adminEmail })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Auth Login Error]:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
