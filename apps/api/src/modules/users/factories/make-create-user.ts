import { ICreateUser } from '../contracts/user-repository-contract'
import { UserRepository } from '../repositories/user-repository'
import { CreateUserAccount } from '../use-cases/create-user-account'

export const makeCreateUser = async ({
  name,
  email,
  password,
}: ICreateUser) => {
  const userRepository = new UserRepository()
  const createUserAccount = new CreateUserAccount(userRepository)
  const { id } = await createUserAccount.execute({ name, email, password })

  return {
    id,
  }
}
