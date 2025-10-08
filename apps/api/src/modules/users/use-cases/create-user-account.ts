import { hash } from 'bcryptjs'
import type { IOrganizationRepositoryContract } from '@/modules/organization/contracts/organization-repository-contract'
import type {
  ICreateUser,
  IUserRepositoryContract,
} from '../contracts/user-repository-contract'

type CreateUserAccountProps = Omit<ICreateUser, 'organization'>

interface ICreateUserAccountResponse {
  id: string
}

export class CreateUserAccount {
  constructor(
    private userRepository: IUserRepositoryContract,
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUserAccountProps): Promise<ICreateUserAccountResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const [_, domain] = email.split('@')
    const autoJoinOrganization =
      await this.organizationRepository.findByDomain(domain)

    const passwordHashed = await hash(password, 6)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHashed,
      organization: autoJoinOrganization,
    })

    return {
      id: user.id,
    }
  }
}
