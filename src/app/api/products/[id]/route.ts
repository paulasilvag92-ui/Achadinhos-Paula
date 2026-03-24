import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthPayload, unauthorizedResponse } from '@/lib/api-auth'

// PATCH /api/products/[id] — Atualiza um produto (requer auth admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getAuthPayload(request)
  if (!payload) return unauthorizedResponse()

  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()
    const { title, image_url, affiliate_link, position, category_id } = body

    const data: Record<string, string | number> = {}
    if (title !== undefined) data.title = String(title).trim()
    if (image_url !== undefined) data.image_url = String(image_url).trim()
    if (affiliate_link !== undefined) data.affiliate_link = String(affiliate_link).trim()
    if (position !== undefined) data.position = Number(position)
    if (category_id !== undefined) data.category_id = Number(category_id)

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(product)
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }
    console.error('[PATCH /api/products/[id]]:', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

// DELETE /api/products/[id] — Remove um produto (requer auth admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getAuthPayload(request)
  if (!payload) return unauthorizedResponse()

  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }
    console.error('[DELETE /api/products/[id]]:', error)
    return NextResponse.json({ error: 'Erro ao excluir produto' }, { status: 500 })
  }
}
