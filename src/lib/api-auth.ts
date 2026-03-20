import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT, COOKIE_NAME } from '@/lib/auth'

/**
 * Verifica se a requisição tem um token JWT válido de admin
 * Retorna o payload JWT ou null
 */
export async function getAuthPayload(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifyJWT(token)
}

/**
 * Resposta de erro para não autorizado
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}
