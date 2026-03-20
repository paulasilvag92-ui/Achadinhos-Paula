'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
