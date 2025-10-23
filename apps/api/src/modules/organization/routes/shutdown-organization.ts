import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema } from '@saas/auth'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { makeShutdownOrganization } from '../factories/make-shutdown-organization'

export const shutdownOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          summary: 'Shutdown an organization',
          tags: ['Organizations'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.ownerId,
        })

        const { cannot } = getUserPermissions({
          userId,
          role: membership.role,
        })

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'Unauthorized, you are not allowed to shutdown this organization'
          )
        }

        await makeShutdownOrganization({
          organizationId: organization.id,
        })

        return reply.status(204).send()
      }
    )
}
