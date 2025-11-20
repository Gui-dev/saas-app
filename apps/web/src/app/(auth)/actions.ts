'use server'

import { redirect } from 'next/navigation'

export const signInWithGithub = async () => {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInURL.searchParams.set('client_id', 'Ov23limEJdqCk08p53bJ')
  githubSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback'
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}
