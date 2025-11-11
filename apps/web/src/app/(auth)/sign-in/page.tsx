import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/assets/github-icon.svg'
import { signInWithEmailAndPassword } from './actions'

const SignIn = () => {
  return (
    <form action={signInWithEmailAndPassword} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
        />
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Entrar
      </Button>
      <Button className="w-full cursor-pointer" variant="link" asChild>
        <Link href="/sign-up">Não tem uma conta? Crie uma.</Link>
      </Button>

      <Separator />
      <Button
        type="submit"
        variant="outline"
        className="w-full flex items-center"
      >
        <Image
          src={githubIcon}
          alt="Github icon"
          className="size-4 mr-2 dark:invert"
        />
        Entrar com o Github
      </Button>
    </form>
  )
}

export default SignIn
