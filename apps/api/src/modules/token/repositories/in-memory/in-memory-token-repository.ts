import { randomUUID } from 'node:crypto'
import type { Token } from '@/generated/prisma'
import type {
  ICreateToken,
  ITokenRepositoryContract,
} from '../../contracts/token-repository-contract'

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

  public async delete(tokenId: string): Promise<void> {
    const tokenIndex = this.items.findIndex(item => item.id === tokenId)

    if (tokenIndex !== -1) {
      this.items.splice(tokenIndex, 1)
    }
  }

  public getItems(): Token[] {
    return this.items
  }

  public setItems(items: Token[]) {
    this.items = items
  }
}
