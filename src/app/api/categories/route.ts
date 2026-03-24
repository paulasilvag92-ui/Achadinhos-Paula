import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Listar todas as categorias
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

// Criar nova categoria
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name } = data

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'O nome da categoria é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar duplicação
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
