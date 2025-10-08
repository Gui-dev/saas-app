import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeCreateUser } from '../../factories/make-create-user'

export const createAccount = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create a new account',
        tags: ['Users'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        201: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body
      const { id } = await makeCreateUser({ name, email, password })

      return reply.status(201).send({
        userId: id,
      })
    }
  )
}
