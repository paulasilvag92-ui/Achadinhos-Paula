import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Achadinhos da Paula — Melhores Ofertas da Shopee',
  description:
    'Descubra os melhores achadinhos da Shopee! Produtos incríveis com ótimos preços selecionados pela Paula. Aproveite as ofertas!',
  keywords: 'achadinhos, shopee, ofertas, promoções, produtos baratos, compras online',
  openGraph: {
    title: 'Achadinhos da Paula',
    description: 'Os melhores produtos da Shopee selecionados para você!',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Achadinhos da Paula',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Achadinhos da Paula',
    description: 'Os melhores produtos da Shopee selecionados para você!',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        {children}
      </body>
    </html>
  )
}
