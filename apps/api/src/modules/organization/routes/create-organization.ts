import { auth } from '@/http/middlewares/auth'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'
import { makeCreateOrganization } from '../factories/make-create-organization'

export const createOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          summary: 'Create an new organization',
          tags: ['Organizations'],
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().optional(),
            shouldAttchUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttchUsersByDomain } = request.body

        const { organizationId } = await makeCreateOrganization({
          ownerId: userId,
          name,
          domain,
          shouldAttachUsersByDomain: shouldAttchUsersByDomain ?? false,
        })

        return reply.status(201).send({ organizationId })
      }
    )
}
