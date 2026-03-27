import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthPayload, unauthorizedResponse } from '@/lib/api-auth'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  // Autenticação de Admin
  const payload = await getAuthPayload(request)
  if (!payload) return unauthorizedResponse()

  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem foi recebida' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'O arquivo deve ser uma imagem válida' }, { status: 400 })
    }

    // Validar tamanho (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'A imagem deve ter no máximo 2MB' }, { status: 400 })
    }

    // Gerar um nome de arquivo único
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `logo-${Date.now()}.${ext}`

    // Fazer upload para o Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // URL pública fornecida pelo Vercel Blob
    const publicUrl = blob.url

    // Salva ou atualiza configuração no banco de dados
    await prisma.setting.upsert({
      where: { key: 'site_logo' },
      update: { value: publicUrl },
      create: { key: 'site_logo', value: publicUrl },
    })

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error) {
    console.error('[POST /api/settings/logo]:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload da logo para o Vercel Blob' }, { status: 500 })
  }
}
