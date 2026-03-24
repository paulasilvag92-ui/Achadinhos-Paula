'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import AdminHeader from '@/components/AdminHeader'

interface Category {
  id: number
  name: string
  created_at: string
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formName, setFormName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function loadCategories() {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error('O nome é obrigatório')
      return
    }

    setSubmitting(true)
    const isEditing = editingId !== null
    const url = isEditing ? `/api/categories/${editingId}` : '/api/categories'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar categoria')
        setSubmitting(false)
        return
      }

      toast.success(isEditing ? '✅ Categoria atualizada!' : '✅ Categoria adicionada!')
      setFormName('')
      setEditingId(null)
      setShowForm(false)
      loadCategories()
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(category: Category) {
    setFormName(category.name)
    setEditingId(category.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setFormName('')
    setEditingId(null)
    setShowForm(false)
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Tem certeza que deseja excluir "${name}"? Essa ação falhará se houver produtos vinculados.`)) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('🗑️ Categoria excluída')
        setCategories((prev) => prev.filter((c) => c.id !== id))
      } else {
        toast.error(data.error || 'Erro ao excluir categoria')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
      }} />

      <AdminHeader />

      <div className="max-w-4xl mx-auto px-4 py-6 md:mt-0 mt-8">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-6"
            style={{ maxWidth: 220, display: 'inline-flex' }}
          >
            + Adicionar categoria
          </button>
        )}

        {showForm && (
          <div
            className="bg-white rounded-2xl p-5 mb-6 animate-slide-up"
            style={{ boxShadow: '0 4px 20px rgba(255,107,53,0.12)', border: '1px solid #FFE0D0' }}
          >
            <h2 className="font-bold text-base mb-4" style={{ color: '#1A1A2E' }}>
              {editingId ? '✏️ Editar categoria' : '➕ Nova categoria'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="input-label" htmlFor="name">Nome da Categoria *</label>
                <input
                  id="name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Maternidade"
                  required
                />
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? '⏳ Salvando...' : editingId ? '💾 Salvar edição' : '✅ Adicionar'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-xl font-semibold text-sm"
                  style={{ background: '#F3F4F6', color: '#6B7280' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base" style={{ color: '#1A1A2E' }}>
              📁 Categorias ({categories.length})
            </h2>
          </div>

          {loading && (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div
              className="text-center py-12 rounded-2xl"
              style={{ border: '2px dashed #FFD6C8', background: '#FFF8F5' }}
            >
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                Nenhuma categoria ainda. Adicione a primeira!
              </p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-4 flex items-center justify-between gap-3"
                  style={{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #F3F4F6',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1A1A2E' }}>
                      {category.name}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>
                      ID: {category.id}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(category)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#EFF6FF', color: '#3B82F6' }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#FEF2F2', color: '#EF4444' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
