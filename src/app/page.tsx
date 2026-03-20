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
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar os produtos. Tente novamente.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 py-6">
        {/* Título da seção */}
        <div className="mb-5 animate-fade-in">
          <h2
            className="text-lg font-black"
            style={{ color: '#1A1A2E' }}
          >
            🔥 Achadinhos em destaque
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Ofertas selecionadas com carinho — clique para garantir!
          </p>
        </div>

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
        {!loading && !error && products.length === 0 && (
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
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
