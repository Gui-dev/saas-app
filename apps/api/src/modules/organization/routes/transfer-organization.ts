import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { makeTransferOrganization } from '../factories/make-transfer-organization'

export const transferOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          summary: 'Transfer organization ownership',
          tags: ['Organizations'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, repply) => {
        const { slug } = request.params
        const { transferToUserId } = request.body
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

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            'Unauthorized, you are not allowed to update this organization'
          )
        }

        await makeTransferOrganization({
          organizationId: organization.id,
          transferToUserId,
        })

        return repply.status(204).send()
      }
    )
}
