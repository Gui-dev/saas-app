import { z } from 'zod'

export const organizationSchema = z
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
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform(value => value === true || value === 'on')
      .default(false),
  })
  .refine(
    data => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
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

export type IOrganizationSchema = z.infer<typeof organizationSchema>
