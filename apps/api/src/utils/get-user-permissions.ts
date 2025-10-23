import { defineAbilityFor, userSchema } from '@saas/auth'

export interface IGetUserPermissionsRequest {
  userId: string
  role: string
}

export const getUserPermissions = ({
  userId,
  role,
}: IGetUserPermissionsRequest) => {
  const authUser = userSchema.parse({
    id: userId,
    role: role,
  })
  const ability = defineAbilityFor(authUser)
  return ability
}
