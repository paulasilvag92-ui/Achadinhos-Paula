export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(255,107,53,0.08)' }}>
      {/* Imagem skeleton */}
      <div className="skeleton w-full" style={{ aspectRatio: '1/1' }} />

      {/* Conteúdo skeleton */}
      <div className="p-3 flex flex-col gap-3">
        {/* Título — 2 linhas */}
        <div className="flex flex-col gap-1.5">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-3/4 rounded" />
        </div>

        {/* Botão skeleton */}
        <div className="skeleton h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}

// Grid de skeletons para uso na página inicial
export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
