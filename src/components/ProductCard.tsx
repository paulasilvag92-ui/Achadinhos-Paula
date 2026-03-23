'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: number
  title: string
  image_url: string
  affiliate_link: string
  position: number
  clicks?: number
}

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  const delay = `${index * 60}ms`

  return (
    <div
      className="product-card flex flex-col"
      style={{ animationDelay: delay }}
    >
      {/* Imagem do Produto */}
      <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '1 / 1' }}>
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FFF0EB, #FFD6C8)' }}
          >
            <span className="text-4xl">🛍️</span>
          </div>
        ) : (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badge Shopee */}
        <div className="absolute top-2 left-2">
          <span className="badge-shopee">
            🛒 Shopee
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-col gap-3 p-3 flex-1">
        {/* Título */}
        <h3
          className="font-semibold text-sm leading-snug"
          style={{
            color: '#1A1A2E',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Botão CTA */}
        <div className="mt-auto">
          <a
            href={`/api/redirect/${product.id}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-primary"
            aria-label={`Ver oferta: ${product.title}`}
          >
            🛍️ Ver oferta
          </a>
        </div>
      </div>
    </div>
  )
}
