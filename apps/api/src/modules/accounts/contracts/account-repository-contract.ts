import type { Account } from '@/generated/prisma'

export interface ICreateAccount {
  userId: string
  provider: 'GITHUB'
  providerAccountId: string
}

export interface IAccountRepositoryContract {
  findByUserId(userId: string): Promise<Account | null>
  create(data: ICreateAccount): Promise<Account>
}
