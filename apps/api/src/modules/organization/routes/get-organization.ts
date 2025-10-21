import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOrganization = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug',
    {
      schema: {
        summary: 'Get details from organization',
        tags: ['Organizations'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            organization: z.object({
              id: z.string().uuid(),
              ownerId: z.string().uuid(),
              name: z.string(),
              slug: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean(),
              avatarUrl: z.string().url().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { organization } = await request.getUserMembership(slug)

      return reply.status(200).send({
        organization,
      })
    }
  )
}
