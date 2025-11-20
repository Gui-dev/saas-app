import { auth } from '@/auth/auth'
import { Header } from '@/components/header'

export default async function Home() {
  const { user } = await auth()

  return (
    <div className="py-4">
      <Header />
      <main>
        <h1 className="text-3xl font-bold underline">
          Hello world! {user?.email}
        </h1>
      </main>
    </div>
  )
}
