import { OrganizationRepository } from '@/modules/organization/repositories/organization-repository'
import type { ICreateUser } from '../contracts/user-repository-contract'
import { UserRepository } from '../repositories/user-repository'
import { CreateUserAccountUseCase } from '../use-cases/create-user-account'

export const makeCreateUser = async ({
  name,
  email,
  password,
}: Omit<ICreateUser, 'organization'>) => {
  const userRepository = new UserRepository()
  const organizationRepository = new OrganizationRepository()
  const createUserAccount = new CreateUserAccountUseCase(
    userRepository,
    organizationRepository
  )
  const { id } = await createUserAccount.execute({ name, email, password })

  return {
    id,
  }
}
