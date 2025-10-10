import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeRequestPasswordRecover } from '../../factories/make-request-password-recover'

export const requestPasswordRecover = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        summary: 'Request password recover',
        tags: ['Users'],
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const { token } = await makeRequestPasswordRecover(email)

      if (!token) {
        return reply.status(201).send()
      }

      console.log('RECOVER TOKEN: ', token.tokenId)

      return reply.status(201).send()
    }
  )
}
