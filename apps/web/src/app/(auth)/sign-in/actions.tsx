'use server'

import { api } from '@/http/api-client'
import { signInWithPassword } from '@/http/sign-in--with-password'

export const signInWithEmailAndPassword = async (data: FormData) => {
  const { email, password } = Object.fromEntries(data)
  const result = await signInWithPassword({
    email: String(email),
    password: String(password),
  })

  return result
}
