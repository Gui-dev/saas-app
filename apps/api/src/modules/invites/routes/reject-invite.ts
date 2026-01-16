import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { makeRejectInvite } from '../factories/make-reject-invite'

export const rejectInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/invites/:inviteId/reject',
      {
        schema: {
          summary: 'Reject an invite',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const userId = await request.getCurrentUserId()

        await makeRejectInvite({
          inviteId,
          userId,
        })

        return reply.status(204).send()
      }
    )
}
