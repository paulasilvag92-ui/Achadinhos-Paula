import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    
    // Transformar array de settings em um objeto de chave-valor simples
    const configMap: Record<string, string> = {}
    for (const s of settings) {
      configMap[s.key] = s.value
    }
    
    return NextResponse.json(configMap)
  } catch (error) {
    console.error('[GET /api/settings]:', error)
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 })
  }
}
