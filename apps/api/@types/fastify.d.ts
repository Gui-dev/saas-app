import { Member, Organization } from '@/generated/prisma'
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId: () => Promise<string>
    getUserMembership: (
      slug
    ) => Promise<{ organization: Organization; membership: Member }>
  }
}
