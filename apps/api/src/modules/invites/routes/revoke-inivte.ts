import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { makeRevokeInvite } from '../factories/make-revoke-invite'

export const revokeInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          summary: 'Revoke an invite',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('delete', 'Invite')) {
          throw new UnauthorizedError('You are not allowed to delete an invite')
        }

        await makeRevokeInvite({ inviteId })

        return reply.status(204).send()
      }
    )
}
