import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_change_in_production'
)

export const COOKIE_NAME = 'achadinhos_token'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias

/**
 * Gera um token JWT para o usuário admin
 */
export async function signJWT(payload: { adminId: number; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

/**
 * Verifica e decodifica um token JWT
 */
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { adminId: number; email: string }
  } catch {
    return null
  }
}

/**
 * Gera hash bcrypt de uma senha
 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

/**
 * Compara senha com hash
 */
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}
