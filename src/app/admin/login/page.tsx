'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 50%, #1A1A2E 100%)' }}
    >
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}
          >
            A
          </div>
          <h1 className="text-2xl font-black text-white">Achadinhos da Paula</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Painel Administrativo
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: '#1A1A2E' }}>
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@achadinhos.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="text-sm font-medium p-3 rounded-lg"
                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
              >
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? '⏳ Entrando...' : '🔐 Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
