import { TokenRepository } from '@/modules/token/repositories/token-repository'
import { UserRepository } from '../repositories/user-repository'
import { RequestPasswordRecoverUseCase } from '../use-cases/request-password-recover'

export const makeRequestPasswordRecover = async (email: string) => {
  const userRepository = new UserRepository()
  const tokenRepository = new TokenRepository()
  const requestPasswordRecover = new RequestPasswordRecoverUseCase(
    userRepository,
    tokenRepository
  )

  const token = await requestPasswordRecover.execute(email)

  return {
    token,
  }
}
