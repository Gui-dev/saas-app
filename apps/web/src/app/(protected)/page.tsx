import { auth } from '@/auth/auth'
import { Header } from '@/components/header'

export default async function Home() {
  const { user } = await auth()

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <p className="text-muted-foreground text-sm">
          Selecione uma organização
        </p>
      </main>
    </div>
  )
}
