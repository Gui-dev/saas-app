import { compare } from 'bcryptjs'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IUserRepositoryContract } from '../contracts/user-repository-contract'

interface IAuthenticateWithPasswordRequest {
  email: string
  password: string
}

export class AuthenticateWithPasswordUseCase {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({ email, password }: IAuthenticateWithPasswordRequest) {
    const userFromEmail = await this.userRepository.findByEmail(email)

    if (!userFromEmail) {
      throw new Error('Invalid credentials')
    }

    if (userFromEmail.passwordHash === null) {
      throw new BadRequestError(
        'Invalid credentials. User does not have a password, use social login'
      )
    }

    const isPasswordValid = await compare(password, userFromEmail.passwordHash)

    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials')
    }

    return {
      id: userFromEmail.id,
    }
  }
}
