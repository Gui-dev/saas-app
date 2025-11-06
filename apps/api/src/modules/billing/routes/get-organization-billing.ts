import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetOrganizationBilling } from '../factories/make-get-organization-billing'

export const getOrganizationBilling = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          summary: 'Get billing information for an organization',
          tags: ['Billing'],
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({
          userId,
          role: membership.role,
        })

        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError(
            'You are not allowed to get billing information for this organization'
          )
        }

        const { billing } = await makeGetOrganizationBilling({
          organizationId: organization.id,
        })

        return reply.status(200).send({
          billing,
        })
      }
    )
}
