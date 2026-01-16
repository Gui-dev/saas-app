import type { Account } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  IAccountRepositoryContract,
  ICreateAccount,
} from '../contracts/account-repository-contract'

export class AccountRepository implements IAccountRepositoryContract {
  public async findByUserId(userId: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_userId: {
          provider: 'GITHUB',
          userId,
        },
      },
    })

    return account
  }

  public async create({
    userId,
    providerAccountId,
    provider,
  }: ICreateAccount): Promise<Account> {
    const account = await prisma.account.create({
      data: {
        userId,
        providerAccountId,
        provider,
      },
    })

    return account
  }
}
