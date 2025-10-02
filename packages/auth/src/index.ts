import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type ForcedSubject,
  type MongoAbility,
} from '@casl/ability'

const actions = ['manage', 'invite', 'delete'] as const
const subjects = ['User', 'all'] as const

type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
]

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility =
  // @ts-ignore
  createMongoAbility as CreateAbility<AppAbilities>
// @ts-ignore
const { build, can, cannot } = new AbilityBuilder(createAppAbility)

can('invite', 'User')
cannot('delete', 'User')

export const ability = build()
