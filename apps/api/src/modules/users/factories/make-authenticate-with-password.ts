import { UserRepository } from '../repositories/user-repository'
import { AuthenticateWithPasswordUseCase } from '../use-cases/authenticate-with-password'

interface IAuthenticateWithPasswordRequest {
  email: string
  password: string
}

export const makeAuthenticateWithPassword = async ({
  email,
  password,
}: IAuthenticateWithPasswordRequest) => {
  const userRepository = new UserRepository()
  const authenticateWithPassword = new AuthenticateWithPasswordUseCase(
    userRepository
  )
  const { id } = await authenticateWithPassword.execute({ email, password })

  return {
    userId: id,
  }
}
