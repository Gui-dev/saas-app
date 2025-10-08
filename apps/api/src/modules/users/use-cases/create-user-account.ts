import { hash } from 'bcryptjs'
import {
  type ICreateUser,
  type IUserRepositoryContract,
} from '../contracts/user-repository-contract'

interface ICreateUserAccountResponse {
  id: string
}

export class CreateUserAccount {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUser): Promise<ICreateUserAccountResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const passwordHashed = await hash(password, 6)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHashed,
    })

    return {
      id: user.id,
    }
  }
}
