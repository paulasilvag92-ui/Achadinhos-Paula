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

  // Criar categorias padrão
  const categorias = ['Home', 'Maternidade', 'Eletronicos']
  const categoryRecords = []

  for (const name of categorias) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    categoryRecords.push(cat)
  }
  console.log(`✅ ${categoryRecords.length} categorias de exemplo criadas`)

  // Criar produtos de exemplo para visualização inicial
  const homeCategory = categoryRecords.find(c => c.name === 'Home')?.id || 1
  const techCategory = categoryRecords.find(c => c.name === 'Eletronicos')?.id || 1

  const produtos = [
    {
      title: 'Fatiador de Legumes 16 em 1',
      image_url: 'https://down-br.img.susercontent.com/file/br-11134207-81z1k-mh6x7kos49ac54.webp',
      affiliate_link: 'https://s.shopee.com.br/3qIbuS4iQd',
      position: 1,
      category_id: homeCategory,
    },
    {
      title: 'Percarbonato de Sodio Calisul - 100% Pure - Tira Manchas Roupas Brancas e Coloridas',
      image_url: 'https://down-br.img.susercontent.com/file/br-11134207-81ztx-mkseiyuts0036c.webp',
      affiliate_link: 'https://s.shopee.com.br/3B2v7FOJLK',
      position: 2,
      category_id: homeCategory,
    },
    {
      title: 'Mop com Refil Espuma Esponja de Pva',
      image_url: 'https://down-br.img.susercontent.com/file/sg-11134201-7rd6i-lwrx7wmx7ly917.webp',
      affiliate_link: 'https://s.shopee.com.br/7KsU56PjnU',
      position: 3,
      category_id: homeCategory,
    },
    {
      title: '360°Suporte dobrável para celular a vácuo',
      image_url: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdfy4c9l38opc1.webp',
      affiliate_link: 'https://s.shopee.com.br/5q3gIR6c5u',
      position: 4,
      category_id: techCategory,
    },
  ]

  for (const produto of produtos) {
    await prisma.product.upsert({
      where: { id: produto.position },
      update: produto,
      create: produto,
    })
  }

  console.log(`✅ ${produtos.length} produtos de exemplo criados`)

  // Iniciar configurações padrão
  const siteLogo = await prisma.setting.upsert({
    where: { key: 'site_logo' },
    update: {},
    create: {
      key: 'site_logo',
      value: ''
    }
  })

  console.log('✅ Configurações padrão inseridas')

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
