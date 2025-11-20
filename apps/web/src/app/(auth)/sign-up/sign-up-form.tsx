'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { useFormState } from '@/hooks/use-form-state'
import { signInWithGithub } from '../actions'
import { signUpAction } from './actions'

export const SignUpForm = () => {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/sign-in')
    }
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Digite seu nome"
          />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="name">E-mail</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Digite seu e-mail"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Digite sua senha"
          />
          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirmar a Senha</Label>
          <Input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="Digite sua senha novamente"
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isPending && 'Criar conta'}
        </Button>
        <Button className="w-full cursor-pointer" variant="link" asChild>
          <Link href="/sign-in">Já tem uma conta? Faca login.</Link>
        </Button>
      </form>

      <Separator />

      <form onSubmit={signInWithGithub}>
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
    </div>
  )
}
