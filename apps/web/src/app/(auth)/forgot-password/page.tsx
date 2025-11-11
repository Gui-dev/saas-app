import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const ForgotPassword = () => {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
        />
      </div>

      <Button type="submit" className="w-full">
        Recuperar senha
      </Button>
      <Button className="w-full cursor-pointer" variant="link" asChild>
        <Link href="/sign-in">Fazer login</Link>
      </Button>
    </form>
  )
}

export default ForgotPassword
