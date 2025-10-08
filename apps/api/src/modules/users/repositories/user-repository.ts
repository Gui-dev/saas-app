import type { User } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  ICreateUser,
  IUserRepositoryContract,
} from '../contracts/user-repository-contract'

export class UserRepository implements IUserRepositoryContract {
  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  public async create({
    name,
    email,
    password,
    organization,
  }: ICreateUser): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password,
        member_on: organization
          ? {
              create: {
                organizationId: organization.id,
              },
            }
          : undefined,
      },
    })

    return user
  }
}
