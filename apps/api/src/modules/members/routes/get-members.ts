import { rolesSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify/types/instance'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeGetMembers } from '../factories/make-get-members'

export const getMembers = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          summary: 'Get all organization members',
          tags: ['Members'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: rolesSchema,
                  name: z.string().nullable(),
                  email: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to see organization members'
          )
        }

        const { members } = await makeGetMembers({
          organizationId: organization.id,
        })
        const memberWithRole = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              userId,
              ...user,
              ...member,
            }
          }
        )

        return reply.status(201).send({ members: memberWithRole })
      }
    )
}
