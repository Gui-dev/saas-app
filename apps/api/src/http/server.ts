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
import { updateOrganization } from '@/modules/organization/routes/update-organization'
import { shutdownOrganization } from '@/modules/organization/routes/shutdown-organization'
import { transferOrganization } from '@/modules/organization/routes/transfer-organization'
import { createProject } from '@/modules/projects/routes/create-project'
import { deleteProject } from '@/modules/projects/routes/delete-project'
import { getProject } from '@/modules/projects/routes/get-project'
import { getProjects } from '@/modules/projects/routes/get-projects'
import { updateProject } from '@/modules/projects/routes/update-project'
import { getMembers } from '@/modules/members/routes/get-members'
import { updateMember } from '@/modules/members/routes/update-member'
import { removeMember } from '@/modules/members/routes/remove-member'
import { createInvite } from '@/modules/invites/routes/create-invite'

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
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)

export { app }
