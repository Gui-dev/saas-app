import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { FastifyInstance } from 'fastify/types/instance'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { rolesSchema } from '@saas/auth'
import { makeUpdateByMemberId } from '../factories/make-update-by-member-id'

export const updateMember = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          summary: 'Update a member',
          tags: ['Members'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: rolesSchema,
          }),
          response: {
            200: z.object({
              memberId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const { role } = request.body
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({ userId, role: membership.role })

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to update this member'
          )
        }

        const member = await makeUpdateByMemberId({
          memberId,
          organizationId: organization.id,
          role,
        })

        return reply.status(200).send({ memberId: member.memberId })
      }
    )
}
