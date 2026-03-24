'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Produtos', path: '/admin' },
    { name: 'Categorias', path: '/admin/categories' },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between" style={{ borderColor: '#FFE0D0' }}>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}
        >
          A
        </div>
        <div>
          <span className="font-bold text-sm" style={{ color: '#1A1A2E' }}>Admin</span>
          <span className="text-xs ml-1" style={{ color: '#9CA3AF' }}>— Achadinhos</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              pathname === link.path
                ? 'bg-[#FFE0D0] text-[#FF6B35]'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          className="text-xs px-3 py-1.5 rounded-lg font-medium border"
          style={{ color: '#6B7280', borderColor: '#E5E7EB' }}
        >
          Ver site
        </a>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
          style={{ background: '#EF4444' }}
        >
          Sair
        </button>
      </div>

      <div className="md:hidden w-full flex absolute bottom-[-45px] left-0 bg-white border-b px-4 py-2 gap-4" style={{ borderColor: '#FFE0D0' }}>
         {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-sm font-semibold px-3 py-1 transition-colors ${
              pathname === link.path
                ? 'text-[#FF6B35] underline'
                : 'text-gray-500'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  )
}
