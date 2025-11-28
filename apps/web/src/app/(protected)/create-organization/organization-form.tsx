'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction } from './actions'

export const OrganizationForm = () => {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createOrganizationAction
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao criar organização</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Tudo certo</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Nome da organizacao</Label>
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
        <Label htmlFor="domain">Dominio do e-mail</Label>
        <Input
          type="text"
          name="domain"
          id="domain"
          inputMode="url"
          placeholder="Digite o dominio do e-mail (ex: example.com)"
        />
        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            name="shouldAttchUsersByDomain"
            id="shouldAttchUsersByDomain"
            className="translate-y-0.5"
          />
          <label htmlFor="shouldAttchUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Adicionar novos membros automaticamente
            </span>
            <p className="text-xs text-muted-foreground">
              Isso convidará automaticamente todos os membros com o mesmo
              domínio de e-mail para esta organização.
            </p>
          </label>
        </div>
        {errors?.shouldAttchUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.shouldAttchUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isPending && 'Salvar organização'}
      </Button>
    </form>
  )
}
