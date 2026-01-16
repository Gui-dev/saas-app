import { TokenRepository } from '@/modules/token/repositories/token-repository'
import { UserRepository } from '../repositories/user-repository'
import {
  type IResetPasswordUseCaseRequest,
  ResetPasswordUseCase,
} from '../use-cases/reset-password'

export const makeResetPassword = async ({
  code,
  password,
}: IResetPasswordUseCaseRequest) => {
  const userRepository = new UserRepository()
  const tokenRepository = new TokenRepository()
  const resetPassword = new ResetPasswordUseCase(
    userRepository,
    tokenRepository
  )
  await resetPassword.execute({ code, password })
}
