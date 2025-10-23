import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetOrganizations } from '../factories/make-get-organizations'
import { rolesSchema } from '@saas/auth'
import { auth } from '@/http/middlewares/auth'

export const getOrganizations = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          summary: 'Get all organizations',
          tags: ['Organizations'],
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: rolesSchema,
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organizations } = await makeGetOrganizations({ userId })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0].role,
            }
          }
        )

        return reply.status(200).send({
          organizations: organizationsWithUserRole,
        })
      }
    )
}
