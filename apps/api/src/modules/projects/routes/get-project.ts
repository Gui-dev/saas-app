import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeGetProjectBySlugAndOrganizationId } from '../factories/make-get-project-by-slug-and-organization-id'

export const getProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects/:projectSlug',
      {
        schema: {
          summary: 'Get project details',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            201: z.object({
              project: z.object({
                id: z.string().uuid(),
                ownerId: z.string().uuid(),
                organizationId: z.string().uuid(),
                name: z.string(),
                description: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError('You are not allowed to get this project')
        }

        const { project } = await makeGetProjectBySlugAndOrganizationId({
          projectSlug,
          organizationId: organization.id,
        })

        return reply.status(201).send({ project })
      }
    )
}
