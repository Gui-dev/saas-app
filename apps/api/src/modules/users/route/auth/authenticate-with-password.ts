import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeAuthenticateWithPassword } from '../../factories/make-authenticate-with-password'

export const authenticateWithPassword = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        summary: 'Authenticate with email and password',
        tags: ['Users'],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        200: z.object({
          token: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user } = await makeAuthenticateWithPassword({ email, password })
      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )

      return reply.status(200).send({ token })
    }
  )
}
