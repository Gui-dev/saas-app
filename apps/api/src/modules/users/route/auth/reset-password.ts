import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeResetPassword } from '../../factories/make-reset-password'

export const resetPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        summary: 'Request password recover',
        tags: ['Users'],
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      await makeResetPassword({ code, password })

      return reply.status(204).send()
    }
  )
}
