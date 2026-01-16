import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeUpdateOrganization } from '../factories/make-update-organization'

export const updateOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          summary: 'Update organization',
          tags: ['Organizations'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().optional(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, repply) => {
        const { slug } = request.params
        const { name, domain, shouldAttachUsersByDomain } = request.body
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

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'Unauthorized, you are not allowed to update this organization'
          )
        }

        await makeUpdateOrganization({
          domain,
          organizationId: organization.id,
          name,
          shouldAttachUsersByDomain,
        })

        return repply.status(204).send()
      }
    )
}
