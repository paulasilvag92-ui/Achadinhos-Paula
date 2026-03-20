import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signJWT, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

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

    // Buscar usuário admin no banco
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!admin) {
      // Mensagem genérica para não revelar se o email existe
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await comparePassword(password, admin.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar JWT
    const token = await signJWT({ adminId: admin.id, email: admin.email })

    // Retornar com cookie httpOnly
    const response = NextResponse.json({ success: true, email: admin.email })

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
