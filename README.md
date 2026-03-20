# 🛍️ Achadinhos da Paula

Site de vitrine de produtos afiliados da Shopee, com painel administrativo protegido.

**Stack:** Next.js 14 (App Router) • TypeScript • TailwindCSS • Prisma • PostgreSQL • JWT

---

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Conta no [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (PostgreSQL gratuito)

### 2. Clonar e instalar dependências

```bash
npm install
```

### 3. Configurar o banco de dados

#### Opção A — Neon (recomendado)
1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Na dashboard, copie a **Connection String** (começa com `postgresql://...`)

#### Opção B — Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings → Database → Connection string → URI**

### 4. Configurar variáveis de ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="coloque_uma_chave_secreta_aleatoria_aqui_min32chars"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> 💡 Para gerar uma JWT_SECRET segura: [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

> ⚠️ Se usar **Neon com pooling**, `DATABASE_URL` usa a connection pooler e `DIRECT_URL` usa a connection direta. Ambas podem ser iguais se não usar pooling.

### 5. Criar as tabelas e popular o banco

```bash
# Criar as tabelas no banco
npx prisma migrate dev --name init

# Popular com usuário admin e produtos de exemplo
npx prisma db seed
```

### 6. Rodar localmente

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Credenciais do Admin

Após rodar o seed:

| Campo | Valor |
|-------|-------|
| URL | http://localhost:3000/admin/login |
| Email | admin@achadinhos.com |
| Senha | admin123 |

> ⚠️ **Troque a senha após o primeiro login** editando `prisma/seed.ts` e rodando o seed novamente, ou via painel futuro de configurações.

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # POST — login admin
│   │   │   └── logout/route.ts     # POST — logout
│   │   └── products/
│   │       ├── route.ts            # GET (público) + POST (admin)
│   │       ├── [id]/route.ts       # PATCH + DELETE (admin)
│   │       └── reorder/route.ts    # PATCH batch reorder (admin)
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard admin
│   │   └── login/page.tsx          # Login admin
│   ├── globals.css
│   ├── layout.tsx                  # Layout raiz + SEO
│   └── page.tsx                    # Home pública
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ProductSkeleton.tsx
├── lib/
│   ├── auth.ts                     # JWT + bcrypt utils
│   ├── prisma.ts                   # Prisma singleton
│   └── api-auth.ts                 # Auth helper para routes
└── middleware.ts                   # Proteção de rotas /admin
```

---

## ☁️ Deploy na Vercel

1. Suba o código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente (mesmas do `.env.local`):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (URL da sua Vercel, ex: `https://meusite.vercel.app`)
4. O deploy acontece automaticamente

> 💡 O comando `prisma generate` é executado automaticamente no `postinstall` durante o deploy.
> Para rodar o seed na Vercel: use o **Vercel CLI** localmente com `vercel env pull` e rode `npx prisma db seed`.

---

## 🖼️ Como adicionar a logo

1. Coloque o arquivo `logo.png` (ou `.svg`) na pasta `public/`
2. Edite `src/components/Header.tsx`
3. Descomente o bloco `<Image src="/logo.png" ... />` e remova o `<div>` com a letra "A"

---

## 🧩 Funcionalidades

### Site Público (/)
- ✅ Grid responsivo de produtos (mobile-first, 2→3→4 colunas)
- ✅ Skeleton loading animado
- ✅ Lazy loading de imagens com fallback
- ✅ Botão CTA com animação hover
- ✅ SEO básico (title, description, Open Graph)
- ✅ Footer com disclosure de afiliado

### Painel Admin (/admin)
- ✅ Login com email/senha (JWT httpOnly cookie)
- ✅ Adicionar produto (URL imagem + título + link afiliado)
- ✅ Preview da imagem ao digitar URL
- ✅ Editar produto
- ✅ Excluir produto (com confirmação)
- ✅ Reordenar por drag-and-drop
- ✅ Notificações de sucesso e erro (toasts)
- ✅ Proteção de rotas via middleware

---

## 🛠️ Scripts úteis

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Build de produção
npx prisma studio    # Interface visual do banco de dados
npx prisma db seed   # Popular banco com dados iniciais
```
