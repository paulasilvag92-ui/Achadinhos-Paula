import Image from 'next/image'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: 'white', boxShadow: '0 2px 16px rgba(255,107,53,0.1)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Área da Logo */}
          <div
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}
          >
            {/* Quando tiver logo: substitua pelo <Image> abaixo
            <Image
              src="/logo.png"
              alt="Achadinhos da Paula"
              fill
              className="object-cover"
            />
            */}
            <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
              A
            </div>
          </div>

          {/* Nome do site */}
          <div>
            <h1 className="font-black text-xl leading-tight" style={{ color: '#1A1A2E' }}>
              Achadinhos da Paula
            </h1>
            <p className="text-xs font-medium" style={{ color: '#FF6B35' }}>
              ✨ Os melhores achados da Shopee
            </p>
          </div>
        </div>
      </div>

      {/* Barra de destaque */}
      <div
        className="w-full py-1.5 text-center text-xs font-semibold text-white"
        style={{ background: 'linear-gradient(90deg, #FF6B35, #FF2D55, #FF6B35)', backgroundSize: '200% 100%' }}
      >
        🔥 Ofertas selecionadas com carinho para você • Clique e garanta o seu!
      </div>
    </header>
  )
}
