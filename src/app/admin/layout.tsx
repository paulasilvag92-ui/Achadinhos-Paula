export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {children}
    </div>
  )
}
