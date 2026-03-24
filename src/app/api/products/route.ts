import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthPayload, unauthorizedResponse } from '@/lib/api-auth'

// GET /api/products — Lista todos os produtos ordenados por position (público)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { position: 'asc' },
      include: { category: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('[GET /api/products]:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

// POST /api/products — Cria um novo produto (requer auth admin)
export async function POST(request: NextRequest) {
  const payload = await getAuthPayload(request)
  if (!payload) return unauthorizedResponse()

  try {
    const body = await request.json()
    const { title, image_url, affiliate_link, position, category_id } = body

    if (!title || !image_url || !affiliate_link || !category_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, image_url, affiliate_link, category_id' },
        { status: 400 }
      )
    }

    // Determinar a última posição se não informada
    let pos = position
    if (pos === undefined || pos === null) {
      const last = await prisma.product.findFirst({ orderBy: { position: 'desc' } })
      pos = last ? last.position + 1 : 1
    }

    const product = await prisma.product.create({
      data: {
        title: String(title).trim(),
        image_url: String(image_url).trim(),
        affiliate_link: String(affiliate_link).trim(),
        position: Number(pos),
        category_id: Number(category_id),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('[POST /api/products]:', error)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
