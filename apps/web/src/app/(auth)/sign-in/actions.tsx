'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { HTTPError } from 'ky'

import { signInWithPassword } from '@/http/sign-in--with-password'

const signInSchema = z.object({
  email: z
    .string({ message: 'Por favor, forneça um e-mail' })
    .email({ message: 'Por favor, forneça um e-mail valido' }),
  password: z
    .string({ message: 'Por favor, forneça uma senha' })
    .min(1, { message: 'Por favor, forneça uma senha' }),
})

export const signInWithEmailAndPassword = async (data: FormData) => {
  const result = signInSchema.safeParse(Object.fromEntries(data))
  const cookieStore = await cookies()

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data
  try {
    const { token } = await signInWithPassword({
      email: String(email),
      password: String(password),
    })

    cookieStore.set('saas-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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
      message: 'Ocorreu um erro ao fazer login, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
