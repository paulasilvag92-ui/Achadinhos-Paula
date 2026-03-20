import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const passwordHash = await bcrypt.hash('admin123', 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@achadinhos.com' },
    update: {},
    create: {
      email: 'admin@achadinhos.com',
      password_hash: passwordHash,
    },
  })

  console.log(`✅ Admin criado: ${admin.email}`)

  // Criar produtos de exemplo para visualização inicial
  const produtos = [
    {
      title: 'Fone Bluetooth Premium com Cancelamento de Ruído',
      image_url: 'https://picsum.photos/seed/fone/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 1,
    },
    {
      title: 'Smartwatch Fitness com Monitor Cardíaco',
      image_url: 'https://picsum.photos/seed/watch/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 2,
    },
    {
      title: 'Carregador Turbo 65W Universal USB-C',
      image_url: 'https://picsum.photos/seed/charger/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 3,
    },
    {
      title: 'Caixa de Som Bluetooth à Prova d\'Água',
      image_url: 'https://picsum.photos/seed/speaker/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 4,
    },
    {
      title: 'Suporte Ergonômico para Notebook',
      image_url: 'https://picsum.photos/seed/stand/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 5,
    },
    {
      title: 'Anel de Luz LED para Selfie e Lives',
      image_url: 'https://picsum.photos/seed/ring/400/400',
      affiliate_link: 'https://shopee.com.br',
      position: 6,
    },
  ]

  for (const produto of produtos) {
    await prisma.product.upsert({
      where: { id: produto.position },
      update: {},
      create: produto,
    })
  }

  console.log(`✅ ${produtos.length} produtos de exemplo criados`)
  console.log('')
  console.log('🎉 Seed concluído com sucesso!')
  console.log('   Login admin: admin@achadinhos.com')
  console.log('   Senha: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
