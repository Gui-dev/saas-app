'use server'

import { z } from 'zod'
import { HTTPError } from 'ky'
import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine(value => value.split(' ').length > 1, {
      message: 'Por favor, forneça um nome completo',
    }),
    email: z
      .string({ message: 'Por favor, forneça um e-mail' })
      .email({ message: 'Por favor, forneça um e-mail valido' }),
    password: z.string({ message: 'Por favor, forneça uma senha' }).min(6, {
      message: 'Por favor, forneça uma senha com pelo menos 6 caracteres',
    }),
    password_confirmation: z.string(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'As senhas devem ser iguais',
    path: ['password_confirmation'],
  })

export const signUpAction = async (data: FormData) => {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data
  try {
    const { id } = await signUp({
      name,
      email: String(email),
      password: String(password),
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
    message: null,
    errors: null,
  }
}
