import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { makeAcceptInvite } from '../factories/make-accept-invite'

export const acceptInvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          summary: 'Accept an invite',
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

        await makeAcceptInvite({
          inviteId,
          userId,
        })

        return reply.status(204).send()
      }
    )
}
