import { randomUUID } from 'node:crypto'

import type { Account } from '@/generated/prisma'
import type {
  IAccountRepositoryContract,
  ICreateAccount,
} from '../../contracts/account-repository-contract'

export class InMemoryAccountRepository implements IAccountRepositoryContract {
  private items: Account[] = []

  public async findByUserId(userId: string): Promise<Account | null> {
    const account = this.items.find(item => item.userId === userId)

    if (!account) {
      return null
    }

    return account
  }

  public async create({ userId, provider, providerAccountId }: ICreateAccount): Promise<Account> {
    const newAccount: Account = {
      id: randomUUID(),
      userId,
      provider,
      providerAccountId,
    }

    this.items.push(newAccount)

    return newAccount
  }

  public getItems(): Account[] {
    return this.items
  }

  public setItems(items: Account[]) {
    this.items = items
  }
}

