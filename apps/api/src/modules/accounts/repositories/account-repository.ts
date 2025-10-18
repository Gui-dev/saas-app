import { Account } from '@/generated/prisma'
import {
  IAccountRepositoryContract,
  ICreateAccount,
} from '../contracts/account-repository-contract'
import { prisma } from '@/lib/prisma'

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
