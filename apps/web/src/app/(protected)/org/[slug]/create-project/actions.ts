'use server'

import { z } from 'zod'
import { HTTPError } from 'ky'
import { createProject } from '@/http/create-project'
import { getCurrentOrganization } from '@/auth/auth'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'O nome precisa ter pelo menos 4 caracteres' }),
  description: z.string(),
})

export const createProjectAction = async (data: FormData) => {
  const result = projectSchema.safeParse(Object.fromEntries(data))
  const orgSlug = (await getCurrentOrganization())!

  console.log(orgSlug)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, description } = result.data
  try {
    await createProject({
      orgSlug,
      name,
      description,
    })
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
        'Ocorreu um erro ao tentar criar um projeto, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Projeto criado com sucesso',
    errors: null,
  }
}
