'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  image_url: string
  affiliate_link: string
  position: number
}

const EMPTY_FORM = { title: '', image_url: '', affiliate_link: '' }

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Carregar produtos
  async function loadProducts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch {
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  // Logout
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  // Adicionar ou editar produto
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const isEditing = editingId !== null
    const url = isEditing ? `/api/products/${editingId}` : '/api/products'
    const method = isEditing ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar produto')
        return
      }

      toast.success(isEditing ? '✅ Produto atualizado!' : '✅ Produto adicionado!')
      setForm(EMPTY_FORM)
      setEditingId(null)
      setShowForm(false)
      loadProducts()
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setSubmitting(false)
    }
  }

  // Iniciar edição
  function startEdit(product: Product) {
    setForm({
      title: product.title,
      image_url: product.image_url,
      affiliate_link: product.affiliate_link,
    })
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancelar edição
  function cancelEdit() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  // Excluir produto
  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Excluir "${title}"?`)) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('🗑️ Produto excluído')
        setProducts((prev) => prev.filter((p) => p.id !== id))
      } else {
        toast.error('Erro ao excluir produto')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  // Drag-and-drop reordering
  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    const reordered = Array.from(products)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    // Atualizar posições
    const updated = reordered.map((p, i) => ({ ...p, position: i + 1 }))
    setProducts(updated)

    try {
      const res = await fetch('/api/products/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updated.map((p) => ({ id: p.id, position: p.position })) }),
      })
      if (res.ok) {
        toast.success('🔀 Ordem salva!')
      } else {
        toast.error('Erro ao salvar ordem')
        loadProducts()
      }
    } catch {
      toast.error('Erro de conexão')
      loadProducts()
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
      }} />

      {/* HEADER DO ADMIN */}
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
            <span className="text-xs ml-1" style={{ color: '#9CA3AF' }}>— Achadinhos da Paula</span>
          </div>
        </div>
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
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* BOTÃO ABRIR FORMULÁRIO */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-6"
            style={{ maxWidth: 220, display: 'inline-flex' }}
          >
            + Adicionar produto
          </button>
        )}

        {/* FORMULÁRIO ADICIONAR / EDITAR */}
        {showForm && (
          <div
            className="bg-white rounded-2xl p-5 mb-6 animate-slide-up"
            style={{ boxShadow: '0 4px 20px rgba(255,107,53,0.12)', border: '1px solid #FFE0D0' }}
          >
            <h2 className="font-bold text-base mb-4" style={{ color: '#1A1A2E' }}>
              {editingId ? '✏️ Editar produto' : '➕ Novo produto'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="input-label" htmlFor="title">Título do produto *</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Fone Bluetooth Premium com Cancelamento de Ruído"
                  required
                />
              </div>

              <div>
                <label className="input-label" htmlFor="image_url">URL da imagem *</label>
                <input
                  id="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                  required
                />
                {form.image_url && (
                  <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={form.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="input-label" htmlFor="affiliate_link">Link de afiliado (Shopee) *</label>
                <input
                  id="affiliate_link"
                  type="url"
                  value={form.affiliate_link}
                  onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
                  className="input-field"
                  placeholder="https://shopee.com.br/..."
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

        {/* LISTA DE PRODUTOS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base" style={{ color: '#1A1A2E' }}>
              📦 Produtos ({products.length})
            </h2>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>
              Arraste para reordenar
            </span>
          </div>

          {loading && (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div
              className="text-center py-12 rounded-2xl"
              style={{ border: '2px dashed #FFD6C8', background: '#FFF8F5' }}
            >
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                Nenhum produto ainda. Adicione o primeiro!
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="products">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2"
                  >
                    {products.map((product, index) => (
                      <Draggable
                        key={product.id}
                        draggableId={String(product.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-white rounded-xl p-3 flex items-center gap-3"
                            style={{
                              boxShadow: snapshot.isDragging
                                ? '0 8px 32px rgba(255,107,53,0.25)'
                                : '0 1px 4px rgba(0,0,0,0.06)',
                              border: snapshot.isDragging
                                ? '2px solid #FF6B35'
                                : '1px solid #F3F4F6',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {/* Handle de arrastar */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex-shrink-0 text-lg cursor-grab active:cursor-grabbing select-none"
                              style={{ color: '#D1D5DB' }}
                            >
                              ⠿
                            </div>

                            {/* Posição */}
                            <div
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}
                            >
                              {index + 1}
                            </div>

                            {/* Imagem */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-cover"
                                onError={() => {}}
                              />
                            </div>

                            {/* Título */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold truncate"
                                style={{ color: '#1A1A2E' }}
                              >
                                {product.title}
                              </p>
                              <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>
                                {product.affiliate_link}
                              </p>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => startEdit(product)}
                                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                                style={{ background: '#EFF6FF', color: '#3B82F6' }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(product.id, product.title)}
                                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                                style={{ background: '#FEF2F2', color: '#EF4444' }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  )
}
