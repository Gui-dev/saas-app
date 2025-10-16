import { AccountRepository } from '@/modules/accounts/repositories/account-repository'
import { UserRepository } from '../repositories/user-repository'
import {
  AuthenticateWithGithubUseCase,
  IAuthenticateWithGithubRequest,
} from '../use-cases/authenticate-with-github'

export const makeAuthenticateWithGithub = async ({
  githubId,
  name,
  email,
  avatar_url,
}: IAuthenticateWithGithubRequest): Promise<{ userId: string }> => {
  const userRepository = new UserRepository()
  const accountRepository = new AccountRepository()
  const authenticateWithGithub = new AuthenticateWithGithubUseCase(
    userRepository,
    accountRepository
  )
  const { userId } = await authenticateWithGithub.execute({
    githubId,
    name,
    email,
    avatar_url,
  })

  return {
    userId,
  }
}
