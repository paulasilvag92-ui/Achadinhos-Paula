import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthPayload, unauthorizedResponse } from '@/lib/api-auth'

// PATCH /api/products/reorder — Atualiza posições em batch (requer auth admin)
export async function PATCH(request: NextRequest) {
  const payload = await getAuthPayload(request)
  if (!payload) return unauthorizedResponse()

  try {
    const body = await request.json()
    const { items } = body // Array de { id: number, position: number }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'items deve ser um array de { id, position }' },
        { status: 400 }
      )
    }

    // Atualizar cada produto em transação
    await prisma.$transaction(
      items.map(({ id, position }: { id: number; position: number }) =>
        prisma.product.update({
          where: { id },
          data: { position },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/products/reorder]:', error)
    return NextResponse.json({ error: 'Erro ao reordenar produtos' }, { status: 500 })
  }
}
