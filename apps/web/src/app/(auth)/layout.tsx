export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
