import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/assets/github-icon.svg'

const SignUp = () => {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Digite seu nome"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="name">E-mail</Label>
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
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirmar a Senha</Label>
        <Input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          placeholder="Digite sua senha novamente"
        />
      </div>

      <Button type="submit" className="w-full">
        Criar conta
      </Button>
      <Button className="w-full cursor-pointer" variant="link" asChild>
        <Link href="/sign-in">Já tem uma conta? Faca login.</Link>
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
        Criar conta com o Github
      </Button>
    </form>
  )
}

export default SignUp
