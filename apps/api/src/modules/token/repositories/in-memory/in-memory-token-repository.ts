import { Token } from '@/generated/prisma'
import {
  ITokenRepositoryContract,
  ICreateToken,
} from '../../contracts/token-repository-contract'
import { randomUUID } from 'crypto'

export class InMemoryTokenRepository implements ITokenRepositoryContract {
  private items: Token[] = []

  public async findById(tokenId: string): Promise<Token | null> {
    const token = this.items.find(item => item.id === tokenId)

    if (!token) {
      return null
    }

    return token
  }

  public async create({ type, userId }: ICreateToken): Promise<Token> {
    const newToken: Token = {
      id: randomUUID(),
      userId,
      type,
      createdAt: new Date(),
    }

    this.items.push(newToken)

    return newToken
  }

  public getItems(): Token[] {
    return this.items
  }

  public setItems(items: Token[]) {
    this.items = items
  }
}
