'use server'

import { z } from 'zod'
import { HTTPError } from 'ky'
import { createOrganization } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'O nome precisa ter pelo menos 4 caracteres' }),
    domain: z
      .string()
      .nullable()
      .refine(
        value => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/ // Regex para verificar se o dominio e valido
            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Por favor, forneça um dominio valido' }
      ),
    shouldAttchUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform(value => value === true || value === 'on')
      .default(false),
  })
  .refine(
    data => {
      if (data.shouldAttchUsersByDomain && !data.domain) {
        return false
      }

      return true
    },
    {
      message:
        'Por favor, forneça um dominio valido quando adicionar membros automaticamente',
      path: ['domain'],
    }
  )

export const createOrganizationAction = async (data: FormData) => {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttchUsersByDomain } = result.data
  try {
    const { id } = await createOrganization({
      name,
      domain: String(domain),
      shouldAttchUsersByDomain,
    })

    console.log('ID: ', id)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message:
        'Ocorreu um erro ao tentar criar sua conta, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Organização criada com sucesso',
    errors: null,
  }
}
