'use client'

import { useEffect, useState, Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { ProductSkeletonGrid } from '@/components/ProductSkeleton'

interface Product {
  id: number
  title: string
  image_url: string
  affiliate_link: string
  position: number
  category?: { id: number, name: string }
}

interface Category {
  id: number
  name: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData)
        setCategories(categoriesData)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar os dados da página. Tente novamente.')
        setLoading(false)
      })
  }, [])

  // Atualizar SEO dinamicamente
  useEffect(() => {
    let title = 'Achadinhos da Paula — Melhores Ofertas da Shopee'
    let desc = 'Descubra os melhores achadinhos da Shopee! Produtos incríveis selecionados pela Paula.'

    if (selectedCategory !== null) {
      const cat = categories.find(c => c.id === selectedCategory)
      if (cat) {
        title = `Achadinhos de ${cat.name} — Seleção da Paula`
        desc = `Confira os melhores achadinhos e ofertas da categoria ${cat.name}. Produtos selecionados especialmente para você!`
      }
    }

    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', desc)
    }
  }, [selectedCategory, categories])

  const filteredProducts = selectedCategory === null 
    ? products 
    : products.filter(p => p.category?.id === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-6">
        {/* Título da seção */}
        <div className="mb-5 animate-fade-in text-center md:text-left">
          <h2
            className="text-2xl font-black mb-1"
            style={{ color: '#1A1A2E' }}
          >
            🔥 Achadinhos em destaque
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Ofertas selecionadas com carinho — clique para garantir!
          </p>
        </div>

        {/* Filtro de Categorias */}
        {!loading && !error && categories.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 mb-6 hide-scrollbar animate-fade-in">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-[#FF6B35] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Estado de carregamento */}
        {loading && <ProductSkeletonGrid count={8} />}

        {/* Estado de erro */}
        {error && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-base font-semibold" style={{ color: '#1A1A2E' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4"
              style={{ maxWidth: 200, display: 'inline-flex' }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-5xl mb-4">🛍️</p>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
              Em breve, muitos achadinhos!
            </h3>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Novidades chegando em breve. Fique ligado! 🎉
            </p>
          </div>
        )}

        {/* Grid de produtos */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
