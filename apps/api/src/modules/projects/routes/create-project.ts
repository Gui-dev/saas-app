import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { makeCreateProject } from '../factories/make-create-project'

export const createProject = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          summary: 'Create an new project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { name, description } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError('You are not allowed to create a project')
        }

        const { projectId } = await makeCreateProject({
          userId,
          organizationId: organization.id,
          name,
          description,
        })

        return reply.status(201).send({ projectId })
      }
    )
}
