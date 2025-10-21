import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyJWT from '@fastify/jwt'

import { createAccount } from '@/modules/users/route/auth/create-account'
import { authenticateWithPassword } from '@/modules/users/route/auth/authenticate-with-password'
import { getProfile } from '@/modules/users/route/auth/get-profile'
import { errorHandler } from './error-handler'
import { requestPasswordRecover } from '@/modules/users/route/auth/request-password-recover'
import { resetPassword } from '@/modules/users/route/auth/reset-password'
import { authenticateWithGithub } from '@/modules/users/route/auth/authenticate-with-github'
import { env } from '@saas/env'
import { createOrganization } from '@/modules/organization/routes/create-organization'
import { getMembership } from '@/modules/organization/routes/get-membership'
import { getOrganization } from '@/modules/organization/routes/get-organization'
import { getOrganizations } from '@/modules/organization/routes/get-organizations'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)
app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
})
app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Saas app',
      description: 'Saas app API with multi-tenant and RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)

export { app }
