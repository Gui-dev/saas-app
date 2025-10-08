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

app.register(fastifyJWT, {
  secret: 'secret',
})
app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Saas app',
      description: 'Saas app API with multi-tenant and RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(createAccount)
app.register(authenticateWithPassword)

export { app }
