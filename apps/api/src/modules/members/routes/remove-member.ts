import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeRemoveMember } from '../factories/make-remove-member'

export const removeMember = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          summary: 'Remove a member from an organization',
          tags: ['Members'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to remove this member'
          )
        }

        await makeRemoveMember({
          memberId,
          organizationId: organization.id,
        })

        return reply.status(204).send()
      }
    )
}
