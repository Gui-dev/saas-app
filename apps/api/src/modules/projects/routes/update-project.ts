import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeGetProjectByIdAndOrganizationId } from '../factories/make-get-project-by-id-and-organization-id'
import { makeUpdateProject } from '../factories/make-update-project'

export const updateProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          summary: 'Update a project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            200: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const { name, description } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { project } = await makeGetProjectByIdAndOrganizationId({
          projectId,
          organizationId: organization.id,
        })

        const { cannot } = getUserPermissions({ userId, role: membership.role })
        const authProject = projectSchema.parse(project)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to update this project'
          )
        }

        const response = await makeUpdateProject({
          userId,
          projectId,
          name,
          description,
        })

        return reply.status(200).send({ projectId: response.projectId })
      }
    )
}
