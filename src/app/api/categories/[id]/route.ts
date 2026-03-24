import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Atualizar categoria
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const data = await request.json()
    const { name } = data

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'O nome da categoria é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar duplicação
    const existing = await prisma.category.findFirst({
      where: { 
        name: name.trim(),
        NOT: { id: id }
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe outra categoria com este nome' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

// Excluir categoria
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar se há produtos associados
    const count = await prisma.product.count({
      where: { category_id: id }
    })

    if (count > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir. Existem ${count} produto(s) vinculado(s) a esta categoria.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    )
  }
}
