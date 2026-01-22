function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/50 flex justify-center">
      <div className="mobile-container relative">
        {children}
      </div>
    </div>
  )
}

export default MobileLayout