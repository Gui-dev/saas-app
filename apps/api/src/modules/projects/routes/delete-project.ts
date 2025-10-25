import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { projectSchema } from '@saas/auth'
import { makeGetProjectByIdAndOrganizationId } from '../factories/make-get-project-by-id-and-organization-id'
import { makeDeleteProject } from '../factories/make-delete-project'

export const deleteProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          summary: 'Delete a project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { project } = await makeGetProjectByIdAndOrganizationId({
          projectId,
          organizationId: organization.id,
        })

        const { cannot } = getUserPermissions({ userId, role: membership.role })
        const authProject = projectSchema.parse(project)

        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to delete this project'
          )
        }

        await makeDeleteProject({ projectId, ownerId: userId })

        return reply.status(204).send()
      }
    )
}
