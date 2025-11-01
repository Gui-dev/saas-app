import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'
import { makeGetInvite } from '../factories/make-get-invite'
import { rolesSchema } from '@saas/auth'

export const getInvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        summary: 'Get invite details',
        tags: ['Invites'],
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            invite: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              role: rolesSchema,
              createdAt: z.date(),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z
                    .string()
                    .url({ error: 'Invalid URL' })
                    .nullable(),
                })
                .nullable(),
              organization: z.object({
                id: z.string().uuid(),
                name: z.string(),
              }),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params

      const { invite } = await makeGetInvite({ inviteId })

      return reply.status(201).send({ invite })
    }
  )
}
