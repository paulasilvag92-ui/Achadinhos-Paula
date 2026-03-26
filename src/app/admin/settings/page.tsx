'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import AdminHeader from '@/components/AdminHeader'

export default function AdminSettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar as configurações
  async function loadSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.site_logo) {
        setLogoUrl(data.site_logo)
      }
    } catch {
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSettings() }, [])

  // Fazer o upload
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação frontend (tamanho)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const res = await fetch('/api/settings/logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro no upload da logo')
        return
      }

      toast.success('✅ Logo atualizada com sucesso!')
      
      // Atualizar no preview forçando cache busting simples visual,
      // pois senão o browser pode usar imagem antiga do cache se nome colidir (resolvido por usar Date.now() no backend)
      setLogoUrl(data.url)
    } catch {
      toast.error('Erro de conexão no upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F8FAFC' }}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
      }} />

      <AdminHeader />

      <div className="max-w-4xl mx-auto px-4 py-8 md:mt-2 mt-8">
        <h2 className="font-bold text-xl mb-6 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
          ⚙️ Configurações do Site
        </h2>

        <div
          className="bg-white rounded-2xl p-6 border"
          style={{ boxShadow: '0 4px 12px rgba(255,107,53,0.06)', borderColor: '#F0E8E3' }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Visualização da Logo */}
            <div className="flex-shrink-0 flex flex-col gap-3 items-center justify-center">
              <span className="text-sm font-semibold" style={{ color: '#6B7280' }}>Logo Padrão</span>
              
              <div
                className="relative flex items-center justify-center rounded-2xl overflow-hidden"
                style={{ 
                  width: 120, height: 120, 
                  background: logoUrl ? 'transparent' : 'linear-gradient(135deg, #FF6B35, #FF2D55)',
                  border: logoUrl ? '2px dashed #D1D5DB' : 'none'
                }}
              >
                {loading ? (
                  <div className="skeleton w-full h-full" />
                ) : logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo do Site"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-white font-black text-5xl">A</div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                     <span className="text-white font-bold text-sm">⏳</span>
                  </div>
                )}
              </div>
            </div>

            {/* Formulário / Ações */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A2E' }}>Alterar Logotipo</h3>
              <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
                Recomendamos imagens quadradas (1:1) com fundo transparente no formato PNG ou SVG. Tamanho máximo permitido: 2MB.
              </p>

              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                  style={{ maxWidth: 220, display: 'inline-flex', opacity: uploading ? 0.6 : 1 }}
                  disabled={uploading}
                >
                  {uploading ? 'Aguarde...' : '📷 Fazer Upload da Logo'}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
