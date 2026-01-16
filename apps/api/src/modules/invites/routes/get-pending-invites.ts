import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { makeGetPendingInvites } from '../factories/make-get-pending-invites'

export const getPendingInvites = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          summary: 'Get pending invites',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  email: z.string().email(),
                  role: z.string(),
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                  organization: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  }),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { invites } = await makeGetPendingInvites({ userId })

        return reply.status(201).send({ invites })
      }
    )
}
