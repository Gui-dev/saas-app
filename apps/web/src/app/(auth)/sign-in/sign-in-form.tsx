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
import { signInWithEmailAndPassword } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { useFormState } from '@/hooks/use-form-state'
import { signInWithGithub } from '../actions'

export const SignInForm = () => {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
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
          <Label htmlFor="email">Email</Label>
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

          <Link
            href="/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isPending && 'Entrar'}
        </Button>
        <Button className="w-full cursor-pointer" variant="link" asChild>
          <Link href="/sign-up">Não tem uma conta? Crie uma.</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
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
    </div>
  )
}
