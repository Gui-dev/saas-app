'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { getCurrentOrganization } from '@/auth/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'
import { organizationSchema } from './organization-schema'

export const createOrganizationAction = async (data: FormData) => {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data
  try {
    await createOrganization({
      name,
      domain: String(domain),
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations', 'max')
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message:
        'Ocorreu um erro ao tentar criar uma organização, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Organização criada com sucesso',
    errors: null,
  }
}

export const updateOrganizationAction = async (data: FormData) => {
  const currentOrg = await getCurrentOrganization()
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data
  try {
    await updateOrganization({
      org: currentOrg!,
      name,
      domain: String(domain),
      shouldAttachUsersByDomain,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message:
        'Ocorreu um erro ao tentar criar uma organização, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Organização criada com sucesso',
    errors: null,
  }
}
