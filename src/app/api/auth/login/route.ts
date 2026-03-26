import { NextRequest, NextResponse } from 'next/server'

import { signJWT, COOKIE_NAME, COOKIE_MAX_AGE, comparePassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Buscar admin no banco de dados
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() }
    })
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Comparar senha com hash
    const isPasswordValid = await comparePassword(password, admin.password_hash)

    if (!isPasswordValid) {
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
