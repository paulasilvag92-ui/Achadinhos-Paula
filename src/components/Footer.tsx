export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-12 py-8 text-center"
      style={{ borderTop: '1px solid #FFE0D0' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm" style={{ color: '#6B7280' }}>
          <span>✅ Links verificados</span>
          <span>🔒 Compra segura na Shopee</span>
          <span>💚 Curadoria com carinho</span>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 mx-auto mb-4 rounded" style={{ background: 'linear-gradient(90deg, #FF6B35, #FF2D55)' }} />

        <p className="text-sm" style={{ color: '#9CA3AF' }}>
          © {year} Achadinhos da Paula. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-1" style={{ color: '#D1D5DB' }}>
          Este site contém links de afiliado. Ao comprar, você apoia este trabalho sem custo adicional. 💛
        </p>
      </div>
    </footer>
  )
}
